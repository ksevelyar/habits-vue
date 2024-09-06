<template lang='pug'>
.user-header
  router-link.user-header__item(:to="{ name: 'UserDashboard' }") Dashboard
  router-link.user-header__item(:to="{ name: 'ChainList' }") Chains
  router-link.user-header__item(:to="{ name: 'MetricsForm' }") Metrics
</template>

<style lang="sss">
.user-header
  display: flex
  align-items: center
  justify-content: space-between
  box-sizing: border-box
  position: sticky
  top: 0
  height: 10vh
</style>
