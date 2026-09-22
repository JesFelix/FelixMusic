
/** 单个选项 */
interface FmRadioItem {
    /** 选项唯一标识 */
    id: string
    /** 选项显示文字 */
    label: string
    /** 选项值 */
    value: string
    /** 是否选中 */
    isSelect: boolean
    /** 网格跨度：占几列（对应 a-grid-item 的 span），默认 1 */
    gridSpan?: number
    /** 是否为后缀元素：true 时该选项填充所在行的剩余空间（对应 a-grid-item 的 suffix） */
    isSuffix?: boolean
    /** 是否禁用该选项 */
    disabled?: boolean
}

/** 响应式网格列数（对应 a-grid 的 cols） */
interface FmGridCols {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
    xxxl?: number
}

export type { FmRadioItem, FmGridCols }