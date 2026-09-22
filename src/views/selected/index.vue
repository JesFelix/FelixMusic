<template>
  <div class="selected-page default-page-format">
    <!-- ====== 轮播横幅 ====== -->
    <HeroBanner :images="images" />

    <!-- ====== 快捷入口卡片 ====== -->
    <QuickAccess :cards="quickAccessCards" />

    <!-- ====== 精选歌单 ====== -->
    <FeaturedPlaylists :playlists="featuredPlaylists" />

    <!-- ====== 热门歌手 ====== -->
    <HotArtists :artists="artists" />
  </div>
</template>

<script lang="ts" setup name="Selected">
import { ref } from 'vue'

import banner1 from '@/assets/images/selected/banner1.png'
import banner2 from '@/assets/images/selected/banner2.png'
import banner3 from '@/assets/images/selected/banner3.png'

import qaIcon1 from '@/assets/images/selected/QuickAccess1.png'
import qaIcon2 from '@/assets/images/selected/QuickAccess2.png'
import qaIcon3 from '@/assets/images/selected/QuickAccess3.png'
import qaIcon4 from '@/assets/images/selected/QuickAccess4.png'

import playlistList1 from '@/assets/images/selected/playlist/list1.png'
import playlistList2 from '@/assets/images/selected/playlist/list2.png' 
import playlistList3 from '@/assets/images/selected/playlist/list3.png' 
import playlistList4 from '@/assets/images/selected/playlist/list4.png' 
import playlistList5 from '@/assets/images/selected/playlist/list5.png' 
import playlistList6 from '@/assets/images/selected/playlist/list6.png' 
import playlistList7 from '@/assets/images/selected/playlist/list7.png' 

import HeroBanner from './models/HeroBanner.vue'
import QuickAccess from './models/QuickAccess.vue'
import type { QuickAccessCard } from './models/QuickAccess.vue'
import FeaturedPlaylists from './models/FeaturedPlaylists.vue'
import type { PlaylistItem } from './models/FeaturedPlaylists.vue'
import HotArtists from './models/HotArtists.vue'
import type { ArtistItem } from './models/HotArtists.vue'

// ============================================================================
// 轮播图数据
// ============================================================================
const images = ref([banner1, banner2, banner3])

// ============================================================================
// 快捷入口卡片数据
// ============================================================================
const quickAccessCards: QuickAccessCard[] = [
  {
    title: '每日推荐',
    subtitle: '根据你的口味生成',
    icon: qaIcon1,
    iconBg: '#e9e3fc',
  },
  {
    title: '私人FM',
    subtitle: '专属你的音乐电台',
    icon: qaIcon2,
    iconBg: '#fceaef',
  },
  {
    title: '新歌速递',
    subtitle: '最新音乐抢先听',
    icon: qaIcon3,
    iconBg: '#e3effd',
  },
  {
    title: '歌单广场',
    subtitle: '发现更多好歌单',
    icon: qaIcon4,
    iconBg: '#e1f6ec',
  },
]

// ============================================================================
// 热门歌手数据
// ============================================================================
const artists: ArtistItem[] = [
  { id: 1, name: '周杰伦', description: '华语乐坛天王' },
  { id: 2, name: '邓紫棋', description: '实力唱将' },
  { id: 3, name: '林俊杰', description: '行走的 CD' },
  { id: 4, name: 'Taylor Swift', description: '欧美流行天后' },
  { id: 5, name: '陈奕迅', description: '歌神' },
  { id: 6, name: '华晨宇', description: '新生代唱作人' },
  { id: 7, name: '薛之谦', description: '情歌王子' },
  { id: 8, name: '张杰', description: '实力唱将' },
]

// ============================================================================
// 精选歌单数据
// ============================================================================
const featuredPlaylists: PlaylistItem[] = [
  {
    title: '日落时分',
    subtitle: '适合傍晚时分的温暖旋律',
    playCount: '125.6万',
    gradient: 'linear-gradient(135deg, #F9739F, #FBBF24, #F87171)',
    cover: playlistList1,
  },
  {
    title: '深夜放松',
    subtitle: '静谧夜色中的温柔低语',
    playCount: '98.3万',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A78BFA)',
    cover: playlistList2,
  },
  {
    title: '学习专注',
    subtitle: '静谧夜色中的温柔低语',
    playCount: '76.2万',
    gradient: 'linear-gradient(135deg, #38BDF8, #0EA5E9, #0284C7)',
    cover: playlistList3,
  },
  {
    title: '怀旧金曲',
    subtitle: '经典旋律唤醒美好回忆',
    playCount: '62.8万',
    gradient: 'linear-gradient(135deg, #D4A574, #C9965A, #B8863E)',
    cover: playlistList4,
  },
  {
    title: '欧美流行',
    subtitle: '全球榜单热门歌曲精选',
    playCount: '53.4万',
    gradient: 'linear-gradient(135deg, #F472B6, #E04090, #C02670)',
    cover: playlistList5,
  },
  {
    title: 'ACG精选',
    subtitle: '二次元神曲一网打尽',
    playCount: '47.1万',
    gradient: 'linear-gradient(135deg, #34D399, #10B981, #059669)',
    cover: playlistList6,
  },
  {
    title: 'ACG精选',
    subtitle: '二次元神曲一网打尽',
    playCount: '47.1万',
    gradient: 'linear-gradient(135deg, #34D399, #10B981, #059669)',
    cover: playlistList7,
  }
]
</script>

<style lang="scss" scoped>
.selected-page {
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-lg); /* 各区块间距 24px */
}
</style>
