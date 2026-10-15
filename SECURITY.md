<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="brand/logo.svg" width="128" alt="sepiace">
</picture>

# Security policy

sepiace keeps people's long-term memories, so we take reports seriously.

> [!CAUTION]
> Please do not open a public issue for a vulnerability.

## Reporting a vulnerability

Report it privately through [GitHub's private vulnerability reporting](https://github.com/osaxyz/sepiace/security/advisories/new) for this repository. Include what you found, how to reproduce it, and what an attacker could do with it. We will reply as soon as we can.

## Scope

- The plugin in this repository: its MCP server settings, skills, and hooks.
- The `create-sepiace` CLI in [`cli/`](cli).
- The sepiace server, console, and sign-in at `hi.sepiace.io`, which run outside this repository. Report issues with them the same way.
