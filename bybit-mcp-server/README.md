# @mcpdotdirect/template-mcp-server

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)

A CLI tool to quickly get started building your very own MCP (Model Context Protocol) server using FastMCP

## 📋 Usage

```bash
# with npx
npx @mcpdotdirect/create-mcp-server

# Or with npm
npm init @mcpdotdirect/mcp-server
```

## 🔭 What's Included

The template includes:

- Basic server setup with both stdio and HTTP transport options using FastMCP
- Structure for defining MCP tools, resources, and prompts
- TypeScript configuration
- Development scripts and configuration

## ✨ Features

- **FastMCP**: Built using the FastMCP framework for simpler implementation
- **Dual Transport Support**: Run your MCP server over stdio or HTTP
- **TypeScript**: Full TypeScript support for type safety
- **Extensible**: Easy to add custom tools, resources, and prompts

## 🚀 Getting Started

After creating your project:

1. Install dependencies using your preferred package manager:
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn
   
   # Using pnpm
   pnpm install
   
   # Using bun
   bun install
   ```

2. Start the server:
   ```bash
   # Start the stdio server
   npm start
   
   # Or start the HTTP server
   npm run start:http
   ```

3. For development with auto-reload:
   ```bash
   # Development mode with stdio
   npm run dev
   
   # Development mode with HTTP
   npm run dev:http
   ```

> **Note**: The default scripts in package.json use Bun as the runtime (e.g., `bun run src/index.ts`). If you prefer to use a different package manager or runtime, you can modify these scripts in your package.json file to use Node.js or another runtime of your choice.

## 📖 Detailed Usage

### Transport Methods

The MCP server supports two transport methods:

1. **stdio Transport** (Command Line Mode):
   - Runs on your **local machine**
   - Managed automatically by Cursor
   - Communicates directly via `stdout`
   - Only accessible by you locally
   - Ideal for personal development and tools

2. **SSE Transport** (HTTP Web Mode):
   - Can run **locally or remotely**
   - Managed and run by you
   - Communicates **over the network**
   - Can be **shared** across machines
   - Ideal for team collaboration and shared tools

### Running the Server Locally

#### stdio Transport (CLI Mode)

Start the server in stdio mode for CLI tools:

```bash
# Start the stdio server
npm start
# or with other package managers
yarn start
pnpm start
bun start

# Start the server in development mode with auto-reload
npm run dev
# or
yarn dev
pnpm dev
bun dev
```

#### HTTP Transport (Web Mode)

Start the server in HTTP mode for web applications:

```bash
# Start the HTTP server
npm run start:http
# or
yarn start:http
pnpm start:http
bun start:http

# Start the HTTP server in development mode with auto-reload
npm run dev:http
# or
yarn dev:http
pnpm dev:http
bun dev:http
```

By default, the HTTP server runs on port 3001. You can change this by setting the PORT environment variable:

```bash
# Start the HTTP server on a custom port
PORT=8080 npm run start:http
```

### Connecting to the Server

#### Connecting from Cursor

To connect to your MCP server from Cursor:

1. Open Cursor and go to Settings (gear icon in the bottom left)
2. Click on "Features" in the left sidebar
3. Scroll down to "MCP Servers" section
4. Click "Add new MCP server"
5. Enter the following details:
   - Server name: `my-mcp-server` (or any name you prefer)
   - For stdio mode:
     - Type: `command`
     - Command: The path to your server executable, e.g., `npm start`
   - For SSE mode:
     - Type: `url`
     - URL: `http://localhost:3001/sse`
6. Click "Save"

#### Using mcp.json with Cursor

For a more portable configuration, create an `.cursor/mcp.json` file in your project's root directory:

```json
{
  "mcpServers": {
    "my-mcp-stdio": {
      "command": "npm",
      "args": [
        "start"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "my-mcp-sse": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

You can also create a global configuration at `~/.cursor/mcp.json` to make your MCP servers available in all your Cursor workspaces.

Note: 
- The `command` type entries run the server in stdio mode
- The `url` type entry connects to the HTTP server using SSE transport
- You can provide environment variables using the `env` field
- When connecting via SSE with FastMCP, use the full URL including the `/sse` path: `http://localhost:3001/sse`

### Testing Your Server with CLI Tools

FastMCP provides built-in tools for testing your server:

```bash
# Test with mcp-cli
npx fastmcp dev server.js

# Inspect with MCP Inspector
npx fastmcp inspect server.ts
```

### Using Environment Variables

You can customize the server using environment variables:

```bash
# Change the HTTP port (default is 3001)
PORT=8080 npm run start:http

# Change the host binding (default is 0.0.0.0)
HOST=127.0.0.1 npm run start:http
```

## 🛠️ Adding Custom Tools and Resources

When adding custom tools, resources, or prompts to your FastMCP server:

### Tools

```typescript
server.addTool({
  name: "hello_world",
  description: "A simple hello world tool",
  parameters: z.object({
    name: z.string().describe("Name to greet")
  }),
  execute: async (params) => {
    return `Hello, ${params.name}!`;
  }
});
```

### Resources

```typescript
server.addResourceTemplate({
  uriTemplate: "example://{id}",
  name: "Example Resource",
  mimeType: "text/plain",
  arguments: [
    {
      name: "id",
      description: "Resource ID",
      required: true,
    },
  ],
  async load({ id }) {
    return {
      text: `This is an example resource with ID: ${id}`
    };
  }
});
```

### Prompts

```typescript
server.addPrompt({
  name: "greeting",
  description: "A simple greeting prompt",
  arguments: [
    {
      name: "name",
      description: "Name to greet",
      required: true,
    },
  ],
  load: async ({ name }) => {
    return `Hello, ${name}! How can I help you today?`;
  }
});
```

## 📚 Documentation

For more information about FastMCP, visit [FastMCP GitHub Repository](https://github.com/punkpeye/fastmcp).

For more information about the Model Context Protocol, visit the [MCP Documentation](https://modelcontextprotocol.io/introduction).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Bybit MCP Server

A Model Context Protocol (MCP) server for interacting with the Bybit V5 API. Provides MCP tools for spot trading, contract trading, account info, and more.

English
------

## Prerequisites

### macOS / Linux

1. Install **Bun**:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
2. Install **Node.js** and **npm**:
   ```bash
   # macOS (Homebrew)
   brew install node

   # Debian/Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

### Windows (PowerShell)

1. Install **Bun**:
   ```powershell
   iwr https://bun.sh/install -useb | iex
   ```
2. Install **Node.js**:
   - Download and run the Windows installer from https://nodejs.org/

## Installation

### Using Bun (recommended)
```bash
bun x bybit-mcp@1.0.9
```

### Using npm
```bash
npx bybit-mcp@1.0.9
```

### Using Yarn
```bash
yarn dlx bybit-mcp@1.0.9
```

## Configuration

Create or update your `mcp.json` (or `.cursor/mcp.json`) with the Bybit server:
```json
{
  "mcpServers": {
    "bybit": {
      "command": "bun",
      "args": ["x","bybit-mcp@1.0.9"],
      "env": {
        "BYBIT_API_KEY": "",
        "BYBIT_API_SECRET": "",
        "BYBIT_TESTNET": "false"
      }
    }
  }
}
```

- `BYBIT_API_KEY`: Your Bybit API Key
- `BYBIT_API_SECRET`: Your Bybit API Secret
- `BYBIT_TESTNET`: Set to `"true"` for Testnet, `"false"` (or omit) for Mainnet

## Running

After configuration, your MCP client (e.g., Cursor) will auto-start the server when invoking tools. For manual testing:
```bash
export BYBIT_API_KEY=""
export BYBIT_API_SECRET=""
export BYBIT_TESTNET="false"

bun x bybit-mcp@1.0.9
```

中文
------

## 先决条件

### macOS / Linux

1. 安装 **Bun**：
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
2. 安装 **Node.js** 和 **npm**：
   ```bash
   # macOS (Homebrew)
   brew install node

   # Debian/Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

### Windows (PowerShell)

1. 安装 **Bun**：
   ```powershell
iwr https://bun.sh/install -useb | iex
   ```
2. 安装 **Node.js**：
   - 请前往 https://nodejs.org/ 下载并安装

## 安装

### 推荐使用 Bun
```bash
bun x bybit-mcp@1.0.9
```

### 使用 npm
```bash
npx bybit-mcp@1.0.9
```

### 使用 Yarn
```bash
yarn dlx bybit-mcp@1.0.9
```

## 配置

创建或更新 `mcp.json`（或 `.cursor/mcp.json`）:
```json
{
  "mcpServers": {
    "bybit": {
      "command": "bun",
      "args": ["x","bybit-mcp@1.0.9"],
      "env": {
        "BYBIT_API_KEY": "",
        "BYBIT_API_SECRET": "",
        "BYBIT_TESTNET": "false"
      }
    }
  }
}
```

- `BYBIT_API_KEY`: 您的 Bybit API Key
- `BYBIT_API_SECRET`: 您的 Bybit API Secret
- `BYBIT_TESTNET`: 设置为 `"true"` 使用测试网，`"false"` 或省略使用主网

## 运行

配置完成后，MCP 客户端（如 Cursor）将自动启动服务器。手动测试：
```bash
export BYBIT_API_KEY=""
export BYBIT_API_SECRET=""
export BYBIT_TESTNET="false"

bun x bybit-mcp@1.0.9
```

## npx 版本 HTTP 服務啟動

```bash
# 以 npx 啟動 HTTP 服務，並傳入 Bybit API 金鑰
BYBIT_API_KEY=你的key BYBIT_API_SECRET=你的secret BYBIT_TESTNET=false npx bybit-mcp@latest
# 或指定 PORT
PORT=8080 BYBIT_API_KEY=你的key BYBIT_API_SECRET=你的secret npx bybit-mcp@latest
```

## Zeabur 雲端部署

1. 於 Zeabur 新建 Node.js 專案，將本專案上傳。
2. 設定啟動指令：
   ```bash
   npx bybit-mcp@latest
   ```
3. 於 Zeabur 控制台設置環境變數：
   - `BYBIT_API_KEY`：用戶 Bybit API Key
   - `BYBIT_API_SECRET`：用戶 Bybit API Secret
   - `BYBIT_TESTNET`：如需測試網設為 `true`
   - `PORT`：自訂 HTTP 服務埠（預設 3001）
4. 部署後，HTTP 服務將於 `/sse` 提供 SSE 端點。

## ⚠️ 部署注意事項

- **Zeabur 或任何雲端部署，請務必啟動 HTTP 服務模式**：
  - 推薦啟動指令：
    ```bash
    npx bybit-mcp@latest
    # 或
    bun run src/server/http-server.ts
    # 或
    node build/server/http-server.js
    ```
  - 預設監聽 3001 埠，Zeabur 會自動健康檢查 HTTP 端口。
- **本地開發測試**可用 stdio 模式（bun run src/index.ts），但此模式不會啟動 HTTP 服務，僅供本地命令列互動。

---
