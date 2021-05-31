<template lang="pug">
.add-report
  .add-report__input-group
    label.add-report__label Date
      input.add-report__input(v-model="report.date")

  .add-report__input-group
    label.add-report__label Weight
      input.add-report__input(v-model="report.weight" placeholder="kg")

  .add-report__save(@click="save") Save
</template>

<script>
import reportClient from '@/api/report.js'

export default {
  data() {
    return {
      report: {
        date: new Date(),
        weight: 100
      }
    }
  },
  methods: {
    async save() {
      const report = await reportClient.createReport({ report: this.report })

      console.log(report)
    }
  }
}
</script>

<style>
.add-report__input-group {
  margin-bottom: 1rem;
}

.add-report__input {
  display: block;
  box-sizing: border-box;
}

.add-report__save {
  text-align: center;
  cursor: pointer;
}
</style>
