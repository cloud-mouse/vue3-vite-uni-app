<!--（手机号：1 5 267 0   1  37 5 6，身份证尾号： 1  9  1935）-->
<template>
	<scroll-view
		class="wui-tabs__scrollbox"
		:class="{
			'wui-tabs__fixed': isFixed && !isSticky,
			'wui-tabs__sticky': isSticky
		}"
		scroll-with-animation
		:scroll-x="scroll"
		:show-scrollbar="false"
		:scroll-into-view="scrollInto"
		:style="{
			background: background,
			zIndex: isFixed || isSticky ? zIndex : 1,
			top: isFixed || isSticky ? top + 'px' : 'auto'
		}"
	>
		<view class="wui-scroll__view" :class="{ 'wui-tabs__full': !alignLeft }">
			<view
				v-for="(tab, index) in vals"
				:key="index"
				class="wui-tabs__item"
				:class="{ 'wui-tabs__full': !alignLeft }"
				:id="tab.wui_s_id"
				@tap="switchTab(index)"
			>
				<view
					class="wui-tabs__text-wrap"
					:class="{
						'wui-tabs__wrap-disabled': tab.disabled,
						'wui-tabs__item-column': direction === 'column' && tab.icon
					}"
					:style="{ height: height + 'rpx' }"
				>
					<view
						class="wui-tabs__line-wrap"
						:class="{ 'wui-tabs__line-center': center }"
						:style="{
							bottom: bottom + 'rpx',
							left: `-${padding}rpx`,
							right: `-${padding}rpx`
						}"
						v-if="isSlider"
					>
						<view
							class="wui-tabs__ac-line"
							:class="{
								'wui-tabs__line-short': short,
								'wui-tabs__full': !short,
								'wui-tabs__slider-color': !sliderBackground
							}"
							:style="{
								height: sliderHeight + 'rpx',
								background: sliderBackground,
								borderRadius: sliderRadius == -1 ? sliderHeight + 'rpx' : sliderRadius + 'rpx',
								transform: `scale(${tabIndex === index ? (isNvue ? 1 : scale) : isNvue ? 0.00001 : 0})`
							}"
						>
						</view>
					</view>
					<image
						class="wui-tabs__icon"
						:class="{ 'wui-tabs__icon-column': direction === 'column' }"
						:src="tabIndex === index && tab.selectedIcon ? tab.selectedIcon : tab.icon"
						v-if="tab.icon"
					>
					</image>
					<!-- #ifdef APP-NVUE -->
					<view class="wui-tabs__text">
						<text
							class="wui-tabs__text-nvue"
							:class="{
								'wui-tabs__selected-color': !selectedColor && tabIndex === index,
								'wui-tabs__text-color': !color && tabIndex !== index
							}"
							:style="{
								fontSize: (tabIndex === index && isNvue ? selectedSize : size) + 'rpx',
								color: tabIndex === index ? selectedColor : color,
								background: tabIndex === index ? selectedBackground : color,
								borderRadius: tabIndex === index ? selectedRadius : 0,
								padding: tabItemPadding,
								fontWeight: tabIndex === index ? selectedFontWeight : fontWeight,
								height: height + 'rpx',
								lineHeight: height + 'rpx'
							}"
							>{{ tab.name }}</text
						>
						<text
							:class="{
								'wui-tabs__badge-color': !badgeBackground,
								'wui-tabs__badge-dot': isDot,
								'wui-tabs__badge': !isDot
							}"
							:style="{ color: badgeColor, background: badgeBackground }"
							v-if="tab.badge"
							>{{ isDot ? '' : tab.badge }}</text
						>
					</view>

					<!-- #endif -->
					<!-- #ifndef APP-NVUE -->
					<!--vue3中text嵌套text使用v-if会显示v-if文本-->
					<view
						class="wui-tabs__text"
						:class="{
							'wui-tabs__selected-color': !selectedColor && tabIndex === index,
							'wui-tabs__text-color': !color && tabIndex !== index
						}"
						:style="{
							fontSize: (tabIndex === index && isNvue ? selectedSize : size) + 'rpx',
							color: tabIndex === index ? selectedColor : color,
							background: tabIndex === index ? selectedBackground : '',
							borderRadius: tabIndex === index ? selectedRadius : 0,
							fontWeight: tabIndex === index ? selectedFontWeight : fontWeight,
							padding: tabItemPadding,
							transform: `scale(${tabIndex === index && !isNvue ? scale : 1})`
						}"
					>
						{{ tab.name
						}}<text
							:class="{
								'wui-tabs__badge-color': !badgeBackground,
								'wui-tabs__badge-dot': isDot,
								'wui-tabs__badge': !isDot
							}"
							:style="{ color: badgeColor, background: badgeBackground }"
							v-if="tab.badge"
							>{{ isDot ? '' : tab.badge }}</text
						>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
export default {
	name: 'wui-tabs',
	emits: ['change'],
	// #ifdef MP-WEIXIN
	options: {
		virtualHost: true
	},
	// #endif
	props: {
		// 标签页数据源
		tabs: {
			type: Array,
			default() {
				return [];
			}
		},
		// 当前选项卡
		current: {
			type: Number,
			default: 0
		},
		// 间距
		tabItemPadding: {
			type: String,
			default: '0'
		},
		// 是否可以滚动
		scroll: {
			type: Boolean,
			default: false
		},
		// tab高度 rpx
		height: {
			type: [Number, String],
			default: 96
		},
		background: {
			type: String,
			default: '#fff'
		},
		//字体大小
		size: {
			type: [Number, String],
			default: 28
		},
		//字体颜色
		// #ifdef APP-NVUE
		color: {
			type: String,
			default: '#7F7F7F'
		},
		// #endif
		// #ifndef APP-NVUE
		color: {
			type: String,
			default: ''
		},
		// #endif
		//选中前字重
		fontWeight: {
			type: [Number, String],
			default: 'normal'
		},
		//仅Nvue端生效，代替scale属性
		selectedSize: {
			type: [Number, String],
			default: 32
		},
		//选中后背景颜
		// #ifdef APP-NVUE
		selectedBackground: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		selectedBackground: {
			type: String,
			default: ''
		},
		// #endif
		//选中后 radius
		selectedRadius: {
			type: [Number, String],
			default: -1
		},
		//选中后字体颜色
		// #ifdef APP-NVUE
		selectedColor: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		selectedColor: {
			type: String,
			default: ''
		},
		// #endif
		//选中后字重
		selectedFontWeight: {
			type: [Number, String],
			default: 500
		},
		//选中后字体缩放倍数
		//Nvue端 Android 暂不支持设置overflow:visible，放大后文字超出部分被隐藏
		scale: {
			type: [Number, String],
			default: 1.1
		},
		badgeColor: {
			type: String,
			default: '#fff'
		},
		// #ifdef APP-NVUE
		badgeBackground: {
			type: String,
			default: '#FF2B2B'
		},
		// #endif
		// #ifndef APP-NVUE
		badgeBackground: {
			type: String,
			default: ''
		},
		// #endif
		isDot: {
			type: Boolean,
			default: false
		},
		isSlider: {
			type: Boolean,
			default: true
		},
		//滑块高度
		sliderHeight: {
			type: [Number, String],
			default: 5
		},
		//滑块背景颜
		// #ifdef APP-NVUE
		sliderBackground: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		sliderBackground: {
			type: String,
			default: ''
		},
		// #endif
		//滑块 radius
		sliderRadius: {
			type: [Number, String],
			default: -1
		},
		//滑块左右padding值
		padding: {
			type: [Number, String],
			default: 0
		},
		//滑块bottom
		bottom: {
			type: [Number, String],
			default: 0
		},
		//滑块是否固定为较短的长度45rpx
		short: {
			type: Boolean,
			default: true
		},
		//滑块是否居中显示
		center: {
			type: Boolean,
			default: false
		},
		//是否固定
		isFixed: {
			type: Boolean,
			default: false
		},
		//吸顶效果，为true时isFixed失效
		isSticky: {
			type: Boolean,
			default: false
		},
		//isFixed或isSticky为true时，tabs top值 px
		// #ifndef H5
		top: {
			type: [Number, String],
			default: 0
		},
		// #endif
		// #ifdef H5
		top: {
			type: [Number, String],
			default: 44
		},
		// #endif
		//当数据不满一屏时，item项是否靠左对齐，默认均分铺满
		alignLeft: {
			type: Boolean,
			default: false
		},
		//tabs item项排列方式：row、column
		direction: {
			type: String,
			default: 'row'
		},
		zIndex: {
			type: [Number, String],
			default: 996
		}
	},
	watch: {
		tabs(vals) {
			this.initData(vals);
		},
		current(newVal, oldVal) {
			this.switchTab(newVal);
		}
	},
	created() {
		this.initData(this.tabs);
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			vals: [],
			scrollInto: '',
			tabIndex: 0,
			isNvue: isNvue
		};
	},
	methods: {
		getId() {
			return `wui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		},
		initData(vals) {
			if (vals && vals.length > 0) {
				if (typeof vals[0] === 'object') {
					vals.map(item => {
						const scrollId = this.getId();
						item.wui_s_id = scrollId;
					});
				} else {
					//字符串
					vals = vals.map(item => {
						const scrollId = this.getId();
						return {
							name: item,
							wui_s_id: scrollId
						};
					});
				}
				this.vals = vals;
				this.$nextTick(() => {
					setTimeout(() => {
						this.switchTab(this.current);
					}, 50);
				});
			}
		},
		switchTab(index) {
			const item = {
				...this.vals[index]
			};
			if (this.tabIndex === index || item.disabled) return;
			this.tabIndex = index;
			let scrollIndex = index - 1 < 0 ? 0 : index - 1;
			this.scrollInto = this.vals[scrollIndex].wui_s_id;
			delete item.wui_s_id;
			this.$emit('change', {
				index: index,
				...item
			});
		}
	}
};
</script>

<style scoped>
/* #ifndef APP-NVUE */
::-webkit-scrollbar {
	width: 0 !important;
	height: 0 !important;
	color: transparent !important;
	display: none;
}

/* #endif */
.wui-tabs__scrollbox {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	flex: 1;
	flex-direction: row;
	overflow: hidden;
}

.wui-tabs__fixed {
	position: fixed;
	left: 0;
	right: 0;
}

.wui-tabs__sticky {
	position: sticky;
	left: 0;
	right: 0;
}

.wui-scroll__view {
	/* #ifndef APP-NVUE */
	min-width: 100%;
	white-space: nowrap;
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
}

.wui-tabs__item {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding-left: 10rpx;
	padding-right: 10rpx;
	position: relative;
}

.wui-tabs__full {
	flex: 1;
}

.wui-tabs__text-wrap {
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	z-index: 3;
}

.wui-tabs__wrap-disabled {
	/* #ifdef H5 */
	cursor: not-allowed;
	/* #endif */
	opacity: 0.5;
}

.wui-tabs__icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 12rpx;
}

.wui-tabs__item-column {
	flex-direction: column !important;
}

.wui-tabs__icon-column {
	margin-right: 0 !important;
	margin-bottom: 8rpx;
}

.wui-tabs__text {
	min-width: 150rpx;
	text-align: center;
	/* #ifndef APP-NVUE */
	white-space: nowrap;
	display: block;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex-wrap: nowrap;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	/* #endif */
	transition: transform 0.2s linear;
	position: relative;
	z-index: 3;
}

/* #ifdef APP-NVUE */
.wui-tabs__text-nvue {
	text-align: center;
}

/* #endif */

.wui-tabs__badge {
	height: 36rpx;
	padding: 0 12rpx;
	color: #ffffff;
	font-size: 24rpx;
	line-height: 36rpx;
	border-radius: 100px;
	/* #ifndef APP-NVUE */
	min-width: 36rpx !important;
	display: flex;
	box-sizing: border-box;
	position: absolute;
	right: -32rpx;
	top: -18rpx;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	transform: scale(0.9);
	z-index: 10;
}

.wui-tabs__badge-dot {
	height: 8px !important;
	width: 8px !important;
	/* #ifdef APP-NVUE */
	border-radius: 100px;
	/* #endif */

	/* #ifndef APP-NVUE */
	display: inline-block;
	position: absolute;
	right: -6px;
	top: -3px;
	border-radius: 50%;
	/* #endif */
	z-index: 10;
}

.wui-tabs__line-wrap {
	position: absolute;
	border-radius: 2px;
	z-index: 2;
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

.wui-tabs__line-center {
	justify-content: center;
	left: 0;
}

.wui-tabs__ac-line {
	transition: transform 0.2s linear;
}

.wui-tabs__line-short {
	width: 45rpx !important;
}

/* #ifndef APP-NVUE */
.wui-tabs__selected-color {
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-tabs__text-color {
	color: var(--wui-color-subtitle, #7f7f7f) !important;
}

.wui-tabs__slider-color {
	background: var(--wui-color-primary, #1396ff) !important;
}

.wui-tabs__badge-color {
	background: var(--wui-color-danger, #ff2b2b) !important;
}

/* #endif */
</style>
