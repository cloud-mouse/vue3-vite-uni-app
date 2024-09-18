<!--（手机号：1526  7 01     375  6，身份证尾号：1  9 19  35）-->
<template>
	<view
		class="wui-seg__tab"
		:class="{ 'wui-seg__disabled': disabled }"
		:style="{
			marginTop: marginTop + 'rpx',
			marginBottom: marginBottom + 'rpx'
		}"
	>
		<view
			class="wui-seg__item"
			v-for="(item, index) in vals"
			:key="index"
			:style="{
				borderTopLeftRadius: index === 0 ? radius + 'rpx' : '0',
				borderBottomLeftRadius: index === 0 ? radius + 'rpx' : '0',
				borderTopRightRadius: index === values.length - 1 ? radius + 'rpx' : '0',
				borderBottomRightRadius: index === values.length - 1 ? radius + 'rpx' : '0',
				borderColor: type === 'button' ? color : 'transparent',
				background: currentIndex === index && (type === 'button' || type === 'buttonRadius') ? activeBackground : 'transparent',
				height: height + 'rpx'
			}"
			:class="{
				'wui-seg__first': index === 0 && type === 'button',
				'wui-seg__first': index === 0 && type === 'button',
				'wui-seg__item-radius': currentIndex === index && type === 'buttonRadius',
				'wui-seg__item-bg': currentIndex === index && (type === 'button' || type === 'buttonRadius'),
				'wui-seg__item-border': !color && type === 'button',
				'wui-seg__item-border': type === 'button'
			}"
			@click="handleClick(index)"
		>
			<text class="wui-tabbar__badge wui-tabbar__badge-color" v-if="item.badge && type === 'buttonRadius'">{{ item.badge }}</text>
			<text
				:style="{
					fontSize: size + 'rpx',
					color: currentIndex === index ? activeColor : color,
					fontWeight: bold && currentIndex === index ? 600 : 400
				}"
				:class="{
					'wui-seg__disabled': item.disabled,
					'wui-seg__text-color': !color && currentIndex !== index
				}"
				>{{ item.name }}</text
			>
			<view
				class="wui-seg__item-line"
				v-if="currentIndex === index && type === 'text'"
				:style="{ background: activeColor }"
			></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-seg-tab',
	emits: ['click'],
	props: {
		values: {
			type: Array,
			default() {
				return [];
			}
		},
		current: {
			type: Number,
			default: 0
		},
		//button、text
		type: {
			type: String,
			default: 'button'
		},
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif

			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		activeColor: {
			type: String,
			default: '#fff'
		},
		activeBackground: {
			type: String,
			default: ''
		},
		bold: {
			type: Boolean,
			default: false
		},
		height: {
			type: [Number, String],
			default: 74
		},
		size: {
			type: [Number, String],
			default: 28
		},
		radius: {
			type: [Number, String],
			default: 8
		},
		disabled: {
			type: Boolean,
			default: false
		},
		marginTop: {
			type: [Number, String],
			default: 0
		},
		marginBottom: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			currentIndex: 0,
			vals: []
		};
	},
	watch: {
		current(val) {
			if (val !== this.currentIndex) {
				this.currentIndex = val;
			}
		},
		values(vals) {
			this.initData(vals);
		}
	},
	created() {
		this.currentIndex = this.current;
		this.initData(this.values);
	},
	methods: {
		initData(vals) {
			if (vals && vals.length > 0) {
				if (typeof vals[0] === 'object') {
					this.vals = vals;
				} else {
					//字符串
					this.vals = vals.map(item => {
						return {
							name: item
						};
					});
				}
			}
		},
		handleClick(index) {
			let vals = this.vals[index];
			if (this.currentIndex !== index && !this.disabled && !vals.disabled) {
				this.currentIndex = index;
				this.$emit('click', {
					index: index,
					...vals
				});
			}
		}
	}
};
</script>

<style scoped>
.wui-seg__tab {
	flex: 1;
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-seg__item {
	/* #ifndef APP-NVUE */
	display: inline-flex;
	box-sizing: border-box;
	transition: all 0.1s linear;
	/* #endif */
	flex: 1;
	justify-content: center;
	align-items: center;
	border-style: solid;
	border-top-width: 0;
	border-bottom-width: 0;
	border-right-width: 0;
	border-left-width: 0;
	position: relative;
}
.wui-seg__item-radius {
	border-radius: 100rpx !important;
}
.wui-seg__item-border {
	/* #ifdef APP-NVUE */
	border-top-width: 0.5px;
	border-bottom-width: 0.5px;
	border-right-width: 0.5px;
	/* #endif */

	/* #ifndef APP-NVUE */
	border-top-width: 1px;
	border-bottom-width: 1px;
	border-right-width: 1px;
	/* #endif */
}

.wui-tabbar__badge {
	position: absolute;
	height: 32rpx;
	padding: 0 8rpx;
	color: #ffffff;
	font-size: 24rpx;
	line-height: 32rpx;
	border-radius: 16rpx;
	/* #ifndef APP-NVUE */
	min-width: 32rpx !important;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	right: 0rpx;
	top: -10rpx;
	z-index: 10;
	text-align: center;
}
.wui-tabbar__badge-color {
	background: var(--wui-color-danger, #ff2b2b) !important;
}
.wui-seg__item-line {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 2px;
}

.wui-seg__disabled {
	opacity: 0.5;
	/* #ifdef H5 */
	cursor: not-allowed !important;
	/* #endif */
}

.wui-seg__first {
	border-left-style: solid;
	/* #ifndef APP-NVUE */
	border-left-width: 1px;
	/* #endif */

	/* #ifdef APP-NVUE */
	border-left-width: 0.5px;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-seg__item-bg {
	background: var(--wui-color-primary, #1396ff);
}

.wui-seg__item-border {
	border-color: var(--wui-color-primary, #1396ff);
}

.wui-seg__text-color {
	color: var(--wui-color-primary, #1396ff);
}

/* #endif */
</style>
