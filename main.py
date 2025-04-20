from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi_mcp import FastApiMCP
from pybit.unified_trading import HTTP
import os

app = FastAPI(title="Bybit MCP Service")

# 環境變數取得API KEY/SECRET
BYBIT_API_KEY = os.getenv("BYBIT_API_KEY", "")
BYBIT_API_SECRET = os.getenv("BYBIT_API_SECRET", "")
BYBIT_TESTNET = os.getenv("BYBIT_TESTNET", "true").lower() == "true"

# Bybit API初始化
def get_bybit_client():
    if not BYBIT_API_KEY or not BYBIT_API_SECRET:
        raise HTTPException(status_code=401, detail="API Key/Secret 未設置")
    return HTTP(
        testnet=BYBIT_TESTNET,
        api_key=BYBIT_API_KEY,
        api_secret=BYBIT_API_SECRET
    )

# 合約下單
@app.post("/contract/order", operation_id="create_contract_order")
def create_contract_order(symbol: str, side: str, qty: float, order_type: str = "Market", client=Depends(get_bybit_client), perm=Depends(require_permission("order"))):
    return client.place_active_order(symbol=symbol, side=side, order_type=order_type, qty=qty)

# 查詢持倉
@app.get("/contract/position", operation_id="get_contract_position")
def get_contract_position(symbol: str, client=Depends(get_bybit_client), perm=Depends(require_permission("position"))):
    return client.get_positions(symbol=symbol)

# 查詢資產
@app.get("/asset", operation_id="get_asset")
def get_asset(client=Depends(get_bybit_client), perm=Depends(require_permission("asset"))):
    return client.get_wallet_balance()

# 現貨下單
@app.post("/trade/spot", tags=["trading"])
def create_spot_order(symbol: str, side: str, qty: float, order_type: str = "Market", client=Depends(get_bybit_client)):
    return client.place_spot_order(symbol=symbol, side=side, order_type=order_type, qty=qty)

# 查詢資產
@app.get("/wallet/balance", tags=["wallet"])
def get_wallet_balance(client=Depends(get_bybit_client)):
    return client.get_wallet_balance()

# 查詢持倉
@app.get("/position/{symbol}", tags=["position"])
def get_position(symbol: str, client=Depends(get_bybit_client)):
    return client.get_positions(symbol=symbol)

# MCP自動暴露
mcp = FastApiMCP(app)
mcp.mount()

@app.get("/mcp/tools", tags=["mcp"])
def list_mcp_tools():
    exclude_prefixes = ["/openapi.json", "/docs", "/redoc", "/mcp/messages/", "/mcp"]
    tools = []
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            if not any(route.path.startswith(prefix) for prefix in exclude_prefixes):
                tools.append({
                    "path": route.path,
                    "methods": list(route.methods - {"HEAD", "OPTIONS"}),
                    "name": getattr(route, 'name', None),
                    "summary": getattr(route, 'summary', None)
                })
    return {"tools": tools}

# 啟動命令：
# uvicorn main:app --reload 