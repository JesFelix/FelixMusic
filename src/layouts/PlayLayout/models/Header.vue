<template>
    <div class="header">
        <!-- 左侧：收起 / 返回按钮（下箭头） -->
        <div class="back-btn" @click="handleBack">
            <fm-icon :style="{ transform: 'rotate(-90deg)' }" name="fm-return" :size="20" />
        </div>

        <!-- 右侧：播放器模式 + 窗口控制按钮 -->
        <a-space class="window-controls" :size="10">
            <div class="window-btn player-btn">
                <fm-icon name="fm-player" :size="22" />
                <span>播放器模式</span>
            </div>
            <div class="line"></div>
            <div class="window-btn" title="全屏">
                <fm-icon name="fm-fullscreen" :size="22" />
            </div>
            <div class="window-btn" @click="windowStore.minimize()" title="最小化">
                <fm-icon name="fm-minimize" :size="18" />
            </div>
            <div class="window-btn" @click="windowStore.toggleMaximize()" title="全屏">
                <fm-icon v-if="windowStore.isMaximized" name="fm-win-restore" :size="18" />
                <fm-icon v-else name="fm-maximize" :size="18" />
            </div>
            <div class="window-btn" @click="windowStore.close()" title="关闭">
                <fm-icon name="fm-close" :size="20" />
            </div>
        </a-space>
    </div>
</template>

<script lang="ts" setup name="Header">
import { onMounted, onUnmounted } from 'vue'
import { useWindowStore } from '@/stores'

// ========== 窗口状态管理 ==========
const windowStore = useWindowStore()

// 初始化窗口状态监听（最大化状态同步）
onMounted(() => windowStore.init())
onUnmounted(() => windowStore.destroy())

// ========== 收起播放页：返回上一级 ==========
const handleBack = () => {
    window.history.back()
}
</script>

<style lang="scss" scoped>
$header-height: 64px;
$back-btn-size: 34px;
$back-btn-color: #ececec;
$window-btn-color: #aaa9a9;
$window-btn-color-hover: #e4e4e4;

.header {
    z-index: 5;
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--fm-base-spacing-xl);
    -webkit-app-region: drag;
}

.back-btn {
    width: $back-btn-size;
    height: $back-btn-size;
    border: none;
    border-radius: var(--fm-base-radius-6);
    background: transparent;
    color: $back-btn-color;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    -webkit-app-region: no-drag;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    &:active {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.4);
    }
}

.window-controls {

    margin-right: var(--fm-base-spacing-6);

    .window-btn {
        width: 26px;
        height: 26px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        -webkit-app-region: no-drag;
        color: $window-btn-color;

        &:hover {
            color: $window-btn-color-hover;
        }

    }

    .player-btn {
        width: 100%;
    }

    .line {
        height: 16px;
        width: 1px;
        background-color: #747474;
    }

    .win-divider {
        background-color: $window-btn-color;
    }
}
</style>
