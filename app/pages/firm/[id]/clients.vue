<template>
    <div>
        <header class="app-header">
        <div class="h-[150px] flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <h1 class="text-2xl font-bold">Clients</h1>
        </div>
        </header>

        <main class="app-main">
        <div class="flex flex-col gap-4">
            <h2>Clients</h2>
        </div>
        </main>
  </div>
</template>

<script lang="ts" setup>
    definePageMeta({
        layout: 'firm-dashboard'
    })
</script>