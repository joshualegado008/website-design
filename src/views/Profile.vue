<template>
  <div>

    <!-- Hero -->
    <div class="profile-hero mb-4">
      <div class="profile-hero-avatar">{{ state.user?.initials }}</div>
      <div>
        <h5 class="fw-bold mb-1">{{ state.user?.name || '—' }}</h5>
        <p class="mb-1">
          {{ isStudent ? 'Student' : 'Faculty' }}
          &nbsp;·&nbsp;
          {{ isStudent ? (state.user?.program || 'Program not set') : (state.user?.department || 'Department not set') }}
        </p>
        <div class="profile-id-badge">
          <i class="bi bi-id-card me-1"></i>
          {{ state.user?.id || 'ID not set' }}
        </div>
      </div>
    </div>

    <!-- Info panels -->
    <div class="row g-3">

      <div class="col-6">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Personal Information</span>
            <button class="btn btn-sm btn-outline-secondary" style="font-size:11px; padding:3px 10px">
              <i class="bi bi-pencil me-1"></i>Edit
            </button>
          </div>
          <div class="panel-body">
            <div class="info-row" v-for="f in personalFields" :key="f.label">
              <span class="info-label">{{ f.label }}</span>
              <span class="info-value">{{ f.value || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">
              {{ isStudent ? 'Academic Information' : 'Professional Information' }}
            </span>
          </div>
          <div class="panel-body">
            <div class="info-row" v-for="f in roleFields" :key="f.label">
              <span class="info-label">{{ f.label }}</span>
              <span class="info-value">{{ f.value || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Student: grades -->
      <div v-if="isStudent" class="col-12">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Grades Summary</span>
          </div>
          <div class="panel-body p-0">
            <table class="table table-sm table-hover align-middle mb-0" style="font-size:13px">
              <thead style="background:#f8f9fa">
                <tr>
                  <th class="ps-4 py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Subject Code</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Description</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Units</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Midterm</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Finals</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Final Grade</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="state.user?.grades?.length">
                  <tr v-for="g in state.user.grades" :key="g.code">
                    <td class="ps-4">{{ g.code }}</td>
                    <td>{{ g.description }}</td>
                    <td>{{ g.units }}</td>
                    <td>{{ g.midterm }}</td>
                    <td>{{ g.finals }}</td>
                    <td><strong>{{ g.finalGrade }}</strong></td>
                    <td><span :class="g.remarks === 'Passed' ? 'badge bg-success' : 'badge bg-danger'">{{ g.remarks }}</span></td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-file-earmark-x d-block mb-2" style="font-size:2rem;color:#dee2e6"></i>
                    No grade records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Faculty: handled subjects -->
      <div v-if="isFaculty" class="col-12">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Handled Subjects</span>
          </div>
          <div class="panel-body p-0">
            <table class="table table-sm table-hover align-middle mb-0" style="font-size:13px">
              <thead style="background:#f8f9fa">
                <tr>
                  <th class="ps-4 py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Subject Code</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Description</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Section</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Units</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Schedule</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Room</th>
                  <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="state.user?.subjects?.length">
                  <tr v-for="s in state.user.subjects" :key="s.code">
                    <td class="ps-4">{{ s.code }}</td>
                    <td>{{ s.description }}</td>
                    <td>{{ s.section }}</td>
                    <td>{{ s.units }}</td>
                    <td>{{ s.schedule }}</td>
                    <td>{{ s.room }}</td>
                    <td>{{ s.enrolled }}</td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-journals d-block mb-2" style="font-size:2rem;color:#dee2e6"></i>
                    No subjects assigned
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.js'

const { state, isStudent, isFaculty } = useAuthStore()

const personalFields = computed(() => [
  { label: 'Full Name',     value: state.user?.name },
  { label: 'Date of Birth', value: state.user?.dateOfBirth },
  { label: 'Email Address', value: state.user?.email },
  { label: 'Phone Number',  value: state.user?.phone },
  { label: 'Address',       value: state.user?.address },
  { label: 'Gender',        value: state.user?.gender },
])

const studentFields = computed(() => [
  { label: 'Student ID',  value: state.user?.id },
  { label: 'Program',     value: state.user?.program },
  { label: 'Year Level',  value: state.user?.yearLevel },
  { label: 'Section',     value: state.user?.section },
  { label: 'Semester',    value: state.user?.semester },
  { label: 'Adviser',     value: state.user?.adviser },
])

const facultyFields = computed(() => [
  { label: 'Employee ID',      value: state.user?.id },
  { label: 'Department',       value: state.user?.department },
  { label: 'Position',         value: state.user?.position },
  { label: 'Specialization',   value: state.user?.specialization },
  { label: 'Years of Service', value: state.user?.yearsOfService },
  { label: 'Education',        value: state.user?.education },
])

const roleFields = computed(() => isStudent.value ? studentFields.value : facultyFields.value)
</script>
