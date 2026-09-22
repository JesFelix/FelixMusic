<template>
  <div class="local-music-header">
    <a-space direction="vertical" align="start" size="medium">
      <a-space align="end">
        <span class="page-title">本地音乐</span>
        <span class="page-subtitle">共 {{ songCount }} 首</span>
      </a-space>

      <a-space align="end">
        <a-button class="play-all-btn" @click="handlePlayAll">
          <a-space :size="6">
            <fm-icon name="fm-play" :size="14" />
            <span>播放全部</span>
          </a-space>
        </a-button>

        <a-button class="tool-icon-btn" shape="circle" @click="handleRefresh">
          <template #icon>
            <fm-icon name="fm-refresh" :size="18" color="var(--fm-base-color-gray-650)" />
          </template>
        </a-button>

        <a-popover
          position="rt"
          trigger="click"
          :content-style="{ padding: 'var(--fm-base-spacing-6) var(--fm-base-spacing-sm)' }"
        >
          <a-button class="tool-icon-btn" shape="circle">
            <template #icon>
              <fm-icon name="fm-operation" :size="18" color="var(--fm-base-color-gray-650)" />
            </template>
          </a-button>

          <template #content>
            <div class="operation-menu">
              <div class="operation-item" @click="handleBatchOperation">
                <fm-icon name="fm-batch-operation" :size="16" color="var(--fm-base-color-gray-600)" />
                <span>批量操作</span>
              </div>
              <div class="operation-item" @click="handleAddFolder">
                <fm-icon name="fm-folder" :size="18" color="var(--fm-base-color-gray-600)" />
                <span>添加文件夹</span>
              </div>
            </div>
          </template>
        </a-popover>

        <FmSearchInput
          v-model="keyword"
          :colors="searchColors"
          placeholder="搜索歌曲"
          type="circle"
        />
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup name="LocalMusicHeader">
import { computed } from 'vue'

interface Props {
  searchKeyword: string
  songCount: number
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  songCount: 0,
})

const emit = defineEmits<{
  'update:searchKeyword': [value: string]
  playAll: []
  refresh: []
  batchOperation: []
  addFolder: []
}>()

const searchColors = {
  background: 'var(--fm-base-color-gray-200)',
  backgroundActive: 'var(--fm-base-color-gray-250)',
  iconColor: 'var(--fm-base-color-gray-700)',
  iconColorActive: 'var(--fm-base-color-gray-700)',
  placeholderColor: 'var(--fm-base-color-gray-400)',
  textColor: 'var(--fm-base-color-gray-750)',
}

const keyword = computed({
  get: () => props.searchKeyword,
  set: (value: string) => emit('update:searchKeyword', value),
})

function handlePlayAll(): void {
  emit('playAll')
}

function handleRefresh(): void {
  emit('refresh')
}

function handleBatchOperation(): void {
  emit('batchOperation')
}

function handleAddFolder(): void {
  emit('addFolder')
}
</script>

<style lang="scss" scoped>
.local-music-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--fm-base-spacing-14);

  .page-title {
    font-size: var(--fm-base-font-size-2xl);
    font-weight: var(--fm-base-font-weight-bold);
    color: var(--fm-base-color-text-primary);
  }

  .page-subtitle {
    font-size: var(--fm-base-font-size-sm);
    color: var(--fm-base-color-text-overlay);
  }

  .play-all-btn {
    background-color: var(--fm-base-color-brand-500);
    color: var(--fm-base-color-text-inverse);
    border: none;
    border-radius: var(--fm-base-radius-md);
    transition: background-color var(--fm-base-transition-fast);

    &:hover {
      background-color: var(--fm-base-color-brand-700);
      color: var(--fm-base-color-text-inverse);
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

.operation-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--fm-base-spacing-xs) 0;
  min-width: 140px;
}

.operation-item {
  display: flex;
  align-items: center;
  gap: var(--fm-base-spacing-xs);
  padding: var(--fm-base-spacing-sm) var(--fm-base-spacing-10);
  border-radius: var(--fm-base-radius-sm);
  cursor: pointer;
  font-size: var(--fm-base-font-size-sm);
  color: var(--fm-base-color-gray-700);
  transition: background-color var(--fm-base-transition-fast);
  white-space: nowrap;

  &:hover {
    background-color: var(--fm-base-color-gray-200);
  }
}
</style>
