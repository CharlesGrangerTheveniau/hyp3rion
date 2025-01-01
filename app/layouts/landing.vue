<!-- eslint-disable vue/no-multiple-template-root -->
<template>
    <div class="nav-bar">
        <!-- Left Side -->
      <div class="flex items-center gap-6">
        <div class="text-[32px] text-gray-800">🔥</div>
        
        <div class="flex items-center gap-4">
          <div class="nav-item">
            <span>Features</span>
            <UBadge class="ml-2" label="New" />
          </div>
          <div class="nav-item">
            <span>Pricing</span>
          </div>
          
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-4">
        <NuxtLink v-if="!user" to="/login">

          <UButton
            size="md"
            icon="material-symbols:fingerprint"
            color="white"
            variant="outline"
            label="Login"
            :trailing="false"/>
        </NuxtLink>

        

        <div v-else class="flex items-center gap-4">
          <UAvatar 
            size="sm"
            :src="avatarUrl"
            alt="Avatar"
          />
          <UButton color="white" variant="solid" @click="signOut">Sign out</UButton>
        </div>
        
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </div>
    </div>
    <slot />
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const isDark = computed({
    get () {
        return colorMode.value === 'dark'
    },
    set () {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const avatarUrl = computed(() => {
return user.value?.user_metadata?.avatar_url || '' // fallback to empty string or default avatar
})

const signOut = async () => {
await supabase.auth.signOut()
navigateTo('/login')
}

console.log('hey')
</script>

<style>
.nav-bar {
  position: absolute;
  max-width: 1220px;
  padding: 0px 40px;
  margin: 0px auto;
  left: 0px;
  right: 0px;
  display: flex;
  justify-content: space-between;
  align-self: center;
  width: 100%;
  top: 40px;
  z-index: 100;
}

.nav-item {
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  
  span {
    color: rgb(31 41 55); /* text-gray-800 */
    .dark & {
      color: rgb(156 163 175); /* text-gray-400 */
    }
    transition: color 0.3s, text-shadow 0.3s;
  }

  &:hover span {
    color: rgb(3 7 18); /* text-gray-950 */
    .dark & {
      color: rgb(243 244 246); /* text-gray-100 */
    }
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }
}
</style>