<template lang="pug">
.report
  input.report__input.report__date(type="date" placeholder="date")
  input.report__input.report__weight(type="number" placeholder="weight")
  input.report__input.report__stepper(type="number" placeholder="stepper")
  input.report__input.report__dumbbells(type="number" placeholder="dumbbels sets")
  input.report__input.report__pullups(type="number" placeholder="pullups")
  input.report__input.report__protein(type="number" placeholder="protein")
  input.report__input.report__fat(type="number" placeholder="fat")
  input.report__input.report__carbs(type="number" placeholder="carbs")
</template>

<script>
export default {

}
</script>

<style lang="sss">
.report
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100vh

.report__input
  margin-top: 1em
  box-sizing: border-box
  width: 80vw
  max-width: 40ch
  height: 3em
</style>
