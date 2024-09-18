<!--（手机号：1    526 70   13  756，身份证尾号：19  19  3 5）-->
<template>
	<view
		class="wui-checkbox__input"
		:class="{
			'wui-checkbox__disabled': disabled,
			'wui-checkbox__color': !color && val && !isCheckMark
		}"
		:style="{
			backgroundColor: getBackgroundColor(val, isCheckMark),
			borderColor: getBorderColor(val, isCheckMark),
			zoom: isNvue ? 1 : scaleRatio,
			transform: `scale(${isNvue ? scaleRatio : 1})`,
			borderRadius: borderRadius
		}"
		@tap.stop="checkboxChange"
	>
		<view
			class="wui-check__mark"
			:style="{
				borderBottomColor: checkMarkColor,
				borderRightColor: checkMarkColor
			}"
			v-if="val"
		></view>
		<checkbox
			class="wui-checkbox__hidden"
			style="opacity: 0; position: absolute"
			:color="color"
			:disabled="disabled"
			:value="value"
			:checked="val"
		>
		</checkbox>
	</view>
</template>

<script>
export default {
	name: 'wui-checkbox',
	emits: ['change'],
	// #ifdef MP-WEIXIN
	options: {
		virtualHost: true
	},
	// #endif
	props: {
		value: {
			type: String,
			default: ''
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		//checkbox选中背景颜色
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
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
		borderRadius: {
			type: String,
			// #ifdef APP-NVUE
			default: '40rpx',
			// #endif
			// #ifndef APP-NVUE
			default: '50%'
			// #endif
		},
		//是否只展示对号，无边框背景
		isCheckMark: {
			type: Boolean,
			default: false
		},
		//对号颜色
		checkMarkColor: {
			type: String,
			default: '#fff'
		},
		scaleRatio: {
			type: [Number, String],
			default: 1
		}
	},
	created() {
		this.val = this.checked;
		this.group = this.getParent();
		if (this.group) {
			this.group.childrens.push(this);
			if (this.group.value && this.group.value.length > 0) {
				this.val = this.group.value.includes(this.value);
			}
			// #ifdef VUE3
			if (this.group.modelValue && this.group.modelValue.length > 0) {
				this.val = this.group.modelValue.includes(this.value);
			}
			// #endif
		}
		this.label = this.getParent('wui-label');
		if (this.label) {
			this.label.childrens.push(this);
		}
	},
	watch: {
		checked(newVal) {
			this.val = newVal;
		},
		val(newVal) {
			if (this.group) {
				this.group.changeValue(this.val, this);
			}
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			val: false,
			isNvue: isNvue
		};
	},
	methods: {
		getBackgroundColor(val, isCheckMark) {
			let color = val ? this.color : '#fff';
			if (isCheckMark) {
				color = 'transparent';
			}
			return color;
		},
		getBorderColor(val, isCheckMark) {
			let color = val ? this.color : this.borderColor;
			if (isCheckMark) {
				color = 'transparent';
			}
			return color;
		},
		checkboxChange(e) {
			console.log(1);
			if (this.disabled) return;
			this.val = !this.val;
			this.$emit('change', {
				checked: this.val,
				value: this.value
			});
		},
		getParent(name = 'wui-checkbox-group') {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== name) {
				parent = parent.$parent;
				if (!parent) return false;
				parentName = parent.$options.name;
			}
			return parent;
		},
		labelClick() {
			this.checkboxChange();
		}
	}
};
</script>

<style scoped>
.wui-checkbox__input {
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
}

/* #ifndef APP-NVUE */
.wui-checkbox__color {
	background: var(--wui-color-primary, #1396ff) !important;
	border-color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */

.wui-check__mark {
	width: 20rpx;
	height: 40rpx;
	border-bottom-style: solid;
	border-bottom-width: 3px;
	border-bottom-color: #ffffff;
	border-right-style: solid;
	border-right-width: 3px;
	border-right-color: #ffffff;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	transform: rotate(45deg) scale(0.5) translateZ(0);
	/* #endif */
	/* #ifdef APP-NVUE */
	transform: rotate(45deg) scale(0.5);
	/* #endif */
	transform-origin: 54% 48%;
}

.wui-checkbox__hidden {
	/* #ifndef APP-NVUE */
	width: 100%;
	height: 100%;
	border: 0 none;
	-webkit-appearance: none;
	-mowui-appearance: none;
	appearance: none;
	pointer-events: none;
	/* #endif */
	/* #ifdef APP-NVUE */
	width: 100wx;
	height: 100wx;
	border-width: 0;
	/* #endif */
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
}

.wui-checkbox__disabled {
	opacity: 0.6;
}
</style>
