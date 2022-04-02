<template lang="pug">
.user
  suspense
    UserCard
</template>

<script>
import UserCard from '@/components/UserCard'

export default {
  components: {
    UserCard
  }
}
</script>

<style>
.user
  display: flex
  align-items: center
  justify-content: center
  height: 100vh
</style>
