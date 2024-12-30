<template>
    <div class="auth-container">
      <NuxtLink to="/" class="back-btn">
        <Icon name="material-symbols:close" />
      </NuxtLink>

      <div v-if="emailSent" class="auth-content flex flex-col gap-6 items-center justify-center">
        <div class="blur-group" :class="{ 'blur-effect': isInputFocused }">
          <h1><span class="highlight font-bold">Check your inbox</span></h1>
          <p class="subtitle">
            We have sent you a secure code to your email. Please enter the code to authenticate your account.
          </p>
        </div>

        <UPinInput v-model="pin" size="xl" color="neutral" type="number" mask otp length="6" />

      </div>
  
      <div v-else class="auth-content flex flex-col gap-6">
        <div class="blur-group" :class="{ 'blur-effect': isInputFocused }">
          <h1>Welcome to <span class="highlight font-bold">Th3mis</span></h1>
          <p class="subtitle">
            Thank you for being an early adopter. To start enjoying the benefits, let's set up your account.
          </p>
        </div>
        
        <UInput
            color="neutral"
            v-model="email" 
            placeholder="Enter your email" 
            size="xl" 
            class="w-full">

            <template #trailing>
              <UButton
                :loading="loading"
                color="primary"
                variant="link"
                size="xl"
                icon="i-solar:round-alt-arrow-right-outline"
                :disabled="!isValidEmail"
                :ui="{
                    base: 'disabled:opacity-20'
                }"
                @click="loginWithEmail()"
              />
            </template>
        </UInput>
          
        
  
        <div class="blur-group flex flex-row gap-3 justify-center items-center" :class="{ 'blur-effect': isInputFocused }">
          <UButton color="neutral" variant="link" size="xl" class="flex flex-row gap-3 justify-center items-center p-4" @click="login('google')">
            <img :src="`/google.png`" alt="Google" class="h-7 w-7">
              Login with Google
          </UButton>
        </div>
        
        
      </div>
    </div>
  </template>
  
<script lang="ts" setup>
  import type { Provider } from '@supabase/supabase-js'
  const router = useRouter()

  defineShortcuts({
    enter: {
      usingInput: true,
      handler: () => {
        if(isValidEmail.value) {
            loginWithEmail()
        }
      }
    }
  })

  const email = ref('')
  const pin = ref([])
  const emailSent = ref(false)
  const loading = ref(false)
  const isInputFocused = ref(false)
  const toast = useToast()

  watch(email, (newVal) => {
    if(newVal.length > 0) {
      isInputFocused.value = true
    } else {
      isInputFocused.value = false
    }
  })

  watch(pin, async (newPin) => {
    if (newPin.length > 0) {
      isInputFocused.value = true
    } else {
      isInputFocused.value = false
    }

    if(newPin.length === 6) {
      const tokenInput = newPin.join('')
      const { error } = await client.auth.verifyOtp({
        email: email.value,
        token: tokenInput,
        type: 'email'
      })
      if(error) {
        console.error('Error during authentication:', error)
        router.push('/login')
      }
      console.log('tokenInput', tokenInput)
      console.log('submit')

      router.push('/auth/callback')
    }
  })
  
  const client = useSupabaseClient()

  const login = async (provider: Provider) => {
    await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const loginWithEmail = async () => {
    loading.value = true
    try {
      const { data, error } = await client.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      })
      
      if (error) throw error

      
      toast.add({
        title: 'Check your email',
        description: 'We sent you a magic link to sign in',
        color: 'success'
      })

      emailSent.value = true      
    } catch (error) {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'error'
      })
    } finally {
      loading.value = false
      isInputFocused.value = false
    }
  }
  
  const isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
  })
  
</script>
  
<style scoped>
  .auth-container {
    min-height: 100vh;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .footer {
    position: absolute;
    bottom: 2rem;
  }
  
  .auth-content {
    text-align: center;
    max-width: 500px;
    padding: 2rem;
  }
  
  .blur-group {
    transition: filter 0.4s ease;
    
    &.blur-effect {
      filter: blur(8px);
    }
  }
  
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .highlight {
    background-color: #f3ec78;
    background-image: linear-gradient(45deg, var(--ui-color-primary-500), var(--ui-color-primary-100));
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent; 
    -moz-text-fill-color: transparent;
  }
  
  .subtitle {
    color: #999;
  }
  
  .input-group {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    z-index: 1;
    position: relative;
  }
  
  .email-input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    outline: none;
  }
  
  .submit-btn {
    background: #ff4444;
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
  }
  
  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.75rem;
    border-radius: 25px;
    cursor: pointer;
    margin: 1rem 0;
  }
  
  .google-btn img {
    width: 20px;
    height: 20px;
  }
  
  .terms {
    font-size: 0.8rem;
    color: #666;
  }
  
  .terms a {
    color: white;
    text-decoration: none;
  }
  
  .back-btn {
    position: fixed;
    top: 2rem;
    left: 2rem;
    color: white;
    cursor: pointer;
    font-size: 1.5rem;
    opacity: 0.7;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-btn:hover {
    opacity: 1;
  }
</style>