# sepiace

Connect [sepiace](https://www.sepiace.io), long-term memory for coding agents, to the clients on your machine.<br>
<sub>コーディングエージェントのための長期記憶 sepiace を、手元のクライアントにつなぎます。</sub>

```sh
npx sepiace
```

It finds the clients you have, asks which ones should use sepiace, and connects them. Then it shows how to sign in, and how to move the memories your agent already has into sepiace.

<details>
<summary>What it changes for each client</summary>
<br>

| Client | What it does |
| --- | --- |
| Claude Code | Installs the sepiace plugin from [osaxyz/sepiace](https://github.com/osaxyz/sepiace) |
| Codex | Installs the sepiace plugin from [osaxyz/sepiace](https://github.com/osaxyz/sepiace) |
| Cursor | Adds sepiace to `~/.cursor/mcp.json` and the sepiace skills to `~/.cursor/skills` |
| VS Code | Adds sepiace to the user `mcp.json` and the sepiace skills to `~/.copilot/skills` |
| OpenCode | Adds sepiace to `~/.config/opencode/opencode.json` and the sepiace skills to `~/.config/opencode/skills` |
| Claude Desktop and claude.ai | Shows how to add sepiace as a custom connector |

It keeps your comments and other servers, writes each file in one step so a failed run never leaves it half-written, and asks before replacing an existing entry called sepiace.

</details>

<details>
<summary>Options</summary>
<br>

| Option | What it does |
| --- | --- |
| `--client <ids>` | Comma-separated: `claude-code`, `codex`, `cursor`, `vscode`, `opencode`, `claude-desktop` |
| `-y`, `--yes` | Does not ask. Connects the clients found on this machine, keeps existing entries, and skips signing in |
| `-v`, `--version` | Shows the version |
| `-h`, `--help` | Shows the help |

</details>

<details>
<summary>日本語</summary>
<br>

`npx sepiace` を流すと、手元にあるクライアントを見つけ、どれに sepiace をつなぐかを尋ねてから、つなぎます。そのあと、ログインの手順と、エージェントがすでに覚えている記憶を sepiace に移す方法を案内します。

- Claude Code と Codex には、[osaxyz/sepiace](https://github.com/osaxyz/sepiace) のプラグインを入れます。
- Cursor、VS Code、OpenCode には、MCP の設定ファイルに sepiace を書き足し、sepiace のスキルを置きます。
- Claude Desktop と claude.ai には、カスタムコネクタとして足す手順を表示します。

設定ファイルのコメントやほかのサーバーは残し、すでに sepiace という名前の項目があれば、置き換える前に尋ねます。

</details>

Licensed under the [Apache License 2.0](LICENSE). The bundled dependencies and their licenses are listed in `dist/THIRD_PARTY_LICENSES.md`.
