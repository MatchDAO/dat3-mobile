/*
 * @Descripttion: 
 * @version: 
 * @Author: senlin
 * @Date: 2023-04-04 15:04:42
 * @LastEditors: senlin
 * @LastEditTime: 2023-04-10 16:27:33
 */
import App from './App'
import messages from './locale/index'
import store from './store'
import { registerSimpleUni } from "@/utils/simpleUni";
import utilWithVue from "@/utils/utilWithVue";
// fllow system language, default en
const locale =  ['en','en_US','zh','zh_CN','zh-Hans',].includes(uni.getLocale())? uni.getLocale():'en'
console.log("🚀 ~ file: main.js:16 ~ locale:", locale)
console.log("🚀 ~ file: main.js:16 ~ uni.getLocale():", uni.getLocale())
let i18nConfig = {
	locale,
	messages
}

import { filters } from '@/config/filters.js'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// #ifndef VUE3

import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
Vue.prototype.$store = store
registerSimpleUni(Vue);
utilWithVue(Vue);

App.mpType = 'app'
const app = new Vue({
	i18n,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import {
	createI18n
} from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {
		app
	}
}
// #endif
