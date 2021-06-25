export default {
  addNewTickerMut(state, payload) {
    state.tickers.push(payload)
  },

  setSelectedCoinMut(state, payload) {
    state.activeCoin = payload;
  },

  setValidCoinsMut(state, payload) {
    state.isLoading = false;
    let alphabeticalSort = Object.fromEntries(Object.entries(payload).sort());
    state.validCoinsList = alphabeticalSort;
  },
  
  validCoinsErrorMut(state, payload) {
    state.isLoading = false;
    state.errorMessage = payload;
  },

  setTickersFromStorageMut(state, payload) {
    const parsedTickers = JSON.parse(payload);
    state.tickers = parsedTickers;
  },

  addToGraphMut(state, payload) {
    const price = payload.price;
    const time = payload.time;
    const coin = payload.coin;
    const coinValues = [time, price]
    state.updatedCoin = coin;
    state.graph[coin].push(coinValues);
  },

  addNewCoinToArrayMut(state, payload) {
    const coinName = payload;
    const newCoinInArray = { [coinName]: [] }
    const currentGraph = state.graph;
    const updatedGraph = {...currentGraph, ...newCoinInArray};
    state.graph = updatedGraph;
  },

  addClassMut(state, payload) {
    const currentTickers = state.tickers;
    currentTickers.forEach((element, index) => {
      if(element.name.toUpperCase() === payload.tickerName) {
        currentTickers[index].cssClass = payload.cssClass;
      }
    });
    state.tickers = currentTickers;
  },

  updatePriceMut(state, payload) {
    const currentTickers = state.tickers;
    const coin = payload.tickerName;
    const fullLength = state.graph[coin].length;
    let oldPrice;
    if (state.graph[coin].length > 1){
      oldPrice = state.graph[coin][fullLength - 1][1];
    }
    currentTickers.forEach((element, index) => {
      if(element.name === payload.tickerName) {
        currentTickers[index].price = payload.price;
        currentTickers[index].oldPrice = oldPrice;
      }
    });
    state.tickers = currentTickers;
  },

  unSubscribeToTickerMut(state, payload) {
    const tickerToRemove = payload;
    const filteredTickers = state.tickers.filter(t => t !== tickerToRemove);
    state.tickers = filteredTickers;
  },

};
