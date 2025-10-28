import type { Plugin } from 'vite'
import type { RpcFunctions } from '../type'
import sirv from 'sirv'
import { createRPCServer } from 'vite-dev-rpc'
import { DIR_CLIENT } from '../dirs'
import { countFiles } from './utils/count-files'

// Referencing vite-plugin-inspect's approach: serve a simple client under __client
// and create a dev-time RPC channel using vite-dev-rpc.
export function vitePluginClient(): Plugin {
  return {
    name: 'vite-plugin-client',
    enforce: 'pre',
    configureServer(server) {
      const base = server.config.base || '/'

      // Serve the lightweight client UI (optional) at /__client
      server.middlewares.use(`${base}__client`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
      }))

      const rpc: RpcFunctions = {
        async getProjectFileCount() {
          return await countFiles(server.config.root)
        },
      }

      createRPCServer<Record<string, never>, RpcFunctions>(
        'vite-plugin-client',
        server.ws,
        rpc,
      )
    },
  }
}

// Backward-compatible factory name used by the playground
export function PluginStart(): Plugin {
  return vitePluginClient()
}
