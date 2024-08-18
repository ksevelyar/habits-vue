<template lang="pug">
.dev-palette
  .dev-palette__group
    .dev-palette__color.dev-palette__color-4
    .dev-palette__color.dev-palette__color-1
    .dev-palette__color.dev-palette__color-2
    .dev-palette__color.dev-palette__color-3
    .dev-palette__color.dev-palette__color-5
    .dev-palette__color.dev-palette__color-6
    .dev-palette__color.dev-palette__color-7
</template>

<style lang="sss">
.dev-palette
  display: flex
  justify-content: center
  align-items: center
  height: 100vh

.dev-palette__color
  height: 10vh
  width: 40ch

.dev-palette__color-1
  background: var(--color-1)
.dev-palette__color-2
  background: var(--color-2)
.dev-palette__color-3
  background: var(--color-3)
.dev-palette__color-4
  background: var(--color-4)
.dev-palette__color-5
  background: var(--color-5)
.dev-palette__color-6
  background: var(--color-6)
.dev-palette__color-7
  background: var(--color-7)
</style>
