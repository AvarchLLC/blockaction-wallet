import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { environment } from '../../environments/environment';

declare var EthJS : any;

class CoinMarketData {
  'id': string;
  'name': string;
  'symbol': string;
  'rank': string;
  'price_usd': string;
  'price_btc': string;
  '24h_volume_usd': string;
  'market_cap_usd': string;
  'available_supply': string;
  'total_supply': string;
  'percent_change_1h': string;
  'percent_change_24h': string;
  'percent_change_7d': string;
  'last_updated': string;
}
@Injectable()
export class DataService {

  constructor(private http: Http) { }

  /**
   * Get the market data of coins
   * @param coins string of comma seperated coins (eg 'bitcoin,ethereum')
   */
  getCoinData(coins: string) {
    const coinsArr = coins.split(',');
    return Promise.all(coinsArr.map(this.fetchData));
  }

  private fetchData = ticker => this.http.get(`${environment.COIN_API_URL}/${ticker}/`)
    .map(res => res.json()[0] as CoinMarketData)
    .toPromise()

  /**
   * Request Ether by email
   * @param address address to receive
   * @param email email to request
   * @param value request amount in ether
   */
  requestEther(address: string, email: string, ether: number): Promise<any> {
    address = EthJS.Util.addHexPrefix(address);

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded')

    const content = {
        address,
        ether
    };
    const data = `receiver=${email}&content=${JSON.stringify(content)}`;

    return this.http
      .post(`${environment.API_URL}/request/ether`, data, { headers })
      .toPromise()
      .then(res => res.json());
  }

  /**
   * Subscribe to newsletter
   * @param email email to request
   */
  subscribeNews(email: string): Promise<any> {

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded')

    const data = `receiver=${email}`;

    return this.http
      .post(`${environment.API_URL}/subscribe`, data, { headers })
      .toPromise()
      .then(res => res.json());
  }
}
