import { homedir } from 'node:os'
import { join } from 'node:path'
import { applyEdits, modify } from 'jsonc-parser'
import { FORMAT, readConfig, valueAt, writeAtomically } from './config.ts'

// Claude Code の自動メモリ。有効だと、システムプロンプトに「記憶は手元のファイルに書く」という節が入る。
// プラグインのフックで差し込む sepiace の案内より強く効くので、つないでもエージェントが手元のファイルに書いてしまう。
// つないだあとに、切ってよいかを尋ねる。手元の記憶のファイルは消さない。

// Claude Code のユーザーの設定。CLAUDE_CONFIG_DIR があればその下、なければ ~/.claude の settings.json。
export const claudeSettingsPath = () => join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), 'settings.json')

// 環境変数で切ってあれば無効。設定に autoMemoryEnabled が書いていなければ、Claude Code の既定どおり有効とみなす。
export const claudeAutoMemoryEnabled = async () => {
  if (['1', 'true'].includes((process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY ?? '').toLowerCase())) return false
  const { tree } = await readConfig(claudeSettingsPath())
  return valueAt(tree, ['autoMemoryEnabled']) !== false
}

// autoMemoryEnabled だけを false にする。ほかの設定とコメントは残す。
export const disableClaudeAutoMemory = async () => {
  const path = claudeSettingsPath()
  const { text } = await readConfig(path)
  const base = text.trim() === '' ? '{}\n' : text
  await writeAtomically(path, applyEdits(base, modify(base, ['autoMemoryEnabled'], false, FORMAT)))
}
