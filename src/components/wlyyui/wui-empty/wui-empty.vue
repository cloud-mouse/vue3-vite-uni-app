<!--（手机号：1 52    67 01 375   6，身份证尾号：1   91 9 35）-->
<template>
	<view class="wui-empty__wrap" :class="{ 'wui-empty__fixed': isFixed }" :style="{ marginTop: marginTop + 'rpx' }">
		<image :src="src" :style="{ width: width + 'rpx', height: height + 'rpx' }" mode="scaleToFill" v-if="src"></image>
		<text
			class="wui-empty__title"
			:class="{ 'wui-empty__title-color': !color }"
			:style="{ color: color, fontSize: size + 'rpx', paddingTop: paddingTop + 'rpx' }"
			v-if="title"
			>{{ title }}</text
		>
		<text
			class="wui-empty__desc"
			:class="{ 'wui-empty__descr-color': !descrColor }"
			:style="{ color: descrColor, fontSize: descrSize + 'rpx' }"
			v-if="descr"
			>{{ descr }}</text
		>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'wui-empty',
	props: {
		src: {
			type: String,
			default: ''
		},
		width: {
			type: [Number, String],
			default: 576
		},
		height: {
			type: [Number, String],
			default: 318
		},
		title: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#333333',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		size: {
			type: [Number, String],
			default: 32
		},
		descr: {
			type: String,
			default: ''
		},
		descrColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#B2B2B2',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		descrSize: {
			type: [Number, String],
			default: 24
		},
		isFixed: {
			type: Boolean,
			default: false
		},
		marginTop: {
			type: [Number, String],
			default: 0
		},
		paddingTop: {
			type: [Number, String],
			default: 50
		}
	}
};
</script>

<style scoped>
.wui-empty__wrap {
	flex: 1;
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.wui-empty__fixed {
	position: fixed;
	left: 0;
	/* #ifndef APP-NVUE */
	top: 50%;
	transform: translateY(-50%);
	/* #endif */

	/* #ifdef APP-NVUE */
	top: 0;
	right: 0;
	bottom: 0;
	/* #endif */
	z-index: 99;
}

.wui-empty__title {
	text-align: center;
	font-weight: 500;
}

.wui-empty__desc {
	text-align: center;
	font-weight: normal;
	padding-top: 8rpx;
}

/* #ifndef APP-NVUE */
.wui-empty__title-color {
	color: var(--wui-color-section, #333333) !important;
}

.wui-empty__descr-color {
	color: var(--wui-color-label, #b2b2b2) !important;
}

/* #endif */
</style>
