<template>
	<view class="uni-forms-item" :class="{'uni-forms-item--border':border,'is-first-border':border&&isFirstBorder,'uni-forms-item-error':msg}">
		<view class="uni-forms-item__box">
			<view class="uni-forms-item__inner" :class="['is-direction-'+labelPos,]">
				<view v-if="label" class="uni-forms-item__label" :style="{width:labelWid+'px',justifyContent: justifyContent}">
					<slot name="left">
						<uni-icons v-if="leftIcon" class="label-icon" size="16" :type="leftIcon" :color="iconColor" />
						<text class="label-text">{{label}}</text>
						<text v-if="required" class="is-required">*</text>
					</slot>
				</view>
				<view class="uni-forms-item__content" :class="{'is-input-error-border': msg}">
					<slot></slot>
				</view>
			</view>
			<view v-if="msg" class="uni-error-message" :class="{'uni-error-msg--boeder':border}" :style="{
				paddingLeft: (labelPos === 'left'? Number(labelWid)+5:5) + 'px'
			}"><text class="uni-error-message-text">{{ showMsg === 'undertext' ? msg:'' }}</text></view>
		</view>
	</view>
</template>

<script>
	/**
	 * Field 
	 * @description  "text"  "textarea" 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=21001
	 * @property {Boolean} 	required 			"*"false
	 * @property {String} validateTrigger = [bind|submit]	  submit 
	 * 	@value bind 	
	 * 	@value submit 	
	 * @property {String } 	leftIcon 			label uni-ui 
	 * @property {String } 	iconColor 			icon#606266
	 * @property {String } 	label 				
	 * @property {Number } 	labelWidth 			labelpx65
	 * @property {String } 	labelAlign = [left|center|right] labelleft
	 * 	@value left		label 
	 * 	@value center	label 
	 * 	@value right	label 
	 * @property {String } 	labelPosition = [top|left] labelleft
	 * 	@value top	 label
	 * 	@value left	 label
	 * @property {String } 	errorMessage 		false
	 * @property {String } 	name 				
	 */



	export default {
		name: "uniFormsItem",
		props: {
			// 
			custom: {
				type: Boolean,
				default: false
			},
			// 
			showMessage: {
				type: Boolean,
				default: true
			},
			name: String,
			required: Boolean,
			validateTrigger: {
				type: String,
				default: ''
			},
			leftIcon: String,
			iconColor: {
				type: String,
				default: '#606266'
			},
			label: String,
			// px
			labelWidth: {
				type: [Number, String],
				default: ''
			},
			// left|center|right
			labelAlign: {
				type: String,
				default: ''
			},
			// lable left-top-
			labelPosition: {
				type: String,
				default: ''
			},
			errorMessage: {
				type: [String, Boolean],
				default: ''
			}
		},
		data() {
			return {
				errorTop: false,
				errorBottom: false,
				labelMarginBottom: '',
				errorWidth: '',
				errMsg: '',
				val: '',
				labelPos: '',
				labelWid: '',
				labelAli: '',
				showMsg: 'undertext',
				border: false,
				isFirstBorder: false
			};
		},
		computed: {
			msg() {
				return this.errorMessage || this.errMsg;
			},
			fieldStyle() {
				let style = {}
				if (this.labelPos == 'top') {
					style.padding = '0 0'
					this.labelMarginBottom = '6px'
				}
				if (this.labelPos == 'left' && this.msg !== false && this.msg != '') {
					style.paddingBottom = '0px'
					this.errorBottom = true
					this.errorTop = false
				} else if (this.labelPos == 'top' && this.msg !== false && this.msg != '') {
					this.errorBottom = false
					this.errorTop = true
				} else {
					// style.paddingBottom = ''
					this.errorTop = false
					this.errorBottom = false
				}
				return style
			},

			// unicomputedstyle.justifyContent = 'center'
			justifyContent() {
				if (this.labelAli === 'left') return 'flex-start';
				if (this.labelAli === 'center') return 'center';
				if (this.labelAli === 'right') return 'flex-end';
			}
		},
		watch: {
			validateTrigger(trigger) {
				this.formTrigger = trigger
			}
		},
		created() {
			this.form = this.getForm()
			this.group = this.getForm('uniGroup')
			this.formRules = []
			this.formTrigger = this.validateTrigger
			if (this.form) {
			this.form.childrens.push(this)
			}
			this.init()
		},
		destroyed() {
			if (this.form) {
				this.form.childrens.forEach((item, index) => {
					if (item === this) {
						this.form.childrens.splice(index, 1)
						delete this.form.formData[item.name]
					}
				})
			}
		},
		methods: {
			init() {
				if (this.form) {
					let {
						formRules,
						validator,
						formData,
						value,
						labelPosition,
						labelWidth,
						labelAlign,
						errShowType
					} = this.form

					this.labelPos = this.labelPosition ? this.labelPosition : labelPosition
					this.labelWid = this.label ? (this.labelWidth ? this.labelWidth : labelWidth):0
					this.labelAli = this.labelAlign ? this.labelAlign : labelAlign

					//  item
					if (!this.form.isFirstBorder) {
						this.form.isFirstBorder = true
						this.isFirstBorder = true
					}

					//  group  item
					if (this.group) {
						if (!this.group.isFirstBorder) {
							this.group.isFirstBorder = true
							this.isFirstBorder = true
						}
					}

					this.border = this.form.border
					this.showMsg = errShowType

					if (formRules) {
						this.formRules = formRules[this.name] || {}
					}

					this.validator = validator
				} else {
					this.labelPos = this.labelPosition || 'left'
					this.labelWid = this.labelWidth || 65
					this.labelAli = this.labelAlign || 'left'
				}
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

			/**
			 * 
			 */
			clearValidate() {
				this.errMsg = ''
			},

			setValue(value){
				if (this.name) {
					if(this.errMsg) this.errMsg = ''
					this.form.formData[this.name] =  this.form._getValue(this.name, value)
					if(!this.formRules || (typeof(this.formRules) && JSON.stringify(this.formRules) === '{}')) return
					this.triggerCheck(this.form._getValue(this.name, value))
				}
			},

			/**
			 * 
			 * @param {Object} value
			 */
			async triggerCheck(value, callback) {
				let promise = null;
				this.errMsg = ''
				// if no callback, return promise
				// if (callback && typeof callback !== 'function' && Promise) {
				// 	promise = new Promise((resolve, reject) => {
				// 		callback = function(valid) {
				// 			!valid ? resolve(valid) : reject(valid)
				// 		};
				// 	});
				// }
				// if (!this.validator) {
				// 	typeof callback === 'function' && callback(null);
				// 	if (promise) return promise
				// }
				if (!this.validator) return
				const isNoField = this.isRequired(this.formRules.rules || [])
				let isTrigger = this.isTrigger(this.formRules.validateTrigger, this.validateTrigger, this.form.validateTrigger)
				let result = null
				if (!(!isTrigger)) {
					result = await this.validator.validateUpdate({
						[this.name]: value
					}, this.form.formData)
				}
				// ,
				if (!isNoField && (value === undefined || value === '')) {
					result = null
				}
				if (isTrigger && result && result.errorMessage) {
					const inputComp = this.form.inputChildrens.find(child => child.rename === this.name)
					if (inputComp) {
						inputComp.errMsg = result.errorMessage
					}
					if (this.form.errShowType === 'toast') {
						uni.showToast({
							title: result.errorMessage || '',
							icon: 'none'
						})
					}
					if (this.form.errShowType === 'modal') {
						uni.showModal({
							title: '',
							content: result.errorMessage || ''
						})
					}
				}

				this.errMsg = !result ? '' : result.errorMessage
				// validate
				this.form.validateCheck(result ? result : null)
				// typeof callback === 'function' && callback(result ? result : null);
				// if (promise) return promise

			},
			/**
			 * 
			 * @param {Object} event
			 */
			isTrigger(rule, itemRlue, parentRule) {
				let rl = true;
				//  bind  submit
				if (rule === 'submit' || !rule) {
					if (rule === undefined) {
						if (itemRlue !== 'bind') {
							if (!itemRlue) {
								return parentRule === 'bind' ? true : false
							}
							return false
						}
						return true
					}
					return false
				}
				return true;
			},
			// 
			isRequired(rules) {
				let isNoField = false
				for (let i = 0; i < rules.length; i++) {
					const ruleData = rules[i]
					if (ruleData.required) {
						isNoField = true
						break
					}
				}
				return isNoField
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-forms-item {
		position: relative;
		padding: 0px;
		text-align: left;
		color: #333;
		font-size: 14px;
		// margin-bottom: 22px;
	}
	.uni-forms-item__box {
		position: relative;

	}
	.uni-forms-item__inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		// flex-direction: row;
		// align-items: center;
		padding-bottom: 22px;
		// margin-bottom: 22px;
	}

	.is-direction-left {
		flex-direction: row;
	}

	.is-direction-top {
		flex-direction: column;
	}

	.uni-forms-item__label {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		width: 65px;
		// line-height: 2;
		// margin-top: 3px;
		padding: 5px 0;
		height: 36px;
		margin-right: 5px;
		.label-text {
			font-size: 14px;
			color: #333;
		}
	}

	.uni-forms-item__content {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		min-height: 36px;
		/* #endif */
		flex: 1;
	}


	.label-icon {
		margin-right: 5px;
		margin-top: -1px;
	}

	// 
	.is-required {
		color: $uni-color-error;
	}

	.uni-error-message {
		position: absolute;
		bottom: 0px;
		left: 0;
		text-align: left;
	}
	.uni-error-message-text {
		line-height: 22px;
		color: $uni-color-error;
		font-size: 12px;
	}

	.uni-error-msg--boeder {
		position: relative;
		bottom: 0;
		line-height: 22px;
	}

	.is-input-error-border {
		border-color: $uni-color-error;
	}

	.uni-forms-item--border {
		margin-bottom: 0;
		padding: 10px 0;
		// padding-bottom: 0;
		border-top: 1px #eee solid;
		.uni-forms-item__inner {
			padding: 0;
		}
	}

	.uni-forms-item-error {
		padding-bottom: 0;
	}

	.is-first-border {
		/* #ifndef APP-NVUE */
		border: none;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-width: 0;
		/* #endif */
	}
</style>
