<!--（手机号： 152    670 1 37  5 6，身份证尾号： 1 9 1  935）-->
<template>
	<view
		class="wui-countdown__verify"
		:class="{ 'wui-cdv__disabled': status > 1 }"
		:style="{
			width: width + 'rpx',
			height: height + 'rpx',
			marginLeft: marginLeft + 'rpx',
			marginRight: marginRight + 'rpx',
			borderRadius: radius + 'rpx',
			background: background,
			borderColor: !borderColor || borderColor === 'true' ? background : borderColor
		}"
	>
		<text
			:style="{
				fontSize: size + 'rpx',
				lineHeight: size + 'rpx',
				color: color
			}"
			class="wui-countdown__verify-text"
			:class="{ 'wui-cdv__color': !color }"
			>{{ showText }}</text
		>
		<view
			class="wui-countdown__verify-main wui-countdown__verify-active"
			:style="{ borderRadius: radius + 'rpx' }"
			@tap.stop="sendCode"
			v-if="status === 1"
		></view>
		<!-- #ifndef APP-NVUE -->
		<view
			class="wui-countdown__verify-line"
			:class="{ 'wui-cdv__border-color': !borderColor }"
			:style="{ borderColor: borderColor, borderRadius: radius * 2 + 'rpx' }"
		>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	name: 'wui-countdown-verify',
	emits: ['send', 'countdown', 'end'],
	props: {
		//发送前显示文本
		text: {
			type: String,
			default: '发送验证码'
		},
		//发送中显示文本
		sending: {
			type: String,
			default: '正在发送...'
		},
		//发送后倒计时显示文本(前面会自动拼接时间)
		sent: {
			type: String,
			default: 's后重新获取'
		},
		//倒计时秒数
		seconds: {
			type: [Number, String],
			default: 60
		},
		//宽度
		width: {
			type: [Number, String],
			default: 192
		},
		//高度
		height: {
			type: [Number, String],
			default: 60
		},
		marginLeft: {
			type: [Number, String],
			default: 0
		},
		marginRight: {
			type: [Number, String],
			default: 0
		},
		//圆角
		radius: {
			type: [Number, String],
			default: 8
		},
		//字体大小 rpx
		size: {
			type: [Number, String],
			default: 24
		},
		//字体颜色
		// #ifdef APP-NVUE
		color: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		color: {
			type: String,
			default: ''
		},
		// #endif
		//背景色
		background: {
			type: String,
			default: 'transparent'
		},
		//边框颜色
		// #ifdef APP-NVUE
		borderColor: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		borderColor: {
			type: String,
			default: ''
		},
		// #endif
		//自定义参数
		param: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			showText: '',
			//1-发送前，2-发送中 3-发送成功，倒计时
			status: 1,
			timer: null
		};
	},
	created() {
		if (this.start) {
			this.doLoop();
		} else {
			this.showText = this.text;
			this.clearTimer();
		}
	},
	// #ifndef VUE3
	beforeUnmount() {
		this.clearTimer();
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.clearTimer();
	},
	// #endif
	methods: {
		sendCode(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			if (this.status > 1) return;
			this.clearTimer();
			this.status = 2;
			this.showText = this.sending;
			this.$emit('send', {
				param: this.param
			});
		},
		doLoop() {
			this.clearTimer();
			this.status = 3;
			let seconds = Number(this.seconds || 60);
			this.showText = seconds + this.sent;
			this.timer = setInterval(() => {
				if (seconds > 1) {
					--seconds;
					this.showText = seconds + this.sent;
					this.$emit('countdown', {
						seconds: seconds,
						param: this.param
					});
				} else {
					this.reset();
					this.$emit('end', {
						param: this.param
					});
				}
			}, 1000);
		},
		success() {
			this.doLoop();
		},
		reset() {
			this.clearTimer();
			this.showText = this.text;
			this.status = 1;
		},
		clearTimer() {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
};
</script>

<style scoped>
.wui-countdown__verify {
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	white-space: nowrap;
	/* #endif */
	align-items: center;
	justify-content: center;
	overflow: hidden;
	/* #ifdef APP-NVUE */
	border-width: 0.5px;
	border-style: solid;
	/* #endif */

	/* #ifndef APP-NVUE */
	border-width: 0;
	/* #endif */
}

.wui-countdown__verify-main {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background-color: transparent;
	/* #ifndef APP-NVUE */
	z-index: 3;
	/* #endif */

	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-countdown__verify-active:active {
	background-color: rgba(0, 0, 0, 0.2);
}

.wui-cdv__disabled {
	opacity: 0.5;
}

.wui-countdown__verify-text {
	font-weight: normal;
	text-align: center;
}

/* #ifndef APP-NVUE */
.wui-countdown__verify-line {
	position: absolute;
	width: 200%;
	height: 200%;
	transform-origin: 0 0;
	transform: scale(0.5, 0.5) translateZ(0);
	box-sizing: border-box;
	border-style: solid;
	border-width: 1px;
	left: 0;
	top: 0;
	pointer-events: none;
	z-index: 2;
}

.wui-cdv__color {
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-cdv__border-color {
	border-color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
