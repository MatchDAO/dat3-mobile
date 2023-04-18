<template>
	<view class="uni-data-checklist">
		<template v-if="!isLocal">
			<view class="uni-data-loading">
				<uni-load-more v-if="!mixinDatacomErrorMessage" status="loading" iconType="snow" :iconSize="18" :content-text="contentText"></uni-load-more>
				<text v-else>{{mixinDatacomErrorMessage}}</text>
			</view>
		</template>
		<template v-else>
			<checkbox-group v-if="multiple" class="checklist-group" :class="{'is-list':mode==='list' || wrap}" @change="chagne">
				<!-- :class="item.labelClass"  -->
				<label class="checklist-box" :class="['is--'+mode,item.selected?'is-checked':'',(disabled || !!item.disabled)?'is-disable':'',index!==0&&mode==='list'?'is-list-border':'']" :style="item.styleBackgroud" v-for="(item,index) in dataList" :key="index">
					<checkbox class="hidden" hidden :disabled="disabled || !!item.disabled" :value="item.value+''" :checked="item.selected" />
					<!-- :style="item.styleIcon" -->

					<view v-if="(mode !=='tag' && mode !== 'list') || ( mode === 'list' && icon === 'left')" class="checkbox__inner" :style="item.styleIcon">
						<!-- :class="item.checkboxClass" -->
						<view class="checkbox__inner-icon"></view>
					</view>
					<view class="checklist-content" :class="{'list-content':mode === 'list' && icon ==='left'}">
						<!-- :class="item.textClass" -->
						<text class="checklist-text" :style="item.styleIconText">{{item.text}}</text>
						<!-- :class="item.listClass"  -->
						<view v-if="mode === 'list' && icon === 'right'" class="checkobx__list" :style="item.styleBackgroud"></view>
					</view>
				</label>
			</checkbox-group>
			<radio-group v-else class="checklist-group" :class="{'is-list':mode==='list','is-wrap':wrap}" @change="chagne">
				<!-- -->
				<label class="checklist-box" :class="['is--'+mode,item.selected?'is-checked':'',(disabled || !!item.disabled)?'is-disable':'',index!==0&&mode==='list'?'is-list-border':'']" :style="item.styleBackgroud" v-for="(item,index) in dataList" :key="index">
					<radio class="hidden" hidden :disabled="disabled || item.disabled" :value="item.value+''" :checked="item.selected" />
					<!-- :class="item.checkboxBgClass"  -->
					<view v-if="(mode !=='tag' && mode !== 'list') || ( mode === 'list' && icon === 'left')" class="radio__inner" :style="item.styleBackgroud">
						<!-- :class="item.checkboxClass"  -->
						<view class="radio__inner-icon" :style="item.styleIcon"></view>
					</view>
					<view class="checklist-content" :class="{'list-content':mode === 'list' && icon ==='left'}">
						<!-- :class="item.textClass" -->
						<text class="checklist-text" :style="item.styleIconText">{{item.text}}</text>
						<!-- :class="item.listClass" -->
						<view v-if="mode === 'list' && icon === 'right'" :style="item.styleRightIcon" class="checkobx__list"></view>
					</view>
				</label>
			</radio-group>
		</template>
	</view>
</template>

<script>
	/**
	 * DataChecklist 
	 * @description  checkbox  radio
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=xxx
	 * @property {String} mode = [default| list | button | tag] 
	 * @value default  	
	 * @value list		
	 * @value button	
	 * @value tag 		
	 * @property {Boolean} multiple = [true|false] 
	 * @property {Array|String|Number} value 
	 * @property {Array} localdata   [{text:'',value:''}]
	 * @property {Number|String} min  multipletrue
	 * @property {Number|String} max  multipletrue
	 * @property {Boolean} wrap 
	 * @property {String} icon = [left|right]  list icon
	 * @property {Boolean} selectedColor 
	 * @property {Boolean} emptyText  
	 * @property {Boolean} selectedTextColor 
	 * @value left 
	 * @value right 
	 * @event {Function} change  
	 */

	// import clientdb from './clientdb.js'
	export default {
		name: 'uniDataChecklist',
		// mixins: [clientdb],
		mixins: [uniCloud.mixinDatacom],
		props: {
			mode: {
				type: String,
				default: 'default'
			},
			multiple: {
				type: Boolean,
				default: false
			},
			value: {
				type: [Array, String, Number],
				default () {
					return ''
				}
			},
			localdata: {
				type: Array,
				default () {
					return []
				}
			},
			min: {
				type: [Number, String],
				default: ''
			},
			max: {
				type: [Number, String],
				default: ''
			},
			wrap: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: 'left'
			},
			selectedColor: {
				type: String,
				default: '#007aff'
			},
			selectedTextColor: {
				type: String,
				default: '#333'
			},
			emptyText: {
				type: String,
				default: 'no data'
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			localdata: {
				handler(newVal) {
					this.range = newVal
					this.dataList = this.getDataList(this.getSelectedValue(newVal))
				},
				deep: true
			},
			mixinDatacomResData(newVal) {
				this.range = newVal
				this.dataList = this.getDataList(this.getSelectedValue(newVal))
			},
			value(newVal) {
				this.dataList = this.getDataList(newVal)
				this.formItem && this.formItem.setValue(newVal)
			}
		},
		data() {
			return {
				dataList: [],
				range: [],
				contentText: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				isLocal: true,
				styles: {
					selectedColor: '#007aff',
					selectedTextColor: '#333',
				}
			};
		},
		created() {
			this.form = this.getForm('uniForms')
			this.formItem = this.getForm('uniFormsItem')
			this.formItem && this.formItem.setValue(this.value)

			if (this.formItem) {
				if (this.formItem.name) {
					this.rename = this.formItem.name
					this.form.inputChildrens.push(this)
				}
			}

			if (this.localdata && this.localdata.length !== 0) {
				this.isLocal = true
				this.range = this.localdata
				this.dataList = this.getDataList(this.getSelectedValue(this.range))
			} else {
				if (this.collection) {
					this.isLocal = false
					this.loadData()
				}
			}
		},
		methods: {
			loadData() {
				this.mixinDatacomGet().then(res => {
					this.mixinDatacomResData = res.result.data
					if (this.mixinDatacomResData.length === 0) {
						this.isLocal = false
						this.mixinDatacomErrorMessage = this.emptyText
					} else {
						this.isLocal = true
					}
				}).catch(err => {
					this.mixinDatacomErrorMessage = err.message
				})
			},
			/**
			 * 
			 */
			getForm(name = 'uniForms') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false
					parentName = parent.$options.name;
				}
				return parent;
			},
			chagne(e) {
				const values = e.detail.value

				let detail = {
					value: [],
					data: []
				}

				if (this.multiple) {
					this.range.forEach(item => {
						if (values.includes(item.value + '')) {
							detail.value.push(item.value)
							detail.data.push(item)
						}
					})
				} else {
					const range = this.range.find(item => (item.value + '') === values)
					if (range) {
						detail = {
							value: range.value,
							data: range
						}
					}
				}
				this.formItem && this.formItem.setValue(detail.value)
				this.$emit('input', detail.value)
				this.$emit('change', {
					detail
				})
				if (this.multiple) {
					//  v-model  
					// if (this.value.length === 0) {
					this.dataList = this.getDataList(detail.value, true)
					// }
				} else {
					this.dataList = this.getDataList(detail.value)
				}
			},

			/**
			 * 
			 * @param {Object} value 
			 */
			getDataList(value) {
				// 
				let dataList = JSON.parse(JSON.stringify(this.range))
				let list = []
				if (this.multiple) {
					if (!Array.isArray(value)) {
						value = []
					}
				}
				dataList.forEach((item, index) => {
					item.disabled = item.disable || item.disabled || false
					if (this.multiple) {
						if (value.length > 0) {
							let have = value.find(val => val === item.value)
							item.selected = have !== undefined
						} else {
							item.selected = false
						}
					} else {
						item.selected = value === item.value
					}

					list.push(item)
				})
				return this.setRange(list)
			},
			/**
			 * 
			 * @param {Object} list
			 */
			setRange(list) {
				let selectList = list.filter(item => item.selected)
				let min = Number(this.min) || 0
				let max = Number(this.max) || ''
				list.forEach((item, index) => {
					if (this.multiple) {
						if (selectList.length <= min) {
							let have = selectList.find(val => val.value === item.value)
							if (have !== undefined) {
								item.disabled = true
							}
						}

						if (selectList.length >= max && max !== '') {
							let have = selectList.find(val => val.value === item.value)
							if (have === undefined) {
								item.disabled = true
							}
						}
					}
					this.setStyles(item, index)
					list[index] = item
				})
				return list
			},
			/**
			 *  class
			 * @param {Object} item
			 * @param {Object} index
			 */
			setStyles(item, index) {
				//  
				item.styleBackgroud = this.setStyleBackgroud(item)
				item.styleIcon = this.setStyleIcon(item)
				item.styleIconText = this.setStyleIconText(item)
				item.styleRightIcon = this.setStyleRightIcon(item)

			},

			/**
			 * 
			 * @param {Object} range
			 */
			getSelectedValue(range) {
				if (!this.multiple) return this.value
				let selectedArr = []
				range.forEach((item) => {
					if (item.selected) {
						selectedArr.push(item.value)
					}
				})
				return this.value.length > 0 ? this.value : selectedArr
			},

			/**
			 * 
			 */
			setStyleBackgroud(item) {
				let styles = {}
				// if (item.selected) {
				if (this.mode !== 'list') {
					styles['border-color'] = item.selected ? this.selectedColor : '#DCDFE6'
				}
				if (this.mode === 'tag') {
					styles['background-color'] = item.selected ? this.selectedColor : '#f5f5f5'
				}
				// }
				let classles = ''
				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				return classles
			},
			setStyleIcon(item) {
				let styles = {}
				let classles = ''
				// if (item.selected) {
				styles['background-color'] = item.selected ? this.selectedColor : '#fff'
				styles['border-color'] = item.selected ? this.selectedColor : '#DCDFE6'

				if (!item.selected && item.disabled) {
					styles['background-color'] = '#F2F6FC'
					styles['border-color'] = item.selected ? this.selectedColor : '#DCDFE6'
				}

				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				// }
				return classles
			},
			setStyleIconText(item) {
				let styles = {}
				let classles = ''
				// if (item.selected) {
				// if (this.selectedTextColor) {
				// 	styles.color = item.selected?this.selectedTextColor:'#999'
				// } else {
				if (this.mode === 'tag') {
					styles.color = item.selected ? '#fff' : '#333'

				} else {
					styles.color = item.selected ? this.selectedColor : '#333'
				}
				if (!item.selected && item.disabled) {
					styles.color = '#999'
				}
				// }
				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				// }

				return classles
			},
			setStyleRightIcon(item) {
				let styles = {}
				let classles = ''
				// if (item.selected) {
				if (this.mode === 'list') {
					styles['border-color'] = item.selected ? this.styles.selectedColor : '#DCDFE6'
				}
				for (let i in styles) {
					classles += `${i}:${styles[i]};`
				}
				// }

				return classles
			}
			// setColor(){
			// 	return
			// }
		}
	}
</script>

<style scoped>
	.uni-data-loading {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 36px;
		padding-left: 10px;
		color: #999;
	}

	.uni-data-checklist {
		position: relative;
		z-index: 0;
	}

	.uni-data-checklist .checklist-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.uni-data-checklist .checklist-group.is-list {
		flex-direction: column;
	}

	.uni-data-checklist .checklist-group .checklist-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		position: relative;
		margin: 5px 0;
		margin-right: 25px;
	}

	.uni-data-checklist .checklist-group .checklist-box .hidden {
		position: absolute;
		opacity: 0;
	}

	.uni-data-checklist .checklist-group .checklist-box .checklist-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.uni-data-checklist .checklist-group .checklist-box .checklist-content .checklist-text {
		font-size: 14px;
		color: #333;
		margin-left: 5px;
		line-height: 14px;
	}

	.uni-data-checklist .checklist-group .checklist-box .checklist-content .checkobx__list {
		border: 1px solid #fff;
		border-left: 0;
		border-top: 0;
		height: 12px;
		width: 6px;
		transform-origin: center;
		transform: rotate(45deg);
		opacity: 0;
	}

	.uni-data-checklist .checklist-group .checklist-box .checkbox__inner {
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
		position: relative;
		width: 16px;
		height: 16px;
		border: 1px solid #DCDFE6;
		border-radius: 2px;
		background-color: #fff;
		z-index: 1;
	}

	.uni-data-checklist .checklist-group .checklist-box .checkbox__inner .checkbox__inner-icon {
		position: absolute;
		/* #ifdef APP-NVUE */
		top: 2px;
		/* #endif */
		/* #ifndef APP-NVUE */
		top: 1px;
		/* #endif */
		left: 5px;
		height: 8px;
		width: 4px;
		border: 1px solid #fff;
		border-left: 0;
		border-top: 0;
		opacity: 0;
		transform-origin: center;
		transform: rotate(40deg);
	}

	.uni-data-checklist .checklist-group .checklist-box .radio__inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
		justify-content: center;
		align-items: center;
		position: relative;
		width: 16px;
		height: 16px;
		border: 1px solid #DCDFE6;
		border-radius: 16px;
		background-color: #fff;
		z-index: 1;
	}

	.uni-data-checklist .checklist-group .checklist-box .radio__inner .radio__inner-icon {
		width: 8px;
		height: 8px;
		border-radius: 10px;
		opacity: 0;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-disable {
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-disable .checkbox__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-disable .radio__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-disable .checklist-text {
		color: #999;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checkbox__inner {
		border-color: #007aff;
		background-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checkbox__inner .checkbox__inner-icon {
		opacity: 1;
		transform: rotate(45deg);
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .radio__inner {
		border-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .radio__inner .radio__inner-icon {
		opacity: 1;
		background-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checklist-text {
		color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked.is-disable .checkbox__inner {
		opacity: 0.4;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked.is-disable .checklist-text {
		opacity: 0.4;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button {
		margin-right: 10px;
		padding: 5px 15px;
		border: 1px #DCDFE6 solid;
		border-radius: 3px;
		transition: border-color 0.2s;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-disable {
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
		border: 1px #eee solid;
		opacity: 0.4;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-disable .checkbox__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-disable .radio__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-disable .checklist-text {
		color: #999;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked {
		border-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked .checkbox__inner {
		border-color: #007aff;
		background-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked .checkbox__inner .checkbox__inner-icon {
		opacity: 1;
		transform: rotate(45deg);
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked .radio__inner {
		border-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked .radio__inner .radio__inner-icon {
		opacity: 1;
		background-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked .checklist-text {
		color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--button.is-checked.is-disable {
		opacity: 0.4;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--tag {
		margin-right: 10px;
		padding: 5px 10px;
		border: 1px #DCDFE6 solid;
		border-radius: 3px;
		background-color: #f5f5f5;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--tag .checklist-text {
		margin: 0;
		color: #333;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--tag.is-disable {
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
		opacity: 0.4;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--tag.is-checked {
		background-color: #007aff;
		border-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--tag.is-checked .checklist-text {
		color: #fff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 10px 15px;
		padding-left: 0;
		margin: 0;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-list-border {
		border-top: 1px #eee solid;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-disable {
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-disable .checkbox__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-disable .checklist-text {
		color: #999;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-checked .checkbox__inner {
		border-color: #007aff;
		background-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-checked .checkbox__inner .checkbox__inner-icon {
		opacity: 1;
		transform: rotate(45deg);
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-checked .checklist-text {
		color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-checked .checklist-content .checkobx__list {
		opacity: 1;
		border-color: #007aff;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-checked.is-disable .checkbox__inner {
		opacity: 0.4;
	}

	.uni-data-checklist .checklist-group .checklist-box.is--list.is-checked.is-disable .checklist-text {
		opacity: 0.4;
	}
</style>