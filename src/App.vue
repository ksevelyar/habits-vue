<template>
  <router-view />
</template>

<style>
@font-face 
  font-family: "Overpass"
  src: url('@/assets/overpass-regular.woff2') format("woff2")

body
  margin: 0
  font-family: "Overpass"

.app
  min-height: 100vh
  background: #fbfafa

a
  color: #808080
  text-decoration: none

a:hover
  color: #808080
</style>
