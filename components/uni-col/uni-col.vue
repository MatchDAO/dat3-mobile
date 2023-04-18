<template>
	<!-- #ifndef APP-NVUE -->
	<view :class="['uni-col', sizeClass, pointClassList]" :style="{
		paddingLeft:`${Number(gutter)}rpx`,
		paddingRight:`${Number(gutter)}rpx`,
	}">
		<slot></slot>
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<!-- nvuestyle -->
	<!-- right left  -->
	<view :class="['uni-col']" :style="{
		paddingLeft:`${Number(gutter)}rpx`,
		paddingRight:`${Number(gutter)}rpx`,
		width:`${nvueWidth}rpx`,
		position:'relative',
		marginLeft:`${marginLeft}rpx`,
		left:`${right === 0 ? left : -right}rpx`
	}">
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	/**
	 * uni-col	-
	 * @description	uni-row
	 * @tutorial	https://ext.dcloud.net.cn/plugin?id=
	 *
	 * @property	{span} type = Number 
	 * 						 24
	 * @property	{offset} type = Number 
	 * @property	{push} type = Number 
	 * @property	{pull} type = Number 
	 * @property	{xs} type = [Number, Object] <768px 
	 * 						@description	NumberObject{span: 4, offset: 4}
	 * @property	{sm} type = [Number, Object] 768px 
	 * 						@description	NumberObject{span: 4, offset: 4}
	 * @property	{md} type = [Number, Object] 992px 
	 * 						@description	NumberObject{span: 4, offset: 4}
	 * @property	{lg} type = [Number, Object] 1200px 
	 * 						@description	NumberObject{span: 4, offset: 4}
	 * @property	{xl} type = [Number, Object] 1920px 
	 * 						@description	NumberObject{span: 4, offset: 4}
	 */
	const ComponentClass = 'uni-col';

	// -1 Number0
	export default {
		name: 'uniCol',
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true // Vue
		},
		// #endif
		props: {
			span: {
				type: Number,
				default: 24
			},
			offset: {
				type: Number,
				default: -1
			},
			pull: {
				type: Number,
				default: -1
			},
			push: {
				type: Number,
				default: -1
			},
			xs: [Number, Object],
			sm: [Number, Object],
			md: [Number, Object],
			lg: [Number, Object],
			xl: [Number, Object]
		},
		data() {
			return {
				gutter: 0,
				sizeClass: '',
				parentWidth: 0,
				nvueWidth: 0,
				marginLeft: 0,
				right: 0,
				left: 0
			}
		},
		created() {
			// computed$parentundefined
			let parent = this.$parent;

			while (parent && parent.$options.componentName !== 'uniRow') {
				parent = parent.$parent;
			}

			this.updateGutter(parent.gutter)
			parent.$watch('gutter', (gutter) => {
				this.updateGutter(gutter)
			})

			// #ifdef APP-NVUE
			this.updateNvueWidth(parent.width)
			parent.$watch('width', (width) => {
				this.updateNvueWidth(width)
			})
			// #endif
		},
		computed: {
			sizeList() {
				let {
					span,
					offset,
					pull,
					push
				} = this;

				return {
					span,
					offset,
					pull,
					push
				}
			},
			// #ifndef APP-NVUE
			pointClassList() {
				let classList = [];

				['xs', 'sm', 'md', 'lg', 'xl'].forEach(point => {
					const props = this[point];
					if (typeof props === 'number') {
						classList.push(`${ComponentClass}-${point}-${props}`)
					} else if (typeof props === 'object' && props) {
						Object.keys(props).forEach(pointProp => {
							classList.push(
								pointProp === 'span' ?
								`${ComponentClass}-${point}-${props[pointProp]}` :
								`${ComponentClass}-${point}-${pointProp}-${props[pointProp]}`
							)
						})
					}
				});

				//  :class=[ ['a','b'] ]
				return classList.join(' ');
			}
			// #endif
		},
		methods: {
			updateGutter(parentGutter) {
				parentGutter = Number(parentGutter);
				if (!isNaN(parentGutter)) {
					this.gutter = parentGutter / 2
				}
			},
			// #ifdef APP-NVUE
			updateNvueWidth(width) {
				// nvuespanoffsetpullpush
				this.parentWidth = width;
				['span', 'offset', 'pull', 'push'].forEach(size => {
					const curSize = this[size];
					if ((curSize || curSize === 0) && curSize !== -1) {
						let RPX = 1 / 24 * curSize * width
						RPX = Number(RPX);
						switch (size) {
							case 'span':
								this.nvueWidth = RPX
								break;
							case 'offset':
								this.marginLeft = RPX
								break;
							case 'pull':
								this.right = RPX
								break;
							case 'push':
								this.left = RPX
								break;
						}
					}
				});
			}
			// #endif
		},
		watch: {
			sizeList: {
				immediate: true,
				handler(newVal) {
					// #ifndef APP-NVUE
					let classList = [];
					for (let size in newVal) {
						const curSize = newVal[size];
						if ((curSize || curSize === 0) && curSize !== -1) {
							classList.push(
								size === 'span' ?
								`${ComponentClass}-${curSize}` :
								`${ComponentClass}-${size}-${curSize}`
							)
						}
					}
					//  :class=[ ['a','b'] ]
					this.sizeClass = classList.join(' ');
					// #endif
					// #ifdef APP-NVUE
					this.updateNvueWidth(this.parentWidth);
					// #endif
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	/* breakpoints */
	$--sm: 768px !default;
	$--md: 992px !default;
	$--lg: 1200px !default;
	$--xl: 1920px !default;

	$breakpoints: ('xs' : (max-width: $--sm - 1),
	'sm' : (min-width: $--sm),
	'md' : (min-width: $--md),
	'lg' : (min-width: $--lg),
	'xl' : (min-width: $--xl));

	$layout-namespace: ".uni-";
	$col: $layout-namespace+"col";

	@function getSize($size) {
		@return 1 / 24 * $size * 100 * 1%;
	}

	@mixin res($key, $map:$breakpoints) {
		@if map-has-key($map, $key) {
			@media screen and #{inspect(map-get($map,$key))} {
				@content;
			}
		}

		@else {
			@warn "Undeinfed point: `#{$key}`";
		}
	}

	/* #ifndef APP-NVUE */
	#{$col} {
		float: left;
		box-sizing: border-box;
	}

	#{$col}-0 {
		/* #ifdef APP-NVUE */
		width: 0;
		height: 0;
		margin-top: 0;
		margin-right: 0;
		margin-bottom: 0;
		margin-left: 0;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: none;
		/* #endif */
	}

	@for $i from 0 through 24 {
		#{$col}-#{$i} {
			width: getSize($i);
		}

		#{$col}-offset-#{$i} {
			margin-left: getSize($i);
		}

		#{$col}-pull-#{$i} {
			position: relative;
			right: getSize($i);
		}

		#{$col}-push-#{$i} {
			position: relative;
			left: getSize($i);
		}
	}

	@each $point in map-keys($breakpoints) {
		@include res($point) {
			#{$col}-#{$point}-0 {
				display: none;
			}

			@for $i from 0 through 24 {
				#{$col}-#{$point}-#{$i} {
					width: getSize($i);
				}

				#{$col}-#{$point}-offset-#{$i} {
					margin-left: getSize($i);
				}

				#{$col}-#{$point}-pull-#{$i} {
					position: relative;
					right: getSize($i);
				}

				#{$col}-#{$point}-push-#{$i} {
					position: relative;
					left: getSize($i);
				}
			}
		}
	}

	/* #endif */
</style>
