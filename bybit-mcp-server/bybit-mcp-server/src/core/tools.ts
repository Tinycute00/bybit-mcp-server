import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import { RestClientV5 } from 'bybit-api';

// 讀取環境變數
const BYBIT_API_KEY = process.env.BYBIT_API_KEY || '';
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET || '';
const BYBIT_TESTNET = process.env.BYBIT_TESTNET === 'true';

// 初始化 Bybit API 客戶端
const bybitClient = new RestClientV5({
  testnet: BYBIT_TESTNET,
  key: BYBIT_API_KEY,
  secret: BYBIT_API_SECRET,
});

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // Greeting tool
  server.addTool({
    name: "hello_world",
    description: "A simple hello world tool",
    parameters: z.object({
      name: z.string().describe("Name to greet")
    }),
    execute: async (params) => {
      const greeting = services.GreetingService.generateGreeting(params.name);
      return greeting;
    }
  });

  // Farewell tool
  server.addTool({
    name: "goodbye",
    description: "A simple goodbye tool",
    parameters: z.object({
      name: z.string().describe("Name to bid farewell to")
    }),
    execute: async (params) => {
      const farewell = services.GreetingService.generateFarewell(params.name);
      return farewell;
    }
  });

  // 定義訂單相關工具
  server.addTool({
    name: 'createOrder',
    description: '提交 Bybit 訂單',
    parameters: z.object({
      symbol: z.string().describe('交易對，如 BTCUSDT'),
      side: z.string().describe('買入或賣出，值為 Buy 或 Sell'),
      orderType: z.string().describe('訂單類型，如 Limit 或 Market'),
      qty: z.string().describe('訂單數量'),
      price: z.string().optional().describe('訂單價格，僅限價單需要'),
      category: z.string().describe('產品類型，如 linear (USDT永續), spot (現貨)')
    }),
    execute: async (params) => {
      try {
        // 使用 any 類型以避免類型錯誤，實際上應調用 Bybit API
        const response = await (bybitClient as any).submitOrder({
          symbol: params.symbol,
          side: params.side,
          orderType: params.orderType,
          qty: params.qty,
          price: params.price,
          category: params.category,
        });
        return `Order created successfully: ${JSON.stringify(response)}`;
      } catch (error) {
        return `Error creating order: ${(error as Error).message}`;
      }
    },
  });

  // 定義查詢訂單工具
  server.addTool({
    name: 'queryOrder',
    description: '查詢 Bybit 訂單資訊',
    parameters: z.object({
      symbol: z.string().optional().describe('交易對，如 BTCUSDT'),
      orderId: z.string().optional().describe('訂單 ID'),
      category: z.string().describe('產品類型，如 linear (USDT永續), spot (現貨)')
    }),
    execute: async (params) => {
      try {
        // 使用 any 類型以避免類型錯誤，實際上應調用 Bybit API
        const response = await (bybitClient as any).getActiveOrders({
          symbol: params.symbol,
          orderId: params.orderId,
          category: params.category,
        });
        return `Order queried successfully: ${JSON.stringify(response)}`;
      } catch (error) {
        return `Error querying order: ${(error as Error).message}`;
      }
    },
  });

  // 定義持倉相關工具
  server.addTool({
    name: 'queryPosition',
    description: '查詢 Bybit 持倉資訊',
    parameters: z.object({
      symbol: z.string().optional().describe('交易對，如 BTCUSDT'),
      category: z.string().describe('產品類型，如 linear (USDT永續)')
    }),
    execute: async (params) => {
      try {
        // 使用 any 類型以避免類型錯誤，實際上應調用 Bybit API
        const response = await (bybitClient as any).getPosition({
          symbol: params.symbol,
          category: params.category,
        });
        return `Position queried successfully: ${JSON.stringify(response)}`;
      } catch (error) {
        return `Error querying position: ${(error as Error).message}`;
      }
    },
  });

  // 定義現貨交易工具
  server.addTool({
    name: 'spotTrade',
    description: '提交或查詢 Bybit 現貨交易',
    parameters: z.object({
      symbol: z.string().describe('交易對，如 BTCUSDT'),
      side: z.string().describe('買入或賣出，值為 Buy 或 Sell'),
      orderType: z.string().describe('訂單類型，如 Limit 或 Market'),
      qty: z.string().describe('訂單數量'),
      price: z.string().optional().describe('訂單價格，僅限價單需要')
    }),
    execute: async (params) => {
      try {
        // 使用 any 類型以避免類型錯誤，實際上應調用 Bybit API
        const response = await (bybitClient as any).submitOrder({
          symbol: params.symbol,
          side: params.side,
          orderType: params.orderType,
          qty: params.qty,
          price: params.price,
          category: 'spot',
        });
        return `Spot trade created successfully: ${JSON.stringify(response)}`;
      } catch (error) {
        return `Error creating spot trade: ${(error as Error).message}`;
      }
    },
  });

  // 定義活期儲蓄和鏈上賺幣工具
  server.addTool({
    name: 'savingsAndStaking',
    description: '查詢或操作 Bybit 活期儲蓄和鏈上賺幣',
    parameters: z.object({
      action: z.string().describe('操作類型，如 subscribe (認購), redeem (贖回), query (查詢)'),
      productId: z.string().optional().describe('產品 ID'),
      amount: z.string().optional().describe('認購或贖回金額')
    }),
    execute: async (params) => {
      // 此處應實現 Bybit API 活期儲蓄和鏈上賺幣邏輯
      return `Savings and Staking action: ${params.action}, Product ID: ${params.productId || 'N/A'}, Amount: ${params.amount || 'N/A'}`;
    },
  });

  console.error('Tools registered');
}