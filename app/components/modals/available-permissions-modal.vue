<template>
  <UModal prevent-close>
    <template #header>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Nice to see you {{ props.user.fullName }}!</h1>
        <p class="text-lg">{{ headerMessage }}</p>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-4" ref="wrapperEl">
        <div v-if="props.permissions.firmPermissions.length > 0">
          <h3 class="text-lg font-bold mb-4">Firm Permissions</h3>
          <AuthorityCard
            v-for="permission in props.permissions.firmPermissions"
            :key="permission.id"
            :authority="{
              ...permission,
              type: 'firm' as const
            }"
            :disabled="permission.permissionForUser == 'PENDING'"
          >
            <template #action>
              <UButton
                v-if="permission.permissionForUser === 'PENDING'"
                color="primary"
                variant="ghost" 
                :disabled="true"
              >
                Access pending
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
              </UButton>
              <UButton
                v-else
                color="primary"
                variant="ghost" 
                @click="connectUser(permission)"
              >
                Access
                <UIcon  name="i-heroicons-arrow-right" class="w-5 h-5" />
              </UButton>
            </template>
          </AuthorityCard>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { User, Permissions, AuthorityWithPermissionForUser } from '~~/server/types'
import AuthorityCard from '../cards/authority-card.vue'

import { useAutoAnimate } from '@formkit/auto-animate/vue'

const [wrapperEl] = useAutoAnimate()

const modal = useModal()
const props = defineProps<{
  permissions: Permissions,
  user: User,
  hasOnlyPendingPermissions: boolean
}>()

const headerMessage = computed(() => {  
  return props.hasOnlyPendingPermissions
    ? "Your access requests are being reviewed"
    : "You've been granted access to the following permissions"
})

async function connectUser(permission: AuthorityWithPermissionForUser) {
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