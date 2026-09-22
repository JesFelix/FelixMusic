<template>
    <div class="all-song-container">
        <!-- ================================================================
             列表表头
             ================================================================ -->
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

        <!-- ================================================================
             列表内容 — 歌曲行
             ================================================================ -->
        <div class="song-list" v-if="songs.length > 0">
            <a-row class="song-item" :class="{ 'song-item--playing': song.id === playingId }" align="center"
                v-for="(song, index) in songs" :key="song.id" @dblclick="handlePlay(song)">
                <!-- 序号 — 默认显示数字，hover 时显示播放图标 -->
                <a-col :flex="'60px'">
                    <div class="index-cell">
                        <span class="index-num">{{ index < 9 ? '0' + (index + 1) : index + 1 }}</span>
                                <fm-icon class="index-icon" name="fm-play" size="18"
                                    color="var(--fm-base-color-gray-400)" hover-color="var(--fm-base-color-brand-500)"
                                    @click="handlePlay(song)" />
                    </div>
                </a-col>

                <!-- 标题 + 歌手 — 上下排列 -->
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

                <!-- 文件大小 -->
                <a-col :flex="'100px'">
                    <span class="cell-text">{{ song.size }}</span>
                </a-col>
            </a-row>
        </div>

        <!-- ================================================================
             空状态
             ================================================================ -->
        <div class="empty-state" v-else>
            <span>暂无本地音乐，请先扫描音乐文件夹</span>
        </div>
    </div>
</template>

<script lang="ts" setup name="AllSong">
/**
 * AllSong — "全部"标签页下的本地音乐列表
 *
 * 以表格形式展示所有本地扫描到的音乐文件，
 * 支持双击播放、hover 预览播放按钮等交互。
 *
 * Props:
 *   songs     — 本地歌曲列表
 *   playingId — 当前播放中的歌曲 ID（用于高亮）
 *
 * Emits:
 *   play — 点击播放某首歌曲
 */
import { inject, ref, type Ref } from 'vue'
import type { LocalSong } from '../index.vue'

// ============================================================================
// Inject（来自父路由组件的 provide）
// ============================================================================
const songs = inject<Ref<LocalSong[]>>('filteredSongs', ref([]))
const playingId = inject<Ref<string | null>>('playingId', ref(null))
const onPlaySong = inject<(song: LocalSong) => void>('onPlaySong', () => { })

// ============================================================================
// 事件处理
// ============================================================================

/** 点击播放图标触发播放 */
const handlePlay = (song: LocalSong): void => {
    onPlaySong(song)
}
</script>

<style lang="scss" scoped>
.all-song-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: var(--fm-base-font-size-sm);
    color: var(--fm-base-color-gray-550);
    user-select: none;
}

// ============================================================================
// 列表表头
// ============================================================================
.song-header {
    width: 100%;
    flex-shrink: 0;
    padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-6);
    padding-top: 0;
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

        // hover 时：隐藏序号，显示播放图标
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
// 空状态
// ============================================================================
.empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fm-base-color-gray-400);
    font-size: var(--fm-base-font-size-base);
}
</style>
