<template>
  <main ref="contentRef" class="settings-content">
    <div class="settings-section" v-for="section in data" :key="section.id">
      <div class="settings-heading">{{ section.label }}</div>

      <div class="setting-content">
        <template v-for="option in section.settings" :key="option.id">
          <!-- 1. 选择组件：select -->
          <a-space v-if="option.type === 'select'" direction="vertical" fill>
            <span class="setting-font">{{ option.label }}</span>
            <a-select :default-value="option.value" :style="selectStyle">
              <a-option v-for="opt in option.options" :key="opt" :value="opt">{{ opt }}</a-option>
            </a-select>
          </a-space>

          <!-- 2. 单、多选组件：FmRadioGroup -->
          <a-space v-else direction="vertical" fill>
            <span class="setting-font">{{ option.label }}</span>
            <FmRadioGroup :options="option.options" :is-single="option.type === 'radio'" />
          </a-space>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup name="SettingsContent">
import { ref } from 'vue'
import type { FmRadioItem } from '@/components/fm-radio-group'

// ============================================================================
// 类型定义（export 供 index.vue 使用）
// ============================================================================

/** 单个设置项：根据 type 区分渲染哪种组件（判别联合，便于模板内收窄类型） */
export type SettingOption =
  | {
      id: string
      label: string
      /** 选择组件（下拉） */
      type: 'select'
      /** 下拉选项 */
      options?: string[]
      /** 默认选中值 */
      value?: string
    }
  | {
      id: string
      label: string
      /** 单/多选组件（radio = 单选，checkbox = 多选） */
      type: 'radio' | 'checkbox'
      options?: FmRadioItem[]
    }

/** 设置分组：一个导航项 + 该分组下的设置项列表 */
export interface SettingItem {
  id: string
  label: string
  settings: SettingOption[]
}

// ============================================================================
// Props
// ============================================================================

defineProps<{
  data: SettingItem[]
}>()

// 内容容器引用（供后续滚动定位使用）
const contentRef = ref<HTMLElement | null>(null)

// 选择组件统一样式
const selectStyle = {
  width: '130px',
  border: '1px solid var(--fm-base-color-brand-300)',
  borderRadius: 'var(--fm-base-radius-6)',
}
</script>

<style lang="scss" scoped>
.settings-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-top: var(--fm-base-spacing-sm);
  scroll-behavior: smooth;

  display: grid;
  grid-template-columns: max-content 1fr;
  /* 标题与内容在各自行内等高 */
  align-items: stretch;
  /* 关键：不让网格行被拉伸去撑满容器高度，行高由内容自身决定(配合滚动) */
  align-content: start;
  row-gap: var(--fm-base-spacing-14);
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
}

.settings-section {
  /* 每个 section 是父网格的一整行：横跨两列，内部用 subgrid 对齐到父网格的列，
     因此 section 拥有真实盒模型，整体高度由右侧 .setting-content 决定 */
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  /* 标题列与右侧内容等高(stretch)，行高取两者中较大者，即由内容高度决定 */
  align-items: stretch;
}

.settings-heading {
  font-weight: bold;
  color: #333;
  font-size: 15px;
  padding-top: 5px;
  text-align: start;
  padding: var(--fm-base-spacing-sm);
  /* 标题内容最大宽度 160px，只显示一行，超出部分显示省略号 */
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.setting-content {
  padding: var(--fm-base-spacing-sm);
  padding-left: var(--fm-base-spacing-12);
  color: #666;
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-md);

  .setting-font {
    font-size: var(--fm-base-font-size-base);
    color: var(--fm-base-color-text-primary);
    font-weight: bold;
  }
}
</style>
