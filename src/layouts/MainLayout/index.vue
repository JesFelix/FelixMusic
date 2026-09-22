<template>
    <div class="main-layout">
        <a-layout>
            <a-layout>
                <a-layout-sider :width="240">
                    <Navigation />
                </a-layout-sider>
                <a-layout>
                    <a-layout-header>
                        <Header />
                    </a-layout-header>
                    <a-layout-content>
                        <router-view v-slot="{ Component, route }">
                            <Transition name="page-slide" mode="out-in">
                                <component :is="Component" :key="route.matched[1]?.path ?? route.path" />
                            </Transition>
                        </router-view>
                    </a-layout-content>
                </a-layout>
            </a-layout>
            <a-layout-footer>
                <Player />
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script lang="ts" setup name="MainLayout">
import Navigation from "@/layouts/MainLayout/models/Navigation.vue"
import Header from "@/layouts/MainLayout/models/Header.vue"
import Player from "@/layouts/MainLayout/models/player.vue"
</script>

<style lang="scss" scoped>
.main-layout {
    display: flex;
    height: 100vh;
    flex-direction: column;
    background: var(--fm-base-color-background-app);
    background-clip: padding-box;
    overflow: hidden;
    border-radius: var(--fm-base-radius-lg);
}

.main-layout :deep(.arco-layout-header),
.main-layout :deep(.arco-layout-footer),
.main-layout :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--fm-base-color-text-primary);
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
}

.main-layout :deep(.arco-layout-header) {
    height: 64px;
    border-bottom: 1px solid var(--fm-base-color-border-default);
    background-color: var(--fm-base-color-background-surface);
}

.main-layout :deep(.arco-layout-footer) {
    height: 80px;
    border-top: 1px solid var(--fm-base-color-border-default);
    background-color: var(--fm-base-color-background-surface);
}

.main-layout :deep(.arco-layout-content) {
    background-color: var(--fm-base-color-background-app);
    overflow: hidden;
    /* 防止页面切换动画时产生水平滚动条 */
    padding: var(--fm-base-spacing-sm);
    max-height: calc(100vh - 80px - 64px);
}

.main-layout :deep(.arco-layout-sider-children) {
    background-color: var(--fm-base-color-background-surface);
    border-right: 1px solid var(--fm-base-color-border-default);
    padding: var(--fm-base-spacing-sm);
}

.main-layout :deep(.arco-layout-sider-light) {
    box-shadow: none;
}

/* ============================================================
   页面切换动画 — 基于 animate.css
   进入: 从右侧滑入 + 淡入
   离开: 向左侧滑出 + 淡出
   ============================================================ */
.page-slide-enter-active {
    animation: fadeInRight 0.35s ease;
}

.page-slide-leave-active {
    animation: fadeOutLeft 0.25s ease;
}
</style>
