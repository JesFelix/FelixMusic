<template>
  <!-- ============================================================
   QuickAccess — 快捷入口卡片（4 列网格）
   每日推荐 / 私人FM / 新歌速递 / 歌单广场
   ============================================================ -->
  <div class="quick-access">
    <div v-for="card in cards" :key="card.title" class="qa-card">
      <!-- 图标区域（圆角方形 + 彩色背景） -->
      <div class="qa-icon-box" :style="{ background: card.iconBg }">
        <img v-if="card.icon" :src="card.icon" class="qa-icon-img" alt="图标" />
        <span v-else class="qa-icon-text">{{ card.iconText }}</span>
      </div>
      <!-- 文字区域 -->
      <div class="qa-text">
        <span class="qa-title">{{ card.title }}</span>
        <span class="qa-subtitle">{{ card.subtitle }}</span>
      </div>
      <!-- 播放按钮 -->
      <a-button class="qa-play-btn" shape="circle" size="small" @click.stop>
        <template #icon><icon-play-arrow-fill size="16" /></template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="QuickAccess">
/**
 * QuickAccess — 精选页快捷入口卡片组件
 *
 * Props:
 *   cards — 快捷入口数据数组
 */
export interface QuickAccessCard {
  title: string
  subtitle: string
  icon?: string     // 图标图片 URL（编译时 import 解析后的地址）
  iconText?: string // 文字图标（无图片时回退）
  iconBg?: string    // 图标背景色
}

defineProps<{
  cards: QuickAccessCard[]
}>()
</script>

<style lang="scss" scoped>
.quick-access {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--fm-base-spacing-md);
  /* 16px */
  // color: #fceaef;
}

.qa-card {
  display: flex;
  align-items: center;
  gap: var(--fm-base-spacing-sm);
  /* 8px */
  padding: var(--fm-base-spacing-md);
  border-radius: var(--fm-base-radius-lg);
  /* 12px */
  background: var(--fm-base-color-background-surface);
  border: 1px solid var(--fm-base-color-border-subtle);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--fm-base-shadow-md);

    .qa-play-btn {
      opacity: 1;
      transform: scale(1);
    }
  }
}

/* 图标色块 */
.qa-icon-box {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: var(--fm-base-radius-md);
  /* 8px */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .qa-icon-text {
    font-size: 20px;
    line-height: 1;
  }

  /* 图标图片 */
  .qa-icon-img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }
}

/* 文字 */
.qa-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: start;
  /* 防止长文本撑破 flex 容器 */

  .qa-title {
    font-size: var(--fm-base-font-size-base);
    /* 14px */
    font-weight: var(--fm-base-font-weight-semibold);
    color: var(--fm-base-color-text-primary);
    white-space: nowrap;
  }

  .qa-subtitle {
    font-size: var(--fm-base-font-size-xs);
    /* 12px */
    color: var(--fm-base-color-text-tertiary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 圆形播放按钮 */
.qa-play-btn {
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
  background: #6C5CE7 !important;
  border-color: #6C5CE7 !important;
  color: #ffffff !important;

  &:hover {
    background: #7B61FF !important;
    border-color: #7B61FF !important;
  }
}

@media (max-width: 1100px) {
  .quick-access {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .quick-access {
    grid-template-columns: 1fr;
  }
}
</style>
