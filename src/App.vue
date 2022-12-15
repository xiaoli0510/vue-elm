<script>
	import svgIcon from './components/common/svg.vue';
  export default{
    components:{
      svgIcon
    }
  }
</script>

<template>
  <div>
    <router-view></router-view>
    <svgIcon></svgIcon>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
