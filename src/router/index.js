import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/manage/manufacturers',
      name: 'manufacturers',
      component: () => import('../components/ManufacturerManager.vue'),
    },
    {
      path: '/manage/materials',
      name: 'materials',
      component: () => import('../components/MaterialManager.vue'),
    },
    {
      path: '/manage/colors',
      name: 'colors',
      component: () => import('../components/ColorManager.vue'),
    },
  ],
})

export default router
