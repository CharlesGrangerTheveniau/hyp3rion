<template>
    <UDrawer v-model:open="isOpen" direction="right">
        <template #header>
            <div class="flex flex-col gap-4">
                <h1 class="text-2xl font-bold">Create a new client</h1>
                <p class="text-lg">Search for a client in the french registry of companies</p>
            </div>
        </template>
      
        <template #content>
  
            <div ref="wrapperEl" class="flex flex-col gap-4" >
                <UInput v-model="searchTerm" icon="i-lucide-search" size="xl" variant="outline" placeholder="Search..." class="w-full"/>
    
                <div v-if="results.length > 0" class="flex flex-col gap-4">
                    <AuthorityCard 
                        v-for="result in results"
                        :key="result.id"
                        :authority="result"
                    >
                        <template #action>
                            <UButton 
                            color="primary"
                            variant="ghost" 
                            @click="addClient(result)"
                            >
                            Add client
                            <UIcon  name="i-heroicons-arrow-right" class="w-5 h-5" />
                            </UButton>
                        </template>
                    </AuthorityCard>
                </div>

            </div>
        </template>
    </UDrawer>
    <!-- <UModal prevent-close>
      <template #header>
        <div class="flex flex-col gap-4">
          <h1 class="text-2xl font-bold">Create a new client</h1>
          <p class="text-lg">Search for a client in the french registry of companies</p>
        </div>
      </template>
      
      <template #body>
  
        <div ref="wrapperEl" class="flex flex-col gap-4" >
          <UInput v-model="searchTerm" icon="i-lucide-search" size="xl" variant="outline" placeholder="Search..." class="w-full"/>
  
          <div v-if="results.length > 0" class="flex flex-col gap-4">
            <AuthorityCard 
              v-for="result in results"
              :key="result.id"
              :authority="result"
            >
              <template #action>
                <UButton 
                  color="primary"
                  variant="ghost" 
                  @click="addClient(result)"
                >
                  Add client
                  <UIcon  name="i-heroicons-arrow-right" class="w-5 h-5" />
                </UButton>
              </template>
            </AuthorityCard>
          </div>
  
        
        </div>
        </template>
    </UModal> -->
  </template>
  
  <script lang="ts" setup>

  import AuthorityCard from '../cards/authority-card.vue'
  import { searchCompany, type PappersCompany } from '~/services/pappers-service'
  import { useAutoAnimate } from '@formkit/auto-animate/vue'

  const isOpen = ref(false)

  const props = defineProps<{
    open: boolean
  }>()


  watch(props.open, (newVal) => {
    isOpen.value = newVal
  })

    const [wrapperEl] = useAutoAnimate()
  
  
    const searchTerm = ref('')
    const results = ref<PappersCompany[]>([])
  
    watch(searchTerm, async (newVal) => {
      // Clear previous results
      
      if (newVal.length > 2) {
        const companiesSearch = await searchCompany(newVal)
        results.value = companiesSearch
      } else {
        results.value = []
      }
    })
  
    
    
  
  </script>
  