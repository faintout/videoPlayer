<template>
   <div class="video-player-container">
      <template v-if="url">
         <!-- webRTC -->
         <WebRTCVideo :url="url" v-if="urlType === 'rtc'" @onError="onError" @onPlay="onPlay" />
         <!-- h264/h265 -->
         <H264H265Video :flvUrl="url" v-if="urlType === 'h264'||urlType === 'h265'" 
            style="width: 100%;height: 100%;"
            @onError="onError"
            @onPlay="onPlay"
         />
      </template>
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
 
 <script setup>
 import { ref, onMounted, nextTick } from 'vue'
 import WebRTCVideo from '@/components/TV/webRTCVideo.vue'
 import H264H265Video from '@/components/TV/Jessibuca3.vue'
 
 // 响应式数据
 const errorMsg = ref('')
 const urlType = ref('')
 const url = ref('')
 const player = ref(null)
 
 // 方法定义
 const onError = (error) => {
   errorMsg.value = error
 }

 const onPlay = () => {
   errorMsg.value = ''
 }
 
 const getUrlParams = () => {
   // 截取url 参数
   const currentUrl = window.location.href
   // 使用正则表达式匹配 urlType 和 url 参数
   const urlTypeMatch = currentUrl.match(/[?&]urlType=([^&]*)/)
   const urlMatch = currentUrl.match(/[?&]url=(.*?)(?:$|\s)/)
   
   const extractedUrlType = urlTypeMatch ? decodeURIComponent(urlTypeMatch[1]) : ''
   const streamUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : ''
   
   console.log('urlType', extractedUrlType)
   console.log('streamUrl', streamUrl)
   
   urlType.value = extractedUrlType
   url.value = streamUrl
   console.log('url', url.value)
   playVideo()
 }
 
 const playVideo = () => {
      const errors = []
      
      if (!urlType.value) {
         errors.push('urlType参数为空')
      } else if (!['rtc', 'h264', 'h265'].includes(urlType.value)) {
         errors.push('urlType参数错误，请检查urlType参数是否为rtc、h264、h265')
      }
      if (!url.value) {
         errors.push('url参数为空')
      }
      
      errorMsg.value = errors.join('；')
 }
 
 // 生命周期钩子
 onMounted(() => {
   nextTick(() => {
      getUrlParams()
   })
 })
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