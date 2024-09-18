<!--（手机号： 15267 01  3   7   56，身份证尾号： 1 91 93  5）-->
<template>
	<view
		class="wui-overflow__hidden-wrap"
		:class="{
			'wui-overflow__hidden': type == 1 && !visible,
			'wui-gradient__hidden': type == 2 && !visible,
			'wui-text__nowrap': type == 1 && rows == 1
		}"
		:style="{
			width: width,
			height: type == 1 || visible ? 'auto' : height,
			paddingTop: type == 2 ? padding[0] : '0',
			paddingRight: type == 2 ? padding[1] : 0,
			paddingBottom: type == 2 ? padding[2] || padding[0] : 0,
			paddingLeft: type == 2 ? padding[3] || padding[1] : 0,
			background: background,
			fontSize: size + 'rpx',
			color: color,
			fontWeight: fontWeight,
			'-webkit-line-clamp': type == 1 ? rows : 'none',
			textOverflow: overflow,
			textAlign: align
		}"
		@tap="handleTap"
	>
		<!-- #ifdef APP-NVUE -->
		<text
			:style="{
				width: width,
				height: type == 1 || visible ? 'auto' : height,
				fontSize: size + 'rpx',
				color: color,
				fontWeight: fontWeight,
				lines: type == 1 ? rows : 0,
				textOverflow: overflow,
				textAlign: align
			}"
			v-if="text"
			>{{ text }}</text
		>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		{{ text }}
		<!-- #endif -->
		<text
			class="wui-btn__text"
			v-if="type == 1 && isShowBtn"
			@click="handleReadMore"
			:class="{
				'wui-visible': visible
			}"
			>{{ visible ? '收起' : '展开' }}</text
		>
		<slot></slot>
		<view class="wui-oh__gradient-wrap" :style="{ background: getGradientBgColor }" v-if="type == 2 && !visible"></view>
	</view>
</template>

<script>
export default {
	name: 'wui-overflow-hidden',
	emits: ['click'],
	props: {
		text: {
			type: String,
			default: ''
		},
		type: {
			type: [Number, String],
			default: 1
		},
		rows: {
			type: [Number, String],
			default: 1
		},
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: 'auto'
		},
		padding: {
			type: Array,
			default() {
				return ['0', '0'];
			}
		},
		align: {
			type: String,
			default: 'left'
		},
		background: {
			type: String,
			default: 'transparent'
		},
		size: {
			type: [Number, String],
			default: 32
		},
		color: {
			type: String,
			default: '#333333'
		},
		fontWeight: {
			type: [Number, String],
			default: 'normal'
		},
		overflow: {
			type: String,
			default: 'ellipsis'
		},
		gradientColor: {
			type: String,
			default: '#FFFFFF'
		},
		visible: {
			type: Boolean,
			default: false
		},
		isShowBtn: {
			type: Boolean,
			default: false
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		getGradientBgColor() {
			// #ifdef APP-NVUE
			return `linear-gradient(to bottom, rgba(255,255,255,0), ${this.gradientColor})`;
			// #endif

			// #ifndef APP-NVUE
			return `-webkit-linear-gradient(top, rgba(255,255,255,0), ${this.gradientColor})`;
			// #endif
		}
	},
	methods: {
		handleTap(e) {
			this.$emit('click', {
				param: this.param
			});
		},
		handleReadMore() {
			this.$emit('readMoreBtn', {
				param: this.param
			});
		}
	}
};
</script>

<style scoped>
.wui-overflow__hidden-wrap {
	position: relative;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	flex-shrink: 0;
	/* #endif */
	flex: 1;
}
.wui-btn__text {
	position: absolute;
	right: 0;
	bottom: 0;
	z-index: 2;
	background-color: #fff;
	color: #1396ff;
	cursor: pointer;
	font-size: 28rpx;
	padding-left: 8rpx;
	padding-right: 30rpx;
}
.wui-btn__text:after {
	content: '';
	position: absolute;
	top: 0;
	left: -24px;
	height: 100%;
	width: 24px;
	background: -webkit-linear-gradient(left, hsla(0, 0%, 100%, 0.5) 10%, #fff);
	pointer-events: none;
}
.wui-visible {
	display: inline-block;
	position: static;
	padding-left: 0;
}

.wui-overflow__hidden {
	/* #ifndef APP-NVUE */
	display: -webkit-box;
	word-break: break-all;
	white-space: normal;
	-webkit-box-orient: vertical;
	/* #endif */
	overflow: hidden;
}

.wui-gradient__hidden {
	/* #ifndef APP-NVUE */
	display: block;
	word-break: break-all;
	/* #endif */
	overflow: hidden;
}

/* #ifndef APP-NVUE */
.wui-text__nowrap {
	display: inline-block !important;
	word-break: normal !important;
	white-space: nowrap !important;
}

/* #endif */
.wui-oh__gradient-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	z-index: 2;
	/* #endif */
	flex: 1;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
