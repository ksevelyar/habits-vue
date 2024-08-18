<template lang="pug">
  .chain-list
    h1 Chains

    .chain-list__item(v-for="chain in chains")
      router-link(:to="{ name: 'ChainEdit', params: {id: chain.id }}") {{ chain.name }}

    router-link(:to="{ name: 'ChainNew' }") Add Chain
</template>

<script setup>
import { ref } from 'vue'

import chainClient from '@/api/chain-client'

const chains = ref([])

const getList = async () => {
  chains.value = await chainClient.list()
}

getList()
</script>
