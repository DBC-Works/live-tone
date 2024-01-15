import * as path from 'path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  test: {
    globals: true,
    root: 'src',
    environment: 'happy-dom',
    alias: [
      {
        find: /.*\.svg/,
        replacement: path.resolve(__dirname, './src/__mock__/svg.tsx'),
      },
      {
        find: /^tone$/,
        replacement: path.resolve(__dirname, './src/__mock__/tone.ts'),
      },
    ],
    coverage: {
      exclude: ['__mock__', '**/types.ts', 'main.tsx', 'vite-env.d.ts'],
    },
  },
})
