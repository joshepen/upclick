<script setup lang="ts">
import XrossMediaBar from '@/components/XrossMediaBar.vue';
</script>

<template>
    <h1>This is a home page</h1>
    <XrossMediaBar horizontal :default-active="0">
        <template #slot-0=slotProps>
            <XrossMediaBar class="flex-1 w-full bg-red-400" :default-active="0" :visible="slotProps.visible">
                <template #slot-0>
                    <div>TEST 0</div>
                </template>
                <template #slot-1>
                    <div>TEST 1</div>
                </template>
                <template #slot-2>
                    <div>TEST 2</div>
                </template>
            </XrossMediaBar>
        </template>
        <template #slot-1=slotProps>
            <XrossMediaBar class="flex-1 w-full bg-green-400" :default-active="2" :visible="slotProps.visible">
                <template #slot-0>
                    <div>TEST 0</div>
                </template>
                <template #slot-1>
                    <div>TEST 1</div>
                </template>
                <template #slot-2>
                    <div>TEST 2</div>
                </template>
            </XrossMediaBar>
        </template>
        <template #slot-2=slotProps>
            <XrossMediaBar class="flex-1 w-full bg-blue-400" :default-active="1" :visible="slotProps.visible">
                <template #slot-0>
                    <div>TEST 0</div>
                </template>
                <template #slot-1>
                    <div>TEST 1</div>
                </template>
                <template #slot-2>
                    <div>TEST 2</div>
                </template>
            </XrossMediaBar>
        </template>
    </XrossMediaBar>
</template>
