<script setup lang="ts">
import { defineModel, defineProps } from "vue"
const activeList = defineModel('activeList')

const props = defineProps({
    defaultActive: {
        type: Number, required: true
    }
})
let activeIndex = props.defaultActive
activeList.value[activeIndex] = true

function moveDown() {
    if (activeIndex > 0) {
        activeList.value[activeIndex] = false
        activeIndex -= 1
        activeList.value[activeIndex] = true
    }
}

function moveUp() {
    if (activeIndex < activeList.value.length - 1) {
        activeList.value[activeIndex] = false
        activeIndex += 1
        activeList.value[activeIndex] = true
    }
}

</script>

<template>
    <div @keyup.up="moveDown" @keyup.down="moveUp" tabindex="0">
        <slot />
    </div>
</template>