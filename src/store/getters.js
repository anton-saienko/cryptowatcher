export default {
  graphGetter(state) {
    return state.graph;
  },
  getUpdatedCoin(state) {
    return state.updatedCoin;
  },
  getActiveCoin(state) {
    return state.activeCoin;
  },
  getValidCoinsList(state) {
    return state.validCoinsList;
  },
  getTickers(state) {
    return state.tickers;
  },
  isLoading(state) {
    return state.isLoading;
  },
  errorMessage(state) {
    return state.errorMessage;
  }
};