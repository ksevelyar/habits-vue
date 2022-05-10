<template lang="pug">
.user
  Suspense
    UserCard
</template>

<script setup>
import UserCard from '@/components/UserCard.vue'
</script>

<style>
.user
  display: flex
  align-items: center
  justify-content: center
  height: 100vh
</style>
