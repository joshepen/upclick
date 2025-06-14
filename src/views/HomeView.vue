<script setup lang="ts">
import { ref } from 'vue'
import XrossMediaBar from '@/components/XrossMediaBar.vue';
const activeList = ref(new Array(5).fill(false))
</script>

<template>
    <h1>This is a home page</h1>
    <XrossMediaBar horizontal :default-active="0">
        <template #slot-0>
            <XrossMediaBar class="flex-1 w-full bg-red-400" v-model:active-list="activeList" :default-active="1">
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
        <template #slot-1>
            <XrossMediaBar class="flex-1 w-full bg-green-400" v-model:active-list="activeList" :default-active="1">
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
        <template #slot-2>
            <XrossMediaBar class="flex-1 w-full bg-blue-400" v-model:active-list="activeList" :default-active="1">
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
