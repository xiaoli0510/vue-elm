<template>
  <div id="head_top" class="head_top">
   1222
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  props: ["goBack", "signinUp", "headTitle"],
  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.head_top {
  border:1px solid #000!important;

}
#head_top {
  background-color: $blue;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  @include wh(100%, 1.95rem);
}
</style>


