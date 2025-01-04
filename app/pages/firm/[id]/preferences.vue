<template>
    <div>
        <header class="app-header">
            <div class="h-[150px] flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <h1 class="text-4xl font-bold">Preferences</h1>
            </div>
        </header>

        <main class="app-main">
            <div class="flex flex-col gap-4 mt-4">
                <ItemCard>
                    <template #header>
                        <p>Header</p>
                    </template>
                    <p>Body</p>
                    <template #footer>
                        <p>Footer</p>
                    </template>
                </ItemCard>

                <FirmTeam/>
            </div>

        </main>
  </div>
</template>

<script lang="ts" setup>

import ItemCard from '~/components/cards/item-card.vue'
import FirmTeam from '~/components/tables/firm-team.vue'
    definePageMeta({
        layout: 'firm-dashboard'
    })

    
    

</script>

<style>

</style>