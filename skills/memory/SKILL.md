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

## Remember what the user tells you

Save a fact as soon as the user tells you something about themselves that a later session could use. Do not wait for the user to ask you to remember it. This includes:

- Who they are: their name, age, job, workplace, and where they live.
- The people in their life, such as family, friends, and coworkers, and pets, as the user describes them.
- Their health, allergies, routines, and habits.
- Their preferences, the rules they want you to follow, and the decisions they make.
- Their plans, schedules, and trips, and the state of their ongoing work.
- Changes to any of these, such as a move, a new job, or a changed plan.

When you are not sure whether a fact will matter later, save it. sepiace replaces outdated facts and lets unused memories fade, so saving a fact costs little, and a fact you did not save is lost.

Write each fact as a plain sentence about the user, in the user's language:

- "Remember that the user prefers pnpm over npm."
- "Remember that the user's daughter Lena lives in Evanston."
- "Remember that the user moved the sepiace repository to osaxyz/sepiace-internal on October 7, 2026."
- "ユーザーはエビにアレルギーがある、と覚えて。"

When a fact changes, save the new version and say what changed: "Remember that the user moved from Osaka to Fukuoka in March 2026."

The server stores your sentences as they are and never rewrites them, so:

- Write complete sentences that make sense on their own, without "this", "here", or "the above".
- Use absolute dates, not "yesterday" or "next week".
- Name the project when a fact belongs to one.
- Put several related facts in one request when they arrive together. A request can be up to 4,000 characters.

Do not save:

- Secrets: passwords, API keys, tokens, recovery codes, private keys.
- Things that are already in the code, the git history, or the project's docs.
- Details of the task at hand that will not matter once it is done, such as which file you are editing right now.

## Forget on request

When the user asks you to forget something, pass the request on and name what to forget as precisely as the user did: "Forget the user's old home address." Do not forget anything the user did not ask about.

## Other memory files

If the client also keeps its own memory (Claude Code's auto memory in `~/.claude/projects/*/memory/`, or Codex memories in `~/.codex/memories/`), save durable facts to sepiace instead of writing them to both. To move existing local memories into sepiace, use the `migrate` skill.
