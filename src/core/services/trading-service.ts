import { RestClientV5 } from 'bybit-api';

export class TradingService {
  private client: RestClientV5;

  constructor(apiKey: string, apiSecret: string, testnet: boolean) {
    this.client = new RestClientV5({
      key: apiKey,
      secret: apiSecret,
      testnet: testnet
    });
  }

  async placeOrder(params: any) {
    return await this.client.submitOrder(params);
  }

  async cancelOrder(params: any) {
    return await this.client.cancelOrder(params);
  }

  async getOrders(params: any) {
    return await this.client.getActiveOrders(params);
  }
}
