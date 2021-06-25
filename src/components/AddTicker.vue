<template>
  <section>
    <div>
      <div>
        <label for="currency" class="choose">Choose your coin: </label> 
        <div class="choose-desc">
          <br>
           Pick from the most popular cryptocurrencies:
        </div>
        <div class="popular">
          <span @click="addFromClick('BTC', '/media/37746251/btc.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746251/btc.png" alt=""> BTC (Bitcoin)</span>
          <span @click="addFromClick('ETH', '/media/37746238/eth.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746238/eth.png" alt=""> ETH (Ethereum)</span>
          <span @click="addFromClick('BNB', '/media/37746880/bnb.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746880/bnb.png" alt=""> BNB (Binance)</span>
          <span @click="addFromClick('DOGE', '/media/37746339/doge.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746339/doge.png" alt=""> DOGE (Dogecoin)</span>
          <span @click="addFromClick('DOT', '/media/37746348/dot.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746348/dot.png" alt=""> DOT (Polkadot)</span>
          <span @click="addFromClick('UNI', '/media/37746885/uni.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746885/uni.png" alt=""> UNI (Uniswap)</span>
          <span @click="addFromClick('LTC', '/media/37746243/ltc.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746243/ltc.png" alt=""> LTC (Litecoin)</span>
          <span @click="addFromClick('SOL', '/media/37747734/sol.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37747734/sol.png" alt=""> SOL (Solana)</span>
          <span @click="addFromClick('LINK', '/media/37746242/link.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746242/link.png" alt=""> LINK (Chainlink)</span>
          <span @click="addFromClick('ADA', '/media/37746235/ada.png')" class="popular__coin"><img src="https://www.cryptocompare.com/media/37746235/ada.png" alt=""> ADA (Cardano)</span>
        </div>
        <div class="choose-desc">or you can choose among 6000+ available coins by typing coin symbol: <br>
          <div class="small">(Please keep in mind that not all of them are available via <b>free</b> version of Cryptocompare.com websocket)</div>
        </div>
        <div class="ac-wrapper">
         <div class="currency-wrapper">
            <input v-model="ticker" @input="checkError" @keydown.enter="add" autocomplete="off" type="text" name="currency" id="currency" placeholder="For example: BTC"/>
            <button @click="add" type="button" class="add">
              Add coin
            </button>
          </div>
          <div class="error">{{ this.errorMessage }}</div>
          <div v-if="ticker !== ''" class="ac">
            <div class="ac__ticker" @click="addFromClick(validName.Symbol, validName.ImageUrl)" v-for="(validName, index) in filteredNames" :key="index">
              {{ validName.Symbol }}   
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  data() {
    return {
      ticker: "",
      tickerImage: "",
      errorMessage: '',
      errorMessages: [
        'You already have such currency!',
        'Please check the currency name!',
        'Unknown currency!'
      ]
    }
  },
  methods: {
    add() {
      if (this.$store.getters['getTickers'].find(t => t.name.toLowerCase() === this.ticker.toLowerCase())) {
        this.errorMessage = this.errorMessages[0];
        return false;
      } else if (Object.values(this.$store.getters['getValidCoinsList']).find(coin => coin.Symbol === this.ticker)){
        let addedCoin = Object.values(this.$store.getters['getValidCoinsList']).find(coin => coin.Symbol === this.ticker)
        this.tickerImage = addedCoin.ImageUrl;
        this.$emit("add-ticker", this.ticker, this.tickerImage);
        this.ticker = "";
        this.errorMessage = '';
      } else if (this.filteredNames.length > 0) {
        this.errorMessage = this.errorMessages[1];
        return;
      } else {
        this.errorMessage = this.errorMessages[2];
        return;
      }
    },
    addFromClick(getName, getImage){
      this.ticker = getName;
      this.tickerImage = getImage;
      this.add();
    },
    checkError(){
      this.ticker = this.ticker.toUpperCase();
      this.errorMessage = (this.filteredNames.length < 1) ? this.errorMessages[2] : '';
    },
  },
  computed: {
    filteredNames() { 
      return Object.values(this.$store.getters['getValidCoinsList']).filter(name => name.Symbol.toLowerCase().includes(this.ticker.toLowerCase())); 
    },
  }
};
</script>

