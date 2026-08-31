#!/usr/bin/env python3
"""Build the extended Power BI template from the verified PBIT container.

The repository's PBIP generator is the source of truth for tables, measures,
relationships and visual definitions.  This small packager keeps the known
good PBIT container/header/resources and replaces only its JSON model/layout;
it therefore produces a real Power BI template without pretending a ZIP is a
native PBIX binary.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import zipfile
from pathlib import Path


def load_builder(path: Path):
    spec = importlib.util.spec_from_file_location("powerbi_builder", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load builder: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def column_obj(name: str, data_type: str, extras: dict) -> dict:
    obj = {
        "name": name,
        "dataType": data_type,
        "sourceColumn": name,
        "summarizeBy": extras.get("summarizeBy", "none"),
        "annotations": [{"name": "SummarizationSetBy", "value": "User"}],
    }
    if extras.get("isKey"):
        obj["isKey"] = True
    if extras.get("formatString"):
        obj["formatString"] = extras["formatString"]
    if extras.get("sortByColumn"):
        obj["sortByColumn"] = extras["sortByColumn"]
    return obj


def table_obj(builder, name: str, spec: dict) -> dict:
    partition = {
        "name": name,
        "mode": "import",
        "source": {
            "type": "m",
            "expression": builder.calendar_query() if name == "Calendar" else builder.csv_query(spec["file"], spec["columns"]),
        },
    }
    result = {
        "name": name,
        "partitions": [partition],
        "columns": [column_obj(col, data_type, extras) for col, data_type, extras in spec["columns"]],
    }
    if spec.get("data_category"):
        result["dataCategory"] = spec["data_category"]
    return result


def measure_objs(builder) -> list[dict]:
    # Final builders may attach a display-folder as a fourth tuple element;
    # the PBIT container only needs the first three fields.
    return [
        {"name": item[0], "formatString": item[2], "expression": item[1] + "\n", **({"displayFolder": item[3]} if len(item) > 3 else {})}
        for item in builder.MEASURES
    ]


def pbit_layout(builder, theme_name: str) -> dict:
    config = {
        "version": "5.9",
        "themeCollection": {"baseTheme": {"name": theme_name, "version": "5.10", "type": 2}},
        "activeSectionIndex": 0,
        "defaultDrillFilterOtherVisuals": True,
        "settings": {"useNewFilterPaneExperience": True},
    }
    sections = []
    for page in builder.build_pages():
        sections.append({
            "displayName": page["displayName"],
            "displayOption": 1,
            "height": page["height"],
            "name": page["name"],
            "ordinal": page["ordinal"],
            "width": page["width"],
            "config": "{}",
            "filters": "[]",
            "visualContainers": [
                {
                    "height": cfg["layouts"][0]["position"]["height"],
                    "width": cfg["layouts"][0]["position"]["width"],
                    "x": cfg["layouts"][0]["position"]["x"],
                    "y": cfg["layouts"][0]["position"]["y"],
                    "z": cfg["layouts"][0]["position"]["z"],
                    "config": json.dumps(cfg, separators=(",", ":")),
                    "filters": "[]",
                }
                for cfg in page["visuals"]
            ],
        })
    return {
        "id": 0,
        "layoutOptimization": 0,
        "resourcePackages": [{"resourcePackage": {"disabled": False, "name": "SharedResources", "type": 2, "items": [{"name": theme_name, "path": f"BaseThemes/{theme_name}.json", "type": 202}]}}],
        "config": json.dumps(config, separators=(",", ":")),
        "sections": sections,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", type=Path, default=Path("powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit"))
    parser.add_argument("--builder", type=Path, default=Path("scripts/build_powerbi_refreshable_project.py"))
    parser.add_argument("--pbixproj", type=Path, default=Path("powerbi/native/VNFinance_PbixProj_Extended"))
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    builder = load_builder(args.builder)
    with zipfile.ZipFile(args.base, "r") as source:
        model = json.loads(source.read("DataModelSchema"))
        model_root = model["model"]
        # Replace the template's legacy fixture schema wholesale.  Keeping an
        # old ``Sales`` table and merely adding new tables would leave stale
        # columns (and make the explicit final_v1 measures invalid).  The
        # template is used only as a known-good Desktop container/header;
        # final_v1 owns the complete semantic model.
        model_root["tables"] = [table_obj(builder, table_name, spec) for table_name, spec in builder.TABLES.items()]
        sales = next(table for table in model_root["tables"] if table["name"] == "Sales")
        sales["measures"] = measure_objs(builder)
        model_root["relationships"] = [
            {"name": name, "fromTable": from_table, "fromColumn": from_col, "toTable": to_table, "toColumn": to_col}
            for name, from_table, from_col, to_table, to_col in builder.RELATIONSHIPS
        ]
        model_root["annotations"] = [
            item for item in model_root.get("annotations", []) if item.get("name") != "PBI_QueryOrder"
        ] + [{"name": "PBI_QueryOrder", "value": json.dumps(["DataRoot", *builder.TABLES.keys()], separators=(",", ":"))}]

        theme_name = "CY19SU12"
        layout = pbit_layout(builder, theme_name)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        diagram = json.loads((args.pbixproj / "DiagramLayout.json").read_text(encoding="utf-8"))
        # PBIT JSON parts are UTF-16LE (without a BOM) in the Desktop-created
        # container.  Keeping that encoding is required; a valid UTF-8 JSON
        # document is still rejected by Desktop as an invalid report file.
        replacements = {
            "DataModelSchema": json.dumps(model, indent=2, ensure_ascii=False).encode("utf-16le"),
            "Report/Layout": json.dumps(layout, separators=(",", ":"), ensure_ascii=False).encode("utf-16le"),
            "DiagramLayout": json.dumps(diagram, separators=(",", ":"), ensure_ascii=False).encode("utf-16le"),
        }
        # Preserve the original entry order and compression metadata. Desktop
        # is tolerant of ordinary ZIP order, but keeping the native container
        # topology makes the output maximally conservative.
        with zipfile.ZipFile(args.output, "w", compression=zipfile.ZIP_DEFLATED) as target:
            for info in source.infolist():
                target.writestr(info, replacements.get(info.filename, source.read(info.filename)))

    print(json.dumps({
        "status": "PASS",
        "output": str(args.output),
        "tables": len(builder.TABLES),
        "measures": len(builder.MEASURES),
        "relationships": len(builder.RELATIONSHIPS),
        "pages": len(builder.build_pages()),
        "visuals": sum(len(page["visuals"]) for page in builder.build_pages()),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
