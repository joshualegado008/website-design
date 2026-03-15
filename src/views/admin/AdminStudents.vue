<template>
  <div>
    <div class="page-bar">
      <div class="search-wrap">
        <i class="bi bi-search"></i>
        <input v-model="search" type="text" placeholder="Search students…" />
      </div>
      <button class="btn-primary" @click="openModal()">
        <i class="bi bi-plus-lg"></i> Add Student
      </button>
    </div>

    <div class="panel">
      <div v-if="loading" class="empty-state"><i class="bi bi-arrow-repeat spin"></i> Loading…</div>
      <div v-else-if="filtered.length===0" class="empty-state">No students found.</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Program</th><th>Year / Section</th><th>Adviser</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in filtered" :key="s.id">
              <td><strong>{{ s.id }}</strong></td>
              <td>
                <div class="name-cell">
                  <div class="avatar">{{ s.initials }}</div>
                  <div>
                    <div class="name">{{ s.name }}</div>
                    <div class="email">{{ s.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ s.program }}</td>
              <td>{{ s.year_level }} · {{ s.section }}</td>
              <td>{{ s.faculty?.name || '—' }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" @click="openModal(s)"><i class="bi bi-pencil"></i></button>
                  <button class="btn-icon danger" @click="confirmDelete(s)"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal">
        <div class="modal-head">
          <span>{{ editing ? 'Edit Student' : 'Add Student' }}</span>
          <button @click="showModal=false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid">

            <div class="field">
              <label>Student ID *</label>
              <div class="input-with-btn">
                <input v-model="form.id" :disabled="!!editing" placeholder="Auto-generated" />
                <button v-if="!editing" class="gen-btn" @click="generateId" title="Generate ID">
                  <i class="bi bi-arrow-repeat"></i>
                </button>
              </div>
              <span class="field-hint">Format: YYYY-XXXXX · Click ↻ to regenerate</span>
            </div>

            <div class="field">
              <label>Full Name *</label>
              <input v-model="form.name" placeholder="Juan dela Cruz" />
            </div>

            <div class="field">
              <label>Initials</label>
              <input v-model="form.initials" placeholder="JD" maxlength="5" />
            </div>
            <div class="field">
              <label>Email *</label>
              <input v-model="form.email" type="email" placeholder="student@edu.ph" />
            </div>

            <div class="field">
              <label>Date of Birth</label>
              <input v-model="form.date_of_birth" type="date" />
            </div>
            <div class="field">
              <label>Phone</label>
              <input v-model="form.phone" placeholder="09XXXXXXXXX" />
            </div>

            <div class="field full">
              <label>Address</label>
              <input v-model="form.address" placeholder="Brgy., City, Province" />
            </div>

            <div class="field">
              <label>Gender</label>
              <select v-model="form.gender">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div class="field">
              <label>Program / Course *</label>
              <select v-model="form.program" @change="form.section=''">
                <option value="">— Select Course —</option>
                <optgroup v-for="col in courses" :key="col.label" :label="col.label">
                  <option v-for="c in col.programs" :key="c">{{ c }}</option>
                </optgroup>
              </select>
            </div>

            <div class="field">
              <label>Year Level *</label>
              <select v-model="form.year_level" @change="form.section=''">
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <div class="field">
              <label>Section *</label>
              <select v-model="form.section" :disabled="!form.program || !form.year_level">
                <option value="">— Select Section —</option>
                <option v-for="sec in sectionOptions" :key="sec" :value="sec">{{ sec }}</option>
              </select>
              <span class="field-hint" v-if="!form.program || !form.year_level">Select course and year level first</span>
            </div>

            <div class="field">
              <label>Semester</label>
              <select v-model="form.semester">
                <option>1st Semester, A.Y. 2024-2025</option>
                <option>2nd Semester, A.Y. 2024-2025</option>
                <option>Summer, A.Y. 2024-2025</option>
                <option>1st Semester, A.Y. 2025-2026</option>
                <option>2nd Semester, A.Y. 2025-2026</option>
                <option>Summer, A.Y. 2025-2026</option>
              </select>
            </div>

            <div class="field">
              <label>Adviser (Faculty)</label>
              <select v-model="form.adviser_id">
                <option value="">— None —</option>
                <option v-for="f in facultyList" :key="f.id" :value="f.id">{{ f.name }}</option>
              </select>
            </div>

          </div>

          <!-- Password preview -->
          <div class="pw-preview" v-if="passwordPreview">
            <i class="bi bi-key"></i>
            <span>Default password: <strong>{{ passwordPreview }}</strong></span>
          </div>

          <div v-if="formError" class="form-error">{{ formError }}</div>
        </div>
        <div class="modal-foot">
          <button class="btn-cancel" @click="showModal=false">Cancel</button>
          <button class="btn-primary" @click="saveStudent" :disabled="saving">
            <i v-if="saving" class="bi bi-arrow-repeat spin"></i>
            <span v-else>{{ editing ? 'Save Changes' : 'Add Student' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget=null">
      <div class="modal confirm-modal">
        <div class="modal-head">
          <span>Delete Student</span>
          <button @click="deleteTarget=null"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>? This will also remove all their grades, schedule, lessons, and events.</p>
        </div>
        <div class="modal-foot">
          <button class="btn-cancel" @click="deleteTarget=null">Cancel</button>
          <button class="btn-danger" @click="deleteStudent" :disabled="saving">
            {{ saving ? 'Deleting…' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { logActivity } from '@/lib/activityLog.js'
import { useAuthStore } from '@/store/auth.js'

const auth        = useAuthStore()
const students    = ref([])
const facultyList = ref([])
const loading     = ref(true)
const saving      = ref(false)
const search      = ref('')
const showModal   = ref(false)
const editing     = ref(null)
const deleteTarget = ref(null)
const formError   = ref('')

// ── Course list ──────────────────────────────────────────────
const courses = [
  {
    label: 'College of Computing',
    programs: ['BS Computer Science', 'BS Information Technology', 'BS Information Systems']
  },
  {
    label: 'College of Engineering',
    programs: ['BS Computer Engineering', 'BS Electronics Engineering', 'BS Civil Engineering', 'BS Mechanical Engineering', 'BS Electrical Engineering']
  },
  {
    label: 'College of Business',
    programs: ['BS Business Administration', 'BS Accountancy', 'BS Management Accounting']
  },
  {
    label: 'College of Education',
    programs: ['BS Education', 'BS Secondary Education', 'BS Elementary Education']
  },
  {
    label: 'College of Arts & Sciences',
    programs: ['BS Psychology', 'AB Communication', 'AB Political Science']
  }
]

// ── Course abbreviation map ──────────────────────────────────
const courseAbbrev = {
  'BS Computer Science':       'BSCS',
  'BS Information Technology': 'BSIT',
  'BS Information Systems':    'BSIS',
  'BS Computer Engineering':   'BSCpE',
  'BS Electronics Engineering':'BSEE',
  'BS Civil Engineering':      'BSCE',
  'BS Mechanical Engineering': 'BSME',
  'BS Electrical Engineering': 'BSElecE',
  'BS Business Administration':'BSBA',
  'BS Accountancy':            'BSA',
  'BS Management Accounting':  'BSMA',
  'BS Education':              'BSEd',
  'BS Secondary Education':    'BSSEd',
  'BS Elementary Education':   'BSEEd',
  'BS Psychology':             'BSPsych',
  'AB Communication':          'ABComm',
  'AB Political Science':      'ABPS',
}

// ── Year number map ──────────────────────────────────────────
const yearNum = {
  '1st Year': '1',
  '2nd Year': '2',
  '3rd Year': '3',
  '4th Year': '4',
}

// ── Generate section options based on program + year ─────────
// Max 50 students per section → sections A, B, C, D (4 sections × 50 = 200 max)
const sectionOptions = computed(() => {
  if (!form.value.program || !form.value.year_level) return []
  const abbrev = courseAbbrev[form.value.program]
  const yr     = yearNum[form.value.year_level]
  if (!abbrev || !yr) return []
  return ['A', 'B', 'C', 'D'].map(letter => `${abbrev} ${yr}-${letter}`)
})

// ── Blank form ───────────────────────────────────────────────
const blankForm = () => ({
  id: '', name: '', initials: '', email: '',
  date_of_birth: '', phone: '', address: '',
  gender: 'Male', program: '', year_level: '1st Year',
  section: '', semester: '1st Semester, A.Y. 2024-2025',
  adviser_id: ''
})
const form = ref(blankForm())

// ── Auto-generate student ID ─────────────────────────────────
async function generateId() {
  const year = new Date().getFullYear()
  const { data } = await supabase
    .from('students')
    .select('id')
    .like('id', `${year}-%`)
    .order('id', { ascending: false })
    .limit(1)

  let nextNum = 1
  if (data && data.length > 0) {
    const lastDigits = data[0].id.replace(/\D/g, '').slice(-5)
    nextNum = parseInt(lastDigits) + 1
  }
  form.value.id = `${year}-${String(nextNum).padStart(5, '0')}`
}

// ── Password preview ─────────────────────────────────────────
const passwordPreview = computed(() => {
  if (!form.value.id || !form.value.date_of_birth || editing.value) return ''
  const idDigits  = form.value.id.replace(/\D/g, '')
  const last5     = idDigits.slice(-5)
  const yearMatch = form.value.date_of_birth.match(/\b(19|20)\d{2}\b/)
  const birthYear = yearMatch ? yearMatch[0] : ''
  if (!last5 || !birthYear) return ''
  return last5 + birthYear
})

// ── Table filter ─────────────────────────────────────────────
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return students.value.filter(s =>
    !q ||
    s.name.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    (s.program || '').toLowerCase().includes(q)
  )
})

// ── Load ─────────────────────────────────────────────────────
async function load() {
  loading.value = true
  const { data } = await supabase
    .from('students')
    .select('*, faculty:adviser_id(name, department)')
    .order('name')
  students.value = data || []
  const { data: fac } = await supabase
    .from('faculty')
    .select('id, name, department')
    .order('name')
  facultyList.value = fac || []
  loading.value = false
}
onMounted(load)

// ── Open modal ───────────────────────────────────────────────
async function openModal(s = null) {
  editing.value   = s
  formError.value = ''
  form.value      = s ? { ...s, adviser_id: s.adviser_id || '' } : blankForm()
  showModal.value = true
  if (!s) await generateId()
}

// ── Save ─────────────────────────────────────────────────────
async function saveStudent() {
  if (!form.value.id || !form.value.name || !form.value.email) {
    formError.value = 'ID, Name and Email are required.'
    return
  }
  saving.value = true; formError.value = ''
  const payload = { ...form.value }
  if (!payload.adviser_id) payload.adviser_id = null
  delete payload.faculty

  let err
  if (editing.value) {
    const res = await supabase.from('students').update({ ...payload, updated_at: new Date() }).eq('id', editing.value.id)
    err = res.error
    if (!err) await logActivity({ actorType:'admin', actorId:auth.state.user?.id||'admin', actorName:auth.state.user?.name||'Admin', action:'Updated student', targetType:'student', targetId:form.value.id, targetName:form.value.name })
  } else {
    const res = await supabase.from('students').insert(payload)
    err = res.error
    if (!err) await logActivity({ actorType:'admin', actorId:auth.state.user?.id||'admin', actorName:auth.state.user?.name||'Admin', action:'Created student', targetType:'student', targetId:form.value.id, targetName:form.value.name })
  }
  saving.value = false
  if (err) { formError.value = err.message; return }
  showModal.value = false
  await load()
}

function confirmDelete(s) { deleteTarget.value = s }

async function deleteStudent() {
  saving.value = true
  await supabase.from('students').delete().eq('id', deleteTarget.value.id)
  await logActivity({ actorType:'admin', actorId:auth.state.user?.id||'admin', actorName:auth.state.user?.name||'Admin', action:'Deleted student', targetType:'student', targetId:deleteTarget.value.id, targetName:deleteTarget.value.name })
  deleteTarget.value = null; saving.value = false
  await load()
}
</script>

<style scoped>
.page-bar{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;}
.search-wrap{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #dee2e6;border-radius:8px;padding:8px 12px;flex:1;min-width:200px;}
.search-wrap i{color:#6c757d;}
.search-wrap input{border:none;outline:none;font-size:13px;font-family:inherit;width:100%;}
.btn-primary{padding:9px 16px;background:#0d3b66;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;font-family:inherit;}
.btn-primary:disabled{opacity:.6;cursor:not-allowed;}
.panel{background:#fff;border:1px solid #dee2e6;border-radius:10px;overflow:hidden;}
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{padding:10px 14px;font-size:10px;text-transform:uppercase;letter-spacing:.5px;font-weight:700;color:#6c757d;border-bottom:2px solid #dee2e6;background:#f8f9fa;text-align:left;white-space:nowrap;}
td{padding:11px 14px;font-size:12px;border-bottom:1px solid #f2f2f2;color:#495057;vertical-align:middle;}
tr:hover td{background:#f8f9fa;}
tr:last-child td{border-bottom:none;}
.name-cell{display:flex;align-items:center;gap:9px;}
.avatar{width:30px;height:30px;border-radius:8px;background:#e8f4fd;color:#0d3b66;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.name{font-weight:600;color:#212529;font-size:12px;}
.email{font-size:10px;color:#6c757d;}
.action-btns{display:flex;gap:6px;}
.btn-icon{width:30px;height:30px;border-radius:7px;border:1px solid #dee2e6;background:#fff;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;color:#6c757d;}
.btn-icon:hover{background:#e8f4fd;color:#0d3b66;border-color:#0d3b66;}
.btn-icon.danger:hover{background:#fff0f0;color:#dc3545;border-color:#dc3545;}
.empty-state{padding:32px;text-align:center;color:#6c757d;font-size:13px;}
/* Modal */
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;overflow-y:auto;}
.modal{background:#fff;border-radius:12px;width:100%;max-width:680px;display:flex;flex-direction:column;overflow:hidden;position:relative;margin:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.confirm-modal{max-width:420px;}
.modal-head{padding:14px 18px;border-bottom:1px solid #dee2e6;display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:#0d3b66;flex-shrink:0;}
.modal-head button{background:none;border:none;cursor:pointer;font-size:16px;color:#6c757d;}
.modal-body{padding:18px;overflow-y:auto;max-height:65vh;}
.modal-body p{font-size:13px;color:#495057;line-height:1.6;}
.modal-foot{padding:14px 18px;border-top:1px solid #dee2e6;display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;background:#fff;}
.btn-cancel{padding:8px 16px;background:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;}
.btn-danger{padding:8px 16px;background:#dc3545;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}
.btn-danger:disabled{opacity:.6;}
/* Form */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.full{grid-column:1/-1;}
.field{display:flex;flex-direction:column;gap:5px;}
.field label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:#6c757d;}
.field input,.field select{padding:9px 11px;border:1px solid #dee2e6;border-radius:7px;font-size:13px;font-family:inherit;outline:none;background:#fff;width:100%;box-sizing:border-box;}
.field input:focus,.field select:focus{border-color:#0d3b66;}
.field input:disabled,.field select:disabled{background:#f8f9fa;color:#adb5bd;}
.field-hint{font-size:10px;color:#adb5bd;margin-top:2px;}
.input-with-btn{display:flex;gap:6px;align-items:center;}
.input-with-btn input{flex:1;}
.gen-btn{width:34px;height:34px;border:1px solid #dee2e6;border-radius:7px;background:#f8f9fa;cursor:pointer;font-size:14px;color:#0d3b66;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.gen-btn:hover{background:#e8f4fd;border-color:#0d3b66;}
.pw-preview{margin-top:14px;padding:10px 14px;background:#f0fff4;border:1px solid #c3e6cb;border-radius:7px;font-size:12px;color:#155724;display:flex;align-items:center;gap:8px;}
.pw-preview strong{font-size:13px;letter-spacing:.5px;}
.form-error{margin-top:12px;padding:10px 12px;background:#fff0f0;border:1px solid #f5c6cb;border-radius:7px;font-size:12px;color:#c0392b;}
@keyframes spin{to{transform:rotate(360deg);}}.spin{display:inline-block;animation:spin .7s linear infinite;}
</style>