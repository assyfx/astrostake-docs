<template>
  <button class="vp-nav-bar-link" @click="switchLocale">
    🌐 {{ oppositeLabel }}
  </button>
</template>

<script setup>
import { useData } from 'vitepress'

const { lang } = useData()

// Label untuk ditampilkan di tombol
const oppositeLabel = lang.value === 'en' ? 'ID' : 'EN'

function switchLocale() {
  const path = window.location.pathname
  if (lang.value === 'en') {
    // dari en ke id: prefix '/id'
    const newPath = path === '/' ? '/id/' : ('/id' + path)
    window.location.pathname = newPath
  } else {
    // dari id ke en: hilangkan '/id'
    const newPath = path === '/id/' ? '/' : path.replace(/^\/id/, '')
    window.location.pathname = newPath
  }
}
</script>

<style>
/* contoh styling agar mirip link nav lain */
.vp-nav-bar-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-link);
  padding: 0.25em 0.5em;
  font-size: 0.9rem;
}
.vp-nav-bar-link:hover {
  color: var(--vp-c-brand);
}
</style>
