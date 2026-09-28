<template>
  <div class="collection-page default-page-format">
    <!-- 页面头部：图标 + 标题 + 副标题 + 新建收藏按钮 + 搜索 -->
    <PageHeader v-model="searchKeyword" />

    <a-grid :cols="{ lg: 2, xl: 3, xxl: 4 }" :colGap="12" :rowGap="16" class="collection-list">
      <a-grid-item
        class="collection-list-item"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <a-space class="item-info" align="end">
          <span class="item-title">华语经典</span> 
          <span class="item-meta">100首</span>
        </a-space>
        <div class="item-content">
          <div class="item-desc">
            <span class="item-desc-text">那些年陪伴我们的经典旋律</span>
          </div>
          <div class="item-play" :class="playAnimClass">
            <fm-icon name="fm-play" size="28" />
          </div>
        </div>
      </a-grid-item>
    </a-grid>


  </div>
</template>

<script lang="ts" setup name="Collection">
/**
 * Collection — "我的收藏"页面
 *
 * 用户可以创建多个收藏夹，每个收藏夹中包含对应的音乐。
 * 当前版本完成页面样式编写，后续接入后端数据。
 *
 * 页面结构：
 *   页面头部  → 图标 + 标题 + 统计 + 操作按钮 + 搜索
 *   卡片网格  → 收藏卡片 + 新建入口卡片
 *   空状态    → 无收藏时的引导提示
 *   新建弹窗  → 创建收藏夹的表单
 */
import { computed, ref } from 'vue'

import PageHeader from './models/PageHeader.vue'
// ============================================================================
// 搜索
// ============================================================================

/** 搜索关键词 */
const searchKeyword = ref('')

// ============================================================================
// 卡片悬停动画（.item-desc / .item-play 的进入与移出）
// ============================================================================

/** 卡片是否处于悬停状态 */
const hovered = ref(false)

/** 是否已发生过一次悬停（避免初次渲染时播放移出动画造成闪屏） */
const hasHovered = ref(false)

/** 鼠标进入卡片：触发进入动画 */
const handleMouseEnter = (): void => {
  hasHovered.value = true
  hovered.value = true
}

/** 鼠标离开卡片：触发移出动画 */
const handleMouseLeave = (): void => {
  hovered.value = false
}

/** .item-play 的动画类：进入 fadeInRight，移出 fadeOutRight */
const playAnimClass = computed(() => {
  if (hovered.value) return 'animate__animated animate__fadeInRight'
  return hasHovered.value ? 'animate__animated animate__fadeOutRight' : ''
})

</script>

<style lang="scss" scoped>
.collection-page {
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}

.collection-list {

  .collection-list-item {
    // 主题表面：品牌色渐变点缀 + 表面色，自动适配亮/暗主题
    background: linear-gradient(
      165deg,
      var(--fm-base-color-brand-350) 0%,
      var(--fm-base-color-brand-150) 40%,
      transparent 60%,
      transparent 100%
    );
    height: 100px;
    border: 1px solid var(--fm-base-color-border-default);
    border-radius: var(--fm-base-radius-10);
    padding: var(--fm-base-spacing-10);
    padding-top: var(--fm-base-spacing-18);
    display: flex;
    flex-direction: column;
    text-align: start;
    user-select: none;
    cursor: pointer;
    overflow: hidden;
    box-shadow: var(--fm-base-shadow-sm);
    transition: transform var(--fm-base-transition-fast), box-shadow var(--fm-base-transition-fast),
      border-color var(--fm-base-transition-fast);

    // 悬停：轻微上浮 + 阴影加深 + 品牌色描边
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--fm-base-shadow-lg);
    }

    .item-info {
      .item-title {
        font-weight: var(--fm-base-font-weight-bold);
        font-size: var(--fm-base-font-size-xl);
        color: var(--fm-base-color-text-primary);
      }

      .item-meta {
        font-size: var(--fm-base-font-size-sm);
        color: var(--fm-base-color-text-tertiary);
      }
    }

    .item-content {
      flex: 1; // 占满 .item-title 之外剩余的垂直空间
      display: flex; // 横向布局（替代 a-row）
      align-items: stretch; // 交叉轴拉伸，让子项占满高度
      gap: var(--fm-base-spacing-10); // 两栏间距

      .item-desc {
        flex: 3; // 与 .item-play 按 3:1 分配剩余宽度（≈75% : 25%）
        display: flex;
        flex-direction: column; // 纵向排列
        justify-content: center; // 内容垂直居中
        color: var(--fm-base-color-text-secondary);
        font-size: var(--fm-base-font-size-base);
        // opacity: 0; // 默认隐藏，悬停时通过动画进入

        .item-desc-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; // 最多两行
          line-clamp: 2;
          overflow: hidden; // 超出显示省略号
        }
      }

      .item-play {
        flex: 1; // 占剩余宽度的 1/4
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--fm-base-color-brand-500); // 播放图标使用品牌色
        opacity: 0; // 默认隐藏，悬停时通过动画进入
      }
    }
  }

}
</style>
