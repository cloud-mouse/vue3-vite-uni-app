<!--（手机号： 152 6 70  1 3  7  56，身份证尾号：  19 1  935）-->
<template>
	<view
		class="wui-preview__wrap"
		:class="{
			'wui-preview__unlined': !isBorder,
			'wui-preview__background': !background
		}"
		:style="{
			'border-top-color': borderColor,
			'border-bottom-color': borderColor,
			marginTop: marginTop + 'rpx',
			marginBottom: marginBottom + 'rpx'
		}"
	>
		<view
			class="wui-preview__hd"
			:style="{ paddingLeft: padding + 'rpx', paddingRight: padding + 'rpx' }"
			v-if="pvd[label] || pvd[value]"
		>
			<view class="wui-preview__item">
				<text
					class="wui-preview__label"
					:class="{ 'wui-preview__gray': !labelColor }"
					:style="{ color: labelColor, fontSize: hdLabelSize + 'rpx' }"
					>{{ pvd[label] || '' }}</text
				>
				<text
					class="wui-preview__value-hd"
					:class="{ 'wui-preview__color': !hdValColor }"
					:style="{ color: hdValColor, fontSize: hdValSize + 'rpx' }"
					>{{ pvd[value] || '' }}</text
				>
			</view>
			<view
				:style="{
					background: borderColor,
					left: hdLeft + 'rpx',
					right: hdRight + 'rpx'
				}"
				class="wui-preview__border"
				:class="{ 'wui-preview__border-color': !borderColor }"
			></view>
		</view>
		<view
			class="wui-preview__bd"
			v-if="pvd[list] && pvd[list].length > 0"
			:style="{ paddingLeft: padding + 'rpx', paddingRight: padding + 'rpx' }"
		>
			<view class="wui-preview__item" v-for="(item, index) in pvd[list]" :key="index">
				<text
					class="wui-preview__label"
					:class="[!labelColor && !item[lColor] ? 'wui-preview__gray' : '', 'wui-preview__label-' + labelAlign]"
					:style="{
						color: item[lColor] || labelColor,
						fontSize: bdSize + 'rpx',
						width: labelWidth > 0 ? labelWidth + 'rpx' : 'auto'
					}"
					>{{ item[label] }}</text
				>
				<text
					class="wui-preview__value"
					:class="{ 'wui-preview__color': !bdColor && !item[valueColor] }"
					:style="{
						color: item[valueColor] || bdColor,
						fontSize: bdSize + 'rpx'
					}"
					>{{ item[value] }}</text
				>
			</view>
		</view>
		<slot></slot>
		<view class="wui-preview__ft" :style="{ 'border-top-color': borderColor }" v-if="pvd[buttons] && pvd[buttons].length > 0">
			<view
				:style="{
					'border-right-color': idx !== pvd[buttons].length - 1 ? borderColor : 'transparent'
				}"
				:class="[
					highlight ? 'wui-preview__hover-weex' : '',
					idx !== pvd[buttons].length - 1 ? 'wui-preview__btn-def' : 'wui-preview__btn'
				]"
				:hover-class="highlight ? 'wui-preview_hover' : ''"
				:hover-stay-time="150"
				v-for="(btn, idx) in pvd[buttons]"
				:key="idx"
				@tap="handleClick(idx)"
			>
				<text
					:style="{ fontSize: btnSize + 'rpx', color: btn[color] || '#1396FF' }"
					:class="{ 'wui-preview__link': !btn[color] }"
					>{{ btn[text] }}</text
				>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-preview',
	emits: ['click'],
	props: {
		previewData: {
			type: Object,
			default() {
				return {};
			}
		},
		fields: {
			type: Object,
			default() {
				return {};
			}
		},
		background: {
			type: String,
			// #ifdef APP-NVUE
			default: '#fff',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		marginTop: {
			type: [Number, String],
			default: 0
		},
		marginBottom: {
			type: [Number, String],
			default: 0
		},
		//左右间距
		padding: {
			type: [Number, String],
			default: 32
		},
		labelWidth: {
			type: [Number, String],
			default: 0
		},
		//left / right / justify
		labelAlign: {
			type: String,
			default: 'left'
		},
		labelColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#7F7F7F',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		hdLabelSize: {
			type: [Number, String],
			default: 32
		},
		hdValSize: {
			type: [Number, String],
			default: 36
		},
		hdValColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#181818',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		bdSize: {
			type: [Number, String],
			default: 28
		},
		bdColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#181818',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		btnSize: {
			type: [Number, String],
			default: 32
		},
		//按钮是否有点击效果
		highlight: {
			type: Boolean,
			default: true
		},
		hdLeft: {
			type: [Number, String],
			default: 32
		},
		hdRight: {
			type: [Number, String],
			default: 0
		},
		//是否需要preview外层上下线条
		isBorder: {
			type: Boolean,
			default: true
		},
		borderColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#eee',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		}
	},
	watch: {
		previewData(val) {
			this.initData(val);
		},
		//未做深度监听
		fields(val) {
			this.handleFileds();
		}
	},
	created() {
		this.initData(this.previewData);
	},
	data() {
		return {
			pvd: {},
			label: 'label',
			value: 'value',
			list: 'list',
			lColor: 'labelColor',
			valueColor: 'valueColor',
			buttons: 'buttons',
			text: 'text',
			color: 'color'
		};
	},
	methods: {
		handleFileds() {
			if (this.fields && typeof this.fields === 'object') {
				this.label = this.fields.label || 'label';
				this.value = this.fields.value || 'value';
				this.list = this.fields.list || 'list';
				this.lColor = this.fields.labelColor || 'labelColor';
				this.valueColor = this.fields.valueColor || 'valueColor';
				this.buttons = this.fields.buttons || 'buttons';
				this.text = this.fields.text || 'text';
				this.color = this.fields.color || 'color';
			}
		},
		initData(val) {
			this.handleFileds();
			val = val || {};
			val[this.list] = val[this.list] || [];
			val[this.buttons] = val[this.buttons] || [];
			this.pvd = val;
		},
		handleClick(idx) {
			let params = this.pvd[this.buttons][idx] || {};
			this.$emit('click', {
				index: idx,
				...params
			});
		}
	}
};
</script>

<style scoped>
.wui-preview__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	border-top-width: 0;
	border-bottom-width: 0;
	/* #endif */
	flex: 1;
	position: relative;
	overflow: hidden;

	/* #ifdef APP-NVUE */
	border-top-width: 0.5px;
	border-top-style: solid;
	border-bottom-width: 0.5px;
	border-bottom-style: solid;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-preview__background {
	background: var(--wui-bg-color, '#fff') !important;
}

/* #endif */
.wui-preview__unlined {
	border-top-width: 0 !important;
	border-bottom-width: 0 !important;
}

/* #ifndef APP-NVUE */
.wui-preview__wrap:before {
	top: 0;
	border-top: 1px solid var(--wui-color-border, #eeeeee);
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.wui-preview__wrap:after,
.wui-preview__wrap:before {
	content: ' ';
	position: absolute;
	left: 0;
	right: 0;
	height: 1px;
}

.wui-preview__wrap:after {
	bottom: 0;
	border-bottom: 1px solid var(--wui-color-border, #eeeeee);
	-webkit-transform-origin: 0 100%;
	transform-origin: 0 100%;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.wui-preview__unlined::before,
.wui-preview__unlined::after {
	border-top-width: 0 !important;
	border-bottom-width: 0 !important;
}

/* #endif */
.wui-preview__hd {
	position: relative;
	padding-top: 32rpx;
	padding-bottom: 32rpx;
	text-align: right;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	line-height: 56rpx;
}

.wui-preview__border {
	position: absolute;
	bottom: 0;
	/* #ifdef APP-NVUE */
	height: 0.5px;
	z-index: -1;
	/* #endif */
	/* #ifndef APP-NVUE */
	height: 1px;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 100%;
	z-index: 1;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-preview__border-color {
	background: var(--wui-color-border, #eeeeee) !important;
}

/* #endif */

.wui-preview__value {
	flex: 1;
	text-align: right;
	/* #ifndef APP-NVUE */
	display: block;
	word-break: break-all;
	word-wrap: break-word;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-preview__color {
	color: var(--wui-color-title, #181818) !important;
}

/* #endif */

.wui-preview__value-hd {
	font-style: normal;
	font-size: 36rpx;
}

.wui-preview__bd {
	flex: 1;
	padding-top: 32rpx;
	padding-bottom: 32rpx;
	line-height: 48rpx;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
}

.wui-preview__ft {
	flex: 1;
	position: relative;
	height: 100rpx;
	/* #ifdef APP-NVUE */
	border-top-width: 0.5px;
	border-top-style: solid;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: flex;
	border-top-width: 0;
	/* #endif */
	flex-direction: row;
}

/* #ifndef APP-NVUE */
.wui-preview__ft:before {
	content: ' ';
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	height: 1px;
	border-top: 1px solid var(--wui-color-border, #eeeeee);
	transform-origin: 0 0;
	transform: scaleY(0.5);
}

/* #endif */

.wui-preview__item {
	padding: 8rpx 0;
	overflow: hidden;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: space-between;
}

.wui-preview__label {
	margin-right: 32rpx;
	/* #ifndef APP-NVUE */
	min-width: 112rpx;
	text-align: justify;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-preview__label-right {
	text-align-last: right;
}

.wui-preview__label-justify {
	text-align-last: justify;
}

/* #endif */

/* #ifndef APP-NVUE */
.wui-preview__gray {
	color: var(--wui-color-subtitle, #7f7f7f) !important;
}

/* #endif */

.wui-preview__btn,
.wui-preview__btn-def {
	flex: 1;
	text-align: center;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-preview__btn-def {
	position: relative;
	/* #ifdef APP-NVUE */
	border-right-width: 0.5px;
	border-right-style: solid;
	/* #endif */
}

.wui-preview__link {
	/* #ifdef APP-NVUE */
	color: #1396ff !important;
	/* #endif */
	/* #ifndef APP-NVUE */
	color: var(--wui-color-link, #1396ff) !important;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-preview__btn-def::after {
	content: ' ';
	position: absolute;
	right: 0;
	top: 0;
	width: 1px;
	bottom: 0;
	border-right: 1px solid var(--wui-color-border, #eee);
	transform-origin: 100% 0;
	transform: scaleX(0.5);
}

/* #endif */

/* #ifndef APP-NVUE */
.wui-preview_hover {
	background-color: var(--wui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
}

/* #endif */

/* #ifdef APP-NVUE */
.wui-preview__hover-weex:active {
	background-color: rgba(0, 0, 0, 0.2) !important;
}

/* #endif */
</style>
