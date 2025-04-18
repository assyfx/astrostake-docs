<template>
  <details class="vp-nav-bar-menu">
    <summary class="vp-nav-bar-link" aria-label="Ganti bahasa">
      {{ currentLocale === 'en' ? 'EN' : 'ID' }}
      <span class="vp-nav-bar-menu-icon"></span>
    </summary>
    <div class="menu">
      <a
        v-if="currentLocale !== 'en'"
        class="menu__link"
        @click.prevent="go('en')"
      >
        English
      </a>
      <a
        v-if="currentLocale !== 'id'"
        class="menu__link"
        @click.prevent="go('id')"
      >
        Bahasa Indonesia
      </a>
    </div>
  </details>
</template>

<script setup>
import { useData } from 'vitepress'
const { lang } = useData()
const currentLocale = lang.value

function go(target) {
  const path = window.location.pathname
  let newPath = ''

  if (target === 'id') {
    // Dari EN ke ID: tambahkan prefix /id
    newPath = path === '/' ? '/id/' : '/id' + path
  } else {
    // Dari ID ke EN: hilangkan prefix /id
    newPath = path === '/id/' ? '/' : path.replace(/^\/id/, '')
  }
  window.location.pathname = newPath
}
</script>

<style>
/* Gunakan gaya default VitePress */
.vp-nav-bar-menu {
  position: relative;
}
.vp-nav-bar-menu-icon {
  display: inline-block;
  margin-left: 0.25em;
  vertical-align: middle;
  border: solid currentColor;
  border-width: 0 1px 1px 0;
  padding: 2px;
  transform: rotate(45deg);
}
.vp-nav-bar-menu .menu {
  background: var(--vp-c-dropdown-bg);
  border: 1px solid var(--vp-c-border);
}
.vp-nav-bar-menu .menu__link {
  display: block;
  padding: 0.5em 1em;
  color: var(--vp-c-text);
  text-decoration: none;
}
.vp-nav-bar-menu .menu__link:hover {
  background: var(--vp-c-dropdown-hover-bg);
}
</style>
