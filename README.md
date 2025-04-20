# Bybit MCP Server

本專案是一個專為 Bybit 交易所打造的 MCP Server，讓用戶可透過 MCP 標準協議，安全、便捷地遠端自動化操作 Bybit 的合約、現貨、資產、錢包等功能。

---

## 你能用它做什麼？
- 以標準 MCP 客戶端（如 Cursor MCP）連接本服務，無需本地部署，即可：
  - 下單（合約/現貨）
  - 查詢持倉、資產、錢包餘額
  - 擴展更多自動化交易與 Web3 應用
- 適合 AI 代理、量化交易、Web3 應用等場景

---

## 如何安裝 MCP 客戶端

### 1. Windows 系統
- 前往 [Cursor 官網](https://www.cursor.so/) 下載 Windows 版本安裝檔，依指示安裝。
- 安裝後啟動 Cursor，新增 MCP 服務連線，填入服務端 endpoint（如 `https://your-cloud-domain.com/mcp`）。

### 2. macOS 系統
- 前往 [Cursor 官網](https://www.cursor.so/) 下載 macOS 版本，拖曳至應用程式資料夾安裝。
- 啟動 Cursor，新增 MCP 服務連線，填入 endpoint。

### 3. Linux 系統
- 下載 AppImage 或執行檔，賦予執行權限：
```bash
chmod +x cursor-x86_64.AppImage
./cursor-x86_64.AppImage
```
- 啟動後同樣新增 MCP 服務連線。

### 4. 連線設定範例
```json
{
  "name": "bybit-mcp-cloud",
  "endpoint": "https://your-cloud-domain.com/mcp"
}
```

---

## 參考資源
- [fastapi_mcp](https://github.com/tadata-org/fastapi_mcp)
- [Bybit API Docs](https://bybit-exchange.github.io/docs/zh-TW/v5/guide)
- [pybit](https://github.com/bybit-exchange/pybit)

## MCP工具自動暴露
- 所有FastAPI路由自動成為MCP工具，支援Cursor、Claude等MCP客戶端。

## 擴展
- 於`main.py`中新增API路由，根據Bybit權限需求擴展。
- 權限中介層可根據API Key權限自動啟用/禁用API。

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