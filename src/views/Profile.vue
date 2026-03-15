<template>
  <div>
    <div v-if="loading" class="loading-state">
      <i class="bi bi-arrow-repeat spin"></i> Loading profile…
    </div>
    <template v-else>

      <!-- Hero -->
      <div class="profile-hero mb-4">
        <div class="hero-avatar">{{ auth.state.user?.initials || '?' }}</div>
        <div>
          <div class="hero-name">{{ auth.state.user?.name || '—' }}</div>
          <div class="hero-sub">
            {{ auth.isStudent.value ? 'Student' : 'Faculty' }} ·
            {{ auth.isStudent.value ? auth.state.user?.program : auth.state.user?.department }}
          </div>
          <div class="hero-id"><i class="bi bi-id-card"></i> {{ auth.state.user?.id }}</div>
        </div>
      </div>

      <div class="info-grid">

        <!-- Personal Information -->
        <div class="panel">
          <div class="panel-head"><span class="panel-title">Personal Information</span></div>
          <div class="panel-body">
            <div class="info-row" v-for="f in personalFields" :key="f.label">
              <span class="info-lbl">{{ f.label }}</span>
              <span class="info-val">{{ f.value || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Academic / Professional Info -->
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">{{ auth.isStudent.value ? 'Academic Information' : 'Professional Information' }}</span>
          </div>
          <div class="panel-body">
            <div class="info-row" v-for="f in roleFields" :key="f.label">
              <span class="info-lbl">{{ f.label }}</span>
              <span class="info-val">{{ f.value || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Student: Adviser card -->
        <div class="panel adviser-panel" v-if="auth.isStudent.value">
          <div class="panel-head"><span class="panel-title">Assigned Adviser</span></div>
          <div class="panel-body">
            <div v-if="adviser" class="adviser-card">
              <div class="adviser-avatar">{{ adviser.initials }}</div>
              <div class="adviser-info">
                <div class="adviser-name">{{ adviser.name }}</div>
                <div class="adviser-pos">{{ adviser.position }} · {{ adviser.department }}</div>
                <div class="adviser-contact"><i class="bi bi-envelope"></i> {{ adviser.email }}</div>
                <div class="adviser-contact" v-if="adviser.phone"><i class="bi bi-telephone"></i> {{ adviser.phone }}</div>
                <div class="adviser-spec" v-if="adviser.specialization">
                  <i class="bi bi-mortarboard"></i> {{ adviser.specialization }}
                </div>
              </div>
            </div>
            <div v-else class="no-adviser">
              <i class="bi bi-person-x"></i>
              <span>No adviser assigned yet.</span>
            </div>
          </div>
        </div>

        <!-- Faculty: Advised students -->
        <div class="panel adviser-panel" v-if="auth.isFaculty.value">
          <div class="panel-head">
            <span class="panel-title">Advised Students</span>
            <span class="count-badge">{{ advisedStudents.length }}</span>
          </div>
          <div class="panel-body">
            <div v-if="advisedStudents.length === 0" class="no-adviser">
              <i class="bi bi-people"></i>
              <span>No students assigned yet.</span>
            </div>
            <div v-else class="advised-list">
              <div v-for="s in advisedStudents" :key="s.id" class="advised-row">
                <div class="advised-avatar">{{ s.initials }}</div>
                <div class="advised-info">
                  <div class="advised-name">{{ s.name }}</div>
                  <div class="advised-sub">{{ s.id }} · {{ s.program }}</div>
                  <div class="advised-sub">{{ s.year_level }} · {{ s.section }}</div>
                </div>
                <span class="section-chip">{{ s.section }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Student: Grades -->
      <div class="panel mt-panel" v-if="auth.isStudent.value">
        <div class="panel-head"><span class="panel-title">Grades Summary</span></div>
        <div v-if="grades.length === 0" class="empty-msg">No grades recorded yet.</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="ps">Code</th><th>Description</th><th>Units</th>
                <th>Midterm</th><th>Finals</th><th>Grade</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in grades" :key="g.id">
                <td class="ps"><strong>{{ g.code }}</strong></td>
                <td>{{ g.description }}</td>
                <td class="center">{{ g.units }}</td>
                <td class="center">{{ g.midterm ?? '—' }}</td>
                <td class="center">{{ g.finals ?? '—' }}</td>
                <td class="center"><strong class="grade-val">{{ g.final_grade ?? '—' }}</strong></td>
                <td><span class="badge" :class="g.remarks==='Passed'?'badge-pass':'badge-fail'">{{ g.remarks || 'Pending' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Faculty: Handled Subjects -->
      <div class="panel mt-panel" v-if="auth.isFaculty.value">
        <div class="panel-head"><span class="panel-title">Handled Subjects</span></div>
        <div v-if="subjects.length === 0" class="empty-msg">No subjects assigned yet.</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="ps">Code</th><th>Description</th><th>Section</th>
                <th>Units</th><th>Schedule</th><th>Room</th><th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in subjects" :key="s.id">
                <td class="ps"><strong>{{ s.code }}</strong></td>
                <td>{{ s.description }}</td>
                <td>{{ s.section }}</td>
                <td class="center">{{ s.units }}</td>
                <td>{{ s.schedule }}</td>
                <td>{{ s.room }}</td>
                <td class="center">{{ s.enrolled }}</td>
              </tr>
            </tbody>
          </table>
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
const adviser = ref(null)
const advisedStudents = ref([])
const grades  = ref([])
const subjects= ref([])

onMounted(async () => {
  const user = auth.state.user
  const role = auth.state.role

  if (role === 'student') {
    const tasks = [
      supabase.from('grades').select('*').eq('student_id', user.id).order('code'),
    ]
    // Load adviser if adviser_id is set
    if (user.adviser_id) {
      tasks.push(supabase.from('faculty').select('*').eq('id', user.adviser_id).single())
    }
    const results = await Promise.all(tasks)
    grades.value  = results[0].data || []
    if (user.adviser_id && results[1]?.data) adviser.value = results[1].data
  }

  if (role === 'faculty') {
    const [subs, advised] = await Promise.all([
      supabase.from('faculty_subjects').select('*').eq('faculty_id', user.id).order('code'),
      supabase.from('students').select('id,initials,name,program,year_level,section').eq('adviser_id', user.id).order('name'),
    ])
    subjects.value        = subs.data || []
    advisedStudents.value = advised.data || []
  }

  loading.value = false
})

const personalFields = computed(() => [
  { label: 'Full Name',     value: auth.state.user?.name },
  { label: 'Date of Birth', value: auth.state.user?.date_of_birth },
  { label: 'Email',         value: auth.state.user?.email },
  { label: 'Phone',         value: auth.state.user?.phone },
  { label: 'Address',       value: auth.state.user?.address },
  { label: 'Gender',        value: auth.state.user?.gender },
])

const roleFields = computed(() => {
  if (auth.isStudent.value) return [
    { label: 'Student ID',  value: auth.state.user?.id },
    { label: 'Program',     value: auth.state.user?.program },
    { label: 'Year Level',  value: auth.state.user?.year_level },
    { label: 'Section',     value: auth.state.user?.section },
    { label: 'Semester',    value: auth.state.user?.semester },
    { label: 'Adviser',     value: adviser.value?.name || (auth.state.user?.adviser_id ? 'Loading…' : 'Not assigned') },
  ]
  return [
    { label: 'Employee ID',      value: auth.state.user?.id },
    { label: 'Department',       value: auth.state.user?.department },
    { label: 'Position',         value: auth.state.user?.position },
    { label: 'Specialization',   value: auth.state.user?.specialization },
    { label: 'Years of Service', value: auth.state.user?.years_of_service },
    { label: 'Education',        value: auth.state.user?.education },
  ]
})
</script>

<style scoped>
.loading-state{padding:60px;text-align:center;color:#6c757d;font-size:14px;}
@keyframes spin{to{transform:rotate(360deg);}}.spin{display:inline-block;animation:spin .7s linear infinite;}

/* Hero */
.profile-hero{background:#0d3b66;border-radius:12px;padding:24px;display:flex;align-items:center;gap:20px;position:relative;overflow:hidden;}
.profile-hero::after{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(233,168,37,0.15),transparent 70%);border-radius:50%;}
.hero-avatar{width:60px;height:60px;border-radius:14px;background:#e9a825;color:#0d3b66;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;flex-shrink:0;}
.hero-name{font-size:18px;font-weight:700;color:#fff;margin-bottom:3px;}
.hero-sub{font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:8px;}
.hero-id{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(233,168,37,0.2);border:1px solid rgba(233,168,37,0.35);border-radius:20px;font-size:10px;font-weight:700;color:#e9a825;}

/* Layout */
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.mt-panel{margin-bottom:14px;}

/* Panel */
.panel{background:#fff;border:1px solid #dee2e6;border-radius:10px;overflow:hidden;}
.panel-head{padding:12px 16px;border-bottom:1px solid #f2f2f2;display:flex;align-items:center;justify-content:space-between;}
.panel-title{font-size:13px;font-weight:700;color:#0d3b66;}
.panel-body{padding:14px 16px;}
.count-badge{display:inline-block;padding:2px 8px;border-radius:20px;background:#e8f4fd;color:#0d3b66;font-size:11px;font-weight:700;}

/* Info rows */
.info-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f8f9fa;}
.info-row:last-child{border-bottom:none;}
.info-lbl{font-size:11px;color:#6c757d;font-weight:600;}
.info-val{font-size:12px;color:#0d3b66;font-weight:600;text-align:right;max-width:60%;}

/* Adviser card */
.adviser-panel{}
.adviser-card{display:flex;align-items:flex-start;gap:14px;}
.adviser-avatar{width:48px;height:48px;border-radius:12px;background:#fff8e1;color:#b8890e;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;border:2px solid #e9a825;}
.adviser-name{font-size:14px;font-weight:700;color:#0d3b66;margin-bottom:3px;}
.adviser-pos{font-size:11px;color:#6c757d;margin-bottom:6px;}
.adviser-contact{font-size:11px;color:#495057;display:flex;align-items:center;gap:5px;margin-bottom:3px;}
.adviser-spec{font-size:11px;color:#6c757d;display:flex;align-items:center;gap:5px;margin-top:4px;font-style:italic;}
.no-adviser{display:flex;align-items:center;gap:10px;padding:16px 0;color:#6c757d;font-size:13px;}
.no-adviser i{font-size:24px;color:#dee2e6;}

/* Advised students list */
.advised-list{display:flex;flex-direction:column;gap:0;}
.advised-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #f8f9fa;}
.advised-row:last-child{border-bottom:none;}
.advised-avatar{width:32px;height:32px;border-radius:8px;background:#e8f4fd;color:#0d3b66;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.advised-name{font-size:12px;font-weight:600;color:#212529;}
.advised-sub{font-size:10px;color:#6c757d;}
.advised-info{flex:1;min-width:0;}
.section-chip{font-size:10px;font-weight:700;padding:2px 8px;background:#f0f4f8;border-radius:20px;color:#0d3b66;white-space:nowrap;}

/* Table */
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{padding:10px 14px;font-size:10px;text-transform:uppercase;letter-spacing:.5px;font-weight:700;color:#6c757d;border-bottom:2px solid #dee2e6;background:#f8f9fa;text-align:left;white-space:nowrap;}
th.ps{padding-left:18px;}
td{padding:10px 14px;font-size:12px;border-bottom:1px solid #f2f2f2;color:#495057;}
td.ps{padding-left:18px;}
td.center{text-align:center;}
tr:hover td{background:#f8f9fa;}
tr:last-child td{border-bottom:none;}
.grade-val{color:#0d3b66;}
.badge{display:inline-block;padding:2px 9px;border-radius:5px;font-size:10px;font-weight:700;}
.badge-pass{background:#f0fff4;color:#198754;}
.badge-fail{background:#fff0f0;color:#dc3545;}
.empty-msg{padding:24px;text-align:center;color:#6c757d;font-size:13px;}

@media(max-width:768px){.info-grid{grid-template-columns:1fr;}}
</style>
