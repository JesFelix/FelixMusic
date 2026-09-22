/**
 * FelixMusic 主题引擎
 *
 * 职责：
 *   1. 将主题 JSON（base）扁平化为 CSS 变量
 *   2. 解析 {base.xxx.yyy} 引用为 var(--fm-base-xxx-yyy)
 *   3. 将 CSS 变量批量应用到 document.documentElement
 */
// ============================================================================
// 类型
// ============================================================================

/** 主题 JSON 的顶层结构 */
export interface ThemeFile {
  meta: ThemeFileMeta
  base: Record<string, Record<string, unknown>>
}

export interface ThemeFileMeta {
  id: string
  name: string
  author?: string
  version?: string
  description?: string
  isDark: boolean
  builtIn?: boolean
}

// ============================================================================
// 引用解析
// ============================================================================

/**
 * 解析 JSON 中的引用 token
 *
 * 主题 JSON 中用 {base.color.brand.500} 语法引用其他 token，
 * 解析为 CSS var() 引用：var(--fm-base-color-brand-500)
 *
 * 示例：
 *   {base.color.brand.500} → var(--fm-base-color-brand-500)
 *   {base.color.accent.mint} → var(--fm-base-color-accent-mint)
 *   #F5F5F7 → #F5F5F7（非引用值原样返回）
 */
const REFERENCE_REGEX = /\{base\.([^}]+)\}/g

function resolveReferences(value: string): string {
  return value.replace(REFERENCE_REGEX, (_match, path: string) => {
    // path = "color.brand.500" → varName = "--fm-base-color-brand-500"
    const varName = `--fm-base-${path.replace(/\./g, '-')}`
    return `var(${varName})`
  })
}

// ============================================================================
// 扁平化
// ============================================================================

/**
 * 将嵌套对象扁平化为 CSS 变量映射，同时解析引用 token
 *
 * 示例：
 *   { color: { brand: { "500": "#6C5CE7" } } }
 *   → { "--fm-base-color-brand-500": "#6C5CE7" }
 *
 *   { semantic: { primary: "{base.color.brand.500}" } }
 *   → { "--fm-base-color-semantic-primary": "var(--fm-base-color-brand-500)" }
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix: string
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, varName)
      )
    } else {
      result[varName] = resolveReferences(String(value))
    }
  }

  return result
}

// ============================================================================
// 主题应用
// ============================================================================

/**
 * 将 ThemeFile 解析并应用到 DOM
 *
 * 处理流程：
 *   1. 将 base 扁平化为 --fm-base-* CSS 变量（同时解析 {base.xxx} 引用）
 *   2. 将所有变量通过 setProperty 注入 document.documentElement
 *   3. 设置 data-theme 属性（暗色/亮色标识）
 *
 * @param themeFile  完整的主题 JSON 对象
 */
export function applyThemeFile(themeFile: ThemeFile): void {
  const root = document.documentElement

  // ---- 1. 解析并应用 base tokens（含引用解析） ----
  const baseVars = flattenObject(themeFile.base, '--fm-base')
  for (const [varName, value] of Object.entries(baseVars)) {
    root.style.setProperty(varName, value)
  }

  // ---- 2. 设置 data-theme 属性（暗色/亮色标识） ----
  root.dataset.theme = themeFile.meta.isDark ? 'dark' : 'light'
}

/**
 * 清除所有通过 setProperty 注入的 --fm-* CSS 变量
 * 用于切换主题前清理旧值
 */
export function clearThemeProperties(): void {
  const root = document.documentElement

  // 收集所有以 --fm- 开头的内联样式变量
  const style = root.getAttribute('style')
  if (!style) return

  const keep: string[] = []
  for (const decl of style.split(';')) {
    const trimmed = decl.trim()
    if (trimmed && !trimmed.startsWith('--fm-')) {
      keep.push(trimmed)
    }
  }

  if (keep.length > 0) {
    root.setAttribute('style', keep.join('; ') + ';')
  } else {
    root.removeAttribute('style')
  }
}
