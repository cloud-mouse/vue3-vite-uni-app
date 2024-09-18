<!--（手机号：1   52 6 70 1 37 5  6，身份证尾号：1  9  19 35）-->
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
		canvas-id="canvas_qrcode"
		:style="{ width: w + 'px', height: h + 'px' }"
		@longtap="longtap"
		@touchstart="touchstart"
		@touchend="touchend"
	></canvas>
	<!-- #endif -->
</template>

<script>
import wuiQr from './wui-qr/index.js';

// #ifdef APP-NVUE
import { enable, WeexBridge } from './gcanvas/index.js';
// #endif

const utf16to8 = str => {
	const len = str.length;
	let out = '';

	for (let i = 0; i < len; i++) {
		const c = str.charCodeAt(i);

		if (c >= 0x0001 && c <= 0x007f) {
			out += str.charAt(i);
		} else if (c > 0x07ff) {
			out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
		} else {
			out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
		}
	}

	return out;
};
export default {
	name: 'wui-qrcode',
	emits: ['ready', 'longclick', 'touchStart', 'touchEnd'],
	props: {
		width: {
			type: [Number, String],
			default: 400
		},
		height: {
			type: [Number, String],
			default: 400
		},
		value: {
			type: String,
			default: ''
		},
		foreground: {
			type: String,
			default: '#181818'
		},
		background: {
			type: String,
			default: '#ffffff'
		}
	},
	data() {
		let canvasId = '';
		// #ifdef MP-WEIXIN
		canvasId = `wui_qr_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		// #endif
		// #ifdef MP-QQ
		canvasId = 'canvas_qrcode';
		// #endif
		// #ifndef MP-WEIXIN || MP-QQ
		canvasId = `wui_qr_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		// #endif
		return {
			canvasId,
			//误差校正等级
			errorCorrectLevel: 2,
			//类型
			typeNumber: -1,
			w: 200,
			h: 200
		};
	},
	computed: {
		initDraw() {
			return `${this.width}_${this.height}_${this.foreground}_${this.background}_${this.value}`;
		}
	},
	watch: {
		initDraw(val) {
			this.w = uni.upx2px(this.width || 400);
			this.h = uni.upx2px(this.height || 400);
			this.$nextTick(() => {
				this.draw();
			});
		}
	},
	created() {
		this.w = uni.upx2px(this.width || 400);
		this.h = uni.upx2px(this.height || 400);
		this.ctx = null;
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.draw();
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
		draw() {
			const qrcode = wuiQr(utf16to8(this.value), {
				typeNumber: this.typeNumber,
				errorCorrectLevel: this.errorCorrectLevel
			});
			const cells = qrcode.modules;
			const tileW = this.w / cells.length;
			const tileH = this.h / cells.length;

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
			this.ctx.scale(1, 1);

			cells.forEach((row, rdx) => {
				row.forEach((cell, cdx) => {
					this.ctx.setFillStyle(cell ? this.foreground : this.background);
					const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
					const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
					this.ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
				});
			});
			this.ctx.draw();
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
