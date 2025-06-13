<script setup lang="ts">
import { defineModel, defineProps } from "vue"
const activeList = defineModel('activeList')
console.log('1', activeList.value)

const props = defineProps({
    defaultActive: {
        type: Number, required: true
    }
})
let activeIndex = props.defaultActive
activeList.value[activeIndex] = true
console.log('2', activeList.value)

function moveUp() {
    if (activeIndex > 0) {
        activeList.value[activeIndex] = false
        activeIndex -= 1
        activeList.value[activeIndex] = true
    }
}

function moveDown() {
    if (activeIndex < activeList.value.length - 1) {
        activeList.value[activeIndex] = false
        activeIndex += 1
        activeList.value[activeIndex] = true
    }
}

</script>

<template>
    <div @keyup.up="moveUp" @keyup.down="moveDown" tabindex="0">
        <slot />
    </div>
</template>