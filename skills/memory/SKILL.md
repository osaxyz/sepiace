---
name: memory
description: Use sepiace, the user's long-term memory, through its MCP tool `memory`. Use it to recall the user's preferences, past decisions, and the state of ongoing work before acting on them, to remember durable facts the user tells you, and to forget what the user asks you to forget.
---

# Using sepiace

sepiace keeps long-term memory for one user across sessions, projects, and agents. It has one MCP tool, `memory`, which takes a single natural-language `request`. The server decides whether to save, recall, search, or forget, and combines them when a request asks for more than one. The response contains only memory text, with no IDs, dates, or scores.

Memories fade when they go unused and become easier to recall each time they are read, so recall what you need instead of keeping your own copy.

## Recall before you act

Recall when the answer may depend on something the user told an agent before:

- At the start of a task, ask for what is relevant to it: "What has the user decided about the sepiace console?"
- Before choosing a style, tool, or convention: "How does the user want commit messages written?"
- Before asking the user a question they may already have answered.

Ask one focused question per request. If nothing comes back, carry on and do not mention it.

## Remember durable facts

Save a fact when the user states a preference, makes a decision, corrects you, or tells you about themselves or their ongoing work, and it will still matter in a later session.

Write each fact as a plain sentence about the user, in the user's language, and end with "remember" or "覚えて":

- "Remember that the user prefers pnpm over npm."
- "Remember that the user moved the sepiace repository to osaxyz/sepiace-internal on October 7, 2026."
- "ユーザーはコードレビューを詳しく書いてほしい、と覚えて。"

The server stores your sentences as they are and never rewrites them, so:

- Write complete sentences that make sense on their own, without "this", "here", or "the above".
- Use absolute dates, not "yesterday" or "next week".
- Name the project when a fact belongs to one.
- Put several related facts in one request when they arrive together. A request can be up to 4,000 characters.

Do not save:

- Secrets: passwords, API keys, tokens, recovery codes, private keys.
- Things that are already in the code, the git history, or the project's docs.
- Details that only matter for the current task.
- Private information about other people that the user did not ask you to keep.

## Forget on request

When the user asks you to forget something, pass the request on and name what to forget as precisely as the user did: "Forget the user's old home address." Do not forget anything the user did not ask about.

## Other memory files

If the client also keeps its own memory (Claude Code's auto memory in `~/.claude/projects/*/memory/`, or Codex memories in `~/.codex/memories/`), save durable facts to sepiace instead of writing them to both. To move existing local memories into sepiace, use the `migrate` skill.
