<template>
  <div>

    <!-- Stat cards -->
    <div class="row g-3 mb-4">
      <div v-for="card in statCards" :key="card.label" class="col-3">
        <div class="stat-card d-flex align-items-start gap-3">
          <div class="stat-icon-box">
            <i :class="'bi ' + card.icon"></i>
          </div>
          <div>
            <div class="stat-label">{{ card.label }}</div>
            <div class="stat-value">—</div>
            <div class="stat-sub">No data yet</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule + Events -->
    <div class="row g-3 mb-4">
      <div class="col-7">
        <div class="panel h-100">
          <div class="panel-header">
            <span class="panel-title">Today's Schedule</span>
            <button class="btn btn-sm btn-link p-0 fw-bold text-decoration-none"
              style="font-size:12px; color:var(--primary)" @click="go('scheduling')">
              View All
            </button>
          </div>
          <div class="panel-body">
            <div class="text-center py-4">
              <i class="bi bi-calendar-x d-block mb-2" style="font-size:2rem; color:#dee2e6"></i>
              <span class="text-muted" style="font-size:13px">No classes scheduled today</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-5">
        <div class="panel h-100">
          <div class="panel-header">
            <span class="panel-title">Upcoming Events</span>
            <button class="btn btn-sm btn-link p-0 fw-bold text-decoration-none"
              style="font-size:12px; color:var(--primary)" @click="go('events')">
              See All
            </button>
          </div>
          <div class="panel-body">
            <div class="text-center py-4">
              <i class="bi bi-calendar-x d-block mb-2" style="font-size:2rem; color:#dee2e6"></i>
              <span class="text-muted" style="font-size:13px">No upcoming events</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Curriculum progress -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Curriculum Progress</span>
        <button class="btn btn-sm btn-link p-0 fw-bold text-decoration-none"
          style="font-size:12px; color:var(--primary)" @click="go('curriculum')">
          Details
        </button>
      </div>
      <div class="panel-body">
        <div class="text-center py-4">
          <i class="bi bi-bar-chart-line d-block mb-2" style="font-size:2rem; color:#dee2e6"></i>
          <span class="text-muted" style="font-size:13px">No curriculum data available</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const { isStudent } = useAuthStore()
const router = useRouter()

const statCards = computed(() =>
  isStudent.value
    ? [
        { icon: 'bi-journals',       label: 'Enrolled Subjects' },
        { icon: 'bi-check2-circle',  label: 'Completed Tasks'   },
        { icon: 'bi-award',          label: 'Current GPA'       },
        { icon: 'bi-person-check',   label: 'Attendance Rate'   }
      ]
    : [
        { icon: 'bi-people',         label: 'Total Students'    },
        { icon: 'bi-journals',       label: 'Subjects Handled'  },
        { icon: 'bi-pencil-square',  label: 'Pending Grades'    },
        { icon: 'bi-calendar-check', label: 'Classes Today'     }
      ]
)

function go(name) { router.push({ name }) }
</script>
