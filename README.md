# Cloud Album 云相册

一个现代化的个人云相册应用，提供安全的照片存储和优雅的浏览体验。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6.svg?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC.svg?logo=tailwind-css)

## ✨ 功能特性

- 🔐 安全的密码保护机制
- 📱 响应式设计，完美支持移动端
- 🎨 优雅的界面设计和流畅的动画效果
- 🖼️ 强大的图片浏览功能
  - 支持缩放和全屏查看
  - 智能的图片信息展示
  - 快捷的键盘导航
- ⚡ 高性能的图片加载和缓存
- 🌓 自动适配暗色模式
- 📤 便捷的图片上传功能
- 🔍 快速的图片搜索和过滤

## 🛠️ 技术栈

- **前端框架:** Vue 3 + TypeScript
- **构建工具:** Vite
- **UI 框架:** Tailwind CSS
- **状态管理:** Pinia
- **路由管理:** Vue Router
- **HTTP 客户端:** Axios
- **后端服务:** Netlify Functions
- **存储服务:** Cloudinary

## 📦 安装和使用

1. 克隆项目
```bash
git clone https://github.com/yourusername/cloud-album.git
cd cloud-album
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
编辑 `.env` 文件，填入必要的配置信息：
```env
# Backblaze B2 credentials (用你实际的值代替)
B2_APPLICATION_KEY_ID=your_backblaze_b2_application_key_id
B2_APPLICATION_KEY=your_backblaze_b2_application_key
B2_BUCKET_ID=your_backblaze_b2_bucket_id
B2_BUCKET_NAME=your_backblaze_b2_bucket_name

# Authentication (用你实际的值代替)
JWT_SECRET=your_secure_jwt_secret_key
APP_PASSWORD=your_secure_app_password
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 🚀 部署

本项目可以轻松部署到 Netlify：

1. Fork 本仓库
2. 在 Netlify 中导入项目
3. 配置环境变量
4. 完成部署

## 📝 项目结构

```
cloud-album/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 通用组件
│   ├── views/         # 页面组件
│   ├── stores/        # 状态管理
│   ├── router/        # 路由配置
│   ├── services/      # API 服务
│   ├── utils/         # 工具函数
│   └── types/         # TypeScript 类型
├── netlify/
│   └── functions/     # Netlify Functions
├── public/            # 公共资源
└── ...配置文件
```

## 🔑 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| VITE_API_URL | API 基础 URL | 是 |
| VITE_CLOUDINARY_CLOUD_NAME | Cloudinary 云名称 | 是 |
| VITE_CLOUDINARY_UPLOAD_PRESET | Cloudinary 上传预设 | 是 |
| SITE_PASSWORD | 站点访问密码 | 是 |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解更多细节。

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Netlify](https://www.netlify.com/)
