<template>
    <div class="header">
        <div class="header-left">
            <!-- 返回按钮 -->
            <button class="nav-back-btn" @click="handleBack" title="返回">
                <FmIcon name="fm-return" :size="16" />
            </button>

            <!-- 搜索框 -->
            <div class="search-box">
                <FmIcon name="fm-search" :size="20" />
                <input v-model="searchQuery" type="text" placeholder="搜索歌曲、歌手、专辑..." />
            </div>
        </div>

        <div class="header-right">
            <!-- 主题设置按钮 -->
            <template v-if="navigation.expressSection?.isDisplay" v-for="item in navigation.expressSection?.items"
                :key="item.id">
                <button v-if="item?.isDisplay" class="icon-btn" @click="toExpress(item)" :title="item.name">
                    <FmIcon :name="item.icon" :size="20" />
                </button>
            </template>

            <!-- 用户信息 -->
            <div class="user-info" @click="toUserInfo">
                <div class="user-avatar">U</div>
                <span class="user-name">User</span>
                <!-- <div class="user-avatar">{{ userAvatar }}</div>
                <span class="user-name">{{ userName }}</span> -->
            </div>

            <!-- 窗口控制器 -->
            <div class="window-controls">
                <button class="window-btn" @click="windowStore.minimize()" title="最小化">
                    <FmIcon name="fm-minimize" :size="18" />
                </button>
                <button class="window-btn" @click="windowStore.toggleMaximize()" title="最大化">
                    <FmIcon v-if="windowStore.isMaximized" name="fm-win-restore" :size="18" />
                    <FmIcon v-else name="fm-maximize" :size="18" />
                </button>
                <button class="window-btn close" @click="windowStore.close()" title="关闭">
                    <FmIcon name="fm-close" :size="20" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="Header">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowStore, useNavigationStore } from '@/stores'
import type { NavigationItem } from '@/stores'

// ========== 窗口状态管理（Pinia Store） ==========
const windowStore = useWindowStore()

// ========== 导航（封装路由跳转） ==========
const navigation = useNavigationStore()

// ========== 搜索状态 ==========
const searchQuery = ref('')

// ========== 窗口最大化状态监听 ==========
// 初始化和清理都在 Pinia Store 内部管理
onMounted(() => {
    windowStore.init()
})

onUnmounted(() => {
    windowStore.destroy()
})

// ========== 导航 / 功能按钮 ==========

/** 返回上一页 */
const handleBack = () => {
    window.history.back()
}

/**
 * 快捷入口跳转
 * 根据传入的菜单项自动导航到对应页面（主题/消息/设置）
 */
const toExpress = (item: NavigationItem) => {
    navigation.navigateToItem(item)
}

/** 用户信息 */
const toUserInfo = () => {
    console.log('用户信息')
}

/** 消息是否有未读 */
// const hasUnreadMessages = ref(false)

</script>

<style lang="scss" scoped>
.header {
    height: 100%;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--fm-base-color-border-subtle);
    display: flex;
    align-items: center;
    padding: 0 var(--fm-base-spacing-md);
    gap: var(--fm-base-spacing-md);

    /* 窗口拖拽区域（Tauri 无原生标题栏） */
    -webkit-app-region: drag;
}

.header-left {
    display: flex;
    align-items: center;
    gap: var(--fm-base-spacing-sm);

    .nav-back-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--fm-base-color-gray-100);
        border: none;
        color: var(--fm-base-color-text-tertiary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        -webkit-app-region: no-drag;

        &:hover {
            background: var(--fm-base-color-gray-200);
            color: var(--fm-base-color-gray-800);
        }
    }

    .search-box {
        display: flex;
        align-items: center;
        background: var(--fm-base-color-gray-100);
        border-radius: var(--fm-base-radius-full);
        padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-md);
        min-width: 300px;
        width: 26vw;
        color: var(--fm-base-color-text-tertiary);
        -webkit-app-region: no-drag;

        input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--fm-base-color-text-primary);
            font-size: var(--fm-base-font-size-sm);
            margin-left: var(--fm-base-spacing-sm);

            &::placeholder {
                color: var(--fm-base-color-text-tertiary);
            }
        }
    }

}

.header-right {
    display: flex;
    align-items: center;
    gap: var(--fm-base-spacing-sm);
    margin-left: auto;

    .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: transparent;
        border: none;
        color: var(--fm-base-color-text-tertiary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
        -webkit-app-region: no-drag;

        &:hover {
            background: var(--fm-base-color-gray-200);
            color: var(--fm-base-color-text-primary);
        }

        .icon-btn-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            background: var(--fm-base-color-semantic-danger);
            border-radius: 50%;
            border: 2px solid var(--fm-base-color-background-surface);
        }

    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 12px 6px 6px;
        border-radius: var(--fm-base-radius-full);
        background: var(--fm-base-color-gray-100);
        cursor: pointer;
        transition: background-color var(--fm-base-transition-fast);
        -webkit-app-region: no-drag;

        &:hover {
            background: var(--fm-base-color-gray-200);
        }

        .user-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--fm-base-color-brand-500), var(--fm-base-color-accent-pink));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--fm-base-font-size-xs);
            font-weight: var(--fm-base-font-weight-semibold);
            color: var(--fm-base-color-text-inverse);
        }

        .user-name {
            font-size: var(--fm-base-font-size-sm);
            color: var(--fm-base-color-text-primary);
        }

    }

    .window-controls {
        display: flex;
        gap: var(--fm-base-spacing-sm);
        margin-left: var(--fm-base-spacing-md);

        .window-btn {
            width: 36px;
            height: 36px;
            border-radius: var(--fm-base-radius-6);
            border: none;
            background: transparent;
            color: var(--fm-base-color-text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            -webkit-app-region: no-drag;

            &:hover {
                background: var(--fm-base-color-gray-200);
                color: var(--fm-base-color-text-primary);
            }

            &.close {
                &:hover {
                    background: var(--fm-base-color-semantic-danger);
                    color: var(--fm-base-color-text-inverse);
                }
            }
        }

    }
}
</style>
