<template>
  <div class="tab-container">
    <div class="tab-header">
      <button
        :class="{ active: tab === 'standard' }"
        @click="tab = 'standard'"
      >Standard</button>
      <button
        :class="{ active: tab === 'turbo' }"
        @click="tab = 'turbo'"
      >Turbo</button>
    </div>
    <div class="tab-content">
      <div v-if="tab === 'standard'">
        <slot name="standard" />
      </div>
      <div v-else>
        <slot name="turbo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref('standard')
</script>

<style scoped>
.tab-container {
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  padding: 1rem;
  background-color: #1a1a1a;
}
.tab-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.tab-header button {
  background: none;
  border: none;
  color: #ccc;
  font-weight: bold;
  cursor: pointer;
}
.tab-header button.active {
  color: #fff;
  border-bottom: 2px solid #646cff;
}
.tab-content {
  color: #ddd;
}
</style>
