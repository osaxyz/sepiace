<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg" width="128" alt="sepiace">
</picture>

# create-sepiace

Connect [sepiace](https://sepiace.io), long-term memory for AI agents, to the clients on your machine.

> **Tip:** Run it again at any time. Clients that are already connected are left as they are.

## Quick start

```sh
npm create sepiace
```

It finds Claude Code, Codex, Cursor, VS Code, and OpenCode on your machine, asks which ones should use sepiace, connects them, and walks you through signing in. Then it shows how to move the memories your agent already has into sepiace.

## Technology

<details>
<summary>Your settings stay as they were</summary>
<br>

It edits each client's config as JSON with comments, so your comments, key order, and other servers are kept. Each file is written in one step, so a failed run never leaves it half-written, and a file it cannot read is left untouched. If a server called sepiace already exists with a different address, it asks before replacing it, and hides any key in the old address when it shows it to you.

</details>

<details>
<summary>The same guidance in every client</summary>
<br>

Claude Code and Codex get the sepiace plugin. Cursor, VS Code, and OpenCode have no plugins, so it places the same skills in each client's own skill folder, named `sepiace-memory`, `sepiace-migrate`, and `sepiace-update` so they do not clash with yours.

</details>

## Specification

<details>
<summary>What it changes for each client</summary>
<br>

| Client | What it does |
| --- | --- |
| Claude Code | Installs the sepiace plugin from [osaxyz/sepiace](https://github.com/osaxyz/sepiace) |
| Codex | Installs the sepiace plugin from [osaxyz/sepiace](https://github.com/osaxyz/sepiace) |
| Cursor | Adds sepiace to `~/.cursor/mcp.json` and the skills to `~/.cursor/skills` |
| VS Code | Adds sepiace to the user `mcp.json` and the skills to `~/.copilot/skills` |
| OpenCode | Adds sepiace to `~/.config/opencode/opencode.json` and the skills to `~/.config/opencode/skills` |
| Claude Desktop and claude.ai | Shows how to add sepiace as a custom connector |

</details>

<details>
<summary>Options</summary>
<br>

Pass options after `--`, for example `npm create sepiace -- --client cursor,opencode`.

| Option | What it does |
| --- | --- |
| `--client <ids>` | Comma-separated: `claude-code`, `codex`, `cursor`, `vscode`, `opencode`, `claude-desktop` |
| `-y`, `--yes` | Does not ask. Connects the clients found on this machine, keeps existing entries, and skips signing in |
| `-v`, `--version` | Shows the version |
| `-h`, `--help` | Shows the help |

</details>
