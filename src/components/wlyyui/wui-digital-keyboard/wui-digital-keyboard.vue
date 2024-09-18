<!--（手机号：15 2670     1  3 7 56，身份证尾号：191  9  3 5）-->
<template>
	<view
		class="wui-digital__keyboard-wrap"
		:class="{
			'wui-digital__keyboard__ani': show,
			'wui-dk__theme-light': theme === 'light',
			'wui-dk__theme-dark': theme === 'dark',
			'wui-dk__safe-weex': iphoneX && safeArea
		}"
		:style="{ zIndex: zIndex }"
		ref="wui_dk_ani"
	>
		<slot></slot>
		<view class="wui-digital__keyboard-grids">
			<view class="wui-digital__keyboard-left">
				<view class="wui-dk__left-wrap" v-for="(item, index) in items" :key="item.id">
					<view class="wui-dk__grid-left" v-for="(val, idx) in item.keys" :key="idx">
						<text
							:style="{
								fontSize: `${index === 3 && idx === 0 ? spareSize : 40}rpx`
							}"
							class="wui-digital__keyboard-key"
							:class="{
								'wui-dk__key-dark': theme === 'dark',
								'wui-dk__highlight-dark': theme === 'dark' && val,
								'wui-dk__highlight': theme === 'light' && val
							}"
							@tap.stop="keyClick(index, idx, val)"
							>{{ val }}</text
						>
					</view>
				</view>
			</view>
			<view class="wui-digital__keyboard-right">
				<view class="wui-dk__grid-right">
					<view
						class="wui-digital__keyboard-key wui-dk__highlight"
						:class="{
							'wui-dk__key-dark': theme === 'dark',
							'wui-dk__highlight-dark': theme === 'dark'
						}"
						@tap.stop="backspace"
					>
						<wui-icon :name="name" :size="56" :color="theme === 'dark' ? '#d1d1d1' : '#333'"></wui-icon>
					</view>
				</view>
				<view class="wui-dk__button-wrap">
					<view
						class="wui-dk__button"
						:class="{
							'wui-dk__button-color': !background,
							'wui-dk__btn-disabled': disabled
						}"
						:style="{ background: background }"
					>
						<text
							class="wui-dk__button-text"
							:style="{
								color: color,
								fontSize: size + 'rpx',
								fontWeight: fontWeight
							}"
							>{{ text }}</text
						>
						<view class="wui-dk__button-ck" :class="{ 'wui-dk__highlight': !disabled }" @tap.stop="confirm"> </view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	name: 'wui-digital-keyboard',
	emits: ['click', 'backspace', 'confirm', 'spare'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		show: {
			type: Boolean,
			default: false
		},
		text: {
			type: String,
			default: '确定'
		},
		// #ifdef APP-NVUE
		background: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		background: {
			type: String,
			default: ''
		},
		// #endif
		color: {
			type: String,
			default: '#fff'
		},
		size: {
			type: [Number, String],
			default: 32
		},
		fontWeight: {
			type: [Number, String],
			default: 600
		},
		disabled: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default: 'backspace-fill'
		},
		decimal: {
			type: Boolean,
			default: false
		},
		spareKey: {
			type: String,
			default: ''
		},
		spareSize: {
			type: [Number, String],
			default: 32
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
		},
		// #endif
		decimal(val) {
			this.initData();
		},
		spareKey(val) {
			this.initData();
		}
	},
	data() {
		return {
			iphoneX: false,
			items: [
				{
					id: 'dk_1',
					keys: ['1', '2', '3']
				},
				{
					id: 'dk_2',
					keys: ['4', '5', '6']
				},
				{
					id: 'dk_3',
					keys: ['7', '8', '9']
				},
				{
					id: 'dk_4',
					keys: ['', '0', '']
				}
			]
		};
	},
	created() {
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphoneX = this.isPhoneX();
		// #endif
		this.initData();
	},
	methods: {
		initData() {
			let keyArr = [...this.items];
			let sk = this.spareKey.toString();
			keyArr[3].keys[0] = sk && sk !== 'true' && sk !== 'undefined' ? sk : '';
			keyArr[3].keys[2] = this.decimal ? '.' : '';
			this.items = keyArr;
		},
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
			if (!this.$refs['wui_dk_ani']) return;
			animation.transition(
				this.$refs['wui_dk_ani'].ref,
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
			if (!this.show || !val) return;
			if (index === 3 && idx === 0) {
				this.$emit('spare', {
					value: val
				});
			} else {
				this.$emit('click', {
					value: val
				});
			}
		},
		backspace() {
			if (!this.show) return;
			this.$emit('backspace', {});
		},
		confirm() {
			if (this.disabled || !this.show) return;
			this.$emit('confirm', {});
		}
	}
};
</script>

<style scoped>
.wui-digital__keyboard-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	visibility: hidden;
	transform: translate3d(0, 100%, 0);
	transition-property: transform, visibility;
	transition-duration: 0.25s;
	transition-timing-function: ease-in-out;
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
.wui-dk__safe-weex {
	padding-bottom: 34px;
}

/* #endif */

.wui-dk__theme-light {
	background: #f8f8f8;
	/* #ifdef APP-NVUE */
	border-top-color: rgba(51, 51, 51, 0.1);
	/* #endif */
}

.wui-dk__theme-dark {
	background: #1b1b1b;
	/* #ifdef APP-NVUE */
	border-top-color: #333;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-digital__keyboard-wrap::before {
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

.wui-dk__theme-light::before {
	border-top: 1px solid rgba(51, 51, 51, 0.1);
}

.wui-dk__theme-dark::before {
	border-top: 1px solid #333;
}

/* #endif */

.wui-digital__keyboard__ani {
	/* #ifndef APP-NVUE */
	transform: translate3d(0, 0, 0);
	visibility: visible;
	/* #endif */

	/* #ifdef APP-NVUE */
	opacity: 1;
	/* #endif */
}

.wui-digital__keyboard-grids {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	padding-top: 16rpx;
}

.wui-digital__keyboard-left {
	flex: 3;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	box-sizing: border-box;
	/* #endif */
	padding-right: 8rpx;
}

.wui-digital__keyboard-right {
	flex: 1;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: column;
	padding-left: 8rpx;
}

.wui-dk__left-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.wui-dk__grid-left {
	flex: 1;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	box-sizing: border-box;
	overflow: hidden;
	/* #endif */
	padding-left: 16rpx;
	padding-bottom: 16rpx;
}

.wui-dk__grid-right {
	padding-right: 16rpx;
	padding-bottom: 16rpx;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	box-sizing: border-box;
	/* #endif */
}

.wui-dk__button-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	flex-shrink: 0;
	box-sizing: border-box;
	display: flex;
	/* #endif */
	padding-right: 16rpx;
	padding-bottom: 16rpx;
	flex: 1;
	flex-direction: column;
	justify-content: center;
}

.wui-dk__button {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	align-items: center;
	justify-content: center;
	border-radius: 8rpx;
	position: relative;
}

.wui-dk__button-ck {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	border-radius: 8rpx;
	background: transparent;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-dk__button-text {
	text-align: center;
}

.wui-dk__btn-disabled {
	opacity: 0.5;
	/* #ifdef H5 */
	cursor: not-allowed;
	/* #endif */
}

.wui-digital__keyboard-key {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	flex-shrink: 0;
	overflow: hidden;
	/* #endif */
	flex: 1;
	font-size: 40rpx;
	font-weight: 600;
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
	text-align: center;
}

.wui-dk__key-dark {
	background: #222;
	color: #d1d1d1;
}

.wui-dk__highlight:active {
	background: rgba(0, 0, 0, 0.2);
}

.wui-dk__highlight-dark:active {
	background: #333 !important;
}

/* #ifndef APP-NVUE */
.wui-dk__button-color {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
