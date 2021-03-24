<template lang="pug">
ReportCard(:date="$route.params.date")
</template>

<script>
import ReportCard from '@/components/ReportCard.vue'

export default {
  components: { ReportCard }
}
</script>

<style></style>
