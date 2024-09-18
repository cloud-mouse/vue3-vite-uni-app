<!--（手机号：152 6   7 013 7 5   6，身份证尾号：1   9  1935）-->
<template>
	<!-- #ifdef APP-NVUE -->
	<gcanvas
		@longpress="longtap"
		@touchstart="touchstart"
		@touchend="touchend"
		:ref="canvasId"
		:style="{ width: w + 'px', height: h + 'px' }"
	>
	</gcanvas>
	<!-- #endif -->

	<!-- #ifndef APP-NVUE || MP-QQ -->
	<canvas
		:canvas-id="canvasId"
		:id="canvasId"
		:style="{ width: w + 'px', height: h + 'px' }"
		@longtap="longtap"
		@touchstart="touchstart"
		@touchend="touchend"
		v-if="canvasId"
	></canvas>
	<!-- #endif -->

	<!-- #ifdef MP-QQ -->
	<canvas
		canvas-id="canvas_barcode"
		:style="{ width: w + 'px', height: h + 'px' }"
		@longtap="longtap"
		@touchstart="touchstart"
		@touchend="touchend"
	></canvas>
	<!-- #endif -->
</template>

<script>
import barcode from './barcode.js';

// #ifdef APP-NVUE
import { enable, WeexBridge } from './gcanvas/index.js';
// #endif
const defalutOptions = {
	number: true,
	prefix: true,
	color: '#181818',
	debug: false,
	onValid() {},
	onInvalid() {},
	onSuccess() {},
	onError() {}
};
let canvasId = '';
// #ifdef MP-WEIXIN
canvasId = `wui_bc_${Math.ceil(Math.random() * 10e5).toString(36)}`;
// #endif

// #ifdef MP-QQ
canvasId = 'canvas_barcode';
// #endif
export default {
	name: 'wui-barcode',
	emits: ['ready', 'longclick', 'touchStart', 'touchEnd'],
	props: {
		width: {
			type: [Number, String],
			default: 480
		},
		height: {
			type: [Number, String],
			default: 200
		},
		value: {
			type: [Number, String],
			default: ''
		}
	},
	data() {
		// #ifndef MP-WEIXIN || MP-QQ
		const canvasId = `wui_bc_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		// #endif
		return {
			canvasId,
			defalutOptions,
			w: 240,
			h: 100
		};
	},
	watch: {
		width(val) {
			this.w = uni.upx2px(val || 480);
		},
		height(val) {
			this.h = uni.upx2px(val || 200);
		}
	},
	created() {
		this.w = uni.upx2px(this.width || 480);
		this.h = uni.upx2px(this.height || 200);
		this.ctx = null;
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.$emit('ready', {
					canvasId: this.canvasId
				});
			}, 50);
		});
	},
	// #ifndef VUE3
	beforeUnmount() {
		this.ctx = null;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.ctx = null;
	},
	// #endif
	methods: {
		draw(options = {}) {
			if (!this.ctx) {
				// #ifdef APP-NVUE
				let ganvas = this.$refs[this.canvasId];
				/*通过元素引用获取canvas对象*/
				let canvasObj = enable(ganvas, {
					bridge: WeexBridge
				});
				/*获取绘图所需的上下文，暂不支持3d*/
				this.ctx = canvasObj.getContext('2d');
				// #endif

				// #ifndef APP-NVUE
				this.ctx = uni.createCanvasContext(this.canvasId, this);
				// #endif
			}
			const opts = Object.assign({}, this.defalutOptions, options);
			new barcode(
				String(this.value),
				Object.assign(
					{
						width: this.w,
						height: this.h
					},
					opts
				),
				this.ctx
			);
		},
		longtap() {
			this.$emit('longclick', {});
		},
		touchstart() {
			this.$emit('touchStart', {});
		},
		touchend() {
			this.$emit('touchEnd', {});
		}
	}
};
</script>

<style scoped></style>
