<!-- eslint-disable vue/no-multiple-template-root -->
<template>
    <h1>Firm Dashboard</h1>
    
</template>

<script lang="ts" setup>


definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
console.log(user.value)




</script>

<style>

</style>