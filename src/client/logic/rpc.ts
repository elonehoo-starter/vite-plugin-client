import type { RpcFunctions } from '../../type'
import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'

// Align with the server which serves UI under /__client
const base = `${location.pathname.split('/__client')[0] || ''}/`.replace(/\/\//g, '/')
const hot = createHotContext('/___', base)

export const rpc = createRPCClient<RpcFunctions, RpcFunctions>(
  'vite-plugin-client',
  hot,
)
