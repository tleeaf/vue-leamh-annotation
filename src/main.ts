import './assets/main.css'
import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App)
app.use(PrimeVue,{
    theme:{
        preset: Aura,
        options:{
            primaryColor: '#007bff',
            secondaryColor: '#007bff',
            successColor: '#007bff',
            infoColor: '#007bff',
            warningColor: '#007bff',
            dangerColor: '#007bff',
            darkColor: '#007bff',
            contrastColor: '#007bff',
            textColor: '#007bff',
            highlightColor: '#007bff',
            selectionColor: '#007bff',
            inputTextColor: '#007bff',
            inputTextBackgroundColor: '#007bff',
        }
    }
})

app.mount('#app')
