<template lang="pug">
.user-card
  h1.user-card__title {{ user.handle }}
  img.user-card__image(:src="user.avatar_url")
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import userClient from '@/api/user-client'

const store = useUserStore()
const { user } = storeToRefs(store)

await store.fetchUser()
</script>

<style>
.user-card__image
  width: 200px
  height: 200px
</style>
