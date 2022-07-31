<template>
  <div
    class="captcha-input"
    :class="{ onLoading: onLoading }"
    @click="clickHandle"
    v-if="verifyStatus != 1"
  >
    <div class="icon">
      <i
        class="iconfont icon-verify"
        style="font-size: 18px"
        v-if="!onLoading"
      />
      <i
        class="iconfont icon-rotate loading-icon"
        style="font-size: 18px"
        v-else
      />
    </div>
    <div>{{ onLoading ? "验证模块加载中..." : "点击完成验证" }}</div>
  </div>
  <div class="captcha-input success" v-else>
    <i class="iconfont icon-success" style="font-size: 18px" />
    <div>验证成功</div>
  </div>
</template>

<script>
export default {
  name: "CaptchaInput",
  props: {
    onLoading: {
      type: Boolean,
      default: false,
    },
    /** 验证状态 1 失败 1 成功 0 静默 2 验证中 */
    verifyStatus: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  emits: ["startVerify", "update:onLoading"],
  methods: {
    clickHandle() {
      this.$emit("update:onLoading", true);
      this.$emit("startVerify");
    },
  },
};
</script>

<style scoped lang="less">
.captcha-input {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #333;
  background: #f7f9fa;
  width: 300px;
  padding: 6px 0;
  border-radius: 2px;

  &.success {
    color: #85dbbe;
    background: #e8f8f2;

    &:hover {
      color: #85dbbe;
      cursor: not-allowed;
    }
  }

  .icon {
    background: #fff;
    box-shadow: 0 2px 8px 1px rgb(188 196 204 / 50%);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin-right: 10px;
  }

  &.onLoading,
  &:hover {
    color: #1991fa;
    cursor: pointer;

    .icon {
      background: #1991fa;
      color: #fff;
    }
  }

  .loading-icon {
    font-size: 20px;
    margin-bottom: 5px;

    -webkit-transform: rotate(360deg);
    animation: rotation 1s linear infinite;
    -moz-animation: rotation 1s linear infinite;
    -webkit-animation: rotation 1s linear infinite;
    -o-animation: rotation 1s linear infinite;
  }
  @-webkit-keyframes rotation {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
}
</style>
