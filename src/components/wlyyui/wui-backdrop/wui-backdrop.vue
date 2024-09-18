<!--（手机号： 152   67  0 13  7 56，身份证尾号：19 1  9 3 5）-->
<template>
	<!-- #ifdef APP-NVUE -->
	<view
		ref="wui_bd_ani"
		class="wui-backdrop__wrap"
		:style="{
			background: background,
			position: absolute ? 'absolute' : 'fixed',
			width: absolute && full ? winWidth + 'px' : '100%',
			height: absolute && full ? winHeight + 'px' : '100%'
		}"
		@tap.stop="handleClick"
	>
		<slot></slot>
	</view>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<view
		class="wui-backdrop__wrap"
		:class="{ 'wui-backdrop__bg': !background, 'wui-backdrop__show': show }"
		:style="{
			background: background,
			position: absolute ? 'absolute' : 'fixed',
			zIndex: zIndex
		}"
		@tap.stop="handleClick"
	>
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-backdrop',
	emits: ['click'],
	props: {
		show: {
			type: Boolean,
			default: false
		},
		background: {
			type: String,
			// #ifdef APP-NVUE
			default: 'rgba(0, 0, 0, 0.6)',
			// #endif

			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//是否绝对定位，默认固定定位fixed
		absolute: {
			type: Boolean,
			default: false
		},
		//absolute定位且组件在根目录下时是否铺满屏幕,仅nvue有效
		full: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: Number,
			default: 999
		},
		closable: {
			type: Boolean,
			default: false
		}
	},
	// #ifdef APP-NVUE
	watch: {
		show(val) {
			if (val) {
				this.openAni();
			} else {
				this.closeAni();
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.show) {
				this._ani(true);
			} else {
				this._aniHidden(this.show);
			}
		});
	},
	data() {
		return {
			winWidth: 300,
			winHeight: 600
		};
	},
	created() {
		let sys = uni.getSystemInfoSync();
		this.winWidth = sys.windowWidth;
		this.winHeight = sys.windowHeight;
	},
	// #endif
	methods: {
		// #ifdef APP-NVUE
		openAni() {
			this._aniHidden(true, () => {
				this._ani(true);
			});
		},
		closeAni(type) {
			this._ani(false, () => {
				this._aniHidden(false);
			});
		},
		_ani(type, callback) {
			let styles = {
				opacity: type ? 1 : 0
			};
			if (!this.$refs['wui_bd_ani']) return;
			animation.transition(
				this.$refs['wui_bd_ani'].ref,
				{
					styles,
					duration: 200, //ms
					timingFunction: 'ease-in',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					callback && callback();
				}
			);
		},
		_aniHidden(isShow, callback) {
			if (!this.$refs['wui_bd_ani']) return;
			let styles = {
				transform: isShow ? 'translateX(0px)' : 'translateX(-1500px)'
			};
			animation.transition(
				this.$refs['wui_bd_ani'].ref,
				{
					styles,
					duration: 0,
					needLayout: false,
					delay: 0
				},
				() => {
					callback && callback();
				}
			);
		},
		// #endif
		handleClick() {
			if (this.closable && this.show) {
				this.$emit('click');
			}
		}
	}
};
</script>

<style scoped>
.wui-backdrop__wrap {
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	visibility: hidden;
	transition: all 0.3s;
	/* #endif */
	align-items: center;
	justify-content: center;
	opacity: 0;
}

/* #ifndef APP-NVUE */
.wui-backdrop__bg {
	background: var(--wui-bg-color-mask, rgba(0, 0, 0, 0.6)) !important;
}

.wui-backdrop__show {
	visibility: visible !important;
	opacity: 1 !important;
}

/* #endif */
</style>
