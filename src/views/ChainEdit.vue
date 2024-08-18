<template lang="pug">
form.chain-new(@submit.prevent='update')
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
import chainClient from '@/api/chain-client'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const chain = reactive({
  id: null,
  active: null,
  type: null,
  email: null,
  password: null,
})

const update = async () => {
  try {
    await chainClient.update({ chain })
    router.push({ path: '/chains/' })
  } catch(error) {
    console.log(error)
  }
}

const get = async () => {
  try {
    const savedChain = await chainClient.get(route.params.id)

    Object.assign(chain, savedChain)
  } catch(error) {
    console.log(error)
  }
}

get()
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
