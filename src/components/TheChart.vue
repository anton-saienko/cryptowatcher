<template>
  <apexchart
    width="100%"
    height="350"
    type="area"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
export default {
  data: function() {
    return {
      coin: 'initialCoin',
      chartOptions: {
        stroke: {
          curve: 'straight',
        },
        chart: {
          foreColor: '#CCCCCC',
          background: '#2B2D3E',
          id: "vue-apexchart",
          toolbar:{
            show: false
          },
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 5,
            color: '#000',
            opacity: 0.1
          }
        },
        colors: ['#2E93fA'],
        grid: {
          borderColor: "#535A6C",
          padding: {
            top: 30,
            right: 5,
            bottom: 5,
            left: 30
          }, 
        },
        dataLabels: {
          enabled: false,
        },
        yaxis:{
          tickAmount: 3,
          opposite: true
        },
        xaxis: {
          type: 'categories',
          tickAmount: 4,
          labels: {
            formatter: function (value) {
              var time = value;
              var date = new Date(time);
              return date.toLocaleTimeString('en-US');
            } 
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            formatter: function(value) {
              var time = value;
              var date = new Date(time);
              return date.toLocaleString('en-US');
            }
          }
        },
      },
      series: [{
        name: "USD",
        data: [],
      }]
    };
  },
  computed: {
    changeOfCoinInArray(){
      return this.$store.getters['getUpdatedCoin']
    },
    changeActiveCoin(){
      return this.$store.getters['getActiveCoin']
    },
    changeDataInGraph(){
      return this.$store.getters['graphGetter'][this.$store.getters['getActiveCoin']].length
    }
  },
  watch: {
    changeOfCoinInArray(){
      if (this.checkForActualCoin()) {
        this.updateGraph(); 
      } 
    },
    changeActiveCoin(){
      this.updateGraph(); // change immediately when switching tabs
      this.changeColor(); 
      this.changeTooltips(); 
    },
    changeDataInGraph(){
      if (this.checkForActualCoin()) {
        this.updateGraph(); 
      } 
    }
  },
  methods: {
    checkForActualCoin(){
      if (this.$store.getters['getUpdatedCoin'] === this.$store.getters['getActiveCoin']) {
        return true
      } else {
        return false
      }
    },
    updateGraph(){
      this.series = [{
        data: this.$store.getters['graphGetter'][this.$store.getters['getActiveCoin']]
      }];
    },
    changeColor(){
      let colorsList = ['#2E93fA', '#06C889', '#DF9C1F'];
      const getCurrentColor = this.chartOptions.colors[0];
      colorsList = colorsList.filter(item => item !== getCurrentColor);
      const pickColor = colorsList[Math.floor(Math.random()*colorsList.length)];
      this.chartOptions = {
        colors: [pickColor]
      };
    },
    changeTooltips(){
    let getCurrentPrice = Object.values(this.$store.getters['graphGetter'][this.$store.getters['getActiveCoin']])[0];
    if( getCurrentPrice != undefined){
      let getPriceAfterDot = getCurrentPrice[1].toString().split('.').pop();
      if (getPriceAfterDot.length > 2){
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            yaxis:{
              opposite: true,
              tickAmount: 3,
              decimalsInFloat: getPriceAfterDot.length
            }
          }
        }
      } else {
          this.chartOptions = {
            ...this.chartOptions,
            ...{
              yaxis:{
                opposite: true,
                tickAmount: 3,
                decimalsInFloat:2
              }
            }
          }
        }
      }
    }
  }
};
</script>
 
