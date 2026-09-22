<template>
    <!-- ====================================================================
         单选模式：Radio（a-radio-group + a-radio）
         ==================================================================== -->
    <a-radio-group
        v-if="isSingle"
        v-model="singleValue"
        class="fm-radio-group"
        :disabled="disabled"
    >
        <a-grid :cols="cols" :col-gap="colGap" :row-gap="rowGap">
            <a-grid-item
                v-for="item in localOptions"
                :key="item.id"
                class="fm-radio-group__item"
                :span="item.gridSpan ?? 1"
                :suffix="item.isSuffix ?? false"
            >
                <a-radio :value="item.value" :disabled="item.disabled ?? disabled">
                    {{ item.label }}
                </a-radio>
            </a-grid-item>
        </a-grid>
    </a-radio-group>

    <!-- ====================================================================
         多选模式：Checkbox（a-checkbox-group + a-checkbox）
         ==================================================================== -->
    <a-checkbox-group
        v-else
        v-model="multiValue"
        class="fm-radio-group"
        :disabled="disabled"
    >
        <a-grid :cols="cols" :col-gap="colGap" :row-gap="rowGap">
            <a-grid-item
                v-for="item in localOptions"
                :key="item.id"
                class="fm-radio-group__item"
                :span="item.gridSpan ?? 1"
                :suffix="item.isSuffix ?? false"
            >
                <a-checkbox :value="item.value" :disabled="item.disabled ?? disabled">
                    {{ item.label }}
                </a-checkbox>
            </a-grid-item>
        </a-grid>
    </a-checkbox-group>
</template>

<script lang="ts" setup name="FmRadioGroup">
import { computed, ref, watch } from 'vue'
import type { FmRadioItem, FmGridCols } from './index.ts'

// ============================================================================
// 高端封装：单选/多选「网格选择组」
//   - isSingle = true  → 单选控件（a-radio-group）
//   - isSingle = false → 多选控件（a-checkbox-group）
//   - 选中状态由每个选项的 isSelect 字段驱动（而非外部 v-model）
//   - 统一走响应式网格布局（a-grid），每个选项可独立配置 span / suffix
// ============================================================================

// ============================================================================
// Props
// ============================================================================

const props = withDefaults(defineProps<{
    /** 选项列表（每个选项用 isSelect 标记是否选中） */
    options: FmRadioItem[]
    /** 是否单选：true = 单选(Radio)，false = 多选(Checkbox)，默认 true */
    isSingle?: boolean
    /** 网格列数（响应式），默认 lg/xl 3 列、xxl 4 列 */
    cols?: FmGridCols
    /** 列间距，默认 12 */
    colGap?: number
    /** 行间距，默认 16 */
    rowGap?: number
    /** 是否整体禁用，默认 false */
    disabled?: boolean
}>(), {
    isSingle: true,
    cols: () => ({ lg: 3, xl: 3, xxl: 4 }),
    colGap: 12,
    rowGap: 16,
    disabled: false,
})

// ============================================================================
// Emits
// ============================================================================

const emit = defineEmits<{
    /** 选中值变化：单选为 string，多选为 string[] */
    change: [value: string | string[]]
}>()

// ============================================================================
// 内部选项状态
// 选中状态（isSelect）由组件内部维护：拷贝一份 props.options 到 localOptions，
// 避免直接修改 props 破坏单向数据流。外部传入的 options 变化时重置拷贝。
// ============================================================================

/**
 * 规范化选项的选中状态。
 *
 * 单选模式（isSingle=true）下只能有一个选项被选中：
 *   - 全部为 false → 保持全部未选中（不做处理）
 *   - 存在多个 true → 只保留第一个 true，其余全部置为 false
 *
 * 多选模式不做约束，仅做浅拷贝。
 */
function normalizeOptions(list: FmRadioItem[]): FmRadioItem[] {
    // 多选：直接拷贝，不限制选中数量
    if (!props.isSingle) {
        return list.map(o => ({ ...o }))
    }

    // 拷贝并全部置为未选中
    const result = list.map(o => ({ ...o, isSelect: false }))

    // 找到第一个原本为 true 的选项；全为 false 时保持全部未选中
    const firstSelected = list.findIndex(o => o.isSelect)
    if (firstSelected >= 0) {
        result[firstSelected].isSelect = true
    }

    return result
}

const localOptions = ref<FmRadioItem[]>(normalizeOptions(props.options))

watch(() => props.options, (val) => {
    localOptions.value = normalizeOptions(val)
})

// ============================================================================
// 选中值（computed 读写）：
//   getter 从 isSelect 推导出 Arco 需要的 modelValue
//   setter 把 Arco 回传的新值写回到各选项的 isSelect，并向外 emit change
// ============================================================================

/** 单选值：isSelect=true 的选项 value */
const singleValue = computed<string | number | boolean>({
    get: () => localOptions.value.find(o => o.isSelect)?.value ?? '',
    set: (val) => {
        const v = val as string
        localOptions.value.forEach(o => { o.isSelect = o.value === v })
        emit('change', v)
    },
})

/** 多选值：所有 isSelect=true 的选项 value 数组 */
const multiValue = computed<(string | number | boolean)[]>({
    get: () => localOptions.value.filter(o => o.isSelect).map(o => o.value),
    set: (val) => {
        const v = val as string[]
        localOptions.value.forEach(o => { o.isSelect = v.includes(o.value) })
        emit('change', v)
    },
})
</script>

<style lang="scss" scoped>
// ============================================================================
// 根容器：占满父级宽度
// ============================================================================

.fm-radio-group {
    width: 100%;
}

// ============================================================================
// 网格项：文字单行显示，超出显示省略号（与 set-regular 内的处理一致）
// ============================================================================

.fm-radio-group__item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    :deep(.arco-radio),
    :deep(.arco-checkbox) {
        max-width: 100%;
        overflow: hidden;
    }

    :deep(.arco-radio-label),
    :deep(.arco-checkbox-label) {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
