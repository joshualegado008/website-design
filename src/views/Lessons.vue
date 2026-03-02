<template>
  <div>

    <div class="d-flex align-items-center gap-2 mb-3">
      <select class="form-select form-select-sm" style="max-width:180px">
        <option value="">All Subjects</option>
      </select>
      <select class="form-select form-select-sm" style="max-width:130px">
        <option value="">All Status</option>
        <option>Published</option>
        <option>Draft</option>
      </select>
      <div class="ms-auto input-group input-group-sm" style="max-width:220px">
        <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
        <input type="text" class="form-control" placeholder="Search lessons..." />
      </div>
      <button v-if="isFaculty"
        class="btn btn-sm text-white fw-semibold"
        style="background:var(--primary); border-color:var(--primary); font-size:12px; white-space:nowrap">
        <i class="bi bi-plus-lg me-1"></i>New Lesson
      </button>
    </div>

    <div v-if="isFaculty" class="alert alert-light border mb-3 d-flex align-items-center gap-2" style="font-size:13px">
      <i class="bi bi-info-circle" style="color:var(--primary); font-size:16px"></i>
      You are managing lessons you have created. Students can only view published lessons.
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="text-center py-5">
          <i class="bi bi-book-x d-block mb-2" style="font-size:2.5rem;color:#dee2e6"></i>
          <div style="font-size:14px; font-weight:600; color:#495057">No lessons found</div>
          <div style="font-size:12px" class="text-muted mt-1">
            {{ isFaculty ? 'Click "New Lesson" to create your first lesson.' : 'No lessons have been published yet.' }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js'
const { isFaculty } = useAuthStore()
</script>
