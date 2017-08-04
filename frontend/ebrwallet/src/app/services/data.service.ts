import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const COIN_API_URL = 'https://api.coinmarketcap.com/v1/ticker';

class CoinMarketData {
  'id': string;
  'name': string;
  'symbol': string;
  'rank': string;
  'price_usd': string;
  'price_btc': string;
  "24h_volume_usd": string;
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

  getCoinData(coins: string) {
    const coinsArr = coins.split(',');    
    return Promise.all(coinsArr.map(this.fetchData))
  }

  fetchData = ticker => this.http.get(`https://api.coinmarketcap.com/v1/ticker/${ticker}/`)
    .map(res => res.json()[0] as CoinMarketData)
    .toPromise();
}
