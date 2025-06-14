<script setup lang="ts">
import { ref } from 'vue'
import XMBColumn from "@/components/XMBColumn.vue"
import XrossMediaBar from '@/components/XrossMediaBar.vue';
const activeList = ref(new Array(5).fill(false))
</script>

<template>
    <h1>This is a home page</h1>
    <XMBColumn class="flex-1 w-full bg-red-400" v-model:active-list="activeList" :default-active="1" :slot-count=3>
        <template #slot-0>
            <div>TEST 0</div>
        </template>
        <template #slot-1>
            <div>TEST 1</div>
        </template>
        <template #slot-2>
            <div>TEST 2</div>
        </template>
    </XMBColumn>
</template>
