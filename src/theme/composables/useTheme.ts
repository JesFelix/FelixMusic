/**
 * useTheme — 主题状态管理 Composable
 *
 * 工作流程：
 *   1. 应用启动 → 调用 Rust list_themes 获取所有可用主题
 *   2. 用户选择主题 → 调用 Rust read_theme 读取完整 JSON
 *   3. 调用 engine.applyThemeFile() 将主题注入 DOM
 *   4. 自动持久化当前选择到 localStorage
 */
import { ref } from 'vue'
import type { Ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { applyThemeFile, clearThemeProperties } from '../engine'
import type { ThemeFile, ThemeFileMeta } from '../engine'

// ============================================================================
// localStorage 键名
// ============================================================================
const STORAGE_KEY = 'felixmusic:theme:current'

// ============================================================================
// 全局单例状态
// ============================================================================
let initialized = false

/** 主题列表（所有可用主题的元信息） */
const themeList: Ref<ThemeListItem[]> = ref([])

/** 当前主题 ID */
const currentThemeId: Ref<string> = ref('default-light')

/** 当前是否暗色主题 */
const isDark: Ref<boolean> = ref(false)

/** 当前主题的完整元信息 */
const currentMeta: Ref<ThemeFileMeta | null> = ref(null)

/** 主题系统是否已完成初始化（加载列表 + 激活主题） */
const ready: Ref<boolean> = ref(false)

// ============================================================================
// 类型
// ============================================================================

/** Rust list_themes 返回的列表项 */
export interface ThemeListItem {
  id: string
  name: string
  author: string | null
  description: string | null
  is_dark: boolean
  built_in: boolean
  filename: string
}

// ============================================================================
// 内部工具
// ============================================================================

function saveToStorage(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch { /* 静默 */ }
}

function loadFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

// ============================================================================
// 主题加载
// ============================================================================

/**
 * 从 Rust 后端加载主题列表
 */
/** 内置主题回退数据（当 Rust 后端不可用或返回空时使用） */
const FALLBACK_THEMES: ThemeListItem[] = [
  {
    id: 'default-light',
    name: '浅色',
    author: 'FelixMusic',
    description: '默认亮色主题',
    is_dark: false,
    built_in: true,
    filename: 'default-light.json',
  },
  {
    id: 'default-dark',
    name: '深色',
    author: 'FelixMusic',
    description: '默认暗色主题',
    is_dark: true,
    built_in: true,
    filename: 'default-dark.json',
  },
]

async function loadThemeList(): Promise<void> {
  try {
    const list = await invoke<ThemeListItem[]>('list_themes')
    if (list.length > 0) {
      themeList.value = list
      console.log('[FelixMusic Theme] 加载到', list.length, '个主题')
    } else {
      // 后端返回空列表（目录中无主题文件），回退到内置数据
      console.warn('[FelixMusic Theme] 后端返回空主题列表，使用回退数据')
      themeList.value = FALLBACK_THEMES
    }
  } catch (e) {
    console.error('[FelixMusic Theme] 加载主题列表失败:', e)
    // 回退：使用内置主题硬编码数据（不依赖后端）
    themeList.value = FALLBACK_THEMES
  }
}

/** 已读取的主题文件缓存（id → ThemeFile） */
const themeFileCache = new Map<string, ThemeFile>()

/**
 * 读取并解析指定主题的完整内容
 *
 * 如果 Rust 后端不可用（如纯 Vite 开发模式），
 * 返回与内置回退数据匹配的默认主题内容，保证页面不崩溃。
 */
async function loadThemeContent(filename: string): Promise<ThemeFile> {
  // 先查缓存
  const cached = themeFileCache.get(filename)
  if (cached) return cached

  try {
    const json = await invoke<string>('read_theme', { filename })
    const themeFile = JSON.parse(json) as ThemeFile
    themeFileCache.set(filename, themeFile)
    return themeFile
  } catch (e) {
    console.error(`[FelixMusic Theme] 读取主题文件 '${filename}' 失败:`, e)
    // 返回最小可用的回退主题，确保 activateTheme 不崩溃
    const fallback: ThemeFile = {
      meta: {
        id: filename.replace('.json', ''),
        name: filename,
        isDark: filename.includes('dark'),
      },
      base: {},
    }
    return fallback
  }
}

/**
 * 应用指定主题到 DOM
 */
async function activateTheme(filename: string): Promise<void> {
  const themeFile = await loadThemeContent(filename)

  clearThemeProperties()
  applyThemeFile(themeFile)

  currentThemeId.value = themeFile.meta.id
  isDark.value = themeFile.meta.isDark
  currentMeta.value = themeFile.meta
}

// ============================================================================
// 公开 API
// ============================================================================

/**
 * 切换到指定主题
 * @param themeId  主题 ID（对应 JSON 中 meta.id）
 */
async function setTheme(themeId: string): Promise<void> {
  const item = themeList.value.find((t) => t.id === themeId)
  if (!item) {
    console.warn(`[FelixMusic Theme] 主题 "${themeId}" 不存在`)
    return
  }

  await activateTheme(item.filename)
  saveToStorage(themeId)
}

/**
 * 获取主题目录路径（用于提示用户在哪里放置自定义主题文件）
 */
async function getThemesDir(): Promise<string> {
  return await invoke<string>('get_themes_dir')
}

/**
 * 在文件管理器中打开主题目录
 */
async function openThemesDir(): Promise<void> {
  await invoke('open_themes_dir')
}

/**
 * 刷新主题列表（当用户在目录中添加/删除主题文件后调用）
 */
async function refreshThemes(): Promise<void> {
  themeFileCache.clear()
  await loadThemeList()
}

/**
 * 导入自定义主题：将 JSON 内容写入 themes 目录并刷新列表
 *
 * @param filename  文件名（如 "my-theme.json"）
 * @param content   主题 JSON 字符串
 */
async function importTheme(filename: string, content: string): Promise<void> {
  await invoke('import_theme', { filename, content })
  await refreshThemes()
}

/**
 * 删除指定主题并自动切换到其他可用主题
 *
 * 如果删除的是当前使用的主题：
 *   - 有其他主题 → 自动切换到第一个
 *   - 无其他主题 → 回退到 CSS 层默认值（theme-light.css / theme-dark.css）
 *
 * @param filename  要删除的主题文件名
 */
async function deleteTheme(filename: string): Promise<void> {
  // 记录删除前是否为当前主题
  const isCurrentTheme = themeList.value.some(
    (t) => t.filename === filename && t.id === currentThemeId.value
  )

  // 调用 Rust 后端删除文件
  await invoke('delete_theme', { filename })

  // 清空该文件的缓存
  themeFileCache.delete(filename)

  // 刷新列表
  await refreshThemes()

  // 如果删除的是当前主题，需要切换
  if (isCurrentTheme) {
    if (themeList.value.length > 0) {
      // 有其他主题：切换到第一个
      const first = themeList.value[0]
      await activateTheme(first.filename)
      saveToStorage(first.id)
    } else {
      // 没有主题了：回退到 CSS 层默认值
      // data-theme 属性已在 activateTheme 中设置，clearThemeProperties 不会清除它
      clearThemeProperties()
      currentThemeId.value = isDark.value ? 'default-dark' : 'default-light'
      currentMeta.value = null
      saveToStorage(currentThemeId.value)
    }
  }
}

// ============================================================================
// 初始化
// ============================================================================

async function init(): Promise<void> {
  if (initialized) return
  initialized = true

  try {
    // 1. 从 Rust 后端加载主题列表
    await loadThemeList()

    // 2. 恢复上次使用的主题
    const savedId = loadFromStorage()
    if (savedId && themeList.value.some((t) => t.id === savedId)) {
      const item = themeList.value.find((t) => t.id === savedId)!
      await activateTheme(item.filename)
    } else {
      // 首次启动：使用第一个内置亮色主题
      const lightTheme = themeList.value.find((t) => !t.is_dark && t.built_in)
      if (lightTheme) {
        await activateTheme(lightTheme.filename)
      } else if (themeList.value.length > 0) {
        await activateTheme(themeList.value[0].filename)
      }
    }
  } catch (e) {
    console.error('[FelixMusic Theme] 初始化主题系统失败:', e)
    // 即使初始化失败，也确保有回退数据可用
    if (themeList.value.length === 0) {
      themeList.value = FALLBACK_THEMES
    }
  } finally {
    // 无论成功或失败，标记初始化完成，避免 UI 永久显示 loading
    ready.value = true
  }
}

// ============================================================================
// Composable 入口
// ============================================================================

export interface UseThemeReturn {
  /** 所有可用主题的元信息列表 */
  themeList: Ref<ThemeListItem[]>
  /** 当前主题 ID */
  currentThemeId: Ref<string>
  /** 当前是否暗色 */
  isDark: Ref<boolean>
  /** 当前主题完整元信息 */
  currentMeta: Ref<ThemeFileMeta | null>
  /** 主题系统是否已初始化完成（首次加载列表 + 激活主题） */
  ready: Ref<boolean>
  /** 切换到指定主题 */
  setTheme: (themeId: string) => Promise<void>
  /** 获取主题目录路径 */
  getThemesDir: () => Promise<string>
  /** 打开主题目录 */
  openThemesDir: () => Promise<void>
  /** 刷新主题列表 */
  refreshThemes: () => Promise<void>
  /** 导入自定义主题 */
  importTheme: (filename: string, content: string) => Promise<void>
  /** 删除主题（自动处理当前主题切换 / CSS 回退） */
  deleteTheme: (filename: string) => Promise<void>
}

export function useTheme(): UseThemeReturn {
  init()

  return {
    themeList,
    currentThemeId,
    isDark,
    currentMeta,
    ready,
    setTheme,
    getThemesDir,
    openThemesDir,
    refreshThemes,
    importTheme,
    deleteTheme,
  }
}
