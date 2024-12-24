<template>
    <h1>Dashboard</h1>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
console.log(user.value)

const loadEntities = async () => {
    
    const entities = await $fetch('/api/entities/getEntities', {
        headers: {
            'X-User-Data': user.value?.id || ''
        }
    })
    console.log(entities)
    return entities
}

const loadDocuments = async () => {
    const documents = await $fetch('/api/documents/getDocuments', {
        headers: {
            'X-User-Data': user.value?.id || ''
        }
    })
    console.log(documents)
    return documents
}

</script>

<style>

</style>