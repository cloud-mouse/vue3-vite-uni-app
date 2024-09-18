<template>
	<canvas type="2d" class="jn-canvas" :canvas-id="canvasId" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
	</canvas>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance, watch } from 'vue';
// import WxCanvas from '../../static/jn-chart/wx-canvas.js';
// import * as echarts from '/static/jn-chart/echarts.js';
const WxCanvas = require('../../static/jn-chart/wx-canvas.js').default;
const echarts = require('../../static/jn-chart/echarts.js');

const props = defineProps({
	// canvas 唯一id
	canvasId: {
		type: String,
		default: 'jn-canvas'
	},
	// echarts option 配置项
	option: {
		required: true,
		type: Object,
		default() {
			return {};
		}
	},
	// 是否懒加载，如果true，第一次不会触发echarts init 绘制，props.option变化后才触发
	lazyLoad: {
		type: Boolean,
		default: false
	}
});

const emits = defineEmits(['init']);

// 当前echarts实例对象
let chart = null;
// vue 实例对象
const instance = getCurrentInstance();

onReady(() => {
	// Disable prograssive because drawImage doesn't support DOM as parameter
	// See https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
	echarts.registerPreprocessor(option => {
		if (option && option.series) {
			if (option.series.length > 0) {
				option.series.forEach(series => {
					series.progressive = 0;
				});
			} else if (typeof option.series === 'object') {
				option.series.progressive = 0;
			}
		}
	});

	// 开启懒加载第一次不初始化
	if (!props.lazyLoad) {
		init();
	}
});

// 监听数据源变化，重新触发初始化方法刷新chart
watch(() => props.option, init, { deep: true });

function init() {
	// 去除了使用旧方式初始化，基本上现在version >= 2.9.0
	initByNewWay();
}

function initByNewWay() {
	// version >= 2.9.0：使用新的方式初始化
	const query = uni.createSelectorQuery().in(instance);
	query
		.select('.jn-canvas')
		.fields({
			node: true,
			size: true
		})
		.exec(res => {
			const canvasNode = res[0].node;

			const canvasDpr = uni.getSystemInfoSync().devicePixelRatio;
			const canvasWidth = res[0].width;
			const canvasHeight = res[0].height;

			const ctx = canvasNode.getContext('2d');

			const canvas = new WxCanvas(ctx, props.canvasId, true, canvasNode);
			if (echarts.setPlatformAPI) {
				echarts.setPlatformAPI({
					createCanvas: () => canvas,
					loadImage: (src, onload, onerror) => {
						if (canvasNode.createImage) {
							const image = canvasNode.createImage();
							image.onload = onload;
							image.onerror = onerror;
							image.src = src;
							return image;
						}
						console.error('加载图片依赖 `Canvas.createImage()` API，要求小程序基础库版本在 2.7.0 及以上。');
						// PENDING fallback?
					}
				});
			} else {
				echarts.setCanvasCreator(() => canvas);
			}

			chart = initChart(canvas, canvasWidth, canvasHeight, canvasDpr, props.option);

			// 初始化后向上抛出echarts实例对象
			emits('init', chart);
		});
}

// 初始化echarts
function initChart(canvas, width, height, dpr, option) {
	const chart = echarts.init(canvas, null, {
		width: width,
		height: height,
		devicePixelRatio: dpr
	});
	canvas.setChart(chart);

	chart.setOption(option);

	return chart;
}

function touchStart(e) {
	if (chart && e.touches.length > 0) {
		let touch = e.touches[0];
		let handler = chart.getZr().handler;
		handler.dispatch('mousedown', {
			zrX: touch.x,
			zrY: touch.y,
			preventDefault: () => {},
			stopImmediatePropagation: () => {},
			stopPropagation: () => {}
		});
		handler.dispatch('mousemove', {
			zrX: touch.x,
			zrY: touch.y,
			preventDefault: () => {},
			stopImmediatePropagation: () => {},
			stopPropagation: () => {}
		});
		handler.processGesture(wrapTouch(e), 'start');
	}
}

function touchMove(e) {
	if (chart && e.touches.length > 0) {
		let touch = e.touches[0];
		let handler = chart.getZr().handler;
		handler.dispatch('mousemove', {
			zrX: touch.x,
			zrY: touch.y,
			preventDefault: () => {},
			stopImmediatePropagation: () => {},
			stopPropagation: () => {}
		});
		handler.processGesture(wrapTouch(e), 'change');
	}
}

function touchEnd(e) {
	if (chart) {
		const touch = e.changedTouches ? e.changedTouches[0] : {};
		let handler = chart.getZr().handler;
		handler.dispatch('mouseup', {
			zrX: touch.x,
			zrY: touch.y,
			preventDefault: () => {},
			stopImmediatePropagation: () => {},
			stopPropagation: () => {}
		});
		handler.dispatch('click', {
			zrX: touch.x,
			zrY: touch.y,
			preventDefault: () => {},
			stopImmediatePropagation: () => {},
			stopPropagation: () => {}
		});
		handler.processGesture(wrapTouch(e), 'end');
	}
}

function wrapTouch(event) {
	for (let i = 0; i < event.touches.length; ++i) {
		const touch = event.touches[i];
		touch.offsetX = touch.x;
		touch.offsetY = touch.y;
	}
	return event;
}
defineExpose({
	echarts
});
</script>

<style scoped>
.jn-canvas {
	width: 100%;
	height: 100%;
}
</style>
