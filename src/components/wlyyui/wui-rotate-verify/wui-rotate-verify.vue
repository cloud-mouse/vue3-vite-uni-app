<!--（手机号：     15 2 670137   56，身份证尾号： 19  19  35）-->
<template>
	<view
		class="wui-rotate__verify-wrap"
		:class="{ 'wui-rv__wrap-show': isShow }"
		:style="{ background: maskBgColor, zIndex: zIndex }"
		@tap="maskClose"
		@touchmove.stop.prevent="stop"
		v-if="isShow || !isNvue"
		ref="wui_rv_ani"
	>
		<view class="wui-rotate__verify" :style="{ width: width + 'rpx', background: background }" @tap.stop="stop">
			<view class="wui-rv__close" @tap.stop="closeVerify">
				<wui-icon name="w-close" :color="closeColor"></wui-icon>
			</view>
			<text class="wui-rv__title" :style="{ color: color, fontSize: size + 'rpx' }">{{ title }}</text>
			<text class="wui-rv__descr" :style="{ color: descrColor, fontSize: descrSize + 'rpx' }">拖动滑块，使图片角度为正</text>
			<view
				class="wui-rv__image-box"
				:style="{
					width: imgW + 'px',
					height: imgW + 'px',
					borderRadius: isNvue ? imgW + 'px' : '50%'
				}"
			>
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<image
					class="wui-rv__image"
					:src="src"
					:style="{
						width: imgW + 'px',
						height: imgW + 'px',
						borderRadius: isNvue ? imgW + 'px' : '50%'
					}"
					ref="imgRef"
				>
				</image>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
				<image
					class="wui-rv__image"
					:class="{ 'wui-rv__rest-ani': resetAni }"
					:src="src"
					:style="{
						width: imgW + 'px',
						height: imgW + 'px',
						borderRadius: isNvue ? imgW + 'px' : '50%',
						transform: 'rotate(' + angle + 'deg)'
					}"
				>
				</image>
				<!-- #endif -->
				<view
					class="wui-rv__result"
					v-if="showRes || isPass"
					:style="{
						width: imgW + 'px',
						height: imgW + 'px',
						borderRadius: isNvue ? imgW + 'px' : '50%'
					}"
				>
					<wui-icon :name="isPass ? 'check' : 'close'" :size="96" :color="isPass ? passColor : failColor"></wui-icon>
				</view>
			</view>
			<!-- #ifdef APP-VUE || MP-WEIXIN || H5 -->
			<view
				class="wui-rv__slidebar"
				:style="{
					width: sliderWidth + 'px',
					height: sliderHeight + 'px',
					borderColor: borderColor,
					borderRadius: sliderHeight + 'px'
				}"
			>
				<view
					class="wui-rv__slider"
					:style="{
						width: sliderHeight + 'px',
						height: sliderHeight - 2 + 'px',
						background: sliderBgColor,
						borderColor: borderColor,
						borderRadius: isNvue ? sliderHeight + 'px' : '50%'
					}"
					:change:prop="parse.slidereset"
					:prop="resetNum"
					:data-width="sliderWidth"
					:data-swidth="sliderHeight"
					:data-disabled="isPass || disabled || !isShow ? 1 : 0"
					@touchstart="parse.touchstart"
					@touchmove="parse.touchmove"
					@touchend="parse.touchend"
					@mousedown="parse.mousedown"
				>
					<wui-icon name="slide" :size="60" :color="slideColor"></wui-icon>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view
				class="wui-rv__slidebar"
				:style="{
					width: sliderWidth + 'px',
					height: sliderHeight + 'px',
					borderColor: borderColor,
					borderRadius: sliderHeight + 'px'
				}"
			>
				<view
					class="wui-rv__slider"
					:style="{
						width: sliderHeight + 'px',
						height: sliderHeight - 2 + 'px',
						background: sliderBgColor,
						borderColor: borderColor,
						borderRadius: isNvue ? sliderHeight + 'px' : '50%'
					}"
					@touchstart="touchstart"
					@horizontalpan="touchmove"
					@touchend="touchend"
					ref="sliderRef"
				>
					<wui-icon name="slide" :size="60" :color="slideColor"></wui-icon>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
			<view
				class="wui-rv__slidebar"
				:style="{
					width: sliderWidth + 'px',
					height: sliderHeight + 'px',
					borderColor: borderColor,
					borderRadius: sliderHeight + 'px'
				}"
			>
				<view
					class="wui-rv__slider"
					:class="{ 'wui-rv__rest-ani': resetAni }"
					:style="{
						width: sliderHeight + 'px',
						height: sliderHeight - 2 + 'px',
						background: sliderBgColor,
						borderColor: borderColor,
						borderRadius: isNvue ? sliderHeight + 'px' : '50%',
						transform: transform
					}"
					@touchstart="touchstart"
					@touchmove.stop.prevent="touchmove"
					@touchend="touchend"
				>
					<wui-icon name="slide" :size="60" :color="slideColor"></wui-icon>
				</view>
			</view>
			<!-- #endif -->
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
	name: 'wui-rotate-verify',
	mixins: [mpjs, weex],
	emits: ['verify'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		//验证弹层外层盒子宽度 rpx
		width: {
			type: [Number, String],
			default: 600
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
			default: 32
		},
		//图片地址（旋转了初始角度后的图片），必传
		//旋转角度建议区间为 -330deg<angle <-30deg 或 30deg<angle<330deg
		src: {
			type: String,
			default: ''
		},
		//图片宽度，单位rpx。默认为正方形图片
		imgWidth: {
			type: [Number, String],
			default: 240
		},
		//滑动条和滑块边框颜色
		borderColor: {
			type: String,
			default: '#EEEEEE'
		},
		sliderBgColor: {
			type: String,
			default: '#FFFFFF'
		},
		closeColor: {
			type: String,
			default: '#B2B2B2'
		},
		slideColor: {
			type: String,
			default: '#333333'
		},
		passColor: {
			type: String,
			default: '#09BE4F'
		},
		failColor: {
			type: String,
			default: '#FF2B2B'
		},
		zIndex: {
			type: [Number, String],
			default: 996
		},
		maskBgColor: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		//点击遮罩 是否可关闭
		maskClosable: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		imgWidth(val) {
			this.imgW = this.getPx(val);
		},
		width(val) {
			this.sliderWidth = this.getPx(Number(val) - 64);
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue: isNvue,
			isShow: false,
			isPass: false,
			disabled: false,
			showRes: false,
			sliderHeight: 0,
			imgW: 0,
			sliderWidth: 0,
			resetNum: 0
		};
	},
	created() {
		this.sliderWidth = this.getPx(Number(this.width) - 64);
		this.sliderHeight = this.getPx(92);
		this.imgW = this.getPx(this.imgWidth);
	},
	methods: {
		getPx(value) {
			let val = parseInt(uni.upx2px(Number(value)));
			return val % 2 === 0 ? val : val + 1;
		},
		success() {
			this.isPass = true;
		},
		fail() {
			this.showRes = true;
			this.isPass = false;
			setTimeout(() => {
				this.reset();
			}, 300);
		},
		verify(e) {
			//Math.abs(angle + initAngle - 360) <= range || Math.abs(angle + initAngle) <= range
			//验证中禁止操作
			this.disabled = true;
			this.$emit('verify', e);
		},
		/*
			 验证结果，前端验证时使用
			@param {Number} angle 旋转角度
			@param {Number} initAngle 初始化时旋转角度
			@param {Number} range 可误差角度范围
			@param {function} callback 回调函数 返回参数=>是否通过验证(bool)
			*/
		verifyRes(angle, initAngle, range, callback) {
			let res = false;
			if (Math.abs(angle + initAngle - 360) <= range || Math.abs(angle + initAngle) <= range) {
				res = true;
			}
			callback && callback(res);
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
		reset() {
			this.resetNum += 1;
			this.isPass = false;
			this.disabled = false;
			this.showRes = false;
		},
		stop() {}
	}
};
</script>

<style scoped>
.wui-rotate__verify-wrap {
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
.wui-rv__wrap-show {
	opacity: 1;
	transform: scale3d(1, 1, 1);
	visibility: visible;
}

/* #endif */

.wui-rotate__verify {
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

.wui-rv__close {
	position: absolute;
	padding: 16rpx 16rpx 0 0;
	right: 12rpx;
	top: 12rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-rv__title {
	text-align: center;
	padding-top: 30rpx;
	font-weight: normal;
}

.wui-rv__descr {
	text-align: center;
	padding-top: 20rpx;
	font-weight: normal;
}

.wui-rv__image-box {
	position: relative;
	margin-top: 48rpx;
	margin-bottom: 64rpx;
	background: #f1f4fa;
}

/* #ifndef APP-NVUE */
.wui-rv__image {
	border-radius: 50%;
	display: block;
	/* #ifndef APP-PLUS || MP-WEIXIN || H5 */
	position: absolute;
	left: 0;
	top: 0;
	/* #endif */
}

/* #endif */

/* #ifndef APP-NVUE */
.wui-rv__rest-ani {
	transition: transform 0.2s;
}

/* #endif */

/* fix：vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

/* #ifdef VUE3 */
.wui-rv__un-ani {
	transition: transform 0s;
}

/* #endif */

.wui-rv__result {
	position: absolute;
	z-index: 2;
	left: 0;
	top: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.6);
}

.wui-rv__slidebar {
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	position: relative;
	border-width: 1px;
	border-style: solid;
}

.wui-rv__slider {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 0;
	top: 0;
	border-width: 1px;
	border-style: solid;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}
</style>
