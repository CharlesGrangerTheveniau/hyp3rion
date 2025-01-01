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
        <UButton
            :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" 
            variant="ghost"
            color="neutral"
            title="Toggle theme"
            size="lg"
            :ui="{
                leadingIcon: 'size-6 text-neutral-500'
            }"
            @click="isDark = !isDark"
        />
    </UTooltip>
</template>

<script lang="ts" setup>

    const colorMode = useColorMode()

    defineShortcuts({
        l: () => {
            isDark.value = !isDark.value
        }
    })

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