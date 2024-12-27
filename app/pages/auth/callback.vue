<!-- eslint-disable no-irregular-whitespace -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import AvailablePermissionsModal from '~/components/available-permissions-modal.vue'
import NoPermissionsModal from '~/components/no-permissions-modal.vue'



const user = useSupabaseUser()
const router = useRouter()
const modal = useModal()

const showNoPermissions = () => {
  modal.open(NoPermissionsModal, {
    title: 'Access Denied',
    dismissible: false
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showAvailablePermissions = (permissions: any, user: any) => {
  console.log('showing available permissions')
  modal.open(AvailablePermissionsModal, {
    title: 'Available Permissions',
    permissions: permissions
  })
}

const entities = ref([])

// This will run when the callback page loads
onMounted(async () => {
  if (user.value) {
    console.log('user', user.value)
    try {
      const permissions = await $fetch('/api/permissions', {
        headers: {
          'X-User-Data': JSON.stringify(user.value)
        }
      })

      console.log('permissions', permissions)
      
      // If the user is connected, we need to redirect to the first permission
      if (permissions.user.connected) {
        const firstPermission = permissions.firmPermissions[0]?.id || permissions.clientPermissions[0]?.id
        if (firstPermission) {
          router.push(`/${firstPermission}`)
        } else {
          console.error('No valid permissions found')
          showNoPermissions()
        }
      }

      // If the user is not connected but has permissions, we need to show him a modal 
      if (!permissions.user.connected) {
        showAvailablePermissions(permissions)
      }





      /* if (permissions.length > 0) {
        if (permissions.some(p => p.firmId)) {
          const entity = await $fetch(`/api/entities/${permissions.find(p => p.firmId)?.firmId}`)
        }
      } */

    } catch (error) {
      if (error.response?.status === 403) {
        // TODO: show a modal that allows the users to find a client || firm to request access to || create a firm 
        showNoPermissions()
      }
      if (error.response?.status === 404) {
        // TODO: show a modal that allows the users to create a user entity and find a company || firm to request access to || create a firm 
        showNoPermissions()
      }
    }
  }

})


</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <!-- Remove the UModal component - useModal will handle this -->
  </div>
</template> 
