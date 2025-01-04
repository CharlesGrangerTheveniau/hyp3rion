<template>
    <UTooltip 
        :text="isDark ? 'LIGHT' : 'DARK'" 
        :kbds="['l']" 
        :content="{ align: 'center', side: 'right', sideOffset: 30 }" 
        :ui="{
            'text': 'text-lg font-semibold',
            'kbdsSize': 'lg',
            'content': 'h-[40px]'
        }"
        >
        <ClientOnly v-if="!colorMode?.forced">
            <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="isDark = !isDark"
            />

            <template #fallback>
            <div class="size-8" />
            </template>
        </ClientOnly>
    </UTooltip>
</template>

<script lang="ts" setup>

    const colorMode = useColorMode()


    // ----------------
    // Computed Properties
    // ----------------
    /**
     * Controls the dark/light theme toggle
     */
    const isDark = computed({
        get: () => colorMode.value === 'dark',
        set: (value) => colorMode.value = value ? 'dark' : 'light'
    })
</script>