import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { writeAtomically } from './config.ts'

// プラグインのスキルの本文。ビルドのときに埋め込む。tsx やテストで直接動かしたときは、プラグインのファイルから読む。
// 非公開側では apps/plugins/sepiace に、公開側ではリポジトリのルートにプラグインがある。
declare const __SKILL_SEPIACE__: string | undefined
declare const __SKILL_MIGRATE__: string | undefined

const fromPlugin = (name: string) => {
  const url = ['../../plugins/sepiace/', '../../']
    .map((root) => new URL(`${root}skills/${name}/SKILL.md`, import.meta.url))
    .find((candidate) => existsSync(candidate))
  if (!url) throw new Error(`The ${name} skill of the plugin was not found`)
  return readFileSync(url, 'utf8')
}

const SEPIACE = (typeof __SKILL_SEPIACE__ === 'string' ? __SKILL_SEPIACE__ : fromPlugin('sepiace')).replace('use the `migrate` skill', 'use the `sepiace-migrate` skill')
// 共有のスキルの置き場所では、ほかのスキルと名前がぶつからないよう sepiace-migrate にする。
const MIGRATE = (typeof __SKILL_MIGRATE__ === 'string' ? __SKILL_MIGRATE__ : fromPlugin('migrate')).replace(/^name: migrate$/m, 'name: sepiace-migrate')

export const SKILLS = [
  { name: 'sepiace', text: SEPIACE },
  { name: 'sepiace-migrate', text: MIGRATE },
] as const

// dir の下に sepiace と sepiace-migrate のスキルを置く。同じ中身ならそのままにし、変えたスキルの数を返す。
export const installSkills = async (dir: string) => {
  let changed = 0
  for (const skill of SKILLS) {
    const path = join(dir, skill.name, 'SKILL.md')
    if (existsSync(path) && (await readFile(path, 'utf8')) === skill.text) continue
    await writeAtomically(path, skill.text)
    changed += 1
  }
  return changed
}
