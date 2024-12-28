<template>
    <div>
        <div v-if="type === 'desktop'" class="flex justify-between mb-4">
            
                <UButton
                    :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" 
                    
                    variant="ghost" 
                    title="Toggle theme"
                    @click="isDark = !isDark"
                />

                <UButton 
                    :icon="isNavFixed ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" 
                    variant="ghost" 
                    :title="isNavFixed ? 'Unpin navigation' : 'Pin navigation'"
                    @click="$emit('update:navFixed', !isNavFixed)"
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
    import { getUser, getUserProfile } from '~/services/user-service'

    const props = defineProps<{
        type: 'mobile' | 'desktop'
        navFixed?: boolean
    }>()

    const emit = defineEmits<{
        'update:navFixed': [value: boolean]
    }>()

    const colorMode = useColorMode()
    const isDark = computed({
        get: () => colorMode.value === 'dark',
        set: (value) => colorMode.value = value ? 'dark' : 'light'
    })

    const user = useSupabaseUser()

    const userProfile = getUser(user.value)


    const client = useSupabaseClient()

    const isNavFixed = computed({
        get: () => props.navFixed ?? false,
        set: (value) => emit('update:navFixed', value)
    })
  
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
                label: 'Clients',
                icon: 'i-heroicons-document-text',
                to: '/getting-started/installation',
                badge: 100,
            }, 
            { 
                label: 'Operations',
                icon: 'i-heroicons-chart-bar',
                to: '/components/vertical-navigation',
                badge: 100,
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
            label: 'Firms',
            icon: 'i-heroicons-building-office',
            to: '/firms'
        },
        {
            label: 'Profile',
            avatar: {
                src: userProfile.avatar
            },
            to: '/profile'
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
            onSelect: async () => {
                isDark.value = !isDark.value
                return Promise.resolve()
            }
        })
    }
</script>

<style>

</style>