export default {
  /** 滑块主图、抠图等信息。后台系统提供 */
  imageInfo: {
    type: Object,
    required: true,
  },
  /** v-model 模式 验证状态: 1 失败 1 成功 0 静默 2 验证中 */
  verifyStatus: {
    type: Number,
    default: 0,
    required: true,
  },
  /** 拼图组件宽度 */
  width: {
    type: Number,
  },
  /** 挂载节点 */
  attach: {
    type: String,
    default: "body",
  },
};
