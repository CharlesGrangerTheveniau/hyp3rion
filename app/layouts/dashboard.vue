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
                <div>🔥</div>
                <UButton icon="i-heroicons-bars-3" color="primary" variant="ghost" />
            </div>
            <template #body>
                <div class="flex flex-col justify-between h-full bg-white dark:bg-gray-900">
                    <AppSidebar type="mobile" :nav-fixed="isNavFixed"/>
                </div>
            </template>
        </USlideover>
  
      <!-- Desktop navigation -->
      <Transition
        enter-active-class="transition ease-in-out duration-300 transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in-out duration-300 transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div 
            v-show="isDesktopMenuOpen || isNavFixed" 
            class="fixed hidden lg:flex flex-col justify-between h-screen w-[25%] bg-white dark:bg-gray-900 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.3)] p-8 z-50 transition-all duration-300"
            @mouseleave="isNavFixed ? null : isDesktopMenuOpen = false">
            
            <AppSidebar 
              type="desktop" 
              :nav-fixed="isNavFixed"
              @update:nav-fixed="isNavFixed = $event"/>
        </div>
      </Transition>
  
      <!-- Hover trigger area -->
      <div 
        v-if="!isNavFixed" 
        class="hidden lg:block fixed left-0 h-screen w-8 z-40"
        @mouseenter="isDesktopMenuOpen = true"/>
  
      <!-- Main content -->
      <main 
        class="min-h-screen w-[100%] transition-all duration-300" 
        :class="[
            'mt-[60px] p-4 lg:mt-0 lg:p-8',
            (isDesktopMenuOpen || isNavFixed.value) ? 'lg:ml-[25%]' : 'lg:ml-8'
        ]">
        <slot />
      </main>
    </div>
  </template>
  
  <script lang="ts" setup>
  import AppSidebar from '~/components/app-sidebar.vue'
  import { SpeedInsights } from '@vercel/speed-insights/vue';
  const userSession = useSupabaseUser()
  if (!userSession.value) {
    navigateTo('/login')
  }

  const userStore = useUserStore()
  const route = useRoute()
  
  // Menu state
  const isDesktopMenuOpen = ref(true)
  const isNavFixed = ref(true)

  onMounted(async () => {
    if (userSession.value) {
      await userStore.fetchUserAndPermissions(userSession.value)
      const hasPermission = userStore.hasUrlPermission(route.path)
      if (!hasPermission) {
        console.log(`user ${userStore.user?.id} has no permission for authority ${route.path}`)
        navigateTo('/auth/callback')
      } else {
        console.log(`user ${userStore.user?.id} has permission for authority ${route.path}`)
      }
    }
  })

  
  // Auto-close desktop menu when mouse leaves
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseLeave = () => {
    if (!isNavFixed.value) {
      isDesktopMenuOpen.value = false
    }
  }
    

    defineShortcuts({
        meta_o: () => {
            console.log('open')
            isNavFixed.value = !isNavFixed.value
            isDesktopMenuOpen.value = !isDesktopMenuOpen.value
        }
    })
  
  </script>
  
  <style scoped>
  </style>