/**
 * 播放器状态管理
 *
 * 管理当前播放歌曲信息、播放进度、收藏状态等。
 * 持久化收藏状态到 localStorage。
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// ========== 类型定义 ==========

/** 播放模式 id */
export type PlayMode = 'repeat-one' | 'sequential' | 'list-repeat' | 'shuffle'

/** 播放模式配置项 */
export interface PlayModeConfig {
  /** 模式标识 */
  id: PlayMode
  /** 中文名称 */
  name: string
  /** 对应图标名称（fm-icon 的 name） */
  icon: string
}

/** 播放模式列表 */
export const PLAY_MODES: PlayModeConfig[] = [
  { id: 'sequential',   name: '顺序播放', icon: 'player/fm-sequential-playback' },
  { id: 'list-repeat',  name: '列表循环', icon: 'player/fm-list-loop' },
  { id: 'repeat-one',   name: '单曲循环', icon: 'player/fm-song-repeat' },
  { id: 'shuffle',      name: '随机播放', icon: 'player/fm-random-cycle' },
]

/** 歌曲信息 */
export interface SongInfo {
  /** 歌曲唯一标识 */
  id: string
  /** 歌曲标题 */
  title: string
  /** 歌手名称 */
  artist: string
  /** 专辑封面 URL（空字符串表示无封面） */
  cover: string
  /** 歌曲总时长（秒） */
  duration: number
}

// ========== Store 定义 ==========

export const usePlayerStore = defineStore('player', () => {
  // ---- 状态 ----

  /** 当前播放的歌曲 */
  const currentSong = ref<SongInfo>({
    id: '1',
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    cover: '',
    duration: 242
  })

  /** 当前播放时间（秒） */
  const currentTime = ref(84)

  /** 是否正在播放 */
  const isPlaying = ref(false)

  /** 是否已收藏当前歌曲 */
  const isFavorite = ref(false)

  /** 是否显示歌词面板 */
  const showLyrics = ref(false)

  /** 播放倍速 */
  const playbackRate = ref(1.0)

  /** 音量大小（0-1） */
  const volume = ref(0.7)

  /** 是否静音 */
  const isMuted = ref(false)

  /** 静音前保存的音量值，用于取消静音时恢复（0-1） */
  const savedVolume = ref(0.7)

  /** 播放模式 */
  const playMode = ref<PlayMode>('sequential')

  // ---- 计算属性 ----

  /** 总时长（秒）— 取自当前歌曲 */
  const duration = computed(() => currentSong.value.duration)

  /** 播放进度百分比（0-100） */
  const progressPercent = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  /** 格式化时间为 m:ss 显示格式 */
  const formattedCurrentTime = computed(() => formatTime(currentTime.value))

  /** 格式化总时长 */
  const formattedDuration = computed(() => formatTime(duration.value))

  /** 有效音量（静音时返回 0） */
  const effectiveVolume = computed(() => isMuted.value ? 0 : volume.value)

  /** 当前播放模式配置（含中文名称） */
  const currentPlayMode = computed(() =>
    PLAY_MODES.find(m => m.id === playMode.value)!
  )

  // ---- 操作方法 ----

  /** 跳转到指定时间（秒） */
  function seek(time: number): void {
    currentTime.value = Math.max(0, Math.min(time, duration.value))
  }

  /** 切换播放/暂停 */
  function togglePlay(): void {
    isPlaying.value = !isPlaying.value
  }

  /** 切换收藏状态 */
  function toggleFavorite(): void {
    isFavorite.value = !isFavorite.value
  }

  /** 设置当前播放歌曲 */
  function setSong(song: SongInfo): void {
    currentSong.value = { ...song }
    currentTime.value = 0
    isPlaying.value = true
  }

  /** 切换歌词面板显示/隐藏 */
  function toggleLyrics(): void {
    showLyrics.value = !showLyrics.value
  }

  /** 设置播放倍速 */
  function setPlaybackRate(rate: number): void {
    playbackRate.value = rate
  }

  /** 循环切换播放倍速（0.5 → 1.0 → 1.5 → 2.0 → 0.5） */
  function cyclePlaybackRate(): void {
    const rates: number[] = [0.5, 1.0, 1.5, 2.0]
    const idx = rates.indexOf(playbackRate.value)
    playbackRate.value = rates[(idx + 1) % rates.length]
  }

  /** 设置音量（0-1），同时取消静音并更新记忆音量 */
  function setVolume(vol: number): void {
    volume.value = Math.max(0, Math.min(1, vol))
    if (vol > 0) {
      isMuted.value = false
      savedVolume.value = vol // 手动调音量时同步更新记忆值
    }
  }

  /** 切换静音状态：静音时保存当前音量并归零，取消静音时恢复旧音量 */
  function toggleMute(): void {
    if (isMuted.value) {
      // 取消静音：恢复之前保存的音量（至少恢复到 0.5 避免无声）
      volume.value = savedVolume.value > 0 ? savedVolume.value : 0.5
      isMuted.value = false
    } else {
      // 静音：保存当前音量后归零
      savedVolume.value = volume.value > 0 ? volume.value : 0.7
      volume.value = 0
      isMuted.value = true
    }
  }

  /** 循环切换播放模式 */
  function cyclePlayMode(): void {
    const idx = PLAY_MODES.findIndex(m => m.id === playMode.value)
    playMode.value = PLAY_MODES[(idx + 1) % PLAY_MODES.length].id
  }

  /** 播放下一曲 */
  function playNext(): void {
    // TODO: 接入播放列表后实现
  }

  /** 播放上一曲 */
  function playPrevious(): void {
    // TODO: 接入播放列表后实现
  }

  return {
    currentSong,
    currentTime,
    isPlaying,
    isFavorite,
    showLyrics,
    playbackRate,
    volume,
    isMuted,
    savedVolume,
    playMode,
    currentPlayMode,
    duration,
    progressPercent,
    effectiveVolume,
    formattedCurrentTime,
    formattedDuration,
    seek,
    togglePlay,
    toggleFavorite,
    toggleLyrics,
    setPlaybackRate,
    cyclePlaybackRate,
    setVolume,
    toggleMute,
    cyclePlayMode,
    setSong,
    playNext,
    playPrevious
  }
}, {
  // ========== 持久化配置 ==========
  persist: {
    // 持久化当前歌曲信息和收藏状态（刷新后可恢复）
    pick: ['currentSong', 'currentTime', 'isFavorite', 'playMode', 'volume', 'isMuted', 'playbackRate'],
    storage: localStorage,
    key: 'felixmusic:player'
  }
})

// ========== 工具函数 ==========

/** 格式化秒数为 m:ss 显示格式 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
