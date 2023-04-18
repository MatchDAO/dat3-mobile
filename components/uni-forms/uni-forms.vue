<template>
	<!--   -->
	<view class="uni-forms" :class="{'uni-forms--top':!border}">
		<form @submit.stop="submitForm" @reset="resetForm">
			<slot></slot>
		</form>
	</view>
</template>

<script>
	/**
	 * Forms 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=2773
	 * @property {Object} rules  							
	 * @property {String} validateTrigger = [bind|submit]	  submit 
	 * @value bind 	
	 * @value submit 	
	 * @property {String} labelPosition = [top|left]				label   left 
	 * @value top		 label
	 * @value left		 label
	 * @property {String} labelWidth  							label  65px
	 * @property {String} labelAlign = [left|center|right]		label    left 
	 * @value left		label 
	 * @value center	label 
	 * @value right		label 
	 * @property {String} errShowType = [undertext|toast|modal]	
	 * @value undertext	
	 * @value toast		toast
	 * @value modal		modal
	 * @event {Function} submit 
	 */
	import Vue from 'vue'
	Vue.prototype.binddata = function(name, value, formName) {
		if (formName) {
			this.$refs[formName].setValue(name, value)
		} else {
			let formVm
			for (let i in this.$refs) {
				const vm = this.$refs[i]
				if (vm && vm.$options && vm.$options.name === 'uniForms') {
					formVm = vm
					break
				}
			}
			if (!formVm) return console.error(' uni-froms  ref ')
			formVm.setValue(name, value)
		}
	}

	import Validator from './validate.js'

	export default {
		name: 'uniForms',
		props: {
			value: {
				type: Object,
				default () {
					return {}
				}
			},
			// 
			rules: {
				type: Object,
				default () {
					return {}
				}
			},
			//  
			validateTrigger: {
				type: String,
				default: ''
			},
			// label  top/left
			labelPosition: {
				type: String,
				default: 'left'
			},
			// label  px
			labelWidth: {
				type: [String, Number],
				default: 65
			},
			// label  left/center/right
			labelAlign: {
				type: String,
				default: 'left'
			},
			errShowType: {
				type: String,
				default: 'undertext'
			},
			border: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				formData: {}
			};
		},
		watch: {
			rules(newVal) {
				this.init(newVal)
			},
			trigger(trigger) {
				this.formTrigger = trigger
			},
		},
		created() {
			let _this = this
			this.childrens = []
			this.inputChildrens = []
			this.checkboxChildrens = []
			this.formRules = []
			// this.init(this.rules)
		},
		mounted() {
			this.init(this.rules)
		},
		methods: {
			init(formRules) {
				// 
				if (Object.keys(formRules).length > 0) {
					this.formTrigger = this.trigger
					this.formRules = formRules
					if (!this.validator) {
						this.validator = new Validator(formRules)
					}
				} else {
					return
				}
				// 
				for (let i in this.value) {
					const itemData = this.childrens.find(v => v.name === i)
					if (itemData) {
						this.formData[i] = this.value[i]
						itemData.init()
					}
				}

				// watch  
				Object.keys(this.value).forEach((key) => {
					this.$watch('value.' + key, (newVal) => {
						const itemData = this.childrens.find(v => v.name === key)
						if (itemData) {
							this.formData[key] = this._getValue(key, newVal)
							itemData.init()
						} else {
							this.formData[key] = this.value[key] || null
						}
					})
				})
			},
			/**
			 * 
			 * @param {Object} formRules
			 */
			setRules(formRules) {
				this.init(formRules)
			},
			/**
			 * 
			 *  value 
			 *  @param {String} name 
			 *  @param {String} value 
			 */
			setValue(name, value, callback) {
				let example = this.childrens.find(child => child.name === name)
				if (!example) return null
				value = this._getValue(example.name, value)
				this.formData[name] = value
				example.val = value
				this.$emit('input', Object.assign({}, this.value, this.formData))
				return example.triggerCheck(value, callback)
			},

			/**
			 * TODO  
			 * @param {Object} event
			 */
			submitForm(event) {
				const value = event.detail.value
				return this.validateAll(value || this.formData, 'submit')
			},

			/**
			 * 
			 * @param {Object} event
			 */
			resetForm(event) {
				this.childrens.forEach(item => {
					item.errMsg = ''
					const inputComp = this.inputChildrens.find(child => child.rename === item.name)
					if (inputComp) {
						inputComp.errMsg = ''
						inputComp.$emit('input', inputComp.multiple ? [] : '')
					}
				})

				this.childrens.forEach((item) => {
					if (item.name) {
						this.formData[item.name] = this._getValue(item.name, '')
					}
				})

				this.$emit('input', this.formData)
				this.$emit('reset', event)
			},

			/**
			 *  @validate 
			 * @param {Object} validate
			 */
			validateCheck(validate) {
				if (validate === null) validate = null
				this.$emit('validate', validate)
			},
			/**
			 * 
			 */
			async validateAll(invalidFields, type, callback) {
				this.childrens.forEach(item => {
					item.errMsg = ''
				})

				let promise;
				if (!callback && typeof callback !== 'function' && Promise) {
					promise = new Promise((resolve, reject) => {
						callback = function(valid, invalidFields) {
							!valid ? resolve(invalidFields) : reject(valid);
						};
					});
				}

				let fieldsValue = {}
				let tempInvalidFields = Object.assign({}, invalidFields)

				Object.keys(this.formRules).forEach(item => {
					const values = this.formRules[item]
					const rules = (values && values.rules) || []
					let isNoField = false
					for (let i = 0; i < rules.length; i++) {
						const rule = rules[i]
						if (rule.required) {
							isNoField = true
							break
						}
					}
					//  required 
					if (!isNoField &&
						((tempInvalidFields[item] === undefined ||
								tempInvalidFields[item] === '') &&
							tempInvalidFields[item] !== false
						)) {
						delete tempInvalidFields[item]
					}
				})

				// 
				for (let i in this.formRules) {
					for (let j in tempInvalidFields) {
						const index = this.childrens.findIndex(v => v.name === j)
						if (i === j && index !== -1) {
							fieldsValue[i] = tempInvalidFields[i]
						}
					}
				}
				let result = []
				let example = null

				let newFormData = {}
				this.childrens.forEach(v => {
					newFormData[v.name] = this._getValue(v.name, invalidFields[v.name])
				})
				if (this.validator) {
					for (let i in fieldsValue) {
						// 
						const resultData = await this.validator.validateUpdate({
							[i]: fieldsValue[i]
						}, this.formData)

						// 
						if (resultData) {
							// 
							example = this.childrens.find(child => child.name === resultData.key)
							// easyInput 
							const inputComp = this.inputChildrens.find(child => child.rename === (example && example.name))
							if (inputComp) {
								inputComp.errMsg = resultData.errorMessage
							}
							result.push(resultData)
							// 
							if (this.errShowType === 'undertext') {
								if (example) example.errMsg = resultData.errorMessage
							} else {
								if (this.errShowType === 'toast') {
									uni.showToast({
										title: resultData.errorMessage || '',
										icon: 'none'
									})
									break
								} else if (this.errShowType === 'modal') {
									uni.showModal({
										title: '',
										content: resultData.errorMessage || ''
									})
									break
								} else {
									if (example) example.errMsg = resultData.errorMessage
								}
							}
						}
					}
				}

				if (Array.isArray(result)) {
					if (result.length === 0) result = null
				}

				if (type === 'submit') {
					this.$emit('submit', {
						detail: {
							value: newFormData,
							errors: result
						}
					})
				} else {
					this.$emit('validate', result)
				}

				callback && typeof callback === 'function' && callback(result, newFormData)

				if (promise && callback) {
					return promise
				} else {
					return null
				}
			},

			/**
			 * 
			 * 
			 * 
			 */
			submit(callback) {
				// Object.assign(this.formData,formData)
				for (let i in this.value) {
					const itemData = this.childrens.find(v => v.name === i)
					if (itemData) {
						if (this.formData[i] === undefined) {
							this.formData[i] = this._getValue(i, this.value[i])
						}
					}
				}
				return this.validateAll(this.formData, 'submit', callback)
			},

			/**
			 * 
			 * 
			 * 
			 */
			validate(callback) {
				return this.validateAll(this.formData, '', callback)
			},

			/**
			 * 
			 * @param {Object} props
			 * @param {Object} cb
			 */
			validateField(props, callback) {
				props = [].concat(props);
				let invalidFields = {}
				this.childrens.forEach(item => {
					if (props.indexOf(item.name) !== -1) {
						invalidFields = Object.assign({}, invalidFields, {
							[item.name]: this.formData[item.name]
						})
					}
				})
				return this.validateAll(invalidFields, '', callback)
			},

			/**
			 * 
			 */
			resetFields() {
				this.resetForm()
			},

			/**
			 *  prop  prop 
			 */
			clearValidate(props) {
				props = [].concat(props);
				this.childrens.forEach(item => {
					const inputComp = this.inputChildrens.find(child => child.rename === item.name)
					if (props.length === 0) {
						item.errMsg = ''
						if (inputComp) {
							inputComp.errMsg = ''
						}
					} else {
						if (props.indexOf(item.name) !== -1) {
							item.errMsg = ''
							if (inputComp) {
								inputComp.errMsg = ''
							}
						}
					}
				})
			},
			/**
			 *  value 
			 * @param {Object} key
			 * @param {Object} value
			 */
			_getValue(key, value) {
				const rules = (this.formRules[key] && this.formRules[key].rules) || []
				const isRuleNum = rules.find(val => val.format && this.type_filter(val.format))
				const isRuleBool = rules.find(val => val.format && val.format === 'boolean' || val.format === 'bool')
				//  number
				if (isRuleNum) {
					value = isNaN(value) ? value : (value === '' || value === null ? null : Number(value))
				}
				// 
				if (isRuleBool) {
					value = !value ? false : true
				}
				return value
			},
			/**
			 * 
			 * @param {Object} format
			 */
			type_filter(format) {
				return format === 'int' || format === 'double' || format === 'number' || format === 'timestamp'
			}
		}
	}
</script>

<style scoped></style>