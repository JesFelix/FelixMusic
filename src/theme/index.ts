/**
 * FelixMusic 主题系统
 *
 * 使用方式：
 *   import { useTheme } from '@/theme'
 *   const { setTheme, isDark, themeList } = useTheme()
 *
 * CSS 变量命名：
 *   --fm-base-{类别}-{key}     (如 --fm-base-color-brand-500)
 *
 * 组件中使用：
 *   .my-sidebar { background: var(--fm-base-color-background-surface); }
 */
export { useTheme } from './composables/useTheme'
export type { UseThemeReturn, ThemeListItem } from './composables/useTheme'

export { applyThemeFile, clearThemeProperties } from './engine'
export type { ThemeFile, ThemeFileMeta } from './engine'
