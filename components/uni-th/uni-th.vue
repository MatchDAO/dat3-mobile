<template>
	<!-- #ifdef H5 -->
	<th :rowspan="rowspan" :colspan="colspan" class="uni-table-th" :class="{ 'table--border': border }" :style="{ width: width + 'px', 'text-align': align }">
		<view class="uni-table-th-content" :style="{ 'justify-content': contentAlign }" @click="sort">
			<slot></slot>
			<view v-if="sortable" class="arrow-box">
				<text class="arrow up" :class="{ active: ascending }" @click.stop="ascendingFn"></text>
				<text class="arrow down" :class="{ active: descending }" @click.stop="descendingFn"></text>
			</view>
		</view>
	</th>
	<!-- #endif -->
	<!-- #ifndef H5 -->
	<view class="uni-table-th" :class="{ 'table--border': border }" :style="{ width: width + 'px', 'text-align': align }"><slot></slot></view>
	<!-- #endif -->
</template>

<script>
/**
 * Th 
 * @description 
 * @tutorial https://ext.dcloud.net.cn/plugin?id=
 * @property {Number} 	width 						
 * @property {Boolean} 	sortable 					
 * @property {Number} 	align = [left|center|right]	
 * @value left   	
 * @value center	
 * @value right		
 * @event {Function} sort-change  
 */

export default {
	name: 'uniTh',
	options: {
		virtualHost: true
	},
	props: {
		width: {
			type: [String, Number],
			default: ''
		},
		align: {
			type: String,
			default: 'left'
		},
		rowspan: {
			type: [Number, String],
			default: 1
		},
		colspan: {
			type: [Number, String],
			default: 1
		},
		sortable: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			border: false,
			ascending: false,
			descending: false
		}
	},
	computed: {
		contentAlign() {
			let align = 'left'
			switch (this.align) {
				case 'left':
					align = 'flex-start'
					break
				case 'center':
					align = 'center'
					break
				case 'right':
					align = 'flex-end'
					break
			}
			return align
		}
	},
	created() {
		this.root = this.getTable('uniTable')
		this.rootTr = this.getTable('uniTr')
		this.rootTr.minWidthUpdate(this.width ? this.width : 140)
		this.border = this.root.border
		this.root.thChildren.push(this)
	},
	methods: {
		sort() {
			if (!this.sortable) return
			this.clearOther()
			if (!this.ascending && !this.descending) {
				this.ascending = true
				this.$emit('sort-change', { order: 'ascending' })
				return
			}
			if (this.ascending && !this.descending) {
				this.ascending = false
				this.descending = true
				this.$emit('sort-change', { order: 'descending' })
				return
			}

			if (!this.ascending && this.descending) {
				this.ascending = false
				this.descending = false
				this.$emit('sort-change', { order: null })
			}
		},
		ascendingFn() {
			this.clearOther()
			this.ascending = !this.ascending
			this.descending = false
			this.$emit('sort-change', { order: this.ascending ? 'ascending' : null })
		},
		descendingFn() {
			this.clearOther()
			this.descending = !this.descending
			this.ascending = false
			this.$emit('sort-change', { order: this.descending ? 'descending' : null })
		},
		clearOther() {
			this.root.thChildren.map(item => {
				if (item !== this) {
					item.ascending = false
					item.descending = false
				}
				return item
			})
		},
		/**
		 * 
		 */
		getTable(name) {
			let parent = this.$parent
			let parentName = parent.$options.name
			while (parentName !== name) {
				parent = parent.$parent
				if (!parent) return false
				parentName = parent.$options.name
			}
			return parent
		}
	}
}
</script>

<style lang="scss">
$border-color: #ebeef5;

.uni-table-th {
	padding: 12px 10px;
	/* #ifndef APP-NVUE */
	display: table-cell;
	box-sizing: border-box;
	/* #endif */
	font-size: 14px;
	font-weight: bold;
	color: #909399;
	border-bottom: 1px $border-color solid;
}

.table--border {
	border-right: 1px $border-color solid;
}
.uni-table-th-content {
	display: flex;
	align-items: center;
}
.arrow-box {
}
.arrow {
	display: block;
	position: relative;
	width: 10px;
	height: 8px;
	// border: 1px red solid;
	left: 5px;
	overflow: hidden;
	cursor: pointer;
}
.down {
	top: 3px;
	::after {
		content: '';
		width: 8px;
		height: 8px;
		position: absolute;
		left: 2px;
		top: -5px;
		transform: rotate(45deg);
		background-color: #ccc;
	}
	&.active {
		::after {
			background-color: #007aff;
		}
	}
}
.up {
	::after {
		content: '';
		width: 8px;
		height: 8px;
		position: absolute;
		left: 2px;
		top: 5px;
		transform: rotate(45deg);
		background-color: #ccc;
	}
	&.active {
		::after {
			background-color: #007aff;
		}
	}
}
</style>
