<template>
  <main ref="contentRef" class="settings-content">
    <div class="settings-section" v-for="section in data" :key="section.id">
      <div class="settings-heading">{{ section.label }}</div>

      <div class="setting-content">
        <template v-for="option in section.settings" :key="option.id">
          <!-- 下拉选择 -->
          <div v-if="option.type === 'select'" class="setting-item">
            <span class="setting-font">{{ option.label }}</span>
            <a-select v-model="selectedValues[option.id]" :style="selectStyle" :aria-label="option.label">
              <a-option v-for="opt in option.options" :key="opt" :value="opt">{{ opt }}</a-option>
            </a-select>
          </div>

          <!-- 单选 -->
          <div v-else-if="option.type === 'radio'" class="setting-item">
            <span class="setting-font">{{ option.label }}</span>
            <a-radio-group v-model="selectedValues[option.id]" :aria-label="option.label">
              <a-radio v-for="opt in option.options" :key="opt.id" :value="opt.value">
                {{ opt.label }}
              </a-radio>
            </a-radio-group>
          </div>

          <!-- 可选项 -->
          <div v-else-if="option.type === 'optional'" class="setting-item">
            <span class="setting-font">{{ option.label }}</span>
            <div class="optional-list">
              <a-checkbox v-for="opt in option.options" :key="opt.id" v-model="checkedValues[opt.id]" class="optional-option">
                {{ opt.label }}
              </a-checkbox>
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup name="SettingsContent">
import { reactive, ref } from 'vue'

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
      /** 单选、复选或可选项 */
      type: 'radio' | 'checkbox' | 'optional'
      options?: SettingOptionItem[]
    }

interface SettingOptionItem {
  id: string
  label: string
  value: string
  isSelect?: boolean
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

const props = defineProps<{
  data: SettingItem[]
}>()

// 内容容器引用（供后续滚动定位使用）
const contentRef = ref<HTMLElement | null>(null)

// 为每个设置项维护响应式值，保证单选、下拉和可选项都能正确回显与修改
const selectedValues = reactive<Record<string, string>>({})
const checkedValues = reactive<Record<string, boolean>>({})

for (const section of props.data) {
  for (const option of section.settings) {
    if (option.type === 'select') {
      selectedValues[option.id] = option.value ?? option.options?.[0] ?? ''
    } else if (option.type === 'radio') {
      const selected = option.options?.find(item => item.isSelect) ?? option.options?.[0]
      selectedValues[option.id] = selected?.value ?? ''
    } else if (option.type === 'optional') {
      for (const item of option.options ?? []) {
        checkedValues[item.id] = item.isSelect === true
      }
    }
  }
}

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
  color: var(--fm-base-color-text-primary);
  font-size: var(--fm-base-font-size-base);
  font-weight: var(--fm-base-font-weight-semibold);
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
  color: var(--fm-base-color-text-secondary);
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: var(--fm-base-spacing-md);

  .setting-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--fm-base-spacing-sm);
  }

  .setting-font {
    color: var(--fm-base-color-text-primary);
    font-size: var(--fm-base-font-size-base);
    font-weight: var(--fm-base-font-weight-semibold);
  }

  .optional-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fm-base-spacing-md);
  }

  .optional-option {
    color: var(--fm-base-color-text-secondary);
  }
}
</style>
