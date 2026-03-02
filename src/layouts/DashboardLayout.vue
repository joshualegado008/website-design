<template>
  <div style="display:flex; min-height:100vh;">

    <!-- ══════════════════════════════════════
         SIDEBAR
    ══════════════════════════════════════ -->
    <aside class="sidebar">

      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="bi bi-mortarboard-fill"></i>
        </div>
        <span>AcademicWeb</span>
      </div>

      <!-- User info -->
      <div class="sidebar-user">
        <div class="user-avatar">{{ state.user?.initials }}</div>
        <div class="ms-2" style="overflow:hidden; min-width:0;">
          <div class="user-name text-truncate">{{ state.user?.name || 'User' }}</div>
          <div class="user-role text-capitalize">{{ state.user?.role }}</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <p class="nav-section-label">Main</p>

        <button class="s-nav-item" :class="{ active: rn === 'dashboard' }" @click="go('dashboard')">
          <i class="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </button>

        <p class="nav-section-label">Academic</p>

        <!-- Student nav items -->
        <template v-if="isStudent">
          <button class="s-nav-item" :class="{ active: rn === 'profile' }" @click="go('profile')">
            <i class="bi bi-person-badge-fill"></i><span>Student Profile</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'syllabus' }" @click="go('syllabus')">
            <i class="bi bi-journal-text"></i><span>Syllabus</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'curriculum' }" @click="go('curriculum')">
            <i class="bi bi-diagram-3-fill"></i><span>Curriculum</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'lessons' }" @click="go('lessons')">
            <i class="bi bi-book-fill"></i><span>Lessons</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'events' }" @click="go('events')">
            <i class="bi bi-calendar-event-fill"></i><span>Events</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'scheduling' }" @click="go('scheduling')">
            <i class="bi bi-clock-fill"></i><span>Scheduling</span>
          </button>
        </template>

        <!-- Faculty nav items -->
        <template v-if="isFaculty">
          <button class="s-nav-item" :class="{ active: rn === 'profile' }" @click="go('profile')">
            <i class="bi bi-person-workspace"></i><span>Faculty Profile</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'syllabus' }" @click="go('syllabus')">
            <i class="bi bi-journal-text"></i><span>Syllabus</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'curriculum' }" @click="go('curriculum')">
            <i class="bi bi-diagram-3-fill"></i><span>Curriculum</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'lessons' }" @click="go('lessons')">
            <i class="bi bi-book-fill"></i><span>Lessons</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'events' }" @click="go('events')">
            <i class="bi bi-calendar-event-fill"></i><span>Events</span>
          </button>
          <button class="s-nav-item" :class="{ active: rn === 'scheduling' }" @click="go('scheduling')">
            <i class="bi bi-clock-fill"></i><span>Scheduling</span>
          </button>
        </template>
      </nav>

      <!-- Sign out button -->
      <div class="sidebar-footer">
        <button class="btn-logout" @click="handleLogout">
          <i class="bi bi-box-arrow-left"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- ══════════════════════════════════════
         MAIN CONTENT
    ══════════════════════════════════════ -->
    <div class="main-content">

      <!-- Topbar -->
      <header class="topbar">
        <div class="d-flex align-items-center gap-2">
          <span class="topbar-title">{{ pageTitle }}</span>
          <span
            class="badge rounded-pill text-capitalize"
            :class="isStudent ? 'bg-primary' : 'bg-success'"
            style="font-size:10px; padding:4px 10px;"
          >
            {{ state.user?.role }}
          </span>
        </div>

        <div class="topbar-right">
          <button class="topbar-btn" title="Notifications">
            <i class="bi bi-bell"></i>
            <span class="notif-dot"></span>
          </button>
          <button class="topbar-btn" title="Settings">
            <i class="bi bi-gear"></i>
          </button>
          <div class="topbar-avatar">{{ state.user?.initials }}</div>
        </div>
      </header>

      <!-- Routed page -->
      <div class="page-area">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

// Destructure directly — state is the reactive object, isStudent/isFaculty are computed refs
const { state, isStudent, isFaculty, logout } = useAuthStore()

const router = useRouter()
const route  = useRoute()

const rn = computed(() => route.name)

const pageTitle = computed(() => {
  const titles = {
    dashboard:  'Dashboard',
    profile:    isStudent.value ? 'Student Profile' : 'Faculty Profile',
    syllabus:   'Syllabus',
    curriculum: 'Curriculum',
    lessons:    'Lessons',
    events:     'Events',
    scheduling: 'Scheduling'
  }
  return titles[route.name] || 'Dashboard'
})

function go(name) {
  router.push({ name })
}

// ── Logout fix: call store logout then navigate ──
function handleLogout() {
  logout()          // sets state.user = null
  router.push('/login')
}
</script>
