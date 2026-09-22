<template>
    <div class="player">
        <!-- 顶部全局进度条：按住鼠标左键拖拽即可调整进度 -->
        <div ref="progressBarRef" class="top-progress" @mousedown="onProgressMouseDown">
            <div class="top-progress-fill" :style="{ width: player.progressPercent + '%' }"></div>
            <!-- hover 时显示的时间标签 -->
            <span class="progress-time-tip">{{ player.formattedCurrentTime }} / {{ player.formattedDuration }}</span>
        </div>

        <!-- 左侧：当前播放信息 -->
        <a-space size="medium" class="player-left">
            <!-- 专辑封面占位 - 使用 Arco Avatar 组件 -->
            <a-avatar shape="square" :size="56" class="current-art" @click="openPlayer">
                <fm-icon name="player/fm-sound" color="var(--fm-base-color-brand-500)" className="art-icon" size="32" />
            </a-avatar>

            <!-- 歌曲信息 - 使用 Arco Typography 组件 -->
            <a-space align="start" class="current-info" size="mini" direction="vertical" fill>
                <div class="current-title">{{ player.currentSong.title }}</div>
                <div class="current-artist">{{ player.currentSong.artist }}</div>
            </a-space>

            <!-- 收藏按钮 - 使用 Arco Button 组件 -->
            <a-button class="favorite-btn" shape="circle" @click="player.toggleFavorite">
                <template #icon>
                    <fm-icon v-if="player.isFavorite" color="red" name="player/fm-college"
                        size="24" />
                    <fm-icon v-else color="var(--fm-base-color-gray-500)" hoverColor="var(--fm-base-color-gray-750)"
                        name="player/fm-no-college" size="24" />
                </template>
            </a-button>
        </a-space>

        <!-- 中间：播放控制 -->
        <a-space align="center" size="large" class="player-center" direction="horizontal">
            <!-- 播放模式切换 -->
            <div :title="player.currentPlayMode.name">
                <fm-icon className="player-tip" :name="player.currentPlayMode.icon" :size="23"
                    color="var(--fm-base-color-gray-500)" hoverColor="var(--fm-base-color-gray-750)"
                    @click="player.cyclePlayMode" />
            </div>
            <div title="上一首">
                <fm-icon name="player/fm-previous-song" color="var(--fm-base-color-gray-650)"
                    hoverColor="var(--fm-base-color-gray-950)" className="player-tip" size="24"
                    @click="player.playPrevious" />
            </div>
            <!-- 播放/暂停 -->
            <div class="play-btn" @click="player.togglePlay" :title="player.isPlaying ? '播放' : '暂停'">
                <fm-icon v-if="player.isPlaying" name="player/fm-play" className="play-icon player-tip" color="white"
                    size="24" />
                <fm-icon v-else name="player/fm-stop" className="player-tip" color="white" size="24" />
            </div>
            <div title="下一首">
                <fm-icon name="player/fm-next-one" size="24" color="var(--fm-base-color-gray-650)"
                    hoverColor="var(--fm-base-color-gray-900)" className="player-tip" @click="player.playNext" />
            </div>
            <div title="播放列表">
                <fm-icon name="player/fm-playlist" size="22" color="var(--fm-base-color-gray-500)"
                    hoverColor="var(--fm-base-color-gray-750)" className="player-tip" />
            </div>
        </a-space>

        <!-- 右侧：音量控制 -->
        <a-space align="end" size="large" class="player-right">
            <!-- 倍速切换 -->
            <div title="倍速切换">
                <fm-icon name="player/fm-speed-1-5" :size="28" color="var(--fm-base-color-gray-500)"
                    hoverColor="var(--fm-base-color-gray-750)" className="player-tip"
                    @click="player.cyclePlaybackRate" />
            </div>
            <!-- 歌词面板开关 -->
            <div title="桌面歌词">
                <fm-icon name="player/fm-lyrics" :size="22" className="player-tip" color="var(--fm-base-color-gray-500)"
                    hoverColor="var(--fm-base-color-gray-750)" @click="player.toggleLyrics" />
            </div>

            <!-- 音量 / 静音 -->
            <a-popover position="top"
                :content-style="{ padding: 'var(--fm-base-spacing-sm) var(--fm-base-spacing-xs)', 
                borderRadius: 'var(--fm-base-radius-md)' }">
                <div title="静音">
                    <fm-icon className="player-tip"
                        :name="player.effectiveVolume === 0 ? 'player/fm-mute' : 'player/fm-volume'"
                        color="var(--fm-base-color-gray-500)" hoverColor="var(--fm-base-color-gray-750)" :size="24"
                        @click="player.toggleMute" />
                </div>
                <template #content>
                    <div class="percentage">{{ Math.round(player.effectiveVolume * 100) }}%</div>
                    <a-slider class="volume-slider" :model-value="player.effectiveVolume" :min="0" :max="1" :step="0.01"
                        :show-tooltip="false" direction="vertical"
                        @change="(v: number | number[]) => player.setVolume(Array.isArray(v) ? v[0] : v)" />
                </template>
            </a-popover>

        </a-space>
    </div>
</template>

<script lang="ts" setup name="Player">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores'

const player = usePlayerStore()
const router = useRouter()

// ========== 收藏 & 导航 ==========

// 点击当前歌曲专辑封面 → 跳转到播放详情页（PlayLayout）
const openPlayer = () => {
    router.push('/play')
}

// ========== 播放进度（DOM 交互逻辑留在组件中） ==========
const progressBarRef = ref<HTMLElement | null>(null)  // 进度条 DOM 引用
const isDraggingProgress = ref(false)                   // 是否正在拖拽进度条

/** 将鼠标事件的 clientX 换算为播放进度并通过 store.seek 跳转 */
const updateProgressFromEvent = (event: MouseEvent): void => {
    if (!progressBarRef.value) return
    const rect = progressBarRef.value.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    player.seek(Math.floor(percent * player.duration))
}

// ─── 进度条拖拽：mousedown → mousemove 更新 → mouseup 停止 ───

const onProgressMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return  // 仅响应鼠标左键
    isDraggingProgress.value = true
    updateProgressFromEvent(event)
}

const onWindowMouseMove = (event: MouseEvent) => {
    if (!isDraggingProgress.value) return
    updateProgressFromEvent(event)
}

const onWindowMouseUp = () => {
    isDraggingProgress.value = false
}

onMounted(() => {
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
})

onUnmounted(() => {
    window.removeEventListener('mousemove', onWindowMouseMove)
    window.removeEventListener('mouseup', onWindowMouseUp)
})
</script>

<style lang="scss" scoped>
.player {
    display: flex;
    place-items: center;
    padding: 0 var(--fm-base-spacing-lg);
    flex-shrink: 0;
    position: relative;
    user-select: none;
    height: 100%;
}

/*
 * 顶部全局进度条 —— 贴合 player 上边缘
 * 平时是一条 2px 细线，hover 时变粗 + 显示拖拽手柄
 */
.top-progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--fm-base-color-gray-300);
    cursor: pointer;
    z-index: 2;
    transition: height 0.15s ease;

    &:hover {
        height: 4px;

        .top-progress-fill {
            background: var(--fm-base-color-brand-500);
        }

        .top-progress-fill::after {
            opacity: 1;
        }

        // hover 时显示时间标签
        .progress-time-tip {
            opacity: 1;
        }
    }
}

/* hover 时显示的时间标签 — 位于进度条左端上方 */
.progress-time-tip {
    position: absolute;
    left: 10px;
    top: -18px;
    font-size: 11px;
    color: var(--fm-base-color-text-secondary);
    font-variant-numeric: tabular-nums; // 等宽数字，避免数字跳动
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none; // 不阻挡鼠标事件
}

.top-progress-fill {
    height: 100%;
    background: var(--fm-base-color-brand-350);
    position: relative;
    transition: background 0.2s ease;

    /* hover 时才显示的拖拽圆点 */
    &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: var(--fm-base-color-brand-500);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.15s ease;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    }
}

.player-left {
    align-items: center;
    width: 25%;
    min-width: 200px;

    /* 专辑封面占位 - Arco Avatar 样式覆盖 */
    .current-art {
        border-radius: var(--fm-base-radius-md);
        background: linear-gradient(135deg, var(--fm-base-color-brand-100), var(--fm-base-color-brand-200));
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

            .art-icon {
                transform: scale(1.05);
            }
        }

        // 覆盖 Arco Avatar 内部默认背景色
        :deep(.arco-avatar) {
            background: transparent;
        }
    }

    .current-info {

        .current-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--fm-base-color-text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .current-artist {
            font-size: 12px;
            color: var(--fm-base-color-text-tertiary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    /* 收藏按钮 - Arco Button 样式覆盖 */
    .favorite-btn {
        flex-shrink: 0;
        transition: color 0.2s ease;
        background-color: transparent;
    }
}

.player-center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .play-btn {
        width: 40px;
        height: 40px;
        background-color: var(--fm-base-color-gray-650);
        border-radius: 50%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .play-icon {
            margin-left: 2.8px;
        }

        &:hover {
            background-color: var(--fm-base-color-gray-900);
        }
    }
}

.player-tip {
    cursor: pointer;
}


.player-right {
    width: 25%;
    min-width: 200px;
    padding-right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.percentage {
    font-size: 11px;
    margin-bottom: var(--fm-base-spacing-sm);
    width: 32px;
    text-align: center;
}

.volume-slider {
    min-width: 100%;
    display: grid;
    place-items: center;
    margin-bottom: var(--fm-base-spacing-xs);
    touch-action: none; /* 消除 Chrome 对 Arco slider 内部 touchstart 非 passive 的警告 */

    :deep(.arco-slider-track-vertical) {
        min-height: 100%;
        height: 100px;
    }

}
</style>
