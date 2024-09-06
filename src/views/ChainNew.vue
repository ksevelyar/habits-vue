<template lang="pug">
form.chain-new(@submit.prevent='create')
  .chain-new__active
    | Active
    input(type="checkbox" v-model="chain.active")
    label(for="checkbox") {{ chain.active }}

  select.chain-new__type(v-model="chain.type")
    option integer
    option float
    option boolean

  input.chain-new__name(
    v-model.trim="chain.name"
    placeholder="name"
    required
  )

  textarea.chain-new__description(
    v-model.trim="chain.description"
    placeholder="description"
  )

  button.chain-new__submit(type="submit") Add
</template>

<script setup>
import { reactive } from 'vue'
import { useChainStore } from '@/stores/chain'
import router from '@/router'

const chainStore = useChainStore()

const chain = reactive({
  active: true,
  type: 'integer',
  email: 'ksevelyar@gmail.com',
  password: 'password@123456',
})

const create = async () => {
  try {
    const createdChain = await chainStore.create({ chain: chain })
    router.push({ path: `/chains/${createdChain.id}/edit` })
  } catch(error) {
    console.log(error)
  }
}
</script>

<style lang="sss">
.chain-new
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  gap: 10px
  flex-grow: 1

.chain-new__name
  width: 200px

.chain-new__type
  width: 200px

.chain-new__description
  width: 200px

.chain-new__submit
  width: 200px

.chain-new__active
  width: 200px
</style>
