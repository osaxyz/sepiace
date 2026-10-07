<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg" width="96" alt="sepiace">
</picture>

# create-sepiace

Connect [sepiace](https://www.sepiace.io), long-term memory for coding agents, to the clients on your machine.<br>
<sub>コーディングエージェントのための長期記憶 sepiace を、手元のクライアントにつなぎます。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

> [!TIP]
> Run it again at any time. Clients that are already connected are left as they are.

### Quick start

```sh
npm create sepiace
```

It finds Claude Code, Codex, Cursor, VS Code, and OpenCode on your machine, asks which ones should use sepiace, connects them, and walks you through signing in. Then it shows how to move the memories your agent already has into sepiace.

### Technology

<details>
<summary>Your settings stay as they were</summary>
<br>

It edits each client's config as JSON with comments, so your comments, key order, and other servers are kept. Each file is written in one step, so a failed run never leaves it half-written, and a file it cannot read is left untouched. If a server called sepiace already exists with a different address, it asks before replacing it, and hides any key in the old address when it shows it to you.

</details>

<details>
<summary>The same guidance in every client</summary>
<br>

Claude Code and Codex get the sepiace plugin. Cursor, VS Code, and OpenCode have no plugins, so it places the same skills in each client's own skill folder, named `sepiace-memory` and `sepiace-migrate` so they do not clash with yours.

</details>

### Specification

<details>
<summary>What it changes for each client</summary>
<br>

| Client | What it does |
| --- | --- |
| Claude Code | Installs the sepiace plugin from [osaxyz/sepiace](https://github.com/osaxyz/sepiace) |
| Codex | Installs the sepiace plugin from [osaxyz/sepiace](https://github.com/osaxyz/sepiace) |
| Cursor | Adds sepiace to `~/.cursor/mcp.json` and the skills to `~/.cursor/skills` |
| VS Code | Adds sepiace to the user `mcp.json` and the skills to `~/.copilot/skills` |
| OpenCode | Adds sepiace to `~/.config/opencode/opencode.json` and the skills to `~/.config/opencode/skills` |
| Claude Desktop and claude.ai | Shows how to add sepiace as a custom connector |

</details>

<details>
<summary>Options</summary>
<br>

Pass options after `--`, for example `npm create sepiace -- --client cursor,opencode`.

| Option | What it does |
| --- | --- |
| `--client <ids>` | Comma-separated: `claude-code`, `codex`, `cursor`, `vscode`, `opencode`, `claude-desktop` |
| `-y`, `--yes` | Does not ask. Connects the clients found on this machine, keeps existing entries, and skips signing in |
| `-v`, `--version` | Shows the version |
| `-h`, `--help` | Shows the help |

</details>

<a id="ja"></a>

## 日本語

> [!TIP]
> 何度流しても構いません。すでにつながっているクライアントはそのままにします。

### クイックスタート

```sh
npm create sepiace
```

手元の Claude Code、Codex、Cursor、VS Code、OpenCode を見つけ、どれに sepiace をつなぐかを尋ねてからつなぎ、ログインまで案内します。最後に、エージェントがすでに覚えている記憶を sepiace に移す方法を伝えます。

### テクノロジー

<details>
<summary>設定は元のまま残します</summary>
<br>

クライアントの設定ファイルをコメント付きの JSON として扱うので、コメント、キーの並び、ほかのサーバーは残ります。ファイルは一度に書き換えるので、途中で止まっても書きかけになりません。読めないファイルには触れません。sepiace という名前のサーバーが別の宛先ですでにあれば、置き換える前に尋ね、古い宛先に含まれる鍵は伏せて見せます。

</details>

<details>
<summary>どのクライアントにも同じ案内を置きます</summary>
<br>

Claude Code と Codex にはプラグインを入れます。Cursor、VS Code、OpenCode にはプラグインがないので、同じスキルを各クライアントのスキルの置き場所に置きます。名前は、手元のスキルとぶつからないよう `sepiace-memory` と `sepiace-migrate` にします。

</details>

### 仕様

<details>
<summary>クライアントごとに変えるもの</summary>
<br>

| クライアント | すること |
| --- | --- |
| Claude Code | [osaxyz/sepiace](https://github.com/osaxyz/sepiace) のプラグインを入れます |
| Codex | [osaxyz/sepiace](https://github.com/osaxyz/sepiace) のプラグインを入れます |
| Cursor | `~/.cursor/mcp.json` に sepiace を足し、`~/.cursor/skills` にスキルを置きます |
| VS Code | ユーザーの `mcp.json` に sepiace を足し、`~/.copilot/skills` にスキルを置きます |
| OpenCode | `~/.config/opencode/opencode.json` に sepiace を足し、`~/.config/opencode/skills` にスキルを置きます |
| Claude Desktop と claude.ai | カスタムコネクタとして足す手順を表示します |

</details>

<details>
<summary>オプション</summary>
<br>

オプションは `--` のあとに渡します。たとえば `npm create sepiace -- --client cursor,opencode` です。

| オプション | すること |
| --- | --- |
| `--client <ids>` | カンマ区切りで `claude-code`、`codex`、`cursor`、`vscode`、`opencode`、`claude-desktop` から選びます |
| `-y`、`--yes` | 何も尋ねません。この端末で見つかったクライアントをつなぎ、すでにある項目は残し、ログインは飛ばします |
| `-v`、`--version` | 版を表示します |
| `-h`、`--help` | ヘルプを表示します |

</details>
