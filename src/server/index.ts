import { FastMCP } from '@fastmcp/core';
import { TradingService, MarketService, AccountService } from '../core/services';

export async function startServer(mcp: FastMCP) {
  const apiKey = process.env.BYBIT_API_KEY || '';
  const apiSecret = process.env.BYBIT_API_SECRET || '';
  const testnet = process.env.BYBIT_TESTNET === 'true';

  const tradingService = new TradingService(apiKey, apiSecret, testnet);
  const marketService = new MarketService(apiKey, apiSecret, testnet);
  const accountService = new AccountService(apiKey, apiSecret, testnet);

  // Register services
  mcp.registerService('trading', tradingService);
  mcp.registerService('market', marketService);
  mcp.registerService('account', accountService);

  // Start the server
  await mcp.start();
  console.log('Bybit MCP Server started successfully');
}
