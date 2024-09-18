<!--（手机号： 152   67 0   1  3756，身份证尾号：19   1  935）-->
<template>
	<view
		class="wui-alert__wrap"
		:class="[background ? '' : 'wui-alert__' + type]"
		:style="{
			background: background || getColor(type),
			borderRadius: radius,
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			marginTop: marginTop + 'rpx',
			marginBottom: marginBottom + 'rpx'
		}"
	>
		<view class="wui-alert__shrink" @tap.stop="leftClick">
			<slot></slot>
			<icon :type="type" :size="iconSize" :color="iconColor" v-if="!isLeft && type && type !== 'true'"></icon>
		</view>
		<view
			class="wui-alert__content"
			:class="{
				'wui-text__p-left': (!isLeft && type && type !== 'true') || (spacing && isLeft),
				'wui-text__p-right': closable
			}"
			@tap.stop="onClick"
		>
			<text class="wui-alert__text" :style="{ fontSize: size, color: color }" v-if="title">{{ title }}</text>
			<text
				class="wui-alert__text wui-desc__padding"
				:class="{ 'wui-alert__single': single }"
				:style="{ fontSize: descSize, color: descColor }"
				v-if="desc"
				>{{ desc }}</text
			>
			<slot name="content"></slot>
		</view>
		<view class="wui-alert__shrink">
			<slot name="right"></slot>
		</view>
		<icon
			@tap.stop="close"
			type="cancel"
			:size="closeSize"
			:color="closeColor"
			v-if="closable"
			:class="{ 'wui-alert__icon-close': desc }"
		>
		</icon>
	</view>
</template>

<script>
// Alert 警告框
export default {
	name: 'wui-alert',
	emits: ['leftClick', 'click', 'close'],
	props: {
		//info, success, warn, waiting,clear
		type: {
			type: String,
			default: ''
		},
		//背景色，如果设置type对应颜色失效
		background: {
			type: String,
			default: ''
		},
		//padding值：[上，右，下，左]
		padding: {
			type: Array,
			default() {
				return ['20rpx', '32rpx'];
			}
		},
		//margin-top值，单位rpx
		marginTop: {
			type: [Number, String],
			default: 0
		},
		//margin-bottom值，单位rpx
		marginBottom: {
			type: [Number, String],
			default: 0
		},
		//圆角
		radius: {
			type: String,
			default: '16rpx'
		},
		//icon颜色
		iconColor: {
			type: String,
			default: '#fff'
		},
		//icon字体大小，px
		iconSize: {
			type: Number,
			default: 22
		},
		closable: {
			type: Boolean,
			default: false
		},
		closeColor: {
			type: String,
			default: '#fff'
		},
		//关闭icon字体大小，px
		closeSize: {
			type: Number,
			default: 22
		},
		//是否自定义左侧内容,默认图标失效
		isLeft: {
			type: Boolean,
			default: false
		},
		//内容是否与图标之间有间隔，isLeft为true时生效
		spacing: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: '#fff'
		},
		size: {
			type: String,
			default: '14px'
		},
		desc: {
			type: String,
			default: ''
		},
		descColor: {
			type: String,
			default: '#fff'
		},
		descSize: {
			type: String,
			default: '12px'
		},
		//描述文字单行展示，超出隐藏
		single: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		getColor(type) {
			const color = '#1396FF';
			const colors = {
				success: '#09BE4F',
				warn: '#FFB703',
				clear: '#FF2B2B'
			};
			return colors[type] ? colors[type] : color;
		},
		leftClick() {
			this.$emit('leftClick', {});
		},
		onClick() {
			this.$emit('click', {});
		},
		close() {
			this.$emit('close', {});
		}
	}
};
</script>

<style scoped>
.wui-alert__wrap {
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: flex;
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	position: relative;
}

/* #ifndef APP-NVUE */
.wui-alert__info,
.wui-alert__waiting {
	background-color: var(--wui-color-primary, #1396ff) !important;
}

.wui-alert__success {
	background-color: var(--wui-color-success, #09be4f) !important;
}

.wui-alert__warn {
	background-color: var(--wui-color-warning, #ffb703) !important;
}

.wui-alert__clear {
	background-color: var(--wui-color-danger, #ff2b2b) !important;
}

/* #endif */

.wui-alert__shrink {
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	/* #endif */
}

.wui-alert__content {
	flex: 1;
	flex-direction: column;
	/* #ifndef APP-NVUE */
	overflow: hidden;
	/* #endif */
}

.wui-alert__text {
	/* #ifndef APP-NVUE */
	word-break: break-all;
	display: block;
	box-sizing: border-box;
	/* #endif */
}

.wui-desc__padding {
	padding-top: 3px;
}

.wui-text__p-left {
	padding-left: 20rpx;
}

.wui-text__p-right {
	padding-right: 60rpx;
}

.wui-alert__single {
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: block;
	width: 100%;
	white-space: nowrap;
	/* #endif */
	flex-direction: row;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wui-alert__icon-close {
	position: absolute;
	right: 30rpx;
	top: 16rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}
</style>
