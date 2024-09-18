<!--（手机号：152 6 7 01   37  5  6，身份证尾号：191 9   3 5）-->
<template>
	<view
		class="wui-text__wrap"
		:class="[
			block ? 'wui-text__block' : 'wui-text__inline',
			'wui-text__' + align,
			highlight && !disable ? 'wui-text__active' : ''
		]"
		:style="{
			textAlign: align,
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0
		}"
		@tap="handleTap"
	>
		<slot></slot>
		<text
			class="wui-text__content"
			:style="{
				color: getColor,
				fontSize: getSize,
				lineHeight: lineHeight ? getSize : 'auto',
				textAlign: align,
				textDecoration: decoration,
				fontWeight: fontWeight
			}"
			:class="[color ? '' : 'wui-text__' + type, unShrink ? 'wui-text__unshrink' : '']"
			:selectable="selectable"
			:userSelect="userSelect"
			:decode="decode"
			>{{ getText(text, textType, format) }}</text
		>
		<slot name="right"></slot>
	</view>
</template>

<script>
export default {
	name: 'wui-text',
	emits: ['click'],
	props: {
		//样式类型：primary，success， warning，danger，purple，gray，black
		type: {
			type: String,
			default: 'black'
		},
		text: {
			type: [Number, String],
			default: ''
		},
		size: {
			type: [Number, String],
			default: 0
		},
		unit: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: ''
		},
		fontWeight: {
			type: [Number, String],
			default: 400
		},
		//left、center、right
		align: {
			type: String,
			default: 'left'
		},
		//none、 underline、line-through
		decoration: {
			type: String,
			default: 'none'
		},
		//是否将行高设置与字体大小一致
		lineHeight: {
			type: Boolean,
			default: false
		},
		padding: {
			type: Array,
			default() {
				return ['0', '0'];
			}
		},
		block: {
			type: Boolean,
			default: false
		},
		//文本类型：text、mobile、amount、name
		textType: {
			type: String,
			default: 'text'
		},
		//是否格式化，仅mobile、amount时有效
		format: {
			type: Boolean,
			default: false
		},
		call: {
			type: Boolean,
			default: false
		},
		//文本是否可选：App、H5、快手小程序
		selectable: {
			type: Boolean,
			default: false
		},
		//文本是否可选：微信小程序
		userSelect: {
			type: Boolean,
			default: false
		},
		//是否解码：App、H5、微信小程序
		decode: {
			type: Boolean,
			default: false
		},
		//是否有点击效果
		highlight: {
			type: Boolean,
			default: false
		},
		disable: {
			type: Boolean,
			default: false
		},
		unShrink: {
			type: Boolean,
			default: false
		},
		param: {
			type: [Number, String],
			default: ''
		}
	},
	computed: {
		getSize() {
			const size = (uni.$wui && uni.$wui.wuiText && uni.$wui.wuiText.size) || 32;
			const unit = (uni.$wui && uni.$wui.wuiText && uni.$wui.wuiText.unit) || 'rpx';
			return (this.size || size) + (this.unit || unit);
		},
		getColor() {
			let color = this.color || '';
			// #ifdef APP-NVUE
			if (!color && this.type) {
				color = {
					primary: '#1396FF',
					success: '#09BE4F',
					warning: '#FFB703',
					danger: '#FF2B2B',
					purple: '#6831FF',
					gray: '#B2B2B2',
					black: '#181818'
				}[this.type];
			}
			// #endif
			return color;
		}
	},
	methods: {
		getText(text, textType, format) {
			let _text = text;
			if (format) {
				if (textType === 'mobile') {
					_text = this.numberFormatter(text);
				} else if (textType === 'amount') {
					_text = this.moneyFormatter(text);
				} else if (textType === 'name') {
					_text = this.nameFormatter(text);
				}
			}
			return _text;
		},
		numberFormatter(num) {
			let textNum = num.toString();
			return textNum.length == 11 ? textNum.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : textNum;
		},
		moneyFormatter(money) {
			return parseFloat(money)
				.toFixed(2)
				.toString()
				.split('')
				.reverse()
				.join('')
				.replace(/(\d{3})/g, '$1,')
				.replace(/\,$/, '')
				.split('')
				.reverse()
				.join('');
		},
		trimAll(value) {
			return value.toString().replace(/\s+/g, '');
		},
		nameFormatter(name) {
			let _name = this.trimAll(name || '');
			if (_name && _name.length >= 2) {
				const arr = _name.split('');
				_name = arr[0] + '*';
				if (arr.length > 2) {
					_name = _name + arr[arr.length - 1];
				}
			}
			return _name;
		},
		handleTap() {
			if (this.disable) return;
			this.$emit('click', {
				text: this.text,
				param: this.param
			});
			if (this.call) {
				uni.makePhoneCall({
					phoneNumber: this.text
				});
			}
		}
	}
};
</script>

<style scoped>
.wui-text__wrap {
	align-items: center;
	flex-direction: row;
}

/* #ifdef H5 */
.wui-text__active {
	cursor: pointer;
}

/* #endif */

.wui-text__active:active {
	opacity: 0.5;
}

/* #ifndef APP-NVUE */
.wui-text__inline {
	display: inline-flex;
}

.wui-text__block {
	display: flex;
}

.wui-text__unshrink {
	flex-shrink: 0;
}

/* #endif */

.wui-text__center {
	justify-content: center;
}

.wui-text__right {
	justify-content: flex-end;
}

/* #ifndef APP-NVUE */
.wui-text__primary {
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-text__success {
	color: var(--wui-color-success, #09be4f) !important;
}

.wui-text__warning {
	color: var(--wui-color-warning, #ffb703) !important;
}

.wui-text__danger {
	color: var(--wui-color-danger, #ff2b2b) !important;
}

.wui-text__purple {
	color: var(--wui-color-purple, #6831ff) !important;
}

.wui-text__gray {
	color: var(--wui-color-label, #b2b2b2) !important;
}

.wui-text__black {
	color: var(--wui-color-title, #181818) !important;
}

/* #endif */
</style>
