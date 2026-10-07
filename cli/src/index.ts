import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { cancel, confirm, intro, isCancel, log, multiselect, note, outro } from '@clack/prompts'
import { CLIENTS, type ClientId, MCP_URL, NAME, install } from './clients.ts'
import { describeServer } from './config.ts'

// npx sepiace の本体。手元のエージェントのクライアントを見つけ、選んだものに sepiace をつなぎ、ログインと記憶の移行を案内する。

declare const __VERSION__: string | undefined
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'dev'

const HELP = `Usage: npx sepiace [options]

Connects sepiace, long-term memory for coding agents, to the clients on this machine.

Options:
  --client <ids>   Comma-separated: ${CLIENTS.map((client) => client.value).join(', ')}
  -y, --yes        Do not ask. Connect the clients found on this machine, keep existing entries, and skip signing in
  -v, --version    Show the version
  -h, --help       Show this help`

const { values } = parseArgs({
  options: {
    client: { type: 'string' },
    yes: { type: 'boolean', short: 'y' },
    version: { type: 'boolean', short: 'v' },
    help: { type: 'boolean', short: 'h' },
  },
})

if (values.help) {
  console.log(HELP)
  process.exit(0)
}
if (values.version) {
  console.log(VERSION)
  process.exit(0)
}

const stopIfCancelled = <T>(answer: T): Exclude<T, symbol> => {
  if (isCancel(answer)) {
    cancel('Cancelled')
    process.exit(0)
  }
  return answer as Exclude<T, symbol>
}

const chooseClients = async (): Promise<ClientId[]> => {
  if (values.client) {
    const ids = values.client.split(',').map((id) => id.trim()).filter(Boolean)
    const unknown = ids.filter((id) => !CLIENTS.some((client) => client.value === id))
    if (unknown.length > 0) throw new Error(`Unknown client "${unknown.join(', ')}". Use: ${CLIENTS.map((client) => client.value).join(', ')}`)
    return ids as ClientId[]
  }
  const found = CLIENTS.filter((client) => client.detect()).map((client) => client.value)
  if (values.yes) return found
  return stopIfCancelled(
    await multiselect({
      message: 'Which clients should use sepiace?',
      options: CLIENTS.map((client) => ({ value: client.value, label: client.label, hint: found.includes(client.value) ? 'found' : client.hint })),
      initialValues: found,
      required: true,
    }),
  )
}

// 同じ名前で別の中身のサーバーがあれば、置き換えてよいかを尋ねる。--yes のときは置き換えない。
const askReplace = (label: string) => async (current: unknown) => {
  if (values.yes) return false
  return stopIfCancelled(
    await confirm({ message: `${label} already has an MCP server called sepiace (${describeServer(current)}). Replace it with ${MCP_URL}?`, initialValue: true }),
  )
}

// ブラウザでログインする CLI があるクライアントは、続けてログインできるようにする。
const LOGIN_COMMANDS: Partial<Record<ClientId, [string, string[]]>> = {
  codex: ['codex', ['mcp', 'login', NAME]],
  opencode: ['opencode', ['mcp', 'auth', NAME]],
}

const main = async () => {
  intro(`sepiace ${VERSION}`)
  const chosen = await chooseClients()
  if (chosen.length === 0) {
    outro('No clients were found. Run `npx sepiace --client <id>` to choose one.')
    return
  }

  const logins: { client: ClientId; label: string; step: string }[] = []
  for (const client of chosen) {
    const label = CLIENTS.find((c) => c.value === client)!.label
    try {
      const result = await install(client, askReplace(label))
      if (result.kind === 'manual') {
        log.warn(result.message)
        note(result.snippet)
      } else if (result.kind === 'kept') {
        log.info(result.message)
      } else {
        log.success(result.message)
        if ('warning' in result && result.warning) log.warn(result.warning)
        logins.push({ client, label, step: result.login })
      }
    } catch (error) {
      log.error(`${label}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (logins.length > 0) note(logins.map((login) => `${login.label}: ${login.step}`).join('\n'), 'Sign in')

  for (const login of logins) {
    const command = LOGIN_COMMANDS[login.client]
    if (!command || values.yes) continue
    const now = stopIfCancelled(await confirm({ message: `Sign in to sepiace from ${login.label} now?`, initialValue: true }))
    if (now) spawnSync(command[0], command[1], { stdio: 'inherit', shell: process.platform === 'win32' })
  }

  note(
    [
      'Start a new session and ask your agent:',
      '  "Remember that I prefer short answers."',
      '',
      'To move the memories your agent already has into sepiace:',
      '  Claude Code   /sepiace:migrate',
      '  Others        "Use the sepiace-migrate skill" (Codex: the migrate skill)',
    ].join('\n'),
    'Next',
  )
  outro('See every request and connected client at https://hi.sepiace.io')
}

main().catch((error: unknown) => {
  log.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
