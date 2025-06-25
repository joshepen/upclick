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

const lastIndex = ref(props.defaultActive)

const transitionName = computed(() => {
    if (props.horizontal) {
        return activeIndex.value > lastIndex.value ? 'slide-left' : 'slide-right'
    } else {
        return activeIndex.value > lastIndex.value ? 'slide-down' : 'slide-up'
    }
})

watch(activeIndex, (newIndex, oldIndex) => {
    lastIndex.value = oldIndex
})


onMounted(() => {
    window.addEventListener("keydown", listenForMove)
})

onUnmounted(() => {
    window.removeEventListener("keydown", listenForMove)
})
</script>

<template>
    <div class="relative">
        <div v-for="index in slotCount" :key="index">
            <Transition :name="transitionName" mode="in-out">
                <div v-show="activeIndex === index - 1">
                    <slot :name="'slot-' + (index - 1)" :visible="activeIndex === index - 1" />
                </div>
            </Transition>
        </div>
    </div>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
    position: absolute;
    width: 100%;
}

.slide-left-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
    position: absolute;
    width: 100%;
}

.slide-right-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
    position: absolute;
    width: 100%;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
    position: absolute;
    width: 100%;
}

.slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>