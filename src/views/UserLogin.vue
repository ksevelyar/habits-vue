<template lang="pug">
form.user-login(@submit.prevent='loginUser')
  input.user-login__email(
    v-model.trim='userForm.email'
    placeholder="email"
    type="email"
    required
  )

  input.user-login__password(
    v-model.trim='userForm.password'
    placeholder="password"
    type="password"
    required
  )

  button.user-login__submit(type="submit") Authenticate
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const user = useUserStore()

const userForm = reactive({
  email: 'ksevelyar@gmail.com',
  password: 'password@123456',
})

const loginUser = async () => {
  try {
    await user.login({ user: userForm })
    router.push({ path: '/' })
  } catch(error) {
    console.log(error)
  }
}
</script>

<style lang="sss">
.user-login
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  gap: 10px

.user-login__email
  box-sizing: border-box
  width: 200px

.user-login__password
  box-sizing: border-box
  width: 200px

.user-login__submit
  width: 200px
</style>
