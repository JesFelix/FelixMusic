<template>
  <div id="app-root">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="transitionName" @leave="onLeave" @after-enter="onAfterEnter">
        <!-- 以顶层路由作为 key：仅在 MainLayout(/) 与 PlayLayout(/play) 间切换时触发过渡，
             避免 MainLayout 内部子路由切换时重复执行顶层动画 -->
        <component :is="Component" :key="route.matched[0]?.path ?? route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts" name="App">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 顶层路由切换方向：进入播放页 → 上升覆盖；返回主界面 → 下降露出
const transitionName = ref('')

// 返回主界面时，播放页下降动画结束后移除的延迟时长（ms）：需不小于 CSS 过渡 0.4s
const LEAVE_TIMEOUT = 500

// 暂存“主界面离开”的移除回调：进入播放页时不立即移除主界面，
// 而是等播放页滑入动画完成后再移除，避免两个静态块级元素同时存在导致闪烁
let leaveDone: (() => void) | null = null

// 监听顶层路由（matched[0]）变化，决定过渡动画方向
watch(
  () => route.matched[0]?.path,
  (to) => {
    transitionName.value = to === '/play' ? 'fm-slide-up' : 'fm-slide-down'
  }
)

// 离开组件：按方向决定移除时机
const onLeave = (_el: Element, done: () => void) => {
  if (transitionName.value === 'fm-slide-up') {
    // 进入播放页：主界面保持原位，等待播放页从底部滑入覆盖完成后移除
    leaveDone = done
  } else {
    // 返回主界面：播放页下降动画结束后再移除
    setTimeout(done, LEAVE_TIMEOUT)
  }
}

// 进入动画完成：立即移除仍在等待的主界面。
// Vue 会在移除 enter 类（播放页恢复 static 布局）的同一调用栈内触发此钩子，
// 保证主界面移除与播放页恢复布局发生在同一帧，消除堆叠闪烁
const onAfterEnter = () => {
  if (leaveDone) {
    leaveDone()
    leaveDone = null
  }
}
</script>

<style lang="scss">
#app-root {
  position: relative;
  border-radius: var(--fm-base-radius-lg);
  overflow: hidden;
}

/* ============================================================
   顶层路由切换动画：MainLayout ↔ PlayLayout
   播放页从窗口底部加速滑入覆盖主界面，返回时加速下降露出主界面
   cubic-bezier(0.42, 0, 1, 1) 即标准 ease-in，实现“加速”效果
   ============================================================ */

/* 进入播放页：从底部加速上升，覆盖主界面 */
.fm-slide-up-enter-active {
  position: absolute;
  inset: 0;
  z-index: 10;
  transition: transform 0.4s cubic-bezier(0.42, 0, 1, 1);
}
.fm-slide-up-enter-from {
  transform: translateY(100%);
}
.fm-slide-up-enter-to {
  transform: translateY(0);
}

/* 返回主界面：播放页加速下降，露出主界面 */
.fm-slide-down-leave-active {
  position: absolute;
  inset: 0;
  z-index: 10;
  transition: transform 0.4s cubic-bezier(0.42, 0, 1, 1);
}
.fm-slide-down-leave-from {
  transform: translateY(0);
}
.fm-slide-down-leave-to {
  transform: translateY(100%);
}
</style>
