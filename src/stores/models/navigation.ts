/**
 * 导航栏状态管理
 *
 * 管理左侧导航菜单数据，菜单按 type 分为三类：
 * - system： 系统菜单（精选、排行榜、音乐添加、问题反馈）
 * - user：   用户菜单（我喜欢的、最近播放、播放列表、本地音乐）
 * - express：快捷入口（主题、消息、设置）
 *
 * 使用 pinia-plugin-persistedstate 持久化 activeId。
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// ========== 类型定义 ==========

/** 单个菜单项 */
export interface NavigationItem {
  /** 菜单项唯一标识 */
  id: string
  /** 菜单项显示名称 */
  name: string
  /** FmIcon 图标名称（不含 fm- 前缀） */
  icon: string
  /** 点击后跳转的 Vue Router 路径 */
  route: string
  /** 是否在导航中显示（默认 true，设为 false 可隐藏） */
  isDisplay?: boolean
}

/** 菜单分组（按 type 区分类别） */
export interface NavigationSection {
  /** 分组唯一标识 */
  id: string
  /** 菜单类型：system（系统菜单） | user（用户菜单） | express（快捷入口） */
  type: 'system' | 'user' | 'express'
  /** 分组内的菜单项列表 */
  items: NavigationItem[]
  /** 是否在导航中显示此分组（默认 true，设为 false 可隐藏整个分组） */
  isDisplay?: boolean
}

// ========== 默认导航数据 ==========

/**
 * 默认导航菜单数据
 *
 * 图标说明（暂用现有图标占位，后续替换为专用图标）：
 *   精选 fm-search → 需替换为 star 星形图标
 *   排行榜 fm-notice → 需替换为 crown 皇冠图标
 *   音乐添加 fm-search → 需替换为 note+plus 图标
 *   问题反馈 fm-setting → 需替换为 chat 对话图标
 *   我喜欢的 fm-theme → 需替换为 heart 爱心图标
 *   最近播放 fm-return → 需替换为 clock 时钟图标
 *   播放列表 fm-notice → 需替换为 list+note 图标
 *   本地音乐 fm-search → 需替换为 download 下载图标
 */
const defaultSections: NavigationSection[] = [
  {
    id: 'system',
    type: 'system',
    isDisplay: false,
    items: [
      { id: 'featured',   name: '精选',     icon: 'fm-selected',      route: '/selected',       isDisplay: true },
      { id: 'ranking',    name: '排行榜',   icon: 'fm-ranking-list',  route: 'null',            isDisplay: true },
      { id: 'add-music',  name: '音乐添加', icon: 'fm-music-1',       route: 'null',            isDisplay: true },
      { id: 'feedback',   name: '问题反馈', icon: 'fm-feedback',      route: 'null',            isDisplay: true },
    ]
  },
  {
    id: 'user',
    type: 'user',
    isDisplay: true,
    items: [
      { id: 'favorites',  name: '我喜欢的', icon: 'fm-like',       route: '/favorites',              isDisplay: true },
      { id: 'collection', name: '我的收藏', icon: 'fm-collection',  route: '/collection',       isDisplay: true },
      { id: 'recent',     name: '最近播放', icon: 'fm-recently',   route: '/recently-played',              isDisplay: true },
      { id: 'local',      name: '本地音乐', icon: 'fm-download',   route: '/local-music',              isDisplay: true },
      { id: 'test-page',  name: '测试页面', icon: 'fm-test',       route: '/test-page',              isDisplay: true },
    ]
  },
  {
    id: 'express',
    type: 'express',
    isDisplay: true,
    items: [
      { id: 'theme-setting',  name: '主题', icon: 'fm-theme',    route: '/theme-setting',   isDisplay: true },
      { id: 'message',        name: '消息', icon: 'fm-notice',   route: 'null',             isDisplay: true },
      { id: 'setting',        name: '设置', icon: 'fm-setting',  route: '/sys-setting',     isDisplay: true },
    ]
  }
]

// ========== Store 定义 ==========

export const useNavigationStore = defineStore('navigation', () => {
  // ---- 路由 ----
  const router = useRouter()

  // ---- 状态 ----
  const sections = ref<NavigationSection[]>(structuredClone(defaultSections))
  const activeId = ref<string>('featured') // 默认选中"精选"

  // ---- 计算属性 ----

  /** 系统菜单分组 */
  const systemSection = computed(() => sections.value.find(s => s.type === 'system'))

  /** 用户菜单分组 */
  const userSection = computed(() => sections.value.find(s => s.type === 'user'))

  /** 快捷入口分组 */
  const expressSection = computed(() => sections.value.find(s => s.type === 'express'))

  /** 当前激活的菜单项 */
  const activeItem = computed(() => {
    for (const section of sections.value) {
      const item = section.items.find(i => i.id === activeId.value)
      if (item) return item
    }
    return null
  })

  // ---- 操作方法 ----

  /** 设置当前激活的菜单项 */
  function setActive(id: string): void {
    activeId.value = id
  }

  /** 根据 route 反向定位并激活菜单项（用于路由变化时同步高亮） */
  function setActiveByRoute(route: string): void {
    for (const section of sections.value) {
      const item = section.items.find(i => i.route === route)
      if (item) {
        activeId.value = item.id
        return
      }
    }
  }

  /** 重置导航数据为默认值 */
  function reset(): void {
    sections.value = structuredClone(defaultSections)
    activeId.value = 'featured'
  }

  // ---- 路由跳转（统一封装） ----

  /**
   * 通过路由名称跳转
   * 同时根据 route 路径反向匹配并更新侧边栏高亮
   *
   * @param name  路由名称（如 'ThemeSetting'）
   */
  function navigateToByName(name: string): void {
    router.push({ name })
  }

  /**
   * 通过路由路径跳转
   * 同时更新侧边栏高亮
   *
   * @param path  路由路径（如 '/theme-setting'）
   */
  function navigateToByPath(path: string): void {
    router.push({ path })
  }

  /**
   * 菜单项点击跳转
   * 设置激活状态 + 导航到对应页面
   *
   * @param item  被点击的菜单项
   */
  function navigateToItem(item: NavigationItem): void {
    setActive(item.id)
    if (item.route === 'null') return;
    router.push({ path: item.route })
  }

  return {
    sections,
    activeId,
    systemSection,
    userSection,
    expressSection,
    activeItem,
    setActive,
    setActiveByRoute,
    reset,
    navigateToByName,
    navigateToByPath,
    navigateToItem,
  }
}, {
  // ========== 持久化配置 ==========
  persist: {
    // 只持久化当前激活项（刷新后仍定位在原菜单）
    pick: ['activeId'],
    storage: localStorage,
    key: 'felixmusic:navigation'
  }
})
