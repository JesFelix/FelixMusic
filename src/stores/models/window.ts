/**
 * 窗口状态管理
 *
 * 管理 Tauri 窗口的大小/最大化状态。
 * 将窗口状态从 Header.vue 组件中抽离到全局 Store，
 * 任何组件都可以方便地获取和操作窗口状态。
 *
 * 注意：窗口状态不持久化（每次启动窗口都是初始大小）。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const useWindowStore = defineStore('window', () => {
  // ========== 状态 ==========

  /** 窗口是否处于最大化状态 */
  const isMaximized = ref(false)

  // ========== 内部变量 ==========
  let unlistenResize: (() => void) | null = null
  let initialized = false

  // ========== 初始化 ==========

  /**
   * 初始化窗口状态监听（应用启动时调用一次）
   *
   * - 查询当前窗口是否最大化
   * - 监听窗口缩放事件，自动同步 isMaximized 状态
   */
  async function init(): Promise<void> {
    if (initialized) return
    initialized = true

    const appWindow = getCurrentWindow()

    // 初始状态查询
    isMaximized.value = await appWindow.isMaximized()

    // 监听窗口缩放事件（用户拖拽标题栏双击、快捷键等操作）
    unlistenResize = await appWindow.onResized(async () => {
      isMaximized.value = await appWindow.isMaximized()
    })
  }

  /** 销毁监听器（如果需要手动清理） */
  function destroy(): void {
    unlistenResize?.()
    unlistenResize = null
    initialized = false
  }

  // ========== 窗口操作 ==========

  /** 最小化窗口 */
  function minimize(): void {
    invoke('minimize_window')
  }

  /** 最大化/还原窗口（根据当前状态切换） */
  function toggleMaximize(): void {
    if (isMaximized.value) {
      invoke('unmaximize_window')
    } else {
      invoke('maximize_window')
    }
  }

  /** 关闭窗口 */
  function close(): void {
    invoke('close_window')
  }

  return {
    isMaximized,
    init,
    destroy,
    minimize,
    toggleMaximize,
    close
  }
})
