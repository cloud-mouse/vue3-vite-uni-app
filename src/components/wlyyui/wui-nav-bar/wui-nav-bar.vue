<!--（手机号：1   5  26  701  37 56，身份证尾号： 19 1   935）-->
<template>
	<view
		class="wui-nav__bar"
		:class="{
			'wui-nav__bar-line': splitLine,
			'wui-nva__bar-bg': !background,
			'wui-nav__bar-fixed': isFixed
		}"
		:style="{
			background: background,
			'border-bottom-color': lineColor,
			paddingLeft: padding + 'px',
			paddingRight: padding + 'px',
			zIndex: zIndex
		}"
	>
		<view class="wui-nav__status-bar" :style="{ height: statusBarHeight + 'px' }" v-if="statusBar"></view>
		<view class="wui-nav__header" v-if="!custom">
			<view class="wui-nav__left" @tap="leftClick">
				<slot></slot>
			</view>
			<view class="wui-nav__title" v-if="title" @tap="titleClick">
				<text
					class="wui-nav__title-text"
					:style="{
						fontSize: size + 'px',
						color: color,
						fontWeight: fontWeight
					}"
					>{{ title }}</text
				>
			</view>
			<view class="wui-nav__right" @tap="rightClick">
				<slot name="right"></slot>
			</view>
		</view>
		<view class="wui-nav__header" v-if="custom">
			<slot></slot>
		</view>
	</view>
</template>

<script>
let sys = uni.getSystemInfoSync();
export default {
	name: 'wui-nav-bar',
	emits: ['init', 'leftClick', 'rightClick', 'titleClick'],
	props: {
		//navbar左右padding值，单位px
		padding: {
			type: [Number, String],
			default: 8
		},
		//标题
		title: {
			type: String,
			default: ''
		},
		//标题字体大小，单位px
		size: {
			type: [Number, String],
			// #ifdef H5
			default: 16,
			// #endif
			// #ifndef H5
			default: 17
			// #endif
		},
		//标题颜色
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#181818',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		fontWeight: {
			type: [Number, String],
			default: 500
		},
		//背景颜色
		background: {
			type: String,
			// #ifdef APP-NVUE
			default: '#fff',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//是否需要底部分割线
		splitLine: {
			type: Boolean,
			default: false
		},
		//分割线颜色，仅Nvue生效
		lineColor: {
			type: String,
			default: '#eee'
		},
		//是否包含状态栏
		statusBar: {
			type: Boolean,
			default: true
		},
		//是否固定在顶部
		isFixed: {
			type: Boolean,
			default: false
		},
		//z-index
		zIndex: {
			type: [Number, String],
			default: 996
		},
		//自定义navbar内容，title、右插槽失效
		custom: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			statusBarHeight: sys.statusBarHeight
		};
	},
	created() {
		let obj = {};
		// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
		obj = uni.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-ALIPAY
		my.hideAddToDesktopMenu();
		// #endif
		this.$emit('init', {
			windowWidth: sys.windowWidth,
			//不包含状态栏高度固定为：44px
			height: 44,
			statusBarHeight: this.statusBarHeight,
			//小程序右上角悬浮按钮左边界坐标，单位：px
			left: obj.left || -1,
			//小程序右上角悬浮按钮宽度，单位：px
			btnWidth: obj.width || 0,
			//小程序右上角悬浮按钮高度，单位：px
			btnHeight: obj.height || 0
		});
	},
	methods: {
		leftClick() {
			this.$emit('leftClick');
		},
		rightClick() {
			this.$emit('rightClick');
		},
		titleClick() {
			this.$emit('titleClick');
		}
	}
};
</script>

<style scoped>
.wui-nav__status-bar {
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
}

.wui-nav__header {
	flex: 1;
	height: 44px;
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
}

.wui-nav__bar {
	flex: 1;
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-nva__bar-bg {
	background: var(--wui-bg-color, #fff) !important;
}

/* #endif */
.wui-nav__bar-line {
	position: relative;
	/* #ifdef APP-NVUE */
	border-bottom: 0.5px;
	border-bottom-style: solid;
	/* #endif */
	/* #ifndef APP-NVUE */
	border-bottom: 0;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-nav__bar-line::after {
	content: '';
	position: absolute;
	border-bottom: 1px solid var(--wui-color-border, #eeeeee) !important;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 100%;
	bottom: 0;
	right: 0;
	left: 0;
}

/* #endif */
.wui-nav__left {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	width: 150rpx;
	justify-content: flex-start;
	align-items: center;
}

.wui-nav__right {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	width: 150rpx;
	justify-content: flex-end;
	align-items: center;
}

.wui-nav__title {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	padding: 0 30rpx;
}

/* #ifndef APP-NVUE */
.wui-nav__title-color {
	color: var(--wui-color-title, #181818) !important;
}

/* #endif */

.wui-nav__title-text {
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */

	/* #ifndef APP-NVUE */
	display: block;
	overflow: hidden;
	white-space: nowrap;
	/* #endif */

	text-overflow: ellipsis;
}

.wui-nav__bar-fixed {
	position: fixed;
	/* #ifdef H5 */
	left: var(--window-left);
	right: var(--window-right);
	/* #endif */
	/* #ifndef H5 */
	left: 0;
	right: 0;
	/* #endif */
	top: 0;
}
</style>
