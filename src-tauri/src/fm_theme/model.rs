//! 主题相关数据结构
//!
//! 包含主题元信息和列表项的定义，用于前后端数据交换。

use serde::{Deserialize, Serialize};

// ============================================================================
// ThemeMeta — 主题元信息
// ============================================================================

/// 主题元信息（对应 JSON 文件中的 meta 字段）
///
/// JSON 文件中使用 camelCase 命名（isDark、builtIn），
/// 通过 rename_all 自动映射到 Rust 的 snake_case 字段。
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeMeta {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub author: Option<String>,
    #[serde(default)]
    pub version: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
    /// 是否为暗色主题
    #[serde(default)]
    pub is_dark: bool,
    /// 是否为内置主题（内置主题不可删除）
    #[serde(default)]
    pub built_in: bool,
}

// ============================================================================
// ThemeListItem — 主题列表项
// ============================================================================

/// 主题列表项（前端展示用）
#[derive(Debug, Clone, Serialize)]
pub struct ThemeListItem {
    pub id: String,
    pub name: String,
    pub author: Option<String>,
    pub description: Option<String>,
    pub is_dark: bool,
    pub built_in: bool,
    /// 相对于 themes 目录的文件名
    pub filename: String,
}
