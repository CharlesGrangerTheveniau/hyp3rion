<template>
  <div 
    class="flex flex-row items-center justify-between p-6 border border-gray-700 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors mb-4 cursor-pointer"
    @click="$emit('select', authority)"
  >
    <div class="flex flex-row items-center gap-4">
      <div class="bg-emerald-500/20 p-4 rounded-lg">
        <UIcon 
          :name="authority.type === 'Firm' ? 'map:lawyer' : 'hugeicons:corporate'" 
          class="text-emerald-500 w-3 h-3"
        />
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="text-xl font-semibold">{{ authority.name }}</span>
          <span class="text-sm text-gray-400">{{ authority.company?.siren }}</span>
        </div>
        <span class="text-sm text-gray-400">{{ authority.company?.address }}</span>
      </div>
    </div>
    
    <UButton 
      color="primary"
      variant="ghost" 
      class="flex items-center gap-2"
    >
      {{ props.buttonLabel }}
      <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import type { Authority } from './no-permissions-modal.vue';


const props = defineProps<{
  authority: Authority
  buttonLabel: string
}>()


console.log(props.authority)
defineEmits<{
  select: [authority: Authority]
}>()
</script> 