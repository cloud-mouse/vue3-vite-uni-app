<!--（手机号：152         67013 756，身份证尾号：19   1 9 35）-->
<template>
	<view
		class="wui-single__input-wrap"
		:style="{
			marginTop: marginTop + 'rpx',
			marginBottom: marginBottom + 'rpx'
		}"
		@tap="onAliClick"
	>
		<view
			class="wui-single__input"
			:style="{ paddingLeft: padding + 'rpx', paddingRight: padding + 'rpx' }"
			:class="{ 'wui-sinput__disabled': disabled }"
		>
			<view
				class="wui-sinput__item"
				:class="{
					'wui-sinput__border-color': !borderColor && activeIndex !== index && !inputVal[index],
					'wui-sinput__active-color': !activeColor && (activeIndex === index || inputVal[index])
				}"
				:style="{
					width: width + 'rpx',
					height: height + 'rpx',
					background: background,
					borderRadius: radius + 'rpx',
					borderColor: activeIndex === index || inputVal[index] ? activeColor : borderColor,
					borderTopWidth: (border == 1 ? borderWidth : 0) + 'rpx',
					borderLeftWidth: (border == 1 ? borderWidth : 0) + 'rpx',
					borderRightWidth: (border == 1 ? borderWidth : 0) + 'rpx',
					borderBottomWidth: (border == 1 || border == 2 ? borderWidth : 0) + 'rpx'
				}"
				@tap="onTap"
				v-for="(item, index) in inputArr"
				:key="index"
			>
				<text
					class="wui-sinput__text"
					:class="{ 'wui-sinput__color': !color }"
					:style="{
						width: width + 'rpx',
						height: height + 'rpx',
						fontSize: size + 'rpx',
						lineHeight: height + 'rpx',
						color: color,
						fontWeight: fontWeight
					}"
					>{{ password ? (inputVal[index] ? '●' : '') : inputVal[index] || '' }}</text
				>
				<text class="wui-sinput__placeholder" :style="{ fontSize: size + 'rpx', fontWeight: fontWeight }">{{
					password ? (inputVal[index] ? '●' : '') : inputVal[index] || ''
				}}</text>
				<view
					class="wui-sinput__cursor"
					:class="{
						'wui-sinput__cursor-color': !cursorColor,
						'wui-sinput__cursor-ani': activeIndex === index && focus
					}"
					:ref="item"
					v-if="cursor && !disabled"
					:style="{ height: cursorHeight + 'rpx', background: cursorColor }"
				>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-NVUE -->
		<input
			ref="inputRef"
			:value="val"
			:password="password"
			:type="type"
			class="wui-sinput__hidden"
			:class="{ 'wui-sinput__alizero': aliZero }"
			@input="onInput"
			@blur="onBlur"
			:maxlength="length"
			v-if="native"
			:disabled="disabled"
			@confirm="onConfirm"
			@focus="onTap"
		/>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<input
			ref="inputRef"
			:value="val"
			:password="password"
			:type="type"
			class="wui-sinput__hidden"
			:class="{ 'wui-sinput__alizero': aliZero }"
			@input="onInput"
			@blur="onBlur"
			:focus="focus"
			:maxlength="length"
			v-if="native"
			:disabled="disabled"
			@confirm="onConfirm"
			@focus="onTap"
		/>
		<!-- #endif -->
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-single-input',
	emits: ['complete', 'focus', 'input', 'blur', 'confirm'],
	props: {
		//组件外层左右padding值
		padding: {
			type: [Number, String],
			default: 88
		},
		marginTop: {
			type: [Number, String],
			default: 0
		},
		marginBottom: {
			type: [Number, String],
			default: 0
		},
		//native为false时，自定义键盘时输入的值；native为true时初始值。不可超过length长度
		value: {
			type: String,
			default: ''
		},
		//native为true时有效，H5不支持动态切换type类型
		type: {
			type: String,
			default: 'text'
		},
		password: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		//获取焦点
		isFocus: {
			type: Boolean,
			default: false
		},
		//是否弹起原生键盘，设为false，则结合自定义键盘使用
		native: {
			type: Boolean,
			default: true
		},
		cursor: {
			type: Boolean,
			default: true
		},
		cursorColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		cursorHeight: {
			type: [Number, String],
			default: 60
		},
		//内容长度/输入框个数，一般4~6个字符，请控制在6个或以下
		length: {
			type: Number,
			default: 4
		},
		width: {
			type: [Number, String],
			default: 112
		},
		height: {
			type: [Number, String],
			default: 112
		},
		background: {
			type: String,
			default: 'transparent'
		},
		//1-显示所有边框 2-只显示底部边框，3-无边框
		border: {
			type: [Number, String],
			default: 2
		},
		borderColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#eee',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		activeColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		borderWidth: {
			type: [Number, String],
			default: 4
		},
		radius: {
			type: [Number, String],
			default: 0
		},
		size: {
			type: [Number, String],
			default: 48
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
		fontWeight: {
			type: [Number, String],
			default: 600
		}
	},
	data() {
		return {
			inputArr: [],
			inputVal: [],
			focus: false,
			// #ifdef APP-NVUE
			opacity: 0,
			stop: false,
			ref: '',
			// #endif
			activeIndex: -1,
			aliZero: false,
			val: ''
		};
	},
	watch: {
		length(val) {
			const nums = Number(val);
			if (nums !== this.inputArr.length) {
				this.inputArr = this.getArr(nums);
			}
		},
		value(val) {
			this.focus = true;
			val = val.replace(/\s+/g, '');
			this.getVals(val);
		},
		// #ifdef APP-NVUE
		activeIndex(val) {
			if (val == -1 || val == this.length) {
				this.stop = true;
				this.opacity = 1;
			} else {
				this.stop = false;
				const ref = this.inputArr[val];
				this.ref = ref;
				this.opacity = 0;
				this._animation(ref);
			}
		},
		focus(val) {
			if (!this.$refs.inputRef) return;
			if (val) {
				this.$refs.inputRef.focus();
			} else {
				this.$refs.inputRef.blur();
			}
		},
		// #endif
		isFocus(val) {
			this.initFocus(val);
		}
	},
	created() {
		this.inputArr = this.getArr(Number(this.length));
		let val = this.value.replace(/\s+/g, '');
		this.getVals(val, true);
	},
	mounted() {
		// #ifndef MP-TOUTIAO
		setTimeout(() => {
			this.initFocus(this.isFocus);
		}, 150);
		// #endif

		// #ifdef MP-TOUTIAO
		setTimeout(() => {
			this.initFocus(this.isFocus);
		}, 300);
		// #endif
	},
	//nvue暂不支持vue3，所以不需要做兼容,此处以防后续兼容
	// #ifdef APP-NVUE
	// #ifndef VUE3
	beforeUnmount() {
		this.stop = true;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.stop = true;
	},
	// #endif
	// #endif
	methods: {
		initFocus(val) {
			if (this.disabled) return;
			if (val && this.activeIndex === -1) {
				this.activeIndex = 0;
			}
			if (!this.value && !val) {
				this.activeIndex = -1;
			}
			this.$nextTick(() => {
				this.focus = val;
				if (this.focus && !this.native) {
					this.onTap();
				}
			});
		},
		getArr(end) {
			let arr = Array.from(new Array(end + 1).keys()).slice(1);
			arr = arr.map(item => {
				const ref = `wui_ref_${Math.ceil(Math.random() * 10e5).toString(36)}`;
				return ref;
			});
			return arr;
		},
		// #ifdef APP-NVUE
		_animation(ref) {
			if (!this.$refs[ref] || this.stop || this.ref != ref) return;
			animation.transition(
				this.$refs[ref][0].ref,
				{
					styles: {
						opacity: this.opacity
					},
					duration: 400, //ms
					timingFunction: 'linear',
					iterationCount: 'infinite',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					this.opacity = this.opacity == 0 ? 1 : 0;
					setTimeout(() => {
						this._animation(ref);
					}, 200);
				}
			);
		},
		// #endif
		getVals(val, init = false) {
			this.val = val;
			if (!val) {
				this.inputVal = [];
				this.activeIndex = init ? -1 : 0;
			} else {
				let vals = val.split('');
				let arr = [];
				this.inputArr.forEach((item, index) => {
					arr.push(vals[index] || '');
				});
				this.inputVal = arr;
				const len = vals.length;
				this.activeIndex = len > this.length ? this.length : len;
				if (len === this.length) {
					this.$emit('complete', {
						detail: {
							value: val
						}
					});
					this.focus = false;
					uni.hideKeyboard();
				}
			}
		},
		onTap() {
			if (this.disabled) return;
			this.focus = true;
			if (this.activeIndex === -1) {
				this.activeIndex = 0;
			}
			if (this.activeIndex === this.length) {
				this.activeIndex--;
			}
			this.$emit('focus', {});
		},
		onInput(e) {
			let value = e.detail.value;
			value = value.replace(/\s+/g, '');
			this.getVals(value);
			this.$emit('input', {
				detail: {
					value: value
				}
			});
		},
		onBlur(e) {
			let value = e.detail.value;
			value = value.replace(/\s+/g, '');
			this.focus = false;
			// #ifdef MP-ALIPAY
			this.aliZero = false;
			// #endif
			if (!value) {
				this.activeIndex = -1;
			}
			this.$emit('blur', {
				detail: {
					value: value
				}
			});
		},
		onConfirm(e) {
			this.focus = false;
			uni.hideKeyboard();
			this.$emit('confirm', e);
		},
		onAliClick() {
			// #ifdef MP-ALIPAY
			setTimeout(() => {
				this.aliZero = true;
			}, 50);
			// #endif
		},
		clear() {
			this.val = '';
			this.inputVal = [];
			this.activeIndex = -1;
			this.$nextTick(() => {
				this.onTap();
			});
		}
	}
};
</script>

<style scoped>
.wui-single__input-wrap {
	position: relative;
	/* #ifdef MP-BAIDU */
	max-width: 100%;
	overflow: hidden;
	/* #endif */
}

.wui-single__input {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.wui-sinput__item {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-style: solid;
	position: relative;
	overflow: hidden;
}

.wui-sinput__text {
	position: absolute;
	left: 0;
	top: 0;
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.wui-sinput__placeholder {
	text-align: center;
	opacity: 0;
}

.wui-sinput__cursor {
	border-radius: 2px;
	width: 0;
}

.wui-sinput__cursor-ani {
	width: 2px;
	/* #ifndef APP-NVUE */
	animation: wui_cursor 1s infinite steps(1, start);
	/* #endif */
}

/* #ifndef APP-NVUE */
@keyframes wui_cursor {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}

/* #endif */

.wui-sinput__hidden {
	position: absolute;
	/* #ifndef MP-WEIXIN || MP-QQ */
	width: 100%;
	height: 100%;
	/* #endif */
	left: 0;
	top: 0;
	/* #ifndef MP */
	right: 0;
	bottom: 0;
	flex: 1;
	/* #endif */
	z-index: 2;
	/* #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO */
	height: 0rpx;
	width: 0rpx;
	border: none;
	/* #endif */
	margin: 0;
	padding: 0;
	opacity: 0;
	/* #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO */
	font-size: 0;
	/* #endif */

	/* #ifdef MP-BAIDU */
	transform: scaleX(2);
	transform-origin: 100% center;
	/* #endif */
	color: rgba(0, 0, 0, 0);
}

/* #ifdef MP-ALIPAY */
.wui-sinput__alizero {
	height: 0rpx;
	width: 0rpx;
}

/* #endif */

.wui-sinput__disabled {
	opacity: 0.5;
}

/* #ifndef APP-NVUE */
.wui-sinput__color {
	color: var(--wui-color-title, #181818) !important;
}

.wui-sinput__border-color {
	border-color: var(--wui-color-border, #eeeeee) !important;
}

.wui-sinput__active-color {
	border-color: var(--wui-color-primary, #1396ff) !important;
}

.wui-sinput__cursor-color {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
