<!--（手机号：   152 6 7013   75  6，身份证尾号： 1 919  3 5）-->
<template>
	<view
		class="wui-switch__input"
		:style="{
			zoom: isNvue ? 1 : scaleRatio,
			transform: `scale(${isNvue ? scaleRatio : 1})`
		}"
	>
		<!-- #ifdef APP-NVUE -->
		<switch
			v-if="type === 'switch'"
			@change="change"
			:name="name"
			:checked="val"
			:disabled="disabled"
			:color="color || '#1396FF'"
		>
		</switch>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<view
			class="wui-switch__input-def"
			:style="{
				background: val ? color : '#dfdfdf',
				borderColor: val ? color : borderColor
			}"
			:class="{
				'wui-switch__input--checked': val,
				'wui-checkbox__disabled': disabled,
				'wui-switch__color': val && !color
			}"
			v-if="type === 'switch'"
		>
			<switch
				class="wui-switch__hidden"
				:class="{ 'wui-pointer__events': isLabel }"
				@change="change"
				:name="name"
				:checked="val"
				:disabled="disabled"
				:color="color"
			>
			</switch>
		</view>
		<!-- #endif -->
		<view
			class="wui-checkbox__self"
			:class="{
				'wui-checkbox__disabled': disabled,
				'wui-switch__color': !color && val
			}"
			:style="{
				background: val ? color : '#fff',
				border: val ? `1px solid ${color}` : `1px solid ${borderColor}`
			}"
			v-else
		>
			<view
				class="wui-check__mark"
				:style="{
					borderBottomColor: checkMarkColor,
					borderRightColor: checkMarkColor
				}"
				v-if="val"
			></view>
			<switch
				class="wui-switch__hidden"
				:class="{ 'wui-pointer__events': isLabel }"
				style="opacity: 0; position: absolute"
				@change="change"
				:name="name"
				:type="isNvue ? 'switch' : 'checkbox'"
				:checked="val"
				:disabled="disabled"
			></switch>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-switch',
	emits: ['change'],
	// #ifndef VUE3
	// #ifdef MP-WEIXIN
	behaviors: ['wx://form-field-group'],
	// #endif
	// #ifdef MP-BAIDU || MP-QQ
	behaviors: ['uni://form-field'],
	// #endif
	// #endif
	props: {
		//开关选择器名称
		name: {
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
		//样式，有效值：switch, checkbox
		type: {
			type: String,
			default: 'switch'
		},
		//switch选中颜色
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//边框颜色，type=checkbox时生效
		borderColor: {
			type: String,
			default: '#ccc'
		},
		//对号颜色，type=checkbox时生效
		checkMarkColor: {
			type: String,
			default: '#fff'
		},
		scaleRatio: {
			type: [Number, String],
			default: 1
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			val: false,
			isNvue: isNvue,
			isLabel: false
		};
	},
	watch: {
		checked(val) {
			this.val = val;
		}
	},
	created() {
		this.val = this.checked;
		this.label = this.getParent();
		if (this.label) {
			this.isLabel = true;
			this.label.childrens.push(this);
		}
	},
	methods: {
		change(e, label) {
			if (this.label && !label) return;
			this.val = e.detail.value;
			this.$emit('change', e);
		},
		labelClick() {
			if (this.disabled) return;
			let e = {
				detail: {
					value: !this.val
				}
			};
			this.change(e, true);
		},
		getParent(name = 'wui-label') {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== name) {
				parent = parent.$parent;
				if (!parent) return false;
				parentName = parent.$options.name;
			}
			return parent;
		}
	}
};
</script>

<style scoped>
/* #ifndef APP-NVUE */
.wui-switch__input {
	display: inline-block;
	margin: 0;
}

/* #endif */

.wui-checkbox__self {
	font-size: 0;
	width: 40rpx;
	height: 40rpx;
	/* #ifdef APP-NVUE */
	border-radius: 40rpx;
	/* #endif */
	/* #ifndef APP-NVUE */
	border-radius: 50%;
	display: inline-flex;
	box-sizing: border-box;
	vertical-align: top;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: relative;
}

/* #ifndef APP-NVUE */
.wui-switch__input-def {
	position: relative;
	width: 52px;
	height: 32px;
	border: 1px solid #cccccc;
	outline: 0;
	border-radius: 16px;
	box-sizing: border-box;
	transition: background-color 0.1s, border 0.1s;
}

.wui-switch__input-def::before {
	content: ' ';
	position: absolute;
	top: 0;
	left: 0;
	width: 50px;
	height: 30px;
	border-radius: 15px;
	background-color: #fdfdfd;
	transition: transform 0.3s;
}

.wui-switch__input-def::after {
	content: ' ';
	position: absolute;
	top: 0;
	left: 0;
	width: 30px;
	height: 30px;
	border-radius: 15px;
	background-color: #fff;
	box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
	transition: transform 0.3s;
}

.wui-switch__input--checked::before {
	transform: scale(0);
}

.wui-switch__input--checked::after {
	transform: translateX(20px);
}

.wui-switch__color {
	background: var(--wui-color-primary, #1396ff) !important;
	border-color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */

/* #ifdef H5 || APP-VUE */
::v-deep .uni-switch-input {
	margin-right: 0 !important;
}

/* #endif */

/* #ifdef APP-NVUE */
.uni-switch-input {
	margin-right: 0 !important;
}

/* #endif */

/* #ifdef MP-WEIXIN */
.wx-switch-input {
	margin-right: 0 !important;
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
	transform: rotate(45deg) scale(0.5);
	transform-origin: 54% 48%;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
}

.wui-switch__hidden {
	position: absolute;
	top: -1px;
	left: -1px;
	opacity: 0;
	z-index: 2;
	/* #ifndef APP-NVUE */
	width: 100%;
	height: 100%;
	border: 0 none;
	-webkit-appearance: none;
	-mowui-appearance: none;
	appearance: none;
	/* #endif */

	/* #ifdef APP-NVUE */
	width: 100wx;
	height: 100wx;
	right: 0;
	bottom: 0;
	border-width: 0;
	/* #endif */
}

/* #ifdef H5 */
.wui-pointer__events {
	pointer-events: none;
}

/* #endif */

.wui-checkbox__disabled {
	opacity: 0.6;
}
</style>
