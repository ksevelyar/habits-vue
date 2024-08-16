<template lang='pug'>
.user-header
  router-link.user-header__item(:to="{ name: 'UserDashboard' }") Dashboard
  router-link.user-header__item(:to="{ name: 'HabitsList' }") Habits
  router-link.user-header__item(:to="{ name: 'UserDashboard' }") Metrics
</template>

<style>
.user-header
  display: flex
  align-items: center
  justify-content: space-between
  box-sizing: border-box
  position: sticky
  top: 0
  height: 10vh
</style>
