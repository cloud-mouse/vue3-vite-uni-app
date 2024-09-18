<!--（手机号：152      67 0 1 37 56，身份证尾号： 1 91 93  5）-->
<template>
	<view
		ref="wui_message_ani"
		class="wui-message__wrap"
		:class="{
			'wui-message__show': isShow,
			'wui-message__flex-row': opts_align !== 'center'
		}"
		:style="{
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			top: top + statusBarHeight + 'px',
			left: left + 'rpx',
			right: right + 'rpx',
			background: opts_bg,
			borderRadius: ridus + 'rpx',
			zIndex: zIndex
		}"
		v-if="!isNvue || isShow"
	>
		<slot></slot>
		<text
			class="wui-message__text"
			:class="{ 'wui-message__text-full': opts_align !== 'center' }"
			:style="{
				color: opts_color,
				fontSize: opts_size + 'rpx',
				textAlign: opts_align
			}"
			v-if="text"
			>{{ text }}</text
		>
	</view>
</template>

<script>
let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-message',
	props: {
		padding: {
			type: Array,
			default() {
				return ['24rpx', '32rpx'];
			}
		},
		background: {
			type: String,
			default: 'rgba(0, 0, 0, 0.6)'
		},
		color: {
			type: String,
			default: '#fff'
		},
		size: {
			type: [Number, String],
			default: 30
		},
		//left/center/right
		textAlign: {
			type: String,
			default: 'center'
		},
		//提示框top值 px
		top: {
			type: [Number, String],
			default: 0
		},
		left: {
			type: [Number, String],
			default: 0
		},
		right: {
			type: [Number, String],
			default: 0
		},
		ridus: {
			type: [Number, String],
			default: 0
		},
		zIndex: {
			type: Number,
			default: 1001
		}
	},
	watch: {
		color(val) {
			this.opts_color = val;
		},
		background(val) {
			this.opts_bg = val;
		},
		size(val) {
			this.opts_size = val;
		},
		textAlign(val) {
			this.opts_align = val;
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			statusBarHeight,
			text: '',
			timer: null,
			isShow: false,
			isNvue: isNvue,
			opts_bg: 'rgba(0, 0, 0, 0.6)',
			opts_color: '#fff',
			opts_size: 30,
			opts_align: 'center'
		};
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
	created() {
		this.setOptions();
	},
	methods: {
		setOptions(options = {}) {
			this.opts_color = options.color || this.color;
			this.opts_bg = options.background || this.background;
			this.opts_size = options.size || this.background;
			this.opts_align = options.textAlign || this.textAlign;
		},
		show(options) {
			this.clearTimer();
			this.setOptions(options);
			this.text = options.text || '';
			let duration = options.duration || 2000;
			this.isShow = true;
			// #ifndef APP-NVUE
			this.timer = setTimeout(() => {
				this.isShow = false;
			}, duration);
			// #endif

			// #ifdef APP-NVUE
			this.$nextTick(() => {
				setTimeout(() => {
					this._animation(true, duration);
				}, 50);
			});
			// #endif
		},
		// #ifdef APP-NVUE
		_animation(type, duration = 2000) {
			if (!this.$refs['wui_message_ani']) return;
			animation.transition(
				this.$refs['wui_message_ani'].ref,
				{
					styles: {
						transform: `translateY(${type ? '0' : '-100%'})`,
						opacity: type ? 1 : 0
					},
					duration: 250, //ms
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.isShow = false;
					} else {
						this.timer = setTimeout(() => {
							this._animation(false);
						}, duration);
					}
				}
			);
		},
		// #endif
		clearTimer() {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
};
</script>

<style scoped>
.wui-message__wrap {
	position: fixed;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	opacity: 0;
	/* #ifdef APP-NVUE */
	transform: translateY(-100%);
	transition-property: transform, opacity;
	/* #endif */
	/* #ifndef APP-NVUE */
	transform: translate3d(0, -100%, 0);
	visibility: hidden;
	transition-property: all;
	/* #endif */
	transition-duration: 0.25s;
	transition-delay: 0s;
	transition-timing-function: ease-in-out;
}
.wui-fixed {
	position: fixed;
}

.wui-message__flex-row {
	flex-direction: row;
}

/* #ifndef APP-NVUE */
.wui-message__show {
	visibility: visible;
	transform: translate3d(0, 0, 0);
	opacity: 1;
}

/* #endif */

.wui-message__text {
	/* #ifndef APP-NVUE */
	display: block;
	word-break: break-all;
	/* #endif */
	font-weight: normal;
}

.wui-message__text-full {
	flex: 1;
}
</style>
