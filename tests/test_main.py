import pytest
from fastapi.testclient import TestClient
from main import app, get_bybit_client, BYBIT_TESTNET, BYBIT_API_KEY, BYBIT_API_SECRET
import os

client = TestClient(app)

@pytest.fixture
def bybit_client():
    return get_bybit_client()

@pytest.mark.skipif(not BYBIT_API_KEY or not BYBIT_API_SECRET, reason="API Key/Secret not set")
def test_api_connectivity(bybit_client):
    """Test API connectivity for both mainnet and testnet."""
    response = bybit_client.get_server_time()
    assert 'result' in response, "Failed to connect to Bybit API"
    assert isinstance(response['result'], dict), "Unexpected response format"

@pytest.mark.skipif(not BYBIT_API_KEY or not BYBIT_API_SECRET, reason="API Key/Secret not set")
@pytest.mark.parametrize("endpoint,method,expected_permission", [
    ("/contract/position?symbol=BTCUSDT", "get", "position"),
    ("/asset", "get", "asset"),
    ("/spot/asset", "get", "spot"),
    ("/wallet", "get", "wallet"),
    ("/finance", "get", "finance"),
])
def test_permission_based_endpoints(endpoint, method, expected_permission):
    """Test endpoints that require specific permissions."""
    if expected_permission not in set([p.strip() for p in os.getenv("BYBIT_PERMISSIONS", "").split(",") if p.strip()]):
        pytest.skip(f"Permission {expected_permission} not in BYBIT_PERMISSIONS")
    
    if method == "get":
        response = client.get(endpoint)
    else:
        response = client.post(endpoint, json={})
    
    assert response.status_code != 403, f"Permission denied for {endpoint}"
    if response.status_code == 200:
        assert "result" in response.json(), f"Unexpected response format for {endpoint}"

@pytest.mark.skipif(not BYBIT_API_KEY or not BYBIT_API_SECRET, reason="API Key/Secret not set")
@pytest.mark.parametrize("order_endpoint,symbol,side,qty,order_type,permission", [
    ("/contract/order", "BTCUSDT", "Buy", 0.01, "Market", "order"),
    ("/spot/order", "BTCUSDT", "Buy", 0.001, "Market", "spot"),
    ("/usdc/order", "BTCUSD", "Buy", 0.01, "Market", "usdc"),
])
def test_order_placement(order_endpoint, symbol, side, qty, order_type, permission):
    """Test order placement endpoints with minimal quantities for safety."""
    if permission not in set([p.strip() for p in os.getenv("BYBIT_PERMISSIONS", "").split(",") if p.strip()]):
        pytest.skip(f"Permission {permission} not in BYBIT_PERMISSIONS")
    
    if BYBIT_TESTNET:
        response = client.post(order_endpoint, json={
            "symbol": symbol,
            "side": side,
            "qty": qty,
            "order_type": order_type
        })
        assert response.status_code != 403, f"Permission denied for {order_endpoint}"
        if response.status_code == 200:
            assert "result" in response.json(), f"Unexpected response format for {order_endpoint}"
    else:
        pytest.skip("Order placement tests skipped on mainnet for safety")

if __name__ == "__main__":
    pytest.main(["-v", __file__]) 