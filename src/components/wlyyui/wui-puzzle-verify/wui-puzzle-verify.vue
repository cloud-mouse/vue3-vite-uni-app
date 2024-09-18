<!--（手机号：1   5    26 701 37 56，身份证尾号：1   91 93 5）-->
<template>
	<view
		class="wui-slider__captcha-wrap"
		:class="{ 'wui-sc__wrap-show': isShow }"
		:style="{ background: maskBgColor, zIndex: zIndex }"
		@tap="maskClose"
		@touchmove.stop.prevent="stop"
		v-if="isShow || !isNvue"
		ref="wui_sc_ani"
	>
		<view class="wui-slider__captcha" :style="{ background: background }" @tap.stop="stop">
			<text class="wui-sc__title" :style="{ width: width + 'px', color: color, fontSize: size + 'rpx' }">{{ title }}</text>
			<text
				class="wui-sc__descr"
				:style="{
					width: width + 'px',
					color: descrColor,
					fontSize: descrSize + 'rpx'
				}"
				>拖动下方滑块完成拼图</text
			>
			<view class="wui-sc__img-box" :style="{ width: width + 'px' }">
				<image class="wui-sc__img" :src="src" :style="{ width: width + 'px', height: height + 'px' }" v-if="src"> </image>
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<view
					class="wui-sc__slot-box"
					ref="imgRef"
					:class="{
						'wui-sc__sb-hidden': !cutSrc,
						'wui-sc__sb-bs': !isNvueAndroid
					}"
					:style="{ left: x + 'px', top: y + 'px' }"
				>
					<image :src="cutSrc" class="wui-sc__slot-img" :class="{ 'wui-sc__img-border': isNvueAndroid }"> </image>
				</view>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
				<view
					class="wui-sc__slot-box"
					:class="{ 'wui-sc__sb-bs': true, 'wui-sc__reset-ani': resetAni }"
					:style="{ left: x + 'px', top: y + 'px', transform: transformSlot }"
					v-if="cutSrc"
				>
					<image :src="cutSrc" class="wui-sc__slot-img"></image>
				</view>
				<!-- #endif -->
			</view>
			<view class="wui-sc__sliderbar" :style="{ width: width + 'px', height: sliderH + 'px' }">
				<view
					class="wui-sc__bar"
					:style="{
						width: width + 'px',
						height: sliderH / 2 + 'px',
						borderRadius: sliderH + 'px'
					}"
				>
				</view>
				<!-- #ifdef APP-VUE || MP-WEIXIN  || H5-->
				<view
					class="wui-sc__slider"
					:class="{ 'wui-sc__slider-bg': !sliderBgColor }"
					:style="{
						width: sliderH * 2 + 'px',
						height: sliderH + 'px',
						borderRadius: sliderH + 'px',
						background: sliderBgColor
					}"
					:change:prop="parse.slidereset"
					:prop="resetNum"
					:data-width="width"
					:data-start="x"
					:data-swidth="sliderH * 2"
					:data-disabled="!cutSrc || isPass || disabled || !isShow ? 1 : 0"
					@touchstart="parse.touchstart"
					@touchmove="parse.touchmove"
					@touchend="parse.touchend"
					@mousedown="parse.mousedown"
				>
					<wui-icon name="slide" :size="56" :color="slideColor"></wui-icon>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view
					ref="sliderRef"
					class="wui-sc__slider"
					:class="{ 'wui-sc__slider-bg': !sliderBgColor }"
					:style="{
						width: sliderH * 2 + 'px',
						height: sliderH + 'px',
						borderRadius: sliderH + 'px',
						background: sliderBgColor
					}"
					@touchstart="touchstart"
					@horizontalpan="touchmove"
					@touchend="touchend"
				>
					<wui-icon name="slide" :size="56" :color="slideColor"></wui-icon>
				</view>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
				<view
					class="wui-sc__slider"
					:class="{
						'wui-sc__slider-bg': !sliderBgColor,
						'wui-sc__reset-ani': resetAni
					}"
					:style="{
						width: sliderH * 2 + 'px',
						height: sliderH + 'px',
						borderRadius: sliderH + 'px',
						background: sliderBgColor,
						transform: transform
					}"
					@touchstart="touchstart"
					@touchmove.stop.prevent="touchmove"
					@touchend="touchend"
				>
					<wui-icon name="slide" :size="56" :color="slideColor"></wui-icon>
				</view>
				<!-- #endif -->
			</view>
			<view class="wui-sc__close" @tap.stop="closeVerify">
				<wui-icon name="close" :color="closeColor"></wui-icon>
			</view>
		</view>
	</view>
</template>
<!-- #ifdef APP-VUE  || MP-WEIXIN  || H5-->
<script src="./index.wxs" module="parse" lang="wxs"></script>
<!-- #endif -->
<script>
import weex from './weex.js';
import mpjs from './mpjs.js';
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	name: 'wui-puzzle-verify',
	mixins: [mpjs, weex],
	emits: ['verify', 'init'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		src: {
			type: String,
			default: ''
		},
		cutSrc: {
			type: String,
			default: ''
		},
		x: {
			type: [Number, String],
			default: 10
		},
		y: {
			type: [Number, String],
			default: 10
		},
		width: {
			type: [Number, String],
			default: 300
		},
		height: {
			type: [Number, String],
			default: 150
		},
		background: {
			type: String,
			default: '#FFFFFF'
		},
		title: {
			type: String,
			default: '安全验证'
		},
		color: {
			type: String,
			default: '#B2B2B2'
		},
		size: {
			type: [Number, String],
			default: 28
		},
		descrColor: {
			type: String,
			default: '#333333'
		},
		descrSize: {
			type: [Number, String],
			default: 36
		},
		closeColor: {
			type: String,
			default: '#B2B2B2'
		},
		// #ifdef APP-NVUE
		sliderBgColor: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		sliderBgColor: {
			type: String,
			default: ''
		},
		// #endif
		slideColor: {
			type: String,
			default: '#FFFFFF'
		},
		zIndex: {
			type: [Number, String],
			default: 996
		},
		maskBgColor: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		maskClosable: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		src(newValue, oldValue) {
			this.reset();
		},
		cutSrc(val) {
			this.reset();
		}
	},
	data() {
		let sys = uni.getSystemInfoSync();
		let isNvue = false;
		let isNvueAndroid = false;
		// #ifdef APP-NVUE
		isNvue = true;
		isNvueAndroid = sys.platform === 'android';
		// #endif
		return {
			isNvueAndroid: isNvueAndroid,
			isNvue: isNvue,
			isShow: false,
			w: 300,
			h: 150,
			sliderH: 0,
			resetNum: 0,
			isPass: false,
			disabled: false
		};
	},
	created() {
		this.sliderH = this.getPx(64);
		//结合后端验证使用
		this.$emit('init', {
			//切割图片的宽高，固定为44px
			cutGraphWidth: 44
		});
	},
	methods: {
		getPx(value) {
			let val = parseInt(uni.upx2px(Number(value)));
			return val % 2 === 0 ? val : val + 1;
		},
		verify(e) {
			//验证中禁止操作
			this.disabled = true;
			this.$emit('verify', {
				slipDistance: e.slip
			});
		},
		success() {
			this.isPass = true;
		},
		reset() {
			this.resetNum += 1;
			this.isPass = false;
			this.disabled = false;
		},
		maskClose() {
			if (!this.maskClosable) return;
			this.closeVerify();
		},
		closeVerify() {
			this.reset();
			// #ifndef APP-NVUE
			this.isShow = false;
			// #endif

			// #ifdef APP-NVUE
			this.closeAni();
			// #endif
		},
		show() {
			// #ifndef APP-NVUE
			this.isShow = true;
			// #endif

			// #ifdef APP-NVUE
			this.openAni();
			// #endif
		},
		stop() {}
	}
};
</script>

<style scoped>
.wui-slider__captcha-wrap {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	transition-property: all;
	transition-timing-function: ease-in;
	transition-duration: 0.2s;
	display: flex;
	transform: scale3d(1, 1, 0);
	visibility: hidden;
	/* #endif */
	align-items: center;
	justify-content: center;
	opacity: 0;
}

/* #ifndef APP-NVUE */
.wui-sc__wrap-show {
	opacity: 1;
	transform: scale3d(1, 1, 1);
	visibility: visible;
}

/* #endif */
.wui-slider__captcha {
	padding: 60rpx 32rpx;
	text-align: center;
	border-radius: 24rpx;
	overflow: hidden;
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.wui-sc__title {
	text-align: left;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	font-weight: normal;
}

.wui-sc__descr {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	text-align: left;
	padding-bottom: 36rpx;
	font-weight: 600;
	padding-top: 12rpx;
}

.wui-sc__img-box {
	position: relative;
	background: #f1f4fa;
}

/* #ifndef APP-NVUE */
.wui-sc__img {
	display: block;
}

/* #endif */

.wui-sc__slot-bs {
	box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);
}

.wui-sc__sb-bs {
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.8);
}

.wui-sc__slot-box {
	position: absolute;
	width: 44px;
	height: 44px;
	opacity: 1;
	z-index: 5;
}

.wui-sc__sb-hidden {
	opacity: 0;
}

.wui-sc__slot-img {
	width: 44px;
	height: 44px;
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
}

/* #ifdef APP-NVUE */
.wui-sc__img-border {
	border: 0.5px solid rgba(255, 255, 255, 0.2);
}

/* #endif */

.wui-sc__close {
	position: absolute;
	padding: 16rpx 16rpx 0 0;
	right: 12rpx;
	top: 12rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-sc__sliderbar {
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 48rpx;
}

.wui-sc__bar {
	background: #eeeeee;
}

.wui-sc__slider {
	position: absolute;
	left: 0;
	top: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-sc__slider-bg {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */

/* #ifndef APP-NVUE */
.wui-sc__reset-ani {
	transition: transform 0.2s;
}

/* #endif */

/* fix：Vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

/* #ifdef VUE3 */
.wui-pv__un-ani {
	transition: transform 0s;
}
/* #endif */
</style>
