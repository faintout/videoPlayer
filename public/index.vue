<template>
   <div class="video-player-container">
      <!-- webRTC -->
      <WebRTCVideo :url="url" v-if="urlType === 'rtc'"  @error="handleError" />
      <!-- h264 -->
      <H264Video :flvUrl="url"  v-if="urlType === 'h264'" 
         style="width: 100%;height: 100%;"
         @error="handleError"
       />
      <!-- h265 -->
      <H265Video 
      :flvUrl="url"
      videoElement="video1"
      videonumber="1"
      :isH265=true
      :wasm4="wasm4"  
      :asm="asm4"
      v-if="urlType === 'h265'"
      style="width: 100%;height: 100%;"
      @error="handleError"
       />
      <div class="tip-content" v-if="errorMsg">
         <div class="tip-content-title">
            视频播放错误
         </div>
         <div class="tip-content-message">
            {{ errorMsg }}
         </div>
      </div>
   </div>
</template>

<script>
import WebRTCVideo from '@/components/TV/webRTCVideo.vue'
import H265Video from '@/components/TV/videojs_flvh265/videojs_flvh265'
import H264Video  from '@/components/TV/jessibuca3/JessibucaDemo'
export default {
   name: 'VideoPlay',
   components: {
      WebRTCVideo,
      H264Video,
      H265Video
   },
   data() {
      return {
         errorMsg: '',
         urlType: '',
         url: '',
         player: null,
         asm4: "./prod.h265.asm.combine.js",
         wasm4: "./prod.h265.wasm.combine.js"
      }
   },
   mounted() {
      this.$nextTick(() => {
         this.getUrlParams()
      })
   },
   methods: {
      handleError(errorMsg) {
         this.errorMsg = errorMsg
      }, 
      getUrlParams() {
         //截取url 参数
         const url = window.location.href;
         // 使用正则表达式匹配 urlType 和 url 参数
         const urlTypeMatch = url.match(/[?&]urlType=([^&]*)/);
         const urlMatch = url.match(/[?&]url=(.*?)(?:$|\s)/);  
         
         const urlType = urlTypeMatch ? decodeURIComponent(urlTypeMatch[1]) : '';
         const streamUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : '';
         console.log('urlType', urlType)
         console.log('streamUrl', streamUrl)
         var playUrl =""
         console.log('window.location', window.location)
         if (urlType == "rtc"){
            var ind = streamUrl.indexOf(":21003");// 查找位置
            var tr = streamUrl.substr(ind);//截取第index个之后所有的字符 cdef
            playUrl = window.location.protocol+ "//" +window.location.hostname+ tr //获取当前地址拼装url
         }else{
            var ind = streamUrl.indexOf("/rtp");// 查找位置
            var tr = streamUrl.substr(ind);//截取第index个之后所有的字符 cdef
            playUrl = window.location.origin + tr //获取当前地址拼装url
         }
         console.log('playUrl', playUrl)
         this.urlType = urlType
         this.url = playUrl
         this.playVideo()
      },
      playVideo() {
         if(!this.urlType || !this.url) {
            if(!this.urlType) {
               this.errorMsg += 'urlType参数错误';
            }
            if(!this.url) {
               this.errorMsg += 'url参数错误';
            }
            return;
         }
      }
   }
}
</script>

<style scoped lang="scss">
.video-player-container {
   width: 100%;
   height: 100%;
   display: flex;
   position: relative;

   .video-player {
      width: 100%;
      height: 100%;
   }

   .tip-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
   }
}

.tip-content-title {
   font-size: 24px;
   font-weight: bold;
   margin-bottom: 20px;
   color: #ff4d4f;
   text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
   letter-spacing: 2px;
   background-color: rgba(255, 77, 79, 0.15);
   padding: 12px 30px;
   border-radius: 6px;
   border-bottom: 3px solid #ff4d4f;
   text-transform: uppercase;
}

.tip-content-message {
   font-size: 16px;
   max-width: 80%;
   text-align: center;
   line-height: 1.5;
   padding: 16px 24px;
   background-color: rgba(0, 0, 0, 0.6);
   border-radius: 10px;
   border: 2px solid rgba(255, 255, 255, 0.2);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
   position: relative;
}

.tip-content-message::before {
   content: '';
   position: absolute;
   top: -15px;
   left: 50%;
   transform: translateX(-50%);
   width: 0;
   height: 0;
   border-left: 15px solid transparent;
   border-right: 15px solid transparent;
   border-bottom: 15px solid rgba(0, 0, 0, 0.6);
}
</style>