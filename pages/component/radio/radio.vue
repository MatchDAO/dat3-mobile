<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap">
			<view class="uni-title"></view>
			<view>
				<label class="radio" style="margin-right: 30rpx;">
					<radio value="r1" checked="true" />
				</label>
				<label class="radio">
					<radio value="r2" />
				</label>
			</view>
		</view>
		<view class="uni-padding-wrap">
			<view class="uni-title">radio</view>
			<view>
				<label class="radio" style="margin-right: 30rpx;">
					<radio value="r1" checked="true" color="#FFCC33" style="transform:scale(0.7)"/>
				</label>
				<label class="radio">
					<radio value="r2" color="#FFCC33" style="transform:scale(0.7)"/>
				</label>
			</view>
		</view>
		<view class="uni-title uni-common-mt uni-common-pl"></view>
		<view class="uni-list">
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view>
						<radio :value="item.value" :checked="index === current" />
					</view>
					<view>{{item.name}}</view>
				</label>
			</radio-group>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'radio ',
				items: [{
						value: 'USA',
						name: ''
					},
					{
						value: 'CHN',
						name: '',
						checked: 'true'
					},
					{
						value: 'BRA',
						name: ''
					},
					{
						value: 'JPN',
						name: ''
					},
					{
						value: 'ENG',
						name: ''
					},
					{
						value: 'FRA',
						name: ''
					},
				],
				current: 0
			}
		},
		methods: {
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.detail.value) {
						this.current = i;
						break;
					}
				}
			}
		}
	}
</script>

<style>
	.uni-list-cell {
		justify-content: flex-start
	}
</style>
