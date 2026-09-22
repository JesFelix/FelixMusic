<template>
    <div class="play-layout">
        <!-- 顶部导航栏 -->
        <Header class="play-header" />

        <!-- 主体：左侧唱片机 + 右侧歌词 -->
        <div class="play-content">
            <a-row class="play-body">
                <a-col flex="45%" class="play-body-left">
                    <RecordPlayer :model-value="false" />
                </a-col>
                <a-col flex="55%" class="play-body-right">
                    <LyricsPanel />
                </a-col>
            </a-row>
        </div>

        <!-- 底部播放控制栏 -->
        <Footer class="play-footer" />
    </div>
</template>

<script lang="ts" setup name="PlayLayout">
import Header from "@/layouts/PlayLayout/models/Header.vue"
import Footer from "@/layouts/PlayLayout/models/Footer.vue"
import RecordPlayer from "@/layouts/PlayLayout/models/RecordPlayer.vue"
import LyricsPanel from "@/layouts/PlayLayout/models/LyricsPanel.vue"
</script>

<style lang="scss" scoped>
/* ============================================================
   播放页专属配色 — 网易云风暗青灰
   通过 CSS 变量向子组件传递，保持整体色调统一
   ============================================================ */
.play-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #3d4d49;
    color: #f5f5f5;
    overflow: hidden;
    user-select: none;
    box-sizing: border-box;
}

/* 顶部导航栏高度 */
.play-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.play-content {
    width: 100%;
    height: 100vh;

    .play-body {
        width: 100%;
        height: calc(100vh - 64px - 80px);
        margin-top: 64px;
        margin-bottom: 80px;
        display: flex;
        align-items: center;
        justify-content: center;

        .play-body-right {
            height: 100%;
        }
    }

}

// /* 主体区域：占满剩余高度 */
// .play-body {
//     padding-top: 64px;
//     flex: 1;
//     display: flex;
//     min-height: 0;
//     overflow: hidden;
// }

// /* 左侧唱片机：约占 40% 宽度 */
// .play-body-left {
//     flex: 0 0 40%;
//     min-width: 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }

// /* 右侧歌词：约占 60% 宽度 */
// .play-body-right {
//     flex: 1;
//     min-width: 0;
//     display: flex;
//     align-items: center;
// }

// 底部播放控制栏高度
.play-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
