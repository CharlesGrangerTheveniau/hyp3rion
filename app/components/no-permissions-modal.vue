<template>
  <UModal prevent-close>
    <template #header>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Sorry, {{ props.user.firstName }}!</h1>
        <p class="text-lg">We didn't find any permissions for you.</p>
        <p class="text-lg">You can find a company or firm to request access to.</p>
      </div>
    </template>
    
    <template #body>

      <div class="flex flex-col gap-4">
        <UInput v-model="searchTerm" icon="i-lucide-search" size="xl" variant="outline" placeholder="Search..." class="w-full"/>

        <div v-if="results.length > 0">
          <AuthorityCard 
            v-for="result in results" 
            :key="result.id"
            :authority="result"
          >
            <template #action>
              <UButton 
                color="primary"
                variant="ghost" 
                @click="requestPermissions(result)"
              >
                Request access
                <UIcon  name="i-heroicons-arrow-right" class="w-5 h-5" />
              </UButton>
            </template>
          </AuthorityCard>
        </div>

      
    </div></template>
    <template #footer>
      <div class="flex flex-row justify-between items-center w-full">
        <p>You can also create a new firm</p>
        <UButton label="Create" icon="i-heroicons-plus" color="primary" @click="createFirm()" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { searchAuthorities } from '~/services/authority-service'
import { requestPermission } from '~/services/permission-service';
import ConfirmModal from './confirm-modal.vue'
import type { Authority, User } from '~~/server/types';
  const modal = useModal()
  const props = defineProps<{
    user: User
  }>()

  


  const searchTerm = ref('')
  const results = ref<Authority[]>([])

  watch(searchTerm, async (newVal) => {
    // Clear previous results
    
    if (newVal.length > 2) {
      results.value = (await searchAuthorities(newVal)) as Authority[]
    } else {
      results.value = []
    }
  })

  const requestPermissions = async (authority: Authority) => {
    console.log('requesting permissions for', authority, props.user)
    const request = await requestPermission(props.user.id, authority.id, authority.type as "firm" | "client")

    console.log('request', request)
    showConfirm(authority.name)
  }

  const createFirm = async () => {
    console.log('TO DO : onboarding firm')
  }

  const showConfirm = (name: string) => {
    console.log('showing no permissions')
    modal.open(ConfirmModal, {
      label: `The request has been sent to ${name}`,
      preventClose: true
    })
  }
  

</script>
