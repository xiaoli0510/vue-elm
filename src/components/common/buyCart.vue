<script setup>
import { reactive, computed } from "vue";
import { useStore, mapState } from "vuex";

let state = reactive({
  showMoveDot: [], //控制小圆点的显示隐藏
});

let stateSotre = useStore();
// let cartList = mapState(["cartList"]);

const props = defineProps({
  shopId: String,
  foods: Object,
});

const emit = defineEmits([
  "moveInCart",
  "showChooseList",
  "showReduceTip",
  "showMoveDot",
]);

//加入购物车
function addToCart(
  category_id,
  item_id,
  food_id,
  name,
  price,
  specs,
  packing_fee,
  sku_id,
  stock,
  event
) {
  stateSotre.commit("ADD_CART", {
    shopid: props.shopId,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    packing_fee,
    sku_id,
    stock,
  });
  let elLeft = event.target.getBoundingClientRect().left;
  let elBottom = event.target.getBoundingClientRect().bottom;
  state.showMoveDot.push(true);
  emit("showMoveDot", state.showMoveDot, elLeft, elBottom);
}

//移出购物车
function removeOutCart() {
  if (foodNum > 0) {
    stateSotre.commit("REDUCE_CART", {
      shopid: shopId,
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock,
    });
  }
}

//显示规格列表
function showChooseList(foodScroll) {
  emit("showChooseList", foodScroll);
}

//点击多规格商品的减按钮，弹出提示
function showReduceTip() {
  emit("showReduceTip");
}

const foodNum = computed(() => {
  let category_id = props.foods.category_id;
  let item_id = props.foods.item_id;
  if (shopCart && shopCart[category_id] && shopCart[category_id][item_id]) {
    let num = 0;
    Object.values(shopCart[category_id][item_id]).forEach((item, index) => {
      num += item.num;
    });
    return num;
  } else {
    return 0;
  }
});

const shopCart = computed(() => {
  return Object.assign({}, cartList[shopId]);
});

const cartList = computed(()=>{
    return stateSotre.cartList;
})
</script>
<template>
  <section class="cart_module">
    <section v-if="!foods.specifications.length" class="cart_button">
      <transition name="showReduce">
        <span
          @click="
            removeOutCart(
              foods.category_id,
              foods.item_id,
              foods.specfoods[0].food_id,
              foods.specfoods[0].name,
              foods.specfoods[0].price,
              '',
              foods.specfoods[0].packing_fee,
              foods.specfoods[0].sku_id,
              foods.specfoods[0].stock
            )
          "
          v-if="foodNum"
        >
          <svg>
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#cart-minus"
            ></use>
          </svg>
        </span>
      </transition>
      <transition name="fade">
        <span class="cart_num" v-if="foodNum">{{ foodNum }}</span>
      </transition>
      <svg
        class="add_icon"
        @click="
          addToCart(
            foods.category_id,
            foods.item_id,
            foods.specfoods[0].food_id,
            foods.specfoods[0].name,
            foods.specfoods[0].price,
            '',
            foods.specfoods[0].packing_fee,
            foods.specfoods[0].sku_id,
            foods.specfoods[0].stock,
            $event
          )
        "
      >
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#cart-add"
        ></use>
      </svg>
    </section>
    <section v-else class="choose_specification">
      <section class="choose_icon_container">
        <transition name="showReduce">
          <svg class="specs_reduce_icon" v-if="foodNum" @click="showReduceTip">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#cart-minus"
            ></use>
          </svg>
        </transition>
        <transition name="fade">
          <span class="cart_num" v-if="foodNum">{{ foodNum }}</span>
        </transition>
        <span class="show_chooselist" @click="showChooseList(foods)"
          >选规格</span
        >
      </section>
    </section>
  </section>
</template>
<style lang="scss" scoped>
@import "../../style/mixin";
.cart_module {
  .add_icon {
    position: relative;
    z-index: 9;
  }
  .cart_button {
    display: flex;
    align-items: center;
  }
  svg {
    @include wh(0.9rem, 0.9rem);
    fill: #3190e8;
  }
  .specs_reduce_icon {
    fill: #999;
  }
  .cart_num {
    @include sc(0.65rem, #666);
    min-width: 1rem;
    text-align: center;
    font-family: Helvetica Neue, Tahoma;
  }
  .choose_specification {
    .choose_icon_container {
      display: flex;
      align-items: center;
      .show_chooselist {
        display: block;
        @include sc(0.55rem, #fff);
        padding: 0.1rem 0.2rem;
        background-color: $blue;
        border-radius: 0.2rem;
        border: 1px solid $blue;
      }
    }
  }
}
.showReduce-enter-active,
.showReduce-leave-active {
  transition: all 0.3s ease-out;
}
.showReduce-enter,
.showReduce-leave-active {
  opacity: 0;
  transform: translateX(1rem);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fadeBounce-enter-active,
.fadeBounce-leave-active {
  transition: all 0.3s;
}
.fadeBounce-enter,
.fadeBounce-leave-active {
  opacity: 0;
  transform: scale(0.7);
}
</style>