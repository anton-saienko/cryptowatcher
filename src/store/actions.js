import apiLinks from '@/api/links.js';

export default {
  addNewTickerAct(context, payload) {
    context.commit('addNewTickerMut', payload);
  },

  setSelectedCoinAct(context, payload) {
    context.commit('setSelectedCoinMut', payload.selectedCoin);
  },

  setTickersFromStorageAct(context, payload) {
    context.commit('setTickersFromStorageMut', payload);
  },

  addToGraphAct(context, payload) {
    context.commit('addToGraphMut', payload);
  },

  addNewCoinToArrayAct(context, payload) {
    context.commit('addNewCoinToArrayMut', payload.coinName);
  },

  addClassAct(context, payload) {
    context.commit('addClassMut', payload);
  },

  getValidCoinsListAct(context) {
    fetch(apiLinks.VALID_COINS).then((response) => {
      if (response.ok) {
        return response.json();
      } 
    }).then((data) => {
      let validCoins = data.Data;
      context.commit('setValidCoinsMut', validCoins);
    }).catch((error) => {
      console.log(error);
      context.commit('validCoinsErrorMut', error);
    });
  },

  sendToWebSocketAct(_, payload) {
    const stringifiedMessage = JSON.stringify(payload);
    if (apiLinks.WEB_SOCKET.readyState === WebSocket.OPEN) {
      apiLinks.WEB_SOCKET.send(stringifiedMessage);
      return;
    }
    apiLinks.WEB_SOCKET.addEventListener( "open", () => {
        apiLinks.WEB_SOCKET.send(stringifiedMessage); 
      }, { once: true }
    );
  },

  subscribeToTickerAct(context, payload) {
    context.dispatch('addNewCoinToArrayAct', { coinName: payload.ticker });
    let toSymbol;
    toSymbol = (payload.cssClass === 'redClass') ? 'BTC' : 'USD';
    context.dispatch('sendToWebSocketAct', {
      action: "SubAdd",
      subs: [`5~CCCAGG~${(payload.ticker).toUpperCase()}~${toSymbol}`]
    });
  },

  unSubscribeToTickerAct(context, payload) {
    let toSymbol;
    toSymbol = (payload.ticker.cssClass === 'redClass') ? 'BTC' : 'USD';
    context.dispatch('sendToWebSocketAct', {
      action: "SubRemove",
      subs: [`5~CCCAGG~${payload.ticker.name}~${toSymbol}`]
    });
    context.commit('unSubscribeToTickerMut', payload.ticker);
  },

  updateTickerAct(context, payload) {
    context.commit('updatePriceMut', payload);
    if (context.rootGetters.getActiveCoin != '') {
      const currentTime = new Date().getTime();
      context.dispatch('addToGraphAct', {
        price: payload.price,
        time: currentTime,
        coin: payload.tickerName
      });
    }
  },

  watchForSocketResponse(context){
    apiLinks.WEB_SOCKET.addEventListener("message", e => {
      const { TYPE: type, FROMSYMBOL: wsCurrency, PRICE: wsNewPrice, PARAMETER: par, INFO: info, TOSYMBOL: toSymbol } = JSON.parse(
        e.data
      );
      if (type === '429'){
        context.commit('validCoinsErrorMut', context.state.socketError);
      } else if (info != undefined && info.includes("We have not")){
        const getBTCpar = [...par.matchAll(new RegExp('BTC', 'gi'))].map(a => a.index);
        const ending = par.length - 3;
        const indexes = [...par.matchAll(new RegExp('~', 'gi'))].map(a => a.index);
        const secondPart = indexes[2] - indexes[1];
        const getCoin = par.substr(indexes[1]+1, secondPart-1);
        if (getBTCpar[0] === ending || getBTCpar[1] === ending){
          context.dispatch('addClassAct', { tickerName: getCoin, cssClass: 'darkClass' });
        } else {
          context.dispatch('addClassAct', { tickerName: getCoin, cssClass: 'redClass' });
          context.dispatch('subscribeToTickerAct', { ticker: getCoin, cssClass: 'redClass' });
        }
      } else if (type !== '5'|| wsNewPrice === undefined) {
        return;
      } else {
        if( toSymbol === 'BTC' ){
          fetch(apiLinks.BTC_TO_USD).then((response) => {
            if (response.ok) {
              return response.json();
            } 
          }).then((data) => {
            let convertedPrice = data.USD * wsNewPrice;
            let getPriceAfterDot = convertedPrice.toString().split('.').pop();
            if (getPriceAfterDot.length > 4){
              convertedPrice = convertedPrice.toFixed(4);
            } else {
              convertedPrice - wsNewPrice
            }
            context.dispatch('updateTickerAct', { tickerName: wsCurrency, price: convertedPrice});
          });
        } else {
          context.dispatch('updateTickerAct', { tickerName: wsCurrency, price: wsNewPrice});
        }
      }
    });
  }
};
