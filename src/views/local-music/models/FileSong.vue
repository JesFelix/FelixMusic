<template>
    <el-splitter class="file-song-container">
        <el-splitter-panel size="20%" min="20%">
            <div class="folder-panel">

                <div class="folder-list" v-if="folders.length > 0">
                    <div class="folder-item" :class="{ 'folder-item--active': selectedFolder === folder.path }"
                        v-for="folder in folders" :key="folder.path" @click="selectFolder(folder.path)">
                        <div class="folder-item-left">
                            <fm-icon name="fm-folder" size="18" :color="selectedFolder === folder.path
                                ? 'var(--fm-base-color-brand-500)'
                                : 'var(--fm-base-color-gray-500)'" />
                            <span class="folder-name" :title="folder.name">{{ folder.name }} ({{ folder.count }})</span>
                        </div>
                    </div>
                </div>

                <!-- 空状态 — 无文件夹 -->
                <div class="folder-empty" v-else>
                    <span>暂无文件夹</span>
                </div>
            </div>
        </el-splitter-panel>

        <el-splitter-panel size="80%" min="20%">
            <div class="song-panel">
                <!-- 表头 -->
                <a-row class="song-header" align="center">
                    <a-col :flex="'60px'">
                        <span class="header-text">#</span>
                    </a-col>
                    <a-col flex="auto">
                        <span class="header-text header-text--left">标题</span>
                    </a-col>
                    <a-col :flex="'160px'">
                        <span class="header-text">专辑</span>
                    </a-col>
                    <a-col :flex="'100px'">
                        <span class="header-text">时长</span>
                    </a-col>
                    <a-col :flex="'100px'">
                        <span class="header-text">大小</span>
                    </a-col>
                </a-row>

                <!-- 歌曲列表 -->
                <div class="song-list" v-if="filteredSongs.length > 0">
                    <a-row class="song-item" :class="{ 'song-item--playing': song.id === playingId }" align="center"
                        v-for="(song, index) in filteredSongs" :key="song.id" @dblclick="handlePlay(song)">
                        <!-- 序号 -->
                        <a-col :flex="'60px'">
                            <div class="index-cell">
                                <span class="index-num">{{ index < 9 ? '0' + (index + 1) : index + 1 }}</span>
                                        <fm-icon class="index-icon" name="fm-play" size="18"
                                            color="var(--fm-base-color-gray-400)"
                                            hover-color="var(--fm-base-color-brand-500)" @click="handlePlay(song)" />
                            </div>
                        </a-col>

                        <!-- 标题 + 歌手 -->
                        <a-col flex="auto">
                            <div class="song-title-cell">
                                <span class="song-name" :title="song.name">{{ song.name }}</span>
                                <span class="song-artist" :title="song.artist">{{ song.artist }}</span>
                            </div>
                        </a-col>

                        <!-- 专辑 -->
                        <a-col :flex="'160px'">
                            <span class="cell-text" :title="song.album">{{ song.album }}</span>
                        </a-col>

                        <!-- 时长 -->
                        <a-col :flex="'100px'">
                            <span class="cell-text">{{ song.duration }}</span>
                        </a-col>

                        <!-- 大小 -->
                        <a-col :flex="'100px'">
                            <span class="cell-text">{{ song.size }}</span>
                        </a-col>
                    </a-row>
                </div>

                <!-- 空状态 — 未选择文件夹 或 文件夹为空 -->
                <div class="song-empty" v-else>
                    <template v-if="selectedFolder === null">
                        <span>请选择左侧文件夹查看歌曲</span>
                    </template>
                    <template v-else>
                        <span>该文件夹下暂无音乐文件</span>
                    </template>
                </div>
            </div>
        </el-splitter-panel>
    </el-splitter>
</template>

<script lang="ts" setup name="FileSong">
/**
 * FileSong — "文件夹"标签页下的本地音乐浏览
 *
 * 左右分栏布局：
 *   左侧：按文件路径归类的文件夹树
 *   右侧：选中文件夹下的歌曲表格
 *
 * Props:
 *   songs     — 本地歌曲列表（来自父组件 unified search）
 *   playingId — 当前播放中的歌曲 ID
 *
 * Emits:
 *   play — 点击播放某首歌曲
 */
import { computed, inject, ref, watch, type Ref } from 'vue'
import type { LocalSong } from '../index.vue'

// ========== Element Plus 组件（仅需分栏）  ==========
import { ElSplitter, ElSplitterPanel } from 'element-plus'
import 'element-plus/es/components/splitter/style/css'
import 'element-plus/es/components/splitter-panel/style/css'

// ============================================================================
// Inject（来自父路由组件的 provide）
// ============================================================================
const songs = inject<Ref<LocalSong[]>>('filteredSongs', ref([]))
const playingId = inject<Ref<string | null>>('playingId', ref(null))
const onPlaySong = inject<(song: LocalSong) => void>('onPlaySong', () => { })

// ============================================================================
// 文件夹相关 — 从歌曲路径中提取目录结构
// ============================================================================

/** 文件夹信息 */
interface FolderInfo {
    /** 文件夹路径（用于筛选匹配） */
    path: string
    /** 显示名称（取路径最后一个目录名） */
    name: string
    /** 文件夹中的歌曲数量 */
    count: number
}

/** 当前选中的文件夹路径 */
const selectedFolder = ref<string | null>(null)

/**
 * 从歌曲列表中提取唯一文件夹
 *
 * 示例：
 *   歌曲路径 "/music/sub/01.mp3" → 目录 "/music/sub/"
 *   显示名称 "sub"、路径 "/music/sub/"
 */
const folders = computed<FolderInfo[]>(() => {
    const folderMap = new Map<string, { name: string; songs: LocalSong[] }>()

    for (const song of songs.value) {
        // 提取歌曲文件所在目录
        const dirPath = song.path.substring(0, song.path.lastIndexOf('/') + 1) || '/'

        if (!folderMap.has(dirPath)) {
            // 取路径最后一段作为显示名称（去掉末尾 / 再取）
            const segments = dirPath.replace(/\/+$/, '').split('/').filter(Boolean)
            const displayName = segments.length > 0 ? segments[segments.length - 1] : '根目录'

            folderMap.set(dirPath, { name: displayName, songs: [] })
        }

        folderMap.get(dirPath)!.songs.push(song)
    }

    // 转换为 FolderInfo 列表，按名称排序
    return Array.from(folderMap.entries())
        .map(([path, info]) => ({
            path,
            name: info.name,
            count: info.songs.length,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
})

/**
 * 根据选中的文件夹过滤歌曲
 *
 * 未选中任何文件夹时返回空数组（引导用户点击左侧）
 */
const filteredSongs = computed<LocalSong[]>(() => {
    if (selectedFolder.value === null) return []

    return songs.value.filter((song) => {
        const dirPath = song.path.substring(0, song.path.lastIndexOf('/') + 1) || '/'
        return dirPath === selectedFolder.value
    })
})

// ============================================================================
// 初始化 — 自动选中第一个文件夹
// ============================================================================
watch(
    folders,
    (list) => {
        // 当文件夹列表首次加载或变化时，自动选中第一个
        if (list.length > 0 && selectedFolder.value === null) {
            selectedFolder.value = list[0].path
        }
        // 如果当前选中的文件夹已不存在（数据刷新后），回退到第一个
        if (list.length > 0 && !list.find((f) => f.path === selectedFolder.value)) {
            selectedFolder.value = list[0].path
        }
    },
    { immediate: true }
)

// ============================================================================
// 事件处理
// ============================================================================

/** 选中左侧文件夹 */
const selectFolder = (folderPath: string): void => {
    selectedFolder.value = folderPath
}

/** 点击播放图标 / 双击歌曲行 */
const handlePlay = (song: LocalSong): void => {
    onPlaySong(song)
}
</script>

<style lang="scss" scoped>
.file-song-container {
    height: 100%;
    font-size: var(--fm-base-font-size-sm);
    color: var(--fm-base-color-gray-550);
    user-select: none;
}

// ============================================================================
// 左侧 — 文件夹面板
// ============================================================================
.folder-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--fm-base-spacing-xs) var(--fm-base-spacing-6) 0 0;
}

// 文件夹列表（可滚动）
.folder-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
    }
}

// 单个文件夹条目
.folder-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--fm-base-spacing-6) var(--fm-base-spacing-xs);
    border-radius: var(--fm-base-radius-sm);
    cursor: pointer;
    transition: background-color var(--fm-base-transition-fast);

    &:hover {
        background-color: var(--fm-base-color-gray-200);
    }

    // 选中态
    &--active {
        background-color: var(--fm-base-color-brand-100);

        .folder-name {
            color: var(--fm-base-color-brand-500);
            font-weight: var(--fm-base-font-weight-bold);
        }

        &:hover {
            background-color: var(--fm-base-color-brand-150);
        }
    }
}

.folder-item-left {
    display: flex;
    align-items: center;
    gap: var(--fm-base-spacing-2);
    min-width: 0;
    flex: 1;
}

.folder-name {
    font-size: var(--fm-base-font-size-sm);
    color: var(--fm-base-color-gray-700);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color var(--fm-base-transition-fast);
}

// 文件夹空状态
.folder-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fm-base-color-gray-400);
}

// ============================================================================
// 右侧 — 歌曲面板
// ============================================================================
.song-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: var(--fm-base-spacing-4);
}

// ============================================================================
// 列表表头
// ============================================================================
.song-header {
    width: 100%;
    flex-shrink: 0;
    padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-6);
    font-size: var(--fm-base-font-size-base);
    border-bottom: 1px solid var(--fm-base-color-gray-300);
    margin-bottom: var(--fm-base-spacing-xs);
}

.header-text {
    display: block;
    text-align: center;

    &--left {
        text-align: left;
    }
}

// ============================================================================
// 歌曲列表（可滚动区域）
// ============================================================================
.song-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    width: 100%;

    &::-webkit-scrollbar {
        display: none;
    }
}

// ============================================================================
// 单行歌曲
// ============================================================================
.song-item {
    border-radius: var(--fm-base-radius-6);
    padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-6);
    transition: background-color var(--fm-base-transition-fast);
    cursor: default;

    &:hover {
        background-color: var(--fm-base-color-gray-200);

        .index-cell {
            .index-num {
                visibility: hidden;
            }

            .index-icon {
                visibility: visible;
            }
        }
    }

    // 正在播放的高亮行
    &--playing {
        .song-name {
            color: var(--fm-base-color-brand-500);
        }
    }
}

// ============================================================================
// 序号单元格
// ============================================================================
.index-cell {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .index-num {
        visibility: visible;
    }

    .index-icon {
        position: absolute;
        visibility: hidden;
        cursor: pointer;
    }
}

// ============================================================================
// 标题区（歌名 + 歌手）
// ============================================================================
.song-title-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;

    .song-name {
        font-size: var(--fm-base-font-size-base);
        font-weight: var(--fm-base-font-weight-bold);
        color: var(--fm-base-color-gray-800);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
    }

    .song-artist {
        font-size: var(--fm-base-font-size-xs);
        color: var(--fm-base-color-gray-550);
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
    }
}

// ============================================================================
// 普通单元格文字
// ============================================================================
.cell-text {
    display: block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

// ============================================================================
// 右侧歌曲空状态
// ============================================================================
.song-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fm-base-color-gray-400);
    font-size: var(--fm-base-font-size-base);
}
</style>
