# Power BI Desktop Bridge handoff — 2026-08-31

The Power BI Desktop Bridge is an official preview route for external tooling
to inspect a running Desktop instance, reload PBIP/PBIR changes and capture
page screenshots. It is useful for the last-mile visual evidence in this
project, but it does not replace Desktop's native Save As, data refresh or
finance QA sign-off.

Official references:

- [Desktop Bridge overview](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-desktop-bridge-overview)
- [External PBIP editing and Bridge reload](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-external-editing)
- [Bridge CLI package](https://www.npmjs.com/package/@microsoft/powerbi-desktop-bridge-cli)

## Prerequisites

1. Install the August 2026 or later Power BI Desktop build.
2. In Desktop, enable **Enable external tool access to Power BI Desktop
   through secure local APIs** under Preview features.
3. Install the CLI on the execution host:

   ```powershell
   npm install -g @microsoft/powerbi-desktop-bridge-cli
   ```

4. If Desktop is installed outside the default folders, set
   `PBI_DESKTOP_PATH` to the exact `PBIDesktop.exe` path.

## Evidence sequence

Run from the repository root:

```powershell
$env:PBI_DESKTOP_PATH = 'D:\Po BI\bin\PBIDesktop.exe'
powerbi-desktop open powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip
powerbi-desktop status
powerbi-desktop manifest --pid <connected-desktop-pid>
powerbi-desktop screenshot-all --pid <connected-desktop-pid> --output-dir <evidence-folder> --scale 2
```

The `status` result must identify the intended report path and expose the PBIR
pages. `manifest` must list the supported methods before any operation is
attempted. Capture the screenshot files as visual evidence only after the host
reports it is ready.

## What the Bridge proves

| Evidence | Claim allowed |
|---|---|
| `open` returns a connected bridge | Desktop process/bridge was discovered |
| `status` returns current file path and PBIR pages | Intended PBIP/PBIR is open |
| `screenshot` or `screenshot-all` returns PNGs | Report pages rendered on that Desktop host |
| `file.reload` returns success after a saved PBIP edit | External PBIP definition was reloaded |

The Bridge does not expose a native PBIX Save As operation, does not make CSV
Import mode realtime, and does not by itself prove data refresh, DAX tie-outs,
or QA-01–QA-18. Those remain explicit Desktop/service gates in
`POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md`.

## Observed host attempt

The custom executable path was accepted and the Bridge manifest was returned.
Repeated `status` calls then returned `BRIDGE_ERROR / Host is not ready to
accept operations` while Desktop was still starting. Therefore this attempt
is recorded as **BRIDGE_DISCOVERED_HOST_NOT_READY**, not as native render or
PBIX evidence. Retry from an unlocked interactive Windows session and retain
the `status`/screenshot outputs before promoting the native gate.

