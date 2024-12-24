<template>
    <div>
        <div class="flex justify-between mb-4">
            <UButton 
                v-if="type === 'desktop'"
                :icon="isNavFixed ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" 
                color="gray" 
                variant="ghost" 
                :title="isNavFixed ? 'Unpin navigation' : 'Pin navigation'"
                @click="isNavFixed = !isNavFixed"
            />

            <UButton
                v-if="type === 'desktop'"
                :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" 
                color="gray" 
                variant="ghost" 
                title="Toggle theme"
                @click="isDark = !isDark"
            />
        </div>
        <UNavigationMenu 
            orientation="vertical"
            :items="topLinks"/>
    </div>
    <UNavigationMenu 
        orientation="vertical" 
        :items="bottomLinks"/>

</template>

<script lang="ts" setup>

    const props = defineProps<{
        type: 'mobile' | 'desktop'
        navFixed?: boolean
    }>()

    const colorMode = useColorMode()
    const isDark = computed({
        get: () => colorMode.value === 'dark',
        set: (value) => colorMode.value = value ? 'dark' : 'light'
    })

    const user = useSupabaseUser()
    const client = useSupabaseClient()

    const isNavFixed = ref(props.navFixed)
  
    const topLinks = [
        [
            {
                label: 'Dashboard',
                icon: 'i-heroicons-home',
                to: '/dashboard'
            }
        ],
        [
            {
                label: 'Documents',
                icon: 'i-heroicons-home',
                to: '/getting-started/installation'
            }, 
            { 
                label: 'Entities',
                icon: 'i-heroicons-chart-bar',
                to: '/components/vertical-navigation'
            },
            { 
                label: 'Contacts',
                icon: 'i-heroicons-circle-stack',
                to: '/components/vertical-navigation'
            }
        ], 
        [
            {
                label: 'Request features',
                icon: 'i-heroicons-command-line',
                to: '/components/command-palette'
            }
        ]
    ];
  
    const bottomLinks = computed(() => [
        {
            label: 'Profile',
            avatar: {
                src: user.value?.user_metadata.avatar_url
            },
            badge: 100
        },
        {
            label: 'Sign out',
            icon: 'i-heroicons-home',
            onSelect: async () => {
                await client.auth.signOut()
                navigateTo('/')
            }
        }
    ])

    if (props.type === 'mobile') {
        bottomLinks.value.push({
            label: isDark.value ? 'Dark Theme' : 'Light Theme',
            icon: isDark.value ? 'i-heroicons-moon' : 'i-heroicons-sun',
            onSelect: () => isDark.value = !isDark.value
        })
    }
</script>

<style>

</style>