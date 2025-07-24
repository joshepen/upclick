import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'
import StatusView from '@/views/StatusView.vue'
import TagView from '@/views/TagView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TaskView,
    },
    {
      path: '/',
      name: 'task',
      component: TaskView,
    },
    {
      path: '/status',
      name: 'status',
      component: StatusView,
    },
    {
      path: '/tag',
      name: 'tag',
      component: TagView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
})

export default router
