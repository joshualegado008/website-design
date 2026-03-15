<template>
  <div class="page-body">
    <div v-if="loading" class="loading-state"><i class="bi bi-arrow-repeat spin"></i> Loading dashboard…</div>
    <template v-else>
      <!-- Stat cards -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-icon" :style="{background:s.bg,color:s.color}"><i :class="s.icon"></i></div>
          <div><div class="stat-val">{{ s.val }}</div><div class="stat-lbl">{{ s.label }}</div><div class="stat-sub">{{ s.sub }}</div></div>
        </div>
      </div>
      <!-- Schedule + Events -->
      <div class="row-panels">
        <div class="panel flex-2">
          <div class="panel-head"><span class="panel-title">Today's Schedule</span><router-link to="/dashboard/scheduling" class="plink">View All</router-link></div>
          <div v-if="todaySchedule.length===0" class="empty-msg">No classes today.</div>
          <div v-for="s in todaySchedule" :key="s.id" class="list-item">
            <div class="li-icon"><i class="bi bi-clock-fill"></i></div>
            <div class="li-body"><div class="li-title">{{ s.description }}</div><div class="li-sub">{{ s.code }} · {{ s.room }}</div></div>
            <div class="li-time">{{ s.time }}</div>
          </div>
        </div>
        <div class="panel flex-1">
          <div class="panel-head"><span class="panel-title">Upcoming Events</span><router-link to="/dashboard/events" class="plink">See All</router-link></div>
          <div v-if="upcomingEvents.length===0" class="empty-msg">No upcoming events.</div>
          <div v-for="e in upcomingEvents" :key="e.id" class="list-item">
            <div class="li-icon" style="background:#fff8e1;color:#b8890e"><i class="bi bi-calendar-event-fill"></i></div>
            <div class="li-body"><div class="li-title">{{ e.title }}</div><div class="li-sub">{{ e.date }}</div></div>
          </div>
        </div>
      </div>
      <!-- Progress (student only) -->
      <div class="panel" v-if="auth.isStudent.value && curriculumStats">
        <div class="panel-head"><span class="panel-title">Curriculum Progress</span><router-link to="/dashboard/curriculum" class="plink">Details</router-link></div>
        <div class="panel-body">
          <div class="prog-row"><div class="prog-label-row"><span>Completed</span><span>{{ curriculumStats.completed }} subjects</span></div><div class="prog-bar"><div class="prog-fill" :style="{width: curriculumStats.completedPct+'%'}"></div></div></div>
          <div class="prog-row"><div class="prog-label-row"><span>In Progress</span><span>{{ curriculumStats.inProgress }} subjects</span></div><div class="prog-bar"><div class="prog-fill" style="background:#e9a825" :style="{width: curriculumStats.inProgressPct+'%'}"></div></div></div>
        </div>
      </div>
      <!-- Faculty: subject overview -->
      <div class="panel" v-if="auth.isFaculty.value && facultySubjects.length > 0">
        <div class="panel-head"><span class="panel-title">Subjects Overview</span></div>
        <div class="panel-body">
          <div class="prog-row" v-for="s in facultySubjects" :key="s.id">
            <div class="prog-label-row"><span>{{ s.description }}</span><span>{{ s.enrolled }} students</span></div>
            <div class="prog-bar"><div class="prog-fill" :style="{width: Math.min(100,(s.enrolled/50)*100)+'%'}"></div></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { supabase } from '@/lib/supabase.js'

const auth    = useAuthStore()
const loading = ref(true)
const schedules      = ref([])
const events         = ref([])
const grades         = ref([])
const curriculumData = ref([])
const facultySubjects= ref([])

onMounted(async () => {
  const uid  = auth.state.user?.id
  const role = auth.state.role
  const tasks = [
    supabase.from('schedules').select('*').eq('owner_type', role).eq('owner_id', uid).limit(10),
    supabase.from('events').select('*').or(`owner_id.eq.${uid},owner_type.eq.all`).order('date').limit(5),
  ]
  if (role === 'student') {
    tasks.push(supabase.from('grades').select('*').eq('student_id', uid))
    tasks.push(supabase.from('curriculum').select('*').eq('owner_type','student').eq('owner_id',uid))
  }
  if (role === 'faculty') {
    tasks.push(supabase.from('faculty_subjects').select('*').eq('faculty_id', uid))
  }
  const results = await Promise.all(tasks)
  schedules.value       = results[0].data || []
  events.value          = results[1].data || []
  if (role === 'student') { grades.value = results[2].data||[]; curriculumData.value = results[3].data||[] }
  if (role === 'faculty') { facultySubjects.value = results[2].data||[] }
  loading.value = false
})

const todaySchedule = computed(() => schedules.value.slice(0, 3))
const upcomingEvents = computed(() => events.value.slice(0, 3))

const curriculumStats = computed(() => {
  const all = curriculumData.value
  if (!all.length) return null
  const completed  = all.filter(c => c.status === 'Completed').length
  const inProgress = all.filter(c => c.status === 'In Progress').length
  return { completed, inProgress, completedPct: Math.round((completed/all.length)*100), inProgressPct: Math.round((inProgress/all.length)*100) }
})

const gpa = computed(() => {
  const g = grades.value
  if (!g.length) return '—'
  return (g.reduce((a,b) => a + parseFloat(b.final_grade||0), 0) / g.length).toFixed(2)
})

const stats = computed(() => {
  if (auth.isStudent.value) return [
    { label:'Enrolled Subjects', val: schedules.value.length, sub:'This semester', icon:'bi bi-journals',       bg:'#e8f4fd', color:'#0d3b66' },
    { label:'Passed Subjects',   val: grades.value.filter(g=>g.remarks==='Passed').length, sub:'All passed', icon:'bi bi-check2-circle', bg:'#f0fff4', color:'#198754' },
    { label:'Current GPA',       val: gpa.value, sub:'This semester',  icon:'bi bi-award',        bg:'#fff8e1', color:'#b8890e' },
    { label:'Attendance Rate',   val: '95%', sub:'Estimated',          icon:'bi bi-person-check', bg:'#f5f0ff', color:'#6f42c1' },
  ]
  return [
    { label:'Total Students', val: facultySubjects.value.reduce((a,b)=>a+(b.enrolled||0),0), sub:'All sections', icon:'bi bi-people',        bg:'#e8f4fd', color:'#0d3b66' },
    { label:'Subjects',       val: facultySubjects.value.length, sub:'This semester', icon:'bi bi-journals',      bg:'#f0fff4', color:'#198754' },
    { label:'Classes Today',  val: schedules.value.length, sub:'Scheduled',     icon:'bi bi-calendar-check', bg:'#fff8e1', color:'#b8890e' },
    { label:'Pending Grades', val: 0, sub:'Up to date',           icon:'bi bi-pencil-square', bg:'#f5f0ff', color:'#6f42c1' },
  ]
})
</script>

<style scoped>
.page-body{padding:20px 22px;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px;}
.stat-card{background:#fff;border:1px solid #dee2e6;border-radius:10px;padding:16px;display:flex;align-items:flex-start;gap:12px;}
.stat-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
.stat-val{font-size:24px;font-weight:700;color:#0d3b66;line-height:1;}
.stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6c757d;margin-top:3px;}
.stat-sub{font-size:10px;color:#6c757d;margin-top:2px;}
.row-panels{display:flex;gap:14px;margin-bottom:14px;}
.flex-2{flex:2;}.flex-1{flex:1;}
.panel{background:#fff;border:1px solid #dee2e6;border-radius:10px;overflow:hidden;margin-bottom:14px;}
.panel-head{padding:12px 16px;border-bottom:1px solid #f2f2f2;display:flex;align-items:center;justify-content:space-between;}
.panel-title{font-size:13px;font-weight:700;color:#0d3b66;}
.plink{font-size:11px;font-weight:700;color:#0d3b66;text-decoration:none;}
.panel-body{padding:14px 16px;}
.list-item{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f8f9fa;}
.list-item:last-child{border-bottom:none;}
.li-icon{width:32px;height:32px;border-radius:9px;background:#e8f4fd;color:#0d3b66;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.li-body{flex:1;min-width:0;}
.li-title{font-size:12px;font-weight:600;color:#212529;}
.li-sub{font-size:10px;color:#6c757d;}
.li-time{font-size:10px;color:#0d3b66;font-weight:600;white-space:nowrap;}
.empty-msg{padding:18px 16px;font-size:12px;color:#6c757d;}
.prog-row{margin-bottom:12px;}
.prog-label-row{display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#212529;margin-bottom:4px;}
.prog-bar{height:5px;background:#e9ecef;border-radius:99px;overflow:hidden;}
.prog-fill{height:100%;border-radius:99px;background:#0d3b66;transition:width .4s;}
.loading-state{padding:60px;text-align:center;color:#6c757d;font-size:14px;}
@keyframes spin{to{transform:rotate(360deg);}}.spin{display:inline-block;animation:spin .7s linear infinite;}
@media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}.row-panels{flex-direction:column;}}
</style>