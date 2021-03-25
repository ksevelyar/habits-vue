<template lang="pug">
.reports-list
  router-link.reports-list__link(
    v-for="report in reports"
    :key="report.date"
    :to="{ name: 'Report', params: { date: report.date }}"
  )
    ReportCard(:date="report.date" :weight="report.weight")
  
  router-link.reports-list__link.reports-list__add(:to="{ name: 'AddReport'}") Add Report
</template>

<script>
import ReportCard from '@/components/ReportCard.vue'

export default {
  components: { ReportCard },
  data() {
    return {
      reports: [
        { date: '22.03.21', weight: 88 },
        { date: '23.03.21', weight: 87 },
        { date: '24.03.21', weight: 86 }
      ]
    }
  }
}
</script>

<style>
.reports-list__link {
  color: #fefefe;
  text-decoration: none;
}
.reports-list__link:hover {
  color: #955b8e;
}

.reports-list__add {
  display: block;
  text-align: center;
}
</style>
