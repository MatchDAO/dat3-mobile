<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-title uni-common-mt"></view>
			<view>
				<checkbox-group>
					<label>
						<checkbox value="cb" checked="true" />
					</label>
					<label>
						<checkbox value="cb" />
					</label>
				</checkbox-group>
			</view>
			<view class="uni-title uni-common-mt">checkbox</view>
			<view>
				<checkbox-group>
					<label>
						<checkbox value="cb" checked="true" color="#FFCC33" style="transform:scale(0.7)" />
					</label>
					<label>
						<checkbox value="cb" color="#FFCC33" style="transform:scale(0.7)" />
					</label>
				</checkbox-group>
			</view>
		</view>
		
		<view class="uni-padding-wrap">
			<view class="uni-title uni-common-mt">
				
				<text>\n uni-list </text>
			</view>
		</view>
		<view class="uni-list">
			<checkbox-group @change="checkboxChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="item in items" :key="item.value">
					<view>
						<checkbox :value="item.value" :checked="item.checked" />
					</view>
					<view>{{item.name}}</view>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'checkbox ',
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
					}
				]
			}
		},
		methods: {
			checkboxChange: function (e) {
				var items = this.items,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.indexOf(item.value) >= 0){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
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
