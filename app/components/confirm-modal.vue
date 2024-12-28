<template>
  <UModal :prevent-close="props.preventClose">
    <template #header>
      <div class="flex flex-row items-center gap-4">
        <UIcon name="i-lucide-rocket text-2xl" />
        <h1 class="text-2xl font-bold">{{ props.label }}</h1>
      </div>
    </template>
    <template #body>
      <p>We'll notify by email when they grant you access.</p>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        label: string
        preventClose: boolean
    }>()
</script>

<style>

</style>