<template lang="pug">
.report-card
  .report-card__date {{ date }}
  .report-card__weight {{ weight }}
</template>

<script>
export default {
  props: {
    date: { type: String, default: '24.03.21' },
    weight: { type: Number, default: 40 }
  }
}
</script>

<style>
.report-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 20ch;
  margin-bottom: 1rem;

  border: 3px solid #955b8e;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
