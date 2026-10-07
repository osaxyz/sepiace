import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { type ParseError, applyEdits, findNodeAtLocation, getNodeValue, modify, parseTree, printParseErrorCode } from 'jsonc-parser'

// クライアントの JSON の設定ファイルに、MCP サーバーを1つだけ書き足す。
// コメントや並び順、ほかのサーバーは残す。VS Code と OpenCode の設定はコメントを含みうるので、JSONC として読む。

export type Change = 'added' | 'exists' | 'replaced' | 'kept'

// 書き足す前に、同じ名前で別の中身のサーバーがあったときに、置き換えてよいかを尋ねる。
export type AskReplace = (current: unknown) => Promise<boolean>

const FORMAT = { formattingOptions: { insertSpaces: true, tabSize: 2, eol: '\n' } }

export const readConfig = async (path: string) => {
  const text = existsSync(path) ? await readFile(path, 'utf8') : ''
  // ないファイルと空のファイルは、何も書いていない設定として扱う。
  if (text.trim() === '') return { text, tree: undefined }
  const errors: ParseError[] = []
  const tree = parseTree(text, errors, { allowTrailingComma: true })
  if (errors.length > 0) throw new Error(`Could not read ${path}: ${printParseErrorCode(errors[0]!.error)} at offset ${errors[0]!.offset}`)
  if (tree && tree.type !== 'object') throw new Error(`${path} is not a JSON object`)
  return { text, tree }
}

export const valueAt = (tree: ReturnType<typeof parseTree>, path: string[]): unknown => {
  const node = tree ? findNodeAtLocation(tree, path) : undefined
  return node ? getNodeValue(node) : undefined
}

// 一時ファイルに書いてから置き換える。途中で止まっても、元の設定ファイルは壊れない。元のファイルの権限は引き継ぐ。
export const writeAtomically = async (path: string, text: string) => {
  await mkdir(dirname(path), { recursive: true })
  const mode = existsSync(path) ? (await stat(path)).mode & 0o777 : 0o644
  const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`)
  await writeFile(temporary, text, { mode, flag: 'wx' })
  await rename(temporary, path)
}

// path の位置に entry を書く。すでに同じ URL のサーバーがあれば触らない。別の中身なら ask で確かめてから置き換える。
// initial は、設定ファイルがないときに最初に入れる中身（OpenCode の $schema など）。
export const putServer = async (
  file: string,
  path: string[],
  entry: { url: string } & Record<string, unknown>,
  ask: AskReplace,
  initial: Record<string, unknown> = {},
): Promise<Change> => {
  const { text, tree } = await readConfig(file)
  const current = valueAt(tree, path)
  if (current !== undefined) {
    if (typeof current === 'object' && current !== null && (current as { url?: unknown }).url === entry.url) return 'exists'
    if (!(await ask(current))) return 'kept'
  }
  let next = text.trim() === '' ? `${JSON.stringify(initial, null, 2)}\n` : text
  next = applyEdits(next, modify(next, path, entry, FORMAT))
  await writeAtomically(file, next.endsWith('\n') ? next : `${next}\n`)
  return current === undefined ? 'added' : 'replaced'
}

// 置き換えるかを尋ねるときに見せる、今の設定の要約。URL のクエリには鍵が入っていることがあるので、伏せる。
export const describeServer = (current: unknown) => {
  if (typeof current !== 'object' || current === null) return JSON.stringify(current)
  const { url, command } = current as { url?: unknown; command?: unknown }
  if (typeof url === 'string') {
    try {
      const parsed = new URL(url)
      return `${parsed.origin}${parsed.pathname}${parsed.search ? '?…' : ''}`
    } catch {
      return 'a URL that could not be read'
    }
  }
  if (typeof command === 'string') return `the command ${command}`
  return 'another server'
}
