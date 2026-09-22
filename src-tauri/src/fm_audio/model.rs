//! 音频相关数据结构
//!
//! 包含歌曲文件和播放状态的定义，用于前后端数据交换。

use serde::{Deserialize, Serialize};

// ============================================================================
// SongFile — 歌曲文件信息
// ============================================================================

/// 扫描到的歌曲文件信息，通过 Tauri 命令返回给前端展示
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SongFile {
    /// 文件的绝对路径
    pub path: String,
    /// 文件名（不含扩展名，用于显示）
    pub name: String,
    /// 文件扩展名（小写），如 "mp3"、"flac"
    pub extension: String,
}

// ============================================================================
// PlaybackStatus — 播放状态快照
// ============================================================================

/// 播放器当前状态快照，由音频命令返回给前端
#[derive(Debug, Clone, Serialize)]
pub struct PlaybackStatus {
    /// 是否有歌曲正在播放或暂停中
    pub is_playing: bool,
    /// 当前播放的歌曲信息
    pub current_song: Option<SongFile>,
    /// 当前播放索引
    pub current_index: Option<usize>,
    /// 是否有下一首
    pub has_next: bool,
    /// 是否有上一首
    pub has_previous: bool,
    /// 是否处于用户主动暂停状态
    pub is_paused: bool,
}
