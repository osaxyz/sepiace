import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parse } from 'jsonc-parser'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MCP_URL, install } from '../src/clients.ts'
import { describeServer, putServer } from '../src/config.ts'
import { SKILLS, installSkills } from '../src/skills.ts'

let home: string
const saved = { HOME: process.env.HOME, XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME, APPDATA: process.env.APPDATA }

beforeEach(() => {
  // 本物の設定に触れないよう、一時的なディレクトリをホームにする。
  home = mkdtempSync(join(tmpdir(), 'sepiace-cli-'))
  process.env.HOME = home
  process.env.APPDATA = join(home, 'AppData', 'Roaming')
  delete process.env.XDG_CONFIG_HOME
})

afterEach(() => {
  for (const [key, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

const never = async () => {
  throw new Error('置き換えるかを尋ねてはいけない')
}
const read = (path: string) => parse(readFileSync(path, 'utf8'))

describe('設定ファイルへの書き足し', () => {
  it('ファイルがなければ作り、最初の中身の下にサーバーを足す', async () => {
    const file = join(home, 'a', 'config.json')
    expect(await putServer(file, ['mcp', 'sepiace'], { url: MCP_URL }, never, { $schema: 'x' })).toBe('added')
    expect(read(file)).toEqual({ $schema: 'x', mcp: { sepiace: { url: MCP_URL } } })
  })

  it('コメント、並び順、ほかのサーバーを残す', async () => {
    const file = join(home, 'mcp.json')
    writeFileSync(file, '{\n  // 手で書いたコメント\n  "servers": {\n    "other": { "type": "stdio", "command": "x" },\n  },\n  "inputs": []\n}\n')
    expect(await putServer(file, ['servers', 'sepiace'], { type: 'http', url: MCP_URL }, never)).toBe('added')
    const text = readFileSync(file, 'utf8')
    expect(text).toContain('// 手で書いたコメント')
    expect(read(file)).toEqual({ servers: { other: { type: 'stdio', command: 'x' }, sepiace: { type: 'http', url: MCP_URL } }, inputs: [] })
  })

  it('同じ URL のサーバーがあれば触らない', async () => {
    const file = join(home, 'mcp.json')
    const original = `{ "mcpServers": { "sepiace": { "url": "${MCP_URL}" } } }`
    writeFileSync(file, original)
    expect(await putServer(file, ['mcpServers', 'sepiace'], { url: MCP_URL }, never)).toBe('exists')
    expect(readFileSync(file, 'utf8')).toBe(original)
  })

  it('別の中身なら尋ね、断られたら残し、了承されたら置き換える', async () => {
    const file = join(home, 'opencode.json')
    const old = { type: 'remote', url: `${MCP_URL}?key=mem_secret`, enabled: true }
    writeFileSync(file, JSON.stringify({ mcp: { sepiace: old } }))
    const seen: unknown[] = []
    expect(await putServer(file, ['mcp', 'sepiace'], { type: 'remote', url: MCP_URL, enabled: true }, async (c) => (seen.push(c), false))).toBe('kept')
    expect(read(file).mcp.sepiace).toEqual(old)
    expect(await putServer(file, ['mcp', 'sepiace'], { type: 'remote', url: MCP_URL, enabled: true }, async () => true)).toBe('replaced')
    expect(read(file).mcp.sepiace).toEqual({ type: 'remote', url: MCP_URL, enabled: true })
    expect(seen).toEqual([old])
  })

  it('読めない設定ファイルは書き換えずに止める', async () => {
    const file = join(home, 'broken.json')
    writeFileSync(file, '{ "mcp": ')
    await expect(putServer(file, ['mcp', 'sepiace'], { url: MCP_URL }, never)).rejects.toThrow(/Could not read/)
    expect(readFileSync(file, 'utf8')).toBe('{ "mcp": ')
  })

  it('置き換えるかを尋ねるときに、URL のクエリの鍵を見せない', () => {
    expect(describeServer({ url: 'https://hi.sepiace.io/api/v1/mcp?key=mem_secret' })).toBe('https://hi.sepiace.io/api/v1/mcp?…')
    expect(describeServer({ command: 'npx' })).toBe('the command npx')
  })
})

describe('スキル', () => {
  it('sepiace-memory と sepiace-migrate を置き、同じ中身なら書き直さない', async () => {
    const dir = join(home, 'skills')
    expect(await installSkills(dir)).toBe(2)
    expect(await installSkills(dir)).toBe(0)
    const migrate = readFileSync(join(dir, 'sepiace-migrate', 'SKILL.md'), 'utf8')
    expect(migrate).toMatch(/^name: sepiace-migrate$/m)
    const memory = readFileSync(join(dir, 'sepiace-memory', 'SKILL.md'), 'utf8')
    expect(memory).toMatch(/^name: sepiace-memory$/m)
    expect(memory).toContain('`sepiace-migrate` skill')
    expect(SKILLS.map((s) => s.name)).toEqual(['sepiace-memory', 'sepiace-migrate'])
  })

  it('前の版が置いた sepiace のスキルは片付けるが、ほかの人が置いたものには触らない', async () => {
    const dir = join(home, 'skills')
    mkdirSync(join(dir, 'sepiace'), { recursive: true })
    writeFileSync(join(dir, 'sepiace', 'SKILL.md'), "---\nname: sepiace\ndescription: Use sepiace, the user's long-term memory, through its MCP tool.\n---\n")
    await installSkills(dir)
    expect(existsSync(join(dir, 'sepiace'))).toBe(false)

    const other = join(home, 'other')
    mkdirSync(join(other, 'sepiace'), { recursive: true })
    writeFileSync(join(other, 'sepiace', 'SKILL.md'), '---\nname: sepiace\ndescription: My own notes.\n---\n')
    await installSkills(other)
    expect(existsSync(join(other, 'sepiace', 'SKILL.md'))).toBe(true)
  })
})

describe('クライアント', () => {
  it('Cursor の mcp.json に URL だけで足し、スキルを ~/.cursor/skills に置く', async () => {
    const result = await install('cursor', never)
    expect(result.kind).toBe('added')
    expect(read(join(home, '.cursor', 'mcp.json'))).toEqual({ mcpServers: { sepiace: { url: MCP_URL } } })
    expect(readFileSync(join(home, '.cursor', 'skills', 'sepiace-memory', 'SKILL.md'), 'utf8')).toMatch(/^name: sepiace-memory$/m)
    expect((await install('cursor', never)).kind).toBe('exists')
  })

  it('VS Code のユーザーの mcp.json に http のサーバーとして足し、スキルを ~/.copilot/skills に置く', async () => {
    const dir =
      process.platform === 'darwin'
        ? join(home, 'Library', 'Application Support', 'Code', 'User')
        : process.platform === 'win32'
          ? join(home, 'AppData', 'Roaming', 'Code', 'User')
          : join(home, '.config', 'Code', 'User')
    expect((await install('vscode', never)).kind).toBe('manual')
    mkdirSync(dir, { recursive: true })
    expect((await install('vscode', never)).kind).toBe('added')
    expect(read(join(dir, 'mcp.json'))).toEqual({ servers: { sepiace: { type: 'http', url: MCP_URL } } })
    expect(readFileSync(join(home, '.copilot', 'skills', 'sepiace-migrate', 'SKILL.md'), 'utf8')).toMatch(/^name: sepiace-migrate$/m)
  })

  it('OpenCode の設定に remote のサーバーとして足し、opencode.jsonc があればそちらに書く', async () => {
    const dir = join(home, '.config', 'opencode')
    expect((await install('opencode', never)).kind).toBe('added')
    expect(read(join(dir, 'opencode.json'))).toEqual({ $schema: 'https://opencode.ai/config.json', mcp: { sepiace: { type: 'remote', url: MCP_URL, enabled: true } } })
    expect(readFileSync(join(dir, 'skills', 'sepiace-memory', 'SKILL.md'), 'utf8')).toMatch(/^name: sepiace-memory$/m)

    writeFileSync(join(dir, 'opencode.jsonc'), '{\n  // jsonc\n  "theme": "x"\n}\n')
    expect((await install('opencode', never)).kind).toBe('added')
    expect(read(join(dir, 'opencode.jsonc'))).toEqual({ theme: 'x', mcp: { sepiace: { type: 'remote', url: MCP_URL, enabled: true } } })
  })

  it('Claude Desktop は、コネクタの画面で足す手順を返す', async () => {
    expect(await install('claude-desktop', never)).toMatchObject({ kind: 'manual', snippet: MCP_URL })
  })
})
