<template>

        <div v-if="!text" class="flex items-center gap-4">
            <div class="h-px bg-gray-700 flex-1"/>
        </div>

        <!-- Text && Left -->
        <div v-else-if="text && textAlign === 'left'" class="flex items-center gap-4">
            <span class="text-gray-500 text-sm">{{ text }}</span>
            <div class="h-px bg-gray-700 flex-1"/>
        </div>

        <!-- Text && Center -->
        <div v-else-if="text && textAlign === 'center'" class="flex items-center gap-4">
            <div class="h-px bg-gray-700 flex-1"/>
            <span class="text-gray-500 text-sm">{{ text }}</span>
            <div class="h-px bg-gray-700 flex-1"/>
        </div>

        <!-- Text && Right -->
        <div v-else-if="text && textAlign === 'right'" class="flex items-center gap-4">
            <div class="h-px bg-gray-700 flex-1"/>
            <span class="text-gray-500 text-sm">{{ text }}</span>
        </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        text?: string
        textAlign?: 'left' | 'right' | 'center'
    }>()

    const textAlign = computed(() => {
        return props.textAlign || 'center'
    })

</script>