//! 窗口控制命令
//!
//! 提供窗口最小化、最大化、还原、关闭等基础窗口操作。

use tauri::Window;

/// 关闭当前窗口
#[tauri::command]
pub fn close_window(window: Window) {
    window.close().ok();
}

/// 窗口最大化
#[tauri::command]
pub fn maximize_window(window: Window) {
    window.maximize().ok();
}

/// 窗口还原（从最大化恢复到原始大小）
#[tauri::command]
pub fn unmaximize_window(window: Window) {
    window.unmaximize().ok();
}

/// 窗口最小化
#[tauri::command]
pub fn minimize_window(window: Window) {
    window.minimize().ok();
}
