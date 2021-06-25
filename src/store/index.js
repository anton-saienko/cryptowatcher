import { createStore } from 'vuex';

import rootMutations from './mutations.js';
import rootActions from './actions.js';
import rootGetters from './getters.js';

const store = createStore({
  state() {
    return {
      updatedCoin: '',
      activeCoin: '',
      graph: {
        initialCoin: [],
      },
      isLoading: true,
      socketError: 'The free version of Cryptocompare.com websockets allows only one connection at a time... Please make sure that you are the only user watching this application at the moment.',
      errorMessage: '',
      validCoinsList: [],
      tickers: []
    };
  },
  mutations: rootMutations,
  actions: rootActions,
  getters: rootGetters
});

export default store;