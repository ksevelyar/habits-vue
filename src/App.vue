<template>
  <router-view />
</template>

<style>
@font-face
  font-family: "Fira Code"
  src: url('@/assets/fira-code.woff2') format("woff2")

body
  margin: 0
  font-size: 16px

*
  font-family: "Fira Code"

.app
  min-height: 100vh
  background: #cecece

a
  color: #808080
  text-decoration: none

a:hover
  color: #808080
</style>
