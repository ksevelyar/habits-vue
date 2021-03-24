<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
}

@font-face {
  font-family: 'Iosevka';
  font-display: swap;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  src: url('~@/assets/fonts/iosevka-medium.woff2') format('woff2');
}

#app {
  font-family: 'Iosevka';

  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background: #3e3880;
  color: #fefefe;
}
</style>
