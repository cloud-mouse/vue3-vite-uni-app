<!--（手机号：   15267      0137 56，身份证尾号： 19 19   35）-->
<template>
	<text
		:class="[
			dot ? 'wui-badge__dot' : 'wui-badge__wrap',
			background ? '' : 'wui-badge__bg-' + type,
			absolute ? 'wui-badge__absolute' : '',
			scaleRatio != 1 && isNvue ? 'wui-badge__trans-origin' : '',
			!background && type === 'white' ? 'wui-badge__text-color' : ''
		]"
		:style="{
			top: absolute ? top : 'auto',
			right: absolute ? right : 'auto',
			zoom: scaleRatio,
			transform: isNvue ? `scale(${scaleRatio})` : 'scale(1)',
			marginTop: marginTop + 'rpx',
			marginLeft: marginLeft + 'rpx',
			marginRight: marginRight + 'rpx',
			width: width,
			color: color,
			background: background
		}"
		@tap="handleClick"
		v-if="showValue || dot"
		>{{ dot ? '' : showValue }}</text
	>
</template>

<script>
export default {
	name: 'wui-badge',
	emits: ['click'],
	props: {
		value: {
			type: [Number, String],
			default: ''
		},
		max: {
			type: [Number, String],
			default: -1
		},
		//类型：primary，success，warning，danger，purple，white
		type: {
			type: String,
			default: 'primary'
		},
		//背景色，如果设置背景则type失效
		background: {
			type: String,
			default: ''
		},
		//字体颜色
		color: {
			type: String,
			default: '#FFFFFF'
		},
		//是否显示为圆点
		dot: {
			type: Boolean,
			default: false
		},
		//margin-top值，单位rpx
		marginTop: {
			type: [Number, String],
			default: 0
		},
		//margin-left值，单位rpx
		marginLeft: {
			type: [Number, String],
			default: 0
		},
		//margin-right值，单位rpx
		marginRight: {
			type: [Number, String],
			default: 0
		},
		//是否绝对定位
		absolute: {
			type: Boolean,
			default: false
		},
		top: {
			type: String,
			default: '-8rpx'
		},
		right: {
			type: String,
			default: '-18rpx'
		},
		//缩放比例
		scaleRatio: {
			type: Number,
			default: 1
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue: isNvue,
			width: 0,
			showValue: ''
		};
	},
	watch: {
		value(val) {
			this.getWidth();
		}
	},
	mounted() {
		this.getWidth();
	},
	methods: {
		getWidth() {
			let max = Number(this.max);
			let val = Number(this.value);
			let value = '';
			if (isNaN(val) || max === -1) {
				value = this.value;
			} else {
				value = val > max ? `${max}+` : val;
			}
			this.showValue = value;
			this.width = this.dot ? '8px' : String(value).length * 16 + 21 + 'rpx';
		},
		handleClick() {
			this.$emit('click');
		}
	}
};
</script>

<style scoped>
.wui-badge__wrap {
	height: 36rpx;
	padding: 0 12rpx;
	color: #ffffff;
	font-size: 24rpx;
	line-height: 36rpx;
	border-radius: 100px;
	/* #ifndef APP-NVUE */
	min-width: 36rpx !important;
	display: flex;
	box-sizing: border-box;
	white-space: nowrap;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.wui-badge__dot {
	height: 8px !important;
	width: 8px !important;
	/* #ifdef APP-NVUE */
	border-radius: 100px;
	/* #endif */

	/* #ifndef APP-NVUE */
	display: inline-block;
	/* #endif */

	/* #ifndef APP-NVUE */
	border-radius: 50%;
	/* #endif */
	z-index: 10;
}

/* #ifndef APP-NVUE */
.wui-badge__bg-primary {
	background-color: var(--wui-color-primary, #1396ff) !important;
}

.wui-badge__bg-success {
	background-color: var(--wui-color-success, #09be4f) !important;
}

.wui-badge__bg-warning {
	background-color: var(--wui-color-warning, #ffb703) !important;
}

.wui-badge__bg-danger {
	background-color: var(--wui-color-danger, #ff2b2b) !important;
}

.wui-badge__bg-purple {
	background-color: var(--wui-color-purple, #6831ff) !important;
}

.wui-badge__bg-white {
	background-color: var(--wui-color-white, #ffffff) !important;
}

.wui-badge__text-color {
	color: var(--wui-color-danger, #ff2b2b) !important;
}

/* #endif */

/* #ifdef APP-NVUE */
.wui-badge__bg-primary {
	background-color: #1396ff !important;
}

.wui-badge__bg-success {
	background-color: #09be4f !important;
}

.wui-badge__bg-warning {
	background-color: #ffb703 !important;
}

.wui-badge__bg-danger {
	background-color: #ff2b2b !important;
}

.wui-badge__bg-purple {
	background-color: #6831ff !important;
}

.wui-badge__bg-white {
	background-color: #ffffff !important;
}

.wui-badge__text-color {
	color: #ff2b2b !important;
}

.wui-badge__trans-origin {
	transform-origin: center center;
}

/* #endif */
.wui-badge__absolute {
	position: absolute;
}
</style>
