<template>
  <UModal v-model:open="isOpen" :dismissible="false">
    <template #header>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Nice to see you {{ props.permissions.user.fullName }}!</h1>
        <p class="text-lg">You've been granted access to the following permissions</p>
      </div>
    </template>
    <template #body>
      

      <div v-if="props.permissions.firmPermissions.length > 0">
        <h3 class="text-lg font-bold mb-4">Firm Permissions</h3>
        <div 
          v-for="permission in props.permissions.firmPermissions" 
          :key="permission.id"
          class="flex flex-row items-center justify-between p-4 border border-gray-200 rounded-md">
          <div class="flex flex-col gap-2">
            <i class="text-gray-500 text-sm" v-if="permission.company"> {{  permission.company.siren }}</i>
            <span class="text-xl font-bold">{{ permission.name }}</span>
            <i class="text-gray-500 text-sm" v-if="permission.company"> {{ permission.company.address }}</i>
          </div>
          <UButton loading-auto trailing-icon="i-heroicons-arrow-right" color="primary" variant="soft" @click="connectUser(permission)">
            <span>Access</span>
          </UButton>
        </div>
      </div>
      <div v-if="props.permissions.clientPermissions.length > 0">
        <h3>Client Permissions</h3>
        <div v-for="permission in props.permissions.clientPermissions" :key="permission.id">
          <p>{{ permission.name }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
  const modal = useModal()
    const props = defineProps<{
        permissions: any
    }>()

    const isOpen = ref(true)

    console.log(props.permissions)

    async function connectUser(permission: any) {
      console.log('connectUser', permission)
      await $fetch(`/api/users`, {
        method: 'PATCH',
        body: {
          connected: true
        },
        headers: {
          'X-User-Id': JSON.stringify(props.permissions.user.id)
        }
      })
      modal.close()
      navigateTo(`/${permission.id}`)
    }
</script>

<style>

</style>