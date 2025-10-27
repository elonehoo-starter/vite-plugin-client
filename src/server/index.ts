import type { Plugin } from 'vite'
import type { RpcFunctions } from '../type'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import c from 'ansis'
import sirv from 'sirv'
import { createRPCServer } from 'vite-dev-rpc'
import { DIR_CLIENT } from '../dirs'

const IGNORED_DIRECTORIES = new Set([
  '.git',
  'dist',
  'node_modules',
])

async function countFiles(root: string): Promise<number> {
  let total = 0

  let entries: Awaited<ReturnType<typeof readdir>>
  try {
    entries = await readdir(root, { withFileTypes: true })
  }
  catch {
    return 0
  }

  for (const entry of entries) {
    if (entry.isSymbolicLink())
      continue

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name))
        continue
      total += await countFiles(join(root, entry.name))
    }
    else if (entry.isFile()) {
      total += 1
    }
  }

  return total
}

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

      const rpc: RpcFunctions = {
        async getProjectFileCount() {
          return await countFiles(server.config.root)
        },
      }

      createRPCServer<RpcFunctions, Record<string, never>>(
        'vite-plugin-starter',
        server.ws,
        rpc,
      )

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
