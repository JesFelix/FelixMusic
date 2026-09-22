//! 音频播放命令
//!
//! 所有与音频播放相关的 Tauri 命令：
//! 扫描音乐文件夹、播放控制（播放/暂停/上下曲/停止/音量）。

use tauri::State;

use crate::fm_audio::audio::AudioState;
use crate::fm_audio::model::{PlaybackStatus, SongFile};
use crate::fm_audio::utils;

/// 扫描指定文件夹中的音乐文件
///
/// 扫描结果会同时保存到内部播放列表以供后续播放控制。
/// 返回歌曲列表供前端展示。
#[tauri::command]
pub fn scan_music_folder(
    state: State<'_, AudioState>,
    path: String,
) -> Result<Vec<SongFile>, String> {
    let songs = utils::scan_folder(&path)?;

    // 停止当前播放并更新播放列表
    state.player.stop();
    *state.playlist.lock().unwrap() = songs.clone();
    *state.current_index.lock().unwrap() = None;
    *state.is_paused.lock().unwrap() = false;

    Ok(songs)
}

/// 播放指定索引的歌曲
#[tauri::command]
pub fn play_song(
    state: State<'_, AudioState>,
    index: usize,
) -> Result<PlaybackStatus, String> {
    state.play_index_inner(index)
}

/// 切换播放/暂停状态
///
/// - 正在播放 → 暂停
/// - 暂停中   → 恢复播放（从当前歌曲开头重新播放）
/// - 无歌曲   → 返回当前状态（无操作）
#[tauri::command]
pub fn toggle_play_pause(state: State<'_, AudioState>) -> Result<PlaybackStatus, String> {
    let current_idx = *state.current_index.lock().unwrap();
    let paused = *state.is_paused.lock().unwrap();

    match current_idx {
        None => {
            // 没有正在播放的歌曲，无需操作
            Ok(state.build_status())
        }
        Some(idx) => {
            if paused {
                // 从暂停中恢复：重新播放当前歌曲
                state.play_index_inner(idx)
            } else {
                // 暂停播放 —— Player 支持原生 pause/play
                state.player.pause();
                *state.is_paused.lock().unwrap() = true;
                Ok(state.build_status())
            }
        }
    }
}

/// 播放下一首（到达末尾则停止）
#[tauri::command]
pub fn play_next(state: State<'_, AudioState>) -> Result<PlaybackStatus, String> {
    let current_index = *state.current_index.lock().unwrap();
    let playlist_len = state.playlist.lock().unwrap().len();

    match current_index {
        Some(i) if i + 1 < playlist_len => state.play_index_inner(i + 1),
        _ => {
            // 已在最后一首或没有播放歌曲，停止播放
            state.player.stop();
            *state.current_index.lock().unwrap() = None;
            *state.is_paused.lock().unwrap() = false;
            Ok(state.build_status())
        }
    }
}

/// 播放上一首（在第一首时不做操作）
#[tauri::command]
pub fn play_previous(state: State<'_, AudioState>) -> Result<PlaybackStatus, String> {
    let current_index = *state.current_index.lock().unwrap();

    match current_index {
        Some(i) if i > 0 => state.play_index_inner(i - 1),
        _ => {
            // 已在第一首或没有播放，不做操作
            Ok(state.build_status())
        }
    }
}

/// 获取当前播放状态快照
///
/// 前端通过轮询此命令来同步播放状态、检测歌曲结束并自动切歌。
#[tauri::command]
pub fn get_playback_status(state: State<'_, AudioState>) -> Result<PlaybackStatus, String> {
    Ok(state.build_status())
}

/// 设置播放音量
///
/// `volume` 范围 0.0 ~ 1.0，超出范围会被自动钳制。
#[tauri::command]
pub fn set_volume(state: State<'_, AudioState>, volume: f32) -> Result<(), String> {
    let clamped = volume.clamp(0.0, 1.0);
    state.player.set_volume(clamped);
    Ok(())
}

/// 停止播放并重置播放位置
#[tauri::command]
pub fn stop_playback(state: State<'_, AudioState>) -> Result<PlaybackStatus, String> {
    state.player.stop();
    *state.current_index.lock().unwrap() = None;
    *state.is_paused.lock().unwrap() = false;
    Ok(state.build_status())
}