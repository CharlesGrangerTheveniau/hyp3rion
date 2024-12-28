<template>
  <div 
    class="flex flex-row items-center justify-between p-6 border border-gray-700 rounded-lg bg-gray-900/50 transition-colors mb-4">
    <div class="flex flex-row items-center gap-4">
      <div class="bg-emerald-500/20 p-4 rounded-lg">
        <UIcon 
          :name="props.authority.type === 'firm' ? 'map:lawyer' : 'hugeicons:corporate'" 
          class="text-emerald-500 w-3 h-3"
        />
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="text-xl font-semibold">{{ props.authority.name }}</span>
          <span class="text-sm text-gray-400">{{ props.authority.company?.siren }}</span>
        </div>
        <span class="text-sm text-gray-400">{{ props.authority.company?.address }}</span>
      </div>
    </div>

    <slot name="action" />
  </div>
</template>

<script lang="ts" setup>
import type { Authority } from '~~/server/types';

const props = defineProps<{
  authority: Authority
}>()

</script> 