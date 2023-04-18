<template>
	<view>
		<page-head title="view"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-hello-text">
				FlexFlexible Boxdisplay: flexviewflex-direction:
				rowcolumnuni-appflexflex
			</view>

			<view class="uni-title uni-common-mt">
				flex-direction: row
				<text>\n</text>
			</view>
			<view class="uni-flex uni-row">
				<view class="flex-item uni-bg-red">A</view>
				<view class="flex-item uni-bg-green">B</view>
				<view class="flex-item uni-bg-blue">C</view>
			</view>

			<view class="uni-title uni-common-mt">
				flex-direction: column
				<text>\n</text>
			</view>
			<view class="uni-flex uni-column">
				<view class="flex-item flex-item-V uni-bg-red">A</view>
				<view class="flex-item flex-item-V uni-bg-green">B</view>
				<view class="flex-item flex-item-V uni-bg-blue">C</view>
			</view>

			<view class="uni-title uni-common-mt">
				
				<text>\nflex</text>
			</view>
			<view>
				<view class="text">-</view>
				<view class="text" style="width: 300rpx;">-</view>
				<view class="uni-flex uni-row">
					<view class="text">-</view>
					<view class="text">-</view>
				</view>
				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<view class="text">-</view>
					<view class="text">-</view>
				</view>
				<view class="uni-flex uni-row" style="-webkit-justify-content: flex-end;justify-content: flex-end;">
					<view class="text">-</view>
					<view class="text">-</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="text" style="-webkit-flex: 1;flex: 1;">-</view>
					<view class="text" style="-webkit-flex: 1;flex: 1;">-</view>
				</view>
				<view class="uni-flex uni-row" style="-webkit-justify-content: space-between;justify-content: space-between;">
					<view class="text">-</view>
					<view class="text">-</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="text" style="width: 200rpx;"></view>
					<view class="text" style="-webkit-flex: 1;flex: 1;"></view>
				</view>
				<view class="uni-flex uni-row">
					<view class="text" style="width: 200rpx;"></view>
					<view class="text" style="-webkit-flex: 1;flex: 1;"></view>
					<view class="text" style="width: 200rpx;"></view>
				</view>
				<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
					<view class="text" style="width: 280rpx;">,wrap</view>
					<view class="text" style="width: 280rpx;">,wrap</view>
					<view class="text" style="width: 280rpx;">,wrap</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="text uni-flex" style="-webkit-flex: 1;flex: 1;height: 200rpx;-webkit-justify-content: center;justify-content: center;-webkit-align-items: flex-start;align-items: flex-start;">
						<text></text>
					</view>
					<view class="text uni-flex" style="-webkit-flex: 1;flex: 1;height: 200rpx;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
						<text></text>
					</view>
					<view class="text uni-flex" style="-webkit-flex: 1;flex: 1;height: 200rpx;-webkit-justify-content: center;justify-content: center;-webkit-align-items: flex-end;align-items: flex-end;">
						<text></text>
					</view>
				</view>
			</view>

			<view class="uni-title uni-common-mt">
				
				<text>\nflex</text>
			</view>
			<view class="uni-flex uni-row">
				<view class="text uni-flex" style="width: 200rpx;height: 220rpx;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
					<image src="../../../static/plus.png" style="width: 150rpx;height: 150rpx;"></image>
				</view>
				<view class="uni-flex uni-column" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: space-between;justify-content: space-between;">
					<view class="text" style="height: 120rpx;text-align: left;padding-left: 20rpx;padding-top: 10rpx;">
						
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="-webkit-flex: 1;flex: 1;"></view>
						<view class="text" style="-webkit-flex: 1;flex: 1;"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {}
		}
	}
</script>

<style>
	.flex-item {
		width: 33.3%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
	}

	.flex-item-V {
		width: 100%;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
	}

	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		background-color: #ebebeb;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}

	.desc {
		/* text-indent: 40rpx; */
	}
	.flex-pc {
		display: flex;
		justify-content: center;
	}
</style>
