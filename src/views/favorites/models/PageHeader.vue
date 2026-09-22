<template>
  <div class="page-header">
    <a-space align="start" class="header-left">
      <div class="menu-icon">
        <fm-icon name="fm-favorites" size="100" keepOriginal />
      </div>
      <a-space direction="vertical" fill>
        <span class="title">我喜欢的</span>
        <span class="subtitle">128首歌曲 · 时长 8小时 36分钟</span>

        <a-space>
          <a-button class="play-but">
            <a-space size="mini">
              <fm-icon name="fm-play" size="14" />
              <span>全部播放</span>
            </a-space>
          </a-button>
          <a-button class="batch-but">
            <template #icon>
              <fm-icon name="fm-batch-operation" size="18" />
            </template>
          </a-button>
          <FmSearchInput
            v-model="model"
            :colors="{
              background: 'var(--fm-base-color-gray-200)',
              backgroundActive: 'var(--fm-base-color-gray-250)',
              iconColor: 'var(--fm-base-color-gray-700)',
              iconColorActive: 'var(--fm-base-color-gray-700)',
              placeholderColor: 'var(--fm-base-color-gray-400)',
              textColor: 'var(--fm-base-color-gray-750)'
            }"
            placeholder="搜索歌曲"
            type="ellipse"
          />
        </a-space>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup name="PageHeader">
/**
 * PageHeader — 「我喜欢的」页面头部
 *
 * 展示图标、标题、副标题，以及「全部播放」「批量操作」按钮和搜索框。
 * 搜索关键词通过 v-model 双向绑定到父组件。
 */

// 搜索关键词（v-model 双向绑定）
const model = defineModel<string>({ default: '' })
</script>

<style lang="scss" scoped>
// 页面头部
.page-header {
  margin-bottom: var(--fm-base-spacing-sm);
  display: flex;
  align-items: flex-end;

  .header-left {
    width: 100%;
    display: flex;
    align-items: flex-end;

    .menu-icon {
      width: 130px;
      aspect-ratio: 1 / 1;
      display: grid;
      place-items: center;
      border-radius: var(--fm-base-radius-6);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: linear-gradient(to bottom, var(--fm-base-color-brand-300), var(--fm-base-color-brand-50));
    }

    .title {
      font-size: 26px;
      font-weight: bold;
      color: var(--fm-base-color-text-primary);
    }

    .subtitle {
      font-size: 14px;
      color: var(--fm-base-color-text-overlay);
      margin-bottom: var(--fm-base-spacing-sm);
    }

    .play-but {
      background-color: var(--fm-base-color-brand-500);
      color: var(--fm-base-color-brand-150);
      border-radius: var(--fm-base-radius-md);

      &:hover {
        background-color: var(--fm-base-color-brand-700);
        color: var(--fm-base-color-brand-50);
      }

      &:active {
        background-color: var(--fm-base-color-brand-600);
      }
    }

    .batch-but {
      border-radius: var(--fm-base-radius-md);
      background-color: var(--fm-base-color-gray-200);
      color: var(--fm-base-color-gray-700);

      &:hover {
        background-color: var(--fm-base-color-gray-250);
      }

      &:active {
        background-color: var(--fm-base-color-gray-300);
      }
    }
  }
}
</style>
