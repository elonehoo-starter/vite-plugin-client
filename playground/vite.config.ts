import { defineConfig } from 'vite'
import { PluginStart } from 'vite-plugin'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    PluginStart(),
  ],
})
