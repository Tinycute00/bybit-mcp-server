# Bybit MCP 製作進度記錄

## 1. 自我提問與決策
- 目標：自動化構建Bybit API的MCP服務，支援多業務型態與權限。
- 工具選擇：首選 fastapi_mcp，因其支援Python、API自動暴露、權限擴展性佳。
- API特性：需支援REST、簽名認證（HMAC/RSA）、多業務（合約、現貨、資產、理財等）。
- 權限管理：需根據API Key權限自動調整可用API。
- 測試策略：使用 pytest 框架進行 API 連通性測試、權限端點測試和訂單放置測試（僅在測試網執行）。

## 2. 執行步驟
- [x] 建立進度記錄(progress.md)
- [x] 建立專案願景(project-vision.md)
- [x] 建立任務清單(current-tasks.md)
- [x] 建立依賴文件(requirements.txt)並安裝
- [x] 建立README
- [x] 建立FastAPI主程式(main.py骨架)
- [x] 擴充API路由（合約、現貨、資產、理財等）
- [x] 權限中介層設計
- [x] 測試與驗證
- [x] 記憶庫與日誌更新

## 2024-06-09 MCP工具自動暴露檢查

### 問題描述
- FastApiMCP 已掛載，理論上應自動暴露所有FastAPI路由為MCP工具。
- 但啟動後僅有 `/mcp`、`/mcp/messages/` endpoint，**未見 `/mcp/tools` 或工具清單**。
- FastAPI路由如 `/trade/contract`、`/trade/spot` 等已存在，但未被MCP自動發現。

### 自我提問
1. fastapi_mcp 版本是否過舊或安裝異常？
2. 掛載方式是否正確？
3. 依賴或設定是否有誤？

### 檢查步驟
- 列出FastAPI所有路由，確認僅有 `/mcp`、`/mcp/messages/` endpoint。
- 查閱 fastapi_mcp 官方文件，確認自動工具清單支援情況。

### 修正建議
1. 升級 fastapi_mcp 至最新版，確保支援自動工具清單。
2. 如仍無法自動暴露，考慮手動實作 `/mcp/tools` endpoint，將現有FastAPI路由暴露為MCP工具清單。
3. 持續記錄自我提問與修正進度。

--- 