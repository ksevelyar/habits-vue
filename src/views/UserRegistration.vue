<template lang="pug">
form.user-registration(@submit.prevent='registerUser')
  input.user-registration__email(
    v-model.trim='userForm.email'
    placeholder="email"
    type="email"
    required
  )

  input.user-registration__handle(
    v-model.trim='userForm.handle'
    placeholder="handle"
    required
  )

  input.user-registration__password(
    v-model.trim='userForm.password'
    placeholder="password"
    type="password"
    required
  )

  button.user-registration__submit(type="submit") Register
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const user = useUserStore()

const userForm = reactive({
  email: '',
  handle: '',
  password: '',
})

const registerUser = async () => {
  try {
    await user.register({ user: userForm })
    router.push({ path: '/' })
  } catch(error) {
    console.log(error)
  }
}
</script>

<style lang="sss">
.user-registration
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  gap: 10px
  flex-grow: 1

.user-registration__email
  box-sizing: border-box
  width: 200px

.user-registration__handle
  box-sizing: border-box
  width: 200px

.user-registration__password
  box-sizing: border-box
  width: 200px

.user-registration__submit
  width: 200px
</style>
