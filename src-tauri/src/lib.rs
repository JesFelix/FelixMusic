//! FelixMusic - Tauri 后端入口模块
//!
//! ## 模块结构
//!
//! | 模块         | 职责                        |
//! |-------------|----------------------------|
//! | `fm_window/`| 窗口控制命令                 |
//! | `fm_theme/` | 主题管理（命令/模型/工具）     |
//! | `fm_audio/` | 音频播放（播放/扫描/模型）     |

mod fm_window;
mod fm_theme;
mod fm_audio;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 初始化主题目录（首次启动写入内置主题）
    fm_theme::utils::initialize();

    // 初始化音频播放系统
    let audio_state = fm_audio::audio::AudioState::new()
        .expect("音频系统初始化失败：未找到可用音频输出设备");

    tauri::Builder::default()
        .manage(audio_state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // ---- 窗口控制 ----
            fm_window::command::close_window,
            fm_window::command::maximize_window,
            fm_window::command::unmaximize_window,
            fm_window::command::minimize_window,
            // ---- 主题管理 ----
            fm_theme::command::list_themes,
            fm_theme::command::read_theme,
            fm_theme::command::get_themes_dir,
            fm_theme::command::open_themes_dir,
            fm_theme::command::import_theme,
            fm_theme::command::delete_theme,
            // ---- 音频播放 ----
            fm_audio::command::scan_music_folder,
            fm_audio::command::play_song,  
            fm_audio::command::toggle_play_pause,
            fm_audio::command::play_next,
            fm_audio::command::play_previous,
            fm_audio::command::get_playback_status,
            fm_audio::command::set_volume,
            fm_audio::command::stop_playback,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
