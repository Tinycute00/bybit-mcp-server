import { RestClientV5 } from 'bybit-api';

export class AccountService {
  private client: RestClientV5;

  constructor(apiKey: string, apiSecret: string, testnet: boolean) {
    this.client = new RestClientV5({
      key: apiKey,
      secret: apiSecret,
      testnet: testnet
    });
  }

  async getWalletBalance(params: any) {
    return await this.client.getWalletBalance(params);
  }

  async getPositions(params: any) {
    return await this.client.getPositionInfo(params);
  }

  async setLeverage(params: any) {
    return await this.client.setLeverage(params);
  }
}
