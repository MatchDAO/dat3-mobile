<template>
	<view class="uni-collapse">
		<slot />
	</view>
</template>
<script>
	/**
	 * Collapse 
	 * @description  / 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=23
	 * @property {Boolean} accordion = [true|false] 
	 * @event {Function} change activeNamesArrayuniCollapseItem name 
	 */
	export default {
		name: 'UniCollapse',
		props: {
			accordion: {
				// 
				type: [Boolean, String],
				default: false
			}
		},
		data() {
			return {}
		},
		provide() {
			return {
				collapse: this
			}
		},
		created() {
			this.childrens = []
		},
		methods: {
			onChange() {
				let activeItem = []
				this.childrens.forEach((vm, index) => {
					if (vm.isOpen) {
						activeItem.push(vm.nameSync)
					}
				})
				this.$emit('change', activeItem)
			}
		}
	}
</script>
<style scoped>
	.uni-collapse {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: column;
		background-color: #ffffff;
	}
</style>