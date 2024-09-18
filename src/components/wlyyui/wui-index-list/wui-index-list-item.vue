<!--（手机号：1 5 2 67    01  3 756，身份证尾号：1   91 9 35）-->
<template>
	<view class="wui-index__list-item" :class="{ 'wui-il__between': subRight }" @tap="onClick">
		<view class="wui-index__list-left">
			<view
				class="wui-il__checkbox"
				:class="{
					'wui-il__checkbox-color': (!selectedColor || selectedColor == 'true') && model.checked
				}"
				:style="{
					background: model.checked ? selectedColor : '#fff',
					borderColor: model.checked ? selectedColor : borderColor
				}"
				v-if="isSelect"
			>
				<view class="wui-il__checkmark" v-if="model.checked"></view>
			</view>
			<view class="wui-il__img-box" v-if="isSrc">
				<image v-if="model.src" :src="model.src" class="wui-index__list-img" mode="widthFix"></image>
			</view>
			<text class="wui-index__list-main">{{ model.text || '' }}</text>
		</view>
		<text class="wui-index__list-sub">{{ model.subText || '' }}</text>
		<view class="wui-il__border-bottom" v-if="!last"></view>
	</view>
</template>

<script>
//此组件为索引列表item项，若不满足要求可自行调整样式
export default {
	name: 'w-index-list-item',
	props: {
		model: {
			type: Object,
			default() {
				return {};
			}
		},
		isSelect: {
			type: Boolean,
			default: false
		},
		selectedColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#465CFF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//checkbox未选中时边框颜色
		borderColor: {
			type: String,
			default: '#ccc'
		},
		//是否显示图片
		isSrc: {
			type: Boolean,
			default: false
		},
		//次要内容是否居右侧
		subRight: {
			type: Boolean,
			default: true
		},
		last: {
			type: Boolean,
			default: false
		},
		idx: {
			type: Number,
			default: 0
		},
		index: {
			type: Number,
			default: 0
		}
	},
	methods: {
		onClick() {
			this.$emit('itemClick', {
				idx: this.idx,
				index: this.index
			});
		}
	}
};
</script>

<style scoped>
.wui-index__list-item {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	padding: 32rpx 64rpx 32rpx 32rpx;
	background-color: #ffffff;
	position: relative;
}

.wui-il__border-bottom {
	position: absolute;
	bottom: 0;
	/* #ifdef APP-NVUE */
	height: 0.5px;
	z-index: -1;
	background-color: #eeeeee;
	/* #endif */
	/* #ifndef APP-NVUE */
	height: 1px;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 100%;
	z-index: 1;
	background-color: var(--wui-color-border, #eeeeee);
	/* #endif */
	left: 32rpx;
	right: 0;
}

.wui-index__list-item:active {
	/* #ifdef APP-NVUE */
	background-color: rgba(0, 0, 0, 0.2) !important;
	/* #endif */

	/* #ifndef APP-NVUE */
	background-color: var(--wui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
	/* #endif */
}

.wui-il__between {
	justify-content: space-between;
}

.wui-index__list-left {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	overflow: hidden;
}

.wui-il__checkbox {
	font-size: 0;
	color: rgba(0, 0, 0, 0);
	width: 40rpx;
	height: 40rpx;
	border-width: 1px;
	border-style: solid;
	/* #ifdef APP-NVUE */
	border-radius: 40rpx;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: inline-flex;
	box-sizing: border-box;
	border-radius: 50%;
	vertical-align: top;
	flex-shrink: 0;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: relative;
	margin-right: 24rpx;
}

/* #ifndef APP-NVUE */
.wui-il__checkbox-color {
	background: var(--wui-color-primary, #465cff) !important;
	border-color: var(--wui-color-primary, #465cff) !important;
}

/* #endif */

.wui-il__checkmark {
	width: 20rpx;
	height: 40rpx;
	border-bottom-style: solid;
	border-bottom-width: 3px;
	border-bottom-color: #ffffff;
	border-right-style: solid;
	border-right-width: 3px;
	border-right-color: #ffffff;
	transform: rotate(45deg) scale(0.5);
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	transform: rotate(45deg) scale(0.5) translateZ(0);
	/* #endif */
	/* #ifdef APP-NVUE */
	transform: rotate(45deg) scale(0.5);
	/* #endif */
	transform-origin: 54% 48%;
}

.wui-il__img-box {
	/* #ifndef APP-NVUE */
	display: flex;
	background-color: var(--wui-bg-color-content, #f8f8f8);
	/* #endif */
	width: 72rpx;
	height: 72rpx;
	align-items: center;
	justify-content: center;
	border-radius: 8rpx;
	overflow: hidden;
	/* #ifdef APP-NVUE */
	background-color: #f8f8f8;
	/* #endif */
	margin-right: 24rpx;
}

.wui-index__list-img {
	width: 72rpx;
	height: 72rpx;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	/* #endif */
	border-radius: 8rpx;
}

.wui-index__list-main {
	/* #ifndef APP-NVUE */
	display: block;
	white-space: nowrap;
	/* #endif */
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	font-size: 32rpx;
	font-weight: normal;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wui-index__list-sub {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	font-weight: normal;
	font-size: 28rpx;
	color: #999;
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	padding-left: 24rpx;
}
</style>
