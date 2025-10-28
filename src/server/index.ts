import type { Plugin } from 'vite'
import type { RpcFunctions } from '../type'
import sirv from 'sirv'
import { DIR_CLIENT } from '../dirs'
import { countFiles } from './utils/count-files'

// Referencing vite-plugin-inspect's approach: serve a simple client under __client
// and create a dev-time RPC channel using vite-dev-rpc.
export function vitePluginClient(): Plugin {
  return {
    name: 'vite-plugin-client',
    enforce: 'pre',
    configureServer(server) {
      const baseUrl = '__client'

      // Serve the lightweight client UI (optional) at /__client
      server.middlewares.use(`/${baseUrl}`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
      }))

      server.middlewares.use(`/${baseUrl}_api`, async (req, res, next) => {
        if (!req.url) {
          return next()
        }

        if (req.url === '/') {
          const fileList = await countFiles(server.config.root)
          const info = {
            count: fileList,
          }
          res.setHeader('Content-Type', 'application/json')
          res.write(JSON.stringify(info))
          res.end()
          return
        }

        next()
      })
    },
  }
}

// Backward-compatible factory name used by the playground
export function PluginStart(): Plugin {
  return vitePluginClient()
}
