<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup>
const user = useSupabaseUser()
const router = useRouter()

// This will run when the callback page loads
onMounted(async () => {
  if (user.value) {
    // Now we can fetch the user profile
    const userProfile = await $fetch('/api/users', {
      headers: {
        'X-User-Data': JSON.stringify(user.value)
      },
      method: 'GET'
    })
    
    // Redirect to dashboard or wherever needed
    router.push('/dashboard')
  }
})
</script>

<template>
  <div>Loading...</div>
</template> 