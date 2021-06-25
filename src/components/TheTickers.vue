<template>
  <add-ticker @add-ticker="add"></add-ticker>
  <div>
    <div class="divider"></div>
    <div>
      <label for="filtration" class="filtration">Filter: </label> <input v-model.trim="filter" id="filtration"/>
    </div>
    <div class="tickers" v-if="filteredTickers.length">
      <div class="ticker" v-for="t in filteredTickers" :key="t.id" @click="select(t)" :class="{'selected': selectedTicker === t, 'red': t.cssClass === 'redClass', 'dark': t.cssClass === 'darkClass' }">
        <div class="ticker__name">
          <div class="ticker__image">
            <img :src="'https://www.cryptocompare.com' + t.image" alt="">
          </div>
          {{ t.name }}
          </div>
        <div class="ticker__price">
          <div class="dollar">$</div><div v-html="animatePrice(t.price, t.oldPrice)"></div>
        </div>
        <div class="ticker__delete" @click.stop="handleDelete(t, t.id)" >Delete</div>
      </div>
    </div>
    <div class="no-matches" v-else-if="filteredTickers.length === 0 && filter.length > 0">No matches found</div>
  </div>
  <div ref="scrollPos"></div>
  <section v-if="selectedTicker">
    <div class="main-price">
      <img :src="'https://www.cryptocompare.com' + selectedTicker.image" alt="">{{ selectedTicker.name }}:&nbsp;<div v-html="animatePrice(selectedTicker.price, selectedTicker.oldPrice)"></div>
    </div>
  </section>
  <div class="not-available" v-if="checkIfAvailable" ref="notAvailable">
      Sorry, but websocket is not available for this currency...<br>
      Please, select more popular coin :)
  </div>
</template>

<script>
import AddTicker from './AddTicker.vue';

export default {
  components: { AddTicker },
  emits: ['show-graph', 'check-class'],
  data() {
    return {
      filter: "",
      selectedTicker: null,
    };
  },
  computed: {
    filteredTickers() { 
      return this.$store.getters['getTickers'].filter(ticker => ticker.name.toLowerCase().includes(this.filter.toLowerCase())); 
    },
    checkIfAvailable(){
      if (this.selectedTicker !== null){
        if (this.selectedTicker.cssClass === 'darkClass'){
          this.$emit('check-class', this.selectedTicker.cssClass);
          return true
        }
      }
      return false
    }
  },
  watch: {
    filteredTickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.$store.getters['getTickers']));
    },
  },
  methods: {
    animatePrice(newPrice, oldPrice){
      if(newPrice > oldPrice){
        return `<div class="rise">${newPrice}</div>`
      } else if (newPrice < oldPrice) {
        return `<div class="fall">${newPrice}</div>`
      } else {
        return newPrice
      }
    },
    handleDelete(tickerToRemove) {
      this.$store.dispatch('unSubscribeToTickerAct', { ticker: tickerToRemove});
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
        if (this.$store.getters['getTickers'].length > 0){ 
          this.select(this.$store.getters['getTickers'][0], true); 
        } else {
          this.$emit('show-graph', false);
        }
      } 
    },
    add(ticker, image) {
      const currentTicker = {
        name: ticker,
        price: "-",
        image: image,
        cssClass: "",
        oldPrice: 0
      };
      this.filter = "";
      this.$store.dispatch('addNewTickerAct', currentTicker);
      this.$store.dispatch('subscribeToTickerAct', { ticker: currentTicker.name });
      this.$store.dispatch('addNewCoinToArrayAct', {coinName: currentTicker.name});
      this.select(currentTicker);
    },
    select(ticker, afterDeleting) {
      this.selectedTicker = ticker;
      this.$emit('show-graph', true);
      let scrollPos = this.$refs.scrollPos;
      if (scrollPos && !afterDeleting){
        window.scrollTo({
          top: scrollPos.offsetTop,
          behavior: "smooth"
        });
      }
      this.$emit('check-class', this.selectedTicker.cssClass);
      this.$store.dispatch('setSelectedCoinAct', {selectedCoin: ticker.name});
    },
  },
  created() {
    const tickersData = localStorage.getItem("cryptonomicon-list");
    if (tickersData) {
      this.$store.dispatch('setTickersFromStorageAct', tickersData);
      this.$store.getters['getTickers'].forEach(ticker => {
        this.$store.dispatch('subscribeToTickerAct', { ticker: ticker.name });
        this.$store.dispatch('updateTickerAct', { tickerName: ticker.name, price: ticker.price});
      });
    }
    this.$store.dispatch('watchForSocketResponse');
    if (this.$store.getters['getTickers'].length > 0){ 
      this.select(this.$store.getters['getTickers'][0]); 
    }
  }
};
</script>