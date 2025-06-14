<script setup lang="ts">
import { ref, defineProps, useSlots, computed } from "vue"

const props = defineProps({
    defaultActive: {
        type: Number, required: true
    },
    slotCount: {
        type: Number, required: true
    }
})

const slots = useSlots()
const slotCount = computed(() => {
    return Object.keys(slots).filter(name => /^slot-\d+$/.test(name)).length
})

const activeIndex = ref(props.defaultActive)

function moveDown() {
    if (activeIndex.value > 0) {
        activeIndex.value -= 1
    }
}

function moveUp() {
    if (activeIndex.value < slotCount.value - 1) {
        activeIndex.value += 1
    }
}

</script>

<template>
    <div @keyup.up="moveDown" @keyup.down="moveUp" tabindex="0">
        <div v-for="index in slotCount" :key="index">
            <div v-show="activeIndex === index - 1">
                <slot :name="'slot-' + (index - 1)" />
            </div>
        </div>
    </div>
</template>