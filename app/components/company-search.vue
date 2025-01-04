<template>
  <UForm :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Add an organisation" name="name">
      <UInput v-model="state.name" />
    </UFormField>

    <div v-for="company in companies" :key="company" class="space-y-4">
      <UCard :ui="{ body: 'w-full' }">
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-col">
                <i>{{ company.type }}</i>
                <h2>{{ company.name }}</h2>
                <i>{{ company.siren }}</i>
            </div>  
            <div>
                <p>{{ company.partialAddress.city }}, {{ company.partialAddress.country }}</p>
            </div>
            <UButton icon="i-heroicons-plus" label="Add" @click="$emit('company-added', company)"/>
        </div>
            
      </UCard>
    </div>
    
  </UForm>
</template>

<script lang="ts" setup>
    import { searchCompany, type PappersCompany } from '~/services/pappers-service';
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const emit = defineEmits<{
        'company-added': [value: PappersCompany]
    }>()

    const state = reactive({
        name: ''
    })

    const companies = ref()

    watch(() => state.name, async (newValue) => {
        if (newValue.length > 3) {
            const companiesSearch = await searchCompany(newValue)
            companies.value = companiesSearch
        }
    })

    const onSubmit = () => {
        
    }
</script>

<style>

</style>