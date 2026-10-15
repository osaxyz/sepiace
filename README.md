<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="brand/logo.svg" width="128" alt="sepiace">
</picture>

# sepiace

Long-term memory for AI agents. Your agent passes one natural-language sentence, and sepiace remembers, recalls, or forgets.

<p align="center">
  <a href="https://github.com/osaxyz/sepiace"><img src="https://img.shields.io/github/stars/osaxyz/sepiace?style=social" alt="Star sepiace on GitHub"></a><br>
  <sub>If sepiace helps you, a star keeps us going.</sub>
</p>

> [!IMPORTANT]
> sepiace is in beta. Memories are stored on the sepiace server at `hi.sepiace.io`, separately for each account. Do not ask your agent to remember passwords, API keys, or other secrets.

## Quick start

```sh
npm create sepiace
```

It finds Claude Code, Codex, Cursor, VS Code, and OpenCode on your machine, connects the ones you choose, and walks you through signing in. Then start a new session and ask your agent:

- "Remember that I prefer pnpm over npm."
- "What did we decide about the release schedule?"
- "Forget my old home address."

To bring over what your agent already remembers, run `/sepiace:migrate` in Claude Code, or ask other clients to use the `sepiace-migrate` skill. It shows you what it found and sends nothing until you agree.

<details>
<summary>Install by hand</summary>
<br>

Claude Code:

```
/plugin marketplace add osaxyz/sepiace
/plugin install sepiace@sepiace
```

Codex:

```sh
codex plugin marketplace add osaxyz/sepiace
codex plugin add sepiace@sepiace
codex mcp login sepiace
```

Other MCP clients: add `https://hi.sepiace.io/api/v1/mcp` as a remote MCP server (Streamable HTTP). The client signs in through OAuth in the browser.

</details>

## Technology

<details>
<summary>One sentence in, memory text out</summary>
<br>

Your agent writes what it wants in plain words. A judgment network on the server decides whether to save, recall, search, or forget, and combines them when needed. The response contains only memory text, with no IDs, dates, or scores, so the agent spends no tokens building structured arguments.

</details>

<details>
<summary>Memories are your own words</summary>
<br>

Each memory is cut from the sentences in the request. No LLM writes or rewrites it, and when something becomes outdated, only that sentence is replaced. A memory stays in the language you wrote it in.

</details>

<details>
<summary>Memories fade unless they are used</summary>
<br>

Each memory's score follows the FSRS forgetting curve and is computed when it is read. Memories that go unused fade, and once a memory's recall probability drops below 50%, it no longer appears in search. Each recall makes it stick.

</details>

<details>
<summary>Your memories stay yours, and you can see every request</summary>
<br>

Memories are kept separately for each account, and every database query and vector search is scoped to the signed-in user. The console at [hi.sepiace.io](https://hi.sepiace.io) lists every request with the memories it changed, and a client you disconnect there stops working right away.

</details>

<details>
<summary>Measured with KiokuBench</summary>
<br>

KiokuBench checks what a memory system actually stored: whether it kept the facts, replaced outdated ones, forgot what it was asked to forget, and stayed tidy. The KiokuBench Index combines these four pillars into one number from 0 to 100.

| System | Index | Remember | Replace | Forget | Tidy |
| --- | --- | --- | --- | --- | --- |
| sepiace | **96.1** | **98.7** | **98.0** | **100.0** | **88.2** |
| Supermemory | 58.9 | 95.3 | 95.0 | 22.0 | 60.5 |
| ByteRover | 39.2 | 72.3 | 19.0 | 62.0 | 27.7 |
| Mem0 | 8.5 | 96.3 | 0.0 | 0.0 | 55.0 |
| Store everything | 8.0 | 99.0 | 0.0 | 0.0 | 41.7 |

KiokuBench v0.1, 10 personas in English and Japanese, raw conversation passed in as is. sepiace was measured on October 14, 2026, and the others between September 27 and 30, 2026. KiokuBench was designed and run by the team that builds sepiace. The method, the eight metrics, the conditions for each system, and the limitations are on [sepiace.io](https://sepiace.io/kiokubench).

</details>

## Specification

<details>
<summary>Plugin components</summary>
<br>

| Component | What it does |
| --- | --- |
| MCP server | Connects `https://hi.sepiace.io/api/v1/mcp`. It has one tool, `memory`, which takes one sentence |
| `memory` skill | Tells the agent to recall before acting, to save durable facts as plain sentences about you, and never to send secrets |
| Session-start note | A short reminder, about 130 tokens, added when a session starts, is cleared, or is compacted |
| `migrate` skill | Moves local memories into sepiace. It runs only when you ask for it |
| `update` skill | Updates the plugin and the skills in every client to the latest version. It runs only when you ask for it |

</details>

<details>
<summary>What the migrate skill reads</summary>
<br>

| Source | Files |
| --- | --- |
| Claude Code auto memory | `~/.claude/projects/*/memory/*.md` |
| Claude Code user instructions | `~/.claude/CLAUDE.md` |
| Codex memories | `~/.codex/memories/` |
| Codex user instructions | `~/.codex/AGENTS.md` |

It never changes the local files.

</details>

<details>
<summary>What npm create sepiace changes</summary>
<br>

| Client | What it does |
| --- | --- |
| Claude Code, Codex | Installs the plugin from this repository |
| Cursor | Adds sepiace to `~/.cursor/mcp.json` and the skills to `~/.cursor/skills` |
| VS Code | Adds sepiace to the user `mcp.json` and the skills to `~/.copilot/skills` |
| OpenCode | Adds sepiace to `~/.config/opencode/opencode.json` and the skills to `~/.config/opencode/skills` |
| Claude Desktop and claude.ai | Shows how to add sepiace as a custom connector |

The CLI lives in [`cli/`](cli) and is published to npm as `create-sepiace`.

</details>
