export default {
	created() {
		if (this.type === 'share') {
			// 
			this.mkclick = false
		}
	},
	methods: {
		customOpen() {
			console.log('share ');
		},
		customClose() {
			console.log('share ');
		}
	}
}
