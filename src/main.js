import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import App from './App.vue';

import store from './store/index.js';

const app = createApp(App)
app.use(VueApexCharts);
app.use(store);

app.mount('#app');