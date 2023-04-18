export default {
	created() {
		if (this.type === 'message') {
			// 
			this.maskShow = false 
			// 
			this.childrenMsg = null
		}
	},
	methods: {
		customOpen() {
			if (this.childrenMsg) {
				this.childrenMsg.open()
			}
		},
		customClose() {
			if (this.childrenMsg) {
				this.childrenMsg.close()
			}
		}
	}
}
