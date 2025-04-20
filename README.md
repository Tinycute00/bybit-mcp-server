# Bybit MCP 自動化服務

## 目標
- 自動將Bybit API（合約、現貨、USDC合約、資產、錢包、兌換、理財等）暴露為MCP工具，支援主網/測試網、HMAC/RSA簽名。
- 支援API Key權限自動調整，方便Web3應用、AI代理、量化交易等場景。

## 安裝
```bash
pip install -r requirements.txt
```

## 啟動
1. 設定環境變數：
   - `BYBIT_API_KEY`、`BYBIT_API_SECRET`、`BYBIT_TESTNET`（true/false）
2. 啟動服務：
```bash
uvicorn main:app --reload
```

## MCP工具自動暴露
- 所有FastAPI路由自動成為MCP工具，支援Cursor、Claude等MCP客戶端。

## 擴展
- 於`main.py`中新增API路由，根據Bybit權限需求擴展。
- 權限中介層可根據API Key權限自動啟用/禁用API。

## 參考
- [fastapi_mcp](https://github.com/tadata-org/fastapi_mcp)
- [Bybit API Docs](https://bybit-exchange.github.io/docs/zh-TW/v5/guide)
- [pybit](https://github.com/bybit-exchange/pybit) 