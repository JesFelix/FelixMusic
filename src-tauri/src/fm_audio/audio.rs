//! 音频播放引擎
//!
//! 使用 rodio 0.22 crate 实现音频播放控制。
//! AudioState 通过 Tauri 全局状态管理整个播放生命周期，
//! Tauri 命令层（commands::audio）通过 State 注入共享同一个播放实例。
//!
//! ## rodio 0.22 API 架构
//!
//! - `DeviceSinkBuilder::open_default_sink()` → `MixerDeviceSink`（音频设备句柄）
//! - `MixerDeviceSink::mixer()` → `&Mixer`（混音器引用）
//! - `Player::connect_new(&mixer)` → `Player`（播放控制器，Send + Sync）
//! - `Decoder::try_from(File)` → 解码音频源
//! - `Player` 提供 pause/play/stop/skip_one/set_volume 等控制方法

use std::fs::File;
use std::sync::Mutex;

use rodio::{Decoder, DeviceSinkBuilder, Player};

use crate::fm_audio::model::{PlaybackStatus, SongFile};

// ============================================================================
// 全局状态结构
// ============================================================================

/// 音频播放全局状态，由 Tauri `manage()` 管理整个应用生命周期
pub struct AudioState {
    /// 音频设备句柄 —— 必须保持存活，否则播放停止
    /// 用 Mutex 包裹以满足 `Sync` 约束（内部 cpal 流是 Send 但不一定 Sync）
    pub(crate) _sink: Mutex<rodio::MixerDeviceSink>,

    /// 音频播放控制器 —— `Player` 自身是 `Send + Sync`，无需额外同步
    pub(crate) player: Player,

    /// 当前播放列表
    pub(crate) playlist: Mutex<Vec<SongFile>>,

    /// 当前播放歌曲的索引（None 表示未在播放）
    pub(crate) current_index: Mutex<Option<usize>>,

    /// 是否处于暂停状态（用户主动暂停 vs 自然播放完毕）
    pub(crate) is_paused: Mutex<bool>,
}

// ============================================================================
// AudioState 实现
// ============================================================================

impl AudioState {
    /// 创建音频播放状态实例
    ///
    /// 打开默认音频输出设备并创建播放器。
    /// 如果系统无可用音频输出设备，返回错误。
    pub fn new() -> Result<Self, String> {
        // 打开默认音频输出设备
        let sink = DeviceSinkBuilder::open_default_sink()
            .map_err(|e| format!("无法打开默认音频输出设备: {}", e))?;

        // 通过混音器创建播放控制器
        let player = Player::connect_new(&sink.mixer());

        Ok(Self {
            _sink: Mutex::new(sink),
            player,
            playlist: Mutex::new(Vec::new()),
            current_index: Mutex::new(None),
            is_paused: Mutex::new(false),
        })
    }

    // ========================================================================
    // 供命令层调用的方法
    // ========================================================================

    /// 播放指定索引的歌曲
    pub(crate) fn play_index_inner(&self, index: usize) -> Result<PlaybackStatus, String> {
        let playlist = self.playlist.lock().unwrap();

        // 索引越界检查
        if index >= playlist.len() {
            return Err(format!(
                "歌曲索引越界: {} (共 {} 首歌曲)",
                index,
                playlist.len()
            ));
        }

        let song = playlist[index].clone();
        let song_path = song.path.clone();
        drop(playlist); // 释放锁，避免 I/O 时长时间持有

        // ---- 打开文件并解码 ----
        let file = File::open(&song_path)
            .map_err(|e| format!("无法打开文件 '{}': {}", song_path, e))?;

        let source = Decoder::try_from(file)
            .map_err(|e| format!("无法解码音频文件 '{}': {}", song.name, e))?;

        // ---- 切换到新歌曲 ----
        // Player 是 Send + Sync，直接调用方法即可
        self.player.stop(); // 停止当前播放并清空队列
        self.player.append(source); // 添加新音频源（自动开始播放）

        // ---- 更新状态 ----
        *self.current_index.lock().unwrap() = Some(index);
        *self.is_paused.lock().unwrap() = false;

        Ok(self.build_status())
    }

    /// 构造当前播放状态快照
    pub(crate) fn build_status(&self) -> PlaybackStatus {
        let current_index = *self.current_index.lock().unwrap();
        let playlist_len = self.playlist.lock().unwrap().len();
        let is_paused = *self.is_paused.lock().unwrap();

        // Player 自身是 Send + Sync，可以直接访问
        // empty() 检查是否没有音频在播放或排队
        let player_has_audio = !self.player.empty();

        let current_song = current_index
            .and_then(|i| self.playlist.lock().unwrap().get(i).cloned());

        // 只有在播放器中有音频或用户主动暂停时，才认为"正在播放"
        let is_playing = player_has_audio || is_paused;

        PlaybackStatus {
            is_playing,
            current_song,
            current_index,
            has_next: playlist_len > 0 && current_index.map_or(false, |i| i + 1 < playlist_len),
            has_previous: current_index.map_or(false, |i| i > 0),
            is_paused,
        }
    }
}