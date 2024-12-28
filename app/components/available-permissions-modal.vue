<template>
  <UModal prevent-close>
    <template #header>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Nice to see you {{ props.user.fullName }}!</h1>
        <p class="text-lg">You've been granted access to the following permissions</p>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <div v-if="props.permissions.firmPermissions.length > 0">
          <h3 class="text-lg font-bold mb-4">Firm Permissions</h3>
          <AuthorityCard
            v-for="permission in props.permissions.firmPermissions"
            :key="permission.id"
            button-label="Access"
            :authority="{
              ...permission,
              type: 'firm',
            } as Authority"
            @select="connectUser"
          />
        </div>
        <div v-if="props.permissions.clientPermissions.length > 0">
          <h3 class="text-lg font-bold mb-4">Client Permissions</h3>
          <AuthorityCard
            v-for="permission in props.permissions.clientPermissions"
            :key="permission.id"
            button-label="Access"
            :authority="{
              ...permission,
              type: 'client',
            } as Authority"
            @select="connectUser"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { User, Permissions } from '~~/server/types'
import AuthorityCard from './authority-card.vue'
import type { Authority } from './no-permissions-modal.vue';


const modal = useModal()
const props = defineProps<{
  permissions: Permissions,
  user: User
}>()

async function connectUser(permission: any) {
  await $fetch(`/api/users`, {
    method: 'PATCH',
    body: {
      connected: true
    },
    headers: {
      'X-User-Id': JSON.stringify(props.user.id)
    }
  })
  navigateTo(`/${permission.id}`)
  modal.close()
}
</script>

<style>

</style>