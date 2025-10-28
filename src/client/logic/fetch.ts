import { useFetch } from '@vueuse/core'

const API_ROOT = '/__client_api'

export const infoFetch = useFetch(API_ROOT).json<{
  count: number
}>()
