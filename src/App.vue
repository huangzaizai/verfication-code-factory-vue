<template>
  <div class="captcha">
    <div class="label">验证码</div>
    <puzzle-captcha
      :image-info="imageInfo"
      @refresh="fetchCaptcha"
      @verify="verify"
      v-model:verifyStatus="verifyStatus"
    >
      <captcha-input
        @startVerify="fetchCaptcha"
        v-model:onLoading="captchaOnLoading"
        :verifyStatus="verifyStatus"
      />
    </puzzle-captcha>
  </div>
</template>

<script lang="ts">
import PuzzleCaptcha from "@/components/puzzle-captcha/index.vue";
import { defineComponent } from "vue";
import CaptchaInput from "@/components/captcha-input/index.vue";
import { fetchCaptchaInfo } from "@/tempData/puzzleCaptcha";
import request from "@/request";

export default defineComponent({
  name: "App",
  components: {
    CaptchaInput,
    PuzzleCaptcha,
  },
  data() {
    return {
      imageInfo: {} as any,
      verifyStatus: 0,
      captchaOnLoading: false,
    };
  },
  methods: {
    async fetchCaptcha() {
      const res = await request.get("/captcha");
      this.imageInfo = res.data;
      // this.imageInfo = await fetchCaptchaInfo();
      this.captchaOnLoading = false;

      // 临时数据
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const that = this;
      // setTimeout(function () {
      //   that.imageInfo = fetchCaptchaInfo();
      //   that.captchaOnLoading = false;
      // }, 1000);
    },
    async verify(data: any) {
      console.log(data);
      const res = await request.post("/captcha", data);
      this.verifyStatus = res.data ? 1 : -1;

      //临时数据
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const that = this;
      // setTimeout(function () {
      //   that.verifyStatus = Math.random() > 0.5 ? 1 : -1;
      // }, 1000);
    },
  },
});
</script>

<style lang="less">
.captcha {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  padding: 20px 0;

  .label {
    margin-right: 10px;
  }
}
</style>
