<!--（手机号：152   6 70 1  37   56，身份证尾号： 1 91  9 35）-->
<template>
	<view @touchmove.stop.prevent="stop" v-if="isShow || !isNvue">
		<view
			class="wui-actionsheet__mask"
			:class="{ 'wui-actionsheet__mask-show': show }"
			:style="{ zIndex: maskZIndex, getStyle }"
			ref="wui_asm_ani"
			@tap="handleClickMask"
		></view>
		<view
			class="wui-actionsheet__wrap"
			:class="{
				'wui-actionsheet__show': show,
				'wui-actionsheet__radius': radius,
				'wui-as__bg-light': theme === 'light',
				'wui-as__bg-dark': theme === 'dark'
			}"
			ref="wui_as_ani"
			:style="{ zIndex: zIndex }"
		>
			<text
				class="wui-actionsheet__tips"
				:class="{
					'wui-actionsheet__radius': radius,
					'wui-as__btn-light': theme === 'light',
					'wui-as__btn-dark': theme === 'dark'
				}"
				:style="{ fontSize: size + 'rpx', color: color }"
				v-if="tips"
				>{{ tips }}</text
			>
			<view :class="{ 'wui-actionsheet__operate-box': isCancel }">
				<text
					class="wui-actionsheet__btn"
					:style="{
						color: theme === 'dark' ? item.darkColor || '#D1D1D1' : item.color || '#181818',
						fontSize: itemSize + 'rpx'
					}"
					:class="{
						'wui-actionsheet__btn-last': !isCancel && index == vals.length - 1,
						'wui-as__safe-weex': !isCancel && index == vals.length - 1 && iphoneX && safeArea,
						'wui-actionsheet__radius': radius && !tips && index === 0,
						'wui-as__divider-light': (index !== 0 || tips) && theme === 'light',
						'wui-as__divider-dark': (index !== 0 || tips) && theme === 'dark',
						'wui-as__btn-light': theme === 'light',
						'wui-as__btn-dark': theme === 'dark'
					}"
					v-for="(item, index) in vals"
					:key="index"
					@tap="handleClickItem(index)"
					>{{ item.text }}</text
				>
			</view>
			<text
				:style="{
					color: theme === 'dark' ? '#D1D1D1' : '#181818',
					fontSize: itemSize + 'rpx'
				}"
				class="wui-actionsheet__btn wui-actionsheet__cancel"
				:class="{
					'wui-as__safe-weex': iphoneX && safeArea,
					'wui-as__btn-light': theme === 'light',
					'wui-as__btn-dark': theme === 'dark'
				}"
				v-if="isCancel"
				@tap="handleClickCancel"
				>取消</text
			>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
// ActionSheet 上拉菜单
export default {
	name: 'wui-actionsheet',
	emits: ['click', 'cancel'],
	props: {
		//是否显示操作菜单
		show: {
			type: Boolean,
			default: false
		},
		//菜单按钮数组，可自定义文本颜色
		itemList: {
			type: Array,
			default() {
				return [];
			}
		},
		//菜单按钮字体大小 rpx
		itemSize: {
			type: [Number, String],
			default: 32
		},
		//提示信息
		tips: {
			type: String,
			default: ''
		},
		//提示信息文本颜色
		color: {
			type: String,
			default: '#7F7F7F'
		},
		//提示文字大小 rpx
		size: {
			type: [Number, String],
			default: 26
		},
		//是否需要圆角
		radius: {
			type: Boolean,
			default: true
		},
		//是否需要取消按钮
		isCancel: {
			type: Boolean,
			default: true
		},
		//light/dark
		theme: {
			type: String,
			default: 'light'
		},
		//点击遮罩 是否可关闭
		maskClosable: {
			type: Boolean,
			default: false
		},
		// 上拉菜单层级z-index值
		zIndex: {
			type: [Number, String],
			default: 1001
		},
		maskZIndex: {
			type: [Number, String],
			default: 1000
		},
		//是否适配底部安全区
		safeArea: {
			type: Boolean,
			default: true
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			iphoneX: false,
			vals: [],
			isNvue: isNvue,
			isShow: false
		};
	},
	computed: {
		getStyle() {
			return `z-index:${Number(this.zIndex) - 10}`;
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
		itemList(newVal) {
			this.initData(newVal);
		}
	},
	created() {
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphoneX = this.isPhoneX();
		// #endif
		this.initData(this.itemList);
	},
	methods: {
		initData(vals) {
			if (vals && vals.length > 0) {
				if (typeof vals[0] !== 'object') {
					vals = vals.map(item => {
						return {
							text: item
						};
					});
				}
				this.vals = vals;
			}
		},
		handleClickMask() {
			if (!this.maskClosable) return;
			this.handleClickCancel();
		},
		handleClickItem(index) {
			if (!this.show) return;
			this.$emit('click', {
				index: index,
				...this.vals[index]
			});
		},
		handleClickCancel() {
			this.$emit('cancel');
		},
		// #ifdef APP-NVUE
		open() {
			this.isShow = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this._animation(true);
				}, 50);
			});
		},
		close() {
			this._animation(false);
		},
		_animation(type) {
			if (!this.$refs['wui_asm_ani'] || !this.$refs['wui_as_ani']) return;
			let styles = {
				transform: `translateY(${type ? '0' : '100%'})`,
				opacity: type ? 1 : 0
			};
			animation.transition(
				this.$refs['wui_asm_ani'].ref,
				{
					styles: {
						opacity: type ? 1 : 0
					},
					duration: 250,
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {}
			);
			animation.transition(
				this.$refs['wui_as_ani'].ref,
				{
					styles,
					duration: 250,
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.isShow = false;
					}
				}
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
				'iphone14promax',
				'iphone15',
				'iphone15mini',
				'iphone15pro',
				'iphone15promax'
			];
			const model = res.model.replace(/\s/g, '').toLowerCase();
			const newModel = model.split('<')[0];
			if (models.includes(model) || models.includes(newModel) || (res.safeAreaInsets && res.safeAreaInsets.bottom > 0)) {
				iphonex = true;
			}
			return iphonex;
		},
		// #endif
		stop() {}
	}
};
</script>

<style scoped>
.wui-actionsheet__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	visibility: hidden;
	min-height: 100rpx;
	/* #endif */
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	transform: translate3d(0, 100%, 0);
	transition: all 0.25s ease-in-out;
	/* #endif */
	/* #ifdef APP-NVUE */
	transition-property: transform;
	transform: translateY(100%);
	/* #endif */
	transform-origin: center center;
}

.wui-as__bg-light {
	background-color: #f8f8f8;
}

.wui-as__bg-dark {
	background-color: #111111;
}

.wui-actionsheet__radius {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	/* #ifndef APP-NVUE */
	overflow: hidden;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-actionsheet__show {
	transform: translate3d(0, 0, 0);
	visibility: visible;
}

/* #endif */

.wui-actionsheet__tips {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	padding: 40rpx 60rpx;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: normal;
}

.wui-as__btn-light {
	background-color: #ffffff;
}

.wui-as__btn-dark {
	background-color: #222222;
}

.wui-actionsheet__operate-box {
	padding-bottom: 12rpx;
}

.wui-actionsheet__btn {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: content-box;
	/* #endif */
	height: 100rpx;
	/* #ifdef APP-NVUE */
	line-height: 100rpx;
	flex: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	text-align: center;
	/* font-size: 32rpx; */
	font-weight: normal;
	position: relative;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-actionsheet__btn:active {
	/* #ifdef APP-NVUE */
	background-color: rgba(0, 0, 0, 0.2);
	/* #endif */

	/* #ifndef APP-NVUE */
	background-color: var(--wui-bg-color-hover, rgba(0, 0, 0, 0.2)) !important;
	/* #endif */
}

.wui-actionsheet__btn-last {
	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
}

/* #ifdef APP-NVUE */
.wui-as__divider-light {
	border-top-width: 0.5px;
	border-top-style: solid;
	border-top-color: #eeeeee;
}

.wui-as__divider-dark {
	border-top-width: 0.5px;
	border-top-style: solid;
	border-top-color: #333;
}

/* #endif */

/* #ifndef APP-NVUE */

.wui-as__divider-light::before {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1px solid var(--wui-color-border, #eeeeee);
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 0;
	z-index: 2;
	pointer-events: none;
}

.wui-as__divider-dark::before {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1px solid #333;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 0;
	z-index: 2;
	pointer-events: none;
}

/* #endif */

.wui-actionsheet__cancel {
	/* #ifndef APP-NVUE */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
}

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-as__safe-weex {
	padding-bottom: 34px;
}

/* #endif */

.wui-actionsheet__mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	background-color: var(--wui-bg-color-mask, rgba(0, 0, 0, 0.6));
	/* #endif */

	/* #ifdef APP-NVUE */
	background-color: rgba(0, 0, 0, 0.6);
	/* #endif */

	/* #ifndef APP-NVUE */
	transition: opacity 0.3s ease-in-out;
	opacity: 0;
	visibility: hidden;
	/* #endif */
}

.wui-actionsheet__mask-show {
	/* #ifndef APP-NVUE */
	visibility: visible;
	opacity: 1;
	/* #endif */
}
</style>
