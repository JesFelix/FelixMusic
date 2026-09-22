<template>
  <!-- ============================================================
   HeroBanner — 顶部轮播横幅
   使用 ArcoDesign Carousel 组件展示轮播图
   ============================================================ -->
  <a-carousel
    :indicator-type="indicatorType"
    :indicator-position="indicatorPosition"
    show-arrow="never"
    class="hero-carousel"
  >
    <a-carousel-item v-for="(image, idx) in images" :key="idx">
      <img :src="image" class="hero-carousel-image" />
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts" setup name="HeroBanner">
/**
 * HeroBanner — 精选页顶部轮播图组件
 *
 * Props:
 *   images — 轮播图片 URL 数组
 *   indicatorType — 指示器类型（默认 "line"）
 *   indicatorPosition — 指示器位置（默认 "bottom"）
 */
import { CarouselIndicatorPosition, CarouselIndicatorType } from '@arco-design/web-vue/es/carousel/interface'
import { ref } from 'vue'

defineProps<{
  images: string[]
}>()

const indicatorType = ref<CarouselIndicatorType>('line')
const indicatorPosition = ref<CarouselIndicatorPosition>('bottom')
</script>

<style lang="scss" scoped>
.hero-carousel {
  width: 100%;
  height: 240px;   
  min-height: 240px;                 /* 必须指定高度，否则 carousel 不会渲染 */
  background-color: transparent;

  &:deep(.arco-carousel-slide) {
    border-radius: 10px;
  }

  &:deep(.arco-carousel-indicator-wrapper-bottom) {
    border-radius: 10px;
  }
}

.hero-carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
