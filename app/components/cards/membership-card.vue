<template>
    <UCard 
        class="grid min-w-[292px] max-h-[468px] h-full" 
        :ui="{
            root: 'bg-transparent ring-0',
            body: 'p-0 sm:p-0',
        }"
    >
    <div class="flex relative w-full">
        <div class="chip">
            Monthly plan
        </div>
        <div class="gradient-bg min-h-[468px] w-full overflow-hidden rounded-[calc(var(--ui-radius)*2)]">
            <div class="content h-full flex flex-col items-center justify-between text-center relative z-10">
                <div class="pt-[120px]">
                    <h1>$99</h1>
                    <p>per month</p>
                </div>
                <div class="separator absolute bottom-[138px] h-[1px] left-[6px] w-[calc(100%-12px)]"/>
                <div class="pb-[36px]">
                    <UButton label="Manage Subscription"/>
                    <p>View billing history</p>
                </div>
            </div>
        </div>
    </div>
</UCard>
</template>

<script lang="ts" setup>

</script>

<style>
    .gradient-bg {
        background: linear-gradient(205.08deg, rgba(69, 81, 82, 0.067) 0%, rgba(69, 77, 82, 0.5) 99.16%);
    }

    .separator::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.24);
    }
    .separator::after {
        content: "";
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.24);
    }

    .content {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    .content::before {
        content: "";
        position: absolute;
        width: 9px;
        height: 9px;
        border-radius: 5px;
        z-index: 1;
        border: 1px solid rgb(45, 49, 54);
        pointer-events: none;
        transition: border-color 0.25s;
        left: -5px;
        bottom: 136px;
        background: rgb(26, 27, 32);
    }

    .content::after {
        content: "";
        position: absolute;
        width: 9px;
        height: 9px;
        border-radius: 5px;
        z-index: 1;
        pointer-events: none;
        transition: border-color 0.25s;
        right: -5px;
        background: rgb(26, 27, 32);
        bottom: 134px;
        border: 1px solid rgb(35, 35, 38);
    }

    .chip {
        position: absolute;
        width: 113px;
        height: 14px;
        background: rgb(0, 0, 0);
        text-align: center;
        border-radius: 5px;
        color: rgb(134, 143, 151);
        font-size: 10px;
        font-weight: 600;
        z-index: 1;
        text-transform: uppercase;
        left: 0px;
        right: 0px;
        margin: 0px auto;
        top: -7px;
    }

    .up {
        padding: 120px 0px 0px;
    }

    .down {
        padding-bottom: 36px;
    }
</style>