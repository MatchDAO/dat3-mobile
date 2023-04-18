export default {
	data() {
		return {
			x: 0,
			transition: false,
			width: 0,
			viewWidth: 0,
			swipeShow: 0
		}
	},
	watch: {
		show(newVal) {
			if (this.autoClose) return
			if (newVal && newVal !== 'none' ) {
				this.transition = true
				this.open(newVal)
			} else {
				this.close()
			}
		}
	},
	created() {
		if (this.swipeaction.children !== undefined) {
			this.swipeaction.children.push(this)
		}
	},

	beforeDestroy() {
		this.swipeaction.children.forEach((item, index) => {
			if (item === this) {
				this.swipeaction.children.splice(index, 1)
			}
		})
	},
	mounted() {
		this.isopen = false
		setTimeout(() => {
			this.getQuerySelect()
		}, 50)
	},
	methods: {
		appTouchStart(e) {
			const {
				clientX
			} = e.changedTouches[0]
			this.clientX = clientX
			this.timestamp = new Date().getTime()
		},
		appTouchEnd(e, index, item, position) {
			const {
				clientX
			} = e.changedTouches[0]
			// fixed by xxxx  ios 13 
			let diff = Math.abs(this.clientX - clientX)
			let time = (new Date().getTime()) - this.timestamp
			if (diff < 40 && time < 300) {
				this.$emit('click', {
					content: item,
					index,
					position
				})
			}
		},
		// onClick(index, item, position) {
		// 	this.$emit('click', {
		// 		content: item,
		// 		index,
		// 		position
		// 	})
		// },
		/**
		 * 
		 * @param {Object} e
		 */
		onChange(e) {
			this.moveX = e.detail.x
			this.isclose = false
		},
		touchstart(e) {
			this.transition = false
			this.isclose = true
			this.autoClose && this.swipeaction.closeOther(this)
		},
		touchmove(e) {},
		touchend(e) {
			// 0
			if (this.isclose && this.isopen === 'none') return
			if (this.isclose && this.isopen !== 'none') {
				this.transition = true
				this.close()
			} else {
				this.move(this.moveX + this.leftWidth)
			}
		},

		/**
		 * 
		 * @param {Object} moveX
		 */
		move(moveX) {
			// 
			this.transition = true
			// 
			if (!this.isopen || this.isopen === 'none') {
				if (moveX > this.threshold) {
					this.open('left')
				} else if (moveX < -this.threshold) {
					this.open('right')
				} else {
					this.close()
				}
			} else {
				if (moveX < 0 && moveX < this.rightWidth) {
					const rightX = this.rightWidth + moveX
					if (rightX < this.threshold) {
						this.open('right')
					} else {
						this.close()
					}
				} else if (moveX > 0 && moveX < this.leftWidth) {
					const leftX = this.leftWidth - moveX
					if (leftX < this.threshold) {
						this.open('left')
					} else {
						this.close()
					}
				}

			}

		},

		/**
		 * 
		 */
		open(type) {
			this.x = this.moveX
			this.animation(type)
		},

		/**
		 * 
		 */
		close() {
			this.x = this.moveX
			// TODO  x  nextTick 
			this.$nextTick(() => {
				this.x = -this.leftWidth
				if(this.isopen!=='none'){
					this.$emit('change', 'none')
				}
				this.isopen = 'none'
			})
		},

		/**
		 * 
		 * @param {Object} type
		 */
		animation(type) {
			this.$nextTick(() => {
				if (type === 'left') {
					this.x = 0
				} else {
					this.x = -this.rightWidth - this.leftWidth
				}
				
				if(this.isopen!==type){
					this.$emit('change', type)
				}
				this.isopen = type
			})

		},
		getSlide(x) {},
		getQuerySelect() {
			const query = uni.createSelectorQuery().in(this);
			query.selectAll('.movable-view--hock').boundingClientRect(data => {
				this.leftWidth = data[1].width
				this.rightWidth = data[2].width
				this.width = data[0].width
				this.viewWidth = this.width + this.rightWidth + this.leftWidth
				if (this.leftWidth === 0) {
					// TODO bug ,x 0
					this.x = -0.1
				} else {
					this.x = -this.leftWidth
				}
				this.moveX = this.x
				this.$nextTick(() => {
					this.swipeShow = 1
				})

				if (!this.buttonWidth) {
					this.disabledView = true
				}

				if (this.autoClose) return
				if (this.show !== 'none') {
					this.transition = true
					this.open(this.shows)
				}
			}).exec();

		}
	}
}
