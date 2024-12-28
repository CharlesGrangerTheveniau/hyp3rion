<!-- eslint-disable no-irregular-whitespace -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import AvailablePermissionsModal from '~/components/modals/available-permissions-modal.vue'
import NoPermissionsModal from '~/components/modals/no-permissions-modal.vue'
import { useUserStore } from '~/stores/userStore'
import { type User, type Permissions, PermissionType } from '~~/server/types'
import { User as SupabaseUser } from '@supabase/supabase-js'


const userSession = useSupabaseUser()
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

const allowedPermissions = [ 'ADMIN', 'READ_ONLY' ]

const entities = ref([])

const userStore = useUserStore()

const checkValidPermissions = (permissions: Permissions | undefined) => {
  if (!permissions) return false
  
  const firmPermissions = permissions.firmPermissions?.filter(p => 
    allowedPermissions.includes(p.permissionForUser)
  )
  const clientPermissions = permissions.clientPermissions?.filter(p => 
    allowedPermissions.includes(p.permissionForUser)
  )
  return (firmPermissions?.length > 0 || clientPermissions?.length > 0)
}

const findFirstValidFirmPermission = (permissions: Permissions | undefined) => {
  if (!permissions) return null
  return permissions.firmPermissions.find(p => allowedPermissions.includes(p.permissionForUser))
}

const findFirstValidClientPermission = (permissions: Permissions | undefined) => {
  if (!permissions) return null
  return permissions.clientPermissions.find(p => allowedPermissions.includes(p.permissionForUser))
}

const checkPendingPermissions = (permissions: Permissions | undefined) => {
  if (!permissions) return false
  
  const firmPermissions = permissions.firmPermissions
    ?.some(p => p.permissionForUser === 'PENDING')
  const clientPermissions = permissions.clientPermissions
    ?.some(p => p.permissionForUser === 'PENDING')

  return (firmPermissions || clientPermissions)
}

onMounted(async () => {
  if (userSession.value) {
    try {
      const { user, permissions } = await userStore.fetchUserAndPermissions(userSession.value)

      const hasPendingPermissions = checkPendingPermissions(permissions)

      const hasValidGrantedPermissions = checkValidPermissions(permissions)

      // User has been previously connected
      if (user.connected) {
        if (hasValidGrantedPermissions) {
          // Redirect to first valid permission
          const firstValidFirmPermission = findFirstValidFirmPermission(permissions)
          
          if (firstValidFirmPermission) {
            router.push(`/firm/${firstValidFirmPermission.id}/dashboard`)
          } else {
            router.push(`/client/${findFirstValidClientPermission(permissions)?.id}`)
          }
        } else if (hasPendingPermissions) {
          // No valid permissions, show modal
          showAvailablePermissions(permissions, user, hasPendingPermissions)
        } else {
          showNoPermissions(user)
        }
      } 
      // First time connection
      else {
        if (hasValidGrantedPermissions || hasPendingPermissions) {
          showAvailablePermissions(permissions, user, hasPendingPermissions)
        } else {
          showNoPermissions(user)
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
