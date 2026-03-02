<template>
  <div>

    <!-- Page header row -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h6 class="fw-bold mb-0" style="color:var(--primary)">
          <i class="bi me-2" :class="isStudent ? 'bi-person-badge-fill' : 'bi-person-workspace'"></i>
          {{ isStudent ? 'Student Syllabus' : 'Faculty Syllabus — Handled Subjects' }}
        </h6>
        <p class="text-muted mb-0 mt-1" style="font-size:12px">
          {{ isStudent ? 'Your enrolled subjects and their syllabi for this semester.' : 'Subjects assigned to you this semester.' }}
        </p>
      </div>

      <!-- Faculty: add subject -->
      <button v-if="isFaculty"
        class="btn btn-sm text-white fw-semibold"
        style="background:var(--primary); border-color:var(--primary); font-size:12px">
        <i class="bi bi-plus-lg me-1"></i>Add Subject
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-2 mb-3">
      <select class="form-select form-select-sm" style="max-width:180px">
        <option value="">All Subjects</option>
      </select>
      <select class="form-select form-select-sm" style="max-width:150px">
        <option value="">All Semesters</option>
        <option>1st Semester</option>
        <option>2nd Semester</option>
        <option>Summer</option>
      </select>
      <div class="ms-auto input-group input-group-sm" style="max-width:220px">
        <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
        <input type="text" class="form-control" placeholder="Search subject..." />
      </div>
    </div>

    <!-- Table -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Subject List</span>
        <span class="badge bg-secondary rounded-pill" style="font-size:11px">0 subjects</span>
      </div>
      <div class="panel-body p-0">
        <table class="table table-sm table-hover align-middle mb-0" style="font-size:13px">
          <thead style="background:#f8f9fa;">
            <tr>
              <th class="ps-4 py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Code</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Description</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Units</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Schedule</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">
                {{ isStudent ? 'Instructor' : 'Section' }}
              </th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Room</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Status</th>
              <th v-if="isFaculty" class="py-3 fw-semibold text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #dee2e6">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :colspan="isFaculty ? 8 : 7" class="text-center py-5">
                <div class="text-muted">
                  <i class="bi bi-journal-x d-block mb-2" style="font-size:2rem; color:#dee2e6"></i>
                  <div style="font-size:14px; font-weight:600">No subjects found</div>
                  <div style="font-size:12px" class="mt-1">
                    {{ isFaculty ? 'No subjects have been assigned yet.' : 'You are not enrolled in any subjects yet.' }}
                  </div>
                </div>
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
</script>
