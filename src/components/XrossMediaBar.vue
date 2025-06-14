<script setup lang="ts">
import { ref, defineProps, useSlots, computed } from "vue"

// TODO Handle mouse events to work globally but only for active slot?

const props = defineProps({
    defaultActive: {
        type: Number, required: true
    },
    horizontal: {
        type: Boolean, default: false
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
    <div v-if="!props.horizontal" @keyup.up="moveDown" @keyup.down="moveUp" tabindex="0">
        <div v-for="index in slotCount" :key="index">
            <div v-show="activeIndex === index - 1">
                <slot :name="'slot-' + (index - 1)" />
            </div>
        </div>
    </div>
    <div v-else @keyup.left="moveDown" @keyup.right="moveUp" tabindex="0">
        <div v-for="index in slotCount" :key="index">
            <div v-show="activeIndex === index - 1">
                <slot :name="'slot-' + (index - 1)" />
            </div>
        </div>
    </div>
</template>