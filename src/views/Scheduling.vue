<template>
  <div>

    <!-- Toolbar -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" style="font-size:12px">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="fw-bold" style="font-size:13px; color:var(--primary)">Week Range</span>
        <button class="btn btn-sm btn-outline-secondary" style="font-size:12px">
          <i class="bi bi-chevron-right"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" style="font-size:12px">Today</button>
      </div>

      <div class="d-flex align-items-center gap-2">
        <select class="form-select form-select-sm" style="max-width:130px; font-size:12px">
          <option>Weekly View</option>
          <option>Daily View</option>
          <option>Monthly View</option>
        </select>
        <button v-if="isFaculty"
          class="btn btn-sm text-white fw-semibold"
          style="background:var(--primary); border-color:var(--primary); font-size:12px; white-space:nowrap">
          <i class="bi bi-plus-lg me-1"></i>Add Schedule
        </button>
      </div>
    </div>

    <!-- Role note -->
    <div class="alert alert-light border mb-3 d-flex align-items-center gap-2" style="font-size:13px">
      <i class="bi bi-info-circle" style="color:var(--primary); font-size:16px; flex-shrink:0"></i>
      <span v-if="isStudent">Showing your enrolled class schedule for this semester.</span>
      <span v-if="isFaculty">Showing your teaching schedule. Students see their own enrolled class schedules.</span>
    </div>

    <!-- Weekly grid -->
    <div class="panel mb-3">
      <div class="panel-header">
        <span class="panel-title">{{ isStudent ? 'Class Schedule' : 'Teaching Schedule' }}</span>
      </div>
      <div class="panel-body">
        <div class="row g-2">
          <div v-for="day in weekDays" :key="day" class="col">
            <div class="sched-day-label">{{ day }}</div>
            <div class="text-center text-muted py-3" style="font-size:11px">
              <i class="bi bi-dash" style="font-size:18px; color:#dee2e6; display:block"></i>
              No class
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary table -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Schedule Summary</span>
      </div>
      <div class="panel-body p-0">
        <table class="table table-sm table-hover align-middle mb-0" style="font-size:13px">
          <thead style="background:#f8f9fa">
            <tr>
              <th class="ps-4 py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Subject</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Section</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Day</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Time</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Room</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">
                {{ isStudent ? 'Instructor' : 'Students Enrolled' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="bi bi-calendar-x d-block mb-2" style="font-size:2rem;color:#dee2e6"></i>
                No schedule available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js'
const { isStudent, isFaculty } = useAuthStore()
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
</script>
