//! 音乐文件夹扫描器
//!
//! 递归扫描指定目录，收集所有支持的音频文件。
//! 支持的格式：mp3, wav, flac, ogg, m4a, aac

use std::fs;
use std::path::Path;

use crate::fm_audio::model::SongFile;

// ============================================================================
// 常量
// ============================================================================

/// 支持的音频文件扩展名（不含点号，小写）
const SUPPORTED_EXTENSIONS: &[&str] = &["mp3", "wav", "flac", "ogg", "m4a", "aac"];

// ============================================================================
// 公共函数
// ============================================================================

/// 递归扫描指定文件夹，收集所有支持的音频文件
///
/// # 参数
/// - `folder_path`: 要扫描的文件夹路径（绝对路径或相对路径）
///
/// # 返回
/// - `Ok(Vec<SongFile>)`: 扫描到的歌曲列表，按文件名排序；空文件夹返回空列表
/// - `Err(String)`: 路径不存在、不是目录或无法读取时的错误信息
pub fn scan_folder(folder_path: &str) -> Result<Vec<SongFile>, String> {
    let path = Path::new(folder_path);

    // ---- 路径校验 ----
    if !path.exists() {
        return Err(format!("路径不存在: {}", folder_path));
    }
    if !path.is_dir() {
        return Err(format!("路径不是一个文件夹: {}", folder_path));
    }

    // ---- 递归扫描 ----
    let mut songs = Vec::new();
    scan_dir(path, &mut songs);

    // ---- 按文件名排序 ----
    songs.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

    Ok(songs)
}

// ============================================================================
// 内部函数
// ============================================================================

/// 递归遍历目录，将匹配的音乐文件收集到 `songs` 列表中
fn scan_dir(dir: &Path, songs: &mut Vec<SongFile>) {
    let entries = match fs::read_dir(dir) {
        Ok(entries) => entries,
        Err(e) => {
            eprintln!("[音频扫描] 跳过目录 '{}': {}", dir.display(), e);
            return;
        }
    };

    for entry in entries.flatten() {
        let entry_path = entry.path();

        if entry_path.is_dir() {
            scan_dir(&entry_path, songs);
        } else if entry_path.is_file() {
            if let Some(ext) = get_extension_lowercase(&entry_path) {
                if SUPPORTED_EXTENSIONS.contains(&ext.as_str()) {
                    let name = entry_path
                        .file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("未知文件")
                        .to_string();

                    songs.push(SongFile {
                        path: entry_path.to_string_lossy().to_string(),
                        name,
                        extension: ext,
                    });
                }
            }
        }
    }
}

/// 获取文件的小写扩展名（不含点号），如果无扩展名则返回 None
fn get_extension_lowercase(path: &Path) -> Option<String> {
    path.extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
}