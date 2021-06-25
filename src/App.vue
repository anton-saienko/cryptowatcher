<template>
  <h1>Cryptowatcher</h1>
  <div class="main-info" v-if="!isLoading && errorMessage === ''">
    <div class="about">
      <div class="title">About this app:</div>
      I made this app with a goal to practice and improve my skills in VUE.js and then add it to my portfolio.
      I called it "Cryptowatcher". It allows you to watch for changes in the price of cryptocurrencies in real-time. 
      Just pick a coin and you will see price dynamics of this coin on the live chart.
      The live prices (provided by Cryptocompare.com) are being received via WebSockets. The UI visualisation of prices is made with the help of ApexCharts.
    </div>
    <div class="divider"></div>
    <div class="about">
      <div class="title">Key features:</div>
      - All your favorite coins are stored in LocalStorage, so there is no need to pick them again next time.<br>
      - You can easily filter your coins using the "filter" field<br>
      - All your coins are updating in real time. That means that all coins that are not selected are still updating behind the scenes. By selecting them, you will see all the changes on the chart.<br>
      - All prices stored in VUEX store.<br>
      - The source code can be viewed <a href="https://github.com/code-mode/cryptowatcher" class="link" target="_blank">HERE(github)</a>
    </div>
    <div class="divider"></div>
  </div>
  <div v-if="isLoading">
    <div class="title centered mainload">Loading...</div>
  </div>
  <div v-if="!isLoading && errorMessage === ''">
    <the-tickers @show-graph="showGraph" @check-class="checkClass"></the-tickers>
    <div v-if="isShowing" class="chart"> 
      <the-chart v-show="coinClass != 'darkClass'"></the-chart>
    </div>
  </div>
  <div v-if="errorMessage" class="error centered mainerror">
    Oops, something went wrong...
    <div class="divider"></div>
    The reason is: <br>
    <div class="white">{{errorMessage}}</div>
  </div>
  <div class="about">
    <div class="divider"></div>
    <span class="title">Powered by:</span>
    <div class="powered">
      <img src="img/vue.jpg" alt="vue">
      <img src="img/apexcharts.jpg" alt="apexcharts">
      <img src="img/websockets.jpg" alt="websockets">
    </div>
  </div>
</template>

<script>
import theChart from './components/TheChart.vue';
import theTickers from './components/TheTickers.vue';
import './css/style.css';

export default { 
  name: "Cryptowatcher",
  components: {
    theChart, 
    theTickers
  },
  data() {
    return {
      showing: false,
      coinClass: ''
    };
  },
  methods: {
    showGraph(result){
      this.showing = result;
    },
    checkClass(getClass){
      this.coinClass = getClass;
    },
  },
  computed: {
    isLoading(){
      return this.$store.getters['isLoading'];
    },
    errorMessage(){
      return this.$store.getters['errorMessage'];
    },
    isShowing(){
      return this.showing;
    }
  },
  created(){
    this.$store.dispatch('getValidCoinsListAct');
  }
};
</script>

 