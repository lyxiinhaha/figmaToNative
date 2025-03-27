# Figma到Android转换工具

这是一个将Figma设计转换为Android XML和View代码的工具。该工具可以帮助Android开发者快速将Figma设计转换为可用的Android代码，提高开发效率。

## 功能特点

- 从Figma API获取设计数据
- 解析Figma节点数据，提取Android UI所需的信息
- 生成Android XML布局代码
- 生成Java和Kotlin View代码
- 提供用户友好的Web界面
- 支持使用测试数据进行演示

## 本地开发

### 前提条件

- Node.js 14.x 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署到Vercel

### 方法1：使用Vercel CLI

1. 安装Vercel CLI:

```bash
npm install -g vercel
```

2. 登录Vercel:

```bash
vercel login
```

3. 部署项目:

```bash
vercel
```

4. 按照提示完成部署。

### 方法2：使用Vercel仪表板

1. 在[Vercel](https://vercel.com)上创建账户（如果还没有）
2. 创建新项目
3. 导入Git仓库或上传项目文件
4. Vercel将自动检测Next.js项目并使用正确的构建设置
5. 点击"Deploy"按钮

### 方法3：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ffigma-to-android)

## 使用指南

1. 访问部署后的应用或本地开发服务器
2. 输入Figma文件ID（从Figma URL中获取）
3. 输入Figma访问令牌（从Figma开发者设置中获取）
4. 或者选择使用测试数据进行演示
5. 设置包名和类名
6. 点击"转换"按钮
7. 查看生成的Android XML、Java和Kotlin代码
8. 使用"复制代码"按钮将代码复制到剪贴板

## 项目结构

```
figma-to-android/
├── lib/
│   ├── figma/
│   │   ├── FigmaDataFetcher.js  # 从Figma API获取设计数据
│   │   └── FigmaNodeParser.js   # 解析Figma节点数据
│   └── android/
│       ├── AndroidXmlGenerator.js  # 生成Android XML布局代码
│       └── AndroidViewGenerator.js # 生成Java和Kotlin View代码
├── pages/
│   └── index.js                 # 主页面
├── public/
├── styles/
├── next.config.js               # Next.js配置
├── package.json                 # 项目依赖
└── vercel.json                  # Vercel配置
```

## 技术栈

- Next.js - React框架
- React - 用户界面库
- Vercel - 部署平台

## 许可证

MIT
