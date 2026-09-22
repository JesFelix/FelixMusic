<template>
  <!-- ============================================================
   FeaturedPlaylists — 精选歌单
   标题栏 + 单行卡片（最多 6 列，支持响应式）
   ============================================================ -->
  <section class="featured-section">
    <div class="section-header">
      <h2 class="section-title">精选歌单</h2>
      <a class="section-view-all" href="javascript:;">
        查看全部 <icon-right size="14" />
      </a>
    </div>

    <div class="playlist-grid">
      <div v-for="pl in playlists" :key="pl.title" class="playlist-card">
        <!-- 封面 -->
        <div class="pl-cover">
          <img :src="pl.cover" alt="歌单封面" />
          <span class="pl-play-count">
            <icon-play-arrow-fill size="12" />
            {{ pl.playCount }}
          </span>
          <div class="pl-cover-play">
            <a-button shape="circle" size="medium">
              <template #icon><icon-play-arrow-fill size="20" /></template>
            </a-button>
          </div>
        </div>
        <!-- 歌单信息 -->
        <span class="pl-title">{{ pl.title }}</span>
        <span class="pl-subtitle">{{ pl.subtitle }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup name="FeaturedPlaylists">
/**
 * FeaturedPlaylists — 精选歌单组件
 *
 * Props:
 *   playlists — 歌单数据数组
 */
export interface PlaylistItem {
  title: string
  subtitle: string
  playCount: string
  gradient: string
  cover: string
}

defineProps<{
  playlists: PlaylistItem[]
}>()
</script>

<style lang="scss" scoped>
.featured-section {
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-md);
  /* 16px */
}

// ============================================================================
// 标题栏
// ============================================================================
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.section-title {
  font-size: var(--fm-base-font-size-xl);
  /* 18px */
  font-weight: var(--fm-base-font-weight-bold);
  color: var(--fm-base-color-text-primary);
  margin: 0;
}

.section-view-all {
  font-size: var(--fm-base-font-size-base);
  /* 14px */
  color: var(--fm-base-color-text-tertiary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: color 0.2s;

  &:hover {
    color: var(--fm-base-color-semantic-primary);
  }
}

// ============================================================================
// 歌单卡片 — flex nowrap 强制单行
// ============================================================================
.playlist-grid {
  display: flex;
  flex-wrap: nowrap;
  /* 核心：禁止换行，保证只有一行 */
  gap: var(--fm-base-spacing-md);
  overflow: hidden;
  /* 超出容器宽度的卡片直接裁掉 */
}

.playlist-card {
  flex: 0 0 calc((100% - 5 * var(--fm-base-spacing-md)) / 6);
  /* 6 列等宽 */
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-xs);
  /* 4px */
  cursor: pointer;
  min-width: 0;
  /* 防止 flex 子元素撑破容器 */
}

// ============================================================================
// 封面
// ============================================================================
.pl-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--fm-base-radius-md);
  /* 8px */
  overflow: hidden;

  &:hover {
    .pl-cover-play {
      opacity: 1;
      visibility: visible;
    }

    img {
      filter: brightness(0.6);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
    transition: filter 0.25s ease;
  }
}

/* 播放量角标 */
.pl-play-count {
  position: absolute;
  bottom: 6px;
  left: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.45);
  padding: 2px 8px;
  border-radius: var(--fm-base-radius-full);
  line-height: 1.4;
}

/* hover 时出现的居中播放按钮 */
.pl-cover-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;
}

// ============================================================================
// 歌单信息
// ============================================================================
.pl-title {
  font-size: var(--fm-base-font-size-base);
  /* 14px */
  font-weight: var(--fm-base-font-weight-semibold);
  color: var(--fm-base-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
}

.pl-subtitle {
  font-size: var(--fm-base-font-size-xs);
  /* 12px */
  color: var(--fm-base-color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
}

// ============================================================================
// 响应式 — 不同宽度下卡片列数不同
// ============================================================================
@media (max-width: 1400px) {
  .playlist-card {
    flex: 0 0 calc((100% - 4 * var(--fm-base-spacing-md)) / 5);
    /* 5 列 */
  }
}

@media (max-width: 1100px) {
  .playlist-card {
    flex: 0 0 calc((100% - 3 * var(--fm-base-spacing-md)) / 4);
    /* 4 列 */
  }
}

@media (max-width: 768px) {
  .playlist-card {
    flex: 0 0 calc((100% - 2 * var(--fm-base-spacing-md)) / 3);
    /* 3 列 */
  }
}
</style>
