import type { Plugin } from 'vite'
import c from 'ansis'
import sirv from 'sirv'
import { DIR_CLIENT } from '../dirs'

export function PluginStart(): Plugin {
  const plugin: Plugin = {
    name: 'vite-plugin-starter',
    enforce: 'pre',
    configureServer(server) {
      const config = server.config
      const base = server.config.base || '/'

      server.middlewares.use(`${base}__start`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
      }))

      const _print = server.printUrls

      server.printUrls = () => {
        let host = `${config.server.https ? 'https' : 'http'}://localhost:${config.server.port || '80'}`

        const url = server.resolvedUrls?.local[0]

        if (url) {
          try {
            const u = new URL(url)
            host = `${u.protocol}//${u.host}`
          }
          catch (error) {
            config.logger.warn(`Parse resolved url failed: ${error}`)
          }
        }

        _print()

        const colorUrl = (url: string) => c.green(url.replace(/:(\d+)\//, (_, port) => `:${c.bold(port)}/`))

        config.logger.info(`  ${c.green('➜')}  ${c.bold('Inspect')}: ${colorUrl(`${host}${base}__start/`)}`)
      }
    },
  }

  return plugin
}
