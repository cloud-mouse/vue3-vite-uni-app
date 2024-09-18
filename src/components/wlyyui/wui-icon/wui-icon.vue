<template>
	<!-- #ifndef APP-NVUE -->
	<text
		:style="{ color: getColor, fontSize: getSize, fontWeight: fontWeight }"
		class="wui-icon"
		:class="[
			!getColor && !primary ? 'wui-icon__color' : '',
			primary && (!color || color === true) ? 'wui-icon__active-color' : '',
			disabled ? 'wui-icon__not-allowed' : '',
			name
		]"
		@click="handleClick"
	></text>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<text
		:style="{
			color: primary && (!color || color === true) ? primaryColor : getColor,
			fontSize: getSize,
			lineHeight: getSize,
			fontWeight: fontWeight
		}"
		class="wui-icon"
		:class="[name]"
		@click="handleClick"
	></text>
	<!-- #endif -->
</template>

<script>
// #ifdef APP-NVUE
let domModule = weex.requireModule('dom');
import wuiicons from './iconfont.ttf';
domModule.addRule('fontFace', {
	fontFamily: 'wuiFont',
	src: "url('" + wuiicons + "')"
});
// #endif

export default {
	name: 'wui-icon',
	emits: ['click'],
	// #ifdef MP-WEIXIN
	options: {
		addGlobalClass: true
	},
	// #endif
	props: {
		name: {
			type: String,
			default: ''
		},
		size: {
			type: [Number, String],
			default: 0
		},
		//rpx | px
		unit: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: ''
		},
		//字重
		fontWeight: {
			type: [Number, String],
			default: 'normal'
		},
		//是否禁用点击
		disabled: {
			type: Boolean,
			default: false
		},
		params: {
			type: [Number, String],
			default: 0
		},
		//是否显示为主色调，color为空时有效。【内部使用】
		primary: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		getSize() {
			const size = (uni.$wui && uni.$wui.wuiIcon && uni.$wui.wuiIcon.size) || 64;
			const unit = (uni.$wui && uni.$wui.wuiIcon && uni.$wui.wuiIcon.unit) || 'rpx';
			return (this.size || size) + (this.unit || unit);
		},
		primaryColor() {
			const app = uni && uni.$wui && uni.$wui.color;
			return (app && app.primary) || '#465CFF';
		},
		getColor() {
			const app = uni && uni.$wui && uni.$wui.wuiIcon;
			let color = this.color || (app && app.color);

			// #ifdef APP-NVUE
			if (!color || color === true) {
				color = '#333333';
			}
			// #endif
			return color;
		}
	},
	data() {
		return {};
	},
	methods: {
		handleClick() {
			if (this.disabled) return;
			this.$emit('click', {
				params: this.params
			});
		}
	}
};
</script>

<style scoped>
/* #ifndef APP-NVUE */
/* 头条小程序组件内不能引入字体，需要在父级页面引入字体文件*/
@import './iconfont.css';
@font-face {
	font-family: wuiFont;
	src: url('./iconfont.ttf') format('truetype');
}

/* #endif */
.wui-icon {
	font-family: wuiFont;
	text-decoration: none;
	text-align: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-icon__color {
	color: var(--wui-color-section, #333333) !important;
}

.wui-icon__active-color {
	color: var(--wui-color-primary, #465cff) !important;
}

/* #endif */

.wui-icon__not-allowed {
	/* #ifdef H5 */
	cursor: not-allowed !important;
	/* #endif */
}
</style>
