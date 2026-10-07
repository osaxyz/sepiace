import { existsSync, readFileSync } from 'node:fs'
import { readFile, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { writeAtomically } from './config.ts'

// プラグインのスキルの本文。ビルドのときに埋め込む。tsx やテストで直接動かしたときは、プラグインのファイルから読む。
// 非公開側では apps/plugins/sepiace に、公開側ではリポジトリのルートにプラグインがある。
declare const __SKILL_MEMORY__: string | undefined
declare const __SKILL_MIGRATE__: string | undefined

const fromPlugin = (name: string) => {
  const url = ['../../plugins/sepiace/', '../../']
    .map((root) => new URL(`${root}skills/${name}/SKILL.md`, import.meta.url))
    .find((candidate) => existsSync(candidate))
  if (!url) throw new Error(`The ${name} skill of the plugin was not found`)
  return readFileSync(url, 'utf8')
}

// 共有のスキルの置き場所では、ほかのスキルと名前がぶつからないよう sepiace- を頭に付ける。
const MEMORY = (typeof __SKILL_MEMORY__ === 'string' ? __SKILL_MEMORY__ : fromPlugin('memory'))
  .replace(/^name: memory$/m, 'name: sepiace-memory')
  .replace('use the `migrate` skill', 'use the `sepiace-migrate` skill')
const MIGRATE = (typeof __SKILL_MIGRATE__ === 'string' ? __SKILL_MIGRATE__ : fromPlugin('migrate')).replace(/^name: migrate$/m, 'name: sepiace-migrate')

export const SKILLS = [
  { name: 'sepiace-memory', text: MEMORY },
  { name: 'sepiace-migrate', text: MIGRATE },
] as const

// 0.1.1 までは、使い方のスキルを sepiace という名前で置いていた。自分で置いたものと確かめられたときだけ片付ける。
const OLD_SKILL = 'sepiace'
const OLD_SKILL_HEAD = "---\nname: sepiace\ndescription: Use sepiace, the user's long-term memory"

const removeOldSkill = async (dir: string) => {
  const old = join(dir, OLD_SKILL)
  const file = join(old, 'SKILL.md')
  if (!existsSync(file)) return false
  if ((await readdir(old)).length !== 1) return false
  if (!(await readFile(file, 'utf8')).startsWith(OLD_SKILL_HEAD)) return false
  await rm(old, { recursive: true })
  return true
}

// dir の下に sepiace-memory と sepiace-migrate のスキルを置く。同じ中身ならそのままにし、変えたスキルの数を返す。
export const installSkills = async (dir: string) => {
  let changed = 0
  for (const skill of SKILLS) {
    const path = join(dir, skill.name, 'SKILL.md')
    if (existsSync(path) && (await readFile(path, 'utf8')) === skill.text) continue
    await writeAtomically(path, skill.text)
    changed += 1
  }
  if (await removeOldSkill(dir)) changed += 1
  return changed
}
