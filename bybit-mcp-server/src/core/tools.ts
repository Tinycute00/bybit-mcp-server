import { FastMCP } from "fastmcp";
import { z } from "zod";
import { RestClientV5, CategoryV5, AccountTypeV5, OrderSideV5, OrderTypeV5 } from 'bybit-api';

// Helper function to create Bybit client
function getBybitClient() {
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;
  const useTestnet = process.env.BYBIT_TESTNET?.toLowerCase() === 'true';

  if (!apiKey || !apiSecret) {
    throw new Error("API key or secret not configured in server environment.");
  }

  return new RestClientV5({
    key: apiKey,
    secret: apiSecret,
    testnet: useTestnet,
  });
}

// Helper function to execute API calls and handle errors/return JSON
async function executeApiCall(apiCall: () => Promise<any>) {
  try {
    const response = await apiCall();

    // Basic check if response is an object and has retCode
    if (typeof response !== 'object' || response === null || typeof response.retCode === 'undefined') {
      // Log the unexpected response for server-side debugging if needed
      // console.error("Unexpected API response format:", response);
      return JSON.stringify({ 
        error: "Unexpected API response format from Bybit.", 
        details: response // Include the raw response if possible
      });
    }

    // Bybit V5 typically uses retCode 0 for success
    if (response.retCode !== 0) {
      return JSON.stringify({ 
        error: `Bybit API Error (${response.retCode}): ${response.retMsg || 'Unknown error'}`, 
        details: response 
      });
    }
    // Attempt to stringify, catching potential circular references or other issues
    try {
      return JSON.stringify(response);
    } catch (stringifyError: any) {
      return JSON.stringify({ 
        error: "Failed to stringify successful API response.", 
        details: `retCode: ${response.retCode}, retMsg: ${response.retMsg}, Error: ${stringifyError.message}` 
      });
    }
  } catch (error: any) {
    // Log the error for server-side debugging if needed
    // console.error("API Call Exception:", error);
    let errorMessage = "Failed to execute API call.";
    let errorDetails = error;

    if (error instanceof Error) {
        errorMessage = error.message;
        // Attempt to capture more details if available
        errorDetails = { 
            message: error.message, 
            name: error.name, 
            stack: error.stack 
            // Add any other relevant properties if they exist on the error object
        };
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // Ensure the final output is always valid JSON
    try {
      return JSON.stringify({ 
        error: errorMessage, 
        details: errorDetails 
      });
    } catch (stringifyError: any) {
      // Fallback if even the error object cannot be stringified
      return JSON.stringify({ 
        error: "Failed to execute API call and could not stringify the error details.",
        details: String(error) // Convert error to string as a last resort
      });
    }
  }
}

/**
 * Register all core Bybit tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {

  // --- 帳戶信息 (Account Info) ---

  server.addTool({
    name: "mcp_bybit_get_wallet_balance",
    description: "查詢錢包餘額 (Query wallet balance)",
    parameters: z.object({
      accountType: z.enum(["UNIFIED", "CONTRACT", "SPOT"]).optional().describe("賬戶類型 (Account type). UNIFIED/CONTRACT/SPOT. 默認 UNIFIED.")
    }),
    execute: async (params) => {
      const client = getBybitClient();
      return executeApiCall(() => client.getWalletBalance({ 
        accountType: (params.accountType ?? 'UNIFIED') as AccountTypeV5 
      }));
    }
  });

  server.addTool({
    name: "mcp_bybit_get_dcp_info",
    description: "查詢斷線保護配置 (Query Disconnect Protect configuration)",
    parameters: z.object({}), // No parameters needed
    execute: async () => {
      const client = getBybitClient();
      return executeApiCall(() => client.getDCPInfo());
    }
  });

  // --- 現貨交易 (Spot Trading) ---

  server.addTool({
    name: "mcp_bybit_place_spot_order",
    description: "提交現貨訂單 (Submit a spot order)",
    parameters: z.object({
      apiKey: z.string().optional().describe("Bybit API Key (可選, 不填則用服務器環境變數)"),
      apiSecret: z.string().optional().describe("Bybit API Secret (可選, 不填則用服務器環境變數)"),
      symbol: z.string().describe("交易對 (Trading pair), e.g., BTCUSDT"),
      side: z.enum(["Buy", "Sell"]).describe("訂單方向 (Order side)"),
      orderType: z.enum(["Market", "Limit"]).describe("訂單類型 (Order type)"),
      qty: z.string().describe("訂單數量 (Order quantity). For Market orders, see marketUnit."),
      marketUnit: z.enum(["baseCoin", "quoteCoin"]).optional().describe("Market order unit (baseCoin/quoteCoin). Default: baseCoin."),
      price: z.string().optional().describe("限價單價格 (Limit order price)."),
      timeInForce: z.enum(["GTC", "IOC", "FOK"]).optional().describe("Time in force (GTC/IOC/FOK). Default: GTC."),
      orderLinkId: z.string().optional().describe("用戶自定義訂單 ID (User custom order ID).")
    }),
    execute: async (params) => {
      const client = (() => {
        // 動態傳入 apiKey/apiSecret
        if (params.apiKey && params.apiSecret) {
          const useTestnet = process.env.BYBIT_TESTNET?.toLowerCase() === 'true';
          return new RestClientV5({
            key: params.apiKey,
            secret: params.apiSecret,
            testnet: useTestnet,
          });
        }
        return getBybitClient();
      })();
      const orderParams: any = {
        category: 'spot' as const,
        ...params // Spread operator handles optional params
      };
      // 移除 apiKey/apiSecret，避免傳遞到 bybit sdk
      delete orderParams.apiKey;
      delete orderParams.apiSecret;
      return executeApiCall(() => client.submitOrder(orderParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_get_spot_order_history",
    description: "查詢現貨歷史訂單 (Query spot order history)",
    parameters: z.object({
      symbol: z.string().optional().describe("交易對 (Trading pair), e.g., BTCUSDT"),
      orderId: z.string().optional().describe("按訂單ID查詢 (Query by order ID)"),
      orderLinkId: z.string().optional().describe("按用戶自定義ID查詢 (Query by orderLinkId)"),
      limit: z.number().optional().describe("返回數量限制 (Limit for data size per page). Default: 50, Max: 500")
      // Add other filter params like startTime, endTime, orderStatus etc. as needed
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        category: 'spot' as const,
        ...params
      };
      return executeApiCall(() => client.getHistoricOrders(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_cancel_spot_order",
    description: "撤銷單個現貨訂單 (Cancel a single spot order)",
    parameters: z.object({
      symbol: z.string().describe("交易對 (Trading pair), e.g., BTCUSDT"),
      orderId: z.string().optional().describe("Bybit 訂單 ID (Order ID)"),
      orderLinkId: z.string().optional().describe("用戶自定義訂單 ID (User custom order ID). Use either orderId or orderLinkId.")
    }),
    execute: async (params) => {
      if (!params.orderId && !params.orderLinkId) {
        return JSON.stringify({ error: "Either orderId or orderLinkId is required." });
      }
      const client = getBybitClient();
      const apiParams: any = {
        category: 'spot' as const,
        ...params
      };
      return executeApiCall(() => client.cancelOrder(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_cancel_all_spot_orders",
    description: "撤銷所有現貨訂單 (Cancel all spot orders)",
    parameters: z.object({
      symbol: z.string().optional().describe("指定交易對 (Specify trading pair)"),
      baseCoin: z.string().optional().describe("指定基礎幣 (Specify base coin)"),
      settleCoin: z.string().optional().describe("指定計價幣 (Specify settle coin)")
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        category: 'spot' as const,
        ...params
      };
      return executeApiCall(() => client.cancelAllOrders(apiParams));
    }
  });

  // --- 合約交易 (Contract Trading) ---
  const contractCategory = z.enum(["linear", "inverse"]).describe("合約類型 (Contract category): linear or inverse");

  server.addTool({
    name: "mcp_bybit_place_contract_order",
    description: "提交合約訂單 (Submit a contract order - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().describe("交易對 (Trading pair), e.g., BTCUSDT or BTCUSD"),
      side: z.enum(["Buy", "Sell"]).describe("訂單方向 (Order side)"),
      orderType: z.enum(["Market", "Limit"]).describe("訂單類型 (Order type)"),
      qty: z.string().describe("訂單數量 (Order quantity)"),
      price: z.string().optional().describe("限價單價格 (Limit order price)."),
      reduceOnly: z.boolean().optional().describe("是否為只減倉訂單 (Is reduce-only order)"),
      timeInForce: z.enum(["GTC", "IOC", "FOK"]).optional().describe("Time in force (GTC/IOC/FOK). Default: GTC."),
      orderLinkId: z.string().optional().describe("用戶自定義訂單 ID (User custom order ID).")
      // Add other params like triggerPrice, stopLoss, takeProfit etc. as needed
    }),
    execute: async (params) => {
      const client = getBybitClient();
      // Cast category to CategoryV5
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.submitOrder(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_get_contract_order_history",
    description: "查詢合約歷史訂單 (Query contract order history - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().optional().describe("交易對 (Trading pair)"),
      orderId: z.string().optional().describe("按訂單ID查詢 (Query by order ID)"),
      orderLinkId: z.string().optional().describe("按用戶自定義ID查詢 (Query by orderLinkId)"),
      limit: z.number().optional().describe("返回數量限制 (Limit for data size per page). Default: 50, Max: 500")
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.getHistoricOrders(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_amend_contract_order",
    description: "修改合約訂單 (Amend contract order - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().describe("交易對 (Trading pair)"),
      orderId: z.string().optional().describe("Bybit 訂單 ID (Order ID)"),
      orderLinkId: z.string().optional().describe("用戶自定義訂單 ID (User custom order ID)"),
      qty: z.string().optional().describe("新的訂單數量 (New order quantity)"),
      price: z.string().optional().describe("新的訂單價格 (New order price)")
      // Add other amendable params like triggerPrice, sl, tp etc.
    }),
    execute: async (params) => {
      if (!params.orderId && !params.orderLinkId) {
        return JSON.stringify({ error: "Either orderId or orderLinkId is required." });
      }
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.amendOrder(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_cancel_contract_order",
    description: "撤銷單個合約訂單 (Cancel a single contract order - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().describe("交易對 (Trading pair)"),
      orderId: z.string().optional().describe("Bybit 訂單 ID (Order ID)"),
      orderLinkId: z.string().optional().describe("用戶自定義訂單 ID (User custom order ID)")
    }),
    execute: async (params) => {
      if (!params.orderId && !params.orderLinkId) {
        return JSON.stringify({ error: "Either orderId or orderLinkId is required." });
      }
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.cancelOrder(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_cancel_all_contract_orders",
    description: "撤銷所有合約訂單 (Cancel all contract orders - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().optional().describe("指定交易對 (Specify trading pair)"),
      baseCoin: z.string().optional().describe("指定基礎幣 (Specify base coin)"),
      settleCoin: z.string().optional().describe("指定結算幣 (Specify settle coin)") // Usually for linear/inverse
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.cancelAllOrders(apiParams));
    }
  });

  // --- 合約倉位 (Contract Positions) ---

  server.addTool({
    name: "mcp_bybit_get_positions",
    description: "查詢合約倉位 (Query contract positions - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().optional().describe("交易對 (Trading pair)"),
      baseCoin: z.string().optional().describe("基礎幣 (Base coin)"),
      settleCoin: z.string().optional().describe("結算幣 (Settle coin)")
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.getPositionInfo(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_set_position_leverage",
    description: "設置倉位槓桿 (Set position leverage - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().describe("交易對 (Trading pair)"),
      buyLeverage: z.string().describe("買方向槓桿 (Buy leverage)"),
      sellLeverage: z.string().describe("賣方向槓桿 (Sell leverage)")
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5
      };
      return executeApiCall(() => client.setLeverage(apiParams));
    }
  });

  server.addTool({
    name: "mcp_bybit_add_position_margin",
    description: "增加/減少倉位保證金 (Add/Reduce position margin - linear/inverse)",
    parameters: z.object({
      category: contractCategory,
      symbol: z.string().describe("交易對 (Trading pair)"),
      margin: z.string().describe("要增加或減少的保證金數量 (Amount of margin to add (>0) or reduce (<0))"),
      positionIdx: z.enum(["0", "1", "2"]).optional().describe("倉位標識 (Position index: 0=One-Way, 1=Buy Side, 2=Sell Side). Default: 0")
    }),
    execute: async (params) => {
      const client = getBybitClient();
      const apiParams: any = {
        ...params,
        category: params.category as CategoryV5,
        positionIdx: params.positionIdx ? parseInt(params.positionIdx) : 0
      };
      return executeApiCall(() => client.addOrReduceMargin(apiParams));
    }
  });

  // --- 理財 (Earn) - Placeholder - Need specific V5 API endpoints ---
  // server.addTool({ name: "mcp_bybit_subscribe_earn_product", ... });
  // server.addTool({ name: "mcp_bybit_get_earn_products", ... });
  // server.addTool({ name: "mcp_bybit_get_earn_orders", ... });
  // server.addTool({ name: "mcp_bybit_get_earn_positions", ... });
  // server.addTool({ name: "mcp_bybit_get_earn_yield_records", ... });

}