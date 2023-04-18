<template>
	<view>
		<page-head title="audio"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-center">
				<audio style="text-align: left" :src="current.src" :poster="current.poster" :name="current.name" :author="current.author"
				    :action="audioAction" controls></audio>
				<view class="">audiouni.createInnerAudioContext()</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				current: {
					poster: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/c517b410-5184-11eb-b997-9918a5dda011.jpeg',
					name: '',
					author: '',
					src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
				},
				audioAction: {
					method: 'pause'
				}
			}
		}
	}
</script>