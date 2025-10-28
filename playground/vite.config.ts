import { defineConfig } from 'vite'
import { PluginStart } from 'vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Inspect(),
    PluginStart(),
  ],
})
