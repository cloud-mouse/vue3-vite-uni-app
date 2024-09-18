<!--（手机号：1 5  267    0 137  56，身份证尾号： 1 91 9 3 5）-->
<template>
	<view
		@appear="handleAppear"
		class="wui-lazyload__wrap"
		:style="{
			background: background,
			width: width + 'rpx',
			height: height == 0 ? 'auto' : height + 'rpx',
			borderRadius: radius + 'rpx',
			marginTop: marginTop + 'rpx',
			marginRight: marginRight + 'rpx',
			marginBottom: marginBottom + 'rpx',
			marginLeft: marginLeft + 'rpx'
		}"
		@tap="handleTap"
	>
		<image
			class="wui-lazyload__img"
			lazy-load
			:class="[visible ? 'wui-lazyload__visible' : 'wui-lazyload__hidden']"
			:style="{
				width: width + 'rpx',
				height: height == 0 ? 'rpx' : height + 'rpx',
				borderRadius: radius + 'rpx'
			}"
			:src="show ? src : placeholder"
			:mode="height == 0 ? 'widthFix' : mode"
			:webp="webp"
			:draggable="draggable"
			@load="handleLoad"
			@error="handleError"
			:id="elId"
		></image>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'wui-lazyload',
	emits: ['error', 'load', 'click'],
	// #ifdef MP-WEIXIN
	options: {
		virtualHost: true
	},
	// #endif
	props: {
		src: {
			type: String,
			default: ''
		},
		width: {
			type: [String, Number],
			default: 320
		},
		height: {
			type: [String, Number],
			default: 320
		},
		radius: {
			type: [String, Number],
			default: 0
		},
		placeholder: {
			type: String,
			default: ''
		},
		background: {
			type: String,
			default: '#EEEEEE'
		},
		mode: {
			type: String,
			default: 'widthFix'
		},
		webp: {
			type: Boolean,
			default: false
		},
		draggable: {
			type: Boolean,
			default: true
		},
		marginTop: {
			type: [String, Number],
			default: 0
		},
		marginRight: {
			type: [String, Number],
			default: 0
		},
		marginBottom: {
			type: [String, Number],
			default: 0
		},
		marginLeft: {
			type: [String, Number],
			default: 0
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			show: false,
			visible: false,
			elId: `wui_lazy_${Math.ceil(Math.random() * 10e5).toString(36)}`
		};
	},
	created() {
		this.visible = this.placeholder ? true : false;
		this.observer = null;
	},
	// #ifndef APP-NVUE
	mounted() {
		setTimeout(() => {
			// #ifdef H5
			if (window.self === window.top) {
				this.startObserver();
			} else {
				//嵌套在iframe中
				this.handleFade();
			}
			// #endif

			// #ifndef H5
			this.startObserver();
			// #endif
		}, 50);
	},
	// #endif
	// #ifndef VUE3
	beforeUnmount() {
		this.endObserver();
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.endObserver();
	},
	// #endif
	methods: {
		handleFade() {
			setTimeout(() => {
				this.show = true;
			}, 200);
			this.visible = false;
			setTimeout(() => {
				this.visible = true;
			}, 500);
		},
		endObserver() {
			if (this.observer) {
				this.observer.disconnect();
				this.observer = null;
			}
		},
		startObserver() {
			if (this.observer || this.show) return;
			try {
				const observer = uni.createIntersectionObserver(this);
				observer
					.relativeToViewport({
						bottom: 50
					})
					.observe(`#${this.elId}`, res => {
						if (res.intersectionRatio > 0 && !this.show) {
							this.handleFade();
							this.endObserver();
						}
					});
				this.observer = observer;
			} catch (e) {
				this.handleFade();
				this.endObserver();
			}
		},
		handleAppear(e) {
			if (this.observer || this.show) return;
			this.handleFade();
		},
		handleError(e) {
			if (!this.show) return;
			this.$emit('error', {
				detail: e.detail,
				param: this.param
			});
		},
		handleLoad(e) {
			if (!this.show) return;
			this.$emit('load', {
				detail: e.detail,
				param: this.param
			});
		},
		handleTap() {
			this.$emit('click', {
				param: this.param
			});
		}
	}
};
</script>

<style scoped>
.wui-lazyload__wrap {
	/* #ifndef APP-NVUE */
	display: inline-flex;
	flex-shrink: 0;
	/* #endif */
	position: relative;
}

.wui-lazyload__img {
	/* #ifndef APP-NVUE */
	display: block;
	flex-shrink: 0;
	/* #endif */
	transition-duration: 0.35s;
	transition-property: opacity;
	transition-timing-function: linear;
}

.wui-lazyload__visible {
	/* #ifndef APP-NVUE */
	visibility: visible;
	/* #endif */
	opacity: 1;
}

.wui-lazyload__hidden {
	/* #ifndef APP-NVUE */
	visibility: hidden;
	/* #endif */
	opacity: 0;
}
</style>
