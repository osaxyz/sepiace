<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="brand/logo.svg" width="96" alt="sepiace">
</picture>

# Security policy

sepiace keeps people's long-term memories, so we take reports seriously.<br>
<sub>sepiace は人の長期記憶を預かるので、脆弱性の報告を重く受け止めます。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

> [!CAUTION]
> Please do not open a public issue for a vulnerability.

### Reporting a vulnerability

Report it privately through [GitHub's private vulnerability reporting](https://github.com/osaxyz/sepiace/security/advisories/new) for this repository. Include what you found, how to reproduce it, and what an attacker could do with it. We will reply as soon as we can.

### Scope

- The plugin in this repository: its MCP server settings, skills, and hooks.
- The `create-sepiace` CLI in [`cli/`](cli).
- The sepiace server, console, and sign-in at `hi.sepiace.io`, which run outside this repository. Report issues with them the same way.

<a id="ja"></a>

## 日本語

> [!CAUTION]
> 脆弱性は、公開の Issue に書かないでください。

### 脆弱性を報告する

このリポジトリの [GitHub の非公開の脆弱性報告](https://github.com/osaxyz/sepiace/security/advisories/new) から報告してください。見つけた内容、再現の手順、攻撃者に何ができるかを書いてください。できるだけ早く返信します。

### 対象

- このリポジトリのプラグイン（MCP サーバーの設定、スキル、フック）
- [`cli/`](cli) にある `create-sepiace` の CLI
- このリポジトリの外で動いている、`hi.sepiace.io` の sepiace のサーバー、コンソール、ログイン。こちらも同じ方法で報告してください
