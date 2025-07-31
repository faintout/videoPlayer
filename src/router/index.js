import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path:'/',
      redirect:'/videoPlay'
    },
    {
      path: '/videoPlay',
      name: 'videoPlay',
      component: () => import('@/view/videoPlay/index.vue')
    }
  ],
})

export default router
