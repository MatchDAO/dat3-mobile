<template>
	<view class="page-body">
		<page-head title="movable-view,"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-title uni-common-mt">
				 1
				<text>\nmovable-view  movable-area</text>
			</view>
			<movable-area>
				<movable-view :x="x" :y="y" direction="all" @change="onChange">text</movable-view>
			</movable-area>
			<view @tap="tap" class="uni-link uni-center uni-common-mt">
				 (30px, 30px)
			</view>
			<view class="uni-title uni-common-mt">
				 2
				<text>\nmovable-viewmovable-area</text>
			</view>
			<movable-area>
				<movable-view class="max" direction="all">text</movable-view>
			</movable-area>
			<view class="uni-title uni-common-mt">
				 3
				<text>\n</text>
			</view>
			<movable-area>
				<movable-view direction="horizontal">text</movable-view>
			</movable-area>
			<view class="uni-title uni-common-mt">
				 4
				<text>\n</text>
			</view>
			<movable-area>
				<movable-view direction="vertical">text</movable-view>
			</movable-area>
			<view class="uni-title uni-common-mt">
				 5
				<text>\n</text>
			</view>
			<movable-area>
				<movable-view direction="all" out-of-bounds>text</movable-view>
			</movable-area>
			<view class="uni-title uni-common-mt">
				 6
				<text>\n</text>
			</view>
			<movable-area>
				<movable-view direction="all" inertia>text</movable-view>
			</movable-area>
			<view class="uni-title uni-common-mt">
				 7
				<text>\n</text>
			</view>
			<movable-area scale-area>
				<movable-view direction="all" @scale="onScale" scale scale-min="0.5" scale-max="4" :scale-value="scale">text</movable-view>
			</movable-area>
			<view @tap="tap2" class="uni-link uni-center uni-common-mt" style="padding-bottom:80rpx;">
				3
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				x: 0,
				y: 0,
				scale: 2,
				old: {
					x: 0,
					y: 0,
					scale: 2
				}
			}
		},
		methods: {
			tap: function(e) {
				// view
				this.x = this.old.x
				this.y = this.old.y
				this.$nextTick(function() {
					this.x = 30
					this.y = 30
				})
			},
			tap2() {
				// view
				this.scale = this.old.scale
				this.scale = this.old.scale
				this.$nextTick(function() {
					this.scale = 3
				})
			},
			onChange: function(e) {
				this.old.x = e.detail.x
				this.old.y = e.detail.y
			},
			onScale: function(e) {
				this.old.scale = e.detail.scale
			}
		}
	}
</script>

<style>
	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 150rpx;
		width: 150rpx;
		background-color: #007AFF;
		color: #fff;
	}

	movable-area {
		height: 300rpx;
		width: 100%;
		background-color: #D8D8D8;
		overflow: hidden;
	}

	.max {
		width:500rpx;
		height: 500rpx;
	}
</style>