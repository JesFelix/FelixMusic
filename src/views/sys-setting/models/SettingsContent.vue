<template>
  <main ref="contentRef" class="settings-content">
    <div class="settings-section" v-for="section in data" :key="section.id">
      <div class="settings-heading">{{ section.label }}</div>

      <div class="setting-content">
        <template v-for="item in section.settings" :key="item.id">
          <!-- 下拉选择 -->
          <div v-if="item.type === 'select'" class="setting-item">
            <span class="setting-font">{{ item.label }}</span>
            <a-select :model-value="getIsSelect(item)" :style="selectStyle" @change="handleSelectChange(item, $event)">
              <a-option v-for="opt in item.options" :key="opt.key" :value="opt.value">{{ opt.label }}</a-option>
            </a-select>
          </div>

          <!-- 单选 -->
          <div v-else-if="item.type === 'radio'" class="setting-item">
            <span class="setting-font">{{ item.label }}</span>
            <a-radio-group :model-value="getIsSelect(item)" @change="handleSelectChange(item, $event)">
              <a-radio v-for="opt in item.options" :key="opt.key" :value="opt.value">{{ opt.label }}</a-radio>
            </a-radio-group>
          </div>

          <!-- 可选 -->
          <div v-else-if="item.type === 'optional'" class="setting-item">
            <span class="setting-font">{{ item.label }}</span>
            <div class="optional-list">
              <a-checkbox
                v-for="(opt, index) in item.options"
                :key="opt.key ?? index"
                :model-value="opt.isSelect === true"
                class="optional-option"
                @change="handleCheckboxChange(opt, $event)"
              >
                {{ opt.label }}
              </a-checkbox>
            </div>
          </div>

          <!-- 快捷键 -->
          <div v-else-if="item.type === 'shortcuts'" class="setting-item">
            
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup name="SettingsContent">
// ============================================================================
// 类型定义（export 供 index.vue 使用）
// ============================================================================

// type1: 下拉选择
type SelectItem = {
  key: string
  label: string
  value: string
  isSelect: boolean
}

// type2: 快捷键
type ShortcutsItem = {
  id: string
  label: string
  shortcutKey: string
  globalShortcutKey: string
  conflict?: boolean
}

type SettingOption = {
  id: string
  label: string | string[]
  type: 'select' | 'radio' | 'checkbox' | 'optional' | 'shortcuts',
  defaultValue?: string,
  options?: SelectItem[] | ShortcutsItem[]
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
// const contentRef = ref<HTMLElement | null>(null)

// ============================================================================
// 工具方法
// ============================================================================
const getIsSelect = (option: SettingOption) => {
  return option.options?.find(item => item.isSelect)?.value ?? ''
}

// 处理下拉选择、单选、可选的改变事件 radio
const handleSelectChange = (
  item: SettingOption,
  value: unknown
): void => {
  item.options?.forEach(option => {
    option.isSelect = option.value === String(value)
  })
}

// 处理多选的改变事件 checkbox
const handleCheckboxChange = (
  item: SelectItem,
  value: unknown
): void => {
  if (typeof value !== 'boolean') {
    return
  }
  item.isSelect = value
}

// ============================================================================
// 选择组件统一样式
// ============================================================================
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

.shortcuts-header{
  width: 100%;
  height: 46px;
}
</style>
