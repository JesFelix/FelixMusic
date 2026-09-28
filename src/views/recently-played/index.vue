<template>
    <div class="recently-played-page default-page-format">
        <header class="page-header">
            <div>
                <h1 class="page-title">最近播放</h1>
                <p class="page-subtitle">记录你最近听过的音乐</p>
            </div>
            <div class="header-actions">
                <FmSearchInput v-model="searchKeyword" :colors="searchColors" placeholder="搜索歌曲或歌手" type="ellipse" />
                <a-button class="clear-button" :disabled="history.length === 0" @click="clearHistory">
                    <template #icon><fm-icon name="fm-close" :size="16" /></template>
                    清空记录
                </a-button>
            </div>
        </header>

        <div class="summary-bar">
            <span>共 {{ history.length }} 首歌曲</span>
            <span class="summary-divider">·</span>
            <span>最近更新于 {{ latestPlayedText }}</span>
        </div>

        <main class="history-content">
            <section v-for="group in filteredGroups" :key="group.date" class="history-group">
                <div class="group-title">
                    <span>{{ group.label }}</span>
                    <span class="group-count">{{ group.songs.length }} 首</span>
                </div>
                <div class="song-list">
                    <div v-for="(song, index) in group.songs" :key="song.id" class="song-row"
                        :class="{ 'song-row--playing': playingId === song.id }" @dblclick="playSong(song)">
                        <div class="song-index">
                            <span class="index-number">{{ String(index + 1).padStart(2, '0') }}</span>
                            <fm-icon class="index-play" name="fm-play" :size="17" color="var(--fm-base-color-brand-500)"
                                @click="playSong(song)" />
                        </div>
                        <div class="song-cover" :style="{ background: song.cover }"><span>{{ song.name.slice(0, 1)
                                }}</span>
                        </div>
                        <div class="song-info">
                            <span class="song-name" :title="song.name">{{ song.name }}</span>
                            <span class="song-artist" :title="song.artist">{{ song.artist }}</span>
                        </div>
                        <span class="played-at">{{ song.playedAt }}</span>
                        <span class="song-duration">{{ song.duration }}</span>
                        <button class="more-button" type="button" title="移除记录" @click="removeSong(song.id)">
                            <fm-icon name="fm-close" :size="15" />
                        </button>
                    </div>
                </div>
            </section>

            <div v-if="filteredGroups.length === 0" class="empty-state">
                <div class="empty-icon"><fm-icon name="fm-recently" :size="34" color="var(--fm-base-color-brand-400)" />
                </div>
                <h2>{{ history.length === 0 ? '还没有播放记录' : '没有找到相关歌曲' }}</h2>
                <p>{{ history.length === 0 ? '播放过的歌曲会出现在这里' : '换个关键词试试吧' }}</p>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup name="RecentlyPlayed">
import { computed, ref } from 'vue'

interface HistorySong {
    id: string
    name: string
    artist: string
    duration: string
    playedAt: string
    date: string
    cover: string
}

interface HistoryGroup {
    date: string
    label: string
    songs: HistorySong[]
}

const searchKeyword = ref('')
const playingId = ref<string | null>(null)
const searchColors = {
    background: 'var(--fm-base-color-gray-200)',
    backgroundActive: 'var(--fm-base-color-gray-250)',
    iconColor: 'var(--fm-base-color-gray-700)',
    iconColorActive: 'var(--fm-base-color-gray-700)',
    placeholderColor: 'var(--fm-base-color-gray-400)',
    textColor: 'var(--fm-base-color-text-primary)',
}

const history = ref<HistorySong[]>([
    { id: '1', name: '夜空中最亮的星', artist: '逃跑计划', duration: '4:02', playedAt: '刚刚', date: 'today', cover: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
    { id: '2', name: '平凡之路', artist: '朴树', duration: '5:18', playedAt: '今天 18:42', date: 'today', cover: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
    { id: '3', name: '起风了', artist: '买辣椒也用券', duration: '5:25', playedAt: '今天 16:20', date: 'today', cover: 'linear-gradient(135deg, #e17055, #fab1a0)' },
    { id: '4', name: '少年', artist: '梦然', duration: '3:48', playedAt: '今天 12:08', date: 'today', cover: 'linear-gradient(135deg, #00b894, #55efc4)' },
    { id: '5', name: '十年', artist: '陈奕迅', duration: '4:05', playedAt: '昨天 22:16', date: 'yesterday', cover: 'linear-gradient(135deg, #fdcb6e, #e17055)' },
    { id: '6', name: '后来', artist: '刘若英', duration: '5:32', playedAt: '昨天 20:03', date: 'yesterday', cover: 'linear-gradient(135deg, #fd79a8, #e84393)' },
    { id: '7', name: '乌梅子酱', artist: '李荣浩', duration: '3:52', playedAt: '昨天 14:37', date: 'yesterday', cover: 'linear-gradient(135deg, #636e72, #b2bec3)' },
    { id: '8', name: '孤勇者', artist: '陈奕迅', duration: '4:16', playedAt: '2024年1月12日', date: 'earlier', cover: 'linear-gradient(135deg, #2d3436, #6c5ce7)' },
])

const filteredGroups = computed<HistoryGroup[]>(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    const groups: HistoryGroup[] = [
        { date: 'today', label: '今天', songs: [] },
        { date: 'yesterday', label: '昨天', songs: [] },
        { date: 'earlier', label: '更早', songs: [] },
    ]
    history.value
        .filter(song => !keyword || `${song.name}${song.artist}`.toLowerCase().includes(keyword))
        .forEach(song => groups.find(group => group.date === song.date)?.songs.push(song))
    return groups.filter(group => group.songs.length > 0)
})

const latestPlayedText = computed(() => history.value[0]?.playedAt ?? '暂无')

function playSong(song: HistorySong): void {
    playingId.value = song.id
}

function removeSong(id: string): void {
    history.value = history.value.filter(song => song.id !== id)
    if (playingId.value === id) playingId.value = null
}

function clearHistory(): void {
    history.value = []
    playingId.value = null
}
</script>

<style lang="scss" scoped>
.recently-played-page {
    display: flex;
    flex-direction: column;
    min-height: 0;
    user-select: none;
}

.page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--fm-base-spacing-lg);
    flex-shrink: 0;
}

.page-title {
    margin: 0;
    color: var(--fm-base-color-text-primary);
    font-size: var(--fm-base-font-size-2xl);
    font-weight: var(--fm-base-font-weight-bold);
    line-height: var(--fm-base-font-lineHeight-tight);
}

.page-subtitle,
.summary-bar,
.group-count,
.played-at,
.song-duration {
    color: var(--fm-base-color-text-tertiary);
    font-size: var(--fm-base-font-size-sm);
}

.page-subtitle {
    margin-top: var(--fm-base-spacing-xs);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: var(--fm-base-spacing-sm);
}

.clear-button {
    border: 0;
    border-radius: var(--fm-base-radius-md);
    color: var(--fm-base-color-text-secondary);
    background: var(--fm-base-color-gray-200);
}

.clear-button:hover:not(:disabled) {
    color: var(--fm-base-color-brand-500);
    background: var(--fm-base-color-brand-100);
}

.summary-bar {
    display: flex;
    align-items: center;
    gap: var(--fm-base-spacing-xs);
    padding: 0 var(--fm-base-spacing-sm) var(--fm-base-spacing-md);
    border-bottom: 1px solid var(--fm-base-color-border-default);
}

.summary-divider {
    color: var(--fm-base-color-gray-400);
}

.history-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.history-group+.history-group {
    margin-top: var(--fm-base-spacing-lg);
}

.group-title {
    display: flex;
    align-items: baseline;
    gap: var(--fm-base-spacing-sm);
    margin-bottom: var(--fm-base-spacing-xs);
    color: var(--fm-base-color-text-primary);
    font-size: var(--fm-base-font-size-lg);
    font-weight: var(--fm-base-font-weight-semibold);
}

.song-list {
    overflow: hidden;
    border-radius: var(--fm-base-radius-md);
    background: var(--fm-base-color-background-surface);
}

.song-row {
    display: flex;
    align-items: center;
    min-height: 68px;
    gap: var(--fm-base-spacing-sm);
    padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-md);
    cursor: default;
    transition: background-color var(--fm-base-transition-fast);
}

.song-row+.song-row {
    border-top: 1px solid var(--fm-base-color-border-default);
}

.song-row:hover {
    background: var(--fm-base-color-background-hover);
}

.song-row:hover .index-number {
    visibility: hidden;
}

.song-row:hover .index-play {
    visibility: visible;
}

.song-row:hover .more-button {
    opacity: 1;
}

.song-row--playing .song-name {
    color: var(--fm-base-color-brand-500);
}

.song-index {
    position: relative;
    width: 32px;
    flex: 0 0 32px;
    text-align: center;
    color: var(--fm-base-color-text-tertiary);
    font-size: var(--fm-base-font-size-sm);
}

.index-play {
    position: absolute;
    top: 50%;
    left: 50%;
    visibility: hidden;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.song-cover {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    place-items: center;
    border-radius: var(--fm-base-radius-6);
    color: rgb(255 255 255 / 86%);
    font-size: var(--fm-base-font-size-lg);
    font-weight: var(--fm-base-font-weight-bold);
    box-shadow: var(--fm-base-shadow-sm);
}

.song-info {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
}

.song-name,
.song-artist {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.song-name {
    color: var(--fm-base-color-text-primary);
    font-size: var(--fm-base-font-size-base);
    font-weight: var(--fm-base-font-weight-medium);
}

.song-artist {
    color: var(--fm-base-color-text-tertiary);
    font-size: var(--fm-base-font-size-xs);
}

.played-at {
    width: 110px;
    text-align: right;
}

.song-duration {
    width: 46px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.more-button {
    display: grid;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    place-items: center;
    border: 0;
    border-radius: var(--fm-base-radius-full);
    color: var(--fm-base-color-text-tertiary);
    background: transparent;
    cursor: pointer;
    opacity: 0;
    transition: opacity var(--fm-base-transition-fast), color var(--fm-base-transition-fast), background-color var(--fm-base-transition-fast);
}

.more-button:hover {
    color: var(--fm-base-color-semantic-danger);
    background: var(--fm-base-color-gray-200);
}

.empty-state {
    display: flex;
    height: 100%;
    min-height: 260px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--fm-base-color-text-tertiary);
    text-align: center;
}

.empty-icon {
    display: grid;
    width: 78px;
    height: 78px;
    margin-bottom: var(--fm-base-spacing-md);
    place-items: center;
    border-radius: var(--fm-base-radius-full);
    background: var(--fm-base-color-brand-100);
}

.empty-state h2 {
    margin-bottom: var(--fm-base-spacing-xs);
    color: var(--fm-base-color-text-primary);
    font-size: var(--fm-base-font-size-lg);
}

.empty-state p {
    font-size: var(--fm-base-font-size-sm);
}

@media (max-width: 720px) {
    .page-header {
        align-items: stretch;
        flex-direction: column;
    }

    .header-actions {
        justify-content: space-between;
    }

    .played-at {
        display: none;
    }
}
</style>
