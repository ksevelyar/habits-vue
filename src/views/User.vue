<template lang="pug">
h1.user {{ user }}
</template>

<script>
import userClient from '@/api/user-client'

export default {
  data () { return { user: {} } },
  async created () {
    await this.fetchUser()
  },
  methods: {
    async fetchUser () {
      console.log(await userClient.get())
    }
  }
}
</script>
