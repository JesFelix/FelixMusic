//! 主题工具函数
//!
//! 提供主题目录管理、内置主题初始化、JSON 元信息提取等功能。

use std::fs;
use std::path::PathBuf;

use crate::fm_theme::model::{ThemeListItem, ThemeMeta};

// ============================================================================
// 内置主题数据（编译时嵌入）
// ============================================================================

/// 内置主题 JSON（编译时嵌入，路径相对于本文件）
const BUILTIN_THEMES: &[(&str, &str)] = &[
    ("default-light.json", include_str!("../../resource/themes/default-light.json")),
    ("default-dark.json", include_str!("../../resource/themes/default-dark.json")),
];

// ============================================================================
// 路径工具
// ============================================================================

/// 获取主题目录路径：<app_data>/FelixMusic/themes/
pub fn themes_dir() -> PathBuf {
    let mut dir = app_data_dir();
    dir.push("themes");
    dir
}

/// 获取应用数据目录
///
/// 使用 `directories` crate（dirs 的维护分支）。
/// Windows → C:\Users\<user>\AppData\Roaming\FelixMusic
/// Linux   → ~/.local/share/FelixMusic
/// macOS   → ~/Library/Application Support/FelixMusic
fn app_data_dir() -> PathBuf {
    if let Some(base_dirs) = directories::BaseDirs::new() {
        base_dirs.data_dir().join("FelixMusic")
    } else {
        PathBuf::from(".")
    }
}

// ============================================================================
// 初始化
// ============================================================================

/// 确保主题目录存在，并在首次启动时写入内置主题文件
pub fn initialize() {
    let dir = themes_dir();
    fs::create_dir_all(&dir).expect("创建主题目录失败");

    for (filename, content) in BUILTIN_THEMES {
        let filepath = dir.join(filename);
        if !filepath.exists() {
            fs::write(&filepath, content)
                .unwrap_or_else(|e| eprintln!("写入内置主题 {} 失败: {}", filename, e));
        }
    }
}

// ============================================================================
// JSON 解析工具
// ============================================================================

/// 从主题 JSON 内容中提取 meta 对象
///
/// 先通过 serde_json 解析完整 JSON，再取出 `meta` 字段并序列化回来。
/// 比括号计数法更健壮，不会因字符串中包含 `{` `}` 而出错。
pub fn extract_meta(content: &str) -> String {
    if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(content) {
        if let Some(meta) = parsed.get("meta") {
            return serde_json::to_string(meta).unwrap_or_else(|_| String::from("{}"));
        }
    }
    String::from("{}")
}

// ============================================================================
// 主题列表扫描
// ============================================================================

/// 扫描主题目录，返回所有可用主题的列表
///
/// 按 built_in 优先、name 字母顺序排序。
pub fn scan_themes() -> Result<Vec<ThemeListItem>, String> {
    let dir = themes_dir();
    let mut themes: Vec<ThemeListItem> = Vec::new();
    println!("初始化系统主题，扫描路径: {:?}", dir);

    let entries = fs::read_dir(&dir).map_err(|e| format!("读取主题目录失败: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("遍历目录项失败: {}", e))?;
        let path = entry.path();

        // 只处理 .json 文件
        if path.extension().and_then(|e| e.to_str()) != Some("json") {
            continue;
        }

        let content = fs::read_to_string(&path).unwrap_or_else(|_| String::from("{}"));

        let meta_json = extract_meta(&content);
        match serde_json::from_str::<ThemeMeta>(&meta_json) {
            Ok(meta) => {
                let filename = path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown")
                    .to_string();

                println!(
                    "[FelixMusic] 解析到主题: {} (id={}, dark={})",
                    filename, meta.id, meta.is_dark
                );

                themes.push(ThemeListItem {
                    id: meta.id.clone(),
                    name: meta.name,
                    author: meta.author,
                    description: meta.description,
                    is_dark: meta.is_dark,
                    built_in: meta.built_in,
                    filename,
                });
            }
            Err(e) => {
                let filename = path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown");
                eprintln!(
                    "[FelixMusic] 解析主题文件 '{}' 的 meta 失败: {} | meta 内容: {}",
                    filename, e, meta_json
                );
            }
        }
    }

    // 按 built_in 优先、name 排序
    themes.sort_by(|a, b| {
        b.built_in
            .cmp(&a.built_in)
            .then_with(|| a.name.cmp(&b.name))
    });

    println!("读取到 {} 个主题文件", themes.len());
    Ok(themes)
}