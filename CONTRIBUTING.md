<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="brand/logo.svg" width="128" alt="sepiace">
</picture>

# Contributing to sepiace

How changes reach this repository.<br>
<sub>このリポジトリに変更が届くまでの流れです。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

> [!IMPORTANT]
> This repository is a mirror. The plugin is developed in a private repository together with the sepiace server and copied here automatically, so pull requests cannot be merged here directly. Please open an Issue for bugs, questions, and proposals.

1. Open an Issue that describes what happened or what you propose.
2. A maintainer makes the change in the private repository and reviews it there.
3. The sync app pushes the change to main here.

<details>
<summary>Try the plugin from a local copy</summary>
<br>

Clone this repository and add the clone as a marketplace.

```sh
claude plugin marketplace add ./sepiace
claude plugin install sepiace@sepiace
```

```sh
codex plugin marketplace add ./sepiace
codex plugin add sepiace@sepiace
```

</details>

<a id="ja"></a>

## 日本語

> [!IMPORTANT]
> このリポジトリはミラーです。プラグインは sepiace のサーバーと一緒に非公開のリポジトリで開発し、ここへ自動でコピーしているので、ここでは pull request を直接マージできません。不具合、質問、提案は Issue で知らせてください。

1. 起きたことや提案を Issue に書きます。
2. メンテナーが非公開のリポジトリで変更し、そこで確かめます。
3. 同期用の App が、変更をここの main に push します。

<details>
<summary>手元の複製からプラグインを試す</summary>
<br>

このリポジトリを複製し、その複製をマーケットプレイスとして足します。

```sh
claude plugin marketplace add ./sepiace
claude plugin install sepiace@sepiace
```

```sh
codex plugin marketplace add ./sepiace
codex plugin add sepiace@sepiace
```

</details>
