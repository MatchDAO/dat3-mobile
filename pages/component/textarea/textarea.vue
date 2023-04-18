<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-title uni-common-pl"></view>
		<view class="uni-textarea">
			<textarea @blur="bindTextAreaBlur" auto-height />
			</view>
			<view class="uni-title uni-common-pl">textarea</view>
			<view class="uni-textarea">
				<textarea placeholder-style="color:#F76260" placeholder=""/>
			</view>
		</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'textarea',
				focus: false
			}
		},
		methods: {
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value)
			}
		}
	}
</script>

<style>
</style>
