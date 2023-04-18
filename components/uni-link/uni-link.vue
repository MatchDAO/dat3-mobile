<template>
	<a v-if="isShowA" class="uni-link" :href="href" :class="{'uni-link--withline':showUnderLine===true||showUnderLine==='true'}" :style="{color,fontSize:fontSize+'px'}">{{text}}</a>
	<text v-else class="uni-link" :class="{'uni-link--withline':showUnderLine===true||showUnderLine==='true'}" :style="{color,fontSize:fontSize+'px'}" @click="openURL">{{text}}</text>
</template>

<script>
	/**
	 * Link 
	 * @description uni-linkurlapph5
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=1182
	 * @property {String} href url
	 * @property {String} text 
	 * @property {Boolean} showUnderLine 
	 * @property {String} copyTips 
	 * @property {String} color 
	 * @property {String} fontSize 
	 * @example * <uni-link href="https://ext.dcloud.net.cn" text="https://ext.dcloud.net.cn"></uni-link>
	 */
	export default {
		name: 'uniLink',
		props: {
			href: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			showUnderLine: {
				type: [Boolean, String],
				default: true
			},
			copyTips: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#999999'
			},
			fontSize: {
				type: [Number, String],
				default: 14
			}
		},
		computed: {
			isShowA() {
				// #ifdef H5
				this._isH5 = true;
				// #endif
				if ((this.isMail() || this.isTel()) && this._isH5 === true) {
					return true;
				}
				return false;
			}
		},
		created() {
			this._isH5 = null;
		},
		methods: {
			isMail() {
				return this.href.startsWith('mailto:');
			},
			isTel() {
				return this.href.startsWith('tel:');
			},
			openURL() {
				// #ifdef APP-PLUS
				if (this.isTel()) {
					this.makePhoneCall(this.href.replace('tel:', ''));
				} else {
					plus.runtime.openURL(this.href);
				}
				// #endif
				// #ifdef H5
				window.open(this.href)
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: this.href
				});
				uni.showModal({
					content: this.copyTips,
					showCancel: false
				});
				// #endif
			},
			makePhoneCall(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	.uni-link {
		cursor: pointer;
	}

	/* #endif */
	.uni-link--withline {
		text-decoration: underline;
	}
</style>