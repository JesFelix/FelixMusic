<template>
    <div class="vinyl-player" :class="{ playing }">
        <!-- 唱片外部阴影 -->
        <div class="record-shadow"></div>
        <!-- 唱片主体 -->
        <div ref="recordRef" class="record">
            <!-- 唱片边缘 -->
            <div class="record-edge"></div>
            <!-- 唱片沟槽 -->
            <div class="grooves"></div>
            <!-- 唱片反光 -->
            <div ref="glossRef" class="record-gloss"></div>
            <!-- 中间唱片封面 -->
            <div class="record-label">
                <img v-if="cover" :src="cover" alt="" draggable="false" />
                <div class="center-hole"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'

const props = defineProps({
    /**
     * 播放状态
     */
    modelValue: {
        type: Boolean,
        default: false
    },

    /**
     * 唱片封面
     */
    cover: {
        type: String,
        default: ''
    },

    /**
     * 唱片尺寸
     */
    size: {
        type: Number,
        default: 390
    }
})

const emit = defineEmits([
    'update:modelValue',
    'play',
    'pause'
])

const playing = computed(() => props.modelValue)

// ========== 唱片旋转（JS 驱动） ==========
// 背景：Tauri 透明窗口下 WebView2 的 CSS animation 会失效，
// 故改用 requestAnimationFrame 手动旋转，保证桌面端同样能转动。
const recordRef = ref(null)   // 唱片主体 DOM
const glossRef = ref(null)    // 唱片高光 DOM

let rafId = null              // requestAnimationFrame 句柄
let lastTime = 0              // 上一帧时间戳（ms）
let recordAngle = 0           // 唱片当前角度（deg）
let glossAngle = 0            // 高光当前角度（deg）

// 转速：唱片 4.2s/圈，高光 4s/圈（与原 CSS 动画保持一致）
const RECORD_SPEED = 360 / 4.2
const GLOSS_SPEED = 360 / 4

// 每帧更新旋转角度
function tick(time) {
    if (lastTime === 0) lastTime = time
    const dt = (time - lastTime) / 1000   // 距上一帧的时间（秒）
    lastTime = time

    recordAngle = (recordAngle + RECORD_SPEED * dt) % 360
    glossAngle = (glossAngle + GLOSS_SPEED * dt) % 360

    if (recordRef.value) {
        recordRef.value.style.transform = `rotate(${recordAngle}deg)`
    }
    if (glossRef.value) {
        glossRef.value.style.transform = `rotate(${glossAngle}deg)`
    }

    rafId = requestAnimationFrame(tick)
}

// 开始旋转（幂等）
function startSpin() {
    if (rafId !== null) return
    lastTime = 0
    rafId = requestAnimationFrame(tick)
}

// 停止旋转（保留当前角度，下次从该角度继续）
function stopSpin() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
}

// 监听播放状态，启停旋转
watch(playing, (val) => {
    val ? startSpin() : stopSpin()
}, { immediate: true })

// 组件卸载时清理动画帧
onUnmounted(stopSpin)

function toggle() {
    const next = !props.modelValue
    emit('update:modelValue', next)
    if (next) {
        emit('play')
    } else {
        emit('pause')
    }
}
</script>

<style scoped>
/* =========================================================
   外层
   ========================================================= */

.vinyl-player {
    --size: 70%;
    position: relative;
    width: var(--size);
    height: calc(var(--size) + 120px);
    margin: 0 auto;
    user-select: none;
    -webkit-user-select: none;
    isolation: isolate;

    /*
   * 使用 flex 让唱片（流内子元素）在容器中
   * 水平、垂直同时居中
   */
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (min-width: 1460px) {
    .vinyl-player {
        width: 60%;
    }
}


/* =========================================================
   唱片阴影
   ========================================================= */
.record-shadow {
    position: absolute;
    width: 86%;
    aspect-ratio: 1;
    left: 50%;
    top: 50%;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.42);
    filter: blur(18px);

    /*
   * 以自身中心为基准对齐到容器中心，
   * 并略微下移、缩小以营造“光源在上、投影偏下”的效果
   */
    transform: translate(-50%, calc(-50% + 8px)) scale(.94);
    z-index: 0;
}


/* =========================================================
   唱片主体
   ========================================================= */

.record {
    /*
   * 改为 relative：既能让内部绝对定位子元素
   * （边缘/沟槽/高光/封面）继续以其为基准定位，
   * 又作为 flex 流内子元素被父容器垂直居中，
   * 且不会与旋转动画的 transform 冲突。
   */
    position: relative;
    width: 86%;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    z-index: 2;

    /*
   * 第一层：
   * 黑色唱片
   *
   * 第二层：
   * 径向渐变模拟塑料反射
   *
   * 第三层：
   * 环形高光
   */
    background:
        /*TODO： 唱片高光 */
        /* radial-gradient(circle at 38% 30%,
            rgba(255, 255, 255, .12) 0,
            rgba(255, 255, 255, .03) 18%,
            transparent 42%), */
        radial-gradient(circle,
            #191919 0%,
            #111 38%,
            #080808 72%,
            #161616 92%,
            #050505 100%);

    /*
   * 唱片边缘
   */
    box-shadow:
        inset 0 0 0 2px rgba(255, 255, 255, .04),
        inset 0 0 18px rgba(0, 0, 0, .95),
        inset 0 0 45px rgba(0, 0, 0, .65),
        0 2px 4px rgba(0, 0, 0, .55);

    /*
   * 建立独立合成层，配合 JS 驱动旋转，
   * 缓解透明窗口下 WebView2 的合成刷新问题
   */
    will-change: transform;
}


/* =========================================================
   唱片最外圈
   ========================================================= */

.record-edge {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, .07),
        inset 0 0 0 7px rgba(0, 0, 0, .18),
        inset 0 0 0 9px rgba(255, 255, 255, .025),
        inset 0 0 25px rgba(0, 0, 0, .9);
    pointer-events: none;
}


/* =========================================================
   唱片沟槽
   ========================================================= */

.grooves {
    position: absolute;
    inset: 3%;
    border-radius: 50%;
    background:
        repeating-radial-gradient(circle at center,
            rgba(255, 255, 255, .035) 0px,
            rgba(255, 255, 255, .035) 1px,
            rgba(0, 0, 0, .18) 2px,
            rgba(0, 0, 0, .18) 3px);
    opacity: .9;

    /*
   * 让沟槽更像真实压纹
   */
    box-shadow:
        inset 0 0 12px rgba(255, 255, 255, .025),
        inset 0 0 22px rgba(0, 0, 0, .7);
    pointer-events: none;
}


/* =========================================================
   唱片高光
   ========================================================= */

.record-gloss {
    position: absolute;
    inset: -20%;
    border-radius: 50%;
    background:
        conic-gradient(from 270deg,
            transparent 0deg,
            rgba(255, 255, 255, .05) 10deg,
            rgba(255, 255, 255, .10) 20deg,
            rgba(255, 255, 255, .15) 30deg,
            rgba(255, 255, 255, .18) 40deg,
            rgba(255, 255, 255, .19) 45deg,
            rgba(255, 255, 255, .18) 50deg,
            rgba(255, 255, 255, .15) 60deg,
            rgba(255, 255, 255, .10) 70deg,
            rgba(255, 255, 255, .05) 80deg,
            transparent 90deg,
            transparent 180deg,
            rgba(255, 255, 255, .05) 190deg,
            rgba(255, 255, 255, .10) 200deg,
            rgba(255, 255, 255, .15) 210deg,
            rgba(255, 255, 255, .18) 220deg,
            rgba(255, 255, 255, .19) 225deg,
            rgba(255, 255, 255, .18) 230deg,
            rgba(255, 255, 255, .15) 240deg,
            rgba(255, 255, 255, .10) 250deg,
            rgba(255, 255, 255, .05) 260deg,
            transparent 270deg);
    mix-blend-mode: screen;
    pointer-events: none;
}


/* =========================================================
   唱片封面
   ========================================================= */

.record-label {
    position: absolute;
    width: 59%;
    aspect-ratio: 1;
    left: 20.5%;
    top: 20.5%;
    border-radius: 50%;
    overflow: hidden;
    background: #222;
    box-shadow:
        0 0 0 1px rgba(255, 255, 255, .1),
        0 0 8px rgba(0, 0, 0, .9),
        inset 0 0 15px rgba(0, 0, 0, .45);
    z-index: 3;
}


/* 封面 */
.record-label img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
}

/* =========================================================
   TODO：封面上的玻璃反光
   ========================================================= */

.record-label::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    /* background:
        linear-gradient(125deg,
            rgba(255, 255, 255, .20),
            transparent 24%,
            transparent 65%,
            rgba(255, 255, 255, .04)); */
    pointer-events: none;
}


/* =========================================================
   中心孔
   ========================================================= */

.center-hole {
    position: absolute;
    width: 5px;
    height: 5px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: #080808;
    box-shadow:
        0 0 0 1px rgba(255, 255, 255, .16),
        inset 0 1px 2px rgba(0, 0, 0, .9);
    z-index: 4;
}


/* =========================================================
   唱片旋转
   =========================================================
   * 旋转改由 JS requestAnimationFrame 驱动（见 script 的 tick/startSpin），
   * 以规避 Tauri 透明窗口下 WebView2 CSS animation 失效的问题。
   */
</style>