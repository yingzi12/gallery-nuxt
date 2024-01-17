<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <h2>{{ error.code }}</h2>
    <h2>{{ error.message }}</h2>
    <button @click="handleError">Clear errors</button>
  </div>
</template>
