---
name: migrate
description: Move the user's local agent memories (Claude Code auto memory and CLAUDE.md, Codex memories and AGENTS.md) into sepiace. Use only when the user asks to migrate or import their memories into sepiace.
disable-model-invocation: true
---

# Migrating local memories into sepiace

Read the user's local memory files, show what you found, and after the user agrees, send the facts to sepiace through the MCP tool `memory`. Never edit or delete the local files.

## 1. Check the connection

Make sure the `memory` tool from the sepiace MCP server is available. If it is not, stop and tell the user to connect sepiace first: run `npx sepiace`, then sign in (Claude Code: `/mcp`; Codex: `codex mcp login sepiace`; OpenCode: `opencode mcp auth sepiace`; Cursor and VS Code: sign in to sepiace from the MCP settings).

## 2. Find the sources

Look for these files. Expand `~`, and use `$CLAUDE_CONFIG_DIR` instead of `~/.claude` and `$CODEX_HOME` instead of `~/.codex` when they are set. Skip what does not exist.

| Source | Files | What is in them |
| --- | --- | --- |
| Claude Code auto memory | `~/.claude/projects/*/memory/*.md` | One fact per file, with frontmatter (`name`, `description`, `type`). `MEMORY.md` is only an index of the other files, so read it only when a directory has no other files. The directory name under `projects/` is the project's path with `/` replaced by `-`. |
| Claude Code user instructions | `~/.claude/CLAUDE.md` | The user's preferences for every project. |
| Codex memories | `~/.codex/memories/MEMORY.md`, `~/.codex/memories/memory_summary.md` | Memories Codex consolidated from past sessions. |
| Codex user instructions | `~/.codex/AGENTS.md`, `~/.codex/AGENTS.override.md` | The user's preferences for every project. |

Do not read project-level `CLAUDE.md` or `AGENTS.md` files unless the user asks. They usually describe a codebase, not the user, and they stay in the repository anyway.

## 3. Show the user what you found and ask

List each source with the number of files and a one-line summary of what it covers, for example "Claude Code auto memory, project sepiace: 3 files (deploy target, paid model rule, component rule)". Point out anything you plan to skip and why (see step 4).

Ask which sources to move. Send nothing until the user answers. Each request makes the server run its judgment network, so moving many files takes a while.

## 4. Turn each memory into sentences about the user

For every file the user chose:

- Write each fact as a complete sentence about the user that makes sense on its own. Keep the user's wording and language. Do not add facts, guesses, or advice that are not in the file.
- Say which project a fact belongs to when it comes from a project directory: "In the sepiace project, the user ...".
- Replace relative dates with absolute ones. Use the file's `modified` date in the frontmatter, or the file's modification time, as the reference.
- Keep the reason when the file gives one ("**Why:** ..."), as part of the sentence.
- Drop frontmatter, Markdown formatting, file names, and links to other memory files.

Skip, and tell the user what you skipped:

- Secrets: passwords, API keys, tokens, recovery codes, private keys, and anything that looks like one.
- Rules for how a codebase is built that are not about the user (these stay in the repository).
- Facts that are out of date according to a newer file.

## 5. Send to sepiace

Send one request per source file, or per few related files, and keep each request under 4,000 characters. Start each request with "Remember the following about the user." (or "次のことを覚えて。" when the facts are in Japanese) and put one fact per line:

```
Remember the following about the user.
- In the sepiace project, the user deploys to the Original SIN Architecture Cloudflare account, not Philtz.
- The user wants to be asked before any paid model is used, with the model name and the estimated cost.
```

Send the requests one at a time and wait for each response. If a request fails, retry it once, then note it and continue.

## 6. Report

Tell the user:

- How many files and facts you sent, per source.
- What you skipped, and why.
- Any request that failed.
- That every request is listed with the memories it changed at https://hi.sepiace.io/requests.

Finally, offer (do not do it yourself) to stop the client's own memory so the two do not drift apart: in Claude Code, `/memory` can turn auto memory off; in Codex, `/memories` does the same. The local files stay where they are.
