<template>
  <div class="page-header">
    <a-space align="start" class="header-left">
      <!-- 图标区域 -->
      <!-- <div class="menu-icon">
        <fm-icon name="fm-collection-logo" size="100" keepOriginal />
      </div> -->

      <!-- 标题 & 统计信息 -->
      <a-space direction="vertical" fill>
        <span class="title">我的收藏</span>
        <span class="subtitle">{{ collectionCount }} 个收藏 | 共 {{ totalSongs }} 首歌曲</span>

        <!-- 操作栏：新建收藏 + 搜索 -->
        <a-space>
          <a-button class="create-btn" @click="$emit('create')">
            <a-space size="mini">
              <fm-icon name="fm-collection2" size="17" />
              <span>新建收藏</span>
            </a-space>
          </a-button>

          <a-button class="tool-icon-btn" shape="circle" title="刷新">
            <template #icon>
              <fm-icon name="fm-refresh" :size="18" color="var(--fm-base-color-gray-650)" />
            </template>
          </a-button>

          <a-button class="tool-icon-btn" shape="circle">
            <template #icon>
              <fm-icon name="fm-operation" :size="18" color="var(--fm-base-color-gray-650)" />
            </template>
          </a-button>
          
          <FmSearchInput v-model="model" :colors="{
            background: 'var(--fm-base-color-gray-200)',
            backgroundActive: 'var(--fm-base-color-gray-250)',
            iconColor: 'var(--fm-base-color-gray-700)',
            iconColorActive: 'var(--fm-base-color-gray-700)',
            placeholderColor: 'var(--fm-base-color-gray-400)',
            textColor: 'var(--fm-base-color-gray-750)'
          }" placeholder="搜索收藏" type="ellipse" />
        </a-space>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup name="PageHeader">
/**
 * PageHeader — 「我的收藏」页面头部
 *
 * 展示图标、标题、收藏统计，以及「新建收藏」按钮和搜索框。
 * 搜索关键词通过 v-model 双向绑定到父组件，用于过滤卡片。
 */

// 搜索关键词（v-model 双向绑定）
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    /** 收藏夹总数 */
    collectionCount?: number
    /** 收藏歌曲总数 */
    totalSongs?: number
  }>(),
  {
    collectionCount: 0,
    totalSongs: 0
  }
)

defineEmits<{
  create: []
}>()
</script>

<style lang="scss" scoped>
// 页面头部
.page-header {
  margin-bottom: var(--fm-base-spacing-10);
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
      background: linear-gradient(to bottom,
          var(--fm-base-color-brand-300),
          var(--fm-base-color-brand-50));
    }

    .title {
      font-size: 26px;
      font-weight: bold;
      color: var(--fm-base-color-text-primary);
    }

    .subtitle {
      font-size: 14px;
      color: var(--fm-base-color-text-overlay);
      margin-bottom: var(--fm-base-spacing-xs);
    }

    // 新建收藏按钮
    .create-btn {
      background-color: var(--fm-base-color-brand-500);
      color: var(--fm-base-color-brand-150);
      border-radius: var(--fm-base-radius-md);
      border: none;

      &:hover {
        background-color: var(--fm-base-color-brand-700);
        color: var(--fm-base-color-brand-50);
      }

      &:active {
        background-color: var(--fm-base-color-brand-600);
      }
    }

    .tool-icon-btn {
      background-color: var(--fm-base-color-gray-250);
      color: var(--fm-base-color-gray-700);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: var(--fm-base-radius-full);

      &:hover {
        background-color: var(--fm-base-color-gray-300);
        color: var(--fm-base-color-gray-800);
      }
    }
  }
}
</style>
