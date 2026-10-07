---
name: update
description: Update the sepiace plugin and the sepiace skills in every client on this machine to the latest version. Use only when the user asks to update sepiace.
disable-model-invocation: true
---

# Updating sepiace

Bring the sepiace plugin and skills up to date in the clients the user has, then tell the user what changed. Run each command, read its output, and stop and report if a command fails. Do not change anything else.

## 1. See what is installed

Check which clients are on this machine and note the current versions, so you can report them later:

- Claude Code: `claude plugin list --json` and find `sepiace@sepiace`.
- Codex: `codex plugin list` and find `sepiace@sepiace`.
- Cursor, VS Code, OpenCode: look for `sepiace-memory` in `~/.cursor/skills`, `~/.copilot/skills`, and `~/.config/opencode/skills`.

Skip any client that is not there.

## 2. Update

Run the commands from the home directory (`cd ~ && ...`), because a project's own package manager settings can stop `npm`.

| Client | Commands |
| --- | --- |
| Claude Code | `claude plugin marketplace update sepiace`, then `claude plugin update sepiace@sepiace` |
| Codex | `codex plugin marketplace upgrade sepiace`, then `codex plugin add sepiace@sepiace` |
| Cursor, VS Code, OpenCode | `npm create sepiace@latest -- --yes --client <ids>`, with only the clients that are installed, for example `--client cursor,opencode` |

`npm create sepiace -- --yes` keeps the user's existing settings, replaces only the sepiace skills, and does not sign in.

## 3. Report

Tell the user:

- The version before and after, for each client.
- That Claude Code, Codex, Cursor, VS Code, and OpenCode load the new version after a restart or in a new session.
- Anything that failed, with the command and its error.
