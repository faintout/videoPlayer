<template>
   <video class="video-player" :controls="showControls" autoplay muted ref="videoPlayerRef"  controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture="true" @dblclick="toggleFullscreen"></video>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ZLMRTCClient from '@/utils/ZLMRTCClient'

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    // 是否启用全屏
    enableFullscreen: {
        type: Boolean,
        default: true
    },
    // 是否显示控制栏
    showControls: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['error'])

// 响应式数据
const videoPlayerRef = ref(null)
const player = ref(null)
const errorMsg = ref('')
const isFullscreen = ref(false)

// 切换全屏状态
const toggleFullscreen = () => {
    if (!isFullscreen.value) {
        props.enableFullscreen && enterFullscreen()
    } else {
        props.enableFullscreen && exitFullscreen()
    }
}

// 进入全屏
const enterFullscreen = () => {
    const videoElement = videoPlayerRef.value
    
    if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
    } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen()
    } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen()
    } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen()
    }
}

// 退出全屏
const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
    }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
    isFullscreen.value = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    )
}

// 添加全屏事件监听器
const addFullscreenListeners = () => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
}

// 移除全屏事件监听器
const removeFullscreenListeners = () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
}

const initWebRTC = async (url) => {
    player.value = new ZLMRTCClient.Endpoint(
        {
            element: videoPlayerRef.value,// video 标签
            debug: true,// 是否打印日志
            zlmsdpUrl: url,//流地址
            simulcast: false,
            useCamera: false,
            audioEnable: true,
            videoEnable: true,
            recvOnly: true,
        }
    )

    player.value.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, function (e) {
        // ICE 协商出错
        console.log('ICE 协商出错')
        errorMsg.value += `ICE 协商出错 : ${JSON.stringify(e)}`
        emit('error', errorMsg.value)
    })

    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, function (s) {
        //获取到了远端流，可以播放,如果element 为null 或者不传,可以在这里播放(如下注释代码)
        /*
          document.getElementById('video').srcObject=s;
        */
        console.log('播放成功', s)
    })

    player.value.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, function (e) {
        // offer anwser 交换失败
        console.log('offer anwser 交换失败', e)
        errorMsg.value += `offer anwser 交换失败: ${JSON.stringify(e)}`
        emit('error', errorMsg.value)
        stop()
    })

    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM, function (s) {
        // 获取到了本地流 
    })

    player.value.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, function (s) {
        // 获取本地流失败
        console.log('获取本地流失败')
        errorMsg.value += `获取本地流失败: ${JSON.stringify(s)}`
        emit('error', errorMsg.value)
    })

    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, function (state) {
        // RTC 状态变化 ,详情参考 https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
        console.log('当前状态==>', state)
    })

    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN, function (event) {
        console.log('rtc datachannel 打开 :', event)
    })

    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_MSG, function (event) {
        console.log('rtc datachannel 消息 :', event.data)
    })
    
    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR, function (event) {
        console.log('rtc datachannel 错误 :', event)
    })
    
    player.value.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE, function (event) {
        console.log('rtc datachannel 关闭 :', event)
    })
}

// 生命周期钩子
onMounted(() => {
    nextTick(() => {
        initWebRTC(props.url)
        props.enableFullscreen && addFullscreenListeners()
    })
})

onBeforeUnmount(() => {
    props.enableFullscreen && removeFullscreenListeners()
})
</script>

<style scoped lang="scss">
.video-player {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
  //音量按钮
  .video-player::-webkit-media-controls-mute-button {
    display: none;            
  }

    //音量的控制条
    .video-player::-webkit-media-controls-volume-slider {
        display: none;            
    }

  //全屏按钮
  .video-player::-webkit-media-controls-fullscreen-button {
    display: none;
  }

  
</style>