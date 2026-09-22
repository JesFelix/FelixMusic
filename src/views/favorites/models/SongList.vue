<template>
    <div class="song-container">
        <!-- 列表头 -->
        <a-row class="song-title" align="center" justify="center">
            <a-col v-for="item in listHeader" :key="item.id" :flex="item.width" :style="item.colHeaderStyle">
                <div>{{ item.title }}</div>
            </a-col>
        </a-row>

        <!-- 列表内容 -->
        <div class="song-list">
            <a-row class="song-list-item" align="center" justify="center" v-for="song, index in songs" :key="song.id">
                <a-col :flex="listHeaderStatus('index')?.width" :style="listHeaderStatus('index')?.colBodyStyle">
                    <div class="index-cell">
                        <span class="index-num">{{ index < 10 ? '0' + (index + 1) : index + 1 }}</span>
                                <fm-icon class="index-icon" name="fm-play" size="18"
                                    color="var(--fm-base-color-gray-400)" hover-color="var(--fm-base-color-gray-500)" />
                    </div>
                </a-col>
                <a-col :flex="listHeaderStatus('title')?.width" :style="listHeaderStatus('title')?.colBodyStyle">
                    <a-space class="song-list-title" align="center">
                        <img :src="song.cover" alt="歌曲封面">
                        <a-space direction="vertical" class="song-info" :size="6">
                            <span class="song-name">{{ song.name }}</span>
                            <span class="song-artist">{{ song.artist }}</span>
                        </a-space>
                    </a-space>
                </a-col>
                <a-col :flex="listHeaderStatus('operation')?.width"
                    :style="listHeaderStatus('operation')?.colBodyStyle">
                    <div>操作</div>
                </a-col>
                <a-col :flex="listHeaderStatus('favorite')?.width" :style="listHeaderStatus('favorite')?.colBodyStyle">
                    <a-button shape="circle" class="favorite-btn" @click="likeSwitch(song)">
                        <template #icon>
                            <fm-icon v-if="song.isFavorite" color="red" name="player/fm-college" size="22" />
                            <fm-icon v-else color="var(--fm-base-color-gray-500)"
                                hoverColor="var(--fm-base-color-gray-750)" name="player/fm-no-college" size="22" />
                        </template>
                    </a-button>
                </a-col>
                <a-col :flex="listHeaderStatus('duration')?.width" :style="listHeaderStatus('duration')?.colBodyStyle">
                    <div>{{ song.duration }}</div>
                </a-col>
            </a-row>
        </div>

    </div>
</template>

<script lang="ts" setup name="SongList2">
import { CSSProperties, reactive } from 'vue'

export interface SongItem {
    id: string              // 歌曲 ID
    name: string            // 歌曲标题
    cover: string           // 歌曲封面 URL   
    artist: string          // 歌曲歌手
    duration: string        // 歌曲时长
    favoriteDate: string    // 收藏日期
    isFavorite: boolean     // 是否收藏歌曲
}

interface ListHeader {
    id: number
    index: string
    title: string
    width: string
    colHeaderStyle?: CSSProperties
    colBodyStyle?: CSSProperties
}

defineProps<{
    songs: SongItem[]
    playingId?: string | null
}>()

defineEmits<{
    play: [song: SongItem]
    remove: [song: SongItem]
}>()

const listHeader = reactive<ListHeader[]>([
    {
        id: 1,
        index: 'index',
        title: '#',
        width: '60px'
    },
    {
        id: 2,
        index: 'title',
        title: '标题',
        width: '350px',
        colHeaderStyle: {
            textAlign: 'start'
        },
        colBodyStyle: {
            textAlign: 'start'
        }
    },
    {
        id: 3,
        index: 'operation',
        title: '操作',
        width: 'auto'
    },
    {
        id: 4,
        index: 'favorite',
        title: '喜欢',
        width: '100px'
    },
    {
        id: 5,
        index: 'duration',
        title: '时长',
        width: '100px'
    }
])

const listHeaderStatus = (index: string) => {
    return listHeader.find(item => item.index === index)
}

const likeSwitch = (song: SongItem) => {
    song.isFavorite = !song.isFavorite
}

</script>

<style lang="scss" scoped>
.song-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: var(--fm-base-font-size-sm);
    color: var(--fm-base-color-gray-550);
}

// =============================================================
// 列表头
// =============================================================
.song-title {
    width: 100%;
    flex-shrink: 0;
    user-select: none;
    padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-6);
    font-size: var(--fm-base-font-size-base);
    border-bottom: 1px solid var(--fm-base-color-gray-300);
    margin-bottom: var(--fm-base-spacing-xs);
}

// =============================================================
// 列表内容
// =============================================================
.song-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    width: 100%;
    user-select: none;

    &::-webkit-scrollbar {
        display: none;
    }


    .song-list-item {
        border-radius: var(--fm-base-radius-6);
        padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-6);

        .index-cell {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;

            .index-num {
                // 默认可见
                visibility: visible;
                user-select: none;
            }

            .index-icon {
                user-select: none;
                cursor: pointer;
                position: absolute;
                visibility: hidden;
            }

        }

        .song-list-title {
            img {
                width: 40px;
                aspect-ratio: 1 / 1;
                border-radius: var(--fm-base-radius-sm);
            }

            .song-info {
                width: 100%;

                .song-name {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    line-clamp: 1;
                    -webkit-line-clamp: 1;

                    font-size: var(--fm-base-font-size-base);
                    color: var(--fm-base-color-gray-800);
                    font-weight: bold;
                }

                .song-artist {
                    font-size: var(--fm-base-font-size-xs);
                    color: var(--fm-base-color-gray-550);
                    font-weight: normal;
                }
            }
        }

        .favorite-btn{
            background-color: transparent;
        }

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

    }

}
</style>