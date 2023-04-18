<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-title">value</view>
			<view>
				<slider value="50" @change="sliderChange" show-value />
			</view>
			
			<view class="uni-title">step</view>
			<view>
				<slider value="60" @change="sliderChange" step="5" />
			</view>

			<view class="uni-title">/</view>
			<view>
				<slider value="100" @change="sliderChange" min="50" max="200" show-value />
			</view>
			
			<view class="uni-title"></view>
			<view>
				<slider value="50" @change="sliderChange" activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9" block-size="20" />
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'slider '
			}
		},
		methods: {
			sliderChange(e) {
				console.log('value ' + e.detail.value)
			}
		}
	}
</script>
