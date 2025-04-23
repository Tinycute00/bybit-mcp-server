import { RestClientV5 } from 'bybit-api';

export class MarketService {
  private client: RestClientV5;

  constructor(apiKey: string, apiSecret: string, testnet: boolean) {
    this.client = new RestClientV5({
      key: apiKey,
      secret: apiSecret,
      testnet: testnet
    });
  }

  async getTickers(params: any) {
    return await this.client.getTickers(params);
  }

  async getOrderbook(params: any) {
    return await this.client.getOrderbook(params);
  }

  async getKline(params: any) {
    return await this.client.getKline(params);
  }
}
