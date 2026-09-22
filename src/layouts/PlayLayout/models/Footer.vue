<template>
    <dev class="footer">
        <!-- 左侧：歌曲信息 + 操作按钮 -->
        <a-space align="center" class="footer-left">
            <a-space direction="vertical">
                <span class="fs-title">归寻</span>
                <span class="fs-artist">邓寓君（等什么君）</span>
            </a-space>
            <a-button class="favorite-btn" shape="circle">
                <template #icon>
                    <fm-icon v-if="player.isFavorite" color="red" name="player/fm-college" size="24" />
                    <fm-icon v-else color="#6B7280" hoverColor="#B9BDC4" name="player/fm-no-college" size="24" />
                </template>
            </a-button>
        </a-space>

        <!-- 中间：播放控制 -->
        <a-space align="center" class="footer-center" size="medium">
            <dev class="play-btn" title="循环模式" @click="player.cyclePlayMode">
                <fm-icon :name="player.currentPlayMode.icon" :size="22" />
            </dev>
            <dev class="play-btn" title="上一曲" @click="player.playPrevious">
                <fm-icon name="player/fm-previous-song" :size="24" />
            </dev>
            <!-- 播放 / 暂停：白色圆底 + 深色三角形 -->
            <dev class="play-btn play" :title="player.isPlaying ? '暂停' : '播放'" @click="player.togglePlay">
                <fm-icon v-if="player.isPlaying" name="player/fm-stop" :size="20" />
                <fm-icon v-else className="play-icon" name="player/fm-play" :size="22" />
            </dev>
            <dev class="play-btn" title="下一曲" @click="player.playNext">
                <fm-icon name="player/fm-next-one" :size="24" />
            </dev>
            <dev class="play-btn" title="播放列表">
                <fm-icon name="player/fm-playlist" :size="20" />
            </dev>
        </a-space>

        <!-- 右侧：功能开关 -->
        <a-space align="center" class="footer-right">
            <div class="lyrics-btn" title="歌词" @click="player.toggleLyrics">
                <fm-icon name="player/fm-lyrics" :size="22" />
            </div>
        </a-space>
    </dev>
</template>

<script lang="ts" setup name="Footer">
import { usePlayerStore } from '@/stores'

// ========== 播放器状态管理 ==========
const player = usePlayerStore()
</script>

<style lang="scss" scoped>
$footer-height: 80px;
$music-info-width: 140px;
$footer-left-width: 25%;
$footer-right-width: 25%;
$play-btn-size: 34px;
$play-btn-color: #d9dbdb;
$play-btn-color-hover: #f1f2f5;

.footer {
    z-index: 0;
    height: $footer-height;
    display: flex;
    place-items: center;
    padding: 0 var(--fm-base-spacing-xl);
    flex-shrink: 0;
    position: relative;
    user-select: none;

    /* 毛玻璃背景：半透明底 + 背景模糊，营造透明磨砂质感 */
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    
    border-radius: 0 0 var(--fm-base-radius-lg) var(--fm-base-radius-lg);
}

/* ========== 左侧 ========== */
.footer-left {
    width: $footer-left-width;
    min-width: 200px;

    .fs-title {
        max-width: $music-info-width;
        font-size: 16px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .fs-artist {
        max-width: $music-info-width;
        font-size: 13px;
        color: #B9BDC4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .favorite-btn {
        flex-shrink: 0;
        transition: color 0.2s ease;
        background-color: transparent;
    }

}

/* ========== 中间 ========== */
.footer-center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 播放 / 暂停主按钮 */
    .play-btn {
        width: $play-btn-size;
        height: $play-btn-size;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease, background 0.2s ease;
        color: $play-btn-color;

        &:hover {
            color: $play-btn-color-hover;
        }

    }

    .play {
        width: calc($play-btn-size + 8px);
        height: calc($play-btn-size + 8px);
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.1);

        &:hover {
            color: $play-btn-color-hover;
            background-color: rgba(255, 255, 255, 0.3);
        }

        .play-icon {
            margin-left: 2.8px;
        }
    }
}

/* ========== 右侧 ========== */
.footer-right {
    width: $footer-left-width;
    min-width: 200px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /* “词”歌词开关 */
    .lyrics-btn {
        width: $play-btn-size;
        height: $play-btn-size;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        color: $play-btn-color;

        &:hover {
            color: $play-btn-color-hover;
        }
    }
}
</style>
