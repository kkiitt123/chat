<template lang="pug">
    #app
      //img(src="./assets/logo.png")
      //.sample pugで記述
      router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
  body {
    margin: 0;
  }
</style>
