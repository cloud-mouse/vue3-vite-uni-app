<!--（手机号： 1 526  7  0  1 37 56，身份证尾号： 1  9 1 935）-->
<template>
	<view class="wui-tabbar__wrap" :class="{ 'wui-tabbar__fixed': isFixed }" :style="{ background: background, zIndex: zIndex }">
		<view
			class="wui-tabbar__inner"
			:class="{ 'wui-tababr__border': isBorder }"
			:style="{
				borderTopColor: isBorder && isNvue ? borderColor : 'transparent'
			}"
		>
			<view class="wui-tabbar__item" v-for="(item, index) in tabs" :key="index" @tap="itemClick(index)">
				<view
					class="wui-tabbar__icon-wrap"
					:style="{
						width:
							(isNvue && item.midButton && item.width
								? item.width
								: item.onlyIcon && current == index && index == item.index
								? item.width
								: 56) + 'rpx',
						height:
							(isNvue && item.midButton && item.height
								? item.height
								: item.onlyIcon && current == index && index == item.index
								? item.height
								: 56) + 'rpx'
					}"
					v-if="item.iconPath"
				>
					<image
						class="wui-tabbar__icon"
						:style="{
							width: ((item.onlyIcon && current == index && index == item.index && item.width) || 56) + 'rpx',
							height: ((item.onlyIcon && current == index && index == item.index && item.height) || 56) + 'rpx'
						}"
						:src="current == index ? item.selectedIconPath : item.iconPath"
						v-if="!item.midButton"
					></image>
					<!-- #ifdef APP-NVUE -->
					<image
						v-if="item.midButton"
						class="wui-tabbar__icon"
						:src="item.iconPath"
						:style="{
							width: (item.width || 56) + 'rpx',
							height: (item.height || 56) + 'rpx'
						}"
					>
					</image>
					<!-- #endif -->
					<text
						:class="[item.dot ? 'wui-tabbar__dot' : 'wui-tabbar__badge', badgeBackground ? '' : 'wui-tabbar__badge-color']"
						:style="{
							background: badgeBackground,
							color: badgeColor,
							width: getWidth(item.badge, item.dot)
						}"
						v-if="item.badge"
						>{{ item.dot ? '' : item.badge }}</text
					>
				</view>
				<text
					class="wui-tabbar__text"
					:class="{
						'wui-tabbar__selected-color': !selectedColor && current == index
					}"
					:style="{
						fontSize: size + 'rpx',
						fontWeight: fontWeight,
						color: current == index ? selectedColor : item.midButton ? item.color || color : color
					}"
					v-if="item.text && !item.onlyIcon && index != item.index"
					>{{ item.text }}</text
				>
				<text
					class="wui-tabbar__text"
					:class="{
						'wui-tabbar__selected-color': !selectedColor && current == index
					}"
					:style="{
						fontSize: size + 'rpx',
						fontWeight: fontWeight,
						color: current == index ? selectedColor : item.midButton ? item.color || color : color
					}"
					v-if="item.text && item.onlyIcon && current != index && index == item.index"
					>{{ item.text }}</text
				>
				<!-- #ifndef APP-NVUE -->
				<image
					v-if="item.midButton"
					class="wui-tabbar__mid-button"
					:class="{ 'wui-tabbar__mid-center': item.center }"
					:src="item.iconPath"
					:style="{
						width: (item.width || 56) + 'rpx',
						height: (item.height || 56) + 'rpx',
						bottom: item.bottom + 'rpx'
					}"
				>
				</image>
				<!-- #endif -->
			</view>
		</view>
		<view
			class="wui-tabbar__safe-area"
			:class="{ 'wui-tabbar__safe-weex': safeAreaH > 0 }"
			v-if="(safeAreaH > 0 || !isNvue) && isFixed"
		></view>
	</view>
</template>

<script>
export default {
	name: 'wui-tabbar',
	emits: ['init', 'click'],
	props: {
		tabBar: {
			type: Array,
			default() {
				return [];
			}
		},
		//当前索引
		current: {
			type: [Number, String],
			default: 0
		},
		size: {
			type: [Number, String],
			default: 24
		},
		fontWeight: {
			type: [Number, String],
			default: 400
		},
		//字体颜色
		color: {
			type: String,
			default: '#333333'
		},
		//字体选中颜色
		selectedColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//背景颜色
		background: {
			type: String,
			default: '#FFFFFF'
		},
		isBorder: {
			type: Boolean,
			default: true
		},
		borderColor: {
			type: String,
			default: '#EEEEEE'
		},
		//固定在底部
		isFixed: {
			type: Boolean,
			default: true
		},
		//角标字体颜色
		badgeColor: {
			type: String,
			default: '#FFFFFF'
		},
		//角标背景颜色
		badgeBackground: {
			type: String,
			// #ifdef APP-NVUE
			default: '#FF2B2B',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//z-index
		zIndex: {
			type: [Number, String],
			default: 980
		},
		//是否适配底部安全区
		safeArea: {
			type: Boolean,
			default: true
		},
		// 是否隐藏原生tabbar
		hideTabBar: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		tabBar(vals) {
			this.initData(vals);
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			tabs: [],
			safeAreaH: 0,
			isNvue: isNvue
		};
	},
	created() {
		// 是否隐藏原生tabbar
		if (this.hideTabBar) {
			uni.hideTabBar({
				success: () => {},
				fail: () => {}
			});
		}
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.safeAreaH = this.isPhoneX() ? 34 : 0;
		// #endif
		//非nvue端在iphonex等异形屏高度需自行处理底部安全区域
		this.$emit('init', {
			height: uni.upx2px(100) + this.safeAreaH
		});
		this.initData(this.tabBar);
	},
	methods: {
		initData(vals) {
			if (vals && vals.length > 0) {
				if (typeof vals[0] === 'string') {
					vals = vals.map(item => {
						return {
							text: item
						};
					});
				}
				this.tabs = vals;
			}
		},
		// #ifdef APP-NVUE || MP-TOUTIAO
		isPhoneX() {
			if (!this.safeArea) return false;
			//34px
			const res = uni.getSystemInfoSync();
			let iphonex = false;
			let models = [
				'iphonex',
				'iphonexr',
				'iphonexsmax',
				'iphone11',
				'iphone11pro',
				'iphone11promax',
				'iphone12',
				'iphone12mini',
				'iphone12pro',
				'iphone12promax',
				'iphone13',
				'iphone13mini',
				'iphone13pro',
				'iphone13promax',
				'iphone14',
				'iphone14mini',
				'iphone14pro',
				'iphone14promax'
			];
			const model = res.model.replace(/\s/g, '').toLowerCase();
			const newModel = model.split('<')[0];
			if (models.includes(model) || models.includes(newModel) || (res.safeAreaInsets && res.safeAreaInsets.bottom > 0)) {
				iphonex = true;
			}
			return iphonex;
		},
		// #endif
		getWidth(value, dot) {
			return dot ? '16rpx' : String(value).length * 12 + 20 + 'rpx';
		},
		itemClick(index) {
			this.$emit('click', {
				index: index,
				...this.tabs[index]
			});
		}
	}
};
</script>

<style scoped>
.wui-tabbar__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
}

.wui-tabbar__fixed {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}

.wui-tabbar__inner {
	position: relative;
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	height: 100rpx;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
}

.wui-tababr__border {
	/* #ifdef APP-NVUE */
	border-top-width: 0.5px;
	border-top-style: solid;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-tababr__border::before {
	content: ' ';
	border-top: 1px solid var(--wui-color-border, #eeeeee);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	transform: scaleY(0.5) translateZ(0);
	transform-origin: 0 0;
	display: block;
	z-index: 3;
}

/* #endif */

.wui-tabbar__item {
	flex: 1;
	height: 100rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	position: relative;
}

.wui-tabbar__icon-wrap {
	width: 56rpx;
	height: 56rpx;
	position: relative;
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
	right: -20rpx;
	top: 0;
	z-index: 10;
	text-align: center;
}

.wui-tabbar__dot {
	position: absolute;
	height: 16rpx;
	width: 16rpx;
	/* #ifndef APP-NVUE */
	border-radius: 50%;
	/* #endif */

	/* #ifdef APP-NVUE */
	border-radius: 8rpx;
	/* #endif */
	right: -4rpx;
	top: -4rpx;
}

.wui-tabbar__icon {
	width: 56rpx;
	height: 56rpx;
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-tabbar__mid-button {
	position: absolute;
	z-index: 4;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.wui-tabbar__mid-center {
	top: 50% !important;
	transform: translate(-50%, -50%) !important;
}

/* #endif */

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-tabbar__safe-weex {
	padding-bottom: 34px;
}

/* #endif */
.wui-tabbar__safe-area {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */

	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
	flex: 1;
	flex-direction: row;
	background-color: transparent;
}

/* #ifndef APP-NVUE */
.wui-tabbar__selected-color {
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-tabbar__badge-color {
	background: var(--wui-color-danger, #ff2b2b) !important;
}

/* #endif */
</style>
