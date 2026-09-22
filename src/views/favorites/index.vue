<template>
  <div class="favorites-page default-page-format">
    <!-- 页面头部：标题 + 副标题 + 播放全部按钮 + 搜索 -->
    <PageHeader v-model="searchKeyword" />

    <!-- ================================================================
         内容区域 — 按 activeTab 切换
         ================================================================ -->
    <!-- 收藏歌曲 -->
    <div class="lova-song">
      <SongList :songs="favoriteSongs" :playing-id="playingId" @play="playSong" @remove="removeFavorite" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Favorites">
/**
 * Favorites — "我喜欢的"页面
 *
 * 包含四个标签页：
 *   歌曲 → SongList    专辑 → AlbumGrid
 *   歌单 → PlaylistGrid  歌手 → ArtistGrid
 *
 * 统计卡片可点击切换标签页。
 */
import { ref } from 'vue'

import PageHeader from './models/PageHeader.vue'
import SongList, { SongItem } from './models/SongList.vue'

// ============================================================================
// 搜索
// ============================================================================

/** 搜索关键词 */
const searchKeyword = ref('')

/** 当前播放中的歌曲 ID（用于高亮播放状态） */
const playingId = ref<string | null>(null)

// ============================================================================
// 收藏歌曲数据
// ============================================================================
const favoriteSongs = ref<SongItem[]>([
  {
    id: '1',
    name: '夜空中最亮的星',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '逃跑计划',
    duration: '4:02',
    favoriteDate: '2024-01-15',
    isFavorite: true
  },
  {
    id: '2',
    name: '平凡之路',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '朴树',
    duration: '5:18',
    favoriteDate: '2024-01-14',
    isFavorite: true
  },
  {
    id: '3',
    name: '起风了',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '买辣椒也用券',
    duration: '5:25',
    favoriteDate: '2024-01-13',
    isFavorite: true
  },
  {
    id: '4',
    name: '少年',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '梦然',
    duration: '3:48',
    favoriteDate: '2024-01-12',
    isFavorite: true
  },
  {
    id: '5',
    name: '孤勇者',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '陈奕迅',
    duration: '4:16',
    favoriteDate: '2024-01-11',
    isFavorite: true
  },
  {
    id: '6',
    name: '乌梅子酱',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '李荣浩',
    duration: '3:52',
    favoriteDate: '2024-01-10',
    isFavorite: true
  },
  {
    id: '7',
    name: '十年',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '陈奕迅',
    duration: '4:05',
    favoriteDate: '2024-01-09',
    isFavorite: true
  },
  {
    id: '8',
    name: '后来',
    cover: 'https://img4.kuwo.cn/star/albumcover/500/15/82/150990423.jpg',
    artist: '刘若英',
    duration: '5:32',
    favoriteDate: '2024-01-08',
    isFavorite: true
  },
])

/** 播放指定歌曲 */
const playSong = (song: SongItem): void => {
  playingId.value = song.id
  // TODO: 实现播放逻辑
  console.log('Play song:', song)
}

/** 取消收藏歌曲 */
const removeFavorite = (song: SongItem): void => {
  const index = favoriteSongs.value.findIndex(s => s.id === song.id)
  if (index !== -1) {
    favoriteSongs.value.splice(index, 1)
  }
}


</script>

<style lang="scss" scoped>
.favorites-page {
  display: flex;
  flex-direction: column;
}

.lova-song {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

</style>
