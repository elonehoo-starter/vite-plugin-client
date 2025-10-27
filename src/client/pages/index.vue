<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { rpc } from '../logic/rpc'

defineOptions({
  name: 'IndexPage',
})

const fileCount = ref<number | null>(null)
const loading = ref(true)
const error = ref<string>()

onMounted(async () => {
  try {
    fileCount.value = await rpc.getProjectFileCount()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 px-6 py-10">
    <h1 class="text-2xl font-semibold">
      Vite Plugin Starter
    </h1>
    <p v-if="loading" class="text-gray-500">
      Loading project information...
    </p>
    <p v-else-if="error" class="text-red-500">
      Failed to fetch project file count: {{ error }}
    </p>
    <p v-else class="text-lg">
      This project currently contains
      <span class="font-bold">{{ fileCount }}</span>
      files.
    </p>
  </div>
</template>
