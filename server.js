import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

// 处理单页应用的路由，所有请求都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器已启动!`);
  console.log(`静态文件目录: ${path.join(__dirname, 'dist')}`);
  console.log(`访问地址: http://localhost:${PORT}`);
  console.log(`停止服务: Ctrl + C`);
});

// 优雅关闭处理
process.on('SIGINT', () => {
  console.log('\n 正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n 正在关闭服务器...');
  process.exit(0);
}); 