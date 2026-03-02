import { reactive, computed } from 'vue'
import { defaultStudent, defaultFaculty } from '@/data/sampleData.js'

// Singleton — shared across all useAuthStore() calls
const state = reactive({ user: null })

export function useAuthStore() {
  function login(role, userData) {
    state.user = { ...userData, role }
  }

  function logout() {
    state.user = null
  }

  const isLoggedIn = computed(() => state.user !== null)
  const isStudent  = computed(() => state.user?.role === 'student')
  const isFaculty  = computed(() => state.user?.role === 'faculty')

  // Expose `state` directly so templates can do state.user.name etc.
  return { state, isLoggedIn, isStudent, isFaculty, login, logout }
}
