<!--（手机号：1    5 2670 13 7  5 6，身份证尾号：1 9  1  935）-->
<template>
	<view class="wui-date__picker-wrap" @touchend="stop">
		<view
			class="wui-date__picker-mask"
			@touchmove.stop.prevent="stop"
			:class="{ 'wui-dpk__mask-show': isShow }"
			:style="maskStyl"
			ref="wui_dpkm_ani"
			@tap.stop="maskClick"
		></view>
		<!-- fix：此处key值可解决Nvue端动态切换背景不生效的问题 -->
		<view
			:key="theme"
			class="wui-date__picker-content"
			:class="{
				'wui-dpk__content-dark': theme === 'dark',
				'wui-dpk__content-light': theme !== 'dark',
				'wui-dpk__content-show': isShow,
				'wui-date__picker-radius': radius
			}"
			:style="{ zIndex: zIndex }"
			ref="wui_dpk_ani"
		>
			<view
				class="wui-date__picker-header"
				:class="{
					'wui-dpk__header-dark': theme === 'dark',
					'wui-date__picker-radius': radius
				}"
				:style="headerStyl"
			>
				<text
					class="wui-dpk_btn-cancel"
					:class="[theme === 'dark' ? 'wui-dpk__cancel-color_dark' : 'wui-dpk__cancel-color']"
					:style="cancelStyl"
					@tap.stop="btnCancel"
					>取消</text
				>
				<text
					class="wui-date__picker-title"
					:class="[theme === 'dark' ? 'wui-dpk__title-color_dark' : 'wui-dpk__title-color']"
					:style="titleStyl"
					>{{ title }}</text
				>
				<text class="wui-dpk__btn-sure wui-dpk__sure-color" :style="confrimStyl" @tap.stop="btnConfirm">确定</text>
			</view>
			<view class="wui-dpk__range-wrap" v-if="range">
				<view class="wui-dpk__range-inner" :class="[theme === 'dark' ? 'wui-dpk__range-dark' : 'wui-dpk__range-light']">
					<text
						class="wui-dpk__range-text"
						:class="{ 'wui-dpk__range-active': isActive == 1 }"
						:style="startStyl"
						@tap.stop="rangeChange($event, 1)"
						>{{ startDate.result || start }}</text
					>
					<text
						class="wui-dpk__range-text"
						:class="{ 'wui-dpk__range-active': isActive == 2 }"
						:style="endStyl"
						@tap.stop="rangeChange($event, 2)"
						>{{ endDate.result || end }}</text
					>
				</view>
			</view>
			<view @touchstart.stop="pickerstart">
				<!--支付宝小程序不支持动态切换 picker-view-column ... 设置高度也不行-->
				<!-- #ifdef MP-ALIPAY -->
				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 1"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in years"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '年' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 2"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in years"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '年' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in months"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '月' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 3"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in years"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '年' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in months"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '月' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in days"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '日' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 4"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in years"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '年' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in months"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '月' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in days"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '日' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in hours"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '时' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 5"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in years"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '年' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in months"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '月' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in days"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '日' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in hours"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '时' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in minutes"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '分' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 6"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in hours"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '时' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in minutes"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '分' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 7"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in hours"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '时' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in minutes"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '分' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in seconds"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '秒' : '' }}
						</view>
					</picker-view-column>
				</picker-view>

				<picker-view
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:value="vals"
					@change="pickerChange"
					v-if="type == 8"
				>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in minutes"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '分' : '' }}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view
							:style="contentStyl"
							v-for="(item, index) in seconds"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
						>
							{{ formatVal(item) }}{{ unit ? '秒' : '' }}
						</view>
					</picker-view-column>
				</picker-view>
				<!-- #endif -->

				<!-- #ifndef MP-ALIPAY -->
				<picker-view
					:mask-top-style="theme === 'dark' ? darkStyle : ''"
					:mask-bottom-style="theme === 'dark' ? darkBottomStyle : ''"
					:mask-style="theme === 'dark' ? darkStyle : ''"
					:indicator-style="theme === 'dark' ? indicatorStyl : 'height: 44px;border-top-width:0.5px;border-bottom-width:0.5px;'"
					:indicator-class="theme === 'dark' ? 'wui-date__picker-indicator' : ''"
					class="wui-date__picker-view"
					:style="{ height: height + 'rpx' }"
					:key="theme + type"
					:value="vals"
					immediate-change
					@change="pickerChange"
				>
					<picker-view-column v-if="type == 1 || type == 2 || type == 3 || type == 4 || type == 5">
						<text
							:style="contentStyl"
							v-for="(item, index) in years"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
							>{{ formatVal(item) }}{{ unit ? '年' : '' }}</text
						>
					</picker-view-column>
					<picker-view-column v-if="type == 2 || type == 3 || type == 4 || type == 5">
						<text
							:style="contentStyl"
							v-for="(item, index) in months"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
							>{{ formatVal(item) }}{{ unit ? '月' : '' }}</text
						>
					</picker-view-column>
					<picker-view-column v-if="type == 3 || type == 4 || type == 5">
						<text
							:style="contentStyl"
							v-for="(item, index) in days"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
							>{{ formatVal(item) }}{{ unit ? '日' : '' }}</text
						>
					</picker-view-column>
					<picker-view-column v-if="type == 4 || type == 5 || type == 6 || type == 7">
						<text
							:style="contentStyl"
							v-for="(item, index) in hours"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
							>{{ formatVal(item) }}{{ unit ? '时' : '' }}</text
						>
					</picker-view-column>
					<picker-view-column v-if="type == 5 || type == 6 || type == 7 || type == 8">
						<text
							:style="contentStyl"
							v-for="(item, index) in minutes"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
							>{{ formatVal(item) }}{{ unit ? '分' : '' }}</text
						>
					</picker-view-column>
					<picker-view-column v-if="type == 7 || type == 8">
						<text
							:style="contentStyl"
							v-for="(item, index) in seconds"
							:key="index"
							class="wui-date__picker-text"
							:class="{ 'wui-dpk__color-dark': theme === 'dark' }"
							>{{ formatVal(item) }}{{ unit ? '秒' : '' }}</text
						>
					</picker-view-column>
				</picker-view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-date-picker',
	emits: ['change', 'cancel'],
	props: {
		show: {
			type: Boolean,
			default: false
		},
		//可选日期类型：1-年 2-年月 3-年月日 4-年月日 时 5-年月日 时分 6-时分 7-时分秒 8-分秒
		type: {
			type: [Number, String],
			default: 1
		},
		value: {
			type: String,
			default: ''
		},
		valueEnd: {
			type: String,
			default: ''
		},
		minDate: {
			type: String,
			default: '2010-01-01'
		},
		maxDate: {
			type: String,
			default: '2030-12-31'
		},
		hourRange: {
			type: Array,
			default() {
				return [0, 23];
			}
		},
		minuteRange: {
			type: Array,
			default() {
				return [0, 59];
			}
		},
		secondRange: {
			type: Array,
			default() {
				return [0, 59];
			}
		},
		unit: {
			type: Boolean,
			default: true
		},
		range: {
			type: Boolean,
			default: false
		},
		start: {
			type: String,
			default: '起始日期'
		},
		end: {
			type: String,
			default: '结束日期'
		},
		rangeBackground: {
			type: String,
			default: ''
		},
		radius: {
			type: Boolean,
			default: false
		},
		height: {
			type: [Number, String],
			default: 520
		},
		size: {
			type: [Number, String],
			default: 16
		},
		color: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		titleSize: {
			type: [Number, String],
			default: 28
		},
		titleColor: {
			type: String,
			default: ''
		},
		confirmText: {
			type: String,
			default: '确定'
		},
		confirmColor: {
			type: String,
			default: ''
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		cancelColor: {
			type: String,
			default: ''
		},
		btnSize: {
			type: [Number, String],
			default: 32
		},
		background: {
			type: String,
			default: ''
		},
		theme: {
			type: String,
			default: 'light'
		},
		maskClosable: {
			type: Boolean,
			default: true
		},
		maskBackground: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		zIndex: {
			type: [Number, String],
			default: 999
		},
		//点击确认按钮后是否立即关闭弹框
		isClose: {
			type: Boolean,
			default: true
		},
		//自定义参数
		param: {
			type: [Number, String],
			default: 0
		}
	},
	created() {
		this.initialize();
		this.isShow = this.show;
	},
	// #ifdef APP-NVUE
	mounted() {
		if (!this.$refs['wui_dpkm_ani'] || !this.$refs['wui_dpk_ani']) return;
		this._transtion(
			'wui_dpkm_ani',
			{
				transform: 'translateX(-100%)'
			},
			0
		);
		this._transtion(
			'wui_dpk_ani',
			{
				transform: 'translateY(100%)'
			},
			0
		);
	},
	// #endif
	computed: {
		cancelStyl() {
			let styles = `font-size:${this.btnSize}rpx;`;
			if (this.cancelColor) {
				styles += `color:${this.cancelColor};`;
			}
			return styles;
		},
		confrimStyl() {
			let styles = `font-size:${this.btnSize}rpx;`;
			if (this.confirmColor) {
				styles += `color:${this.confirmColor};`;
			}
			return styles;
		},
		titleStyl() {
			let styles = `font-size:${this.titleSize}rpx;`;
			if (this.titleColor) {
				styles += `color:${this.titleColor};`;
			}
			return styles;
		},
		contentStyl() {
			let styles = `font-size:${this.size}px;`;
			if (this.color) {
				styles += `color:${this.color};`;
			} else {
				// #ifdef MP-ALIPAY
				styles += `color:${this.theme === 'dark' ? '#d1d1d1' : '#181818'};`;
				// #endif
			}
			return styles;
		},
		headerStyl() {
			let styles = '';
			if (this.background) {
				styles += `background:${this.background};`;
			}
			return styles;
		},
		maskStyl() {
			return `background:${this.maskBackground};z-index:${Number(this.zIndex - 10)};`;
		},
		initChange() {
			return `${this.type}_${this.value}_${this.minDate}_${this.maxDate}`;
		},
		startStyl() {
			let style = '';
			if (this.isActive == 1 && this.rangeBackground) {
				style = `background:${this.rangeBackground};`;
			}
			return style;
		},
		endStyl() {
			let style = '';
			if (this.isActive == 2 && this.rangeBackground) {
				style = `background:${this.rangeBackground};`;
			}
			return style;
		}
	},
	watch: {
		initChange(val) {
			this.initialize();
		},
		hourRange(val) {
			//设置默认值？
			this.getHours();
		},
		minuteRange(val) {
			this.getMinutes();
		},
		secondRange(val) {
			this.getSeconds();
		},
		// #ifdef APP-NVUE
		isShow: {
			handler(newVal) {
				if (newVal) {
					this.openPicker();
				} else {
					this.closePicker();
				}
			},
			immediate: true
		},
		// #endif
		show(val) {
			this.isShow = val;
		}
	},
	data() {
		return {
			years: [],
			months: [],
			days: [],
			hours: [],
			minutes: [],
			seconds: [],
			vals: [],
			values: [],
			minArr: [],
			maxArr: [],
			// #ifndef APP-NVUE
			darkStyle:
				'background-image: -webkit-linear-gradient(top, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6)), -webkit-linear-gradient(bottom, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6));',
			indicatorStyl: 'border-color: #333;height: 44px;',
			darkBottomStyle: '',
			// #endif
			// #ifdef APP-NVUE
			darkStyle: 'background: linear-gradient(to bottom, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6));',
			darkBottomStyle: 'background: linear-gradient(to top, rgba(35, 35, 35, .95), rgba(35, 35, 35, .6));',
			indicatorStyl: 'border-color: #333;height: 44px;border-top-width:0.5px;border-bottom-width:0.5px',
			// #endif
			isEnd: true,
			isShow: false,
			isActive: 1,
			startDate: {},
			endDate: {}
		};
	},
	methods: {
		initialize() {
			this.reset();
			this.getDefaultOptions(this.value);
			this.handleDate();
			setTimeout(() => {
				this.initData();
			}, 50);
		},
		btnCancel(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			this.isShow = false;
			this.$emit('cancel', {
				param: this.param
			});
		},
		maskClick(e) {
			if (!this.maskClosable) return;
			this.btnCancel(e);
		},
		reset() {
			this.vals = [[0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0], [0, 0, 0], [0, 0]][Number(this.type) - 1];
			this.isActive = 1;
			this.startDate = {};
			this.endDate = {};
		},
		open() {
			this.isShow = true;
		},
		close() {
			this.isShow = false;
		},
		compareDate(start, end) {
			let type = Number(this.type);
			if (type == 8) {
				start = '00:' + start;
				end = '00:' + end;
			}

			start = start.replace(/\-/g, '/');
			end = end.replace(/\-/g, '/');

			if (start.indexOf('/') == -1) {
				start = `2001/01/01 ${start}`;
				end = `2001/01/01 ${end}`;
			}

			return new Date(start).getTime() <= new Date(end).getTime();
		},
		formatVal(num) {
			return num < 10 ? `0${num}` : num + '';
		},
		toArray(start, end) {
			return Array.from(new Array(end + 1).keys()).slice(start);
		},
		getStrCount(str) {
			let regex = new RegExp('/', 'g');
			let result = str.match(regex);
			return !result ? 0 : result.length;
		},
		getValueToDate(val) {
			let values = [];
			let type = Number(this.type);
			if (type == 1 && this.getStrCount(val) === 0) {
				return [Number(val), -1, -1, -1, -1, -1];
			}
			if (type == 8) val = '00:' + val;
			let format = val.replace(/\-/g, '/');
			if (type == 2 && this.getStrCount(val) === 1) {
				format += '/01';
			}
			if (format.indexOf('/') == -1) {
				format = `2001/01/01 ${format}`;
			}
			try {
				const time = new Date(format);
				const year = time.getFullYear();
				const month = time.getMonth() + 1;
				const day = time.getDate();
				const hour = time.getHours();
				const minute = time.getMinutes();
				const second = time.getSeconds();
				values = [year, month, day, hour, minute, second];
			} catch (e) {
				//TODO handle the exception
				console.log('默认日期时间格式有误！');
			}
			return values;
		},
		getRangeInitRes(vals) {
			const type = Number(this.type);
			let d = {
				param: this.param
			};
			switch (type) {
				case 1:
					d.year = vals[0];
					d.result = d.year;
					break;
				case 2:
					d.year = vals[0];
					d.month = this.formatVal(vals[1]);
					d.result = `${d.year}-${d.month}`;
					break;
				case 3:
					d.year = vals[0];
					d.month = this.formatVal(vals[1]);
					d.day = this.formatVal(vals[2]);
					d.result = `${d.year}-${d.month}-${d.day}`;
					break;
				case 4:
					d.year = vals[0];
					d.month = this.formatVal(vals[1]);
					d.day = this.formatVal(vals[2]);
					d.hour = this.formatVal(vals[3]);
					d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:00`;
					break;
				case 5:
					// 5-年月日 时分 6-时分 7-时分秒 8-分秒
					d.year = vals[0];
					d.month = this.formatVal(vals[1]);
					d.day = this.formatVal(vals[2]);
					d.hour = this.formatVal(vals[3]);
					d.minute = this.formatVal(vals[4]);
					d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}`;
					break;
				case 6:
					d.hour = this.formatVal(vals[3]);
					d.minute = this.formatVal(vals[4]);
					d.result = `${d.hour}:${d.minute}`;
					break;
				case 7:
					d.hour = this.formatVal(vals[3]);
					d.minute = this.formatVal(vals[4]);
					d.second = this.formatVal(vals[5]);
					d.result = `${d.hour}:${d.minute}:${d.second}`;
					break;
				case 8:
					d.minute = this.formatVal(vals[4]);
					d.second = this.formatVal(vals[5]);
					d.result = `${d.minute}:${d.second}`;
					break;
				default:
					break;
			}
			return d;
		},
		getDefaultOptions(val) {
			//区间选择时默认值必须传值起始时间，否则无效
			if (!val || val === true || val === 'true') {
				this.values = [];
				return;
			}
			if (this.range) {
				const startValues = this.getValueToDate(val);
				if (this.valueEnd) {
					const endValues = this.getValueToDate(this.valueEnd);
					this.values = endValues;
					this.startDate = this.getRangeInitRes(startValues);
					this.endDate = this.getRangeInitRes(endValues);
					this.isActive = 2;
				} else {
					this.values = startValues;
					this.startDate = this.getRangeInitRes(startValues);
				}
			} else {
				this.values = this.getValueToDate(val);
			}
		},
		toDate(date, def) {
			if (date === true || date === 'true' || !date) {
				date = def;
			}
			return new Date(date.replace(/\-/g, '/'));
		},
		handleDate() {
			const min = this.toDate(this.minDate, '2010-01-01');
			const max = this.toDate(this.maxDate, '2030-12-31');
			this.minArr = [min.getFullYear(), min.getMonth() + 1, min.getDate(), min.getHours(), min.getMinutes(), min.getSeconds()];
			this.maxArr = [max.getFullYear(), max.getMonth() + 1, max.getDate(), max.getHours(), max.getMinutes(), max.getSeconds()];
		},
		getYears() {
			let min = this.minArr[0];
			let max = this.maxArr[0];
			max = max < min ? min : max;
			this.years = this.toArray(min, max);
		},
		getMonths(index) {
			let year = this.years[index];
			let min = 1;
			let max = 12;
			if (year == this.minArr[0]) {
				min = this.minArr[1];
			}
			if (year == this.maxArr[0]) {
				max = this.maxArr[1];
			}
			max = max < min ? min : max;
			this.months = this.toArray(min, max);
		},
		getDays(index, idx) {
			let min = 1;
			let year = this.years[index];
			let month = this.months[idx];
			let max = new Date(year, month, 0).getDate();
			if (year == this.minArr[0] && month == this.minArr[1]) {
				min = this.minArr[2];
			}
			if (year == this.maxArr[0] && month == this.maxArr[1]) {
				max = this.maxArr[2];
			}
			max = !max || max < min ? min : max;
			this.days = this.toArray(min, max);
		},
		getHours() {
			let range = this.hourRange || [0, 23];
			let min = Number(range[0] || 0);
			let max = Number(range[1] || 23);
			min = Math.floor(min < 0 || min > 23 ? 0 : min);
			max = Math.floor(max < 0 || max > 23 ? 23 : max);
			max = max < min ? min : max;
			this.hours = this.toArray(min, max);
		},
		getMinutes() {
			let range = this.minuteRange || [0, 59];
			let min = Number(range[0] || 0);
			let max = Number(range[1] || 59);
			min = Math.floor(min < 0 || min > 59 ? 0 : min);
			max = Math.floor(max < 0 || max > 59 ? 59 : max);
			max = max < min ? min : max;
			this.minutes = this.toArray(min, max);
		},
		getSeconds() {
			let range = this.secondRange || [0, 59];
			let min = Number(range[0] || 0);
			let max = Number(range[1] || 59);
			min = Math.floor(min < 0 || min > 59 ? 0 : min);
			max = Math.floor(max < 0 || max > 59 ? 59 : max);
			max = max < min ? min : max;
			this.seconds = this.toArray(min, max);
		},
		getIndex(arr, val) {
			if (!arr || arr.length === 0 || !val) return 0;
			let index = arr.indexOf(val);
			return index === -1 ? 0 : index;
		},
		initData() {
			let type = Number(this.type);
			let index = 0;
			let idx = 0;
			if (type < 6) {
				this.getYears();
				index = this.getIndex(this.years, this.values[0]);
				if (type > 1) {
					this.getMonths(index);
					idx = this.getIndex(this.months, this.values[1]);
					type > 2 && this.getDays(index, idx);
				}
			}
			type > 3 && type < 8 && this.getHours();
			type > 4 && this.getMinutes();
			type > 6 && this.getSeconds();
			this.$nextTick(() => {
				setTimeout(() => {
					let di = this.getIndex(this.days, this.values[2]);
					let hi = this.getIndex(this.hours, this.values[3]);
					let mi = this.getIndex(this.minutes, this.values[4]);
					let si = this.getIndex(this.seconds, this.values[5]);
					this.vals = [
						[index],
						[index, idx],
						[index, idx, di],
						[index, idx, di, hi],
						[index, idx, di, hi, mi],
						[hi, mi],
						[hi, mi, si],
						[mi, si]
					][type - 1];
				}, 50);
			});
		},
		getResult() {
			const vals = this.vals;
			const type = Number(this.type);
			let d = {
				param: this.param
			};
			let index = 0;
			let idx = 0;
			let mc = 0;
			let dc = 0;
			switch (type) {
				case 1:
					d.year = this.years[vals[0]];
					d.result = d.year;
					break;
				case 2:
					d.year = this.years[vals[0]];
					index = this.months.length - 1;
					mc = vals[1];
					d.month = this.formatVal(this.months[mc > index ? index : mc]);
					d.result = `${d.year}-${d.month}`;
					break;
				case 3:
					d.year = this.years[vals[0]];
					index = this.months.length - 1;
					idx = this.days.length - 1;
					mc = vals[1];
					dc = vals[2];
					d.month = this.formatVal(this.months[mc > index ? index : mc]);
					d.day = this.formatVal(this.days[dc > idx ? idx : dc]);
					d.result = `${d.year}-${d.month}-${d.day}`;
					break;
				case 4:
					d.year = this.years[vals[0]];
					index = this.months.length - 1;
					idx = this.days.length - 1;
					mc = vals[1];
					dc = vals[2];
					d.month = this.formatVal(this.months[mc > index ? index : mc]);
					d.day = this.formatVal(this.days[dc > idx ? idx : dc]);
					d.hour = this.formatVal(this.hours[vals[3]]);
					d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:00`;
					break;
				case 5:
					// 5-年月日 时分 6-时分 7-时分秒 8-分秒
					d.year = this.years[vals[0]];
					index = this.months.length - 1;
					idx = this.days.length - 1;
					mc = vals[1];
					dc = vals[2];
					d.month = this.formatVal(this.months[mc > index ? index : mc]);
					d.day = this.formatVal(this.days[dc > idx ? idx : dc]);
					d.hour = this.formatVal(this.hours[vals[3]]);
					d.minute = this.formatVal(this.minutes[vals[4]]);
					d.result = `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}`;
					break;
				case 6:
					d.hour = this.formatVal(this.hours[vals[0]]);
					d.minute = this.formatVal(this.minutes[vals[1]]);
					d.result = `${d.hour}:${d.minute}`;
					break;
				case 7:
					d.hour = this.formatVal(this.hours[vals[0]]);
					d.minute = this.formatVal(this.minutes[vals[1]]);
					d.second = this.formatVal(this.seconds[vals[2]]);
					d.result = `${d.hour}:${d.minute}:${d.second}`;
					break;
				case 8:
					d.minute = this.formatVal(this.minutes[vals[0]]);
					d.second = this.formatVal(this.seconds[vals[1]]);
					// d.result = `00:${d.minute}:${d.second}`
					d.result = `${d.minute}:${d.second}`;
					break;
				default:
					break;
			}
			return d;
		},
		emitChange() {
			let data = {};
			if (this.range) {
				data = {
					startDate: this.startDate,
					endDate: this.endDate
				};
			} else {
				data = this.getResult();
			}
			setTimeout(() => {
				this.$emit('change', data);
			}, 0);
		},
		waitForTrigger(index = 0) {
			if (this.isEnd) {
				this.emitChange();
			} else {
				index++;
				// #ifdef H5
				if (index >= 10) {
					this.isEnd = true;
				}
				// #endif
				// #ifndef H5
				if (index >= 20) {
					this.isEnd = true;
				}
				// #endif
				setTimeout(() => {
					this.waitForTrigger(index);
				}, 50);
			}
		},
		btnConfirm(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			if (this.range) {
				//判断选择结果
				let start = this.startDate.result;
				let end = this.endDate.result;
				if (!start || !end) {
					let msg = !start ? this.start : this.end;
					uni.showToast({
						title: `请选择${msg}`,
						icon: 'none'
					});
					if (start && !end) {
						this.isActive = 2;
					}
					return;
				} else if (!this.compareDate(start, end)) {
					uni.showToast({
						title: `${this.end}不能小于${this.start}`,
						icon: 'none'
					});
					return;
				}
			}
			setTimeout(() => {
				if (this.isClose) {
					this.isShow = false;
				}
				this.waitForTrigger();
			}, 80);
		},
		pickerChange(e) {
			let value = e.detail.value;
			let type = Number(this.type);
			if (type > 1 && type < 6) {
				if (value[0] != this.vals[0]) {
					this.getMonths(value[0]);
					if (type > 2) {
						this.getDays(value[0], value[1]);
					}
				} else if (value[1] != this.vals[1] && type > 2) {
					this.getDays(value[0], value[1]);
				}
			}
			this.vals = value;
			if (this.range) {
				setTimeout(() => {
					if (this.isActive == 1) {
						this.startDate = this.getResult();
					} else {
						this.endDate = this.getResult();
					}
				}, 35);
			}
			this.isEnd = true;
		},
		pickerstart() {
			this.isEnd = false;
		},
		rangeChange(e, type) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			this.isActive = type;
		},
		// #ifdef APP-NVUE
		openPicker() {
			setTimeout(() => {
				this._animation(true);
			}, 20);
		},
		closePicker() {
			this._animation(false);
		},
		_transtion(ref, styles, duration, callback) {
			animation.transition(
				this.$refs[ref].ref,
				{
					styles: styles,
					duration: duration,
					needLayout: false,
					delay: 0
				},
				() => {
					callback && callback();
				}
			);
		},
		_animation(type) {
			if (!this.$refs['wui_dpkm_ani'] || !this.$refs['wui_dpk_ani']) return;
			if (type) {
				this._transtion(
					'wui_dpkm_ani',
					{
						transform: 'translateX(0)'
					},
					0,
					() => {
						this._transtion(
							'wui_dpkm_ani',
							{
								opacity: 1
							},
							250
						);
					}
				);
			} else {
				this._transtion(
					'wui_dpkm_ani',
					{
						opacity: 0
					},
					250,
					() => {
						this._transtion(
							'wui_dpkm_ani',
							{
								transform: 'translateX(-100%)'
							},
							0
						);
					}
				);
			}
			this._transtion(
				'wui_dpk_ani',
				{
					transform: `translateY(${type ? '0' : '100%'})`
				},
				250
			);
		},
		// #endif
		stop(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
		}
	}
};
</script>

<style scoped>
.wui-date__picker-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	transition: all 0.25s ease-in-out;
	visibility: hidden;
	/* #endif */
	/* #ifdef APP-NVUE */
	transition-property: opacity;
	transition-timing-function: ease-in-out;
	transition-duration: 0.25s;
	/* #endif */
	opacity: 0;
}

.wui-dpk__mask-show {
	/* #ifndef APP-NVUE */
	visibility: visible;
	/* #endif */
	opacity: 1;
}

.wui-date__picker-content {
	/* #ifndef APP-NVUE */
	width: 100%;
	visibility: hidden;
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
	transition-property: opacity;
	transition-duration: 0.25s;
	transform: translateY(100%);
	/* opacity: 0; */
	/* #endif */
	transform-origin: center center;
	flex-direction: column;
}

.wui-dpk__content-show {
	/* #ifndef APP-NVUE */
	transform: translate3d(0, 0, 0);
	visibility: visible;
	/* #endif */

	/* #ifdef APP-NVUE */
	opacity: 1;
	/* #endif */
}

.wui-dpk__content-light {
	background-color: #fff;
}

.wui-dpk__content-dark {
	background-color: #222;
	opacity: 1;
}

.wui-date__picker-radius {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	overflow: hidden;
}

.wui-date__picker-header {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 20rpx;
	background: #fff;
	position: relative;

	/* #ifdef APP-NVUE */
	border-bottom-width: 0.5px;
	border-bottom-color: #eee;
	border-bottom-style: solid;
	/* #endif */
}

.wui-dpk__header-dark {
	background: #222;
	border-bottom-color: #333;
}

/* #ifndef APP-NVUE */
.wui-date__picker-header::after {
	content: '';
	position: absolute;
	border-bottom: 1px solid #eee;
	transform: scaleY(0.5) translateZ(0);
	bottom: 0;
	right: 0;
	left: 0;
}

.wui-dpk__header-dark::after {
	border-bottom-color: #333;
}

/* #endif */

.wui-dpk__range-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 16rpx 32rpx;
}

.wui-dpk__range-inner {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 560rpx;
	border-radius: 16rpx;
	overflow: hidden;
	padding: 2px;
}

.wui-dpk__range-light {
	background: #fff;
}

.wui-dpk__range-dark {
	background: #333;
}

.wui-dpk__range-text {
	/* #ifndef APP-NVUE */
	display: block;
	display: flex;
	white-space: nowrap;
	/* #endif */
	font-size: 24rpx;
	color: #7f7f7f;
	align-items: center;
	justify-content: center;
	text-align: center;
	flex: 1;
	border-radius: 16rpx;
	height: 56rpx;
	/* #ifdef APP-NVUE */
	line-height: 56rpx;
	/* #endif */
	font-weight: normal;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-dpk__range-active {
	color: #fff;
	/* #ifdef APP-NVUE */
	background: #1396ff;
	/* #endif */

	/* #ifndef APP-NVUE */
	background: var(--wui-color-primary, #1396ff);
	/* #endif */
}

.wui-dpk_btn-cancel,
.wui-dpk__btn-sure {
	font-weight: normal;
	height: 88rpx;
	padding: 0 24rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	align-items: center;
	justify-content: center;
	text-align: center;
	/* #ifdef APP-NVUE */
	line-height: 88rpx;
	/* #endif */

	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-dpk_btn-cancel:active {
	opacity: 0.5;
}

.wui-dpk__btn-sure:active {
	opacity: 0.5;
}

.wui-date__picker-title {
	font-weight: normal;
	font-size: 28rpx;
	flex: 1;
	padding: 0 24rpx;
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: block;
	white-space: nowrap;
	box-sizing: border-box;
	/* #endif */
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
}

.wui-dpk__title-color {
	color: #333333;
}

.wui-dpk__title-color_dark {
	color: #a3a3a3;
}

.wui-dpk__cancel-color {
	color: #181818;
}

.wui-dpk__cancel-color_dark {
	color: #d1d1d1;
}

.wui-dpk__sure-color {
	/* #ifndef APP-NVUE */
	color: var(--wui-color-primary, #1396ff) !important;
	/* #endif */

	/* #ifdef APP-NVUE */
	color: #1396ff;
	/* #endif */
}

.wui-date__picker-view {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	flex: 1;
	height: 520rpx;
}

.wui-date__picker-text {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: block;
	white-space: nowrap;
	box-sizing: border-box;
	/* #endif */
	/* #ifndef MP-ALIPAY */
	line-height: 44px;
	/* #endif */
	text-align: center;
	font-size: 16px;
	font-weight: normal;
	color: #181818;
	flex: 1;
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 0 4rpx;
}

.wui-dpk__color-dark {
	color: #d1d1d1;
}

/* #ifndef APP-NVUE*/
::v-deep .wui-date__picker-indicator {
	position: relative;
	border-color: transparent;
}

::v-deep .wui-date__picker-indicator::before {
	border-color: #333;
}

::v-deep .wui-date__picker-indicator::after {
	border-color: #333;
}

/* #endif */
</style>
