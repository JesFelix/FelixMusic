/**
 * 公共组件统一入口
 *
 * 集中导出 / 注册项目内的 fm-* 系列封装组件：
 *   - FmIcon        图标组件
 *   - FmSearchInput 搜索输入框组件
 *   - FmRadioGroup  单选/多选网格选择组组件
 *
 * 两种使用方式：
 *   1. 按需引入：import { FmIcon } from '@/components'
 *   2. 全局注册：main.ts 中 app.use(fmComponents)
 *      （install 内部会自动加载 SVG 图标 symbol，再注册所有组件）
 *
 * 新增组件时：在下方 import、componentList 中同步补充即可。
 */

import type { App, Component } from 'vue'

import FmIcon from './fm-icon/index.vue'
import FmSearchInput from './fm-search-input/index.vue'
import FmRadioGroup from './fm-radio-group/index.vue'
import { loadSvgIcons } from './fm-icon'

// ============================================================================
// 统一导出：供按需 import 使用
// ============================================================================

export { FmIcon, FmSearchInput, FmRadioGroup, loadSvgIcons }

// ============================================================================
// 全局注册：作为 Vue 插件，app.use(fmComponents) 一次性完成
//   1. 加载 SVG 图标 symbol（FmIcon 依赖）
//   2. 注册所有公共组件
// ============================================================================

/** 需要全局注册的组件清单 */
const componentList: Array<{ name: string; component: Component }> = [
    { name: 'FmIcon', component: FmIcon },
    { name: 'FmSearchInput', component: FmSearchInput },
    { name: 'FmRadioGroup', component: FmRadioGroup },
]

/** 统一注册插件 */
const fmComponents = {
    install(app: App): void {
        // 先注册 SVG symbol（剥离 fill）+ 缓存原始数据，供 FmIcon 使用
        loadSvgIcons()

        // 再注册所有公共组件
        componentList.forEach(({ name, component }) => {
            app.component(name, component)
        })
    },
}

export default fmComponents
