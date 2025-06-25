<script setup lang="ts">
import { ref, defineProps, useSlots, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    defaultActive: {
        type: Number,
        required: true,
    },
    horizontal: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true
    }
})

const slots = useSlots()
const slotCount = computed(() => {
    return Object.keys(slots).filter((name) => /^slot-\d+$/.test(name)).length
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

function listenForMove(event: KeyboardEvent) {
    console.log(event.key, props.horizontal, props.visible)
    if (props.visible)
        if (props.horizontal) {
            if (event.key === 'ArrowRight') {
                moveUp()
            } else if (event.key === 'ArrowLeft') {
                moveDown()
            }
        } else {
            if (event.key === 'ArrowUp') {
                moveUp()
            } else if (event.key === 'ArrowDown') {
                moveDown()
            }
        }
}

onMounted(() => {
    window.addEventListener("keydown", listenForMove)
})

onUnmounted(() => {
    window.removeEventListener("keydown", listenForMove)
})
</script>

<template>
    <div>
        <div v-for="index in slotCount" :key="index">
            <div v-show="activeIndex === index - 1">
                <slot :name="'slot-' + (index - 1)" :visible="activeIndex === index - 1" />
            </div>
        </div>
    </div>
</template>
