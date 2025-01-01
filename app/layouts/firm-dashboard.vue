<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
    
    <div class="relative flex flex-row w-full">
      <SpeedInsights />
      <!-- Mobile slideover -->

        <USlideover 
          side="left" 
          :ui="{
            content: 'divide-none',
          }">
            <div class="lg:hidden w-full fixed top-0 left-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 p-4 shadow-sm flex flex-row justify-between items-center">
                <div class="text-2xl font-bold">th3mis</div>
                <UButton icon="i-heroicons-bars-3" color="primary" variant="ghost" />
            </div>
            <template #body>
                <div class="flex flex-col justify-between h-full bg-white bg-[var(--ui-bg)]">
                    <AppSidebar type="mobile" :nav-fixed="isNavFixed"/>
                </div>
            </template>
        </USlideover>
  
      <!-- Desktop navigation -->

      <!-- parent div -->

      <div class="relative flex flex-col justify-between items-center h-screen w-[70px] py-5 z-10 bg-[color:var(--color-white)]/10 dark:bg-[color:var(--ui-color-neutral-900)]/90 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.3)]">

        <div class="absolute top-0 right-0 bottom-0 w-[1px] h-screen bg-radial-white"/>

        <UButton icon="i-heroicons-home" color="neutral" variant="ghost" size="xl"/>

        <div class="flex flex-col relative w-full text-center">
            <div class="relative">
                <span 
                  v-for="tab in routes" 
                  :key="tab.to" 
                  class="block flex flex-col justify-center items-center h-[50px] w-full mb-[10px] relative cursor-pointer"
                  @click="goTo(tab.to)">
                    
                  <div class="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-[var(--ui-bg-elevated)] hover:scale-120">
                    <UTooltip 
                      :text="tab.to.toUpperCase()" 
                      :kbds="tab.kbds" 
                      :content="{ align: 'center', side: 'right', sideOffset: 30 }" 
                      :ui="{
                        'text': 'text-lg font-semibold',
                        'kbdsSize': 'lg',
                        'content': 'h-[40px]'
                      }"
                    >
                      <UIcon 
                        :name="tab.icon" 
                        :class="[
                          'size-6', 
                          isActive(tab.to) ? 'text-[var(--ui-primary)]' : 'text-[var(--ui-color-neutral-500)]'
                        ]"
                      />
                    </UTooltip>
                  </div>
                    
                </span>

                <div 
                    class="absolute top-0 right-0 w-[1px] h-[50px] bg-[var(--ui-primary)] transition-transform duration-150"
                    :style="{
                        transform: `translateY(${routes.findIndex((route: SidebarRoute) => isActive(route.to)) * 60}px)`
                    }"
                />
            </div>
        </div>

        <div class="flex flex-col gap-2">

          <ThemeSwitch />
          <span class="block flex flex-col justify-center items-center h-[50px] w-full mb-[10px] relative cursor-pointer" @click="logout()">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-[var(--ui-color-primary-900)]/30 hover:scale-110">
              <UIcon name="i-majesticons:logout-half-circle-line" class="size-6 text-neutral-500" />
            </div>
          </span>
        </div>


        
      </div>
      
  
      <!-- Main content -->
      <main 
        class="min-h-screen w-[100%] duration-300 bg-[var(--ui-bg)]">
        <div class="w-full max-w-[1338px] mx-auto py-[0px] px-[74px] h-full overflow-y-scroll scrollbar-none">
          <slot />
        </div>
      </main>
    </div>
  </template>
  
  <script lang="ts" setup>
  import AppSidebar from '~/components/app-sidebar.vue'
  import ThemeSwitch from '~/components/theme-switch.vue'
  import { SpeedInsights } from '@vercel/speed-insights/vue';
  const userSession = useSupabaseUser()
  const client = useSupabaseClient()
  if (!userSession.value) {
    navigateTo('/login')
  }

  const userStore = useUserStore()
  const route = useRoute()

  export interface SidebarRoute {
    to: string
    icon: string
    kbds: string[]
  }

  const routes: SidebarRoute[] = [
    { to: 'dashboard', icon: 'solar:home-2-outline', kbds: ['meta', 'H'] },
    { to: 'clients', icon: 'solar:buildings-2-linear', kbds: ['meta', 'C'] },
    { to: 'operations', icon: 'solar:database-outline', kbds: ['meta', 'O'] },
    { to: 'documents', icon: 'solar:documents-linear', kbds: ['meta', 'D'] },
    { to: 'content', icon: 'solar:book-minimalistic-outline', kbds: ['meta', 'B'] },
    { to: 'team', icon: 'solar:users-group-rounded-line-duotone', kbds: ['meta', 'T'] },
    { to: 'preferences', icon: 'solar:settings-minimalistic-linear', kbds: ['meta', 'P'] },
  ]

  defineShortcuts({
      'meta_h': () => {
        goTo('dashboard')
      },
      'meta_c': () => {
        goTo('clients')
      },
      'meta_o': () => {
        goTo('operations')
      },
      'meta_d': () => {
        goTo('documents')
      },
      'meta_b': () => {
        goTo('content')
      },
      'meta_t': () => {
        goTo('team')
      },
      'meta_p': () => {
        goTo('preferences')
      },
  })

  const logout = async () => {
    await client.auth.signOut()
    navigateTo('/login')
  }

  const goTo = (to: string) => {
    const route = useRoute()
    // Extract firmId from current path
    const firmId = route.path.split('/')[2]

    console.log(firmId)

    if (firmId && firmId.startsWith('f_')) {
      const newPath = firmId ? `/firm/${firmId}/${to}` : `/${to}`
      navigateTo(newPath)
    } else {
      navigateTo('/')
    }
  }

  const isActive = (to: string) => {
    return route.path.includes(to)
  }
  
  // Menu state
  const isNavFixed = ref(true)

  // Navigation items configuration

  onMounted(async () => {
    if (userSession.value) {
      await userStore.fetchUserAndPermissions(userSession.value)
      const hasPermission = userStore.hasUrlPermission(route.path)
      if (!hasPermission) {
        navigateTo('/auth/callback')
      }
    }
  })

  </script>
  
  <style scoped>
  
    .bg-radial-white {
        background: radial-gradient(422px at 50% 50%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%);
    }
  </style>