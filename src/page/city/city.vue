<template>
  <div class="city_container">
    <head-top :head-title="state.cityname" :go-back="true" :signin-Up="false">
      <router-link to="/home" class="change_city">切换城市</router-link>
    </head-top>
    <form class="city_form" v-on:submit.prevent>
      <div>
        <input
          type="search"
          name="city"
          placeholder="输入学校、商务楼、地址"
          class="city_input input_style"
          required
          v-model="inputValue"
        />
      </div>
      <div>
        <input
          type="submit"
          name="submit"
          class="city_submit input_style"
          @click="handleSearch(inputValue,postpois)"
          value="提交"
        />
      </div>
    </form>
    <header v-if="state.historytitle" class="pois_search_history">搜索历史</header>
    <ul class="getpois_ul">
      <li
        v-for="(item, index) in state.placelist"
        @click="nextpage(index, item.geohash)"
        :key="index"
      >
        <h4 class="pois_name ellipsis">{{ item.name }}</h4>
        <p class="pois_address ellipsis">{{ item.address }}</p>
      </li>
    </ul>
    <footer
      v-if="state.historytitle && state.placelist.length"
      class="clear_all_history"
      @click="clearAll"
    >
      清空所有
    </footer>
    <div class="search_none_place" v-if="state.placeNone">很抱歉！无搜索结果</div>
  </div>
</template>

<script  setup>
import headTop from "@/components/header/Head.vue";
import { currentcity, searchplace } from "@/service/getData";
import { getStore, setStore, removeStore } from "@/config/mUtils";
import { reactive, toRefs, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchInput } from "./searchInput.js";

    let state = reactive({
      cityid: "", // 当前城市id
      cityname: "", // 当前城市名字
      placelist: [], // 搜索城市列表
      placeHistory: [], // 历史搜索记录
      historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
      placeNone: false, // 搜索无结果，显示提示信息
    });

    let route = useRoute();
    let router = useRouter();

    let { inputValue, handleSearch } = useSearchInput();

    function initData() {
      //获取搜索历史记录
      if (getStore("placeHistory")) {
        state.placelist = JSON.parse(getStore("placeHistory"));
      } else {
        state.placelist = [];
      }
    }

    //发送搜索信息inputValue
    function postpois() {
      //输入值不为空时才发送信息
      if (inputValue.value) {
        searchplace(state.cityid, inputValue.value).then((res) => {
          state.historytitle = false;
          state.placelist = res;
          state.placeNone = res.length ? false : true;
        });
      }
    }

    /**
     * 点击搜索结果进入下一页面时，判断之前是有搜索过，如果没有则新增，如果有则不做处理
     *
     */
    function nextpage(index, geohash) {
      let history = getStore("placeHistory");
      let choosePlace = state.placelist[index];
      if (history) {
        let checkrepeat = false;
        state.placeHistory = JSON.parse(history);
        state.placeHistory.forEach((item) => {
          if (item.geohash == geohash) {
            checkrepeat = true;
          }
        });
        if (!checkrepeat) {
          state.placeHistory.push(choosePlace);
        }
      } else {
        state.placeHistory.push(choosePlace);
      }
      setStore("placeHistory", state.placeHistory);
      router.push({ path: "/msite", query: { geohash } });
    }

    function clearAll() {
      removeStore("placeHistory");
      initData();
    }

    onMounted(() => {
      state.cityid = route.params.cityid;
      //获取当前城市名字
      currentcity(state.cityid).then((res) => {
        state.cityname = res.name;
      });

      initData();
    });


</script>

<style lang="scss" scoped>
@import "src/style/mixin";
.city_container {
  padding-top: 2.35rem;
}
.change_city {
  right: 0.4rem;
  @include sc(0.6rem, #fff);
  @include ct;
}
.city_form {
  background-color: #fff;
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-top: 0.4rem;
  div {
    width: 90%;
    margin: 0 auto;
    text-align: center;
    .input_style {
      border-radius: 0.1rem;
      margin-bottom: 0.4rem;
      @include wh(100%, 1.4rem);
    }
    .city_input {
      border: 1px solid $bc;
      padding: 0 0.3rem;
      @include sc(0.65rem, #333);
    }
    .city_submit {
      background-color: $blue;
      @include sc(0.65rem, #fff);
    }
  }
}
.pois_search_history {
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-left: 0.5rem;
  @include font(0.475rem, 0.8rem);
}
.getpois_ul {
  background-color: #fff;
  border-top: 1px solid $bc;
  li {
    margin: 0 auto;
    padding-top: 0.65rem;
    border-bottom: 1px solid $bc;
    .pois_name {
      margin: 0 auto 0.35rem;
      width: 90%;
      @include sc(0.65rem, #333);
    }
    .pois_address {
      width: 90%;
      margin: 0 auto 0.55rem;
      @include sc(0.45rem, #999);
    }
  }
}
.search_none_place {
  margin: 0 auto;
  @include font(0.65rem, 1.75rem);
  color: #333;
  background-color: #fff;
  text-indent: 0.5rem;
}
.clear_all_history {
  @include sc(0.7rem, #666);
  text-align: center;
  line-height: 2rem;
  background-color: #fff;
}
</style>
