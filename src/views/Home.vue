<template lang="pug">
.home
  a.home__auth-link(:href.once="authPath()") Auth with GitHub
</template>

<script>
export default {
  methods: {
    authPath () {
      return `${process.env.VUE_APP_BACK}/auth/github/`
    }
  }
}
</script>

<style lang="sss">
.home
  display: flex
  align-items: center
  justify-content: center
  min-height: 100vh

.home__auth-link
  color: gray
  font-size: 30px
  text-decoration: none
</style>
