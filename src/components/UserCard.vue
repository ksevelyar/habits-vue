<template lang="pug">
.user-card
  h1.user-card__title {{ user.handle }}
  img.user-card__image(:src="user.avatar_url")
</template>

<script>
import userClient from '@/api/user-client'

export default {
  async setup () {
    const user = await userClient.get()

    return { user }
  }
}
</script>

<style lang="sss">
.user-card__image
  width: 200px
  height: 200px
</style>
