<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand">
        <div class="brand-icon"><i class="bi bi-mortarboard-fill"></i></div>
        <h1>AcademicWeb</h1>
      </div>
      <p class="tagline">Unified academic portal for students, faculty, and administrators.</p>
    </div>
    <div class="login-right">
      <div class="login-box">
        <h2>Sign In</h2>
        <p class="sub">Select your role and enter your credentials</p>
        <div class="role-tabs">
          <button :class="['role-tab', activeRole==='student'?'active':'']" @click="switchRole('student')"><i class="bi bi-person-badge"></i> Student</button>
          <button :class="['role-tab', activeRole==='faculty'?'active':'']" @click="switchRole('faculty')"><i class="bi bi-person-workspace"></i> Faculty</button>
          <button :class="['role-tab', activeRole==='admin'?'active':'']" @click="switchRole('admin')"><i class="bi bi-shield-lock"></i> Admin</button>
        </div>
        <div class="field">
          <label>{{ activeRole==='admin' ? 'Email Address' : activeRole==='student' ? 'Student ID' : 'Faculty ID' }}</label>
          <input v-model="form.id" type="text" :placeholder="idPlaceholder" @keyup.enter="handleLogin" />
        </div>
        <div class="field">
          <label>Password</label>
          <div class="pw-wrap">
            <input v-model="form.password" :type="showPw?'text':'password'" placeholder="Enter your password" @keyup.enter="handleLogin" />
            <button class="pw-eye" @click="showPw=!showPw" tabindex="-1">
              <i :class="showPw?'bi bi-eye-slash':'bi bi-eye'"></i>
            </button>
          </div>
        </div>
        <div v-if="error" class="error-msg"><i class="bi bi-exclamation-circle"></i> {{ error }}</div>
        <button class="btn-login" @click="handleLogin" :disabled="loading">
          <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> Signing in…</span>
          <span v-else><i class="bi bi-box-arrow-in-right"></i> Sign In</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const router     = useRouter()
const auth       = useAuthStore()
const activeRole = ref('student')
const showPw     = ref(false)
const loading    = ref(false)
const error      = ref('')
const form       = ref({ id: '', password: '' })

const idPlaceholder = computed(() => {
  if (activeRole.value === 'admin')   return 'admin@academicweb.edu.ph'
  if (activeRole.value === 'faculty') return 'e.g. FAC-2015-004'
  return 'e.g. 2021-00142'
})

function switchRole(role) {
  activeRole.value  = role
  error.value       = ''
  form.value.id     = ''
  form.value.password = ''
}

async function handleLogin() {
  if (!form.value.id || !form.value.password) {
    error.value = 'Please fill in all fields.'
    return
  }
  loading.value = true
  error.value   = ''
  const res = await auth.login(activeRole.value, form.value.id.trim(), form.value.password)
  loading.value = false
  if (res.ok) {
    router.push(activeRole.value === 'admin' ? '/admin' : '/dashboard')
  } else {
    error.value = res.error || 'Login failed. Check your credentials.'
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* ── Left panel ── */
.login-left {
  width: 340px;
  flex-shrink: 0;
  background: #0d3b66;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 36px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #e9a825;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d3b66;
  font-size: 20px;
}
.brand h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.tagline {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  line-height: 1.8;
}

/* ── Right panel ── */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
  padding: 36px;
}
.login-box {
  width: 100%;
  max-width: 380px;
}
.login-box h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0d3b66;
  margin-bottom: 4px;
}
.sub {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 22px;
}

/* ── Role tabs ── */
.role-tabs {
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 9px;
  overflow: hidden;
  margin-bottom: 22px;
}
.role-tab {
  flex: 1;
  padding: 9px 4px;
  border: none;
  background: #fff;
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all .15s;
  font-family: inherit;
}
.role-tab.active {
  background: #0d3b66;
  color: #fff;
}

/* ── Fields ── */
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: #0d3b66;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  background: #fff;
}
.field input:focus {
  border-color: #0d3b66;
}
.pw-wrap {
  position: relative;
}
.pw-wrap input {
  padding-right: 40px;
}
.pw-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  font-size: 15px;
}

/* ── Error ── */
.error-msg {
  background: #fff0f0;
  border: 1px solid #f5c6cb;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 12px;
  color: #c0392b;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Submit button ── */
.btn-login {
  width: 100%;
  padding: 12px;
  background: #0d3b66;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: inherit;
}
.btn-login:disabled {
  opacity: .6;
  cursor: not-allowed;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { display: inline-block; animation: spin .7s linear infinite; }

@media (max-width: 640px) {
  .login-left { display: none; }
  .login-right { padding: 24px 16px; }
}
</style>