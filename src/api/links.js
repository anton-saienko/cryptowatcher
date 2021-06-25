const API_KEY = 'd5243c463b03dd42cc942e2b210a9d8eca1f11c1a8a5680352a32265cc4e4d25';
const WEB_SOCKET = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const VALID_COINS = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true';
const BTC_TO_USD = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=${API_KEY}`

export default {
  WEB_SOCKET,
  VALID_COINS,
  BTC_TO_USD
}