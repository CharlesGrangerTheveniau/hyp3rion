<template>
    <div class="auth-container">
      <NuxtLink to="/" class="back-btn">
        <Icon name="material-symbols:close" />
      </NuxtLink>
  
      <div class="auth-content">
        <div class="blur-group" :class="{ 'blur-effect': isInputFocused }">
          <h1>Welcome to <span class="highlight">BLOC-X</span></h1>
          <p class="subtitle">
            Thank you for being an early adopter. To start enjoying the benefits, let's set up your account.
          </p>
        </div>
        
        <UButtonGroup class="flex w-full gap-2">
          <USelectMenu
            v-model="phoneCode"
            size="xl"
            :items="codes"
            value-key="value"
            label-key="label"
            filter-fields="['label', 'value']"
            :search-input="{ icon: 'i-lucide-search' }"
            class="w-32"
          >
            <template #leading="{ modelValue }">
              <UIcon 
                v-if="modelValue" 
                :name="`twemoji:flag-${modelValue.label}`" 
                class="w-5 h-5"
              />
              <UIcon 
                v-else 
                name="i-lucide-earth" 
                class="w-5 h-5"
              />
            </template>
            
            <template #item="{ item }">
              <div class="flex items-center gap-2">
                <UIcon :name="`twemoji:flag-${item.label}`" class="w-5 h-5" />
                <span>{{ item.value }}</span>
              </div>
            </template>
          </USelectMenu>
          <UInput
            v-model="phone"
            size="xl"
            placeholder="Enter your phone number"
            class="flex-1"
          />
          <UButton size="xl" class="shrink-0" @click="phoneLogin()">
            <UIcon name="i-lucide-send"/>
          </UButton>
            
          
        </UButtonGroup>
  
        <div class="blur-group" :class="{ 'blur-effect': isInputFocused }">
          <button @click="login('google')" class="google-btn">
            <img src="/google.png" alt="Google" >
            Signup with Google
          </button>
  
          <p class="terms">
            By signing up, you agree to our <a href="#">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import type { Provider } from '@supabase/supabase-js'

  interface PhoneCode {
    label: string
    value: string
  }

  const phone = ref('')
  const phoneCode = ref<PhoneCode>({ label: 'france', value: '+33' })

  

  const codes = ref([
    { label: 'afghanistan', value: '+93' },
    { label: 'albania', value: '+355' },
    { label: 'algeria', value: '+213' },
    { label: 'andorra', value: '+376' },
    { label: 'angola', value: '+244' },
    { label: 'argentina', value: '+54' },
    { label: 'armenia', value: '+374' },
    { label: 'australia', value: '+61' },
    { label: 'austria', value: '+43' },
    { label: 'azerbaijan', value: '+994' },
    { label: 'bahrain', value: '+973' },
    { label: 'bangladesh', value: '+880' },
    { label: 'belarus', value: '+375' },
    { label: 'belgium', value: '+32' },
    { label: 'brazil', value: '+55' },
    { label: 'bulgaria', value: '+359' },
    { label: 'canada', value: '+1' },
    { label: 'china', value: '+86' },
    { label: 'colombia', value: '+57' },
    { label: 'croatia', value: '+385' },
    { label: 'cyprus', value: '+357' },
    { label: 'czechia', value: '+420' },
    { label: 'denmark', value: '+45' },
    { label: 'egypt', value: '+20' },
    { label: 'estonia', value: '+372' },
    { label: 'finland', value: '+358' },
    { label: 'france', value: '+33' },
    { label: 'germany', value: '+49' },
    { label: 'greece', value: '+30' },
    { label: 'hong-kong-sar-china', value: '+852' },
    { label: 'hungary', value: '+36' },
    { label: 'iceland', value: '+354' },
    { label: 'india', value: '+91' },
    { label: 'indonesia', value: '+62' },
    { label: 'iran', value: '+98' },
    { label: 'iraq', value: '+964' },
    { label: 'ireland', value: '+353' },
    { label: 'israel', value: '+972' },
    { label: 'italy', value: '+39' },
    { label: 'japan', value: '+81' },
    { label: 'jordan', value: '+962' },
    { label: 'kazakhstan', value: '+7' },
    { label: 'kenya', value: '+254' },
    { label: 'kuwait', value: '+965' },
    { label: 'latvia', value: '+371' },
    { label: 'lebanon', value: '+961' },
    { label: 'lithuania', value: '+370' },
    { label: 'luxembourg', value: '+352' },
    { label: 'malaysia', value: '+60' },
    { label: 'malta', value: '+356' },
    { label: 'mexico', value: '+52' },
    { label: 'monaco', value: '+377' },
    { label: 'morocco', value: '+212' },
    { label: 'netherlands', value: '+31' },
    { label: 'new-zealand', value: '+64' },
    { label: 'norway', value: '+47' },
    { label: 'pakistan', value: '+92' },
    { label: 'philippines', value: '+63' },
    { label: 'poland', value: '+48' },
    { label: 'portugal', value: '+351' },
    { label: 'qatar', value: '+974' },
    { label: 'romania', value: '+40' },
    { label: 'russia', value: '+7' },
    { label: 'saudi-arabia', value: '+966' },
    { label: 'singapore', value: '+65' },
    { label: 'slovakia', value: '+421' },
    { label: 'slovenia', value: '+386' },
    { label: 'south-africa', value: '+27' },
    { label: 'south-korea', value: '+82' },
    { label: 'spain', value: '+34' },
    { label: 'sweden', value: '+46' },
    { label: 'switzerland', value: '+41' },
    { label: 'taiwan', value: '+886' },
    { label: 'thailand', value: '+66' },
    { label: 'turkey', value: '+90' },
    { label: 'ukraine', value: '+380' },
    { label: 'united-arab-emirates', value: '+971' },
    { label: 'united-kingdom', value: '+44' },
    { label: 'united-states', value: '+1' },
    { label: 'vietnam', value: '+84' }
  ])

  const isInputFocused = ref(false)

  
  watch(phone, (newVal) => {
    if (newVal.length > 0) {
      isInputFocused.value = true
      console.log('input focused')
    } else {
      isInputFocused.value = false
      console.log('input not focused')
    }
  })
  
  const client = useSupabaseClient()
  
  
  const login = async (provider: Provider) => {
    console.log('logging in with', provider)
    await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const phoneLogin = async () => {
    const phoneNumber = phoneCode.value.value + phone.value
    console.log(phoneNumber)
    const send = await client.auth.signInWithOtp({
      phone: phoneNumber,
    })
    console.log(send)
  }
  
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
    color: #ffd700;
  }
  
  .subtitle {
    color: #999;
    margin-bottom: 2rem;
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