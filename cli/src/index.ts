import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { cancel, confirm, intro, isCancel, log, multiselect, note, outro, spinner } from '@clack/prompts'
import { CLIENTS, type ClientId, LOGIN, MCP_URL, install } from './clients.ts'
import { describeServer } from './config.ts'

// npm create sepiace の本体。手元のエージェントのクライアントを見つけ、選んだものに sepiace をつなぎ、ログインと記憶の移行を案内する。

declare const __VERSION__: string | undefined
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'dev'

const HELP = `Usage: npm create sepiace [-- options]

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
  const looking = spinner()
  looking.start('Looking for clients on this machine')
  const found = (await Promise.all(CLIENTS.map(async (client) => ((await client.detect()) ? client.value : undefined)))).filter(
    (value): value is ClientId => value !== undefined,
  )
  looking.stop(found.length > 0 ? `Found ${found.map(labelOf).join(', ')}` : 'No clients were found')
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

const labelOf = (client: ClientId) => CLIENTS.find((c) => c.value === client)!.label

// 同じ名前で別の中身のサーバーがあれば、置き換えてよいかを尋ねる。--yes のときは置き換えない。
// 尋ねるあいだはスピナーを止め、答えたら続ける。
const askReplace = (label: string, progress: ReturnType<typeof spinner>) => async (current: unknown) => {
  if (values.yes) return false
  progress.stop(`${label} already has a sepiace server`)
  const answer = stopIfCancelled(
    await confirm({
      message: `Replace the sepiace server in ${label}?\n  Now: ${describeServer(current)}\n  New: ${MCP_URL}`,
      initialValue: true,
    }),
  )
  progress.start(`Connecting ${label}`)
  return answer
}

type Connected = { client: ClientId; label: string; login: string }

// 1つずつつなぎ、処理中はスピナーを出し、終わったら結果を1行で出す。
const connect = async (chosen: ClientId[]): Promise<Connected[]> => {
  const connected: Connected[] = []
  for (const client of chosen) {
    const label = labelOf(client)
    const progress = spinner()
    progress.start(`Connecting ${label}`)
    try {
      const result = await install(client, askReplace(label, progress))
      if (result.kind === 'manual') {
        progress.stop(`${label} needs a step by hand`)
        log.warn(result.message)
        note(result.snippet)
      } else if (result.kind === 'kept') {
        progress.stop(result.message)
      } else {
        progress.stop(result.message)
        if ('warning' in result && result.warning) log.warn(result.warning)
        connected.push({ client, label, login: result.login })
      }
    } catch (error) {
      progress.error(`${label}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return connected
}

// ログインはクライアントごとに1つずつ進める。CLI でログインできるクライアントはその場でブラウザを開き、
// アプリの画面で済ませるクライアントは手順を出して、終わったら Enter で次へ進む。
const signIn = async (connected: Connected[]) => {
  if (values.yes) {
    const later = (c: Connected) => {
      const command = LOGIN[c.client]
      return command ? `Run \`${command.command} ${command.args.join(' ')}\` and sign in in the browser.` : c.login
    }
    note(connected.map((c) => `${c.label}: ${later(c)}`).join('\n'), 'Sign in later')
    return
  }
  for (const { client, label, login } of connected) {
    const command = LOGIN[client]
    if (command) {
      const now = stopIfCancelled(await confirm({ message: `Sign in to sepiace from ${label}? This opens your browser.`, active: 'Sign in', inactive: 'Skip' }))
      if (!now) continue
      if (command.ready) {
        const waiting = spinner()
        waiting.start(`Waiting for ${label} to load sepiace`)
        const ready = await command.ready()
        if (ready) waiting.stop(`${label} loaded sepiace`)
        else waiting.error(`${label} has not loaded sepiace yet`)
        if (!ready) {
          log.info(`Run \`${command.command} ${command.args.join(' ')}\` later to sign in.`)
          continue
        }
      }
      spawnSync(command.command, command.args, { stdio: 'inherit', shell: process.platform === 'win32' })
    } else {
      stopIfCancelled(await confirm({ message: `${label}: ${login}`, active: 'Done', inactive: 'Later' }))
    }
  }
}

// 最後に、つないだクライアントに合わせて、手元の記憶を移す方法を出す。
const MIGRATE_HINT: Record<ClientId, string> = {
  'claude-code': 'run /sepiace:migrate',
  codex: 'ask it to use the migrate skill of the sepiace plugin',
  cursor: 'ask it to use the sepiace-migrate skill',
  vscode: 'ask it to use the sepiace-migrate skill',
  opencode: 'ask it to use the sepiace-migrate skill',
  'claude-desktop': '',
}

const main = async () => {
  intro(`sepiace ${VERSION}`)
  const chosen = await chooseClients()
  if (chosen.length === 0) {
    outro('No clients were found. Run `npm create sepiace -- --client <id>` to choose one.')
    return
  }
  const connected = await connect(chosen)
  if (connected.length > 0) await signIn(connected)
  const migrate = connected.filter((c) => MIGRATE_HINT[c.client]).map((c) => `  ${c.label}: ${MIGRATE_HINT[c.client]}`)
  note(
    [
      'Start a new session and ask your agent:',
      '  "Remember that I prefer short answers."',
      ...(migrate.length > 0 ? ['', 'To move what your agent already remembers into sepiace:', ...migrate] : []),
    ].join('\n'),
    'Next',
  )
  outro('See every request and connected client at https://hi.sepiace.io')
}

main().catch((error: unknown) => {
  log.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
