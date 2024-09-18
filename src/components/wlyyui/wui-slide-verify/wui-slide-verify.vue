<!--（手机号：    1 526 7 0 1  3756，身份证尾号：1 9 19 3  5）-->
<template>
	<view class="wui-slideverify__wrap" :style="{width:totalWidth+'px',height:height+'rpx',background:background}">
		<text class="wui-sv__text-tip" :style="{fontSize:size+'rpx',background:getBackground,color:color}"
			:class="{'wui-sv__opacity':isPass}">拖动滑块至虚线框内</text>
		<!-- #ifdef APP-PLUS  || MP-WEIXIN || H5-->
		<view class="wui-sv__foreground" ref="foreground" :class="{'wui-sv__background':!activeBgColor}"
			:style="{background:activeBgColor}">
			<!-- #endif -->
			<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
			<view class="wui-sv__foreground" :class="{'wui-sv__background':!activeBgColor,'wui-sv__reset-ani':resetAni}"
				:style="{background:activeBgColor,width:fwidth+'px'}">
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<text :class="{'wui-sv__opacity':!isPass}" class="wui-sv__text-res"
					:style="{fontSize:size+'rpx',color:activeColor,lineHeight:height+'rpx',width:passWidth+'px'}">验证通过</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<text :class="{'wui-sv__opacity':!isPass}" class="wui-sv__text-res"
					:style="{fontSize:size+'rpx',color:activeColor}">验证通过</text>
				<!-- #endif -->
				<text :class="{'wui-sv__opacity':isPass}" class="wui-sv__text-cover"
					:style="{width:totalWidth+'px',fontSize:size+'rpx',height:height+'rpx',lineHeight:height+'rpx',color:activeColor}">拖动滑块至虚线框内</text>
			</view>
			<!-- #ifdef APP-VUE || MP-WEIXIN  || H5-->
			<view class="wui-sv__slider" :class="{'wui-sv__border-color':!passColor && isPass}"
				:style="{width:sliderW+'px',borderColor:isPass?passColor: borderColor}" :change:prop="parse.slidereset"
				:prop="resetNum" :data-width="totalWidth" :data-tleft="targetWidth" :data-swidth="sliderW"
				:data-pass="isPass?1:0" :data-range="range" @touchstart="parse.touchstart" @touchmove="parse.touchmove"
				@touchend="parse.touchend" @mousedown="parse.mousedown">
				<wui-icon name="w-right" :color="arrowColor" :size="iconSize" v-if="!isPass"></wui-icon>
				<wui-icon name="w-checkbox-fill" :color="passColor" primary :size="iconSize" v-else></wui-icon>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view class="wui-sv__slider" @touchstart="touchstart" @horizontalpan="touchmove" @touchend="touchend"
				ref="slider" :style="{width:sliderW+'px',borderColor:isPass?passColor: borderColor}">
				<wui-icon name="w-right" :color="arrowColor" :size="iconSize" v-if="!isPass"></wui-icon>
				<wui-icon name="w-checkbox-fill" :color="passColor" :size="iconSize" v-else></wui-icon>
			</view>
			<!-- #endif -->

			<!-- #ifndef APP-PLUS  || MP-WEIXIN  || H5-->
			<view class="wui-sv__slider"
				:class="{'wui-sv__border-color':!passColor && isPass,'wui-sv__reset-ani':resetAni}"
				:style="{width:sliderW+'px',borderColor:isPass?passColor: borderColor,transform:transform}"
				@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend">
				<wui-icon name="right" :color="arrowColor" :size="iconSize" v-if="!isPass"></wui-icon>
				<wui-icon name="checkbox-fill" :color="passColor" primary :size="iconSize" v-else></wui-icon>
			</view>
			<!-- #endif -->
			<view class="wui-sv__dotted-box"
				:style="{'border-color':lineColor,'border-width':isPass?0:'1px',width:sliderW+'px',left:(targetWidth-sliderW)+'px'}">
			</view>
		</view>
</template>
<!-- #ifdef APP-VUE  || MP-WEIXIN  || H5-->
<script src="./index.wxs" module="parse" lang="wxs"></script>
<!-- #endif -->
<script>
	import weex from './weex.js'
	import mpjs from './mpjs.js'
	//非easycom模式取消注释引入字体组件，按实际路径进行调整
	// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
	export default {
		name: "wui-slide-verify",
		mixins: [mpjs, weex],
		emits: ['success', 'fail'],
		// components:{
		// 	wuiIcon
		// },
		props: {
			range: {
				type: [Number, String],
				default: 3
			},
			error: {
				type: [Number, String],
				default: 3
			},
			width: {
				type: [Number, String],
				default: 640
			},
			height: {
				type: [Number, String],
				default: 80
			},
			background: {
				type: String,
				default: "#EEEEEE"
			},
			// #ifdef APP-NVUE
			activeBgColor: {
				type: String,
				default: "#1396FF"
			},
			// #endif
			// #ifndef APP-NVUE
			activeBgColor: {
				type: String,
				default: ""
			},
			// #endif
			sliderWidth: {
				type: [Number, String],
				default: 80
			},
			sliderBgColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: '#EEEEEE'
			},
			// #ifdef APP-NVUE
			passColor: {
				type: String,
				default: '#1396FF'
			},
			// #endif
			// #ifndef APP-NVUE
			passColor: {
				type: String,
				default: ''
			},
			// #endif
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: "#333333"
			},
			activeColor: {
				type: String,
				default: "#FFFFFF"
			},
			iconSize: {
				type: [Number, String],
				default: 48
			},
			arrowColor: {
				type: String,
				default: "#B2B2B2"
			},
			lineColor: {
				type: String,
				default: "#B2B2B2"
			}
		},
		computed: {
			getBackground() {
				// #ifndef APP-NVUE
				return `-webkit-gradient(linear, left top, right top, color-stop(0, ${this.color}), color-stop(.4, ${this.color}), color-stop(.5, white), color-stop(.6, ${this.color}), color-stop(1, ${this.color}))`
				// #endif

				// #ifdef APP-NVUE
				return 'transparent'
				// #endif
			}
		},
		watch: {
			width(val) {
				this.totalWidth = this.getPx(val)
			},
			sliderWidth(val) {
				this.sliderW = this.getPx(val)
			}
		},
		data() {
			return {
				totalWidth: 0,
				targetWidth: 0,
				sliderW: 0,
				isPass: false,
				resetNum: 0,
				times: 0
			};
		},
		created() {
			this.totalWidth = this.getPx(this.width)
			this.sliderW = this.getPx(this.sliderWidth)
			this.changeTargetPosi()
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)))
				return val % 2 === 0 ? val : val + 1
			},
			changeTargetPosi() {
				let range = Array.from(new Array(100 + 1).keys()).slice(50);
				let index = Math.floor((Math.random() * range.length));
				let width = uni.upx2px(parseInt((this.width * (range[index] || 100)) / 100))
				width = width <= this.sliderW ? this.sliderW + 20 : width
				this.targetWidth = parseInt(width)
			},
			reset() {
				this.resetNum += 1
				this.isPass = false;
				this.times = 0
				this.changeTargetPosi()
			},
			success() {
				this.isPass = true;
				this.$emit('success', {})
			},
			fail() {
				this.times++;
				if (this.times >= Number(this.error)) {
					this.changeTargetPosi()
					this.times = 0
				}
				this.$emit('fail', {})
			}
		}
	}
</script>

<style scoped>
	.wui-slideverify__wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.wui-sv__text-tip {
		font-weight: normal;
		width: 338rpx;
		text-align: center;
		opacity: 1;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		-webkit-background-clip: text !important;
		-webkit-text-fill-color: transparent !important;
		-webkit-animation: ani_sv 2s infinite;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	@-webkit-keyframes ani_sv {
		from {
			background-position: -160rpx;
		}

		to {
			background-position: 160rpx;
		}
	}

	@keyframes ani_sv {
		from {
			background-position: -160rpx;
		}

		to {
			background-position: 160rpx;
		}
	}

	.wui-sv__background {
		background: var(--wui-color-primary, #1396FF) !important;
	}

	.wui-sv__border-color {
		border-color: var(--wui-color-primary, #1396FF) !important;
	}

	/* #endif */
	.wui-sv__foreground {
		width: 0;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.wui-sv__text-res {
		opacity: 1;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
		text-align: center;
		font-weight: normal;
		/* #ifdef APP-NVUE */
		position: absolute;
		left: 0;
		top: 0;
		/* #endif */
	}

	.wui-sv__slider {
		/* #ifndef APP-NVUE */
		display: flex;
		z-index: 3;
		box-sizing: border-box;
		/* #endif */
		align-items: center;
		justify-content: center;
		border-width: 1rpx;
		border-style: solid;
		background: #FFFFFF;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		transition-property: border-color;
		transition-duration: 0.08s;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.wui-sv__dotted-box {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 5;
		border-style: dashed;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		transition-property: left;
		transition-duration: 0.2s;
	}

	.wui-sv__opacity {
		opacity: 0 !important;
	}

	.wui-sv__text-cover {
		/* #ifndef APP-NVUE */
		display: flex;
		white-space: nowrap;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: absolute;
		left: 0;
		top: 0;
		font-weight: normal;
		opacity: 1;
	}

	/* #ifndef APP-NVUE */
	.wui-sv__reset-ani {
		transition: transform 0.2s;
	}

	/* #endif */

	/* fix：vue3下动画问题，app端直接移除class效果未消失，导致卡顿 */

	/* #ifdef VUE3 */
	.wui-sv__un-ani {
		transition: transform 0s;
	}
	/* #endif */
</style>
