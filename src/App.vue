<template>
  <div id="app">
    <div v-if="$route.meta.keepAlive">
      <el-container>
        <el-aside width="70px" style="background-color: #FFF;">
          <nav-menu></nav-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      
    </div>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue';
export default {
  name: 'App',
  components:{
    NavMenu
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  /* width: 100vw; */
  background-color: #fcfcfc;
}

</style>
