<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/osaxyz/sepiace/main/brand/logo.svg">
  <img src="brand/logo.svg" width="128" alt="sepiace">
</picture>

# Contributing to sepiace

How changes reach this repository.

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
