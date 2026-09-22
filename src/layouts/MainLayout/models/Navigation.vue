<template>
    <div class="navigation">
        <!-- ====== Logo 区域 ====== -->
        <div class="logo">
            <img :src="logo" alt="FelixMusic" class="logo-image" />
        </div>

        <hr class="nav-line" />

        <div class="subject">
            <!-- ====== 系统导航菜单 ====== -->
            <nav v-show="navigation.systemSection?.isDisplay !== false" class="nav-section">
                <div v-for="item in navigation.systemSection!.items" :key="item.id"
                    v-show="item.isDisplay !== false" class="nav-item"
                    :class="{ active: navigation.activeId === item.id }" @click="handleNavClick(item)">
                    <div class="nav-item-icon">
                        <fm-icon :name="item.icon" :size="20" />
                    </div>
                    <span class="nav-item-text">{{ item.name }}</span>
                </div>
            </nav>

            <hr class="nav-line nav-line-split" v-show="navigation.systemSection?.isDisplay !== false" />

            <!-- 我的 -->
            <nav v-show="navigation.userSection?.isDisplay !== false" class="nav-section">
                <div class="nav-section-title">我的</div>
                <div v-for="item in navigation.userSection!.items" :key="item.id"
                    v-show="item.isDisplay !== false" class="nav-item"
                    :class="{ active: navigation.activeId === item.id }" @click="handleNavClick(item)">
                    <div class="nav-item-icon">
                        <fm-icon :name="item.icon" :size="20" />
                    </div>
                    <span class="nav-item-text">{{ item.name }}</span>
                </div>
            </nav>
        </div>
    </div>
</template>

<script lang="ts" setup name="Navigation">
import logo from "@/assets/logo/logo.png"
import { useNavigationStore } from "@/stores"
import type { NavigationItem } from "@/stores"

const navigation = useNavigationStore()

/** 点击菜单项：设置激活状态 + 导航到对应页面 */
const handleNavClick = (item: NavigationItem) => {
    navigation.navigateToItem(item)
}

</script>

<style lang="scss" scoped>
.navigation {
    display: flex;
    flex-direction: column;
    height: 100%;
    user-select: none;
}

.nav-line {
    border: none;
    height: 1.3px;
    margin: var(--fm-base-spacing-xs) var(--fm-base-spacing-sm);
    border-radius: 50%;
    background: var(--fm-base-color-border-default);
}

.subject {
    height: calc(100vh - 80px - 68px - 16px - 10px);
    overflow-y: auto;

    // 1. 默认状态：隐藏滚动条（宽度保留，但颜色透明）
    &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: transparent; // 默认滑块透明
        border-radius: var(--fm-base-radius-full);
        transition: background 0.3s ease; // 添加过渡动画，让显示更丝滑
    }

    // 2. 悬停状态：鼠标放到元素上时，显示滚动条
    &:hover {
        &::-webkit-scrollbar-thumb {
            background: var(--fm-base-color-gray-300);
        }

        // 鼠标悬停在滚动条滑块上时，颜色加深（提升交互体验）
        &::-webkit-scrollbar-thumb:hover {
            background: var(--fm-base-color-gray-400);
        }
    }

    // 文本选中样式（保持您原有的逻辑）
    &::selection {
        background-color: var(--fm-base-color-semantic-primaryLight);
        color: var(--fm-base-color-semantic-primary);
    }
}

.nav-line-split {
    margin: var(--fm-base-spacing-18) var(--fm-base-spacing-sm);
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--fm-base-spacing-sm);
    height: 68px;
    padding: 0 var(--fm-base-spacing-md);

    /* ---- Logo 图片 ---- */
    .logo-image {
        width: 100%;
        object-fit: contain;
        border-radius: var(--fm-base-radius-md);
        flex-shrink: 0;
        filter: drop-shadow(0 2px 4px rgba(108, 92, 231, 0.15));
    }

}

.nav-section {

    margin: var(--fm-base-spacing-xs) var(--fm-base-spacing-sm);

    .nav-section-title {
        font-size: 12px;
        color: var(--fm-base-color-text-tertiary);
        padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-12);
    }


    .nav-item {
        display: flex;
        align-items: center;
        padding: var(--fm-base-spacing-12) var(--fm-base-spacing-md);
        border-radius: var(--fm-base-radius-6);
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--fm-base-color-text-tertiary);
        margin-bottom: 4px;

        &:hover {
            background: var(--fm-base-color-gray-100);
            color: var(--fm-base-color-text-primary);
        }

        &.active {
            background: var(--fm-base-color-brand-100);
            color: var(--fm-base-color-brand-400);
            font-weight: bold;
        }
    }

    .nav-item-icon {
        width: 20px;
        height: 20px;
        margin-right: var(--fm-base-spacing-12);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 20px;
            height: 20px;
        }
    }

    .nav-item-text {
        font-size: 14px;
        flex: 1;
    }

}
</style>
