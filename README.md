# Bybit MCP Server

A FastMCP server implementation for integrating with the Bybit exchange API.

## Features

- Full V5 API support
- Unified account trading
- Support for spot, futures, and options trading
- Real-time market data streaming
- Position management
- Order management
- Asset management

## System Requirements

- Node.js 16.x or higher
- npm 7.x or higher (or yarn/pnpm)

## Installation

### Windows

1. Install Node.js from [official website](https://nodejs.org/)
2. Open PowerShell or Command Prompt
3. Install the package:
```powershell
npm install bybit-mcp
```

### macOS/Linux

1. Using nvm (recommended):
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 16
nvm use 16

# Install the package
npm install bybit-mcp
```

2. Or using package manager:

For macOS (using Homebrew):
```bash
brew install node
npm install bybit-mcp
```

For Linux (using apt):
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install bybit-mcp
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
BYBIT_API_KEY=your_api_key
BYBIT_API_SECRET=your_api_secret
BYBIT_TESTNET=true/false
```

### Windows Specific

You can also set environment variables through System Properties:
1. Open System Properties > Advanced > Environment Variables
2. Add new System Variables with the above keys and values

### macOS/Linux Specific

Add to your shell profile (~/.bash_profile, ~/.zshrc, etc.):
```bash
export BYBIT_API_KEY=your_api_key
export BYBIT_API_SECRET=your_api_secret
export BYBIT_TESTNET=true/false
```

## Usage

```typescript
import { startServer } from 'bybit-mcp';

startServer();
```

## Development Setup

### Windows
```powershell
git clone https://github.com/your-username/bybit-mcp-server.git
cd bybit-mcp-server
npm install
npm run dev
```

### macOS/Linux
```bash
git clone https://github.com/your-username/bybit-mcp-server.git
cd bybit-mcp-server
npm install
npm run dev
```

## Documentation

For detailed API documentation, please refer to the [Bybit API docs](https://bybit-exchange.github.io/docs/zh-TW/v5/intro).
