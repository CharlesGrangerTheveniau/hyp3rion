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
        
        <div class="input-group">
          <input 
            type="email" 
            placeholder="account email"
            v-model="email"
            class="email-input"
          />
          <button class="submit-btn">
            <Icon name="material-symbols:arrow-forward-rounded" />
          </button>
        </div>
  
        <div class="blur-group" :class="{ 'blur-effect': isInputFocused }">
          <button v-on:click="login('google')" class="google-btn">
            <img src="/google.png" alt="Google" />
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
  const email = ref('')
  const isInputFocused = ref(false)
  
  watch(email, (newVal) => {
    if (newVal.length > 0) {
      isInputFocused.value = true
      console.log('input focused')
    } else {
      isInputFocused.value = false
      console.log('input not focused')
    }
  })
  
  const client = useSupabaseClient()
  
  
  const login = async (provider: string) => {
    console.log('logging in with',provider)
    await client.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
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
    max-width: 400px;
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