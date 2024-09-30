<template lang="pug">
  .chain-list
    .chain-list__item(
      v-for="(chain, index) in chains"
      :key="chain.id"

      draggable="true"
      @dragstart="dragStart(index)"
      @dragover.prevent
      @drop="drop(index)"
    )
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


let draggedIndex = null

const dragStart = (index) => {
  draggedIndex = index
}

const drop = (index) => {
  const draggedItem = chains.value[draggedIndex]
  chains.value.splice(draggedIndex, 1) // Remove the item from its original position
  chains.value.splice(index, 0, draggedItem) // Insert the item at the new position
}
</script>

<style lang="sss">
.chain-list__item
  font-size: 2em
  padding: 4px
</style>
