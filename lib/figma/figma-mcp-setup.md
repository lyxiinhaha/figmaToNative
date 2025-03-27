# Figma MCP服务器设置指南

本指南将帮助您设置和运行figma-developer-mcp服务器，以便与Figma到Android转换工具集成。

## 什么是figma-developer-mcp？

figma-developer-mcp是一个中间层服务器，它充当您的应用和Figma API之间的代理。它可以：

1. 接收来自您应用的请求
2. 使用您的Figma API密钥访问Figma API
3. 返回处理后的结果给您的应用

使用MCP服务器可以解决CORS问题，并提供更好的API访问控制。

## 安装figma-developer-mcp

您可以使用npm或npx安装并运行figma-developer-mcp：

### 使用npx（推荐）

npx允许您运行npm包而无需全局安装：

```bash
npx figma-developer-mcp --figma-api-key=<您的Figma API Key> --port=3333 --host=0.0.0.0 --cors
```

### 使用npm全局安装

如果您希望全局安装：

```bash
npm install -g figma-developer-mcp
figma-developer-mcp --figma-api-key=<您的Figma API Key> --port=3333 --host=0.0.0.0 --cors
```

## 参数说明

- `--figma-api-key=<您的Figma API Key>`: 您的Figma个人访问令牌
- `--port=3333`: 服务器运行的端口号（可以根据需要更改）
- `--host=0.0.0.0`: 服务器监听的主机地址（0.0.0.0表示监听所有网络接口）
- `--cors`: 启用CORS支持，允许跨域请求

## 获取Figma API密钥

如果您还没有Figma API密钥，请按照以下步骤获取：

1. 登录您的Figma账户
2. 点击右上角的头像，选择"Settings"
3. 在左侧菜单中，点击"Personal access tokens"
4. 点击"Create a new personal access token"
5. 输入令牌描述（例如"Figma to Android"）
6. 点击"Create token"按钮
7. 复制生成的令牌（重要：这是您唯一能看到令牌的机会）

## 在生产环境中运行MCP服务器

在生产环境中，您可能希望将MCP服务器作为后台服务运行。有几种方法可以实现这一点：

### 使用PM2（推荐）

PM2是一个Node.js应用程序的进程管理器，可以帮助您保持应用程序运行：

```bash
# 安装PM2
npm install -g pm2

# 使用PM2启动MCP服务器
pm2 start --name "figma-mcp" -- npx figma-developer-mcp --figma-api-key=<您的Figma API Key> --port=3333 --host=0.0.0.0 --cors

# 设置PM2在系统启动时自动启动
pm2 startup
pm2 save
```

### 使用systemd（Linux系统）

您可以创建一个systemd服务来管理MCP服务器：

1. 创建服务文件：

```bash
sudo nano /etc/systemd/system/figma-mcp.service
```

2. 添加以下内容：

```
[Unit]
Description=Figma MCP Server
After=network.target

[Service]
User=<您的用户名>
WorkingDirectory=/home/<您的用户名>
ExecStart=/usr/bin/npx figma-developer-mcp --figma-api-key=<您的Figma API Key> --port=3333 --host=0.0.0.0 --cors
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

3. 启用并启动服务：

```bash
sudo systemctl enable figma-mcp
sudo systemctl start figma-mcp
```

## 配置您的应用使用MCP服务器

我们已经修改了FigmaDataFetcher.js文件，使其默认连接到http://localhost:3333。如果您的MCP服务器运行在不同的地址或端口，您需要在创建FigmaDataFetcher实例时指定MCP服务器URL：

```javascript
// 创建FigmaDataFetcher实例时指定MCP服务器URL
const fetcher = new FigmaDataFetcher(accessToken, 'http://your-mcp-server:3333');
```

## 测试MCP服务器连接

启动MCP服务器后，您可以使用以下命令测试它是否正常工作：

```bash
curl http://localhost:3333/v1/files/<Figma文件ID>
```

如果一切正常，您应该会看到Figma文件的JSON数据。

## 故障排除

如果您遇到问题，请检查以下几点：

1. **MCP服务器未启动**：确保MCP服务器正在运行，并且没有错误消息
2. **端口冲突**：如果端口3333已被占用，尝试使用不同的端口
3. **API密钥无效**：确保您的Figma API密钥是有效的
4. **网络问题**：确保您的应用可以访问MCP服务器
5. **CORS问题**：确保使用了`--cors`参数启动MCP服务器

## 安全注意事项

请注意以下安全事项：

1. **不要在公共代码中暴露您的Figma API密钥**
2. **限制MCP服务器的访问范围**，特别是在生产环境中
3. **定期更新您的Figma API密钥**
4. **监控MCP服务器的日志**，检查是否有异常访问

希望这个指南能帮助您成功设置和运行figma-developer-mcp服务器。如果您有任何问题，请随时告诉我。
