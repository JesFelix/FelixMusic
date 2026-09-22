<template>
  <div class="theme-setting-page default-page-format">
    <!-- ====== 页面标题 ====== -->
    <div class="fm-title">
      <div class="left">
        <h1 class="fm-title-heading">主题设置</h1>
        <p class="fm-title-subtitle">选择你喜欢的主题风格，打造专属的音乐空间</p>
      </div>
      <div class="right">
        <input ref="fileInputRef" type="file" accept=".json" style="display: none" @change="handleFileSelected" />
        <a-button class="addThemeBut" @click="handleImportClick">
          <fm-icon name="fm-theme-add" />
          <span style="margin-left: 4px;">导入自定义主题</span>
        </a-button>
      </div>
    </div>


    <div style="margin-bottom: 16px;background-color: var(--fm-base-color-gray-350);width: 100%;height: 1px;"></div>

    <!-- ====== 主题卡片网格 ====== -->
    <div class="theme-grid" v-if="!loading && themeList.length > 0">
      <div v-for="theme in themeList" :key="theme.id" class="theme-card"
        :class="{ active: currentThemeId === theme.id }">
        <!-- 主题预览色块 -->
        <div class="theme-preview" :style="{ background: getPreviewGradient(theme) }" @click="handleSelectTheme(theme)">
          <!-- 选中标记 -->
          <div class="theme-check" v-if="currentThemeId === theme.id">
            <icon-check size="18" />
          </div>
          <!-- 删除按钮：仅自定义主题可删除，内置主题受保护 -->
          <a-button v-if="!theme.built_in" class="theme-delete-btn" size="mini" status="danger" shape="circle"
            @click.stop="handleDeleteTheme(theme)" title="删除主题">
            <template #icon>
              <icon-delete size="18" />
            </template>
          </a-button>
        </div>

        <!-- 主题信息 -->
        <div class="theme-info">
          <div class="theme-name-row">
            <span class="theme-name">{{ theme.name }}</span>
            <span class="theme-badge" :class="theme.is_dark ? 'is-dark' : 'is-light'">
              {{ theme.is_dark ? '暗色' : '亮色' }}
            </span>
          </div>
          <div class="theme-author" v-if="theme.author">by {{ theme.author }}</div>
          <div class="theme-desc" v-if="theme.description">{{ theme.description }}</div>
        </div>
      </div>
    </div>

    <!-- ====== 加载状态 ====== -->
    <div class="empty-state" v-if="loading">
      <fm-icon name="fm-theme" :size="32" color="var(--fm-base-color-text-tertiary)" />
      <p>加载中...</p>
    </div>

    <!-- ====== 空状态：没有可用主题 ====== -->
    <div class="empty-state" v-if="!loading && themeList.length === 0">
      <fm-icon name="fm-theme" :size="48" color="var(--fm-base-color-text-tertiary)" />
      <p>暂无可用主题</p>
      <p class="empty-hint">所有主题已被删除，当前使用 CSS 内置默认样式</p>
      <p class="empty-hint">将主题 JSON 文件放入主题目录或导入即可恢复</p>
      <a-button class="action-btn" size="small" @click="handleOpenDir">打开主题目录</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="ThemeSetting">
/**
 * 主题设置页面
 *
 * 功能：
 *   1. 展示所有可用主题（从 Rust 后端 list_themes 获取）
 *   2. 点击主题卡片一键切换
 *   3. 打开主题目录 / 刷新列表
 *   4. 亮色/暗色/内置标签展示
 *
 * 后端对接：
 *   - list_themes     → 获取主题列表
 *   - read_theme      → 读取主题完整 JSON（切换时）
 *   - open_themes_dir → 在文件管理器中打开主题目录
 */
import { ref, onMounted, watch } from 'vue'
import { useTheme } from '@/theme'
import type { ThemeListItem } from '@/theme'

// ========== 主题系统 ==========

const {
  themeList,
  currentThemeId,
  ready,
  setTheme,
  openThemesDir,
  importTheme,
  deleteTheme,
} = useTheme()

// ========== 状态 ==========

/** 是否正在加载/刷新主题列表（绑定 useTheme 内部的 ready 状态） */
const loading = ref(!ready.value)

/** 隐藏文件输入框引用（用于触发原生文件选择器） */
const fileInputRef = ref<HTMLInputElement | null>(null)

// ========== 方法 ==========

/** 选择并应用主题 */
async function handleSelectTheme(theme: ThemeListItem): Promise<void> {
  // 避免重复切换当前主题
  if (currentThemeId.value === theme.id) return

  try {
    await setTheme(theme.id)
  } catch (e) {
    console.error('[主题设置] 切换主题失败:', e)
  }
}

/** 删除主题（需用户确认） */
async function handleDeleteTheme(theme: ThemeListItem): Promise<void> {
  const confirmed = window.confirm(
    `确定要删除主题「${theme.name}」吗？\n\n` +
    (currentThemeId.value === theme.id
      ? '这是当前正在使用的主题，删除后将自动切换到其他主题或默认样式。'
      : '此操作不可撤销。')
  )
  if (!confirmed) return

  try {
    await deleteTheme(theme.filename)
    console.log(`[主题设置] 主题已删除: ${theme.name}`)
  } catch (e) {
    console.error('[主题设置] 删除主题失败:', e)
    alert(`删除失败：${e instanceof Error ? e.message : '未知错误'}`)
  }
}

// ========== 导入自定义主题 ==========

/** 点击"导入自定义主题"按钮 → 触发隐藏的 file input */
function handleImportClick(): void {
  fileInputRef.value?.click()
}

/** 用户选择了 JSON 文件 → 读取内容 → 规范化 → 导入 */
async function handleFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // 清空 input，使重复选择同一文件也能触发 change 事件
  input.value = ''

  // 确保文件名以 .json 结尾
  const filename = file.name.endsWith('.json')
    ? file.name
    : `${file.name}.json`

  try {
    const rawContent = await readFileAsText(file)

    // 校验 + 格式兼容 + 补全缺失字段
    const normalizedContent = normalizeThemeJson(rawContent, filename)

    await importTheme(filename, normalizedContent)
    console.log(`[主题设置] 主题导入成功: ${filename}`)
  } catch (e) {
    console.error('[主题设置] 导入主题失败:', e)
    alert(`导入失败：${e instanceof Error ? e.message : '未知错误'}`)
  }
}

/** 读取 File 对象为文本 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file, 'utf-8')
  })
}

/**
 * 校验并规范化主题 JSON
 *
 * 做三件事：
 *   1. 基础校验：确保是合法 JSON 且包含 meta 对象
 *   2. 格式兼容：tokens → base、colors → color 自动转换
 *   3. 补全缺失字段：自动生成 id（从文件名）
 *
 * @returns 规范化后的 JSON 字符串（可直接传给 Rust import_theme）
 */
function normalizeThemeJson(content: string, filename: string): string {
  let json: unknown
  try {
    json = JSON.parse(content)
  } catch {
    throw new Error('JSON 格式无效，请检查文件内容')
  }

  if (!json || typeof json !== 'object') {
    throw new Error('主题文件内容不能为空')
  }

  const theme = json as Record<string, unknown>

  // ---- meta 校验 ----
  if (!theme.meta || typeof theme.meta !== 'object') {
    throw new Error('主题文件缺少 meta 字段')
  }

  const meta = theme.meta as Record<string, unknown>

  // ---- 自动生成 id ----
  if (!meta.id) {
    meta.id = filename.replace(/\.json$/i, '')
  }
  if (typeof meta.id !== 'string') {
    throw new Error('meta.id 必须是字符串')
  }

  // ---- tokens → base 自动转换 ----
  if (!theme.base && theme.tokens && typeof theme.tokens === 'object') {
    theme.base = theme.tokens
    delete theme.tokens
  }

  if (!theme.base || typeof theme.base !== 'object') {
    throw new Error('主题文件缺少 base（或 tokens）字段')
  }

  // ---- colors → color 自动转换 ----
  const base = theme.base as Record<string, unknown>
  if (!base.color && base.colors && typeof base.colors === 'object') {
    base.color = base.colors
    delete base.colors
  }

  // ---- 补全 isDark ----
  if (meta.isDark === undefined) {
    meta.isDark = false
  }

  return JSON.stringify(theme, null, 2)
}

/** 在文件管理器中打开主题目录 */
async function handleOpenDir(): Promise<void> {
  try {
    await openThemesDir()
  } catch (e) {
    console.error('[主题设置] 打开主题目录失败:', e)
  }
}

// ========== 主题预览渐变 ==========

/**
 * 根据主题的暗/亮属性生成预览渐变色
 *
 * 暗色主题 → 深色基底 + 品牌紫点缀
 * 亮色主题 → 浅色基底 + 品牌紫点缀
 */
function getPreviewGradient(theme: ThemeListItem): string {
  if (theme.is_dark) {
    return 'linear-gradient(135deg, #1a1a2e 0%, #24243a 40%, #7B61FF 100%)'
  }
  return 'linear-gradient(135deg, #F5F2FF 0%, #EDE8FF 40%, #7B61FF 100%)'
}

// ========== 初始化 ==========

onMounted(() => {
  // useTheme() 内部已调用 init()，但可能尚未完成
  // 如果已经 ready，loading 直接为 false；否则等待 ready 变为 true
  if (ready.value) {
    loading.value = false
  } else {
    const stop = watch(ready, (isReady) => {
      if (isReady) {
        loading.value = false
        stop() // 只监听一次
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.fm-title {
  display: flex;
  text-align: start;
  margin-bottom: var(--fm-base-spacing-lg);

  .left,
  .right {
    flex: 1;
    position: relative;
  }

  .fm-title-heading {
    font-size: var(--fm-base-font-size-3xl);
    font-weight: var(--fm-base-font-weight-bold);
    color: var(--fm-base-color-text-primary);
    margin: 0 0 var(--fm-base-spacing-xs) 0;
  }

  .fm-title-subtitle {
    font-size: var(--fm-base-font-size-base);
    color: var(--fm-base-color-text-tertiary);
    margin: 0;
  }
}


.addThemeBut {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: var(--fm-base-color-brand-500);
  color: var(--fm-base-color-brand-100);
  border-radius: var(--fm-base-radius-md);

  &:hover {
    background-color: var(--fm-base-color-brand-700);
    color: var(--fm-base-color-text-inverse);
  }

  &:active {
    background-color: var(--fm-base-color-brand-600);
  }
}

// ========== 主题卡片网格 ==========

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--fm-base-spacing-lg);
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-sm);
  user-select: none;
  transition: transform 0.2s ease;

  .theme-preview {
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(108, 92, 231, 0.25);
    }

    &.active {
      outline: 3px solid var(--fm-base-color-brand-400);
      outline-offset: 3px;
    }
  }
}

// ========== 主题预览色块 ==========

.theme-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--fm-base-radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  position: relative;

  // 删除按钮：默认隐藏，hover 时显示
  .theme-delete-btn {
    position: absolute;
    width: 30px;
    height: 30px;
    bottom: 10px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover .theme-delete-btn {
    opacity: 1;
  }
}

// ========== 选中勾号 ==========

.theme-check {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  background: var(--fm-base-color-brand-400);
  border-radius: var(--fm-base-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: check-pop 0.3s ease;

  svg {
    stroke: #fff;
  }
}

@keyframes check-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// ========== 主题信息 ==========

.theme-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 4px;
}

.theme-name-row {
  display: flex;
  align-items: center;
  gap: var(--fm-base-spacing-xs);
  flex-wrap: wrap;
}

.theme-name {
  font-size: var(--fm-base-font-size-base);
  font-weight: var(--fm-base-font-weight-semibold);
  color: var(--fm-base-color-text-primary);
}

// ========== 标签（暗色/亮色/内置） ==========

.theme-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: var(--fm-base-radius-sm);
  font-size: var(--fm-base-font-size-xs);
  font-weight: var(--fm-base-font-weight-medium);
  line-height: 1.6;

  &.is-dark {
    background: var(--fm-base-color-background-hover);
    color: var(--fm-base-color-text-tertiary);
  }

  &.is-light {
    background: var(--fm-base-color-brand-50);
    color: var(--fm-base-color-brand-500);
  }

  &.badge-builtin {
    background: var(--fm-base-color-brand-100);
    color: var(--fm-base-color-brand-500);
  }
}

.theme-desc {
  font-size: var(--fm-base-font-size-xs);
  color: var(--fm-base-color-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
}

.theme-author {
  font-size: 11px;
  color: var(--fm-base-color-text-tertiary);
  font-style: italic;
  text-align: start;
}

// ========== 空状态 / 加载状态 ==========

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--fm-base-spacing-sm);
  padding: var(--fm-base-spacing-3xl) var(--fm-base-spacing-lg);
  color: var(--fm-base-color-text-tertiary);
  font-size: var(--fm-base-font-size-base);

  .empty-hint {
    font-size: var(--fm-base-font-size-xs);
    color: var(--fm-base-color-text-tertiary);
    margin: 0;
  }

  .action-btn {

    color: var(--fm-base-color-brand-400);

    &:hover {
      font-weight: bold;
      color: var(--fm-base-color-brand-650);
    }
  }
}
</style>
