<template>
    <div class="flex flex-col h-screen items-center justify-center bg-[var(--ui-bg-elevated)]">
        
        <UCard 
            :ui="{
                root: 'ring-0 rounded-lg w-[700px] transition-colors',
                body: 'p-4 flex flex-col'
            }"
            class="flex flex-col rounded-lg"
        >
            <template #header>
                <div class="flex flex-col gap-2 p-4">
                    <h1 class="text-xl font-bold">To create a firm, look up the firm name below</h1>
                    <p class="text-[var(--ui-text-dimmed)]">We'll find it on the french registrar for you</p>
                </div>
            </template>

            <div class="flex flex-col gap-4 min-h-0">
                <UInput v-model="searchTerm" icon="i-lucide-search" size="xl" variant="outline" placeholder="Search..." class="w-full"/>

                <div v-if="results.length > 0" class="flex flex-col gap-4 overflow-y-auto min-h-0 max-h-[350px] pr-2">

                    <UCard 
                        v-for="result in results" 
                        :key="result.siren"
                        :ui="{
                            root: 'ring-0 rounded-lg transition-colors cursor-pointer',
                            body: 'p-0 sm:p-0'
                        }"
                        @click="selectFirm(result)"
                    >
                        <div 
                            class="flex flex-row w-full items-center justify-between p-4 sm:p-6 rounded-[calc(var(--ui-radius)*2)] border border-[var(--ui-color-neutral-500)]"
                            :class="{ 'border border-[var(--ui-color-primary-500)]' : selectedFirm?.siren === result.siren }"
                        >
                            <div class="flex flex-row gap-4 items-center">
                                <div class="bg-teal-500/10 p-2 rounded-lg flex items-center justify-center h-[50%]">
                                    <UIcon 
                                    :name="'octicon:law-24'" 
                                    :class="['w-4 h-4']"
                                    />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <p class="text-xs text-[var(--ui-text-dimmed)]">{{ result.siren }}</p>
                                    <h2 class="text-xl font-bold gradient-text-primary">{{ result.name }}</h2>
                                    <p class="text-xs text-[var(--ui-text-dimmed)]">{{ result.type }}</p>
                                </div>
                            </div>
                            <div class="flex flex-col gap-1 text-right">
                                <span class="text-xs text-[var(--ui-text-dimmed)]">
                                    {{ result.partialAddress.zip }}
                                </span>
                                <span class="text-xs text-[var(--ui-text-dimmed)]">
                                    {{ result.partialAddress.city }}
                                </span>
                                <span class="text-xs text-[var(--ui-text-dimmed)]">
                                    {{ result.partialAddress.country }}
                                </span>
                            </div>
                        </div> 
                    </UCard>
                    
                    
                </div>
            </div>

            <template #footer>
                <div class="flex flex-row justify-end items-center w-full">
                    <UButton :disabled="!selectedFirm" label="Create" icon="i-heroicons-plus" color="primary" @click="createFirm()" />
                </div>
            </template>
        </UCard>
    </div>

  <!-- <UModal v-model:open="true" prevent-close>
    <template #header>
      <div class="flex flex-col gap-4">
        <h1 class="text-xl font-bold">To create a firm, look up the firm name below, we'll find it on the french registrar for you</h1>
      </div>
    </template>
    
    <template #body>

      <div ref="wrapperEl" class="flex flex-col gap-4">
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
                @click="selectFirm(result)"
              >
                Select
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
  </UModal> -->
</template>

<script lang="ts" setup>
import { searchCompany, type PappersCompany } from '~/services/pappers-service';
import AuthorityCard from '~/components/cards/authority-card.vue';
const searchTerm = ref('')
const results = ref<PappersCompany[]>([])
watch(searchTerm, async (newVal) => {
    if (newVal.length > 2) {
        results.value = await searchCompany(newVal, 100).then(res => res.filter(company => company.naf.includes('69.10Z')))
        console.log(results.value)
    }
})

const [wrapperEl] = useAutoAnimate()

const selectedFirm = ref<PappersCompany | null>(null)

const selectFirm = (firm: PappersCompany) => {
    selectedFirm.value = firm
    console.log(selectedFirm.value.siren)
}

const colorSchemes = [
  { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: 'hugeicons:corporate' },
  { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: 'hugeicons:building-4' },
  { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: 'hugeicons:building-3' },
  { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: 'hugeicons:office' },
  { bg: 'bg-rose-500/10', text: 'text-rose-500', icon: 'hugeicons:building-2' }
]

const coloredTypes = [
    { type: 'sarl', color: 'emerald', icon: 'hugeicons:corporate'},
    { type: 'sasu', color: 'teal', icon: 'hugeicons:building'},
    { type: 'sas', color: 'purple', icon: 'hugeicons:building'},
    { type: 'snc', color: 'pink', icon: 'hugeicons:office'},
    { type: 'sncf', color: 'blue', icon: 'hugeicons:building'}
]

function getColoredType(type: string) {
    const colorScheme = coloredTypes.find(t => type.toLowerCase().includes(t.type))
    if (colorScheme) {
        return {    
            ...colorScheme,
            bg: `bg-${colorScheme?.color}-500/10`
        }
    }
    return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        icon: 'hugeicons:corporate'
    }
}

const getRandomScheme = (id: string) => {
  // Use the id to consistently get the same color for the same company
  const index = parseInt(id.substring(0, 8), 16) % colorSchemes.length
  return colorSchemes[index]
}
</script>

<style>

</style>