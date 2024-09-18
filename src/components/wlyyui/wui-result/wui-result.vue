<!--（手机号： 1 5  2670     1 3756，身份证尾号：19   193  5）-->
<template>
	<view class="wui-result__wrap" :style="{ paddingTop: paddingTop + 'rpx' }" v-if="ibColor">
		<view class="wui-result__icon-box">
			<view
				class="wui-result__icon"
				:style="{
					background: background,
					zoom: isNvue ? 1 : scaleRatio,
					transform: `scale(${isNvue ? scaleRatio : 1})`
				}"
				:class="[background ? '' : `wui-result__bg-${type}`]"
				v-if="show"
			>
				<view :class="['wui-result__ib-' + type]" :style="ibColor"></view>
				<view
					:class="['wui-result__ia-' + type]"
					:style="{ background: iconColor }"
					v-if="type === 'fail' || type === 'warning'"
				></view>
			</view>
			<slot name="icon"></slot>
		</view>
		<text
			class="wui-result__title"
			:class="{ 'wui-result__title-color': !color }"
			:style="{ fontSize: size + 'rpx', color: color }"
			v-if="title"
			>{{ title }}</text
		>
		<text
			class="wui-result__descr"
			:class="{ 'wui-result__descr-color': !descrColor }"
			:style="{ fontSize: descrSize + 'rpx', color: descrColor }"
			v-if="descr"
			>{{ descr }}</text
		>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'wui-result',
	props: {
		paddingTop: {
			type: [Number, String],
			default: 96
		},
		//success，warning，fail, waiting
		type: {
			type: String,
			default: ''
		},
		background: {
			type: String,
			default: ''
		},
		iconColor: {
			type: String,
			default: '#fff'
		},
		//缩放比例
		scaleRatio: {
			type: Number,
			default: 1
		},
		title: {
			type: String,
			default: ''
		},
		size: {
			type: [Number, String],
			default: 44
		},
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#181818',
			// #endif

			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		descr: {
			type: String,
			default: ''
		},
		descrSize: {
			type: [Number, String],
			default: 32
		},
		descrColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#333',
			// #endif

			// #ifndef APP-NVUE
			default: ''
			// #endif
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue
		};
	},
	computed: {
		show() {
			return ~['success', 'warning', 'fail', 'waiting'].indexOf(this.type);
		},
		ibColor() {
			let style = `border-color:${this.iconColor}`;
			if (this.type === 'fail' || this.type === 'warning') {
				style = `background:${this.iconColor}`;
			}
			return style;
		}
	}
};
</script>

<style scoped>
.wui-result__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: column;
	align-items: center;
}

.wui-result__icon-box {
	padding-bottom: 48rpx;
}

.wui-result__icon {
	width: 128rpx;
	height: 128rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	border-radius: 50%;
	/* #endif */

	/* #ifdef APP-NVUE */
	border-radius: 128rpx;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

.wui-result__bg-success {
	/* #ifdef APP-NVUE */
	background-color: #09be4f !important;
	/* #endif */
	/* #ifndef APP-NVUE */
	background-color: var(--wui-color-success, #09be4f) !important;
	/* #endif */
}

.wui-result__bg-warning {
	/* #ifdef APP-NVUE */
	background-color: #ffb703 !important;
	/* #endif */
	/* #ifndef APP-NVUE */
	background-color: var(--wui-color-warning, #ffb703) !important;
	/* #endif */
}

.wui-result__bg-fail {
	/* #ifdef APP-NVUE */
	background-color: #ff2b2b !important;
	/* #endif */
	/* #ifndef APP-NVUE */
	background-color: var(--wui-color-danger, #ff2b2b) !important;
	/* #endif */
}

.wui-result__bg-waiting {
	/* #ifdef APP-NVUE */
	background-color: #1396ff !important;
	/* #endif */
	/* #ifndef APP-NVUE */
	background-color: var(--wui-color-primary, #1396ff) !important;
	/* #endif */
}

.wui-result__ib-success {
	width: 30rpx;
	height: 60rpx;
	border-style: solid;
	border-width: 0;
	border-right-width: 8rpx;
	border-bottom-width: 8rpx;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	transform: rotate(45deg);
	margin-bottom: 12rpx;
	margin-left: 4rpx;
}

.wui-result__ib-fail {
	width: 60rpx;
	height: 8rpx;
	transform: rotate(45deg);
}

.wui-result__ia-fail {
	width: 8rpx;
	height: 60rpx;
	position: absolute;
	left: 61rpx;
	top: 34rpx;
	transform: rotate(45deg);
}

.wui-result__ib-waiting {
	height: 48rpx;
	width: 48rpx;
	border-width: 8rpx;
	border-style: solid;
	border-top-width: 0;
	border-right-width: 0;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	margin-left: 24rpx;
	margin-top: -24rpx;
}

.wui-result__ib-warning {
	height: 48rpx;
	width: 8rpx;
	margin-top: -16rpx;
	border-radius: 2rpx;
}

.wui-result__ia-warning {
	height: 8rpx;
	width: 8rpx;
	position: absolute;
	top: 88rpx;
	border-radius: 2rpx;
}

.wui-result__title {
	font-weight: 700;
	font-size: 44rpx;
	margin-bottom: 32rpx;
}

/* #ifndef APP-NVUE */
.wui-result__descr,
.wui-result__title {
	display: block;
	word-wrap: break-word;
	word-break: break-all;
}

/* #endif */
.wui-result__descr {
	flex: 1;
	font-size: 32rpx;
	text-align: center;
	margin-bottom: 32rpx;
	padding: 0 64rpx;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	font-weight: normal;
}

/* #ifndef APP-NVUE */
.wui-result__title-color {
	color: var(--wui-color-title, #181818) !important;
}

.wui-result__descr-color {
	color: var(--wui-color-section, #333) !important;
}

/* #endif */
</style>
