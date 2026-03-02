import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

import Login      from '@/views/Login.vue'
import Dashboard  from '@/views/Dashboard.vue'
import Profile    from '@/views/Profile.vue'
import Syllabus   from '@/views/Syllabus.vue'
import Curriculum from '@/views/Curriculum.vue'
import Lessons    from '@/views/Lessons.vue'
import Events     from '@/views/Events.vue'
import Scheduling from '@/views/Scheduling.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '',           component: Dashboard,  name: 'dashboard'  },
      { path: 'profile',    component: Profile,    name: 'profile'    },
      { path: 'syllabus',   component: Syllabus,   name: 'syllabus'   },
      { path: 'curriculum', component: Curriculum, name: 'curriculum' },
      { path: 'lessons',    component: Lessons,    name: 'lessons'    },
      { path: 'events',     component: Events,     name: 'events'     },
      { path: 'scheduling', component: Scheduling, name: 'scheduling' }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn.value) return '/login'
  if (to.path === '/login' && auth.isLoggedIn.value)  return '/dashboard'
})

export default router
