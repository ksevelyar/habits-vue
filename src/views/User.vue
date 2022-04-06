<template lang="pug">
.user
  UserCard
</template>

<script>
import UserCard from '@/components/UserCard.vue'

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
