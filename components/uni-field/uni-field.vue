<template>
	<view class="uni-field" :class="{ 'uni-border-top': borderTop, 'uni-border-bottom': borderBottom }" :style="[fieldStyle]">
		<view class="uni-field-inner" :class="[type == 'textarea' ? 'uni-textarea-inner' : '', 'uni-label-postion-' + labelPos]">
			<view :class="errorTop ? 'uni-error-in-label' : ''">
				<view class="uni-field-label" :class="[required ? 'uni-required' : '']" :style="{
						justifyContent: justifyContent,
						width: labelWid + 'px',
						marginBottom: labelMarginBottom
					}">
					<view class="uni-icon-wrap" v-if="leftIcon">
						<uni-icons size="16" :type="leftIcon" :color="iconColor" />
					</view>
					<slot name="leftIcon"></slot>
					<text class="uni-label-text" :class="[leftIcon ? 'uni-label-left-gap' : '']">{{ label }}</text>
				</view>
				<view v-if="errorTop" class="uni-error-message" :style="{ paddingLeft: '4px' }">{{ msg }}</view>
			</view>
			<view class="fild-body" :class="[inputBorder ? 'uni-input-border' : '']" :style="[borderEixstTextareaStyle]">
				<view class="uni-flex-1 uni-flex" :style="[inputWrapStyle]">
					<textarea v-if="type == 'textarea'" class="uni-flex-1 uni-textarea-class" :name="name" :value="value" :placeholder="placeholder" :placeholderStyle="placeholderStyle" :disabled="disabled" :maxlength="inputMaxlength" :focus="focus" :autoHeight="autoHeight" @input="onInput" @blur="onBlur" @focus="onFocus" @confirm="onConfirm" @tap="fieldClick" />
					<input
						v-else
						:type="type"
						class="uni-flex-1 uni-field__input-wrap"
						:name="name"
						:value="value"
						:password="password || this.type === 'password'"
						:placeholder="placeholder"
						:placeholderStyle="placeholderStyle"
						:disabled="disabled"
						:maxlength="inputMaxlength"
						:focus="focus"
						:confirmType="confirmType"
						@focus="onFocus"
						@blur="onBlur"
						@input="onInput"
						@confirm="onConfirm"
						@tap="fieldClick"
					/>
					<uni-icons :size="clearSize" v-if="clearable && value != ''" type="clear" color="#c0c4cc" @click="onClear" class="uni-clear-icon" />
				</view>
				<view class="uni-button-wrap"><slot name="right" /></view>
				<uni-icons v-if="rightIcon" size="16" @click="rightIconClick" :type="rightIcon" color="#c0c4cc" :style="[rightIconStyle]" />
			</view>
		</view>
		<view
			v-if="errorBottom"
			class="uni-error-message"
			:style="{
				paddingLeft: Number(labelWid) + 4 + 'px'
			}"
		>
			{{ msg }}
		</view>
	</view>
</template>

<script>
/**
 * Field 
 * @description  "text"  "textarea" 
 * @tutorial https://ext.dcloud.net.cn/plugin?id=21001
 * @property {String } 	type 				text
 * @property {Boolean} 	required 			"*"false
 * @property {String } 	leftIcon 			labeluni-ui
 * @property {String } 	iconColor 			icon#606266
 * @property {Boolean} 	rightIcon 			uni-uifalse
 * @property {String } 	label 				
 * @property {Number } 	labelWidth 			labelpx65
 * @property {String } 	labelAlign 			labelleft
 * @property {String } 	labelPosition 		labelleft
 * @property {Boolean} 	clearable 			()true
 * @property {String } 	placeholder 		
 * @property {String } 	placeholderStyle 	placeholder()"color: #ddd"
 * @property {Boolean} 	password 			()typetextfalse
 * @property {Boolean} 	focus 				false
 * @property {Boolean} 	disabled 			false
 * @property {Number } 	maxlength 			 -1 140
 * @property {String } 	confirmType 		type="text"done
 * @property {String } 	errorMessage 		false
 * @property {Number } 	clearSize 			px15
 * @property {Boolean} 	trim 				
 * @property {String } 	name 				
 * @property {Array  }  rules 				
 * @property {Boolean} 	inputBorder 		inputfalse
 * @property {Boolean} 	border-bottom 		fieldtrue
 * @property {Boolean} 	border-top 			fieldfalse
 * @property {Boolean} 	auto-height 		typetextareatrue
 * @event {Function} 	input 				
 * @event {Function} 	focus 				
 * @event {Function} 	blur 				
 * @event {Function} 	confirm 			
 * @event {Function} 	right-icon-click 	right-icon
 * @event {Function} 	click 				right-icon"picker"
 * @example <uni-field v-model="mobile" label="" required :error-message="errorMessage"></uni-field>
 */
export default {
	name: 'uni-field',
	props: {
		// rules:{
		// 	type:Array,
		// 	default(){
		// 		return []
		// 	}
		// },
		trigger: {
			type: String,
			default: ''
		},
		leftIcon: String,
		rightIcon: String,
		required: Boolean,
		label: String,
		password: Boolean,
		clearable: {
			type: Boolean,
			default: true
		},
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
		iconColor: {
			type: String,
			default: '#606266'
		},
		autoHeight: {
			type: Boolean,
			default: true
		},
		errorMessage: {
			type: [String, Boolean],
			default: ''
		},
		placeholder: String,
		placeholderStyle: String,
		focus: Boolean,
		name: String,
		value: [Number, String],
		type: {
			type: String,
			default: 'text'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		maxlength: {
			type: [Number, String],
			default: 140
		},
		confirmType: {
			type: String,
			default: 'done'
		},
		// lable left-top-
		labelPosition: {
			type: String,
			default: ''
		},
		// 
		clearSize: {
			type: [Number, String],
			default: 15
		},
		//  input 
		inputBorder: {
			type: Boolean,
			default: false
		},
		// 
		borderTop: {
			type: Boolean,
			default: false
		},
		// 
		borderBottom: {
			type: Boolean,
			default: true
		},
		// 
		trim: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			focused: false,
			itemIndex: 0,
			errorTop: false,
			errorBottom: false,
			labelMarginBottom: '',
			errorWidth: '',
			errMsg: '',
			errorBorderColor: false,
			val: '',
			labelPos: '',
			labelWid: '',
			labelAli: ''
		};
	},
	computed: {
		msg() {
			return this.errorMessage || this.errMsg;
		},
		fieldStyle() {
			let style = {};
			if (this.labelPos === 'top') {
				style.padding = '10px 14px';
				this.labelMarginBottom = '6px';
			}
			if (this.labelPos === 'left' && this.msg !== false && this.msg !== '') {
				style.paddingBottom = '0px';
				this.errorBottom = true;
				this.errorTop = false;
			} else if (this.labelPos === 'top' && this.msg !== false && this.msg !== '') {
				this.errorBottom = false;
				this.errorTop = true;
			} else {
				// style.paddingBottom = ''
				this.errorTop = false;
				this.errorBottom = false;
			}
			return style;
		},

		borderEixstTextareaStyle() {
			let style = {};
			if (this.inputBorder) {
				if (this.type === 'textarea') {
					style.minHeight = '60px';
				}
				if (this.msg !== false && this.msg != '') {
					style.borderColor = '#dd524d';
				}
			}
			return style;
		},

		inputWrapStyle() {
			let style = {};
			// lableleftinput
			if (this.labelPos == 'left') {
				style.margin = `0 4px`;
			} else {
				// labletopinput
				style.marginRight = `4px`;
				// this.fieldStyle.style.padding = '10px 14px'
			}
			return style;
		},
		rightIconStyle() {
			let style = {};
			if (this.arrowDirection == 'top') style.transform = 'roate(-90deg)';
			if (this.arrowDirection == 'bottom') style.transform = 'roate(90deg)';
			else style.transform = 'roate(0deg)';
			return style;
		},
		labelStyle() {
			let style = {};
			if (this.labelAli == 'left') style.justifyContent = 'flext-start';
			if (this.labelAli == 'center') style.justifyContent = 'center';
			if (this.labelAli == 'right') style.justifyContent = 'flext-end';
			return style;
		},
		// unicomputedstyle.justifyContent = 'center'
		justifyContent() {
			if (this.labelAli == 'left') return 'flex-start';
			if (this.labelAli == 'center') return 'center';
			if (this.labelAli == 'right') return 'flex-end';
		},
		// uniappinputmaxlength
		inputMaxlength() {
			return Number(this.maxlength);
		},
		// label
		fieldInnerStyle() {
			let style = {};
			if (this.labelPos == 'left') {
				style.flexDirection = 'row';
			} else {
				style.flexDirection = 'column';
			}

			return style;
		}
	},
	watch: {
		trigger(trigger) {
			this.formTrigger = trigger;
		}
	},
	created() {
		this.form = this.getForm();
		this.formRules = [];
		this.formTrigger = this.trigger;
		this.init();
	},
	methods: {
		/**
		 * 
		 */
		init() {
			if (this.form) {
				this.form.childrens.push(this);
				this.labelPos = this.labelPosition ? this.labelPosition : this.form.labelPosition;
				this.labelWid = this.labelWidth ? this.labelWidth : this.form.labelWidth;
				this.labelAli = this.labelAlign ? this.labelAlign : this.form.labelAlign;

				if (this.form.formRules) {
					this.formRules = this.form.formRules[this.name];
				}
				this.validator = this.form.validator;
				if(this.name){
					this.form.formData[this.name] = this.value || '';
				}
			} else {
				this.labelPos = this.labelPosition || 'left';
				this.labelWid = this.labelWidth || 65;
				this.labelAli = this.labelAlign || 'left';
			}
		},
		/**
		 * 
		 */
		getForm() {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== 'uniForms') {
				parent = parent.$parent;
				if (!parent) return false;
				parentName = parent.$options.name;
			}
			return parent;
		},

		/**
		 * 
		 */
		clearValidate() {
			this.errMsg = '';
		},
		/**
		 * 
		 * @param {Object} callback
		 */
		parentVal(callback) {
			if (this.type === 'number') {
				this.val = this.val === '' ? this.val : Number(this.val);
			}
			typeof callback === 'function' &&
				callback(
					{
						[this.name]: this.val
					},
					this.name
				);
		},
		/**
		 * 
		 * @param {Object} trigger
		 * @param {Object} value
		 */
		triggerValidator(trigger, value) {
			let isValid = false;
			//  name 
			this.formRules &&
				this.formRules.rules &&
				this.formRules.rules.forEach(item => {
					item.trigger = this.isTrigger(this.form.formTrigger, this.formTrigger, item.trigger);
					if (item.trigger !== trigger || item.trigger === 'submit') return;
					isValid = true;
				});

			isValid && this.triggerCheck(value);
		},
		/**
		 * 
		 * @param {Object} value
		 */
		triggerCheck(value, item) {
			//  number
			if (this.type === 'number') {
				value = value === '' ? value : Number(value);
			}
			const result = this.validator.validateUpdate({
				[this.name]: value
			});
			this.errMsg = !result ? '' : result.errorMessage;
			this.form.validateCheck(result);
		},
		/**
		 * 
		 * @param {Object} event
		 */
		isTrigger(parentRule, itemRlue, rule) {
			let rl = 'none';
			if (rule) {
				rl = rule;
			} else if (itemRlue) {
				rl = itemRlue;
			} else if (parentRule) {
				rl = parentRule;
			} else {
				rl = 'blur';
			}
			return rl;
		},

		onInput(event) {
			let value = event.detail.value;
			// 
			if (this.trim) value = this.trimStr(value);
			this.form.formData[this.name] = value || '';
			this.val = value;
			this.$emit('input', value);
			// 
			this.triggerValidator('change', value);
		},

		onFocus(event) {
			this.focused = true;
			this.$emit('focus', event);
		},
		onBlur(event) {
			let value = event.detail.value;
			// @touchstarthx2.8.4
			// @blur
			setTimeout(() => {
				this.focused = false;
			}, 100);
			this.$emit('blur', event);

			// 
			this.triggerValidator('blur', value);
		},
		onConfirm(e) {
			this.$emit('confirm', e.detail.value);
		},
		onClear(event) {
			this.val = '';
			this.$emit('input', '');
			this.clearValidate();
		},
		rightIconClick() {
			this.$emit('right-icon-click');
			this.$emit('click');
		},
		fieldClick() {
			this.$emit('click');
		},
		trimStr(str, pos = 'both') {
			if (pos == 'both') {
				return str.replace(/^\s+|\s+$/g, '');
			} else if (pos == 'left') {
				return str.replace(/^\s*/, '');
			} else if (pos == 'right') {
				return str.replace(/(\s*$)/g, '');
			} else if (pos == 'all') {
				return str.replace(/\s+/g, '');
			} else {
				return str;
			}
		}
	}
};
</script>

<style scoped>@charset "UTF-8";
.uni-field {
  padding: 16px 14px;
  text-align: left;
  color: #333;
  font-size: 14px;
  background-color: #fff;
}

.uni-field-inner {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
}

.uni-textarea-inner {
  align-items: flex-start;
}

.uni-textarea-class {
  /* #ifndef APP-NVUE */
  min-height: 48px;
  width: auto;
  /* #endif */
  font-size: 14px;
}

.fild-body {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  width: 100%;
  flex: 1;
  align-items: center;
}

.uni-arror-right {
  margin-left: 4px;
}

.uni-label-text {
  /* #ifndef APP-NVUE */
  display: inline-block;
  /* #endif */
}

.uni-label-left-gap {
  margin-left: 3px;
}

.uni-label-postion-top {
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.uni-field-label {
  width: 65px;
  /* #ifndef APP-NVUE */
  display: flex;
  flex: 1 1 65px;
  /* #endif */
  text-align: left;
  position: relative;
  align-items: center;
}

.uni-required::before {
  /* #ifndef APP-NVUE */
  content: "*";
  /* #endif */
  position: absolute;
  left: -8px;
  font-size: 14px;
  color: #dd524d;
  height: 9px;
  line-height: 1;
}

.uni-field__input-wrap {
  position: relative;
  overflow: hidden;
  font-size: 14px;
  height: 24px;
  flex: 1;
  /* #ifndef APP-NVUE */
  width: auto;
  /* #endif */
}

.uni-clear-icon {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
}

.uni-error-message {
  line-height: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
  color: #dd524d;
  font-size: 12px;
  text-align: left;
}

.uni-input-error-border {
  border-color: #dd524d;
}

.placeholder-style {
  color: #969799;
}

.uni-input-class {
  font-size: 14px;
}

.uni-button-wrap {
  margin-left: 4px;
}

/* start--Retina  1px --start */
.uni-border,
.uni-border-bottom,
.uni-border-left,
.uni-border-right,
.uni-border-top,
.uni-border-top-bottom {
  position: relative;
}

.uni-border-bottom:after,
.uni-border-left:after,
.uni-border-right:after,
.uni-border-top-bottom:after,
.uni-border-top:after,
.uni-border:after {
  /* #ifndef APP-NVUE */
  content: " ";
  box-sizing: border-box;
  pointer-events: none;
  -webkit-transform-origin: 0 0;
  /* #endif */
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  width: 199.8%;
  height: 199.7%;
  transform: scale(0.5, 0.5);
  border: 0 solid #e5e5e5;
  z-index: 2;
}

.uni-input-border {
  padding-left: 4px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  /* #ifndef APP-NVUE */
  min-height: 34px;
  box-sizing: border-box;
  /* #endif */
}

.uni-border-top:after {
  border-top-width: 1px;
}

.uni-border-left:after {
  border-left-width: 1px;
}

.uni-border-right:after {
  border-right-width: 1px;
}

.uni-border-bottom:after {
  border-bottom-width: 1px;
}

.uni-border-top-bottom:after {
  border-width: 1px 0;
}

.uni-border:after {
  border-width: 1px;
}

/* end--Retina  1px --end */
.uni-icon-wrap {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  padding-left: 3px;
  padding-right: 3px;
  align-items: center;
  justify-content: center;
}

.uni-button-wrap {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: flex-end;
  justify-content: center;
}

.uni-clear-icon {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  margin-left: 4px;
}

.uni-flex {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
}

.uni-flex-1 {
  flex: 1;
}

.uni-error-in-label {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}</style>