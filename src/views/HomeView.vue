<script setup lang="ts">
import { ref } from 'vue'
import XMBColumn from "@/components/XMBColumn.vue"
const activeList = ref(new Array(3).fill(false))
</script>

<template>
    <h1>This is a home page</h1>
    <XMBColumn class="flex-1 w-full bg-red-400" v-model:active-list="activeList" :default-active="0">
        <div class="h-full flex bg-blue-400" v-for="(_, index) in activeList" v-show="activeList[index]">
            {{ index }}
        </div>

    </XMBColumn>
</template>
