# Bybit MCP 自動化服務

## 目標
- 自動將Bybit API（合約、現貨、USDC合約、資產、錢包、兌換、理財等）暴露為MCP工具，支援主網/測試網、HMAC/RSA簽名。
- 支援API Key權限自動調整，方便Web3應用、AI代理、量化交易等場景。

## 安裝與啟動

### 1. 環境需求
- Python 3.8 以上
- pip (Python 套件管理工具)

### 2. 安裝依賴
```bash
pip install -r requirements.txt
```

### 3. 設定環境變數
請於啟動前設置 Bybit API 金鑰（可用於測試網或主網）：
- Windows（PowerShell）：
```powershell
$env:BYBIT_API_KEY="你的API_KEY"
$env:BYBIT_API_SECRET="你的API_SECRET"
$env:BYBIT_TESTNET="true"  # 測試網設為 true，主網設為 false
```
- Linux/macOS（bash）：
```bash
export BYBIT_API_KEY="你的API_KEY"
export BYBIT_API_SECRET="你的API_SECRET"
export BYBIT_TESTNET="true"  # 測試網設為 true，主網設為 false
```

### 4. 啟動服務
```bash
uvicorn main:app --reload
```

啟動後可透過 http://127.0.0.1:8000/docs 查看API文件。

## MCP工具自動暴露
- 所有FastAPI路由自動成為MCP工具，支援Cursor、Claude等MCP客戶端。

## 擴展
- 於`main.py`中新增API路由，根據Bybit權限需求擴展。
- 權限中介層可根據API Key權限自動啟用/禁用API。

## 參考
- [fastapi_mcp](https://github.com/tadata-org/fastapi_mcp)
- [Bybit API Docs](https://bybit-exchange.github.io/docs/zh-TW/v5/guide)
- [pybit](https://github.com/bybit-exchange/pybit)

## MCP 客戶端安裝與使用

### 1. MCP 客戶端選擇
- **Cursor MCP**（推薦，支援自動工具發現與互動）
- **Claude MCP**（AI 代理互動）
- 其他支援 MCP 協議的客戶端

### 2. 安裝 Cursor MCP
- 前往 [Cursor 官網](https://www.cursor.so/) 下載並安裝對應作業系統的版本。
- 安裝完成後，啟動 Cursor。

### 3. 連線到本地 MCP 服務
- 在 Cursor MCP 客戶端中，新增一個 MCP 服務連線：
  - 服務地址（Endpoint）：`http://127.0.0.1:8000/mcp`（預設）
  - 若有自訂 port，請調整為對應的 port。
- 連線後即可自動發現並互動所有已暴露的 FastAPI 路由工具。

### 4. 其他 MCP 客戶端
- 依據客戶端官方文件安裝與設定，連線端點同上。

## 雲端部署與用戶端連線範例

本專案已部署於雲端，您只需安裝 MCP 客戶端並連接到服務器即可使用所有自動暴露的工具。

### 以 Cursor MCP 為例

1. 前往 [Cursor 官網](https://www.cursor.so/) 下載並安裝對應作業系統的 Cursor MCP 客戶端。
2. 啟動 Cursor。
3. 在 Cursor 內新增一個 MCP 服務連線，填入您的雲端服務器 endpoint，例如：

```json
{
  "name": "bybit-mcp-cloud",
  "endpoint": "https://your-cloud-domain.com/mcp"
}
```

4. 儲存後即可在 Cursor 內自動發現並互動所有 API 工具。

---

### 其他 MCP 客戶端

如需使用其他 MCP 客戶端（如 obsidian-mcp），請參考其官方文件，將 endpoint 設為您的雲端服務器位址即可。

--- 