// npm に公開するパッケージ sepiace のビルド。osaxyz/nyquist の scripts/bundle.mjs と同じ作り。
// 公開リポジトリでも同じようにビルドできるよう、このディレクトリの中に置く。
// 依存をすべて1つのファイルにまとめ、公開するパッケージが依存を持たないようにする。
// 同梱した依存のライセンスを dist/THIRD_PARTY_LICENSES.md に書き出し、公開する tarball に入れる。
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const LICENSE_FILE = /^(licen[sc]e|copying|notice)(\.(md|txt))?$/i

// 同梱したファイルが属する npm パッケージのディレクトリを、node_modules の中から探す。
const packageDir = (file) => {
  let dir = dirname(file)
  while (dir.includes('node_modules')) {
    if (existsSync(join(dir, 'package.json'))) {
      const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
      if (manifest.name && manifest.version) return dir
    }
    dir = dirname(dir)
  }
  return null
}

const notices = (inputs, cwd) => {
  const packages = new Map()
  for (const input of inputs) {
    const dir = packageDir(join(cwd, input))
    if (!dir || packages.has(dir)) continue
    const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    const texts = readdirSync(dir)
      .filter((name) => LICENSE_FILE.test(name))
      .map((name) => readFileSync(join(dir, name), 'utf8').trim())
    packages.set(dir, { name: manifest.name, version: manifest.version, license: manifest.license ?? 'UNKNOWN', texts })
  }
  const sorted = [...packages.values()].sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version))
  const unknown = sorted.filter((entry) => entry.texts.length === 0)
  if (unknown.length > 0) {
    throw new Error(`ライセンスの本文が見つからない依存があります: ${unknown.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`)
  }
  return [
    '# Third-party licenses',
    '',
    'dist/index.js bundles the following packages. Their licenses are reproduced below.',
    '',
    ...sorted.flatMap((entry) => [`## ${entry.name}@${entry.version} (${entry.license})`, '', '```', ...entry.texts, '```', '']),
  ].join('\n')
}

export const bundle = async (build, { cwd, define = {} }) => {
  const result = await build({
    absWorkingDir: cwd,
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    outfile: 'dist/index.js',
    define,
    // 依存に ES モジュール版があれば、そちらを束ねる。jsonc-parser の UMD 版は、中の require を esbuild が追えない。
    mainFields: ['module', 'main'],
    metafile: true,
    // 依存のライセンスは THIRD_PARTY_LICENSES.md にまとめるので、コードの中のコメントは残さない。
    legalComments: 'none',
    // CommonJS の依存が require を呼ぶので、ESM の出力でも使えるよう require を用意しておく。
    banner: {
      js: ['#!/usr/bin/env node', "import { createRequire } from 'node:module'", 'const require = createRequire(import.meta.url)'].join('\n'),
    },
  })
  writeFileSync(join(cwd, 'dist/THIRD_PARTY_LICENSES.md'), notices(Object.keys(result.metafile.inputs), cwd))
  console.log(`${relative(ROOT, join(cwd, 'dist/index.js'))}: ${Object.keys(result.metafile.inputs).length} files bundled`)
}
