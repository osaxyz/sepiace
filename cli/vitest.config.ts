import { defineConfig } from 'vitest/config'

// 上のディレクトリの設定を拾わないよう、この CLI の設定をここに置く。
export default defineConfig({ test: { include: ['test/**/*.test.ts'] } })
