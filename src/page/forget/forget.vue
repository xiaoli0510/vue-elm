<script setup>
import headTop from "@/components/header/Head.vue";
import alertTip from "@/components/common/alertTip.vue";
import { onMounted, reactive } from "vue";
import { getcaptchas, changePassword } from "@/service/getData";

let state = reactive({
  phoneNumber: null, //电话号码
  oldPassWord: null,
  newPassWord: null, //新密码
  rightPhoneNumber: false, //输入的手机号码是否符合要求
  confirmPassWord: null, //确认密码
  captchaCodeImg: null, //验证码地址
  mobileCode: null, //短信验证码
  computedTime: 0, //倒数记时
  showAlert: false, //显示提示组件
  alertText: null, //提示的内容
  accountType: "mobile" //注册方式
});

onMounted(() => {
  getCaptchaCode();
});

//获取验证码，线上环境使用固定的图片，生产环境使用真实的验证码
async function getCaptchaCode() {
  let res = await getcaptchas();
  state.captchaCodeImg = res.code;
}

//重置密码
async function resetButton() {
  if (!state.phoneNumber) {
    state.showAlert = true;
    state.alertText = "请输入正确的账号";
    return;
  } else if (!state.oldPassWord) {
    state.showAlert = true;
    state.alertText = "请输入旧密码";
    return;
  } else if (!state.newPassWord) {
    state.showAlert = true;
    state.alertText = "请输入新密码";
    return;
  } else if (!state.confirmPassWord) {
    state.showAlert = true;
    state.alertText = "请输确认密码";
    return;
  } else if (state.newPassWord !== state.confirmPassWord) {
    state.showAlert = true;
    state.alertText = "两次输入的密码不一致";
    return;
  } else if (!state.mobileCode) {
    state.showAlert = true;
    state.alertText = "请输验证码";
    return;
  }

  //发送重置信息
  let res = await changePassword(
    state.phoneNumber,
    state.oldPassWord,
    state.newPassWord,
    state.confirmPassWord,
    state.mobileCode
  );
  if (res.message) {
    state.showAlert = true;
    state.alertText = res.message;
    state.getCaptchaCode();
    return;
  } else {
    state.showAlert = true;
    state.alertText = "密码修改成功";
  }
}
//关闭提示弹框
function closeTip() {
  state.showAlert = false;
}
</script>
<template>
  <div class="restContainer">
    <headTop head-title="重置密码" :goBack="true" :signinUp="false"></headTop>
    <form class="restForm">
      <section class="input_container phone_number">
        <input
          type="text"
          placeholder="账号"
          name="phone"
          maxlength="11"
          v-model="state.phoneNumber"
          @input="inputPhone"
        />
        <!-- <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                <button  @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button> -->
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="旧密码"
          name="oldPassWord"
          v-model="state.oldPassWord"
        />
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="请输入新密码"
          name="newPassWord"
          v-model="state.newPassWord"
        />
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="请确认密码"
          name="confirmPassWord"
          v-model="state.confirmPassWord"
        />
      </section>
      <section class="input_container captcha_code_container">
        <input
          type="text"
          placeholder="验证码"
          name="mobileCode"
          maxlength="6"
          v-model="state.mobileCode"
        />
        <div class="img_change_img">
          <img v-show="state.captchaCodeImg" :src="state.captchaCodeImg" />
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <div class="login_container" @click="resetButton">确认修改</div>
    <alertTip
      v-if="state.showAlert"
      :showHide="state.showAlert"
      @closeTip="closeTip"
      :alertText="state.alertText"
    ></alertTip>
  </div>
</template>
<style lang="scss" scoped>
@import "src/style/mixin";

.restContainer {
  padding-top: 1.95rem;
}
.restForm {
  background-color: #fff;
  margin-top: 0.6rem;
  .input_container {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #f1f1f1;
    input {
      @include sc(0.7rem, #666);
    }
    button {
      @include sc(0.65rem, #fff);
      font-family: Helvetica Neue, Tahoma, Arial;
      padding: 0.28rem 0.4rem;
      border: 1px;
      border-radius: 0.15rem;
    }
    .right_phone_number {
      background-color: #4cd964;
    }
  }
  .phone_number {
    padding: 0.3rem 0.8rem;
  }
  .captcha_code_container {
    height: 2.2rem;
    .img_change_img {
      display: flex;
      align-items: center;
      img {
        @include wh(3.5rem, 1.5rem);
        margin-right: 0.2rem;
      }
      .change_img {
        display: flex;
        flex-direction: "column";
        flex-wrap: wrap;
        width: 2rem;
        justify-content: center;
        p {
          @include sc(0.55rem, #666);
        }
        p:nth-of-type(2) {
          color: #3b95e9;
          margin-top: 0.2rem;
        }
      }
    }
  }
}
.captcha_code_container {
  height: 2.2rem;
  .img_change_img {
    display: flex;
    align-items: center;
    img {
      @include wh(3.5rem, 1.5rem);
      margin-right: 0.2rem;
    }
    .change_img {
      display: flex;
      flex-direction: "column";
      flex-wrap: wrap;
      width: 2rem;
      justify-content: center;
      p {
        @include sc(0.55rem, #666);
      }
      p:nth-of-type(2) {
        color: #3b95e9;
        margin-top: 0.2rem;
      }
    }
  }
}
.login_container {
  margin: 1rem 0.5rem;
  @include sc(0.7rem, #fff);
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}
</style>
