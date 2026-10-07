# sepiace

Long-term memory for coding agents. Your agent passes one natural-language sentence, and sepiace remembers, recalls, or forgets.<br>
<sub>コーディングエージェントのための長期記憶です。エージェントが自然文を1つ渡すだけで、sepiace が覚える、思い出す、忘れるを行います。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

This repository is the sepiace plugin for Claude Code and Codex. The plugin:

- connects the sepiace MCP server (`https://hi.sepiace.io/api/v1/mcp`),
- tells the agent when to recall and when to remember, through a skill and a short note at the start of each session,
- moves the memories you already have in Claude Code and Codex into sepiace, with the `migrate` skill.

The memory itself runs on the sepiace server. Learn more at [www.sepiace.io](https://www.sepiace.io).

### Install in Claude Code

```
/plugin marketplace add osaxyz/sepiace
/plugin install sepiace@sepiace
```

Then run `/mcp`, choose sepiace, and sign in with the code sent to your email.

### Install in Codex

```sh
codex plugin marketplace add osaxyz/sepiace
codex plugin add sepiace@sepiace
codex mcp login sepiace
```

### Move your existing memories

Ask your agent to run the `migrate` skill (`/sepiace:migrate` in Claude Code). It reads Claude Code's auto memory and `~/.claude/CLAUDE.md`, and Codex's memories and `~/.codex/AGENTS.md`, shows you what it found, and sends the facts to sepiace only after you agree. It never changes the local files.

### Your data

Memories are kept separately for each account. You can see every request, and the memories it changed, in the console at [hi.sepiace.io](https://hi.sepiace.io), and disconnect any client there.

### Contributing

This repository is a mirror. See [CONTRIBUTING.md](CONTRIBUTING.md). To report a vulnerability, see [SECURITY.md](SECURITY.md).

<a id="ja"></a>

## 日本語

このリポジトリは、Claude Code と Codex で使う sepiace のプラグインです。プラグインは次のことをします。

- sepiace の MCP サーバー（`https://hi.sepiace.io/api/v1/mcp`）をつなぎます。
- いつ思い出し、いつ覚えるかを、スキルと、セッションの始めの短い案内でエージェントに伝えます。
- Claude Code と Codex にすでにある記憶を、`migrate` スキルで sepiace に移します。

記憶そのものは sepiace のサーバーで動きます。詳しくは [www.sepiace.io](https://www.sepiace.io) を見てください。

### Claude Code に入れる

```
/plugin marketplace add osaxyz/sepiace
/plugin install sepiace@sepiace
```

そのあと `/mcp` で sepiace を選び、メールに届くコードでログインします。

### Codex に入れる

```sh
codex plugin marketplace add osaxyz/sepiace
codex plugin add sepiace@sepiace
codex mcp login sepiace
```

### 今ある記憶を移す

エージェントに `migrate` スキルを使うよう頼んでください（Claude Code では `/sepiace:migrate`）。Claude Code の auto memory と `~/.claude/CLAUDE.md`、Codex の記憶と `~/.codex/AGENTS.md` を読み、見つけたものを見せ、あなたが了承してから sepiace に送ります。手元のファイルは変えません。

### データについて

記憶はアカウントごとに分けて保存します。[hi.sepiace.io](https://hi.sepiace.io) のコンソールで、すべての依頼と、それで変わった記憶を確かめられ、つないだクライアントを取り消せます。

### 開発に参加する

このリポジトリはミラーです。[CONTRIBUTING.md](CONTRIBUTING.md) を見てください。脆弱性の報告は [SECURITY.md](SECURITY.md) を見てください。
