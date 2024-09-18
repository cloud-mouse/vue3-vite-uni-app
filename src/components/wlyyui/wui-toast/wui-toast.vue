<!--（手机号：  15  26701  3  7 5 6，身份证尾号： 191    935）-->
<template>
	<view class="wui-toast__wrap" :class="{ 'wui-toast__show': visible }" v-if="visible || !isNvue" ref="wui_toast_ani">
		<view
			class="wui-toast__inner"
			:style="{
				paddingTop: padding[0] || 0,
				paddingRight: padding[1] || 0,
				paddingBottom: padding[2] || padding[0] || 0,
				paddingLeft: padding[3] || padding[1] || 0,
				background: background,
				zIndex: zIndex
			}"
		>
			<slot></slot>
			<view class="wui-toast__icon-box" v-if="src" :style="{ width: width + 'rpx', height: width + 'rpx' }">
				<image class="wui-toast__icon" :src="src" :style="{ width: width + 'rpx', height: width + 'rpx' }"> </image>
			</view>
			<text class="wui-toast__text" :style="{ fontSize: size + 'rpx', color: color }" v-if="text">{{ text }}</text>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-toast',
	props: {
		padding: {
			type: Array,
			default() {
				return ['32rpx', '32rpx'];
			}
		},
		background: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		//图标宽度（高度与宽度一致）rpx
		width: {
			type: [Number, String],
			default: 64
		},
		size: {
			type: [Number, String],
			default: 30
		},
		color: {
			type: String,
			default: '#fff'
		},
		zIndex: {
			type: Number,
			default: 1001
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			timer: null,
			visible: false,
			src: '',
			text: '',
			isNvue: isNvue
		};
	},
	// #ifndef VUE3
	beforeUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	},
	// #endif
	methods: {
		// #ifdef APP-NVUE
		_animation(type, duration = 2000) {
			if (!this.$refs['wui_toast_ani']) return;
			animation.transition(
				this.$refs['wui_toast_ani'].ref,
				{
					styles: {
						opacity: type ? 1 : 0
					},
					duration: 300, //ms
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.visible = false;
					} else {
						this.timer = setTimeout(() => {
							this._animation(false);
							clearTimeout(this.timer);
							this.timer = null;
						}, duration);
					}
				}
			);
		},
		// #endif
		show: function (options) {
			clearTimeout(this.timer);
			let { duration = 2000, src = '', text = '' } = options;
			this.text = text;
			this.src = src;
			// #ifdef APP-NVUE
			this.visible = true;
			// #endif
			this.$nextTick(() => {
				setTimeout(() => {
					// #ifdef APP-NVUE
					this._animation(true, duration);
					// #endif
					// #ifndef APP-NVUE
					this.visible = true;
					this.timer = setTimeout(() => {
						this.visible = false;
						clearTimeout(this.timer);
						this.timer = null;
					}, duration);
					// #endif
				}, 50);
			});
		}
	}
};
</script>

<style scoped>
.wui-toast__wrap {
	position: fixed;
	/* #ifdef APP-NVUE */
	left: 64rpx;
	right: 64rpx;
	top: 0;
	bottom: 0;
	/* #endif */
	/* #ifndef APP-NVUE */
	left: 15%;
	right: 15%;
	top: 50%;
	transform: translateY(-50%);
	/* #endif */
	background-color: rgba(0, 0, 0, 0);
	z-index: 1002;
	/* #ifndef APP-NVUE */
	display: flex;
	visibility: hidden;
	/* #endif */
	align-items: center;
	justify-content: center;
	/* #ifndef APP-NVUE */
	transition-property: opacity, visibility;
	transition-timing-function: ease-in-out;
	transition-duration: 0.3s;
	/* #endif */
	opacity: 0;
}

.wui-toast__inner {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border-radius: 16rpx;
}

/* #ifndef APP-NVUE */
.wui-toast__show {
	visibility: visible;
	opacity: 1;
}

/* #endif */
.wui-toast__icon-box {
	margin-bottom: 20rpx;
}

/* #ifndef APP-NVUE */
.wui-toast__icon {
	display: block;
}

/* #endif */
.wui-toast__text {
	font-weight: 400;
	text-align: center;
	/* #ifndef APP-NVUE */
	word-break: break-all;
	/* #endif */
}
</style>
