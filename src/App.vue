<template>
  <router-view />
</template>

<style lang="sss">
@font-face
  font-family: "Overpass"
  src: url(~@/assets/overpass-regular.woff2) format("woff2")

body
  margin: 0
  font-family: "Overpass"

.app
  min-height: 100vh
  background: #fbfafa

a
  color: grey
  text-decoration: none

a:hover
  color: black
</style>
