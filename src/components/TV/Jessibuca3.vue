<template>
  <div class="root">
    <!-- <div class="container-shell"> -->
      <!-- <div class="container-shell-title">jessibuca demo player <span class="tag-version" v-if="version">({{
          version
        }})</span></div> -->
      <!-- <div class="option">
        <span>缓冲(秒):</span>
        <input
            style="width: 50px"
            type="number"
            ref="buffer"
            value="0.2"
            @change="changeBuffer"
        />
        <input
            type="checkbox"
            v-model="useMSE"
            ref="vod"
            @change="restartPlay('mse')"
        /><span>MediaSource</span>
        <input
            type="checkbox"
            v-model="useWCS"
            ref="vod"
            @change="restartPlay('wcs')"
        /><span>webcodecs</span>

      </div> -->
      <div id="container" ref="container" :style="TVStyle"><span v-if="performance">性能：{{ performance }}</span></div>
      <!-- <div class="input">
        <div>输入URL：</div>
        <input
            type="input"
            autocomplete="on"
            ref="playUrl"
            value=""
        />
        <button v-if="!playing" @click="play">播放</button>
        <button v-else @click="pause">停止</button>
      </div> -->
      <!-- <div class="input" v-if="loaded" style="line-height: 30px"> -->
        <!-- <button @click="destroy">销毁</button>
        <button v-if="quieting" @click="cancelMute">取消静音</button>
        <template v-else>
          <button @click="mute">静音</button>
          音量
          <select v-model="volume" @change="volumeChange">
            <option value="1">100</option>
            <option value="0.75">75</option>
            <option value="0.5">50</option>
            <option value="0.25">25</option>
          </select>
        </template> -->
        <!-- <span>旋转</span>
        <select v-model="rotate" @change="rotateChange">
          <option value="0">0</option>
          <option value="90">90</option>
          <option value="270">270</option>
        </select> -->

        <!-- <button @click="fullscreen">全屏</button> -->
        <!-- <button @click="screenShot">截图</button> -->
        <!-- <div style="line-height: 30px"> -->
          <!-- <input
              type="checkbox"
              ref="operateBtns"
              v-model="showOperateBtns"
              @change="restartPlay"
          /><span>操作按钮</span> -->
          <!-- <input
              type="checkbox"
              ref="operateBtns"
              v-model="showBandwidth"
              @change="restartPlay"
          /><span>网速</span> -->
          <!-- <span v-if="performance">性能：{{ performance }}</span> -->
        <!-- </div> -->
      <!-- </div> -->
      <!-- <div class="input" v-if="loaded">
        <input
            type="checkbox"
            ref="offscreen"
            v-model="useOffscreen"
            @change="restartPlay('offscreen')"
        /><span>离屏渲染</span>

        <select v-model="scale" @change="scaleChange">
          <option value="0">完全填充(拉伸)</option>
          <option value="1">等比缩放</option>
          <option value="2">完全填充(未拉伸)</option>
        </select>
        <button v-if="!playing" @click="clearView">清屏</button>
        <template v-if="playing">
          <select v-model="recordType">
            <option value="webm">webm</option>
            <option value="mp4">mp4</option>
          </select>
          <button v-if="!recording" @click="startRecord">录制</button>
          <button v-if="!recording" @click="stopAndSaveRecord">暂停录制</button>
        </template>

      </div> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

// 定义 props
const props = defineProps({
  flvUrl: String,
  TVStyle: Object,
  videoElement: String,
  videonumber: [String, Number],
  isH265: Boolean,
  asm4: String,
  wasm4: String,
  isDblclickFullscreen: {
    type: Boolean,
    default: true
  }
})

// 定义 emits
const emit = defineEmits(['onError','onPlay'])

// 响应式数据
const container = ref(null)
const jessibuca = ref(null)
const version = ref('')
const wasm = ref(false)
const vc = ref("ff")
const playing = ref(false)
const quieting = ref(true)
const loaded = ref(false) // mute
const showOperateBtns = ref(false)
const showBandwidth = ref(false) // 显示网速
const err = ref("")
const speed = ref(0)
const performance = ref("")
const volume = ref(1)
const rotate = ref(0)
const useWCS = ref(false)
const useMSE = ref(true)
const useOffscreen = ref(false)
const recording = ref(false)
const recordType = ref('webm')
const scale = ref(0)

// 方法定义
const create = (options) => {
  options = options || {};
  console.log(window.Jessibuca)
  jessibuca.value = new window.Jessibuca(
      Object.assign(
          {
            container: container.value,
            // videoBuffer: Number(this.$refs.buffer.value), // 缓存时长
            videoBuffer: 2, // 缓存时长
            isResize: false,
            useWCS: useWCS.value,
            useMSE: useMSE.value,
            text: "",
            // background: "bg.jpg",
            loadingText: "疯狂加载中...",
            // hasAudio:false,
            debug: false,
            supportDblclickFullscreen: props.isDblclickFullscreen ?? true,
            showBandwidth: showBandwidth.value, // 显示网速
            operateBtns: {
              fullscreen: showOperateBtns.value,
              screenshot: showOperateBtns.value,
              play: showOperateBtns.value,
              audio: showOperateBtns.value,
            },
            vod: false,
            forceNoOffscreen: !useOffscreen.value,
            isNotMute: true,
            timeout: 10
          },
          options
      )
  );

  jessibuca.value.on("load", function () {
    console.log("on load");
  });

  jessibuca.value.on("log", function (msg) {
    console.log("on log", msg);
  });
  jessibuca.value.on("record", function (msg) {
    console.log("on record:", msg);
  });
  jessibuca.value.on("pause", function () {
    console.log("on pause");
    playing.value = false;
  });
  jessibuca.value.on("play", function () {
    console.log("on play");
    playing.value = true;
  });
  jessibuca.value.on("fullscreen", function (msg) {
    console.log("on fullscreen", msg);
  });

  jessibuca.value.on("mute", function (msg) {
    console.log("on mute", msg);
    quieting.value = msg;
  });

  jessibuca.value.on("mute", function (msg) {
    console.log("on mute2", msg);
  });

  jessibuca.value.on("audioInfo", function (msg) {
    console.log("audioInfo", msg);
  });

  jessibuca.value.on("videoInfo", function (info) {
    console.log("videoInfo", info);
  });

  jessibuca.value.on("error", function (error) {
    console.log("error", error);
    emit('onError', error);
  });

  jessibuca.value.on("timeout", function () {
    console.log("timeout");
    emit('onError', 'timeout');
  });

  jessibuca.value.on('start', function () {
    console.log('frame start');
  })

  jessibuca.value.on("performance", function (performanceValue) {
    var show = "卡顿";
    if (performanceValue === 2) {
      show = "非常流畅";
    } else if (performanceValue === 1) {
      show = "流畅";
    }
    console.log('性能：', show);
    performance.value = '';
  });
  jessibuca.value.on('buffer', function (buffer) {
    console.log('buffer', buffer);
  })

  jessibuca.value.on('stats', function (stats) {
    console.log('stats', stats);
  })

  jessibuca.value.on('kBps', function (kBps) {
    console.log('kBps', kBps);
  });

  jessibuca.value.on("play", () => {
    playing.value = true;
    loaded.value = true;
    quieting.value = jessibuca.value.isMute();
    emit('onPlay')
  });

  jessibuca.value.on('recordingTimestamp', (ts) => {
    console.log('recordingTimestamp', ts);
  })

  // console.log(jessibuca.value);
}

const play = () => {
  console.log("this.flvUrl");
  console.log(props.flvUrl);
  jessibuca.value.play(props.flvUrl);
}

const mute = () => {
  jessibuca.value.mute();
}

const cancelMute = () => {
  jessibuca.value.cancelMute();
}

const pause = () => {
  jessibuca.value.pause();
  playing.value = false;
  err.value = "";
  performance.value = "";
}

const volumeChange = () => {
  jessibuca.value.setVolume(volume.value);
}

const rotateChange = () => {
  jessibuca.value.setRotate(rotate.value);
}

const destroy = async () => {
  if (jessibuca.value) {
    await jessibuca.value.destroy();
  }
  create();
  playing.value = false;
  loaded.value = false;
  performance.value = "";
}

const fullscreen = () => {
  jessibuca.value.setFullscreen(true);
}

const clearView = () => {
  jessibuca.value.clearView();
}

const startRecord = () => {
  const time = new Date().getTime();
  jessibuca.value.startRecord(time, recordType.value);
}

const stopAndSaveRecord = () => {
  jessibuca.value.stopRecordAndSave();
}

const screenShot = () => {
  jessibuca.value.screenshot();
}

const restartPlay = async (type) => {
  if (type === 'mse') {
    useWCS.value = false;
    useOffscreen.value = false;
  } else if (type === 'wcs') {
    useMSE.value = false
  } else if (type === 'offscreen') {
    useMSE.value = false
  }

  await destroy();
  setTimeout(() => {
    play();
  }, 100)
}

const changeBuffer = () => {
  // jessibuca.value.setBufferTime(Number(this.$refs.buffer.value));
}

const scaleChange = () => {
  jessibuca.value.setScaleMode(scale.value);
}

// 监听 flvUrl 变化
watch(() => props.flvUrl, (newVal) => {
  newVal && play();
});

// 生命周期钩子
onMounted(() => {
  create();
  window.onerror = (msg) => (err.value = msg);
  play();
});

onBeforeUnmount(async () => {
  if (jessibuca.value) {
    await jessibuca.value.destroy();
  }
});
</script>
<style>
.root {
  display: flex;
  /* place-content: center;
  margin-top: 3rem; */
}

.container-shell {
  position: relative;
  backdrop-filter: blur(5px);
  background: hsla(0, 0%, 50%, 0.5);
  padding: 30px 4px 10px 4px;
  /* border: 2px solid black; */
  width: auto;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 10px 20px;
}

.container-shell-title {
  position: absolute;
  color: darkgray;
  top: 4px;
  left: 10px;
  text-shadow: 1px 1px black;
}

.tag-version {
}

#container {
  background: rgba(27, 13, 13, 0.7);
  width: 100%;
  height: 100%;
  position: relative; /* 设置容器为相对定位 */
}
#container span {
  position: absolute; /* 设置span为绝对定位 */
  top: 95%;           /* 距离容器顶部50% */
  left:85%;          /* 距离容器左侧50% */
  color: rgba(255, 0, 0, 0.923);/* RGBA（红绿蓝透明度） */
  z-index: 999;
}



.input {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: white;
  place-content: stretch;
}

.input2 {
  bottom: 0px;
}

.input input[type='input'] {
  flex: auto;
}

.err {
  position: absolute;
  top: 40px;
  left: 10px;
  color: red;
}

.option {
  position: absolute;
  top: 4px;
  right: 10px;
  display: flex;
  place-content: center;
  font-size: 12px;
}

.option span {
  color: white;
}


/* @media (max-width: 720px) {
  #container {
    width: 90vw;
    height: 52.7vw;
  }
} */
</style>
