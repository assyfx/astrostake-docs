<template>
  <!-- wrap the default theme -->
  <DefaultTheme.Layout>
    <!-- inject our switcher into the navbar slot -->
    <template #navbar-after>
      <LanguageSwitcher />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

// register the component so <LanguageSwitcher/> works
</script>
