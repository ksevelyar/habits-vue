<template lang="pug">
td.reports-list__item(:class="{ 'reports-list__item--empty': !value }") {{ value || '|' }}
</template>

<script setup>
const props = defineProps({
  value: {type: [String, Number], default: null},
})
</script>

<style>
.reports-list__item
  color: #575757
  font-size: 30px
  padding: 0 1ch

.reports-list__item--empty
  color: #afb1b3
</style>
