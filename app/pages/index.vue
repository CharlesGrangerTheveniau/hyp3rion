<template>
  <div class="relative min-h-screen">
<!-- Hero Section -->
      <div class="relative pt-[200px] px-6">
          <div class="max-w-[1220px] mx-auto text-center flex flex-col gap-6 items-center justify-center">
              <div class="blur-group" :class="{ 'blur-effect': isInputFocused }">
                  <h1 class="text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
                    The new edge for <span class="gradient-text-primary">law practice</span>
                  </h1>
                  <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                    <span class="gradient-text-primary">10x</span> 
                    client statisfaction, for 
                    <span class="gradient-text-primary">half</span> 
                    the effort
                  </h3>
        
                  <p class="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    th3mis will help you manage your clients, documents, and tasks.
                  </p>
              </div>
              
              <div class="flex flex-row min-w-[60%] gap-4 items-center justify-between flex-wrap">
                <UInput
                  color="neutral"
                  v-model="email"
                  leading-icon="i-lucide-at-sign"
                  highlight="false"
                  placeholder="Enter your email" 
                  size="xl"
                  class="w-[60%]">

                  <template v-if="isValidEmail" #trailing>
                    <UKbd value="enter" size="xl" class="text-xl"/>
                  </template>
                </UInput>
                  
                <UButton :disabled="!isValidEmail" :loading="loading" color="primary" variant="soft" icon="i-solar:round-alt-arrow-right-outline" size="xl" @click="subscribeToUpdates()">Get notified when we launch</UButton>
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
const loading = ref(false)

const email = ref('')

const isInputFocused = ref(false)
const toast = useToast()

watch(email, (newVal) => {
  if(newVal.length > 0) {
    isInputFocused.value = true
  } else {
    isInputFocused.value = false
  }
})

defineShortcuts({
    enter: {
      usingInput: true,
      handler: () => {
        if(isValidEmail.value) {
            subscribeToUpdates()
        }
      }
    }
  })

const subscribeToUpdates = async () => {
  loading.value = true
  await $fetch('/api/send/addToAudience', {
    method: 'POST',
    body: {
      email: email.value
    }
  })

  loading.value = false

  toast.add({
    title: 'Thank you!',
    description: 'You will be notified when we launch',
    color: 'primary',
    icon: 'i-lucide-check-circle'
  })

  isInputFocused.value = false
}

const isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
  })
</script>

<style scoped>
.blur-group {
    transition: filter 0.4s ease;
    
    &.blur-effect {
      filter: blur(4px);
    }
}
</style>