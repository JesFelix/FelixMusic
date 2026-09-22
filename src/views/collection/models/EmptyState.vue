<template>
  <div class="empty-state">
    <div class="empty-icon-wrapper" @click="$emit('create')">
      <fm-icon name="fm-add" size="48" color="var(--fm-base-color-gray-400)" />
    </div>
    <span class="empty-title">还没有收藏</span>
    <span class="empty-subtitle">点击上方按钮或此处创建你的第一个收藏</span>
    <a-button class="create-btn" @click="$emit('create')">
      <a-space :size="6">
        <fm-icon name="fm-add" size="14" />
        <span>新建收藏</span>
      </a-space>
    </a-button>
  </div>
</template>

<script lang="ts" setup name="EmptyState">
/**
 * EmptyState — 无收藏时的空状态引导
 *
 * 当收藏列表为空时展示，点击图标或按钮触发新建收藏（emit create）。
 */
defineEmits<{
  create: []
}>()
</script>

<style lang="scss" scoped>
// 空状态
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--fm-base-spacing-xs);
  color: var(--fm-base-color-gray-450);

  .empty-icon-wrapper {
    width: 96px;
    height: 96px;
    border-radius: var(--fm-base-radius-full);
    background: var(--fm-base-color-gray-200);
    display: grid;
    place-items: center;
    cursor: pointer;
    margin-bottom: var(--fm-base-spacing-xs);
    transition: background 0.2s ease, transform 0.2s ease;

    &:hover {
      background: var(--fm-base-color-gray-250);
      transform: scale(1.05);
    }
  }

  .empty-title {
    font-size: var(--fm-base-font-size-lg);
    font-weight: var(--fm-base-font-weight-bold);
    color: var(--fm-base-color-gray-650);
  }

  .empty-subtitle {
    font-size: var(--fm-base-font-size-sm);
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
}
</style>
