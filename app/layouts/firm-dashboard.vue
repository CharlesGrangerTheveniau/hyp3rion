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

      <div class="fixed flex flex-col justify-between items-center h-screen w-[51px] py-5 z-10 bg-[color:var(--color-white)]/10 dark:bg-[color:var(--ui-color-neutral-900)]/90 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.3)]">

        <div class="absolute top-0 right-0 bottom-0 w-[1px] h-screen bg-radial-white"/>

        <NuxtLink to="/">
          <img src="/3-temp.png" alt="th3mis logo" class="w-[30px] h-[30px]">
        </NuxtLink>

        <!-- <UButton icon="i-heroicons-home" color="neutral" variant="ghost" size="xl" @click="navigateTo('/')"/> -->

        <div class="flex flex-col relative w-full text-center">
            <div class="relative">
                <span 
                  v-for="tab in routes" 
                  :key="tab.to" 
                  class="block flex flex-col justify-center items-center h-[50px] w-full mb-[10px] relative cursor-pointer"
                  @click="goTo(tab.to)">
                  
                    
                  <div class="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-[var(--ui-bg-elevated)] hover:scale-100">
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
                          'size-5', 
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

          <ThemeSwitch @click="isDark = !isDark"/>
          <span class="block flex flex-col justify-center items-center h-[50px] w-full mb-[10px] relative cursor-pointer" @click="logout()">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-[var(--ui-color-primary-900)]/30 hover:scale-110">
              <UIcon name="i-majesticons:logout-half-circle-line" class="size-6 text-neutral-500" />
            </div>
          </span>
        </div>


        
      </div>
      
  
      <!-- Main content -->
        <main 
          v-show="$route.path"
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
import { firmRoutes, type SidebarRoute } from './navigations';
  const userSession = useSupabaseUser()
  const client = useSupabaseClient()

  const colorMode = useColorMode()

   

    // ----------------
    // Computed Properties
    // ----------------
    /**
     * Controls the dark/light theme toggle
     */
    const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  })

  console.log(colorMode.value)

  const userStore = useUserStore()
  const route = useRoute()

  const routes = firmRoutes
  
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
      'meta_b': () => {
        goTo('content')
      },
      'meta_p': () => {
        goTo('preferences')
      },
      'l': () => {
        isDark.value = !isDark.value
      }
  })

  const logout = async () => {
    await client.auth.signOut()
    navigateTo('/login')
  }

  const goTo = async (to: string) => {
    const route = useRoute()
    const firmId = route.params.id

    if (firmId && to) {
      const newPath = `/firm/${firmId}/${to}`
      await navigateTo(newPath)
    } else {
      await navigateTo('/')
    }
  }

  const isActive = (to: string) => {

    return route.path.split('/')[3] === to
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
    } else {
      navigateTo('/login')
    }
  })

  </script>
  
  <style scoped>
  
    .bg-radial-white {
        background: radial-gradient(422px at 50% 50%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%);
    }
  </style>