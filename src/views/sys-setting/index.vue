<template>
    <div class="sys-setting-page default-page-format">
        <div class="settings-page-inner">
            <h1 class="settings-title">系统设置</h1>

            <nav ref="navRef" class="settings-nav" aria-label="设置分类导航">
                <button v-for="section in sections" :key="section.id" class="settings-nav-item"
                    :class="{ 'settings-nav-item--active': section.id === activeId }" type="button"
                    @click="scrollToSection(section.id)">
                    <span>{{ section.label }}</span>
                </button>
                <span class="settings-nav-indicator" :style="indicatorStyle"></span>
            </nav>

            <SettingsContent :data="sections" />
        </div>
    </div>
</template>

<script lang="ts" setup name="SysSetting">
import { ref, watch, nextTick, onMounted } from 'vue'
import SettingsContent from './models/SettingsContent.vue'
import type { SettingItem } from './models/SettingsContent.vue'

const navRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref({ left: '0px', width: '0px' })

// 当前激活的导航分组
const activeId = ref('regular')

// 设置分组数据（导航栏与设置内容共用）
const sections = ref<SettingItem[]>([
    {
        id: 'regular',
        label: '常规',
        settings: [
            {
                id: 'regular-font',
                label: '字体选择',
                type: 'select',
                value: '默认',
                options: ['默认', '平方赖江湖飞扬体'],
            },
            {
                id: 'start-open',
                label: '开机启动',
                type: 'radio',
                options: [
                    { id: '1', label: '开启', value: '1', isSelect: false },
                    { id: '2', label: '关闭', value: '2', isSelect: true },
                ],
            },
            {
                id: 'regular-close',
                label: '关闭主面板',
                type: 'radio',
                options: [
                    { id: '1', label: '最小化托盘，不退出程序', value: '1', isSelect: true },
                    { id: '2', label: '退出程序', value: '2', isSelect: false },
                ],
            },
            {
                id: 'associate',
                label: '关联',
                type: 'optional',
                options: [
                    { id: '1', label: '将FelixMusic设置为默认播放器', value: '1', isSelect: false }
                ],
            },
        ],
    },
    { id: 'shortcuts', label: '快捷键', settings: [] },
    { id: 'play', label: '播放', settings: [] },
    { id: 'download', label: '下载', settings: [] },
])

// 更新导航滑动指示器的位置与宽度
const updateIndicator = (): void => {
    const nav = navRef.value
    if (!nav) return
    const activeBtn = nav.querySelector('.settings-nav-item--active') as HTMLElement | null
    if (activeBtn) {
        indicatorStyle.value = {
            left: `${activeBtn.offsetLeft}px`,
            width: `${activeBtn.offsetWidth}px`,
        }
    }
}

// 激活项变化后，等待 DOM 更新再更新指示器
watch(activeId, () => {
    nextTick(updateIndicator)
})

// 首次渲染后初始化指示器位置
onMounted(updateIndicator)

const scrollToSection = (id: string): void => {
    activeId.value = id
    // TODO: 滚动到指定 section
}
</script>

<style lang="scss" scoped>
.sys-setting-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    scroll-behavior: smooth;
}

.settings-page-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
}

// =============================================== 标题 ===============================================
.settings-title {
    flex: 0 0 auto;
    margin: 0;
    font-size: var(--fm-base-font-size-2xl);
    line-height: var(--fm-base-font-lineHeight-tight);
    color: var(--fm-base-color-text-primary);
    text-align: start;
}

// =============================================== 导航栏 ===============================================
.settings-nav {
    position: relative;
    flex: 0 0 auto;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 46px;
    margin: 0 -2px;
    padding: 0 2px;
    border-bottom: 1px solid var(--fm-base-color-border-default);
    background: var(--fm-base-color-background-app);

    .settings-nav-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 46px;
        padding: 0 14px;
        border: 0;
        background: transparent;
        color: var(--fm-base-color-text-tertiary);
        font: inherit;
        font-size: var(--fm-base-font-size-sm);
        white-space: nowrap;
        cursor: pointer;
        transition:
            color var(--fm-base-transition-normal),
            background-color var(--fm-base-transition-fast);

        &:hover {
            color: var(--fm-base-color-text-primary);
            background: var(--fm-base-color-background-hover);
        }

        &:focus-visible {
            outline: 2px solid var(--fm-base-color-border-focus);
            outline-offset: -2px;
            border-radius: var(--fm-base-radius-sm);
        }

        &--active {
            color: var(--fm-base-color-text-primary);
            font-weight: var(--fm-base-font-weight-semibold);
        }
    }

    .settings-nav-indicator {
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 3px;
        border-radius: 999px;
        background: var(--fm-base-color-semantic-primary);
        pointer-events: none;
        transition:
            left 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
            width 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

}

@media (max-width: 760px) {
    .settings-nav {
        gap: 0;
        overflow-x: auto;
    }

    .settings-nav-item {
        flex: 0 0 auto;
        padding: 0 12px;
    }
}
</style>
