<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-title uni-common-pl"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					
				</view>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
						<view class="uni-input">{{array[index].name}}</view>
					</picker>
				</view>
			</view>
		</view>

		<!-- #ifndef MP-ALIPAY -->
		<view class="uni-title uni-common-pl"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					
				</view>
				<view class="uni-list-cell-db">
					<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
						<view class="uni-input">{{multiArray[0][multiIndex[0]]}}{{multiArray[1][multiIndex[1]]}}{{multiArray[2][multiIndex[2]]}}</view>
					</picker>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<view class="uni-title uni-common-pl"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					
				</view>
				<view class="uni-list-cell-db">
					<picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
						<view class="uni-input">{{time}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="uni-picker-tips">
			 09:01 ~ 21:01 , 
		</view>

		<view class="uni-title uni-common-pl"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="uni-picker-tips">
			 ±10 , 
		</view>
	</view>
</template>
<script>

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 10;
		} else if (type === 'end') {
			year = year + 10;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}
	export default {
		data() {
			return {
				title: 'picker',
				array: [{name:''},{name: ''}, {name:''}, {name:''}],
				index: 0,
				multiArray: [
					['', ''],
					['', ''],
					['', '', '']
				],
				multiIndex: [0, 0, 0],
				date: getDate({
					format: true
				}),
				startDate:getDate('start'),
				endDate:getDate('end'),
				time: '12:01'
			}
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker' + e.detail.value)
				this.index = e.detail.value
			},
			bindMultiPickerColumnChange: function(e) {
				console.log('' + e.detail.column + '' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //1
						switch (this.multiIndex[0]) {
							case 0:
								this.multiArray[1] = ['', '']
								this.multiArray[2] = ['', '', '']
								break
							case 1:
								this.multiArray[1] = ['', '']
								this.multiArray[2] = ['', '']
								break
						}
						this.multiIndex.splice(1, 1, 0)
						this.multiIndex.splice(2, 1, 0)
						break
					case 1: //2
						switch (this.multiIndex[0]) { //
							case 0:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['', '', '']
										break
									case 1:
										this.multiArray[2] = ['','']
										break
								}
								break
							case 1:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['', '']
										break
									case 1:
										this.multiArray[2] = ['', '']
										break
								}
								break
						}
						this.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
			},
			bindDateChange: function(e) {
				this.date = e.detail.value
			},
			bindTimeChange: function(e) {
				this.time = e.detail.value
			}

		}
	}
</script>

<style>
.uni-picker-tips {
	font-size: 12px;
	color: #666;
	margin-bottom: 15px;
	padding: 0 15px;
	/* text-align: right; */
}
</style>
