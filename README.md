# Cryptowatcher

## DEMO:
```
https://cryptowatcher-77154.web.app/
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### About this app:
```
I made this app with a goal to practice and improve my skills in VUE.js and then add it to my portfolio. 
I called it "Cryptowatcher". It allows you to watch for changes in the price of cryptocurrencies in real-time. 
Just pick a coin and you will see price dynamics of this coin on the live chart. 
The live prices (provided by Cryptocompare.com) are being received via WebSockets. 
The UI visualisation of prices is made with the help of ApexCharts.
```

### Key features:
```
- All your favorite coins are stored in LocalStorage, so there is no need to pick them again next time;
- You can easily filter your coins using the "filter" field;
- All your coins are updating in real time. That means that all coins that are not selected are still updating behind the scenes. By selecting them, you will see all the changes on the chart;
- All prices stored in VUEX store.
```
