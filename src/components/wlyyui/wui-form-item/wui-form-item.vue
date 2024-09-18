<!--（手机号： 1 52 670  13   75  6，身份证尾号：  1 919 3 5）-->
<template>
	<view
		class="wui-form__item-wrap"
		:class="{ 'wui-form__highlight': highlight }"
		:style="{
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			background: background,
			marginTop: marginTop + 'rpx',
			marginBottom: marginBottom + 'rpx',
			borderRadius: radius
		}"
		@tap="handleClick"
	>
		<!-- #ifdef APP-NVUE -->
		<view class="wui-form__asterisk" :style="{ left: getAkPosi }" v-if="asterisk">
			<text :style="{ color: asteriskColor || akColor || '#FF2B2B' }">*</text>
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<view class="wui-form__asterisk" v-if="asterisk" :style="{ color: asteriskColor || akColor || '#FF2B2B', left: getAkPosi }"
			>*</view
		>
		<!-- #endif -->
		<text
			class="wui-form__item-sizing"
			:style="{
				width: getLabelWidth,
				fontSize: getLabelSize,
				color: labelColor || lColor || '#333',
				paddingRight: getLabelRight,
				textAlign: getLabelAlign
			}"
			v-if="label"
			>{{ label }}</text
		>
		<view class="wui-form__item-content">
			<slot></slot>
		</view>
		<slot name="right"></slot>
		<view
			v-if="bottomBorder"
			:style="{
				background: borderColor,
				left: left + 'rpx',
				right: right + 'rpx'
			}"
			class="wui-form__item-bottom"
		></view>
		<view class="wui-form__item-arrow" v-if="arrow" :style="{ 'border-color': arrowColor }"> </view>
	</view>
</template>

<script>
export default {
	name: 'wui-form-item',
	emits: ['click'],
	inject: ['form'],
	props: {
		//padding值，上、右、下、左
		padding: {
			type: Array,
			default() {
				return ['28rpx', '32rpx'];
			}
		},
		//margin-top 单位rpx
		marginTop: {
			type: [Number, String],
			default: 0
		},
		//margin-bottom 单位rpx
		marginBottom: {
			type: [Number, String],
			default: 0
		},
		//标签文本
		label: {
			type: String,
			default: ''
		},
		//标题字体大小 默认使用全局设置值
		labelSize: {
			type: [Number, String],
			default: 0
		},
		labelColor: {
			type: String,
			default: ''
		},
		//label宽度 rpx 默认使用全局设置值
		labelWidth: {
			type: [Number, String],
			default: 0
		},
		//默认使用全局设置值
		labelRight: {
			type: [Number, String],
			default: 0
		},
		//label 对齐方式：left，right
		labelAlign: {
			type: String,
			default: ''
		},
		//是否显示必填的红色星号
		asterisk: {
			type: Boolean,
			default: false
		},
		asteriskColor: {
			type: String,
			default: ''
		},
		//left,right
		asteriskPosition: {
			type: String,
			default: ''
		},
		background: {
			type: String,
			default: '#fff'
		},
		highlight: {
			type: Boolean,
			default: false
		},
		arrow: {
			type: Boolean,
			default: false
		},
		arrowColor: {
			type: String,
			default: '#B2B2B2'
		},
		bottomBorder: {
			type: Boolean,
			default: true
		},
		borderColor: {
			type: String,
			default: '#EEEEEE'
		},
		//下边框left值，单位rpx
		left: {
			type: [Number, String],
			default: 32
		},
		//下边框right值，单位rpx
		right: {
			type: [Number, String],
			default: 32
		},
		radius: {
			type: String,
			default: '0'
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		//优先级：form-item组件props > form组件props > 全局属性值
		getLabelSize() {
			const labelSize = (uni.$wui && uni.$wui.wuiFormItem && uni.$wui.wuiFormItem.labelSize) || 32;
			return `${this.labelSize || this.lSize || labelSize}rpx`;
		},
		getLabelWidth() {
			const labelWidth = (uni.$wui && uni.$wui.wuiFormItem && uni.$wui.wuiFormItem.labelWidth) || 160;
			return `${this.labelWidth || this.lWidth || labelWidth}rpx`;
		},
		getLabelRight() {
			const labelRight = (uni.$wui && uni.$wui.wuiFormItem && uni.$wui.wuiFormItem.labelRight) || 30;
			return `${this.labelRight || labelRight}rpx`;
		},
		getLabelAlign() {
			const labelAlign = (uni.$wui && uni.$wui.wuiFormItem && uni.$wui.wuiFormItem.labelAlign) || 'left';
			return this.labelAlign || this.lAlign || labelAlign;
		},
		getAkPosi() {
			const akPosi = (uni.$wui && uni.$wui.wuiFormItem && uni.$wui.wuiFormItem.asteriskPosition) || 'left';
			const position = this.asteriskPosition || this.akPosi || akPosi;
			const lWidth = this.getLabelWidth.replace('rpx', '');
			const lRight = this.getLabelRight.replace('rpx', '');
			const pr = this.padding[1];
			const pdr = pr ? pr.replace('rpx', '').replace('px', '') : 0;
			return position === 'right' ? `${Number(lWidth) + Number(pdr || 0) - Number(lRight || 0)}rpx` : '12rpx';
		}
	},
	data() {
		return {
			lSize: 0,
			lColor: '',
			lWidth: 0,
			lAlign: '',
			akColor: '',
			akPosi: ''
		};
	},
	created() {
		this.initParam();
	},
	methods: {
		initParam() {
			//后续做功能扩展，如错误消息提示
			if (this.form) {
				this.lSize = this.form.labelSize;
				this.lColor = this.form.labelColor;
				this.lWidth = this.form.labelWidth;
				this.lAlign = this.form.labelAlign;
				this.akColor = this.form.asteriskColor;
				this.akPosi = this.form.asteriskPosition;
			}
		},
		handleClick() {
			this.$emit('click', {
				param: this.param
			});
		}
	}
};
</script>

<style scoped>
.wui-form__item-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	display: flex;
	/* #endif */
	flex-direction: row;
	flex: 1;
	align-items: center;
	position: relative;
}

.wui-form__highlight:active {
	/* #ifdef APP-NVUE */
	background-color: rgba(0, 0, 0, 0.2) !important;
	/* #endif */

	/* #ifndef APP-NVUE */
	background-color: var(--wui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
	/* #endif */
}

.wui-form__asterisk {
	position: absolute;
	left: 12rpx;
	/* #ifndef APP-NVUE */
	height: 30rpx;
	top: 50%;
	transform: translateY(-50%);
	line-height: 1.15;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex: 1;
	align-items: center;
	justify-content: center;
	line-height: 1;
	/* #endif */
}

.wui-form__item-label {
	padding-right: 12rpx;
	/* #ifndef APP-NVUE */
	display: inline-block;
	flex-shrink: 0;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-form__item-sizing {
	box-sizing: border-box;
}

/* #endif */

.wui-form__item-content {
	flex: 1;
}

.wui-form__item-bottom {
	position: absolute;
	bottom: 0;
	/* #ifdef APP-NVUE */
	height: 0.5px;
	z-index: -1;
	/* #endif */
	/* #ifndef APP-NVUE */
	height: 1px;
	-webkit-transform: scaleY(0.5) translateZ(0);
	transform: scaleY(0.5) translateZ(0);
	transform-origin: 0 100%;
	z-index: 1;
	/* #endif */
}

.wui-form__item-arrow {
	height: 40rpx;
	width: 40rpx;
	border-width: 3px 3px 0 0;
	border-style: solid;
	transform: rotate(45deg) scale(0.5);
	/* #ifndef APP-NVUE */
	border-radius: 4rpx;
	flex-shrink: 0;
	margin-left: auto;
	box-sizing: border-box;
	/* #endif */
	/* #ifdef APP-NVUE */
	border-top-right-radius: 3rpx;
	/* #endif */
	transform-origin: center center;
	margin-right: -5.8579rpx;
}
</style>
