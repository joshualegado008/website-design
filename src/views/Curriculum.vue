<template>
  <div>

    <div class="row g-3 mb-4">
      <div v-for="card in summaryCards" :key="card.label" class="col-3">
        <div class="stat-card d-flex align-items-start gap-3">
          <div class="stat-icon-box"><i :class="'bi ' + card.icon"></i></div>
          <div>
            <div class="stat-label">{{ card.label }}</div>
            <div class="stat-value">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-2 mb-3">
      <select class="form-select form-select-sm" style="max-width:120px">
        <option>Year 1</option><option>Year 2</option>
        <option>Year 3</option><option>Year 4</option>
      </select>
      <select class="form-select form-select-sm" style="max-width:150px">
        <option>1st Semester</option>
        <option>2nd Semester</option>
        <option>Summer</option>
      </select>
    </div>

    <div class="panel mb-3">
      <div class="panel-header">
        <span class="panel-title">
          {{ isStudent ? 'Curriculum Plan' : 'Curriculum Overview' }}
        </span>
      </div>
      <div class="panel-body p-0">
        <table class="table table-sm table-hover align-middle mb-0" style="font-size:13px">
          <thead style="background:#f8f9fa">
            <tr>
              <th class="ps-4 py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Subject Code</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Description</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Lec</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Lab</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Units</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">Pre-Requisite</th>
              <th class="py-3 fw-semibold text-muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #dee2e6">
                {{ isStudent ? 'Status' : 'Assigned To' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="bi bi-clipboard-x d-block mb-2" style="font-size:2rem;color:#dee2e6"></i>
                No curriculum data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Progress by Area</span>
      </div>
      <div class="panel-body">
        <div class="text-center py-4">
          <i class="bi bi-bar-chart-line d-block mb-2" style="font-size:2rem;color:#dee2e6"></i>
          <span class="text-muted" style="font-size:13px">No progress data available</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.js'
const { isStudent } = useAuthStore()

const summaryCards = computed(() =>
  isStudent.value
    ? [
        { icon: 'bi-journals',        label: 'Total Subjects'  },
        { icon: 'bi-check2-circle',   label: 'Completed'       },
        { icon: 'bi-hourglass-split', label: 'In Progress'     },
        { icon: 'bi-graph-up',        label: 'Completion Rate' }
      ]
    : [
        { icon: 'bi-journals',        label: 'Total Subjects'  },
        { icon: 'bi-people',          label: 'Total Sections'  },
        { icon: 'bi-person-check',    label: 'Active Classes'  },
        { icon: 'bi-graph-up',        label: 'Pass Rate'       }
      ]
)
</script>
