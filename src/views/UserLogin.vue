<template lang="pug">
.home
  a.home__auth-link(:href.once="authPath()") Auth with GitHub
</template>

<script>
export default {
  methods: {
    authPath () {
      return `${import.meta.env.VITE_BACK}/auth/github/`
    }
  }
}
</script>

<style>
.home
  display: flex
  align-items: center
  justify-content: center
  min-height: 100vh

.home__auth-link
  color: #808080
  font-size: 30px
  text-decoration: none
</style>
