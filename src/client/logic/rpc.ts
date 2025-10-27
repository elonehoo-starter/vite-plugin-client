import type { RpcFunctions } from '../../type'
import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'

const base = `${location.pathname.split('/__start')[0] || ''}/`.replace(/\/\//g, '/')
const hot = createHotContext('/___', base)

export const rpc = createRPCClient<RpcFunctions, any>(
  'vite-plugin-starter',
  hot,
)
