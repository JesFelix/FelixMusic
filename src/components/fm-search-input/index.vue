<template>
<div
  ref="rootRef"
  class="fm-search"
  :class="{
    'fm-search--active': isActive,
    'fm-search--circle': type === 'circle',
    'fm-search--ellipse': type === 'ellipse',
    'fm-search--has-value': !!localValue,
  }"
  :style="rootStyle"
  @click="handleActivate"
  @mousedown="handleMouseDown"
>
  <span class="fm-search__icon">
    <fm-icon name="fm-search" :size="16" />
  </span>

  <div class="fm-search__body">
    <input
      ref="inputRef"
      v-model="localValue"
      class="fm-search__input"
      type="text"
      :placeholder="displayPlaceholder"
      :tabindex="isActive ? undefined : -1"
      @blur="handleBlur"
      @keydown.enter="handleEnter"
      @keydown.escape="handleEscape"
    />
  </div>

  <span
    v-if="isActive && localValue"
    class="fm-search__clear"
    @mousedown.prevent
    @click.stop="handleClear"
  >
    <fm-icon name="fm-close" :size="12" />
  </span>
</div>
</template>

<script lang="ts" setup name="FmSearchInput">
import { ref, watch, nextTick, computed } from "vue"

// ============================================================================
// Types
// ============================================================================

/** 可自定义的组件配色 */
export interface SearchInputColors {
  /** 收缩态背景色，默认 #ebebed */
  background?: string
  /** 展开态背景色，默认 #e6e6e9 */
  backgroundActive?: string
  /** 图标 / placeholder / 清除控件颜色，默认 #9e9e9e */
  iconColor?: string
  /** placeholder 文字颜色，默认 #9e9e9e */
  placeholderColor?: string
  /** 展开态图标颜色，默认 #6e6e6e */
  iconColorActive?: string
  /** 输入文字颜色，默认 #1e1e20 */
  textColor?: string
}

// ============================================================================
// Props
// ============================================================================

const props = withDefaults(defineProps<{
  placeholder?: string
  maxPlaceholderLength?: number
  maxPlaceholderLengthIdle?: number
  type?: "circle" | "ellipse"
  /** 自定义配色（按需传入，未传入的项保持内置默认值） */
  colors?: SearchInputColors
}>(), {
  placeholder: "搜索",
  maxPlaceholderLength: 10,
  maxPlaceholderLengthIdle: 2,
  type: "circle",
})

// v-model
const modelValue = defineModel<string>({ default: "" })

const emit = defineEmits<{
  search: [keyword: string]
}>()

// ============================================================================
// 内部状态
// ============================================================================

const isActive = ref(false)
const localValue = ref("")
const inputRef = ref<HTMLInputElement | null>(null)

// ============================================================================
// 配色 → CSS 自定义属性
// ============================================================================

const rootStyle = computed(() => {
  const c = props.colors
  if (!c) return undefined
  const style: Record<string, string> = {}
  if (c.background)      style["--fm-search-bg"] = c.background
  if (c.backgroundActive) style["--fm-search-bg-active"] = c.backgroundActive
  if (c.iconColor)        style["--fm-search-icon-color"] = c.iconColor
  if (c.placeholderColor) style["--fm-search-placeholder-color"] = c.placeholderColor
  if (c.iconColorActive)  style["--fm-search-icon-color-active"] = c.iconColorActive
  if (c.textColor)        style["--fm-search-text-color"] = c.textColor
  return Object.keys(style).length ? style : undefined
})

// ============================================================================
// placeholder 超长截断
// ============================================================================

const displayPlaceholder = computed(() => {
  const raw = props.placeholder
  const limit = isActive.value
    ? props.maxPlaceholderLength
    : (props.type === "ellipse" ? props.maxPlaceholderLengthIdle : props.maxPlaceholderLength)
  if (limit > 0 && raw.length > limit) {
    return raw.slice(0, limit) + "..."
  }
  return raw
})

// 外部 v-model 同步到内部
watch(modelValue, (val) => {
  localValue.value = val
}, { immediate: true })

// ============================================================================
// 事件处理
// ============================================================================

const handleActivate = (): void => {
  if (!isActive.value) {
    isActive.value = true
    nextTick(() => inputRef.value?.focus())
  }
}

/** 激活态下阻止组件内部点击导致 input 失焦，避免收起→展开的重复动画 */
const handleMouseDown = (e: MouseEvent): void => {
  if (isActive.value) e.preventDefault()
}

const handleBlur = (): void => {
  modelValue.value = localValue.value
  isActive.value = false
}

const handleEnter = (): void => {
  modelValue.value = localValue.value
  emit("search", localValue.value)
}

const handleEscape = (): void => {
  localValue.value = modelValue.value
  isActive.value = false
}

const handleClear = (): void => {
  localValue.value = ""
  modelValue.value = ""
  inputRef.value?.focus()
}

const getIconStyle = computed(() => {
  if (isActive.value || props.type === "ellipse") {
    return {
      marginTop: "2px"
    }
  }
  return
})
</script>

<style lang="scss" scoped>
// ============================================================================
// 设计令牌
// 所有颜色均可通过 colors prop 覆盖：var(--fm-search-xxx, 内置默认值)
// ============================================================================

$height:         32px;
$width-circle:   32px;
$width-ellipse:  96px;
$width-active:   220px;
$radius:         999px;
$padding-x:      12px;

$bg-idle:        var(--fm-search-bg, #ebebed);
$bg-active:      var(--fm-search-bg-active, #e6e6e9);
$icon-color:     var(--fm-search-icon-color, #9e9e9e);
$placeholder-color: var(--fm-search-placeholder-color, #9e9e9e);
$icon-active:    var(--fm-search-icon-color-active, #6e6e6e);
$text:           var(--fm-search-text-color, #1e1e20);

$transition:     0.25s cubic-bezier(0.4, 0, 0.2, 1);

// ============================================================================
// 根容器
// ============================================================================
.fm-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: $height;
  line-height: $height;
  border-radius: $radius;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  background-color: $bg-idle;
  border: 1.5px solid transparent;
  width: $width-ellipse;
  padding: 0 $padding-x;

  transition:
    width $transition,
    background-color $transition,
    border-color $transition,
    padding $transition;

  &--circle {
    width: $width-circle;
    padding: 0;

    &.fm-search--active {
      width: $width-active;
      padding: 0 $padding-x;
    }

    // 默认态：图标通过 margin-left 居中（支持 transition），body 隐藏
    &:not(.fm-search--active) {
      .fm-search__icon { margin-left: 8px; }
      .fm-search__body { opacity: 0; }
    }
  }

  &--active {
    width: $width-active;
    background-color: $bg-active;
    border-color: transparent;
    cursor: text;
  }

  &--has-value:not(&--active) {
    width: auto;
    max-width: 180px;
  }
}

// ============================================================================
// 搜索图标
// ============================================================================
.fm-search__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color $transition, margin-left $transition;
  color: $icon-color;

  .fm-search--active & {
    color: $icon-active;
  }
}

// ============================================================================
// 文本区域
// ============================================================================
.fm-search__body {
  flex: 1;
  min-width: 0;
  margin-left: 4px;
  transition: opacity $transition;
}

// ============================================================================
// 输入框
// ============================================================================
.fm-search__input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14.5px;
  line-height: 1;
  color: $text;
  pointer-events: none;

  // placeholder 独立配色，由 placeholderColor 控制
  &::placeholder {
    color: $placeholder-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px $bg-active inset;
    -webkit-text-fill-color: $text;
  }

  .fm-search--active & {
    pointer-events: auto;
  }
}

// ============================================================================
// 清除按钮 — 与图标 / placeholder 共享 iconColor
// ============================================================================
.fm-search__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: $radius;
  cursor: pointer;
  color: $icon-color;
  transition:
    color $transition;

  &:hover {
    color: #555;
  }
}
</style>
