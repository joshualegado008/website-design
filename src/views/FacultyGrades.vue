<template>
  <div>

    <!-- ── Page: Student List ── -->
    <div v-if="!selectedStudent">
      <div class="page-bar">
        <div class="search-wrap">
          <i class="bi bi-search"></i>
          <input v-model="search" placeholder="Search students by name, ID, or program…" />
          <button v-if="search" class="clear-x" @click="search = ''">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="panel-title"><i class="bi bi-award" style="margin-right:6px;color:#d4a017"></i>Grade Management</span>
          <span class="count-badge">{{ displayed.length }} students</span>
        </div>

        <div v-if="loading" class="empty-state">
          <i class="bi bi-arrow-repeat spin"></i> Loading students…
        </div>
        <div v-else-if="displayed.length === 0" class="empty-state">
          No students found.
        </div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Program</th>
                <th>Year / Section</th>
                <th class="ctr">Grades</th>
                <th class="ctr">GWA</th>
                <th class="ctr">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in displayed" :key="s.id">
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ initials(s.name) }}</div>
                    <div>
                      <div class="sname">{{ s.name }}</div>
                      <div class="semail">{{ s.id }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ s.program || '—' }}</td>
                <td>{{ s.year_level }} · {{ s.section }}</td>
                <td class="ctr">
                  <span class="count-badge">{{ gradeCount(s.id) }}</span>
                </td>
                <td class="ctr">
                  <strong :class="gwaClass(gwa(s.id))">{{ gwa(s.id) || '—' }}</strong>
                </td>
                <td class="ctr">
                  <button class="btn-manage" @click="openStudent(s)">
                    <i class="bi bi-pencil-square"></i> Manage Grades
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Page: Student Grade Detail ── -->
    <div v-else>
      <!-- Back + Hero -->
      <div class="page-bar">
        <button class="back-btn" @click="selectedStudent = null; gradeSearch = ''">
          <i class="bi bi-arrow-left"></i> Back to Students
        </button>
      </div>

      <div class="profile-hero">
        <div class="hero-avatar">{{ initials(selectedStudent.name) }}</div>
        <div>
          <div class="hero-name">{{ selectedStudent.name }}</div>
          <div class="hero-sub">{{ selectedStudent.program }} · {{ selectedStudent.year_level }} · Section {{ selectedStudent.section }}</div>
          <div class="hero-id"><i class="bi bi-person-badge"></i> {{ selectedStudent.id }}</div>
        </div>
        <div class="hero-stats" v-if="studentGrades.length">
          <div class="hero-stat">
            <div class="hero-stat-val">{{ studentGrades.length }}</div>
            <div class="hero-stat-lbl">Subjects</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val" :class="gwaClass(studentGwa)">{{ studentGwa || '—' }}</div>
            <div class="hero-stat-lbl">GWA</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val" style="color:#198754">{{ studentGrades.filter(g=>g.remarks==='Passed').length }}</div>
            <div class="hero-stat-lbl">Passed</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val" style="color:#dc3545">{{ studentGrades.filter(g=>g.remarks==='Failed').length }}</div>
            <div class="hero-stat-lbl">Failed</div>
          </div>
        </div>
      </div>

      <!-- Grade Panel -->
      <div class="panel">
        <div class="panel-head">
          <div style="display:flex;align-items:center;gap:10px;flex:1">
            <span class="panel-title">Grades</span>
            <span class="count-badge">{{ filteredGrades.length }}</span>
            <input v-model="gradeSearch" class="inline-search" placeholder="Search subject…" />
          </div>
          <button class="btn-primary sm" @click="openModal()">
            <i class="bi bi-plus-lg"></i> Add Grade
          </button>
        </div>

        <div v-if="gradeLoading" class="empty-state"><i class="bi bi-arrow-repeat spin"></i> Loading grades…</div>
        <div v-else-if="filteredGrades.length === 0" class="empty-state">
          <i class="bi bi-award" style="font-size:28px;color:#d4a017;margin-bottom:8px;display:block"></i>
          No grades recorded yet. Click <strong>Add Grade</strong> to get started.
        </div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th class="ctr">Units</th>
                <th class="ctr">Midterm</th>
                <th class="ctr">Finals</th>
                <th class="ctr">Grade</th>
                <th class="ctr">Remarks</th>
                <th class="ctr">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in filteredGrades" :key="g.id">
                <td><strong style="color:#0d3b66">{{ g.code }}</strong></td>
                <td>{{ g.description }}</td>
                <td class="ctr">{{ g.units }}</td>
                <td class="ctr">
                  <span v-if="g.midterm !== null" class="score-chip" :style="{background: scoreColorBg(g.midterm), color: scoreColor(g.midterm)}">{{ g.midterm }}%</span>
                  <span v-else class="dimmed">—</span>
                </td>
                <td class="ctr">
                  <span v-if="g.finals !== null" class="score-chip" :style="{background: scoreColorBg(g.finals), color: scoreColor(g.finals)}">{{ g.finals }}%</span>
                  <span v-else class="dimmed">—</span>
                </td>
                <td class="ctr"><strong :class="gradeValClass(g.final_grade)">{{ g.final_grade ?? '—' }}</strong></td>
                <td class="ctr">
                  <span class="rem-badge" :class="remClass(g.remarks)">{{ g.remarks }}</span>
                </td>
                <td class="ctr">
                  <div class="action-btns">
                    <button class="btn-icon" title="Edit" @click="openModal(g)"><i class="bi bi-pencil"></i></button>
                    <button class="btn-icon danger" title="Delete" @click="deleteGrade(g)"><i class="bi bi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Grade Modal ── -->
    <Teleport to="body">
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal">
        <div class="modal-head">
          <span>{{ editTarget ? 'Edit Grade' : 'Add Grade' }}</span>
          <button @click="modalOpen = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div style="font-size:12px;color:#6c757d;margin-bottom:14px">
            Student: <strong style="color:#1a6b2e">{{ selectedStudent?.name }}</strong>
          </div>

          <div class="form-grid">
            <div class="field">
              <label>Subject Code *</label>
              <input v-model="mf.code" placeholder="e.g. CS301" />
            </div>
            <div class="field">
              <label>Description *</label>
              <input v-model="mf.description" placeholder="e.g. Data Structures" />
            </div>
            <div class="field">
              <label>Units</label>
              <input v-model.number="mf.units" type="number" min="1" max="6" />
            </div>
            <div class="field">
              <label>Midterm <span class="lbl-hint">(0–100)</span></label>
              <input v-model.number="mf.midterm" type="number" min="0" max="100"
                @input="mf.midterm = clampGrade(mf.midterm)"
                @blur="mf.midterm = clampGrade(mf.midterm); autoComputeGrade()"
                placeholder="Enter midterm score" />
              <div class="score-bar-wrap" v-if="mf.midterm !== null && mf.midterm !== ''">
                <div class="score-bar-track">
                  <div class="score-bar-fill" :style="{width: mf.midterm + '%', background: scoreColor(mf.midterm)}"></div>
                </div>
                <span class="score-pct" :style="{color: scoreColor(mf.midterm)}">{{ mf.midterm }}%</span>
              </div>
            </div>
            <div class="field">
              <label>Finals <span class="lbl-hint">(0–100)</span></label>
              <input v-model.number="mf.finals" type="number" min="0" max="100"
                @input="mf.finals = clampGrade(mf.finals)"
                @blur="mf.finals = clampGrade(mf.finals); autoComputeGrade()"
                placeholder="Enter finals score" />
              <div class="score-bar-wrap" v-if="mf.finals !== null && mf.finals !== ''">
                <div class="score-bar-track">
                  <div class="score-bar-fill" :style="{width: mf.finals + '%', background: scoreColor(mf.finals)}"></div>
                </div>
                <span class="score-pct" :style="{color: scoreColor(mf.finals)}">{{ mf.finals }}%</span>
              </div>
            </div>
            <div class="field">
              <label>Final Grade <span class="lbl-hint">(auto-computed)</span></label>
              <input v-model="mf.final_grade" readonly placeholder="e.g. 1.5"
                style="background:#f8f9fa;color:#1a6b2e;font-weight:700;cursor:default;" />
            </div>
            <div class="field">
              <label>Remarks</label>
              <select v-model="mf.remarks">
                <option>Passed</option>
                <option>Failed</option>
                <option>Incomplete</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div class="grade-summary" v-if="mf.midterm !== null && mf.finals !== null && mf.midterm !== '' && mf.finals !== ''">
            <div class="grade-summary-row">
              <span>Average Score</span>
              <strong>{{ ((Number(mf.midterm) + Number(mf.finals)) / 2).toFixed(1) }}%</strong>
            </div>
            <div class="grade-summary-row">
              <span>Grade Equivalent</span>
              <strong style="color:#1a6b2e;font-size:15px">{{ mf.final_grade || '—' }}</strong>
            </div>
          </div>

          <div v-if="saveErr" class="form-error">{{ saveErr }}</div>
        </div>
        <div class="modal-foot">
          <button class="btn-cancel" @click="modalOpen = false">Cancel</button>
          <button class="btn-primary" @click="saveGrade" :disabled="saving || !mf.code || !mf.description">
            <i v-if="saving" class="bi bi-arrow-repeat spin"></i>
            <span v-else><i class="bi bi-check-lg"></i> {{ editTarget ? 'Save Changes' : 'Add Grade' }}</span>
          </button>
        </div>
      </div>
    </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.js'

// ── State ────────────────────────────────────────────────────────
const students      = ref([])
const allGrades     = ref([])   // grades for ALL students (for list view stats)
const studentGrades = ref([])   // grades for selected student
const loading       = ref(true)
const gradeLoading  = ref(false)
const search        = ref('')
const gradeSearch   = ref('')
const selectedStudent = ref(null)

const modalOpen   = ref(false)
const editTarget  = ref(null)
const saving      = ref(false)
const saveErr     = ref('')
const mf          = ref(blankForm())

// ── Computed ─────────────────────────────────────────────────────
const displayed = computed(() => {
  const q = search.value.toLowerCase().trim()
  return students.value.filter(s =>
    !q ||
    s.name.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    (s.program || '').toLowerCase().includes(q)
  )
})

const filteredGrades = computed(() => {
  const q = gradeSearch.value.toLowerCase()
  return studentGrades.value.filter(g =>
    !q ||
    g.code.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q)
  )
})

const studentGwa = computed(() => gwa(selectedStudent.value?.id))

// ── Lifecycle ────────────────────────────────────────────────────
onMounted(async () => {
  const [{ data: studs }, { data: grds }] = await Promise.all([
    supabase.from('students').select('*').order('name'),
    supabase.from('grades').select('*'),
  ])
  students.value  = studs || []
  allGrades.value = grds  || []
  loading.value   = false
})

// ── Helpers ──────────────────────────────────────────────────────
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function gradeCount(sid) {
  return allGrades.value.filter(g => g.student_id === sid).length
}

function gwa(sid) {
  const gs = allGrades.value.filter(g => g.student_id === sid && g.final_grade && !isNaN(parseFloat(g.final_grade)))
  if (!gs.length) return null
  return (gs.reduce((a, b) => a + parseFloat(b.final_grade), 0) / gs.length).toFixed(2)
}

function gwaClass(val) {
  if (!val) return ''
  const n = parseFloat(val)
  if (n <= 1.75) return 'gwa-excellent'
  if (n <= 2.5)  return 'gwa-good'
  if (n <= 3.0)  return 'gwa-pass'
  return 'gwa-fail'
}

function scoreColor(val) {
  const n = Number(val)
  if (n >= 90) return '#198754'
  if (n >= 80) return '#1a6b2e'
  if (n >= 75) return '#d4a017'
  return '#dc3545'
}

function scoreColorBg(val) {
  const n = Number(val)
  if (n >= 90) return '#d1fae5'
  if (n >= 80) return '#eaf4ec'
  if (n >= 75) return '#fef9c3'
  return '#fee2e2'
}

function gradeValClass(val) {
  if (!val || val === '5.00') return 'grade-fail'
  if (val === 'INC')          return 'grade-inc'
  return 'grade-pass'
}

function remClass(r) {
  if (r === 'Passed')     return 'rem-pass'
  if (r === 'Failed')     return 'rem-fail'
  if (r === 'Incomplete') return 'rem-inc'
  return 'rem-pending'
}

function clampGrade(val) {
  if (val === null || val === '' || val === undefined) return val
  const n = Number(val)
  if (isNaN(n)) return 0
  return Math.min(100, Math.max(0, Math.round(n)))
}

function autoComputeGrade() {
  const mid = Number(mf.value.midterm)
  const fin = Number(mf.value.finals)
  if (isNaN(mid) || isNaN(fin) || mf.value.midterm === '' || mf.value.finals === '') return
  const avg = (mid + fin) / 2

  let equiv, remarks
  if      (avg >= 97) { equiv = '1.00'; remarks = 'Passed' }
  else if (avg >= 94) { equiv = '1.25'; remarks = 'Passed' }
  else if (avg >= 91) { equiv = '1.50'; remarks = 'Passed' }
  else if (avg >= 88) { equiv = '1.75'; remarks = 'Passed' }
  else if (avg >= 85) { equiv = '2.00'; remarks = 'Passed' }
  else if (avg >= 82) { equiv = '2.25'; remarks = 'Passed' }
  else if (avg >= 79) { equiv = '2.50'; remarks = 'Passed' }
  else if (avg >= 76) { equiv = '2.75'; remarks = 'Passed' }
  else if (avg >= 75) { equiv = '3.00'; remarks = 'Passed' }
  else                { equiv = '5.00'; remarks = 'Failed' }

  mf.value.final_grade = equiv
  mf.value.remarks     = remarks
}

function blankForm() {
  return { code: '', description: '', units: 3, midterm: null, finals: null, final_grade: '', remarks: 'Pending' }
}

// ── Actions ──────────────────────────────────────────────────────
async function openStudent(s) {
  selectedStudent.value = s
  gradeLoading.value    = true
  studentGrades.value   = []
  const { data } = await supabase.from('grades').select('*').eq('student_id', s.id).order('code')
  studentGrades.value = data || []
  // sync into allGrades
  allGrades.value = allGrades.value.filter(g => g.student_id !== s.id).concat(studentGrades.value)
  gradeLoading.value = false
}

function openModal(grade = null) {
  editTarget.value = grade
  saveErr.value    = ''
  mf.value = grade
    ? { ...grade }
    : blankForm()
  modalOpen.value  = true
}

async function saveGrade() {
  if (!mf.value.code || !mf.value.description) {
    saveErr.value = 'Subject Code and Description are required.'
    return
  }
  saving.value  = true
  saveErr.value = ''

  const payload = {
    student_id:  selectedStudent.value.id,
    code:        mf.value.code,
    description: mf.value.description,
    units:       mf.value.units,
    midterm:     mf.value.midterm,
    finals:      mf.value.finals,
    final_grade: mf.value.final_grade || null,
    remarks:     mf.value.remarks,
  }

  let err, data
  if (editTarget.value) {
    ;({ error: err, data } = await supabase.from('grades').update(payload).eq('id', editTarget.value.id).select().single())
  } else {
    ;({ error: err, data } = await supabase.from('grades').insert(payload).select().single())
  }

  if (err) {
    saveErr.value = err.message
    saving.value  = false
    return
  }

  // Update local lists
  if (editTarget.value) {
    const idx = studentGrades.value.findIndex(g => g.id === editTarget.value.id)
    if (idx !== -1) studentGrades.value[idx] = data
  } else {
    studentGrades.value.push(data)
  }
  allGrades.value = allGrades.value.filter(g => g.student_id !== selectedStudent.value.id).concat(studentGrades.value)

  saving.value    = false
  modalOpen.value = false
}

async function deleteGrade(grade) {
  if (!confirm(`Delete grade for ${grade.code}?`)) return
  const { error } = await supabase.from('grades').delete().eq('id', grade.id)
  if (error) { alert(error.message); return }
  studentGrades.value = studentGrades.value.filter(g => g.id !== grade.id)
  allGrades.value     = allGrades.value.filter(g => g.id !== grade.id)
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────── */
.page-bar { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.back-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; background:#fff; border:1px solid #d6e4d8; border-radius:8px; font-size:12px; font-weight:600; color:#1a6b2e; cursor:pointer; font-family:inherit; }
.back-btn:hover { background:#eaf4ec; }

/* ── Search ──────────────────────────────────────────────────── */
.search-wrap { display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #dee2e6; border-radius:8px; padding:7px 12px; flex:1; }
.search-wrap i { color:#6c757d; font-size:13px; }
.search-wrap input { border:none; outline:none; font-size:13px; font-family:inherit; width:100%; }
.clear-x { background:none; border:none; cursor:pointer; color:#6c757d; font-size:13px; padding:0; }
.inline-search { border:1px solid #dee2e6; border-radius:6px; padding:4px 10px; font-size:12px; font-family:inherit; outline:none; width:180px; }
.inline-search:focus { border-color:#1a6b2e; }

/* ── Panel ───────────────────────────────────────────────────── */
.panel { background:#fff; border:1px solid #d6e4d8; border-radius:10px; overflow:hidden; margin-bottom:14px; }
.panel-head { padding:11px 16px; border-bottom:1px solid #f2f2f2; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.panel-title { font-size:13px; font-weight:700; color:#1a6b2e; }
.count-badge { font-size:10px; font-weight:700; padding:2px 9px; border-radius:20px; background:#eaf4ec; color:#1a6b2e; white-space:nowrap; }
.empty-state { padding:40px 16px; text-align:center; font-size:13px; color:#6c757d; }

/* ── Table ───────────────────────────────────────────────────── */
.table-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; }
th { padding:9px 13px; font-size:10px; text-transform:uppercase; letter-spacing:.5px; font-weight:700; color:#6c757d; border-bottom:2px solid #dee2e6; background:#f8f9fa; text-align:left; }
th.ctr, td.ctr { text-align:center; }
td { padding:9px 13px; font-size:12px; border-bottom:1px solid #f2f2f2; color:#495057; vertical-align:middle; }
tr:hover td { background:#f8fff9; }
tr:last-child td { border-bottom:none; }

.name-cell { display:flex; align-items:center; gap:9px; }
.avatar { width:32px; height:32px; border-radius:8px; background:#d4a017; color:#0d3b66; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; }
.sname { font-size:12px; font-weight:600; color:#0d3b66; }
.semail { font-size:11px; color:#6c757d; }
.dimmed { color:#adb5bd; }

/* ── Badges & chips ──────────────────────────────────────────── */
.score-chip { display:inline-block; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:700; }
.rem-badge { display:inline-block; padding:2px 9px; border-radius:20px; font-size:10px; font-weight:700; }
.rem-pass    { background:#d1fae5; color:#065f46; }
.rem-fail    { background:#fee2e2; color:#991b1b; }
.rem-inc     { background:#fef9c3; color:#92400e; }
.rem-pending { background:#f1f5f9; color:#64748b; }

.grade-pass { color:#1a6b2e; }
.grade-fail { color:#dc3545; }
.grade-inc  { color:#d4a017; }

.gwa-excellent { color:#198754; }
.gwa-good      { color:#1a6b2e; }
.gwa-pass      { color:#d4a017; }
.gwa-fail      { color:#dc3545; }

/* ── Action buttons ──────────────────────────────────────────── */
.action-btns { display:flex; align-items:center; gap:5px; justify-content:center; }
.btn-icon { width:28px; height:28px; border-radius:6px; border:1px solid #dee2e6; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px; color:#495057; }
.btn-icon:hover { background:#eaf4ec; border-color:#1a6b2e; color:#1a6b2e; }
.btn-icon.danger:hover { background:#fee2e2; border-color:#dc3545; color:#dc3545; }
.btn-manage { display:flex; align-items:center; gap:5px; padding:5px 12px; background:#1a6b2e; color:#fff; border:none; border-radius:7px; font-size:11px; font-weight:600; cursor:pointer; font-family:inherit; }
.btn-manage:hover { background:#155923; }
.btn-primary { display:flex; align-items:center; gap:5px; padding:7px 14px; background:#1a6b2e; color:#fff; border:none; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
.btn-primary:disabled { opacity:.6; cursor:not-allowed; }
.btn-primary.sm { padding:5px 12px; font-size:11px; }
.btn-primary:hover:not(:disabled) { background:#155923; }
.btn-cancel { padding:7px 14px; background:#fff; border:1px solid #dee2e6; border-radius:7px; font-size:12px; font-weight:600; color:#495057; cursor:pointer; font-family:inherit; }
.btn-cancel:hover { background:#f8f9fa; }

/* ── Hero ────────────────────────────────────────────────────── */
.profile-hero { background:#1a6b2e; border-radius:12px; padding:20px 24px; display:flex; align-items:center; gap:18px; margin-bottom:16px; flex-wrap:wrap; }
.hero-avatar { width:54px; height:54px; border-radius:13px; background:#d4a017; color:#1a6b2e; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; flex-shrink:0; }
.hero-name { font-size:16px; font-weight:700; color:#fff; margin-bottom:3px; }
.hero-sub { font-size:12px; color:rgba(255,255,255,.6); margin-bottom:6px; }
.hero-id { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; background:rgba(212,160,23,.2); border:1px solid rgba(212,160,23,.35); border-radius:20px; font-size:10px; font-weight:700; color:#d4a017; }
.hero-stats { display:flex; gap:20px; margin-left:auto; }
.hero-stat { text-align:center; }
.hero-stat-val { font-size:22px; font-weight:700; color:#fff; }
.hero-stat-lbl { font-size:10px; color:rgba(255,255,255,.55); font-weight:600; text-transform:uppercase; letter-spacing:.5px; }

/* ── Modal ───────────────────────────────────────────────────── */
.modal-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,.45); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px; }
.modal { background:#fff; border-radius:14px; width:100%; max-width:540px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.25); }
.modal-head { padding:16px 20px; border-bottom:1px solid #f2f2f2; display:flex; align-items:center; justify-content:space-between; font-size:14px; font-weight:700; color:#1a6b2e; position:sticky; top:0; background:#fff; z-index:1; }
.modal-head button { background:none; border:none; cursor:pointer; color:#6c757d; font-size:16px; }
.modal-body { padding:20px; }
.modal-foot { padding:14px 20px; border-top:1px solid #f2f2f2; display:flex; align-items:center; justify-content:flex-end; gap:10px; }

/* ── Form ────────────────────────────────────────────────────── */
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.field { display:flex; flex-direction:column; gap:5px; }
label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#6c757d; }
.lbl-hint { font-weight:400; text-transform:none; letter-spacing:0; }
input, select, textarea { padding:8px 11px; border:1px solid #dee2e6; border-radius:7px; font-size:13px; font-family:inherit; outline:none; color:#212529; }
input:focus, select:focus { border-color:#1a6b2e; box-shadow:0 0 0 2px rgba(26,107,46,.08); }

.score-bar-wrap { display:flex; align-items:center; gap:8px; margin-top:6px; }
.score-bar-track { flex:1; height:5px; background:#e9ecef; border-radius:10px; overflow:hidden; }
.score-bar-fill { height:100%; border-radius:10px; transition:width .3s; }
.score-pct { font-size:11px; font-weight:700; min-width:32px; }

.grade-summary { margin-top:14px; padding:12px 16px; background:#f0fff4; border:1px solid #c3e6cb; border-radius:9px; display:flex; gap:20px; }
.grade-summary-row { display:flex; flex-direction:column; gap:3px; }
.grade-summary-row span { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; color:#6c757d; }
.grade-summary-row strong { font-size:14px; color:#212529; }
.form-error { margin-top:10px; padding:8px 12px; background:#fee2e2; color:#991b1b; border-radius:7px; font-size:12px; }

@keyframes spin { to { transform:rotate(360deg); } }
.spin { display:inline-block; animation:spin .7s linear infinite; }
</style>