<!--（手机号：152670 13  7   5    6，身份证尾号：  19 1 93 5）-->
<template>
	<view class="wui-timeaxis__node-wrap">
		<view class="wui-timeaxis__left" :style="{ width: leftWidth + 'rpx' }">
			<slot name="left"></slot>
		</view>
		<view class="wui-timeaxis__node-box" :style="{ width: width + 'rpx' }">
			<view class="wui-timeaxis__node">
				<slot></slot>
			</view>
			<view class="wui-timeaxis__line" :style="{ background: lineColor, width: lineWidth + 'px' }" v-if="lined"></view>
		</view>
		<view class="wui-timeaxis__content">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-timeaxis-node',
	inject: ['timeaxis'],
	props: {
		lined: {
			type: Boolean,
			default: true
		},
		lineColor: {
			type: String,
			default: '#ccc'
		}
	},
	data() {
		return {
			lineWidth: 1,
			width: 48,
			leftWidth: 0
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			if (this.timeaxis) {
				this.width = this.timeaxis.width;
				this.lineWidth = this.timeaxis.lineWidth;
				this.leftWidth = this.timeaxis.leftWidth;
				this.timeaxis.children.push(this);
			}
		}
	}
};
</script>

<style scoped>
.wui-timeaxis__node-wrap {
	position: relative;
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex-direction: row;
}

.wui-timeaxis__line {
	/* #ifdef APP-NVUE */
	width: 0.5px;
	/* #endif */
	/* #ifndef APP-NVUE */
	width: 1px;
	transform: scaleX(0.5) translateZ(0);
	transform-origin: center center;
	/* #endif */
	flex: 1;
}

.wui-timeaxis__node-box {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	flex-direction: column;
	align-items: center;
	overflow: hidden;
}

.wui-timeaxis__node {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
}

.wui-timeaxis__left {
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	/* #endif */
	overflow: hidden;
}

.wui-timeaxis__content {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	flex: 1;
	min-width: 0;
}
</style>
