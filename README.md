<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="brand/logo.svg" width="240" alt="sepiace">
</picture>

# sepiace

Long-term memory for coding agents. Your agent passes one natural-language sentence, and sepiace remembers, recalls, or forgets.<br>
<sub>コーディングエージェントのための長期記憶です。エージェントが自然文を1つ渡すだけで、sepiace が覚える、思い出す、忘れるを行います。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

<p align="center">
  <a href="https://github.com/osaxyz/sepiace"><img src="https://img.shields.io/github/stars/osaxyz/sepiace?style=social" alt="Star sepiace on GitHub"></a><br>
  <sub>If sepiace helps you, a star keeps us going.</sub>
</p>

> [!IMPORTANT]
> sepiace is in beta. Memories are stored on the sepiace server at `hi.sepiace.io`, separately for each account. Do not ask your agent to remember passwords, API keys, or other secrets.

### Quick start

```sh
npm create sepiace
```

It finds Claude Code, Codex, Cursor, VS Code, and OpenCode on your machine, connects the ones you choose, and shows how to sign in. This repository holds the sepiace plugin for Claude Code and Codex, and the `npm create sepiace` CLI in [`cli/`](cli).

<details>
<summary>Claude Code by hand</summary>
<br>

```
/plugin marketplace add osaxyz/sepiace
/plugin install sepiace@sepiace
```

Run `/mcp`, choose sepiace, and sign in with the code or link sent to your email.

</details>

<details>
<summary>Codex by hand</summary>
<br>

```sh
codex plugin marketplace add osaxyz/sepiace
codex plugin add sepiace@sepiace
codex mcp login sepiace
```

The login opens your browser. Sign in with the code or link sent to your email.

</details>

<details>
<summary>Other MCP clients by hand</summary>
<br>

Add `https://hi.sepiace.io/api/v1/mcp` as a remote MCP server (Streamable HTTP). Your client signs in through OAuth in the browser.

</details>

Try asking:

- "Remember that I prefer pnpm over npm."
- "What did we decide about the release schedule?"
- "Forget my old home address."

### Move your existing memories

<details>
<summary>Bring over what Claude Code and Codex already remember</summary>
<br>

Ask your agent to run the `migrate` skill (`/sepiace:migrate` in Claude Code). It reads the files below, shows you what it found, and sends the facts to sepiace only after you agree. It never changes the local files.

| Source | Files |
| --- | --- |
| Claude Code auto memory | `~/.claude/projects/*/memory/*.md` |
| Claude Code user instructions | `~/.claude/CLAUDE.md` |
| Codex memories | `~/.codex/memories/` |
| Codex user instructions | `~/.codex/AGENTS.md` |

</details>

### What the plugin does

<details>
<summary>Components</summary>
<br>

| Component | What it does |
| --- | --- |
| MCP server | Connects `https://hi.sepiace.io/api/v1/mcp`. It has one tool, `memory`, which takes one sentence |
| `sepiace` skill | Tells the agent to recall before acting, to save durable facts as plain sentences about you, and never to send secrets |
| Session-start note | A short reminder, about 130 tokens, added when a session starts, is cleared, or is compacted |
| `migrate` skill | Moves local memories into sepiace. It runs only when you ask for it |

</details>

### How sepiace remembers

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
<summary>Measured with KiokuBench</summary>
<br>

KiokuBench checks what a memory system actually stored: whether it kept the facts, replaced outdated ones, forgot what it was asked to forget, and stayed tidy. See the results on [www.sepiace.io](https://www.sepiace.io/kiokubench).

</details>

### Your data

<details>
<summary>What is kept and how to see it</summary>
<br>

- Memories are kept separately for each account. Every database query and vector search is scoped to the signed-in user.
- The console at [hi.sepiace.io](https://hi.sepiace.io) lists every request, with the memories it changed and the response.
- You can disconnect any client in the console. A disconnected client stops working right away.

</details>

### Contributing

This repository is a mirror. See [CONTRIBUTING.md](CONTRIBUTING.md). To report a vulnerability, see [SECURITY.md](SECURITY.md). The plugin is licensed under the [Apache License 2.0](LICENSE).

<a id="ja"></a>

## 日本語

<p align="center">
  <a href="https://github.com/osaxyz/sepiace"><img src="https://img.shields.io/github/stars/osaxyz/sepiace?style=social" alt="Star sepiace on GitHub"></a><br>
  <sub>sepiace が役に立ったら、スターを付けてもらえると励みになります。</sub>
</p>

> [!IMPORTANT]
> sepiace はベータ版です。記憶は `hi.sepiace.io` の sepiace のサーバーに、アカウントごとに分けて保存します。パスワード、API キー、そのほかの秘密は覚えさせないでください。

### クイックスタート

```sh
npm create sepiace
```

手元の Claude Code、Codex、Cursor、VS Code、OpenCode を見つけ、選んだものにつなぎ、ログインの手順を案内します。このリポジトリには、Claude Code と Codex で使う sepiace のプラグインと、[`cli/`](cli) に `npm create sepiace` の CLI があります。

<details>
<summary>Claude Code に手で入れる</summary>
<br>

```
/plugin marketplace add osaxyz/sepiace
/plugin install sepiace@sepiace
```

`/mcp` で sepiace を選び、メールに届くコードかリンクでログインします。

</details>

<details>
<summary>Codex に手で入れる</summary>
<br>

```sh
codex plugin marketplace add osaxyz/sepiace
codex plugin add sepiace@sepiace
codex mcp login sepiace
```

ログインでブラウザが開きます。メールに届くコードかリンクでログインします。

</details>

<details>
<summary>ほかの MCP クライアントに手で入れる</summary>
<br>

`https://hi.sepiace.io/api/v1/mcp` をリモートの MCP サーバー（Streamable HTTP）として足します。ログインはブラウザの OAuth で行います。

</details>

次のように頼んでみてください。

- 「npm より pnpm を使いたい、と覚えて」
- 「リリースの日程はどう決めたっけ？」
- 「前の住所は忘れて」

### 今ある記憶を移す

<details>
<summary>Claude Code と Codex が覚えていることを移す</summary>
<br>

エージェントに `migrate` スキルを使うよう頼んでください（Claude Code では `/sepiace:migrate`）。次のファイルを読み、見つけたものを見せ、あなたが了承してから sepiace に送ります。手元のファイルは変えません。

| 移す元 | ファイル |
| --- | --- |
| Claude Code の auto memory | `~/.claude/projects/*/memory/*.md` |
| Claude Code のユーザーの指示 | `~/.claude/CLAUDE.md` |
| Codex の記憶 | `~/.codex/memories/` |
| Codex のユーザーの指示 | `~/.codex/AGENTS.md` |

</details>

### プラグインの中身

<details>
<summary>入っているもの</summary>
<br>

| 部品 | 役割 |
| --- | --- |
| MCP サーバー | `https://hi.sepiace.io/api/v1/mcp` をつなぎます。ツールは、文を1つ受け取る `memory` だけです |
| `sepiace` スキル | 動く前に思い出すこと、長く使う事実をあなたについての文で覚えること、秘密を送らないことを伝えます |
| セッションの始めの案内 | セッションの開始、`/clear`、圧縮のあとに、約130トークンの短い案内を足します |
| `migrate` スキル | 手元の記憶を sepiace に移します。あなたが頼んだときだけ動きます |

</details>

### sepiace の覚え方

<details>
<summary>文を1つ渡すと、記憶の本文が返ります</summary>
<br>

エージェントは、やりたいことをふだんの言葉で書きます。保存、読み出し、検索、忘れることのどれを行うかはサーバーの判定ネットワークが決め、必要なら組み合わせます。応答は記憶の本文だけで、ID、日時、スコアを含まないので、エージェントは構造化した引数を組み立てるためにトークンを使いません。

</details>

<details>
<summary>記憶はあなたの言葉のままです</summary>
<br>

記憶の本文は、依頼の文から切り出したものです。LLM が本文を書いたり書き換えたりすることはなく、古くなったときは、その文だけを置き換えます。記憶は、書いたときの言語のまま残ります。

</details>

<details>
<summary>使われない記憶は薄れます</summary>
<br>

記憶のスコアは FSRS の忘却曲線に沿い、読み出すときに計算します。使われない記憶は少しずつ薄れ、思い出せる見込みが50%を下回ると検索に出なくなります。読み出されるたびに定着します。

</details>

<details>
<summary>KiokuBench で測っています</summary>
<br>

KiokuBench は、記憶のシステムが実際に何を残したかを確かめます。事実を覚えているか、古くなった事実を置き換えたか、忘れてと頼まれたものを忘れたか、散らかっていないかを見ます。結果は [www.sepiace.io](https://www.sepiace.io/ja/kiokubench) で見られます。

</details>

### データの扱い

<details>
<summary>何を残し、どこで確かめられるか</summary>
<br>

- 記憶はアカウントごとに分けて保存します。データベースの問い合わせとベクトル検索は、どれもログインした人の分だけを対象にします。
- [hi.sepiace.io](https://hi.sepiace.io) のコンソールで、すべての依頼と、それで変わった記憶、応答を確かめられます。
- つないだクライアントは、コンソールで取り消せます。取り消したクライアントは、すぐに使えなくなります。

</details>

### 開発に参加する

このリポジトリはミラーです。[CONTRIBUTING.md](CONTRIBUTING.md) を見てください。脆弱性の報告は [SECURITY.md](SECURITY.md) を見てください。プラグインのライセンスは [Apache License 2.0](LICENSE) です。
