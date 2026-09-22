// ========== 消除 Chrome 对 touch 事件非 passive 的警告（必须在所有 import 之前） ==========
import { patchPassiveTouch } from "@/utils/patchPassiveTouch"
patchPassiveTouch()

import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";

// ========== 页面切换动画库 ==========
import "animate.css";

// ========== Pinia 状态管理 ==========
import usePinia from "@/stores";

// ========== ArcoVue 组件库 ==========
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

// ========== 全局基础样式（放在组件库样式之后，便于覆盖库的默认字体等） ==========
import "@/assets/style/base.css";

// ========== 主题系统初始化 ==========
import { useTheme } from "@/theme";
useTheme();

// ========== 自定义公共组件（统一入口：注册组件 + 加载 SVG 图标 symbol） ==========
import fmComponents from "@/components";

const app = createApp(App);
app.use(usePinia());
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(router);
app.use(fmComponents); // 统一注册 FmIcon / FmSearchInput / FmRadioGroup
app.mount("#app");
