<template lang="pug">
  .chain-list
    router-link(
      v-for="chain in orderedChains"
      :key="chain.id"

      draggable="true"
      @dragstart="dragStart(chain.id)"
      @dragover.prevent
      @drop="drop(chain.id)"
      :to="{ name: 'ChainEdit', params: {id: chain.id }}"
      class="chain-list__item"
    ) {{ chain.name }}

    router-link(:to="{ name: 'ChainNew' }") Add Chain
</template>

<script setup>
import { ref, computed } from 'vue'

import chainClient from '@/api/chain-client'

const chains = ref([])
const orderedChains = computed(() => {
  return [...chains.value].sort((a, b) => a.order - b.order)
})

const getList = async () => {
  chains.value = await chainClient.list()
}

let draggedID = null
const dragStart = (order) => draggedID = order

const swapOrder = (draggedChain, droppedChain) => [draggedChain.order, droppedChain.order] = [droppedChain.order, draggedChain.order]

const drop = (droppedID) => {
  const draggedChain = chains.value.find(chain => chain.id === draggedID)
  const droppedChain = chains.value.find(chain => chain.id === droppedID)

  swapOrder(draggedChain, droppedChain)
  chainClient.order(draggedChain.id, droppedChain.id)
}

getList()
</script>

<style lang="sss">
.chain-list__item
  font-size: 2em
  margin-bottom: 6px
  display: block
  padding: 0
  cursor: grabbing
</style>
