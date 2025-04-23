"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTools = registerTools;
var zod_1 = require("zod");
var services = require("./services/index.js");
var bybit_api_1 = require("bybit-api");
// 讀取環境變數
var BYBIT_API_KEY = process.env.BYBIT_API_KEY || '';
var BYBIT_API_SECRET = process.env.BYBIT_API_SECRET || '';
var BYBIT_TESTNET = process.env.BYBIT_TESTNET === 'true';
// 初始化 Bybit API 客戶端
var bybitClient = new bybit_api_1.RestClientV5({
    testnet: BYBIT_TESTNET,
    key: BYBIT_API_KEY,
    secret: BYBIT_API_SECRET,
});
/**
 * Register all tools with the MCP server
 *
 * @param server The FastMCP server instance
 */
function registerTools(server) {
    var _this = this;
    // Greeting tool
    server.addTool({
        name: "hello_world",
        description: "A simple hello world tool",
        parameters: zod_1.z.object({
            name: zod_1.z.string().describe("Name to greet")
        }),
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var greeting;
            return __generator(this, function (_a) {
                greeting = services.GreetingService.generateGreeting(params.name);
                return [2 /*return*/, greeting];
            });
        }); }
    });
    // Farewell tool
    server.addTool({
        name: "goodbye",
        description: "A simple goodbye tool",
        parameters: zod_1.z.object({
            name: zod_1.z.string().describe("Name to bid farewell to")
        }),
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var farewell;
            return __generator(this, function (_a) {
                farewell = services.GreetingService.generateFarewell(params.name);
                return [2 /*return*/, farewell];
            });
        }); }
    });
    // 定義訂單相關工具
    server.addTool({
        name: 'createOrder',
        description: '提交 Bybit 訂單',
        parameters: {
            symbol: { type: 'string', description: '交易對，如 BTCUSDT', required: true },
            side: { type: 'string', description: '買入或賣出，值為 Buy 或 Sell', required: true },
            orderType: { type: 'string', description: '訂單類型，如 Limit 或 Market', required: true },
            qty: { type: 'string', description: '訂單數量', required: true },
            price: { type: 'string', description: '訂單價格，僅限價單需要', required: false },
            category: { type: 'string', description: '產品類型，如 linear (USDT永續), spot (現貨)', required: true },
        },
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, bybitClient.createOrder({
                                symbol: params.symbol,
                                side: params.side,
                                orderType: params.orderType,
                                qty: params.qty,
                                price: params.price,
                                category: params.category,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, "Order created successfully: ".concat(JSON.stringify(response))];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, "Error creating order: ".concat(error_1.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    });
    // 定義查詢訂單工具
    server.addTool({
        name: 'queryOrder',
        description: '查詢 Bybit 訂單資訊',
        parameters: {
            symbol: { type: 'string', description: '交易對，如 BTCUSDT', required: false },
            orderId: { type: 'string', description: '訂單 ID', required: false },
            category: { type: 'string', description: '產品類型，如 linear (USDT永續), spot (現貨)', required: true },
        },
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, bybitClient.getOpenOrders({
                                symbol: params.symbol,
                                orderId: params.orderId,
                                category: params.category,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, "Order queried successfully: ".concat(JSON.stringify(response))];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, "Error querying order: ".concat(error_2.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    });
    // 定義持倉相關工具
    server.addTool({
        name: 'queryPosition',
        description: '查詢 Bybit 持倉資訊',
        parameters: {
            symbol: { type: 'string', description: '交易對，如 BTCUSDT', required: false },
            category: { type: 'string', description: '產品類型，如 linear (USDT永續)', required: true },
        },
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, bybitClient.getPositionInfo({
                                symbol: params.symbol,
                                category: params.category,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, "Position queried successfully: ".concat(JSON.stringify(response))];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, "Error querying position: ".concat(error_3.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    });
    // 定義現貨交易工具
    server.addTool({
        name: 'spotTrade',
        description: '提交或查詢 Bybit 現貨交易',
        parameters: {
            symbol: { type: 'string', description: '交易對，如 BTCUSDT', required: true },
            side: { type: 'string', description: '買入或賣出，值為 Buy 或 Sell', required: true },
            orderType: { type: 'string', description: '訂單類型，如 Limit 或 Market', required: true },
            qty: { type: 'string', description: '訂單數量', required: true },
            price: { type: 'string', description: '訂單價格，僅限價單需要', required: false },
        },
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, bybitClient.createOrder({
                                symbol: params.symbol,
                                side: params.side,
                                orderType: params.orderType,
                                qty: params.qty,
                                price: params.price,
                                category: 'spot',
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, "Spot trade created successfully: ".concat(JSON.stringify(response))];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, "Error creating spot trade: ".concat(error_4.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    });
    // 定義活期儲蓄和鏈上賺幣工具
    server.addTool({
        name: 'savingsAndStaking',
        description: '查詢或操作 Bybit 活期儲蓄和鏈上賺幣',
        parameters: {
            action: { type: 'string', description: '操作類型，如 subscribe (認購), redeem (贖回), query (查詢)', required: true },
            productId: { type: 'string', description: '產品 ID', required: false },
            amount: { type: 'string', description: '認購或贖回金額', required: false },
        },
        execute: function (params) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // 此處應實現 Bybit API 活期儲蓄和鏈上賺幣邏輯
                return [2 /*return*/, "Savings and Staking action: ".concat(params.action, ", Product ID: ").concat(params.productId || 'N/A', ", Amount: ").concat(params.amount || 'N/A')];
            });
        }); },
    });
    console.error('Tools registered');
}
