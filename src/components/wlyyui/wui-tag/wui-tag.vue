<!--（手机号：1  526701  3 7    5 6，身份证尾号：  19 1 93 5）-->
<template>
	<view
		class="wui-tag__wrap"
		:class="[
			highlight ? 'wui-tag__opacity' : '',
			originLeft ? 'wui-tag__origin-left' : '',
			originRight ? 'wui-tag__origin-right' : '',
			!background ? `wui-tag__${type}-${theme}` : ''
		]"
		:style="{
			backgroundColor: getBackground,
			fontSize: size + 'rpx',
			lineHeight: size + 'rpx',
			color: color,
			borderColor: getBorderColor,
			zoom: isNvue ? 1 : scaleRatio,
			transform: `scale(${isNvue ? scaleRatio : 1})`,
			borderRadius: radius + 'rpx',
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			marginTop: marginTop + 'rpx',
			marginRight: marginRight + 'rpx',
			marginBottom: marginBottom + 'rpx',
			marginLeft: marginLeft + 'rpx'
		}"
		@tap="handleClick"
	>
		<text
			v-if="text"
			class="wui-tag__text"
			:class="[!background ? `wui-tag_${type}-${theme}` : '']"
			:style="{
				fontSize: size + 'rpx',
				lineHeight: size + 'rpx',
				color: getColor
			}"
			>{{ text }}</text
		>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'wui-tag',
	emits: ['click'],
	props: {
		text: {
			type: String,
			default: ''
		},
		//类型：primary，success，warning，danger，purple
		type: {
			type: String,
			default: 'primary'
		},
		//三种主题：dark、light、plain。background为空时生效
		theme: {
			type: String,
			default: 'dark'
		},
		//背景色，如果设置背景则type失效
		background: {
			type: String,
			default: ''
		},
		borderColor: {
			type: String,
			default: ''
		},
		//字体颜色
		color: {
			type: String,
			default: ''
		},
		//字体大小 rpx
		size: {
			type: [Number, String],
			default: 24
		},
		//缩放比例
		scaleRatio: {
			type: Number,
			default: 1
		},
		originLeft: {
			type: Boolean,
			default: false
		},
		originRight: {
			type: Boolean,
			default: false
		},
		//是否有点击效果
		highlight: {
			type: Boolean,
			default: false
		},
		radius: {
			type: [Number, String],
			default: 8
		},
		//padding值，上右下左，同css顺序
		padding: {
			type: Array,
			default() {
				return ['16rpx', '32rpx'];
			}
		},
		//margin-top值
		marginTop: {
			type: [Number, String],
			default: 0
		},
		marginBottom: {
			type: [Number, String],
			default: 0
		},
		marginLeft: {
			type: [Number, String],
			default: 0
		},
		marginRight: {
			type: [Number, String],
			default: 0
		},
		index: {
			type: Number,
			default: 0
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue: isNvue,
			// #ifdef APP-NVUE
			dark: {
				primary: '#1396FF',
				success: '#09BE4F',
				warning: '#FFB703',
				danger: '#FF2B2B',
				purple: '#6831FF'
			},
			light: {
				primary: '#F1F4FA',
				success: 'rgba(9, 190, 79, .05)',
				warning: 'rgba(255, 183, 3, .1)',
				danger: 'rgba(255, 43, 43, .05)',
				purple: 'rgba(104, 49, 255, .05)'
			}
			// #endif
		};
	},
	computed: {
		getBackground() {
			let background = this.background;
			// #ifdef APP-NVUE
			if (!background) {
				switch (this.theme) {
					case 'light':
						background = this.light[this.type];
						break;
					case 'dark':
						background = this.dark[this.type];
						break;
					default:
						background = 'rgba(0,0,0,0)';
						break;
				}
			}
			// #endif
			return background;
		},
		getColor() {
			let color = this.color;
			// #ifdef APP-NVUE
			if (!color) {
				if (this.theme === 'dark') {
					color = '#fff';
				} else {
					color = this.dark[this.type];
				}
			}
			// #endif
			return color;
		},
		getBorderColor() {
			let borderColor = this.borderColor;
			// #ifdef APP-NVUE
			if (!borderColor) {
				if (this.theme === 'light') {
					borderColor = this.light[this.type];
				} else {
					borderColor = this.dark[this.type];
				}
			}
			// #endif
			return borderColor;
		}
	},
	methods: {
		handleClick() {
			this.$emit('click', {
				index: this.index
			});
		}
	}
};
</script>

<style scoped>
.wui-tag__wrap {
	/* #ifndef APP-NVUE */
	display: inline-flex;
	box-sizing: border-box;
	flex-shrink: 0;
	max-width: 100%;
	white-space: nowrap;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	position: relative;
	/* #ifdef APP-NVUE */
	border-width: 0.5px;
	/* #endif */
	/* #ifndef APP-NVUE */
	border-width: 1rpx;
	/* #endif */
	border-style: solid;
	border-color: transparent;
	font-weight: normal;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wui-tag__text {
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	white-space: nowrap;
	/* #endif */
	overflow: hidden;
	text-overflow: ellipsis;
}

/* #ifndef APP-NVUE */
.wui-tag__primary-dark {
	background-color: var(--wui-color-primary, #1396ff) !important;
	border-color: var(--wui-color-primary, #1396ff) !important;
	color: #ffffff !important;
}

.wui-tag_primary-dark,
.wui-tag_success-dark,
.wui-tag_warning-dark,
.wui-tag_danger-dark,
.wui-tag_purple-dark {
	color: #ffffff !important;
}

.wui-tag__success-dark {
	background-color: var(--wui-color-success, #09be4f) !important;
	border-color: var(--wui-color-success, #09be4f) !important;
	color: #ffffff !important;
}

.wui-tag__warning-dark {
	background-color: var(--wui-color-warning, #ffb703) !important;
	border-color: var(--wui-color-warning, #ffb703) !important;
	color: #ffffff !important;
}

.wui-tag__danger-dark {
	background-color: var(--wui-color-danger, #ff2b2b) !important;
	border-color: var(--wui-color-danger, #ff2b2b) !important;
	color: #ffffff !important;
}

.wui-tag__purple-dark {
	background-color: var(--wui-color-purple, #6831ff) !important;
	border-color: var(--wui-color-purple, #6831ff) !important;
	color: #ffffff !important;
}

.wui-tag__primary-light {
	background-color: var(--wui-bg-color-grey, #f1f4fa) !important;
	border-color: var(--wui-bg-color-grey, #f1f4fa) !important;
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-tag_primary-light,
.wui-tag_primary-plain {
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-tag__success-light {
	background-color: var(--wui-bg-color-green, rgba(9, 190, 79, 0.05)) !important;
	border-color: var(--wui-bg-color-green, rgba(9, 190, 79, 0.05)) !important;
	color: var(--wui-color-success, #09be4f) !important;
}

.wui-tag_success-light,
.wui-tag_success-plain {
	color: var(--wui-color-success, #09be4f) !important;
}

.wui-tag__warning-light {
	background-color: var(--wui-bg-color-yellow, rgba(255, 183, 3, 0.1)) !important;
	border-color: var(--wui-bg-color-yellow, rgba(255, 183, 3, 0.1)) !important;
	color: var(--wui-color-warning, #ffb703) !important;
}

.wui-tag_warning-light,
.wui-tag_warning-plain {
	color: var(--wui-color-warning, #ffb703) !important;
}

.wui-tag__danger-light {
	background-color: var(--wui-bg-color-red, rgba(255, 43, 43, 0.05)) !important;
	border-color: var(--wui-bg-color-red, rgba(255, 43, 43, 0.05)) !important;
	color: var(--wui-color-danger, #ff2b2b) !important;
}

.wui-tag__danger-light,
.wui-tag__danger-plain {
	color: var(--wui-color-danger, #ff2b2b) !important;
}

.wui-tag__purple-light {
	background-color: var(--wui-bg-color-purple, rgba(104, 49, 255, 0.05)) !important;
	border-color: var(--wui-bg-color-purple, rgba(104, 49, 255, 0.05)) !important;
	color: var(--wui-color-purple, #6831ff) !important;
}

.wui-tag_purple-light,
.wui-tag_purple-plain {
	color: var(--wui-color-purple, #6831ff) !important;
}

.wui-tag__primary-plain {
	background-color: rgba(0, 0, 0, 0) !important;
	border-color: var(--wui-color-primary, #1396ff);
	color: var(--wui-color-primary, #1396ff);
}

.wui-tag__success-plain {
	background-color: rgba(0, 0, 0, 0) !important;
	border-color: var(--wui-color-success, #09be4f) !important;
	color: var(--wui-color-success, #09be4f) !important;
}

.wui-tag__warning-plain {
	background-color: rgba(0, 0, 0, 0) !important;
	border-color: var(--wui-color-warning, #ffb703) !important;
	color: var(--wui-color-warning, #ffb703) !important;
}

.wui-tag__danger-plain {
	background-color: rgba(0, 0, 0, 0) !important;
	border-color: var(--wui-color-danger, #ff2b2b) !important;
	color: var(--wui-color-danger, #ff2b2b) !important;
}

.wui-tag__purple-plain {
	background-color: rgba(0, 0, 0, 0) !important;
	border-color: var(--wui-color-purple, #6831ff) !important;
	color: var(--wui-color-purple, #6831ff) !important;
}

/* #endif */

.wui-tag__origin-left {
	transform-origin: 0 center;
}

.wui-tag__origin-right {
	transform-origin: 100% center;
}

.wui-tag__opacity:active {
	opacity: 0.5;
}
</style>
