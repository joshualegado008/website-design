<template>
  <div class="login-wrapper">

    <!-- Left decorative panel -->
    <div class="login-left">
      <div class="mb-4">
        <i class="bi bi-mortarboard-fill" style="font-size:2.2rem; color:var(--accent)"></i>
      </div>
      <h4 class="fw-bold">Academic Web Portal</h4>
      <p class="mt-2">
        Manage academic activities — lessons, schedules, curriculum, and more
        from one unified platform.
      </p>
    </div>

    <!-- Right: login form -->
    <div class="login-right">
      <div class="login-box">

        <h5 class="fw-bold mb-1" style="color:var(--primary)">Sign In</h5>
        <p class="text-muted mb-4" style="font-size:13px">
          Select your role and enter your credentials
        </p>

        <!-- Role switcher -->
        <div class="role-switcher mb-4">
          <button
            class="role-btn"
            :class="{ active: role === 'student' }"
            @click="role = 'student'"
          >
            <i class="bi bi-person-badge me-1"></i> Student
          </button>
          <button
            class="role-btn"
            :class="{ active: role === 'faculty' }"
            @click="role = 'faculty'"
          >
            <i class="bi bi-person-workspace me-1"></i> Faculty
          </button>
        </div>

        <!-- Error alert -->
        <div v-if="error" class="alert alert-danger py-2 px-3 mb-3" style="font-size:13px">
          <i class="bi bi-exclamation-circle me-1"></i> {{ error }}
        </div>

        <!-- ID -->
        <div class="mb-3">
          <label
            class="form-label fw-semibold"
            style="font-size:11px; color:var(--primary); text-transform:uppercase; letter-spacing:.5px"
          >
            {{ role === 'student' ? 'Student ID' : 'Employee ID' }}
          </label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            :placeholder="role === 'student' ? 'Enter your student ID' : 'Enter your employee ID'"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label
            class="form-label fw-semibold"
            style="font-size:11px; color:var(--primary); text-transform:uppercase; letter-spacing:.5px"
          >
            Password
          </label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            @keyup.enter="doLogin"
          />
        </div>

        <!-- Submit -->
        <button
          class="btn w-100 fw-bold text-white"
          style="background:var(--primary); border-color:var(--primary); padding:11px; font-size:14px"
          @click="doLogin"
        >
          <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
        </button>

        <p class="text-center text-muted mt-3" style="font-size:12px">
          Use your <strong>ID number</strong> and password <strong>1234</strong>
        </p>

        <!-- Demo credentials hint -->
        <div class="mt-3 p-3 rounded" style="background:#f8f9fa; font-size:11.5px; color:#6c757d;">
          <div class="fw-semibold mb-2" style="color:var(--primary); text-transform:uppercase; letter-spacing:.4px; font-size:10px;">Sample Accounts</div>
          <template v-if="role === 'student'">
            <div>📘 <strong>2021-00142</strong> — Maria Santos</div>
            <div>📘 <strong>2022-00315</strong> — Juan Cruz</div>
            <div>📘 <strong>2023-00478</strong> — Angela Dela Cruz</div>
          </template>
          <template v-else>
            <div>🎓 <strong>FAC-2015-004</strong> — Dr. Jose Reyes</div>
            <div>🎓 <strong>FAC-2018-011</strong> — Prof. Ana Lim</div>
            <div>🎓 <strong>FAC-2010-002</strong> — Engr. Marco Santos</div>
          </template>
          <div class="mt-1">Password for all: <strong>1234</strong></div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'
import { students, faculty } from '@/data/sampleData.js'

const role     = ref('student')
const username = ref('')
const password = ref('')
const error    = ref('')

const { login } = useAuthStore()
const router    = useRouter()

function doLogin() {
  error.value = ''
  if (password.value !== '1234') {
    error.value = 'Incorrect password. Please try again.'
    return
  }

  const pool = role.value === 'student' ? students : faculty
  const found = pool.find(u => u.id.toLowerCase() === username.value.trim().toLowerCase())

  if (found) {
    login(role.value, found)
    router.push('/dashboard')
  } else {
    error.value = 'ID not found. Please check your credentials.'
  }
}
</script>
