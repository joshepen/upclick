<script setup lang="ts">
import { ref } from 'vue'
import XMBColumn from "@/components/XMBColumn.vue"
import XrossMediaBar from '@/components/XrossMediaBar.vue';
const activeList = ref(new Array(5).fill(false))
const activeList2 = ref(new Array(5).fill(false))
const xmbActiveList = ref(new Array(2).fill(false))
</script>

<template>
    <h1>This is a home page</h1>
    <XrossMediaBar class="flex-1 w-full bg-green-400" v-model:active-list="xmbActiveList" :default-active="0">
        <XMBColumn class="flex-1 w-full bg-red-400" v-model:active-list="activeList" :default-active="0"
            v-show="xmbActiveList[0]">
            <div class="h-full flex bg-blue-400" v-for="(_, index) in activeList" v-show="activeList[index]">
                {{ index }}
            </div>
        </XMBColumn>
        <XMBColumn class="flex-1 w-full bg-red-400" v-model:active-list="activeList2" :default-active="0"
            v-show="xmbActiveList[1]">
            <div class="h-full flex bg-orange-400" v-for="(_, index) in activeList2" v-show="activeList2[index]">
                {{ index }}
            </div>
        </XMBColumn>
    </XrossMediaBar>
</template>
