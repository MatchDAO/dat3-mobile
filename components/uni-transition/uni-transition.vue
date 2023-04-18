<template>
	<view v-if="isShow" ref="ani" :animation="animationData" :class="customClass" :style="transformStyles" @click="onClick">
		<slot></slot>
	</view>
</template>

<script>
	import {
		createAnimation
	} from './createAnimation'

	/**
	 * Transition 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=985
	 * @property {Boolean} show = [false|true] 
	 * @property {Array|String} modeClass = [fade|slide-top|slide-right|slide-bottom|slide-left|zoom-in|zoom-out] 
	 *  @value fade 
	 *  @value slide-top 
	 *  @value slide-right 
	 *  @value slide-bottom 
	 *  @value slide-left 
	 *  @value zoom-in 
	 *  @value zoom-out 
	 * @property {Number} duration 
	 * @property {Object} styles  css -`backgroundColor:red`
	 */
	export default {
		name: 'uniTransition',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			modeClass: {
				type: [Array, String],
				default () {
					return 'fade'
				}
			},
			duration: {
				type: Number,
				default: 300
			},
			styles: {
				type: Object,
				default () {
					return {}
				}
			},
			customClass: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isShow: false,
				transform: '',
				opacity: 1,
				animationData: {},
				durationTime: 300,
				config: {}
			}
		},
		watch: {
			show: {
				handler(newVal) {
					if (newVal) {
						this.open()
					} else {
						//  close,
						if (this.isShow) {
							this.close()
						}
					}
				},
				immediate: true
			}
		},
		computed: {
			// 
			stylesObject() {
				let styles = {
					...this.styles,
					'transition-duration': this.duration / 1000 + 's'
				}
				let transform = ''
				for (let i in styles) {
					let line = this.toLine(i)
					transform += line + ':' + styles[i] + ';'
				}
				return transform
			},
			// 
			transformStyles() {
				return 'transform:' + this.transform + ';' + 'opacity:' + this.opacity + ';' + this.stylesObject
			}
		},
		created() {
			// 
			this.config = {
				duration: this.duration,
				timingFunction: 'ease',
				transformOrigin: '50% 50%',
				delay: 0
			}
			this.durationTime = this.duration
		},
		methods: {
			/**
			 *  ref  
			 */
			init(obj = {}) {
				if (obj.duration) {
					this.durationTime = obj.duration
				}
				this.animation = createAnimation(Object.assign(this.config, obj))
			},
			/**
			 * 
			 */
			onClick() {
				this.$emit('click', {
					detail: this.isShow
				})
			},
			/**
			 * ref  
			 * @param {Object} obj
			 */
			step(obj, config = {}) {
				if (!this.animation) return
				for (let i in obj) {
					try {
						if (typeof obj[i] === 'object') {
							this.animation[i](...obj[i])
						} else {
							this.animation[i](obj[i])
						}
					} catch (e) {
						console.error(` ${i} `)
					}
				}
				this.animation.step(config)
				return this
			},
			/**
			 *  ref  
			 */
			run(fn) {
				if (!this.animation) return
				this.animation.run(fn)
			},
			// 
			open() {
				clearTimeout(this.timer)
				this.transform = ''
				this.isShow = true
				let {
					opacity,
					transform
				} = this.styleInit(false)
				if (typeof opacity !== 'undefined') {
					this.opacity = opacity
				}
				this.transform = transform
				//  nextTick  wx 
				this.$nextTick(() => {
					// TODO 
					this.timer = setTimeout(() => {
						this.animation = createAnimation(this.config, this)
						this.tranfromInit(false).step()
						this.animation.run()
						this.$emit('change', {
							detail: this.isShow
						})
					}, 20)
				})
			},
			// 
			close(type) {
				if (!this.animation) return
				this.tranfromInit(true)
					.step()
					.run(() => {
						this.isShow = false
						this.animationData = null
						this.animation = null
						let {
							opacity,
							transform
						} = this.styleInit(false)
						this.opacity = opacity || 1
						this.transform = transform
						this.$emit('change', {
							detail: this.isShow
						})
					})
			},
			// 
			styleInit(type) {
				let styles = {
					transform: ''
				}
				let buildStyle = (type, mode) => {
					if (mode === 'fade') {
						styles.opacity = this.animationType(type)[mode]
					} else {
						styles.transform += this.animationType(type)[mode] + ' '
					}
				}
				if (typeof this.modeClass === 'string') {
					buildStyle(type, this.modeClass)
				} else {
					this.modeClass.forEach(mode => {
						buildStyle(type, mode)
					})
				}
				return styles
			},
			// 
			tranfromInit(type) {
				let buildTranfrom = (type, mode) => {
					let aniNum = null
					if (mode === 'fade') {
						aniNum = type ? 0 : 1
					} else {
						aniNum = type ? '-100%' : '0'
						if (mode === 'zoom-in') {
							aniNum = type ? 0.8 : 1
						}
						if (mode === 'zoom-out') {
							aniNum = type ? 1.2 : 1
						}
						if (mode === 'slide-right') {
							aniNum = type ? '100%' : '0'
						}
						if (mode === 'slide-bottom') {
							aniNum = type ? '100%' : '0'
						}
					}
					this.animation[this.animationMode()[mode]](aniNum)
				}
				if (typeof this.modeClass === 'string') {
					buildTranfrom(type, this.modeClass)
				} else {
					this.modeClass.forEach(mode => {
						buildTranfrom(type, mode)
					})
				}

				return this.animation
			},
			animationType(type) {
				return {
					fade: type ? 1 : 0,
					'slide-top': `translateY(${type ? '0' : '-100%'})`,
					'slide-right': `translateX(${type ? '0' : '100%'})`,
					'slide-bottom': `translateY(${type ? '0' : '100%'})`,
					'slide-left': `translateX(${type ? '0' : '-100%'})`,
					'zoom-in': `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
					'zoom-out': `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
				}
			},
			// 
			animationMode() {
				return {
					fade: 'opacity',
					'slide-top': 'translateY',
					'slide-right': 'translateX',
					'slide-bottom': 'translateY',
					'slide-left': 'translateX',
					'zoom-in': 'scale',
					'zoom-out': 'scale'
				}
			},
			// 
			toLine(name) {
				return name.replace(/([A-Z])/g, '-$1').toLowerCase()
			}
		}
	}
</script>

<style scoped></style>