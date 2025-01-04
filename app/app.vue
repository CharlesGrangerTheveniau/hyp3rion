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

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.3s cubic-bezier(0.3, 0, 0.3, 1);
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  .page-enter-from {
    opacity: 0;
    transform: rotateX(10deg) translateZ(-100px);
  }
  .page-leave-to {
    opacity: 0;
    transform: rotateX(-10deg) translateZ(-100px);
  }
</style>