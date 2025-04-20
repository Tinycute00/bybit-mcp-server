# Project Vision: Bybit MCP 自動化服務

## 目標
- 建立一個可自動暴露Bybit API為MCP工具的服務，支援多業務型態（合約、現貨、USDC合約、資產、錢包、兌換、理財等）。
- 實現API權限自動調整，根據API Key權限自動啟用/禁用對應API。
- 支援主網與測試網，並兼容HMAC/RSA簽名認證。
- 方便Web3應用、AI代理、或自動化交易系統直接調用。

## 範圍
- FastAPI + fastapi_mcp 為主體，Python生態整合Bybit官方SDK（pybit）。
- 支援API自動發現、文檔自動生成、權限中介層。
- 可擴展至其他交易所或Web3協議。 