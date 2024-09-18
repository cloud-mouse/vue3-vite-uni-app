<!--（手机号： 15   2  6701   3 756，身份证尾号：1 9 1 93  5）-->
<template>
	<view
		class="wui-license__plate-wrap"
		:class="{
			'wui-license__plate__ani': show,
			'wui-lp__theme-light': theme === 'light',
			'wui-lp__theme-dark': theme === 'dark',
			'wui-lp__safe-weex': iphoneX && safeArea
		}"
		:style="{ zIndex: zIndex }"
		ref="wui_lp_ani"
	>
		<slot></slot>
		<view v-if="toolbar" class="wui-lp__btn-wrap" :class="[theme === 'light' ? 'wui-lp__btnwrap-light' : 'wui-lp__btnwrap-dark']">
			<text
				class="wui-lp__button"
				:class="{ 'wui-lp__button-color': !color }"
				:style="{
					color: color,
					fontSize: size + 'rpx',
					fontWeight: fontWeight
				}"
				@tap.stop="onComplete"
				>{{ text }}</text
			>
		</view>
		<view class="wui-license__plate-grids">
			<view class="wui-lp__grid-wrap" v-for="(item, index) in keyList" :key="item.id">
				<view
					class="wui-lp__grid"
					:class="{
						'wui-lp__grid-lg': index === 3 && idx === 0,
						'wui-lp__grid-hidden': !(type === 1 ? val.cn : val.en)
					}"
					v-for="(val, idx) in item.keys"
					:key="idx"
				>
					<text
						:style="{
							fontSize: `${index === 3 && idx === 0 ? 28 : type === 1 ? 32 : 36}rpx`
						}"
						class="wui-license__plate-key"
						:class="{
							'wui-lp__key-dark': theme === 'dark',
							'wui-lp__highlight-dark': theme === 'dark' && val,
							'wui-lp__highlight': theme === 'light' && val
						}"
						@tap.stop="keyClick(index, idx, val)"
						>{{ type === 1 ? val.cn : val.en }}</text
					>
				</view>
				<view class="wui-lp__grid wui-lp__grid-lg" v-if="index === 3">
					<view
						class="wui-license__plate-key"
						:class="{
							'wui-lp__key-dark': theme === 'dark',
							'wui-lp__highlight-dark': theme === 'dark',
							'wui-lp__highlight': theme === 'light'
						}"
						@tap.stop="backspace"
					>
						<wui-icon :name="name" :size="48" :color="theme === 'dark' ? '#d1d1d1' : '#333'"></wui-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import keys from './wui-license-plate.js';
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	name: 'wui-license-plate',
	emits: ['click', 'backspace', 'complete'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		show: {
			type: Boolean,
			default: false
		},
		toolbar: {
			type: Boolean,
			default: true
		},
		text: {
			type: String,
			default: '完成'
		},
		// #ifdef APP-NVUE
		color: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		color: {
			type: String,
			default: ''
		},
		// #endif
		size: {
			type: [Number, String],
			default: 30
		},
		fontWeight: {
			type: [Number, String],
			default: 500
		},
		name: {
			type: String,
			default: 'w-backspace-fill'
		},
		theme: {
			type: String,
			default: 'light'
		},
		zIndex: {
			type: [Number, String],
			default: 1001
		},
		//是否适配底部安全区
		safeArea: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		// #ifdef APP-NVUE
		show: {
			handler(newVal) {
				if (newVal) {
					this.open();
				} else {
					this.close();
				}
			},
			immediate: true
		}
		// #endif
	},
	data() {
		return {
			iphoneX: false,
			keyList: [],
			type: 1
		};
	},
	created() {
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphoneX = this.isPhoneX();
		// #endif
		this.keyList = keys;
	},
	methods: {
		// #ifdef APP-NVUE
		open() {
			setTimeout(() => {
				this._animation(true);
			}, 50);
		},
		close() {
			this._animation(false);
		},
		_animation(type) {
			let styles = {
				transform: `translateY(${type ? '0' : '100%'})`,
				opacity: type ? 1 : 0
			};
			if (!this.$refs['wui_lp_ani']) return;
			animation.transition(
				this.$refs['wui_lp_ani'].ref,
				{
					styles,
					duration: 250,
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {}
			);
		},
		// #endif
		// #ifdef APP-NVUE || MP-TOUTIAO
		isPhoneX() {
			if (!this.safeArea) return false;
			//34px
			const res = uni.getSystemInfoSync();
			let iphonex = false;
			let models = [
				'iphonex',
				'iphonexr',
				'iphonexsmax',
				'iphone11',
				'iphone11pro',
				'iphone11promax',
				'iphone12',
				'iphone12mini',
				'iphone12pro',
				'iphone12promax',
				'iphone13',
				'iphone13mini',
				'iphone13pro',
				'iphone13promax',
				'iphone14',
				'iphone14mini',
				'iphone14pro',
				'iphone14promax'
			];
			const model = res.model.replace(/\s/g, '').toLowerCase();
			const newModel = model.split('<')[0];
			if (models.includes(model) || models.includes(newModel) || (res.safeAreaInsets && res.safeAreaInsets.bottom > 0)) {
				iphonex = true;
			}
			return iphonex;
		},
		// #endif
		keyClick(index, idx, val) {
			let text = this.type === 1 ? val.cn : val.en;
			if (!this.show || !text) return;
			if (index === 3 && idx === 0) {
				this.type = this.type === 1 ? 2 : 1;
			} else {
				this.$emit('click', {
					value: text
				});
			}
		},
		backspace() {
			if (!this.show) return;
			this.$emit('backspace', {});
		},
		onComplete() {
			if (!this.toolbar || !this.show) return;
			this.$emit('complete', {});
		},
		changeKeyboard(type = 'en') {
			this.type = type === 'en' ? 2 : 1;
		}
	}
};
</script>

<style scoped>
.wui-license__plate-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	visibility: hidden;
	transform: translate3d(0, 100%, 0);
	transition-property: transform, visibility;
	transition-duration: 0.25s;
	transition-timing-function: ease-in-out;
	overflow: hidden;
	/* #endif */

	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	transform-origin: center center;
	/* #ifdef APP-NVUE */
	transform: translate(0, 100%);
	opacity: 0;
	border-top-style: solid;
	border-top-width: 0.5px;
	/* #endif */
}

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-lp__safe-weex {
	padding-bottom: 34px;
}

/* #endif */

.wui-lp__theme-light {
	background: #f1f4fa;
	/* #ifdef APP-NVUE */
	border-top-color: rgba(51, 51, 51, 0.1);
	/* #endif */
}

.wui-lp__theme-dark {
	background: #1b1b1b;
	/* #ifdef APP-NVUE */
	border-top-color: #333;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-license__plate-wrap::before {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	-webkit-transform: scaleY(0.5) translateZ(0);
	transform: scaleY(0.5) translateZ(0);
	transform-origin: 0 0;
	z-index: 2;
	pointer-events: none;
}

.wui-lp__theme-light::before {
	border-top: 1px solid rgba(51, 51, 51, 0.1);
}

.wui-lp__theme-dark::before {
	border-top: 1px solid #333;
}

/* #endif */

.wui-license__plate__ani {
	/* #ifndef APP-NVUE */
	transform: translate3d(0, 0, 0);
	visibility: visible;
	/* #endif */

	/* #ifdef APP-NVUE */
	opacity: 1;
	/* #endif */
}

.wui-license__plate-grids {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	padding-top: 24rpx;
	/* #ifdef APP-NVUE */
	/* height: 472rpx; */
	/* #endif */
}

.wui-lp__grid-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	overflow: hidden;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.wui-lp__grid {
	width: 75rpx;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	box-sizing: border-box;
	overflow: hidden;
	/* #endif */
	padding-left: 7rpx;
	padding-right: 7rpx;
	padding-bottom: 24rpx;
	opacity: 1;
}

.wui-lp__grid-lg {
	width: 112rpx;
}

.wui-lp__grid-hidden {
	width: 0;
	padding-left: 0;
	padding-right: 0;
	opacity: 0;
}

.wui-license__plate-key {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	flex-shrink: 0;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	font-weight: 500;
	height: 88rpx;
	/* #ifdef APP-NVUE */
	line-height: 88rpx;
	/* #endif */
	background: #fff;
	border-radius: 8rpx;
	align-items: center;
	justify-content: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	color: #181818;
	/* #ifdef APP-NVUE */
	border-bottom-width: 0.5px;
	border-bottom-color: rgba(0, 0, 0, 0.1);
	border-bottom-style: solid;
	/* #endif */
	text-align: center;
	position: relative;
}

/* #ifndef APP-NVUE */
.wui-license__plate-key::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	border-bottom: 1px solid #b2b2b2;
	z-index: 2;
	pointer-events: none;
	border-bottom-left-radius: 8rpx;
	border-bottom-right-radius: 8rpx;
}

.wui-lp__key-dark::after {
	border-bottom: 1px solid #4c4c4c !important;
}

/* #endif */
.wui-lp__key-dark {
	/* #ifdef APP-NVUE */
	border-bottom-color: #333;
	/* #endif */
	background: #222;
	color: #d1d1d1;
}

.wui-lp__highlight:active {
	background: rgba(0, 0, 0, 0.2);
}

.wui-lp__highlight-dark:active {
	background: #333 !important;
}

.wui-lp__btn-wrap {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding: 24rpx 0;
}

.wui-lp__btnwrap-light {
	background-color: #f8f8f8;
}

.wui-lp__btnwrap-dark {
	background-color: #333;
}

.wui-lp__button {
	padding: 0 32rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-lp__button:active {
	opacity: 0.5;
}

/* #ifndef APP-NVUE */
.wui-lp__button-color {
	color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
