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

## Installation

```bash
npm install bybit-mcp
```

## Configuration

Set the following environment variables:

```env
BYBIT_API_KEY=your_api_key
BYBIT_API_SECRET=your_api_secret
BYBIT_TESTNET=true/false
```

## Usage

```typescript
import { startServer } from 'bybit-mcp';

startServer();
```

## Documentation

For detailed API documentation, please refer to the [Bybit API docs](https://bybit-exchange.github.io/docs/zh-TW/v5/intro).
