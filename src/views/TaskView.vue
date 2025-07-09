<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore';
const { tasks } = useTaskStore()
</script>

<template>
    <div v-for="task in tasks">
        {{ task.title }}
    </div>
</template>