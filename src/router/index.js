import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'
import Login         from '@/views/Login.vue'
import Dashboard     from '@/views/Dashboard.vue'
import Profile       from '@/views/Profile.vue'
import Syllabus      from '@/views/Syllabus.vue'
import Curriculum    from '@/views/Curriculum.vue'
import Lessons       from '@/views/Lessons.vue'
import Events        from '@/views/Events.vue'
import Scheduling    from '@/views/Scheduling.vue'
import SubjectDetail from '@/views/SubjectDetail.vue'
import Users         from '@/views/Users.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AdminLayout          from '@/layouts/AdminLayout.vue'
import AdminDashboard       from '@/views/admin/AdminDashboard.vue'
import AdminStudents        from '@/views/admin/AdminStudents.vue'
import AdminStudentDetail   from '@/views/admin/AdminStudentDetail.vue'
import AdminFaculty         from '@/views/admin/AdminFaculty.vue'
import AdminSubjects        from '@/views/admin/AdminSubjects.vue'
import AdminEvents          from '@/views/admin/AdminEvents.vue'
import AdminActivityLog     from '@/views/admin/AdminActivityLog.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { public: true } },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['student','faculty'] },
    children: [
      { path: '',                       component: Dashboard,     name: 'dashboard'      },
      { path: 'profile',                component: Profile,       name: 'profile'        },
      { path: 'syllabus',               component: Syllabus,      name: 'syllabus'       },
      { path: 'curriculum',             component: Curriculum,    name: 'curriculum'     },
      { path: 'lessons',                component: Lessons,       name: 'lessons'        },
      { path: 'events',                 component: Events,        name: 'events'         },
      { path: 'scheduling',             component: Scheduling,    name: 'scheduling'     },
      { path: 'subject/:code/:section', component: SubjectDetail, name: 'subject-detail' },
      { path: 'users',                  component: Users,         name: 'users'          },
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: '',                   component: AdminDashboard,     name: 'admin-dashboard'       },
      { path: 'students',           component: AdminStudents,      name: 'admin-students'        },
      { path: 'students/:id',       component: AdminStudentDetail, name: 'admin-student-detail'  },
      { path: 'faculty',            component: AdminFaculty,       name: 'admin-faculty'         },
      { path: 'subjects',           component: AdminSubjects,      name: 'admin-subjects'        },
      { path: 'events',             component: AdminEvents,        name: 'admin-events'          },
      { path: 'activity',           component: AdminActivityLog,   name: 'admin-activity'        },
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn.value) return '/login'
  if (to.path === '/login' && auth.isLoggedIn.value)
    return auth.isAdmin.value ? '/admin' : '/dashboard'
  if (to.meta.roles && !to.meta.roles.includes(auth.state.role))
    return auth.isAdmin.value ? '/admin' : '/dashboard'
})

export default router