<template>
    <div class="local-music-page default-page-format">
        <LocalMusicHeader
            v-model:searchKeyword="searchKeyword"
            :song-count="localSongs.length"
            @play-all="handlePlayAll"
            @refresh="handleRefresh"
            @batch-operation="handleBatchOperation"
            @add-folder="handleAddFolder"
        />

        <div class="custom-tabs">
            <div class="custom-tab" :class="{ 'custom-tab--active': activeTab === 'all' }" @click="switchTab('all')">全部
            </div>
            <div class="dividing-line"></div>
            <div class="custom-tab" :class="{ 'custom-tab--active': activeTab === 'folder' }"
                @click="switchTab('folder')">文件夹
            </div>
        </div>
        <div class="tab-content">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts" setup name="LocalMusic">
import { computed, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LocalMusicHeader from './models/LocalMusicHeader.vue';

/** 本地歌曲条目 */
export interface LocalSong {
    id: string
    name: string       // 歌曲名
    artist: string     // 歌手名
    album: string      // 专辑名
    duration: string   // 时长（格式 mm:ss）
    size: string       // 文件大小
    path: string       // 本地文件路径
}

// ============================================================================
// 搜索 & 排序（由 PageHeader 通过 v-model 双向绑定）
// ============================================================================
const searchKeyword = ref('')

const route = useRoute()
const router = useRouter()

/** 当前激活的 tab（由路由决定） */
const activeTab = computed<'all' | 'folder'>(() =>
    route.name === 'LocalMusicFolder' ? 'folder' : 'all'
)

/** 切换 tab → 路由导航 */
const switchTab = (tab: 'all' | 'folder') => {
    router.push({ name: tab === 'folder' ? 'LocalMusicFolder' : 'LocalMusicAll' })
}

// ============================================================================
// 播放状态
// ============================================================================
const playingId = ref<string | null>('4')

// ============================================================================
// 曲目数据（模拟数据，后续接入扫描模块）
// ============================================================================
const localSongs = ref<LocalSong[]>([
    { id: '1', name: '桃子花的思念 (环绕音)', artist: '尘辰', album: '环绕·夜色', duration: '05:04', size: '6.5M', path: '/music/01.mp3' },
    { id: '2', name: '十年人间', artist: '李常超', album: '盗墓笔记·十年人间', duration: '02:36', size: '10.6M', path: '/music/02.mp3' },
    { id: '3', name: '暮色回响', artist: '吉星出租', album: '暮色回响', duration: '04:18', size: '5.9M', path: '/music/03.mp3' },
    { id: '4', name: '烟雨行舟', artist: '伦桑', album: '烟雨行舟', duration: '04:25', size: '7.1M', path: '/music/04.mp3' },
    { id: '5', name: '桃花笑', artist: '乐正绫', album: '桃花笑', duration: '03:14', size: '5.4M', path: '/music/05.mp3' },
    { id: '6', name: '快乐女孩', artist: '单依纯', album: '快乐女孩', duration: '04:24', size: '6.5M', path: '/music/06.mp3' },
    { id: '7', name: '我想念', artist: 'Zealot / 周更深', album: '我想念', duration: '05:14', size: '3.9M', path: '/music/07.mp3' },
    { id: '8', name: '离别开出花', artist: '就是南方凯', album: '离别开出花', duration: '03:47', size: '4.5M', path: '/music/08.mp3' },
    { id: '9', name: '拜佛', artist: '文夫', album: '拜佛', duration: '02:55', size: '4.4M', path: '/music/09.mp3' },
    { id: '10', name: '戏子多秋', artist: '小曲儿', album: '戏子多秋', duration: '04:36', size: '6.1M', path: '/music/10.mp3' },
    { id: '11', name: '星月神话', artist: '金莎', album: '星月神话', duration: '04:02', size: '5.6M', path: '/music/11.mp3' },
])

// ============================================================================
// 计算属性
// ============================================================================
/** 按搜索关键词过滤后的歌曲列表 */
const filteredSongs = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    if (!keyword) return localSongs.value

    return localSongs.value.filter(
        (song) =>
            song.name.toLowerCase().includes(keyword) ||
            song.artist.toLowerCase().includes(keyword) ||
            song.album.toLowerCase().includes(keyword)
    )
})

// ============================================================================
// 事件处理 — 页面头部
// ============================================================================
const handlePlayAll = (): void => {
    if (filteredSongs.value.length > 0) {
        playingId.value = filteredSongs.value[0].id
    }
    console.log('播放全部')
}

const handleRefresh = (): void => {
    // TODO: 接入 Tauri 音频扫描模块重新扫描
    console.log('刷新本地列表')
}

const handleBatchOperation = (): void => {
    // TODO: 接入批量操作模式
    console.log('批量操作')
}

const handleAddFolder = (): void => {
    // TODO: 接入 Tauri 文件夹选择对话框
    console.log('添加文件夹')
}

/** 处理子组件发送的播放事件 */
const handlePlaySong = (song: LocalSong): void => {
    playingId.value = song.id
    console.log('播放歌曲:', song.name)
}

// ============================================================================
// 向子路由组件 provide 共享数据
// ============================================================================
provide('filteredSongs', filteredSongs)
provide('playingId', playingId)
provide('onPlaySong', handlePlaySong)

</script>

<style lang="scss" scoped>
.local-music-page {
    display: flex;
    flex-direction: column;
    user-select: none;
    overflow: hidden;
}

// ============================================================================
// 自定义 Tab 切换
// ============================================================================
.custom-tabs {
    display: flex;
    gap: var(--fm-base-spacing-14);
    margin-bottom: var(--fm-base-spacing-10);
}

.dividing-line {
    width: 1px;
    background-color: var(--fm-base-color-gray-300);
    align-self: stretch;
}

.custom-tab {
    position: relative;
    padding: var(--fm-base-spacing-xs) 0;
    font-size: var(--fm-base-font-size-base);
    font-weight: var(--fm-base-font-weight-medium);
    color: var(--fm-base-color-gray-500);
    background: none;
    border: none;
    cursor: pointer;
    transition: color var(--fm-base-transition-fast);

    &:hover {
        color: var(--fm-base-color-gray-700);
    }

    &--active {
        color: var(--fm-base-color-brand-500);
        font-weight: var(--fm-base-font-weight-bold);

        &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--fm-base-color-brand-500);
            border-radius: 1px;
        }

        &:hover {
            color: var(--fm-base-color-brand-500);
        }
    }
}

.tab-content {
    flex: 1;
    min-height: 0;
}

</style>
