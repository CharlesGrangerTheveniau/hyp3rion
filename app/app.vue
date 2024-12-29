<script setup lang="ts">
  import { TooltipProvider } from 'reka-ui'
  import { Analytics } from '@vercel/analytics/nuxt';


</script>

<template>
  <Analytics />
  <TooltipProvider>
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </TooltipProvider>
  
</template>
