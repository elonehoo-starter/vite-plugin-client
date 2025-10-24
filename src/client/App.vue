<script setup lang="ts">
defineOptions({
  name: 'App',
})
</script>

<template>
  <main class="h-full w-screen grid grid-row-[min-content_1fr]">
    <Suspense>
      <RouterView />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </main>
</template>
