<!--（手机号： 1  526  70  1 375  6，身份证尾号：  191 9  35）-->
<template>
	<view class="wui-loadmore__wrap" :class="['wui-loadmore__' + direction]" :style="{ height: height + 'rpx' }">
		<view
			class="wui-loadmore__icon"
			ref="wui_loadmore"
			:class="{ 'wui-loadmore__border-left': !isNvue && !activeColor }"
			:style="{
				width: iconWidth + 'rpx',
				height: iconWidth + 'rpx',
				'border-left-color': activeColor,
				'border-right-color': iconColor,
				'border-top-color': iconColor,
				'border-bottom-color': iconColor
			}"
			v-if="!src && state == 2"
		>
		</view>
		<image
			class="wui-loadmore__icon-ani"
			ref="wui_loadmore"
			:src="src"
			:style="{ width: iconWidth + 'rpx', height: iconWidth + 'rpx' }"
			v-if="src && state == 2"
		></image>
		<text
			:class="{ 'wui-loadmore__text': direction === 'col' }"
			:style="{
				color: color,
				'font-size': size + 'rpx',
				'line-height': size + 'rpx'
			}"
			>{{ getStateText(state) }}</text
		>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-loadmore',
	props: {
		//占据高度，单位rx
		height: {
			type: [Number, String],
			default: 100
		},
		//1-上拉加载 2-正在加载... 3-没有更多了
		state: {
			type: [Number, String],
			default: 2
		},
		initText: {
			type: String,
			default: '上拉加载'
		},
		//提示文字
		text: {
			type: String,
			default: '正在加载...'
		},
		noneText: {
			type: String,
			default: '没有更多了'
		},
		//文字颜色
		color: {
			type: String,
			default: '#7F7F7F'
		},
		//文字大小，单位rpx
		size: {
			type: [Number, String],
			default: 24
		},
		//loading图标背景色
		iconColor: {
			type: String,
			default: '#B2B2B2'
		},
		//loading图标高亮部分颜色
		activeColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//loading 图标的宽度，单位rpx
		iconWidth: {
			type: [Number, String],
			// #ifdef APP-NVUE
			default: 32,
			// #endif
			// #ifndef APP-NVUE
			default: 28
			// #endif
		},
		//自定义loading图标image路径，若自定义图标则iconColor、activeColor属性失效
		src: {
			type: String,
			default: ''
		},
		//loading图标和文字排列方向，可取值：col，row
		direction: {
			type: String,
			default: 'row'
		}
	},
	watch: {
		state(newValue, oldValue) {
			this.$nextTick(() => {
				// #ifdef APP-NVUE
				if (newValue == 2) {
					this.stop = false;
					setTimeout(() => {
						this._animation();
					}, 50);
				} else {
					this.stop = true;
				}
				// #endif
			});
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue: isNvue,
			// #ifdef APP-NVUE
			deg: 0,
			stop: false
			// #endif
		};
	},
	// #ifdef APP-NVUE
	mounted() {
		this._animation();
	},
	// #endif
	//nvue暂不支持vue3，所以不需要做兼容,此处以防后续兼容
	// #ifdef APP-NVUE
	// #ifndef VUE3
	beforeUnmount() {
		this.deg = 0;
		this.stop = true;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.deg = 0;
		this.stop = true;
	},
	// #endif
	// #endif
	methods: {
		getStateText(state) {
			state = Number(state);
			return [this.initText, this.text, this.noneText][state - 1];
		},
		// #ifdef APP-NVUE
		_animation() {
			if (!this.$refs['wui_loadmore'] || this.stop) return;
			animation.transition(
				this.$refs['wui_loadmore'].ref,
				{
					styles: {
						transform: `rotate(${this.deg}deg)`
					},
					duration: 700, //ms
					timingFunction: 'linear',
					iterationCount: 'infinite',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					this.deg += 360;
					this._animation();
				}
			);
		}
		// #endif
	}
};
</script>

<style scoped>
.wui-loadmore__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
}

.wui-loadmore__col {
	flex-direction: column;
}

.wui-loadmore__row {
	flex-direction: row;
}

.wui-loadmore__icon {
	margin: 0 6px;
	border-width: 2px;
	border-style: solid;
	/* #ifdef APP-NVUE */
	border-radius: 100px;
	/* #endif */

	/* #ifndef APP-NVUE */
	border-radius: 50%;
	animation: wui-rotate 0.7s linear infinite;
	/* #endif */
}

.wui-loadmore__icon-ani {
	margin: 0 6px;
	/* #ifndef APP-NVUE */
	display: block;
	animation: wui-rotate 0.7s linear infinite;
	/* #endif */
}

.wui-loadmore__text {
	padding-top: 16rpx;
}

/* #ifndef APP-NVUE */
.wui-loadmore__border-left {
	border-left-color: var(--wui-color-primary, #1396ff) !important;
}

@-webkit-keyframes wui-rotate {
	0% {
		transform: rotate(0);
	}

	100% {
		transform: rotate(360deg);
	}
}

@keyframes wui-rotate {
	0% {
		transform: rotate(0);
	}

	100% {
		transform: rotate(360deg);
	}
}

/* #endif */
</style>
