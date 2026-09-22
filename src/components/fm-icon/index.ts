/**
 * SVG 图标自动导入脚本
 *
 * 双模式处理：
 *   1. 创建剥离 fill 的 symbol（默认模式）→ 支持颜色继承和 color prop
 *   2. 缓存原始 SVG 数据（keepOriginal 模式）→ 保留多色图标原始填充
 */

// ============================================================================
// 原始 SVG 数据缓存（供 keepOriginal 模式使用）
// ============================================================================

/** 单个图标的结构化数据 */
export interface SvgIconData {
  viewBox: string
  innerHTML: string
}

const svgDataMap = new Map<string, SvgIconData>()

/**
 * 根据图标名称获取原始 SVG 数据（保留 fill）
 *
 * @param name  图标名称（不含前缀）
 * @returns     SVG 数据，未找到则返回 null
 */
export function getSvgData(name: string): SvgIconData | null {
  return svgDataMap.get(name) ?? null
}

// ============================================================================
// fill 属性剥离（用于 symbol，使其支持 currentColor 继承）
// ============================================================================

/**
 * 递归移除 SVG 元素及其子元素上的 fill 属性
 *
 * 移除 fill 后，元素自然继承父级 fill: currentColor，
 * 使 color prop 和 CSS 颜色继承正常工作。
 */
function removeFillAttributes(element: Element): void {
  if (element.hasAttribute && element.hasAttribute('fill')) {
    element.removeAttribute('fill')
  }
  for (let i = 0; i < element.children.length; i++) {
    removeFillAttributes(element.children[i])
  }
}

// ============================================================================
// 加载入口
// ============================================================================

/**
 * 导入所有 SVG 图标：
 *   1. 将剥离 fill 的版本注册为 DOM symbol（默认模式）
 *   2. 将原始版本缓存到 Map（keepOriginal 模式）
 *
 * 在 main.ts 应用启动时调用。
 */
export function loadSvgIcons(): void {
  const svgFiles = import.meta.glob('./icon/**/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  // 创建容器用于存放 symbol
  const svgContainer = document.createElement('div')
  svgContainer.id = 'svg-icons-container'
  svgContainer.style.position = 'absolute'
  svgContainer.style.width = '0'
  svgContainer.style.height = '0'
  svgContainer.style.overflow = 'hidden'

  Object.entries(svgFiles).forEach(([path, content]) => {
    const iconName = path.replace('./icon/', '').replace('.svg', '')
    const svgContent = content as string
    const parser = new DOMParser()

    // ---- 1. 缓存在原始 SVG 数据（保留 fill） ----
    const originalDoc = parser.parseFromString(svgContent, 'image/svg+xml')
    const originalSvg = originalDoc.querySelector('svg')
    if (originalSvg) {
      svgDataMap.set(iconName, {
        viewBox: originalSvg.getAttribute('viewBox') || '0 0 1024 1024',
        innerHTML: originalSvg.innerHTML,
      })
    }

    // ---- 2. 创建剥离 fill 的 symbol（默认模式） ----
    const strippedDoc = parser.parseFromString(svgContent, 'image/svg+xml')
    const strippedSvg = strippedDoc.querySelector('svg')
    if (strippedSvg) {
      const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
      symbol.id = `icon-${iconName}`

      const viewBox = strippedSvg.getAttribute('viewBox')
      if (viewBox) {
        symbol.setAttribute('viewBox', viewBox)
      }

      // 复制子元素并移除 fill 属性
      while (strippedSvg.firstChild) {
        const child = strippedSvg.firstChild
        if (child.nodeType === Node.ELEMENT_NODE) {
          removeFillAttributes(child as Element)
        }
        symbol.appendChild(child)
      }

      const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      wrapper.style.display = 'none'
      wrapper.appendChild(symbol)
      svgContainer.appendChild(wrapper)
    }
  })

  document.body.appendChild(svgContainer)
}
