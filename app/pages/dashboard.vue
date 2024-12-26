<!-- eslint-disable vue/no-multiple-template-root -->
<template>
    <h1>Dashboard</h1>
    
</template>

<script lang="ts" setup>


definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
console.log(user.value)


if (!user.value?.id) {
  navigateTo('/login')
}




</script>

<style>

</style>