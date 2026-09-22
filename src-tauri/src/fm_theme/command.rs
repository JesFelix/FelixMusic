//! 主题管理命令
//!
//! 提供主题列表查询、读取、导入、删除等主题管理相关的 Tauri 命令。

use crate::fm_theme::model::ThemeListItem;
use crate::fm_theme::utils;

/// 获取所有可用主题列表
#[tauri::command]
pub fn list_themes() -> Result<Vec<ThemeListItem>, String> {
    utils::scan_themes()
}

/// 读取指定主题的完整 JSON 内容
#[tauri::command]
pub fn read_theme(filename: String) -> Result<String, String> {
    // 安全检查：防止路径穿越
    if filename.contains("..") || filename.contains('/') || filename.contains('\\') {
        return Err("非法文件名".to_string());
    }

    let filepath = utils::themes_dir().join(&filename);
    if !filepath.exists() {
        return Err(format!("主题文件不存在: {}", filename));
    }

    std::fs::read_to_string(&filepath).map_err(|e| format!("读取主题文件失败: {}", e))
}

/// 获取主题目录的路径（用于提示用户在哪里放置自定义主题）
#[tauri::command]
pub fn get_themes_dir() -> String {
    utils::themes_dir().to_string_lossy().to_string()
}

/// 在文件管理器中打开主题目录
#[tauri::command]
pub fn open_themes_dir() -> Result<(), String> {
    let dir = utils::themes_dir();
    opener::open(&dir).map_err(|e| format!("打开目录失败: {}", e))
}

/// 导入自定义主题：将 JSON 内容写入 themes 目录
///
/// 如果文件已存在则覆盖，导入后前端需调用 list_themes 刷新列表。
#[tauri::command]
pub fn import_theme(filename: String, content: String) -> Result<(), String> {
    // 安全检查：防止路径穿越
    if filename.contains("..") || filename.contains('/') || filename.contains('\\') {
        return Err("非法文件名".to_string());
    }

    // 只允许 .json 后缀
    if !filename.ends_with(".json") {
        return Err("主题文件必须以 .json 结尾".to_string());
    }

    let filepath = utils::themes_dir().join(&filename);
    std::fs::write(&filepath, &content).map_err(|e| format!("写入主题文件失败: {}", e))
}

/// 删除指定主题文件
///
/// 内置主题（default-light.json / default-dark.json）不可通过此接口删除。
/// 仅自定义（导入的）主题支持删除。
#[tauri::command]
pub fn delete_theme(filename: String) -> Result<(), String> {
    // 安全检查：防止路径穿越
    if filename.contains("..") || filename.contains('/') || filename.contains('\\') {
        return Err("非法文件名".to_string());
    }

    if !filename.ends_with(".json") {
        return Err("主题文件必须以 .json 结尾".to_string());
    }

    let filepath = utils::themes_dir().join(&filename);
    if !filepath.exists() {
        return Err(format!("主题文件不存在: {}", filename));
    }

    // 读取文件解析 meta，检查是否为内置主题
    let content = std::fs::read_to_string(&filepath).unwrap_or_default();
    let meta_json = utils::extract_meta(&content);
    if let Ok(meta) = serde_json::from_str::<crate::fm_theme::model::ThemeMeta>(&meta_json) {
        if meta.built_in {
            return Err("内置主题不可删除".to_string());
        }
    }

    std::fs::remove_file(&filepath).map_err(|e| format!("删除主题文件失败: {}", e))
}