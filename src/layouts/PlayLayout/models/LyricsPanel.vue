<template>
    <div class="lyrics-panel">
        <!-- 歌曲信息 -->
        <a-space direction="vertical" size="small" class="song-header">
            <span class="song-title">归寻</span>
            <a-space size="medium" class="song-meta">
                <span>歌手：邓寓君（等什么君）</span>
                <span>来源：本地音乐</span>
            </a-space>
        </a-space>

        <!-- 歌词 -->
        <div class="lyrics">
            <span class="lyric-line" v-for="lyric, index in guixunLyrics" :key="index">{{ lyric.context }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup name="LyricsPanel">
import { ref } from 'vue';

// 纯展示组件，无交互逻辑

export interface lyrics {
    time: string
    context: string
}

const guixunLyrics = ref<lyrics[]>([
    { time: "00:00.44", context: "归寻 - 等什么君" },
    { time: "00:00.64", context: "词：王莹" },
    { time: "00:00.74", context: "曲：王中易/高漠伊" },
    { time: "00:00.97", context: "编曲：王中易/高漠伊" },
    { time: "00:01.23", context: "制作人：王中易/高漠伊" },
    { time: "00:01.53", context: "录音：李亚男" },
    { time: "00:01.70", context: "混音：王宇呈" },
    { time: "00:01.85", context: "吉他：高漠伊" },
    { time: "00:02.02", context: "贝斯：赵伟丞" },
    { time: "00:02.18", context: "古筝：梦雨" },
    { time: "00:02.31", context: "和声：温佳庚" },
    { time: "00:02.49", context: "统筹：王艺园" },
    { time: "00:02.64", context: "录音室：Hikoon Music" },
    { time: "00:02.81", context: "制作团队/出品：伊格赛听@HikoonMusic" },
    { time: "00:03.18", context: "OP：嗨库文化" },
    { time: "00:28.78", context: "丛林小筑" },
    { time: "00:30.82", context: "竹叶青青夕阳迟暮" },
    { time: "00:35.32", context: "三巡酒过" },
    { time: "00:37.32", context: "白衣友还如故" },
    { time: "00:41.86", context: "迷蒙山雾" },
    { time: "00:43.89", context: "琴声漫过了山峰去远处" },
    { time: "00:48.82", context: "银辉照" },
    { time: "00:50.49", context: "繁星似棋九天布" },
    { time: "00:55.17", context: "空山新林归鹧鸪" },
    { time: "00:58.27", context: "油灯下他著新书" },
    { time: "01:01.85", context: "前尘往事笔触" },
    { time: "01:04.09", context: "不过酒一壶" },
    { time: "01:08.23", context: "空山新林归鹧鸪" },
    { time: "01:11.52", context: "世间繁华梦一出" },
    { time: "01:14.77", context: "唯有过客匆匆归山间长住" },
    { time: "01:34.59", context: "松间寒露" },
    { time: "01:36.50", context: "雀鸦声声琵琶作赋" },
    { time: "01:40.99", context: "衣袖飘拂" },
    { time: "01:43.04", context: "小阁清风频顾" },
    { time: "01:47.60", context: "闲庭信步" },
    { time: "01:49.67", context: "枯叶覆盖了青色石板路" },
    { time: "01:54.60", context: "隐幽谷" },
    { time: "01:56.20", context: "遍寻仙鹤双栖处" },
    { time: "02:00.76", context: "空山新林归鹧鸪" },
    { time: "02:04.01", context: "油灯下他著新书" },
    { time: "02:07.51", context: "前尘往事笔触" },
    { time: "02:09.81", context: "不过酒一壶" },
    { time: "02:13.90", context: "空山新林归鹧鸪" },
    { time: "02:17.12", context: "世间繁华梦一出" },
    { time: "02:20.34", context: "唯有过客匆匆归山间长住" },
    { time: "02:27.04", context: "空山新林归鹧鸪" },
    { time: "02:30.37", context: "油灯下他著新书" },
    { time: "02:33.63", context: "前尘往事笔触" },
    { time: "02:36.12", context: "不过酒一壶" },
    { time: "02:40.19", context: "空山新林归鹧鸪" },
    { time: "02:43.50", context: "世间繁华梦一出" },
    { time: "02:46.72", context: "唯有过客匆匆归山间长住" },
])
</script>

<style lang="scss" scoped>
.lyrics-panel {
    width: 100%;
    height: 100%;
    padding: var(--fm-base-spacing-12) var(--fm-base-spacing-2xl) var(--fm-base-spacing-3xl) var(--fm-base-spacing-2xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ========== 歌曲信息区 ========== */
.song-header {
    margin-bottom: var(--fm-base-spacing-lg);

    .song-title {
        font-size: var(--fm-base-font-size-2xl);
        font-weight: bold;
        color: #ffff;
    }

    .song-meta {
        color: #b4b4b4;
    }

}

/* ========== 歌词区 ========== */
.lyrics {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* 隐藏滚动条（WebKit：Chrome/Edge/Tauri WebView2） */
    scrollbar-width: none;            /* Firefox */
    -ms-overflow-style: none;         /* IE / 旧 Edge */

    &::-webkit-scrollbar {
        display: none;                /* Chrome / Safari / Edge */
    }

    .lyric-line {
        font-size: 18px;
        line-height: 30px;
        color: #b4b4b4;
        margin: 0;
    }

}
</style>
