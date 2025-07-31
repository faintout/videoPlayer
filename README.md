# 视频播放器 (VideoPlayer)

一个基于 Vue 3 + Vite 开发的多格式视频播放器，支持 WebRTC 实时流媒体和 H264/H265 视频格式播放。

## ✨ 主要特性

- 🎯 **多格式支持**：支持 WebRTC、H264、H265 多种视频格式
- 🖥️ **全屏播放**：支持双击全屏和退出全屏功能
- 🔊 **音频控制**：支持音量调节和静音功能
- 🎛️ **实时控制**：支持播放/暂停、截图、录制等操作
- 📱 **响应式设计**：适配不同屏幕尺寸
- ⚡ **高性能**：基于现代 Web 技术，流畅播放体验
- 🔧 **灵活配置**：通过 URL 参数动态配置播放源

## 🚀 快速开始

### 环境要求

- Node.js: `^20.19.0 || >=22.12.0`
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 启动服务器

```bash
npm start
```

## 📖 使用说明

### URL 参数配置

播放器通过 URL 参数来配置播放源和播放类型：

```
http://localhost:5173/videoPlay?urlType=<类型>&url=<视频地址>
```

#### 参数说明

| 参数名 | 类型 | 必填 | 说明 | 可选值 |
|--------|------|------|------|--------|
| `urlType` | string | ✅ | 视频流类型 | `rtc`, `h264`, `h265` |
| `url` | string | ✅ | 视频流地址 | 完整的视频流URL |

#### 使用示例

**WebRTC 流播放：**
```
http://localhost:5173/videoPlay?urlType=rtc&url=https://example.com/webrtc/stream
```

**H264 视频播放：**
```
http://localhost:5173/videoPlay?urlType=h264&url=https://example.com/video.flv
```

**H265 视频播放：**
```
http://localhost:5173/videoPlay?urlType=h265&url=https://example.com/video.h265
```

### 支持的视频格式

#### 1. WebRTC (urlType=rtc)
- 实时流媒体播放
- 支持双向音视频通信
- 低延迟播放体验
- 自动ICE协商和连接状态监控

#### 2. H264 (urlType=h264)
- 标准H264编码视频
- 支持FLV、MP4等容器格式
- 硬件加速解码支持

#### 3. H265 (urlType=h265)
- 高效视频编码(HEVC)
- 更好的压缩率和画质
- 现代浏览器支持

## 🎮 播放控制

### 基础操作

- **播放/暂停**：点击播放按钮或空格键
- **全屏切换**：双击视频区域或使用全屏按钮
- **音量控制**：使用音量滑块或快捷键
- **截图功能**：点击截图按钮保存当前画面

### 高级功能

- **视频旋转**：支持0°、90°、270°旋转
- **缩放模式**：完全填充、等比缩放、完全填充(未拉伸)
- **录制功能**：支持WebM和MP4格式录制
- **性能监控**：实时显示播放性能状态

## 🛠️ 技术架构

### 核心技术栈

- **前端框架**：Vue 3 + Composition API
- **构建工具**：Vite
- **样式预处理**：Sass/SCSS
- **路由管理**：Vue Router 4

### 播放引擎

- **WebRTC播放**：基于 ZLMRTCClient
- **H264/H265播放**：基于 Jessibuca 播放器
- **音视频处理**：支持 MediaSource Extensions 和 WebCodecs

### 项目结构

```
videoPlayer/
├── public/                 # 静态资源
│   ├── jessibuca3/        # Jessibuca播放器资源
│   └── decoder.js/wasm    # 解码器文件
├── src/
│   ├── components/
│   │   └── TV/           # 视频播放组件
│   │       ├── webRTCVideo.vue    # WebRTC播放组件
│   │       └── Jessibuca3.vue     # H264/H265播放组件
│   ├── view/
│   │   └── videoPlay/    # 播放页面
│   ├── utils/            # 工具函数
│   └── router/           # 路由配置
└── server.js             # Express服务器
```

## 🔧 配置选项

### WebRTC 配置

```javascript
{
  debug: true,           // 启用调试日志
  simulcast: false,      // 关闭联播
  useCamera: false,      // 不使用摄像头
  audioEnable: true,     // 启用音频
  videoEnable: true,     // 启用视频
  recvOnly: true         // 仅接收模式
}
```

### Jessibuca 配置

```javascript
{
  videoBuffer: 2,              // 视频缓存时长(秒)
  isResize: false,             // 禁用自动调整大小
  useWCS: false,               // WebCodecs支持
  useMSE: true,                // MediaSource Extensions
  debug: false,                // 调试模式
  supportDblclickFullscreen: true, // 双击全屏
  timeout: 10                  // 连接超时时间
}
```

## 🔍 错误处理

播放器内置完善的错误处理机制：

- **ICE协商错误**：WebRTC连接失败处理
- **流媒体错误**：播放源不可用或格式错误
- **超时错误**：连接或加载超时处理
- **参数错误**：URL参数验证和提示

错误信息会在播放区域显示，方便调试和用户反馈。

## 🌐 浏览器兼容性

| 浏览器 | WebRTC | H264 | H265 | 备注 |
|--------|--------|------|------|------|
| Chrome | ✅ | ✅ | ✅ | 推荐使用 |
| Firefox | ✅ | ✅ | ⚠️ | H265支持有限 |
| Safari | ✅ | ✅ | ✅ | macOS/iOS |
| Edge | ✅ | ✅ | ✅ | 基于Chromium |

## 📝 开发指南

### 自定义组件

1. 继承基础播放组件
2. 实现必要的生命周期方法
3. 添加错误处理和事件监听
4. 测试兼容性和性能

### 添加新的视频格式

1. 在 `urlType` 验证中添加新类型
2. 创建对应的播放组件
3. 在主页面中注册和使用
4. 更新文档说明

## 📄 许可证

此项目基于 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看控制台错误日志
2. 检查网络连接和视频源
3. 确认浏览器兼容性
4. 提交 Issue 描述问题详情
