<template>
  <div ref="triggerRef">
    <slot />
  </div>
  <Teleport :to="attach">
    <div
      class="puzzle-captcha"
      v-if="verifyStatus != 1"
      v-show="imageInfo.mainImage"
      ref="puzzleCaptcha"
    >
      <div class="body" :style="`width:${width}px`">
        <img
          :src="imageInfo.mainImage"
          class="main-image"
          :style="`width:${renderInfo.mainWidth}px;height:${renderInfo.mainHeight}px;`"
        />
        <img
          ref="sliderImg"
          :src="imageInfo.cutoutImage"
          class="cutout-image"
          :style="`top:${renderInfo.cutoutPositionY}px;width:${renderInfo.cutoutWidth}px;height:${renderInfo.cutoutHeight}px;`"
        />
        <div class="icons">
          <i class="iconfont icon-question" @click="this.$emit('question')" />
          <i
            class="iconfont icon-refresh"
            @click="refreshHandle"
            :class="{ disabled: onLoading }"
          />
        </div>
        <div class="loading-view" v-show="onLoading">
          <i class="iconfont icon-rotate" />
          <div>加载中...</div>
        </div>
      </div>
      <div class="opera" :class="{ error: verifyStatus == -1 && onVerifying }">
        <div class="progress-bar" ref="progressBar">
          <div class="tip" v-show="onVerifying">验证中...</div>
        </div>
        <div class="slider" ref="sliderBtn" :class="{ on: onSliding }">
          <i
            class="iconfont icon-error"
            style="font-size: 19px"
            v-if="verifyStatus == -1 && onVerifying"
          />
          <i class="iconfont icon-arrow-right" style="font-size: 19px" v-else />
        </div>
        <div class="tip" v-show="!onSliding && !onVerifying">
          {{ onLoading ? "加载中..." : "向右拖动滑块填充拼图" }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import props from "@/components/puzzle-captcha/props";

export default defineComponent({
  name: "PuzzleCaptcha",
  props: props,
  emits: ["update:verifyStatus", "question", "refresh", "verify"],
  watch: {
    imageInfo() {
      this.onLoading = false;
      this.resize();
      this.addSwipeEvents();
      this.reduction();
    },
    verifyStatus(val) {
      if (val === -1) {
        //校验失败
        this.verifyFailHandle();
      } else if (val == 1) {
        this.removerSwipeEvents();
      }
    },
  },
  computed: {
    renderInfo() {
      const info = this.imageInfo as any;
      const scale = (this.mainWidth as number) / info.mainWidth;
      return {
        mainWidth: this.mainWidth,
        mainHeight: info.mainHeight * scale,
        cutoutPositionY: info.positionY * scale,
        cutoutWidth: info.cutoutWidth * scale,
        cutoutHeight: info.cutoutHeight * scale,
        slidingDistance: this.mainWidth - info.cutoutWidth * scale,
      };
    },
  },
  mounted() {
    this.calcMainWidth();
  },
  data() {
    return {
      mainWidth: 0,
      onSliding: false,
      originX: 0,
      originY: 0,
      startSlidingTime: null as any,
      entSlidingTime: null as any,
      trackList: [] as any[],
      onLoading: false,
      onVerifying: false,
    };
  },
  methods: {
    calcMainWidth() {
      if (this.width) {
        this.mainWidth = this.width;
      } else {
        const triggerRect = (
          this.$refs.triggerRef as any
        ).getBoundingClientRect();
        this.mainWidth =
          triggerRect.width - 20 > 200 ? triggerRect.width - 20 : 200; //最小宽度
      }
    },
    addSwipeEvents() {
      window.addEventListener("touchstart", this.dragStartHandle);
      window.addEventListener("touchmove", this.dragMoveHandle);
      window.addEventListener("touchend", this.dragEndHandle);

      window.addEventListener("mousedown", this.dragStartHandle);
      window.addEventListener("mousemove", this.dragMoveHandle);
      window.addEventListener("mouseup", this.dragEndHandle);
    },
    removerSwipeEvents() {
      window.removeEventListener("touchstart", this.dragStartHandle);
      window.removeEventListener("touchmove", this.dragMoveHandle);
      window.removeEventListener("touchend", this.dragEndHandle);

      window.removeEventListener("mousedown", this.dragStartHandle);
      window.removeEventListener("mousemove", this.dragMoveHandle);
      window.removeEventListener("mouseup", this.dragEndHandle);
    },
    resize() {
      const triggerRect = (
        this.$refs.triggerRef as any
      ).getBoundingClientRect();
      const puzzleCaptchaRect = (
        this.$refs.puzzleCaptcha as any
      ).getBoundingClientRect();
      const maxY = puzzleCaptchaRect.bottom;
      let y =
        triggerRect.top < maxY + 50
          ? triggerRect.bottom - triggerRect.height
          : triggerRect.top + triggerRect.height;
      (this.$refs.puzzleCaptcha as any).style.transform =
        "translate3d(" + triggerRect.left + "px," + y + "px,0)";
    },
    dragStartHandle(e: any) {
      if (this.onSliding || this.onLoading || this.onVerifying) return;
      this.trackList = [];
      this.startSlidingTime = new Date();
      // 获取拖拽起始位置坐标
      this.originX = e.clientX || e.touches[0].clientX;
      this.originY = e.clientY || e.touches[0].clientY;
      this.onSliding = true;
    },
    dragMoveHandle(e: any) {
      if (!this.onSliding || this.onVerifying || this.onLoading) return;
      const w = this.renderInfo.mainWidth - 40; //滑道宽度
      const eventX = e.clientX || e.touches[0].clientX;
      const eventY = e.clientY || e.touches[0].clientY;

      // 获取拖拽移动的距离
      let moveX = eventX - this.originX;
      let moveY = eventY - this.originY;
      this.trackList.push({
        moveX: moveX,
        moveY: moveY,
        time: new Date().getTime() - this.startSlidingTime.getTime(),
      });
      if (moveX < 0) moveX = 0;
      else if (moveX > w) moveX = w;
      (this.$refs.progressBar as any).style.width = moveX + "px";
      (this.$refs.sliderBtn as any).style.transform =
        "translate(" + moveX + "px, 0px)";
      (this.$refs.sliderImg as any).style.transform =
        "translate(" +
        (moveX > this.renderInfo.slidingDistance
          ? this.renderInfo.slidingDistance
          : moveX) +
        "px, 0px)";
    },
    dragEndHandle(e: any) {
      if (!this.onSliding || this.onVerifying || this.onLoading) return;
      const eventX = e.clientX || e.changedTouches[0].clientX;
      if (eventX === this.originX) return;
      this.entSlidingTime = new Date();
      //验证
      this.verify();
    },
    refreshHandle() {
      if (!this.onLoading) {
        this.onLoading = true;
        this.$emit("refresh");
      }
    },
    verifyFailHandle() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let self = this;
      setTimeout(function () {
        self.reduction();
        self.$emit("update:verifyStatus", 0);
      }, 500);
    },
    reduction() {
      this.onSliding = false;
      (this.$refs.progressBar as any).style.width = "0px";
      (this.$refs.sliderBtn as any).style.transform = "translate(0px, 0px)";
      (this.$refs.sliderImg as any).style.transform = "translate(0px, 0px)";
      this.onVerifying = false;
    },
    verify() {
      this.onVerifying = true;
      this.$emit("verify", {
        mainWidth: this.renderInfo.mainWidth,
        startSlidingTime: this.startSlidingTime,
        endSlidingTime: this.entSlidingTime,
        trackItems: this.trackList,
        token: (this.imageInfo as any).token,
      });
    },
  },
});
</script>

<style scoped lang="less">
@import "index.less";
</style>
