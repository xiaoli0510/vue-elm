<script>
export default {
    setup(){
        const count = ref(0);
        return {
            count
        }
    }
}
</script>
<template>
  <div>这是city组件{{count}}</div>
</template>
