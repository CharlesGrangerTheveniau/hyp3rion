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
import { useUserStore } from '~/stores/userStore';

// ----------------
// Props & Emits
// ----------------
const props = defineProps<{
    type: 'mobile' | 'desktop'
    navFixed?: boolean
}>()

const emit = defineEmits<{
    'update:navFixed': [value: boolean]
}>()

// ----------------
// Store & Services
// ----------------
const userStore = useUserStore()
const client = useSupabaseClient()
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

/**
 * Controls whether the navigation sidebar is fixed
 */
const isNavFixed = computed({
    get: () => props.navFixed ?? false,
    set: (value) => emit('update:navFixed', value)
})

// ----------------
// Navigation Links
// ----------------
/**
 * Primary navigation items displayed at the top of the sidebar
 */
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
]

/**
 * Secondary navigation items displayed at the bottom of the sidebar
 * Includes user-specific actions and theme toggle (mobile only)
 */
const bottomLinks = computed(() => {
    const links = [
        {
            label: 'Firms',
            icon: 'i-heroicons-building-office',
            to: '/firm-details'
        },
        {
            label: 'Profile',
            avatar: {
                src: userStore.user?.avatar
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
    ]

    // Add theme toggle for mobile view only
    if (props.type === 'mobile') {
        links.push({
            label: isDark.value ? 'Dark Theme' : 'Light Theme',
            icon: isDark.value ? 'i-heroicons-moon' : 'i-heroicons-sun',
            onSelect: async () => {
                isDark.value = !isDark.value
                return Promise.resolve()
            }
        })
    }

    return links
})
</script>

<style>

</style>