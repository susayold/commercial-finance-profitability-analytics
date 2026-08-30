{
  "status": "PASS",
  "started_at_utc": "2026-08-30T18:28:30.835511+00:00",
  "completed_at_utc": "2026-08-30T18:28:33.494502+00:00",
  "repo_root": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831",
  "input_dir": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current",
  "data_root": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current",
  "stages": {
    "input_contract": {
      "status": "PASS",
      "exit_code": 0,
      "details": {
        "status": "PASS",
        "checks": 78,
        "passed": 78,
        "failed": [],
        "row_counts": {
          "Product": 36,
          "Customer": 24,
          "Channel": 5,
          "Sales": 6480,
          "Commercial_Costs": 6480,
          "Inventory": 2592,
          "Receivables": 864,
          "Payables": 144,
          "Debt": 72,
          "Budget": 6480,
          "Forecast": 6480,
          "Marketing": 180,
          "Promotions": 1,
          "Source_Control": 5
        }
      }
    },
    "refresh_dry_run": {
      "status": "PASS",
      "exit_code": 0,
      "details": {
        "status": "PASS",
        "mode": "finance_refresh_orchestrator",
        "started_at_utc": "2026-08-30T18:28:31.457618+00:00",
        "input_dir": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current",
        "data_root": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current",
        "stages": {
          "import": {
            "requested": true,
            "apply": false,
            "exit_code": 0,
            "result": {
              "status": "PASS",
              "applied": false,
              "source_dir": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current",
              "data_root": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current",
              "validated_at_utc": "2026-08-30T18:28:32.158657+00:00",
              "validator": {
                "status": "PASS",
                "checks": 78,
                "passed": 78,
                "failed": [],
                "row_counts": {
                  "Product": 36,
                  "Customer": 24,
                  "Channel": 5,
                  "Sales": 6480,
                  "Commercial_Costs": 6480,
                  "Inventory": 2592,
                  "Receivables": 864,
                  "Payables": 144,
                  "Debt": 72,
                  "Budget": 6480,
                  "Forecast": 6480,
                  "Marketing": 180,
                  "Promotions": 1,
                  "Source_Control": 5
                }
              },
              "files": {
                "sales_fact.csv": {
                  "source_sha256": "91dfed028b1dd0833861e02108acd6ed5258e0a891ec259cbc49aa111f3b4ce9",
                  "source_rows": 6480,
                  "target_sha256_before": "91dfed028b1dd0833861e02108acd6ed5258e0a891ec259cbc49aa111f3b4ce9",
                  "target_rows_before": 6480
                },
                "commercial_costs.csv": {
                  "source_sha256": "525d297dd768a51a59d4f497b01fea93b09a9dd2a252e354d521a3f3c2d2f223",
                  "source_rows": 6480,
                  "target_sha256_before": "525d297dd768a51a59d4f497b01fea93b09a9dd2a252e354d521a3f3c2d2f223",
                  "target_rows_before": 6480
                },
                "inventory.csv": {
                  "source_sha256": "596bc96f73fe35c7a11ebd3defab0b1648540ef101bdfa53199d6ba0608b3c57",
                  "source_rows": 2592,
                  "target_sha256_before": "596bc96f73fe35c7a11ebd3defab0b1648540ef101bdfa53199d6ba0608b3c57",
                  "target_rows_before": 2592
                },
                "receivables.csv": {
                  "source_sha256": "f7131fd2187dc3f947056113e3b42394ae418077ee7dc9c2b2dcb4e2ad05fb26",
                  "source_rows": 864,
                  "target_sha256_before": "f7131fd2187dc3f947056113e3b42394ae418077ee7dc9c2b2dcb4e2ad05fb26",
                  "target_rows_before": 864
                },
                "payables.csv": {
                  "source_sha256": "0ed17e3f79d11f9679c9d03f9886334ea999f31876bc2b9aa721571a3db46bb5",
                  "source_rows": 144,
                  "target_sha256_before": "0ed17e3f79d11f9679c9d03f9886334ea999f31876bc2b9aa721571a3db46bb5",
                  "target_rows_before": 144
                },
                "debt.csv": {
                  "source_sha256": "776c5cfcbd6e341f6afb205d5d885a20329650f63c6fe468d61f4b37566afa3c",
                  "source_rows": 72,
                  "target_sha256_before": "776c5cfcbd6e341f6afb205d5d885a20329650f63c6fe468d61f4b37566afa3c",
                  "target_rows_before": 72
                },
                "budget.csv": {
                  "source_sha256": "ec9412048de0aa3fd2e57c80f2b370e1fd91b243357cb909cc7059e49425070b",
                  "source_rows": 6480,
                  "target_sha256_before": "ec9412048de0aa3fd2e57c80f2b370e1fd91b243357cb909cc7059e49425070b",
                  "target_rows_before": 6480
                },
                "forecast.csv": {
                  "source_sha256": "606d90e1898e5dda7ff33d814d0f136f132fe524c6511b7f9255e4a4d7b6981f",
                  "source_rows": 6480,
                  "target_sha256_before": "606d90e1898e5dda7ff33d814d0f136f132fe524c6511b7f9255e4a4d7b6981f",
                  "target_rows_before": 6480
                },
                "marketing_spend.csv": {
                  "source_sha256": "15a5698504f2496756b95ee70b230f7ce2fc1fb3fa311a04bfa98da217dfb736",
                  "source_rows": 180,
                  "target_sha256_before": "15a5698504f2496756b95ee70b230f7ce2fc1fb3fa311a04bfa98da217dfb736",
                  "target_rows_before": 180
                },
                "promotions.csv": {
                  "source_sha256": "00a1498cfea6b67a0ee889e5ba021c948e153cd57e2e48ef21183fb76ffaed10",
                  "source_rows": 1,
                  "target_sha256_before": "00a1498cfea6b67a0ee889e5ba021c948e153cd57e2e48ef21183fb76ffaed10",
                  "target_rows_before": 1
                },
                "product_master.csv": {
                  "source_sha256": "57225e1ebe43cd71b88a60f0c1937c9e1cde8ec51df3cf42d4fd666ca3788d39",
                  "source_rows": 36,
                  "target_sha256_before": "57225e1ebe43cd71b88a60f0c1937c9e1cde8ec51df3cf42d4fd666ca3788d39",
                  "target_rows_before": 36
                },
                "customer_master.csv": {
                  "source_sha256": "c1e30396f92c69e5e8d42082646b7bb124d1ffbb55e7bba714b0eb0a60f5199b",
                  "source_rows": 24,
                  "target_sha256_before": "c1e30396f92c69e5e8d42082646b7bb124d1ffbb55e7bba714b0eb0a60f5199b",
                  "target_rows_before": 24
                },
                "channel_master.csv": {
                  "source_sha256": "2d9846cfe8c9fcc0ca7d0fc2ac61d00e404d6f58ec31b3a1be58cc8669cb95a9",
                  "source_rows": 5,
                  "target_sha256_before": "2d9846cfe8c9fcc0ca7d0fc2ac61d00e404d6f58ec31b3a1be58cc8669cb95a9",
                  "target_rows_before": 5
                },
                "source_control.csv": {
                  "source_sha256": "f659e15866e9d458264916f48b0ba7d90717cbf31507a3f30b9127ffd7f8d3c9",
                  "source_rows": 5,
                  "target_sha256_before": "f659e15866e9d458264916f48b0ba7d90717cbf31507a3f30b9127ffd7f8d3c9",
                  "target_rows_before": 5
                }
              },
              "next_step": "Re-run with --apply, then refresh the report in Power BI Desktop"
            }
          },
          "directquery": {
            "requested": false,
            "status": "NOT_REQUESTED",
            "claim_boundary": "Provide --directquery-apply only for a real configured SQL Server-compatible source."
          },
          "service": {
            "requested": false,
            "status": "NOT_REQUESTED",
            "claim_boundary": "Provide --service-apply only for a published Import dataset with runtime credentials."
          }
        },
        "claim_boundary": "Import refresh is automated; DirectQuery/APR and native PBIX evidence remain separate gates.",
        "completed_at_utc": "2026-08-30T18:28:32.168971+00:00"
      }
    },
    "package": {
      "status": "PASS",
      "exit_code": 0,
      "details": {
        "status": "PASS",
        "checks": 29,
        "failed": [],
        "metrics": {
          "pbit_tables": 15,
          "pbit_measures": 37,
          "pbit_relationships": 23,
          "pbit_pages": 6,
          "pbit_visuals": 39,
          "pbip_tables": 15,
          "pbip_measures": 37,
          "pbip_relationships": 23,
          "refresh_rows": 6480,
          "refresh_columns": 22,
          "refresh_delta_vnd": "1000000",
          "refresh_referenced_csv": 14,
          "pbit_bytes": 11809
        }
      }
    },
    "artifact_coherence": {
      "status": "PASS",
      "exit_code": 0,
      "details": {
        "status": "PASS",
        "checks": 15,
        "passed": 15,
        "failed": []
      }
    },
    "claim_boundary": {
      "status": "PASS",
      "exit_code": 0,
      "details": {
        "status": "PASS",
        "checks": 12,
        "passed": 12,
        "failed": [],
        "evidence": [
          {
            "name": "DirectQuery readiness JSON parses",
            "pass": true,
            "detail": ""
          },
          {
            "name": "PBIP source manifest parses",
            "pass": true,
            "detail": ""
          },
          {
            "name": "Current mode is explicitly Import replace-and-refresh",
            "pass": true,
            "detail": "Import_replace_and_refresh"
          },
          {
            "name": "Realtime claim is not promoted without external evidence",
            "pass": true,
            "detail": "PENDING"
          },
          {
            "name": "Manifest keeps native PBIX claim pending",
            "pass": true,
            "detail": "native_desktop_qa=PENDING; native_pbix_claimed=False"
          },
          {
            "name": "All CSV partitions remain Import mode",
            "pass": true,
            "detail": "15"
          },
          {
            "name": "All 14 CSV partitions use DataRoot",
            "pass": true,
            "detail": "14"
          },
          {
            "name": "Runbook disclaims CSV second-level realtime",
            "pass": true,
            "detail": ""
          },
          {
            "name": "Runbook defines Automatic Page Refresh migration",
            "pass": true,
            "detail": ""
          },
          {
            "name": "Release disclaims native PBIX",
            "pass": true,
            "detail": ""
          },
          {
            "name": "Native binary boundary note exists",
            "pass": true,
            "detail": ""
          },
          {
            "name": "Refresh architecture uses canonical marketing filename",
            "pass": true,
            "detail": "marketing_spend.csv present; marketing.csv alias absent"
          }
        ]
      }
    },
    "desktop_preflight": {
      "status": "PASS",
      "exit_code": 0,
      "details": {
        "status": "PASS",
        "project_root": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831",
        "desktop": "D:\\Po BI\\bin\\PBIDesktop.exe",
        "checks": 14,
        "passed": 14,
        "failed": 0,
        "details": [
          {
            "name": "PBIDesktop.exe",
            "pass": true,
            "detail": "D:\\Po BI\\bin\\PBIDesktop.exe (version 2.157.879.0 (26.08)+da30fe74eb0b8a8786ab7326b69c400a0e951831)"
          },
          {
            "name": "Artifact powerbi\\native\\VNFinance_PBIP\\VNFinance_Commercial_Finance.pbip",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact powerbi\\releases\\Commercial_Finance_Profitability_Analytics.pbit",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact powerbi\\native\\VNFinance_PbixProj\\.pbixproj.json",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact powerbi\\PBIP_SOURCE_MANIFEST.json",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact powerbi\\DIRECTQUERY_READINESS.json",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact powerbi\\directquery\\VNFinance_DirectQuery_Schema.sql",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact scripts\\validate_powerbi_input_contract.py",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "Artifact scripts\\validate_powerbi_refreshable_project.py",
            "pass": true,
            "detail": "present"
          },
          {
            "name": "DataRoot folder",
            "pass": true,
            "detail": "C:\\Users\\sangk\\Documents\\Codex\\2026-08-29\\toi\\work\\_pbi_doc_patch_20260831\\powerbi\\data\\current"
          },
          {
            "name": "DataRoot CSV count",
            "pass": true,
            "detail": "14 found; expected 14"
          },
          {
            "name": "DataRoot required filenames",
            "pass": true,
            "detail": "all 14 present"
          },
          {
            "name": "Python runtime",
            "pass": true,
            "detail": "C:\\Python314\\python.exe"
          },
          {
            "name": "Input contract validator",
            "pass": true,
            "detail": "exit code 0"
          }
        ]
      }
    }
  },
  "claim_boundary": "This command validates the refreshable package; it never proves native PBIX rendering or production DirectQuery/APR realtime."
}
