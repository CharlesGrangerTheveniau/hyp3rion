<template>
    <div class="w-full">
        <!-- Header section -->
        <div class="flex flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <!-- Title and subtitle -->
            <div class="flex flex-col gap-1 mb-6">
                <h1 class="text-4xl font-serif">Clients</h1>
                <p class="text-gray-500">Find your clients all in one place</p>
            </div>

            <!-- Action button -->
            <div class="flex justify-end">
                
                <!-- <UDrawer direction="right" title="Drawer with title">
                    <UButton 
                        class="bg-emerald-400 hover:bg-emerald-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
                        size="2xl" >
                        Add Client
                        <UIcon name="i-heroicons-plus" />
                    </UButton>

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
                </UDrawer> -->
                <UDrawer
                    direction="right"
                    title="Drawer with description"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                >
                    <UButton 
                        class="bg-emerald-400 hover:bg-emerald-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
                        size="2xl" >
                        Add Client
                        <UIcon name="i-heroicons-plus" />
                    </UButton>

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
                </UDrawer>
            </div>
        </div>

        <!-- Main content will go here -->
    </div>
</template>

<script lang="ts" setup>
    import { searchCompany, type PappersCompany } from '~/services/pappers-service'
    import AuthorityCard from '~/components/cards/authority-card.vue'
    definePageMeta({
        layout: 'dashboard'
    })

    const isDrawerOpen = ref(false)

    watch(isDrawerOpen, (newVal) => {
        console.log(newVal)
        if (!newVal) {
            isDrawerOpen.value = false
        }
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

<style>

</style>