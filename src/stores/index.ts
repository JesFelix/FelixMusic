/**
 * FelixMusic Pinia 状态管理 — 统一导出入口
 *
 * 所有 Store 都从这里导出，组件统一通过 `@/stores` 引用。
 */
import { createPinia, Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export { useNavigationStore } from './models/navigation'
export { useWindowStore } from './models/window'
export { usePlayerStore } from './models/player'
export type { NavigationItem, NavigationSection } from './models/navigation'
export type { SongInfo, PlayMode, PlayModeConfig } from './models/player'
export { PLAY_MODES } from './models/player'

export default function usePinia(): Pinia {
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate) // 注册持久化插件（导航栏状态等需要通过 localStorage 持久化）
    return pinia;
}
