<template>
	<view class="uni-searchbar">
		<view :style="{borderRadius:radius+'px',backgroundColor: bgColor}" class="uni-searchbar__box" @click="searchClick">
			<view class="uni-searchbar__box-icon-search">
				<slot name="searchIcon">
					<uni-icons color="#999999" size="18" type="search" />
				</slot>
			</view>
			<input v-if="show || searchVal" :focus="showSync" :placeholder="placeholder" :maxlength="maxlength" class="uni-searchbar__box-search-input" confirm-type="search" type="text" v-model="searchVal" @confirm="confirm" @blur="blur" @focus="emitFocus" />
			<text v-else class="uni-searchbar__text-placeholder">{{ placeholder }}</text>
			<view v-if="show && (clearButton==='always'||clearButton==='auto'&&searchVal!=='')" class="uni-searchbar__box-icon-clear" @click="clear">
				<slot name="clearIcon">
					<uni-icons color="#c0c4cc" size="15" type="clear" />
				</slot>
			</view>
		</view>
		<text @click="cancel" class="uni-searchbar__cancel" v-if="cancelButton ==='always' || show && cancelButton ==='auto'">{{cancelText}}</text>
	</view>
</template>

<script>
	/**
	 * SearchBar 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=866
	 * @property {Number} radius 
	 * @property {Number} maxlength 
	 * @property {String} placeholder Placeholder
	 * @property {String} clearButton = [always|auto|none] 
	 * 	@value always 
	 * 	@value auto 
	 * 	@value none 
	 * @property {String} cancelButton = [always|auto|none] 
	 * 	@value always 
	 * 	@value auto 
	 * 	@value none 
	 * @property {String} cancelText 
	 * @property {String} bgColor 
	 * @property {Boolean} focus 
	 * @event {Function} confirm uniSearchBar  confirm uniSearchBarvaluee={value:Number}
	 * @event {Function} input uniSearchBar  value uniSearchBarvaluee=value
	 * @event {Function} cancel uniSearchBarvaluee={value:Number}
	 * @event {Function} clear uniSearchBarvaluee={value:Number}
	 * @event {Function} blur inputuniSearchBarvaluee={value:Number}
	 */

	export default {
		name: "UniSearchBar",
		props: {
			placeholder: {
				type: String,
				default: ""
			},
			radius: {
				type: [Number, String],
				default: 5
			},
			clearButton: {
				type: String,
				default: "auto"
			},
			cancelButton: {
				type: String,
				default: "auto"
			},
			cancelText: {
				type: String,
				default: ''
			},
			bgColor: {
				type: String,
				default: "#F8F8F8"
			},
			maxlength: {
				type: [Number, String],
				default: 100
			},
			value: {
				type: [Number, String],
				default: ""
			},
			focus: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				show: false,
				showSync: false,
				searchVal: ''
			}
		},
		watch: {
			value: {
				immediate: true,
				handler(newVal) {
					this.searchVal = newVal
					if (newVal) {
						this.show = true
					}
				}
			},
			focus: {
				immediate: true,
				handler(newVal) {
					if (newVal) {
						this.show = true;
						this.$nextTick(() => {
							this.showSync = true
						})
					}
				}
			},
			searchVal(newVal, oldVal) {
				this.$emit("input", newVal)
			}
		},
		methods: {
			searchClick() {
				if (this.show) {
					return
				}
				this.show = true;
				this.$nextTick(() => {
					this.showSync = true
				})
			},
			clear() {
				this.$emit("clear", {
					value: this.searchVal
				})
				this.searchVal = ""
			},
			cancel() {
				this.$emit("cancel", {
					value: this.searchVal
				});
				this.searchVal = ""
				this.show = false
				this.showSync = false
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("confirm", {
					value: this.searchVal
				})
			},
			blur() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("blur", {
					value: this.searchVal
				})
			},
			emitFocus(e) {
				this.$emit("focus", e.detail)
			}
		}
	};
</script>

<style scoped>
	.uni-searchbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
		padding: 8px;
	}

	.uni-searchbar__box {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		position: relative;
		flex: 1;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		height: 36px;
		padding: 5px 8px 5px 0px;
		border-width: 0.5px;
		border-style: solid;
		border-color: #e5e5e5;
	}

	.uni-searchbar__box-icon-search {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 0 8px;
		justify-content: center;
		align-items: center;
		color: #808080;
	}

	.uni-searchbar__box-search-input {
		flex: 1;
		font-size: 14px;
		color: #333;
	}

	.uni-searchbar__box-icon-clear {
		align-items: center;
		line-height: 24px;
		padding-left: 8px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-searchbar__text-placeholder {
		font-size: 14px;
		color: #808080;
		margin-left: 5px;
	}

	.uni-searchbar__cancel {
		padding-left: 10px;
		line-height: 36px;
		font-size: 14px;
		color: #333;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
</style>