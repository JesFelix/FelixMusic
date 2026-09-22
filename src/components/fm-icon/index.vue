<template>
  <!-- ================================================================
       双模式渲染：
       1. 默认模式（无 color 且无 keepOriginal）：<use> + symbol（fill 已剥离）
          → 继承父级 currentColor，适配导航栏等场景
       2. 保持原色模式（keepOriginal 且无 color）：v-html 内联原始 SVG
          → 保留多色图标（如 fm-favorites 的粉色渐变）
       3. 指定颜色（有 color 或 hoverColor）：强制覆盖所有子元素
       ================================================================ -->
  <!-- 模式 2：保持原始颜色 → 内联渲染保留所有 fill -->
  <svg
    v-if="useOriginal"
    :class="svgClass"
    :style="svgStyle"
    :viewBox="originalData!.viewBox"
    aria-hidden="true"
    v-html="originalData!.innerHTML"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  />

  <!-- 模式 1/3：颜色可控 → <use> 引用已剥离 fill 的 symbol -->
  <svg
    v-else
    :class="svgClass"
    :style="svgStyle"
    aria-hidden="true"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <use :xlink:href="iconHref" />
  </svg>
</template>

<script setup lang="ts" name="FmIcon">
/**
 * FmIcon — SVG 图标组件
 *
 * 默认模式（无 color，无 keepOriginal）：
 *   图标继承父级 text color，适用于导航菜单等 UI 场景。
 *
 * keepOriginal 模式：
 *   保留 SVG 原始多色填充，适用于特殊图标（如 fm-favorites）。
 *
 * color 模式（有 color 或 hoverColor）：
 *   强制所有子元素使用指定颜色。
 *
 * Props:
 *   name         — 图标名称（不含前缀）
 *   size         — 图标大小，默认 16px
 *   color        — 图标颜色（不传则继承父级 currentColor）
 *   hoverColor   — 悬停颜色
 *   keepOriginal — 是否保留 SVG 原始多色（默认 false）
 *   className    — 自定义 CSS 类名
 */
import { computed, ref } from 'vue'
import { getSvgData } from './index'

// ============================================================================
// Props
// ============================================================================
interface Props {
  name: string
  size?: string | number
  color?: string
  hoverColor?: string
  /** 设为 true 时保留 SVG 原始的多色填充（如渐变），不继承父级颜色 */
  keepOriginal?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '16px',
  color: '',
  hoverColor: '',
  keepOriginal: false,
  className: '',
})

// ============================================================================
// SVG 原始数据（仅 keepOriginal 模式使用）
// ============================================================================

const originalData = computed(() =>
  props.keepOriginal ? getSvgData(props.name) : null
)

/** 是否使用内联原始 SVG（keepOriginal 且没有设置颜色） */
const useOriginal = computed(
  () => props.keepOriginal && !props.color && !props.hoverColor
)

// ============================================================================
// Symbol 引用（默认模式 + color 模式）
// ============================================================================

const iconHref = computed(() => `#icon-${props.name}`)

// ============================================================================
// 悬停状态
// ============================================================================
const isHovered = ref(false)

const onMouseEnter = () => {
  if (props.hoverColor) isHovered.value = true
}

const onMouseLeave = () => {
  isHovered.value = false
}

// ============================================================================
// 计算属性
// ============================================================================

/** 当前生效的颜色 */
const activeColor = computed(() => {
  if (isHovered.value && props.hoverColor) return props.hoverColor
  return props.color || ''
})

/** 是否启用颜色覆盖模式（有 color 或有 hoverColor） */
const hasColor = computed(() => activeColor.value !== '')

/** 最终生效的 CSS 颜色值 */
const currentColor = computed(() => {
  // keepOriginal 模式且没有显式颜色 → 不设置 color，保留原始填充
  if (useOriginal.value) return undefined
  // 有显式颜色 → 使用该颜色
  if (hasColor.value) return activeColor.value
  // 默认 → 继承父级
  return 'currentColor'
})

/** CSS 类名 */
const svgClass = computed(() => {
  const parts = ['svg-icon']
  // keepOriginal 模式且没有显式颜色时，不添加 color-mode
  if (!useOriginal.value) {
    parts.push('color-mode')
  }
  if (props.className) parts.push(props.className)
  return parts.join(' ')
})

/** 内联样式 */
const svgStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size,
    ...(currentColor.value !== undefined ? { color: currentColor.value } : {}),
    cursor: props.hoverColor ? 'pointer' : undefined,
    transition: 'color 0.2s ease',
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
  overflow: hidden;
  flex-shrink: 0;
  fill: currentColor;
}

// ============================================================================
// 颜色覆盖模式 — 仅当使用 <use>（symbol 已剥离 fill）时生效
//
// 因为 symbol 中元素已去除了原始 fill 属性，
// 父级 fill: currentColor 可以自然继承到所有子元素。
// ============================================================================
</style>
