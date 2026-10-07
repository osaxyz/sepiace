import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { type AskReplace, putServer } from './config.ts'
import { installSkills } from './skills.ts'

// 手元のクライアントに sepiace をつなぐ。
// Claude Code と Codex はプラグインを入れる。プラグインのないクライアントは、MCP の設定ファイルに書き足し、案内のスキルを置く。

export const NAME = 'sepiace'
// SEPIACE_MCP_URL と SEPIACE_MARKETPLACE は、手元の開発用のサーバーや、手元で組み立てた公開リポジトリで試すときに使う。
export const MCP_URL = process.env.SEPIACE_MCP_URL ?? 'https://hi.sepiace.io/api/v1/mcp'
export const MARKETPLACE = process.env.SEPIACE_MARKETPLACE ?? 'osaxyz/sepiace'
const PLUGIN = `${NAME}@${NAME}`

export type Result =
  | { kind: 'added' | 'exists' | 'replaced'; message: string; login: string; warning?: string }
  | { kind: 'kept'; message: string }
  | { kind: 'manual'; message: string; snippet: string }

export type ClientId = 'claude-code' | 'codex' | 'cursor' | 'vscode' | 'opencode' | 'claude-desktop'

const home = () => homedir()
// XDG_CONFIG_HOME があれば、OpenCode と Linux の VS Code はその下を使う。
const configHome = () => process.env.XDG_CONFIG_HOME ?? join(home(), '.config')

// 外のコマンドは非同期で呼ぶ。同期で呼ぶと、そのあいだ画面のスピナーが止まって見える。
export const run = (command: string, args: string[]) =>
  new Promise<{ ok: boolean; output: string }>((resolve) => {
    let output = ''
    const child = spawn(command, args, { shell: process.platform === 'win32' })
    child.stdout?.on('data', (chunk) => (output += chunk))
    child.stderr?.on('data', (chunk) => (output += chunk))
    child.on('error', () => resolve({ ok: false, output: output.trim() }))
    child.on('close', (code) => resolve({ ok: code === 0, output: output.trim() }))
  })

const has = async (command: string) => (await run(command, ['--version'])).ok

const fail = (what: string, output: string): never => {
  throw new Error(`${what} failed: ${output}`)
}

// VS Code のユーザーの設定のディレクトリ。既定のプロファイルの場所だけを扱う。
const vscodeUserDir = () => {
  if (process.platform === 'darwin') return join(home(), 'Library', 'Application Support', 'Code', 'User')
  if (process.platform === 'win32') return join(process.env.APPDATA ?? join(home(), 'AppData', 'Roaming'), 'Code', 'User')
  return join(configHome(), 'Code', 'User')
}

// OpenCode の設定ファイル。opencode.jsonc があればそれを、なければ opencode.json を使う。
const openCodeConfig = () => {
  const dir = join(configHome(), 'opencode')
  const jsonc = join(dir, 'opencode.jsonc')
  return { dir, file: existsSync(jsonc) ? jsonc : join(dir, 'opencode.json') }
}

// 画面に出すパスは、ホームディレクトリを ~ にして短くする。
export const tilde = (path: string) => (path.startsWith(home()) ? `~${path.slice(home().length)}` : path)

const changeMessage = (kind: 'added' | 'exists' | 'replaced', where: string) =>
  kind === 'added'
    ? `Added sepiace to ${tilde(where)}`
    : kind === 'replaced'
      ? `Replaced the old sepiace entry in ${tilde(where)}`
      : `${tilde(where)} already has sepiace`

const claudeCode = async (): Promise<Result> => {
  const commands = [`claude plugin marketplace add ${MARKETPLACE}`, `claude plugin install ${PLUGIN}`]
  if (!(await has('claude'))) return { kind: 'manual', message: "Claude Code's CLI was not found. Run these to add sepiace:", snippet: commands.join('\n') }
  const listed = await run('claude', ['plugin', 'list', '--json'])
  const installed = listed.ok && (JSON.parse(listed.output || '[]') as { id: string }[]).some((plugin) => plugin.id === PLUGIN)
  if (!installed) {
    const marketplaces = await run('claude', ['plugin', 'marketplace', 'list', '--json'])
    const known = marketplaces.ok && (JSON.parse(marketplaces.output || '[]') as { name: string }[]).some((m) => m.name === NAME)
    if (!known) {
      const added = await run('claude', ['plugin', 'marketplace', 'add', MARKETPLACE])
      if (!added.ok) fail('claude plugin marketplace add', added.output)
    }
    const done = await run('claude', ['plugin', 'install', PLUGIN])
    if (!done.ok) fail('claude plugin install', done.output)
  }
  // プラグインとは別に、手で足した sepiace の MCP サーバーがあると、同じツールが2つ並ぶ。
  const standalone = (await run('claude', ['mcp', 'get', NAME])).ok
  return {
    kind: installed ? 'exists' : 'added',
    message: installed ? 'Claude Code already has the sepiace plugin' : 'Installed the sepiace plugin in Claude Code',
    login: 'Open Claude Code, run /mcp, choose plugin:sepiace:sepiace, and sign in.',
    ...(standalone ? { warning: 'Claude Code also has an MCP server called sepiace that was added by hand. Remove it with `claude mcp remove sepiace` so the tools are not listed twice.' } : {}),
  }
}

const codex = async (): Promise<Result> => {
  const commands = [`codex plugin marketplace add ${MARKETPLACE}`, `codex plugin add ${PLUGIN}`, `codex mcp login ${NAME}`]
  if (!(await has('codex'))) return { kind: 'manual', message: "Codex's CLI was not found. Run these to add sepiace:", snippet: commands.join('\n') }
  const installed = /^sepiace@sepiace\s+installed/m.test((await run('codex', ['plugin', 'list'])).output)
  if (!installed) {
    if (!/^sepiace\s/m.test((await run('codex', ['plugin', 'marketplace', 'list'])).output)) {
      const added = await run('codex', ['plugin', 'marketplace', 'add', MARKETPLACE])
      if (!added.ok) fail('codex plugin marketplace add', added.output)
    }
    const done = await run('codex', ['plugin', 'add', PLUGIN])
    if (!done.ok) fail('codex plugin add', done.output)
  }
  return {
    kind: installed ? 'exists' : 'added',
    message: installed ? 'Codex already has the sepiace plugin' : 'Installed the sepiace plugin in Codex',
    login: 'Sign in in the browser.',
  }
}

const cursor = async (ask: AskReplace): Promise<Result> => {
  const file = join(home(), '.cursor', 'mcp.json')
  const kind = await putServer(file, ['mcpServers', NAME], { url: MCP_URL }, ask)
  if (kind === 'kept') return { kind, message: `Kept the existing sepiace entry in ${tilde(file)}` }
  await installSkills(join(home(), '.cursor', 'skills'))
  return { kind, message: changeMessage(kind, file), login: 'Open Cursor, go to Settings → MCP, and sign in to sepiace.' }
}

const vscode = async (ask: AskReplace): Promise<Result> => {
  const dir = vscodeUserDir()
  const entry = { type: 'http', url: MCP_URL }
  if (!existsSync(dir)) {
    return { kind: 'manual', message: `VS Code's user settings were not found at ${dir}. Run this to add sepiace:`, snippet: `code --add-mcp '${JSON.stringify({ name: NAME, ...entry })}'` }
  }
  const file = join(dir, 'mcp.json')
  const kind = await putServer(file, ['servers', NAME], entry, ask)
  if (kind === 'kept') return { kind, message: `Kept the existing sepiace entry in ${tilde(file)}` }
  await installSkills(join(home(), '.copilot', 'skills'))
  return { kind, message: changeMessage(kind, file), login: 'Open VS Code, start sepiace from the MCP servers view, and sign in in the browser.' }
}

const openCode = async (ask: AskReplace): Promise<Result> => {
  const { dir, file } = openCodeConfig()
  const kind = await putServer(file, ['mcp', NAME], { type: 'remote', url: MCP_URL, enabled: true }, ask, { $schema: 'https://opencode.ai/config.json' })
  if (kind === 'kept') return { kind, message: `Kept the existing sepiace entry in ${tilde(file)}` }
  await installSkills(join(dir, 'skills'))
  return { kind, message: changeMessage(kind, file), login: 'Sign in in the browser.' }
}

// Claude Desktop と claude.ai は、リモートの MCP をアプリのコネクタの画面でしか足せない。
const claudeDesktop = (): Result => ({
  kind: 'manual',
  message: 'Add sepiace as a custom connector in Claude (Settings → Connectors → Add custom connector) with this URL:',
  snippet: MCP_URL,
})

export const CLIENTS: { value: ClientId; label: string; detect: () => Promise<boolean>; hint?: string }[] = [
  { value: 'claude-code', label: 'Claude Code', detect: () => has('claude') },
  { value: 'codex', label: 'Codex', detect: () => has('codex') },
  { value: 'cursor', label: 'Cursor', detect: async () => existsSync(join(home(), '.cursor')) || (await has('cursor')) },
  { value: 'vscode', label: 'VS Code', hint: 'GitHub Copilot', detect: async () => existsSync(vscodeUserDir()) || (await has('code')) },
  { value: 'opencode', label: 'OpenCode', detect: async () => existsSync(openCodeConfig().dir) || (await has('opencode')) },
  { value: 'claude-desktop', label: 'Claude Desktop and claude.ai', hint: 'shows the steps', detect: async () => false },
]

export const install = async (client: ClientId, ask: AskReplace): Promise<Result> => {
  switch (client) {
    case 'claude-code':
      return claudeCode()
    case 'codex':
      return codex()
    case 'cursor':
      return cursor(ask)
    case 'vscode':
      return vscode(ask)
    case 'opencode':
      return openCode(ask)
    case 'claude-desktop':
      return claudeDesktop()
  }
}

// ブラウザでログインを始める CLI があるクライアント。OpenCode は裏で動くサーバーが設定を読み直すまで sepiace を知らないので、
// sepiace が一覧に出るまで待ってから始める。
export const LOGIN: Partial<Record<ClientId, { command: string; args: string[]; ready?: () => Promise<boolean> }>> = {
  codex: { command: 'codex', args: ['mcp', 'login', NAME] },
  opencode: {
    command: 'opencode',
    args: ['mcp', 'auth', NAME],
    ready: async () => {
      for (let attempt = 0; attempt < 10; attempt++) {
        if (new RegExp(`\\b${NAME}\\b`).test((await run('opencode', ['mcp', 'list'])).output)) return true
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
      return false
    },
  },
}
