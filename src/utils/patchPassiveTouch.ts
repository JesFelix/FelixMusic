/**
 * 猴子补丁：消除 Chrome 对 touchstart / touchmove / touchend 非 passive 的警告
 *
 * ## 背景
 * Chrome 要求页面上的触摸事件监听器标记 `{ passive: true }`，
 * 否则浏览器必须等待 JS 执行完才能决定是否允许滚动（阻塞渲染）。
 * Vue runtime 和 Arco 等第三方库内部注册的 touch 事件默认不带 passive，
 * Chrome 会在控制台打印：
 *   [Violation] Added non-passive event listener to a scroll-blocking
 *   'touchstart' event. Consider marking event handler as 'passive'...
 *
 * ## 原理
 * 在 app 初始化前替换 `EventTarget.prototype.addEventListener`，
 * 对 touch 事件自动补上 `passive: true`（仅当调用方未显式指定时）。
 * 已在 main.ts 最顶部导入，保证在所有库之前生效。
 *
 * ## 安全性
 * - 非 touch 事件：直接走原始方法，零性能/行为影响
 * - touch 事件且调用方显式指定了 passive：尊重调用方意图，不覆盖
 * - touch 事件且未指定 passive：默认补 passive: true
 */
export function patchPassiveTouch(): void {
  const orig = EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    // 非触摸事件 —— 直接走原始方法，不做任何干预
    const isTouch = type === 'touchstart' || type === 'touchmove' || type === 'touchend'
    if (!isTouch) {
      return orig.call(this, type, listener, options)
    }

    // 将 options 统一为对象形式（兼容旧版 boolean 用法）
    let opts: AddEventListenerOptions
    if (typeof options === 'object') {
      opts = options
    } else {
      opts = { capture: !!options }
    }

    // 仅在 passive 未被调用方显式指定时，默认设为 true
    if (opts.passive === undefined) {
      opts.passive = true
    }

    return orig.call(this, type, listener, opts)
  }
}
