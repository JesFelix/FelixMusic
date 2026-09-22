<template>
  <!-- ============================================================
   HotArtists — 热门歌手
   标题栏 + 单行横向滚动的歌手卡片（支持鼠标滚轮 + 惯性）
   ============================================================ -->
  <section class="hot-artists-section">
    <div class="section-header">
      <div class="section-title-wrapper">
        <h2 class="section-title">
          热门歌手
        </h2>
      </div>
      <a class="section-more" href="javascript:;">
        查看更多 <icon-right size="14" />
      </a>
    </div>

    <!-- 歌手卡片列表（横向滚动） -->
    <div ref="artistGridRef" class="artist-grid" @wheel="onWheel">
      <div
        v-for="artist in artists"
        :key="artist.id"
        class="artist-card"
        @click="$emit('select', artist)"
      >
        <!-- 圆形头像：渐变背景 + 名字首字 -->
        <div class="artist-avatar" :style="{ background: artist.avatarBg || defaultGradient(artist.id) }">
          <img v-if="artist.avatar" :src="artist.avatar" class="avatar-img" alt="" />
          <span v-else class="avatar-text">{{ artist.name.charAt(0) }}</span>
        </div>
        <div class="artist-info">
          <span class="artist-name">{{ artist.name }}</span>
          <span class="artist-desc">{{ artist.description }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup name="HotArtists">
/**
 * HotArtists — 热门歌手组件
 *
 * Props:
 *   artists — 歌手数据数组
 *
 * Events:
 *   select — 点击歌手卡片时触发，参数为 Artist 对象
 */
import { ref } from 'vue'

// ============================================================================
// 类型
// ============================================================================
export interface ArtistItem {
  id: string | number
  name: string
  description: string
  avatar?: string      // 头像图片 URL（可选，无则显示首字）
  avatarBg?: string    // 头像渐变背景（可选，无则自动生成）
}

defineProps<{
  artists: ArtistItem[]
}>()

defineEmits<{
  select: [artist: ArtistItem]
}>()

// ============================================================================
// 头像渐变色预设
// ============================================================================
const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #7B61FF, #A78BFA)',
  'linear-gradient(135deg, #F9739F, #FB8EB4)',
  'linear-gradient(135deg, #4285F4, #609AFF)',
  'linear-gradient(135deg, #22C55E, #4ADE80)',
  'linear-gradient(135deg, #F76C35, #FB923C)',
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #EC4899, #F472B6)',
  'linear-gradient(135deg, #14B8A6, #2DD4BF)',
]

function defaultGradient(id: string | number): string {
  const idx = typeof id === 'number' ? id : id.charCodeAt(0)
  return GRADIENT_PRESETS[idx % GRADIENT_PRESETS.length]
}

// ============================================================================
// 鼠标滚轮横向滚动（带缓动惯性）
// ============================================================================
const artistGridRef = ref<HTMLElement | null>(null)

let scrollTarget = 0
let scrollCurrent = 0
let rafId = 0

const onWheel = (e: WheelEvent) => {
  if (!artistGridRef.value) return
  e.preventDefault()

  const el = artistGridRef.value
  const maxLeft = el.scrollWidth - el.clientWidth
  scrollTarget = Math.max(0, Math.min(maxLeft, scrollTarget + e.deltaY))

  if (!rafId) {
    rafId = requestAnimationFrame(animateScroll)
  }
}

const animateScroll = () => {
  const el = artistGridRef.value
  if (!el) {
    rafId = 0
    return
  }

  scrollCurrent += (scrollTarget - scrollCurrent) * 0.3
  el.scrollLeft = scrollCurrent

  if (Math.abs(scrollTarget - scrollCurrent) > 0.5) {
    rafId = requestAnimationFrame(animateScroll)
  } else {
    el.scrollLeft = scrollTarget
    rafId = 0
  }
}
</script>

<style lang="scss" scoped>
.hot-artists-section {
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-md); /* 16px */
}

// ============================================================================
// 标题栏
// ============================================================================
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.section-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: var(--fm-base-font-size-xl); /* 18px */
  font-weight: var(--fm-base-font-weight-bold);
  color: var(--fm-base-color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: none;
  border-radius: var(--fm-base-radius-full);
  background: transparent;
  color: var(--fm-base-color-text-tertiary);
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    color: var(--fm-base-color-semantic-primary);
    background: var(--fm-base-color-background-hover);
  }
}

// ============================================================================
// 歌手卡片列表 — 横向滚动 + 隐藏滚动条
// ============================================================================
.artist-grid {
  display: flex;
  gap: var(--fm-base-spacing-md); /* 16px */
  overflow-x: auto;
  padding-bottom: 4px; /* 给 hover 阴影留空间 */

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.artist-card {
  flex: 0 0 160px;               /* 固定宽度 160px */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 22px 16px 18px;
  border-radius: 14px;
  background: var(--fm-base-color-background-surface);
  border: 1px solid var(--fm-base-color-border-subtle);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--fm-base-color-background-elevated);
    transform: translateY(-4px);
    box-shadow: var(--fm-base-shadow-md);
  }
}

// ============================================================================
// 头像
// ============================================================================
.artist-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  font-size: 32px;
  font-weight: var(--fm-base-font-weight-bold);
  color: #ffffff;
  user-select: none;
}

// ============================================================================
// 歌手信息
// ============================================================================
.artist-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.artist-name {
  font-size: var(--fm-base-font-size-base); /* 14px */
  font-weight: var(--fm-base-font-weight-semibold);
  color: var(--fm-base-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist-desc {
  font-size: var(--fm-base-font-size-xs); /* 12px */
  color: var(--fm-base-color-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
