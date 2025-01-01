<template>
  <div class="relative min-h-screen">
<!-- Hero Section -->
      <div class="relative pt-[200px] px-6">
          <div class="max-w-[1220px] mx-auto text-center">
              <h1 class="text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">Generate in Seconds</h1>
      
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                  Stop wasting time with complex legal documents. Create professional NDAs instantly with our simple, secure platform.
              </p>

              <div class="flex flex-row justify-center gap-8">
                  <NuxtLink :to="user ? '/auth/callback' : '/login'">
                      <UButton 
                        size="xl"
                        icon="material-symbols:add-circle"
                        color="white"
                        variant="solid"
                        label="Create now"
                        :trailing="false"/>
                  </NuxtLink>
                  
                  <UButton 
                    size="xl"
                    icon="material-symbols:arrow-right-alt"
                    color="white"
                    variant="ghost"
                    label="Learn More"
                    :trailing="true"/>
              </div>
          </div>
      </div>

  <!-- Background Gradient -->
  <div class="absolute inset-0 -z-10 h-full w-full bg-[var(--ui-bg)]">
    <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)]" />
  </div>
</div>
</template>

<script setup>
definePageMeta({
layout: 'landing'
})

const user = useSupabaseUser()

</script>