<template>
  <div class="row g-3">

    <div class="col-7">
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">{{ isStudent ? 'School Events' : 'Manage Events' }}</span>
          <button v-if="isFaculty"
            class="btn btn-sm text-white fw-semibold"
            style="background:var(--primary); border-color:var(--primary); font-size:12px">
            <i class="bi bi-plus-lg me-1"></i>Add Event
          </button>
        </div>
        <div class="panel-body p-0">
          <table class="table table-sm table-hover align-middle mb-0" style="font-size:13px">
            <thead style="background:#f8f9fa">
              <tr>
                <th class="ps-4 py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Date</th>
                <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Event Title</th>
                <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Location</th>
                <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Type</th>
                <th v-if="isFaculty" class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td :colspan="isFaculty ? 5 : 4" class="text-center py-5 text-muted">
                  <i class="bi bi-calendar-x d-block mb-2" style="font-size:2rem;color:#dee2e6"></i>
                  No events found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="col-5">
      <div class="panel mb-3">
        <div class="panel-header">
          <span class="panel-title">Calendar</span>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-outline-secondary" style="padding:2px 8px;font-size:12px">
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="fw-bold" style="font-size:12px; color:var(--primary); min-width:80px; text-align:center">
              Month Year
            </span>
            <button class="btn btn-sm btn-outline-secondary" style="padding:2px 8px;font-size:12px">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="panel-body">
          <div class="cal-grid">
            <div class="cal-dow" v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{ d }}</div>
            <div v-for="n in 35" :key="n" class="cal-cell" :class="{ today: n === 9 }">
              {{ n <= 30 ? n : '' }}
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header"><span class="panel-title">Legend</span></div>
        <div class="panel-body py-2">
          <div class="d-flex flex-column gap-2" style="font-size:12px">
            <div class="d-flex align-items-center gap-2">
              <div style="width:12px;height:12px;border-radius:3px;background:var(--primary)"></div>
              <span>Today</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <div style="width:12px;height:12px;border-radius:3px;background:#fff8e1;border:1px solid var(--accent)"></div>
              <span>Has Event</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js'
const { isStudent, isFaculty } = useAuthStore()
</script>
