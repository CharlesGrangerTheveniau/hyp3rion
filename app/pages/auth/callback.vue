<!-- eslint-disable no-irregular-whitespace -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import AvailablePermissionsModal from '~/components/available-permissions-modal.vue'
import NoPermissionsModal from '~/components/no-permissions-modal.vue'
import type { User, Permissions } from '~~/server/types'


const user = useSupabaseUser()
const router = useRouter()
const modal = useModal()

const showNoPermissions = (user: User) => {
  console.log('showing no permissions')
  modal.open(NoPermissionsModal, {
    title: 'Access Denied',
    dismissible: false,
    user: user
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showAvailablePermissions = (permissions: any, userProfile: User, hasOnlyPendingPermissions: boolean) => {
  console.log('showing available permissions')
  modal.open(AvailablePermissionsModal, {
    title: 'Available Permissions',
    permissions: permissions,
    user: userProfile,
    dismissible: false,
    hasOnlyPendingPermissions
  })
}

const entities = ref([])

const userProfile = ref<User | null>(null)

onMounted(async () => {

  // if user is connected (through auth provider, then we need to get the user profile || create a new user
  // then get permissions for this user)


  if (user.value) {
    console.log('user', user.value)


    try {

      // get user profile || create a new user
      const userProfile = await $fetch<User>('/api/whoAmI', {
        headers: {
          'X-User-Data': JSON.stringify(user.value)
        },
        method: 'GET'
      })

      console.log('userProfile', userProfile)

      // at this point, we have a user profile with or without permissions


      const permissions = await $fetch<Permissions>('/api/permissions/'+userProfile?.id)

      const hasFirmPermissions = permissions.firmPermissions.length > 0
      const hasClientPermissions = permissions.clientPermissions.length > 0

      const hasOnlyPendingPermissions = hasFirmPermissions && permissions.firmPermissions.every(permission => permission.permissionForUser === 'PENDING') 
        || hasClientPermissions && permissions.clientPermissions.every(permission => permission.permissionForUser === 'PENDING')

      const hasPermissions = permissions.firmPermissions.length > 0 || permissions.clientPermissions.length > 0

      console.log('permissions', permissions)
      
      // If the user is connected
      if (userProfile.connected) {
        // and has permissions, we need to redirect to the first permission
        if (hasPermissions) {
          const firstPermission = permissions.firmPermissions[0]?.id || permissions.clientPermissions[0]?.id
          router.push(`/${firstPermission}`)
        // if the user is connected but has no permissions, we need to show him a modal to request permissions || create a firm
        } else {
          showNoPermissions(userProfile)
        }
      } else {
        // if the user is not connected but has permissions, we need to show him available permissions to access
        if (hasPermissions) {
          showAvailablePermissions(permissions, userProfile, hasOnlyPendingPermissions)
        // if the user is not connected but has no permissions, we need to show him a modal to request permissions || create a firm
        } else {
          showNoPermissions(userProfile)
        }
      }

    } catch (error) {
      console.error('Error fetching user profile or permissions:', error)
    }
  } else {
    console.error('Failed to authenticate user')
    router.push('/login')
  }

})

</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <!-- Remove the UModal component - useModal will handle this -->
  </div>
</template> 
