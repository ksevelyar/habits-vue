<template lang="pug">
  .chain-list
    .chain-list__item(
      v-for="chain in orderedChains"
      :key="chain.id"

      draggable="true"
      @dragstart="dragStart(chain.id)"
      @dragover.prevent
      @drop="drop(chain.id)"
    )
      router-link(:to="{ name: 'ChainEdit', params: {id: chain.id }}") {{ chain.name }}

    router-link(:to="{ name: 'ChainNew' }") Add Chain
</template>

<script setup>
import { ref, computed } from 'vue'

import chainClient from '@/api/chain-client'

const chains = ref([])

const getList = async () => {
  chains.value = await chainClient.list()
}

getList()

let draggedOrder = null
const dragStart = (order) => {
  draggedOrder = order
}

const drop = (droppedOrder) => {
  const draggedChain = chains.value.find(chain => chain.id === draggedOrder)
  const droppedChain = chains.value.find(chain => chain.id === droppedOrder)

  const tempOrder = draggedChain.order
  draggedChain.order = droppedChain.order
  droppedChain.order = tempOrder
  chainClient.order(draggedChain.id, droppedChain.id)
}

const orderedChains = computed(() => {
  return [...chains.value].sort((a, b) => a.order - b.order)
})
</script>

<style lang="sss">
.chain-list__item
  font-size: 2em
  padding: 4px
</style>
