<template>
  <router-view />
</template>

<style>
@font-face
  font-family: "Source Code Pro"
  src: url('@/assets/source-code-pro.woff2') format("woff2")

body
  margin: 0
  font-size: 16px

*
  font-family: "Source Code Pro"

.app
  min-height: 100vh
  background: #cecece

a
  color: #808080
  text-decoration: none

a:hover
  color: #808080
</style>
