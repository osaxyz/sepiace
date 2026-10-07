import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { bundle } from './bundle.mjs'

// プラグインのスキルの本文を埋め込み、プラグインのないクライアント（Cursor、VS Code、OpenCode）にも同じ案内を置く。
// 非公開側では apps/plugins/sepiace に、公開側ではリポジトリのルートにプラグインがある。
const pluginRoot = ['../plugins/sepiace/', '../'].map((path) => new URL(path, import.meta.url)).find((url) => existsSync(new URL('skills/sepiace/SKILL.md', url)))
if (!pluginRoot) throw new Error('プラグインのスキルが見つかりません')
const skill = (name) => JSON.stringify(readFileSync(new URL(`skills/${name}/SKILL.md`, pluginRoot), 'utf8'))
const version = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8')).version

await bundle(build, {
  cwd: fileURLToPath(new URL('.', import.meta.url)),
  define: {
    __SKILL_SEPIACE__: skill('sepiace'),
    __SKILL_MIGRATE__: skill('migrate'),
    __VERSION__: JSON.stringify(version),
  },
})
