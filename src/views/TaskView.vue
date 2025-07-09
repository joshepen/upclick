<script setup lang="ts">
import { useLocalStore } from '@/stores/LocalStore';
import { onMounted } from 'vue';

const { tasks } = useLocalStore()

onMounted(() => console.log(tasks))
</script>

<template>
    <div v-for="task in tasks">
        {{ task.title }}
    </div>
</template>