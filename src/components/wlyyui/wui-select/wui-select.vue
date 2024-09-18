<!--（手机号： 15 2 6 7  0 13  75 6，身份证尾号： 1   91 935）-->
<template>
	<view v-if="isShow || !isNvue" @touchmove.stop.prevent="stop">
		<view
			class="wui-select__mask"
			:class="{ 'wui-select__mask-show': show }"
			:style="getStyles"
			@tap.stop="maskClose"
			ref="wui_select_mk_ani"
		></view>
		<view
			class="wui-select__wrap"
			ref="wui_select_ani"
			:class="{
				'wui-select__wrap-show': show,
				'wui-select__weex-android': isAndroid,
				'wui-select__safe-weex': iphoneX && safeArea
			}"
			:style="{
				borderTopLeftRadius: radius + 'rpx',
				borderTopRightRadius: radius + 'rpx',
				background: background,
				zIndex: zIndex
			}"
		>
			<slot>
				<view
					class="wui-select__header"
					:style="{
						background: headerBackground,
						borderTopLeftRadius: radius + 'rpx',
						borderTopRightRadius: radius + 'rpx'
					}"
				>
					<text
						class="wui-select__header-text"
						:style="{
							fontSize: titleSize + 'rpx',
							color: titleColor,
							fontWeight: fontWeight
						}"
						>{{ title }}</text
					>
					<view class="wui-select__header-close" @tap.stop="handleClose">
						<wui-icon name="w-close" color="#b2b2b2" :size="48"></wui-icon>
					</view>
					<view class="wui-select__header-line" :style="{ background: lineColor }"></view>
				</view>
			</slot>
			<scroll-view scroll-y class="wui-select__scroll" :show-scrollbar="false" :style="{ height: height + 'rpx' }">
				<view class="wui-select__list">
					<wui-list-cell
						v-for="(model, index) in itemList"
						:key="index"
						:highlight="highlight && !model.disabled"
						:padding="padding"
						:bottomBorder="splitLine && itemList.length - 1 !== index"
						:borderColor="lineColor"
						:background="background"
						:bottomLeft="bottomLeft"
						:arrow="type === 'list'"
						:arrowColor="arrowColor"
						@click="itemClick(index)"
					>
						<view
							class="wui-select__item"
							:class="{
								'wui-select__reverse': isReverse && type === 'select',
								'wui-sitem__disable': model.disabled
							}"
						>
							<view
								class="wui-select__checkbox"
								:class="{
									'wui-select__is-checkmark ': isCheckMark,
									'wui-select__checkbox-color': (!checkboxColor || checkboxColor == 'true') && model.checked && !isCheckMark
								}"
								:style="{
									background: model.checked && !isCheckMark ? checkboxColor : 'transparent',
									borderColor: model.checked && !isCheckMark ? checkboxColor : borderColor
								}"
								v-if="type === 'select'"
							>
								<view
									class="wui-select__checkmark"
									:style="{
										borderBottomColor: checkmarkColor,
										borderRightColor: checkmarkColor
									}"
									v-if="model.checked"
								></view>
							</view>
							<view class="wui-select__flex">
								<view
									class="wui-select__icon-box"
									:class="{
										'wui-select__icon-ml': !isReverse && type === 'select',
										'wui-select__icon-mr': isReverse
									}"
									:style="{
										width: iconWidth + 'rpx',
										height: iconWidth + 'rpx',
										backgroundColor: iconBgColor
									}"
									v-if="model.src"
								>
									<image
										:src="model.src"
										:style="{
											width: iconWidth + 'rpx',
											height: iconWidth + 'rpx'
										}"
										:mode="iconMode"
									></image>
								</view>
								<text
									class="wui-select__item-text"
									:class="{
										'wui-select__text-pl': !isReverse && (type === 'select' || model.src),
										'wui-select__text-pr': isReverse && (type === 'select' || model.src)
									}"
									:style="{ fontSize: size + 'rpx', color: color }"
									>{{ model.text }}</text
								>
							</view>
						</view>
					</wui-list-cell>
				</view>
			</scroll-view>
			<view class="wui-select__btn-wrap" v-if="type === 'select'">
				<view class="wui-select__btn" :class="{ 'wui-select__btn-color': !btnBackground }" :style="{ background: btnBackground }">
					<text class="wui-select__btn" :class="['wui-select__btn-text']" :style="{ color: btnColor }" @tap.stop="handleClick">{{
						btnText
					}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
//非easycom模式取消注释引入组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
// import wuiListCell from "@/components/wlyyui/wui-list-cell/wui-list-cell.vue"
export default {
	name: 'wui-select',
	emits: ['click', 'confirm', 'close'],
	// components:{
	// 	wuiIcon,
	// 	wuiListCell
	// },
	props: {
		show: {
			type: Boolean,
			default: false
		},
		options: {
			type: Array,
			default() {
				return [];
			}
		},
		height: {
			type: [Number, String],
			default: 600
		},
		type: {
			type: String,
			default: 'select'
		},
		radius: {
			type: [Number, String],
			default: 24
		},
		headerBackground: {
			type: String,
			default: '#fff'
		},
		title: {
			type: String,
			default: '请选择'
		},
		titleSize: {
			type: [Number, String],
			default: 32
		},
		titleColor: {
			type: String,
			default: '#181818'
		},
		fontWeight: {
			type: [Number, String],
			default: 400
		},
		multiple: {
			type: Boolean,
			default: false
		},
		background: {
			type: String,
			default: '#fff'
		},
		padding: {
			type: Array,
			default() {
				return ['32rpx', '32rpx'];
			}
		},
		//选择框选中后颜色
		// #ifndef APP-NVUE
		checkboxColor: {
			type: String,
			default: ''
		},
		// #endif
		// #ifdef APP-NVUE
		checkboxColor: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		borderColor: {
			type: String,
			default: '#ccc'
		},
		isCheckMark: {
			type: Boolean,
			default: false
		},
		checkmarkColor: {
			type: String,
			default: '#fff'
		},
		isReverse: {
			type: Boolean,
			default: false
		},
		splitLine: {
			type: Boolean,
			default: true
		},
		lineColor: {
			type: String,
			default: '#EEEEEE'
		},
		bottomLeft: {
			type: [Number, String],
			default: 32
		},
		arrowColor: {
			type: String,
			default: '#B2B2B2'
		},
		highlight: {
			type: Boolean,
			default: true
		},
		iconWidth: {
			type: [Number, String],
			default: 48
		},
		iconBgColor: {
			type: String,
			default: 'rgba(0,0,0,0)'
		},
		iconMode: {
			type: String,
			default: 'widthFix'
		},
		size: {
			type: [Number, String],
			default: 30
		},
		color: {
			type: String,
			default: '#181818'
		},
		btnText: {
			type: String,
			default: '确定'
		},
		// #ifdef APP-NVUE
		btnBackground: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		btnBackground: {
			type: String,
			default: ''
		},
		// #endif
		btnColor: {
			type: String,
			default: '#fff'
		},
		maskBackground: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		maskClosable: {
			type: Boolean,
			default: false
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
	computed: {
		getStyles() {
			return `background:${this.maskBackground};z-index:${Number(this.zIndex) - 1};`;
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
		options(newVal) {
			this.initData(newVal);
		}
	},
	data() {
		let isAndroid = false;
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		const res = uni.getSystemInfoSync();
		isAndroid = res.platform.toLocaleLowerCase() == 'android';
		// #endif
		return {
			isNvue: isNvue,
			isAndroid: isAndroid,
			itemList: [],
			index: -1,
			isShow: false,
			iphoneX: false
		};
	},
	created() {
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphoneX = this.isPhoneX();
		// #endif
		this.initData(this.options);
	},
	methods: {
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
			if (models.includes(model) || models.includes(model) || (res.safeAreaInsets && res.safeAreaInsets.bottom > 0)) {
				iphonex = true;
			}
			return iphonex;
		},
		// #endif
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
			if (!this.$refs['wui_select_ani'] || !this.$refs['wui_select_mk_ani']) return;
			animation.transition(
				this.$refs['wui_select_mk_ani'].ref,
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
			//android 部分手机隐藏时动画有抖动感，调整duration去动画
			animation.transition(
				this.$refs['wui_select_ani'].ref,
				{
					styles: {
						transform: `translateY(${type ? '0' : '100%'})`,
						opacity: type ? 1 : 0
					},
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
		initData(vals) {
			vals = JSON.parse(JSON.stringify(vals));
			if (vals && vals.length > 0) {
				if (typeof vals[0] !== 'object') {
					vals = vals.map(item => {
						return {
							text: item,
							checked: false,
							disabled: false
						};
					});
				} else {
					vals.map((item, index) => {
						item.checked = item.checked || false;
						if (this.type === 'select' && !this.multiple && item.checked) {
							this.index = index;
						}
					});
				}
				this.itemList = vals;
			}
		},
		itemClick(index) {
			let vals = [...this.itemList];
			let item = vals[index];
			if (item && item.disabled) return;
			if (this.type === 'select') {
				if (this.multiple) {
					item.checked = !item.checked;
				} else {
					vals.forEach((item, idx) => {
						if (index === idx) {
							item.checked = true;
						} else {
							item.checked = false;
						}
					});
					this.index = index;
				}
				this.itemList = vals;
			} else {
				this.$emit('click', {
					index: index,
					options: this.options[index]
				});
			}
		},
		handleClick() {
			if (this.type !== 'select') return;
			if (this.multiple) {
				let items = [];
				this.itemList.forEach((item, idx) => {
					if (item.checked) {
						items.push(this.options[idx]);
					}
				});
				this.$emit('confirm', {
					options: items
				});
			} else {
				let index = this.index;
				this.$emit('confirm', {
					index: index,
					options: index === -1 ? '' : this.options[this.index]
				});
			}
		},
		maskClose() {
			if (!this.maskClosable) return;
			this.handleClose();
		},
		handleClose() {
			this.$emit('close', {});
		},
		stop() {}
	}
};
</script>

<style scoped>
.wui-select__mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	transition: all ease-in-out 0.3s;
	visibility: hidden;
	/* #endif */
	opacity: 0;
}

/* #ifndef APP-NVUE */
.wui-select__mask-show {
	opacity: 1;
	visibility: visible;
}

/* #endif */
.wui-select__wrap {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	width: 100%;
	transform: translate3d(0, 100%, 0);
	transition: all 0.3s ease-in-out;
	min-height: 20rpx;
	opacity: 0;
	visibility: hidden;
	/* #endif */

	/* #ifdef APP-NVUE */
	flex-direction: column;
	transform: translateY(100%);
	/* #endif */

	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
}

/* #ifdef APP-NVUE */
.wui-select__weex-android {
	transform: translateY(950rpx);
}

/* #endif */

/* #ifndef APP-NVUE */
.wui-select__wrap-show {
	transform: translate3d(0, 0, 0);
	opacity: 1;
	visibility: visible;
}

/* #endif */

.wui-select__scroll {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
}

.wui-select__list {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
}

.wui-select__item {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	position: relative;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-sitem__disable {
	opacity: 0.5;
	/* #ifdef H5 */
	cursor: not-allowed;
	/* #endif */
}

.wui-select__flex {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
}

.wui-select__reverse {
	justify-content: space-between;
	flex-direction: row-reverse;
}

.wui-select__checkbox {
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
.wui-select__checkbox-color {
	background: var(--wui-color-primary, #1396ff) !important;
	border-color: var(--wui-color-primary, #1396ff) !important;
}

.wui-select__btn-color {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
.wui-select__is-checkmark {
	border-width: 0 !important;
	background: transparent !important;
}

.wui-select__checkmark {
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

.wui-select__item-text {
	/* #ifndef APP-NVUE */
	word-break: break-all;
	/* #endif */
	font-weight: normal;
}

.wui-select__text-pl {
	padding-left: 24rpx;
}

.wui-select__text-pr {
	padding-right: 24rpx;
}

.wui-select__icon-box {
	overflow: hidden;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
}

.wui-select__icon-ml {
	margin-left: 24rpx;
}

.wui-select__icon-mr {
	margin-right: 24rpx;
}

.wui-select__header {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
	height: 98rpx;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	position: relative;
}

.wui-select__header-line {
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
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

.wui-select__header-text {
	text-align: center;
	/* #ifndef APP-NVUE */
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	box-sizing: border-box;
	/* #endif */
	text-overflow: ellipsis;
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	flex: 1;
	padding: 0 88rpx;
}

.wui-select__header-close {
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	right: 32rpx;
	top: 24rpx;
	text-align: right;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-select__btn-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
}

.wui-select__btn {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 88rpx;
	border-radius: 44rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	font-size: 32rpx;
	font-weight: normal;
	text-align: center;
}

/* #ifdef APP-NVUE */
.wui-select__btn-text {
	line-height: 88rpx;
}

/* #endif */
.wui-select__btn-text:active {
	background: rgba(0, 0, 0, 0.2);
}

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-select__safe-weex {
	padding-bottom: 34px;
}

/* #endif */
</style>
