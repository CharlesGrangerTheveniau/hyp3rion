<!-- eslint-disable vue/no-multiple-template-root -->
<template>
    <header class="app-header">
      <div class="h-[150px] flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div v-if="user" class="flex flex-col gap-4">
          <h1 class="text-2xl font-bold">Hello, {{ user.firstName }} 👋</h1>
          <p> {{ currentDate }}</p>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="flex flex-col gap-4">
        <h2>Clients</h2>
      </div>
    </main>
    
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'firm-dashboard'
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
</script>

<style>

</style>