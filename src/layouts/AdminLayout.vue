<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon"><i class="bi bi-mortarboard-fill"></i></div>
        <div class="brand-text"><span class="brand-name">AcademicWeb</span><span class="brand-badge">Admin</span></div>
      </div>
      <div class="sidebar-user">
        <div class="u-avatar">AD</div>
        <div>
          <div class="u-name">{{ auth.state.user?.name || 'Super Admin' }}</div>
          <div class="u-role">Administrator</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin"          class="nav-item" :class="{active:route.name==='admin-dashboard'}"><i class="bi bi-grid-1x2-fill"></i> Dashboard</router-link>
        <router-link to="/admin/students" class="nav-item" :class="{active:route.name==='admin-students'||route.name==='admin-student-detail'}"><i class="bi bi-people-fill"></i> Students</router-link>
        <router-link to="/admin/faculty"  class="nav-item" :class="{active:route.name==='admin-faculty'}"><i class="bi bi-person-workspace"></i> Faculty</router-link>
        <router-link to="/admin/subjects" class="nav-item" :class="{active:route.name==='admin-subjects'}"><i class="bi bi-journals"></i> Subjects</router-link>
        <router-link to="/admin/events"   class="nav-item" :class="{active:route.name==='admin-events'}"><i class="bi bi-calendar-event-fill"></i> Events</router-link>
        <router-link to="/admin/activity" class="nav-item" :class="{active:route.name==='admin-activity'}"><i class="bi bi-activity"></i> Activity Log</router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="btn-logout" @click="handleLogout"><i class="bi bi-box-arrow-left"></i> Sign Out</button>
      </div>
    </aside>

    <!-- Main -->
    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarOpen=!sidebarOpen"><i class="bi bi-list"></i></button>
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="topbar-right">
          <div class="admin-chip"><i class="bi bi-shield-check"></i> Admin Portal</div>
        </div>
      </header>
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const sidebarOpen = ref(true)

const titles = {
  'admin-dashboard':      'Dashboard',
  'admin-students':       'Manage Students',
  'admin-student-detail': 'Student Profile',
  'admin-faculty':        'Manage Faculty',
  'admin-subjects':       'Manage Subjects',
  'admin-events':         'Manage Events',
  'admin-activity':       'Activity Log',
}
const pageTitle = computed(() => titles[route.name] || 'Admin')

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ─── KEY FIX: NO overflow:hidden on shell or main ───────────
   overflow:hidden creates a new stacking context which traps
   position:fixed children inside the element instead of the
   full viewport. Only admin-content (the scroll area) gets
   overflow-y:auto. The sidebar clips itself fine with its own
   overflow:hidden which does NOT affect fixed positioning of
   siblings/children outside it.
────────────────────────────────────────────────────────────── */
.admin-shell {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  /* overflow:hidden REMOVED — was breaking position:fixed modals */
}

.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #0d3b66;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* sidebar clips its OWN content, does not affect fixed */
}

.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #f4f6f9;
  /* overflow:hidden REMOVED — was trapping position:fixed inside column */
}

.admin-content {
  flex: 1;
  overflow-y: auto; /* only this scrolls */
  padding: 24px;
}

/* ─── Rest of styles unchanged ─────────────────────────────── */
.sidebar-brand{padding:16px 14px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:10px;}
.brand-icon{width:30px;height:30px;background:#e9a825;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#0d3b66;font-size:15px;flex-shrink:0;}
.brand-name{font-size:13px;font-weight:700;color:#fff;display:block;line-height:1;}
.brand-badge{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#e9a825;display:block;margin-top:2px;}
.sidebar-user{padding:10px 12px;margin:10px 8px;background:rgba(255,255,255,0.07);border-radius:8px;display:flex;align-items:center;gap:8px;}
.u-avatar{width:30px;height:30px;border-radius:8px;background:#e9a825;color:#0d3b66;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.u-name{font-size:11px;font-weight:700;color:#fff;line-height:1.2;}
.u-role{font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;}
.sidebar-nav{flex:1;padding:8px;overflow-y:auto;}
.nav-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:7px;color:rgba(255,255,255,0.55);font-size:12px;font-weight:600;text-decoration:none;margin-bottom:2px;transition:all .15s;}
.nav-item i{font-size:14px;width:16px;text-align:center;}
.nav-item:hover{background:rgba(255,255,255,0.08);color:#fff;}
.nav-item.active{background:rgba(233,168,37,0.18);color:#e9a825;}
.sidebar-footer{padding:8px;border-top:1px solid rgba(255,255,255,0.1);}
.btn-logout{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;background:none;border:none;width:100%;cursor:pointer;font-family:inherit;}
.btn-logout:hover{background:rgba(255,50,50,0.15);color:#ff6b6b;}
.admin-topbar{background:#fff;border-bottom:1px solid #dee2e6;padding:12px 22px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.topbar-left{display:flex;align-items:center;gap:12px;}
.page-title{font-size:16px;font-weight:700;color:#0d3b66;}
.hamburger{display:none;border:none;background:none;font-size:20px;cursor:pointer;color:#0d3b66;}
.admin-chip{display:flex;align-items:center;gap:5px;padding:4px 12px;background:rgba(233,168,37,0.15);border:1px solid rgba(233,168,37,0.3);border-radius:20px;font-size:10px;font-weight:700;color:#b8890e;}
@media(max-width:768px){.admin-sidebar{display:none;}.hamburger{display:block;}}
</style>