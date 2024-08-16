<template lang="pug">
  UserHeader

  router-view
</template>

<script setup>
import UserHeader from '@/components/UserHeader.vue'
</script>

<style>
:root
  --color-1: #808080
  --color-2: #999
  --color-3: #afb1b3
  --color-4: #575757
  --color-5: #cecece
  --color-6: #d7d7d7
  --color-7: #dfdfdf

@font-face
  font-family: "Source Code Pro"
  src: url('@/assets/source-code-pro.woff2') format("woff2")

body
  background: var(--color-5)
  margin: 0
  font-size: 16px
  display: flex
  align-items: center
  display: flex
  justify-content: center

*
  font-family: "Source Code Pro"

.app
  min-height: 100vh
  width: 80ch

a
  color: var(--color-1)
  text-decoration: none

a:hover
  color: var(--color-4)
</style>
