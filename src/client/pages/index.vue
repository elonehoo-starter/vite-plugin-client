<script setup lang="ts">
import { infoFetch } from '../logic/fetch'

defineOptions({
  name: 'IndexPage',
})

const number = infoFetch.data
</script>

<template>
  <div class="flex flex-col gap-2 px-6 py-10">
    <h1 class="text-2xl font-semibold">
      Vite Plugin Starter
    </h1>
    <p class="text-lg">
      This project currently contains
      <span class="font-bold">{{ number }}</span>
      files.
    </p>
  </div>
</template>
