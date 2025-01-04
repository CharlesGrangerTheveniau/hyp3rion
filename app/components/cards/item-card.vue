<template>
    <UCard class="transition-all item-card duration-400 bg-[var(--ui-bg-dark)]">
        <template #header>
            <slot name="header"/>
        </template>
        <slot/>
    </UCard>
</template>

<script lang="ts" setup>

</script>

<style>
    .item-card {
        box-shadow: rgba(0, 0, 0, 0.13) 0px 25px 35px;
    }
</style>