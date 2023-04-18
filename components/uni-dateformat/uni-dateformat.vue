<template>
	<text>{{dateShow}}</text>
</template>

<script>
	/**
	 * Dateformat 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=3279
	 * @property {Object|String|Number} date //
	 * @property {String} locale 
	 * 	@value zh 
	 * 	@value en 
	 * @property {Array} threshold 
	 * @property {String} format 
	 */
	import {
		friendlyDate
	} from './date-format.js'
	export default {
		name: 'uniDateformat',
		props: {
			date: {
				type: [Object, String, Number],
				default () {
					return Date.now()
				}
			},
			locale: {
				type: String,
				default: 'zh',
			},
			threshold: {
				type: Array,
				default () {
					return [0, 0]
				}
			},
			format: {
				type: String,
				default: 'yyyy/MM/dd hh:mm:ss'
			},
			// refreshRate
			refreshRate: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				refreshMark: 0
			}
		},
		computed: {
			dateShow() {
				this.refreshMark
				return friendlyDate(this.date, {
					locale: this.locale,
					threshold: this.threshold,
					format: this.format
				})
			}
		},
		watch: {
			refreshRate: {
				handler() {
					this.setAutoRefresh()
				},
				immediate: true
			}
		},
		methods: {
			refresh() {
				this.refreshMark++
			},
			setAutoRefresh() {
				clearInterval(this.refreshInterval)
				if (this.refreshRate) {
					this.refreshInterval = setInterval(() => {
						this.refresh()
					}, parseInt(this.refreshRate))
				}
			}
		}
	}
</script>

<style scoped></style>