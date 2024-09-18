<!--（手机号：1 5  2  6 70   1 3756，身份证尾号： 1  919  35）-->
<template>
	<view @touchend="stop">
		<view
			class="wui-share__sheet-mask"
			:style="getStyle"
			:class="{ 'wui-ss__mask-show': show }"
			ref="wui_ssm_ani"
			@tap.stop="maskClick"
		>
		</view>
		<view
			class="wui-share__sheet-wrap"
			:class="{
				'wui-share__sheet-radius': radius,
				'wui-share__sheet-hidden': !show,
				'wui-share__sheet-show': show
			}"
			:style="{ zIndex: zIndex, background: background }"
			ref="wui_ss_ani"
		>
			<slot>
				<text class="wui-share__sheet-title" :style="{ fontSize: size + 'rpx', color: color }">{{
					!title || title === 'true' || title === true ? '' : title
				}}</text>
			</slot>
			<view class="wui-share__sheet-box" v-for="(item, index) in items" :key="item.id">
				<scroll-view :show-scrollbar="false" scroll-x class="wui-share__sheet-scroll">
					<view
						class="wui-share__sheet-list"
						:class="{ 'wui-share__sheet-full': isFull }"
						:style="{
							paddingLeft: padding + 'rpx',
							paddingRight: padding + 'rpx'
						}"
					>
						<view
							class="wui-share__sheet-item"
							@tap.stop="handleClick($event, index, idx)"
							v-for="(obj, idx) in item.data"
							:key="idx"
						>
							<view
								class="wui-share__sheet-icon"
								:style="{
									background: obj.background || itemBackground,
									width: width + 'rpx',
									height: width + 'rpx'
								}"
							>
								<wui-icon :name="obj.name" :size="obj.size || 120" :color="obj.color || '#181818'" v-if="obj.name"></wui-icon>
								<image
									class="wui-share__sheet-img"
									:style="{
										width: (obj.width || 96) + 'rpx',
										height: (obj.width || 96) + 'rpx'
									}"
									:src="obj.src"
									mode="widthFix"
									v-if="obj.src"
								></image>
							</view>
							<text
								class="wui-share__sheet-text"
								:style="{
									fontSize: (obj.textSize || 24) + 'rpx',
									color: obj.textColor || '#7f7f7f'
								}"
								>{{ obj.text }}</text
							>
						</view>
					</view>
				</scroll-view>
			</view>
			<view
				class="wui-share__sheet-button"
				:class="{ 'wui-ss__safe-weex': iphoneX && safeArea }"
				:style="{ background: btnBackground }"
			>
				<text
					class="wui-share__sheet-btn"
					:class="{ 'wui-ss__safe-weex': iphoneX && safeArea }"
					:style="{ fontSize: btnSize + 'rpx', color: btnColor }"
					@tap.stop="cancel"
					>{{ btnText }}</text
				>
				<view class="wui-ss__btn-line" :style="{ background: lineColor }"></view>
			</view>
		</view>
	</view>
</template>

<script>
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-share-sheet',
	emits: ['click', 'cancel'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		show: {
			type: Boolean,
			default: false
		},
		itemList: {
			type: Array,
			default() {
				return [];
			}
		},
		width: {
			type: [Number, String],
			default: 108
		},
		itemBackground: {
			type: String,
			default: 'transparent'
		},
		radius: {
			type: Boolean,
			default: true
		},
		background: {
			type: String,
			default: '#EAEAEA'
		},
		title: {
			type: String,
			default: '分享到'
		},
		size: {
			type: [Number, String],
			default: 24
		},
		color: {
			type: String,
			default: '#7f7f7f'
		},
		btnText: {
			type: String,
			default: '取消'
		},
		btnSize: {
			type: [Number, String],
			default: 32
		},
		btnColor: {
			type: String,
			default: '#181818'
		},
		btnBackground: {
			type: String,
			default: 'transparent'
		},
		lineColor: {
			type: String,
			default: '#ddd'
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
		isFull: {
			type: Boolean,
			default: false
		},
		padding: {
			type: [Number, String],
			default: 20
		},
		//是否适配底部安全区
		safeArea: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			items: [],
			iphoneX: false
		};
	},
	created() {
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphoneX = this.isPhoneX();
		// #endif
		this.initData(this.itemList);
	},
	// #ifdef APP-NVUE
	mounted() {
		if (!this.$refs['wui_ssm_ani'] || !this.$refs['wui_ss_ani']) return;
		this._transtion(
			'wui_ssm_ani',
			{
				transform: 'translateX(-100%)'
			},
			0
		);
		this._transtion(
			'wui_ss_ani',
			{
				transform: 'translateY(100%)'
			},
			0
		);
	},
	// #endif
	computed: {
		getStyle() {
			return `background:${this.maskBackground};z-index:${Number(this.zIndex - 10)};`;
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
		itemList(val) {
			this.initData(val);
		}
	},
	methods: {
		initData(vals) {
			if (vals && vals.length > 0) {
				if (Array.isArray(vals[0])) {
					vals = vals.map((item, index) => {
						return {
							id: 'wui_s0' + index,
							data: item
						};
					});
					this.items = vals;
				} else {
					this.items = [
						{
							id: 'wui_s01',
							data: vals
						}
					];
				}
			}
		},
		// #ifdef APP-NVUE
		open() {
			setTimeout(() => {
				this._animation(true);
			}, 20);
		},
		close() {
			this._animation(false);
		},
		_transtion(ref, styles, duration, callback) {
			animation.transition(
				this.$refs[ref].ref,
				{
					styles: styles,
					duration: duration,
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					callback && callback();
				}
			);
		},
		_animation(type) {
			if (!this.$refs['wui_ssm_ani'] || !this.$refs['wui_ss_ani']) return;
			if (type) {
				this._transtion(
					'wui_ssm_ani',
					{
						transform: 'translateX(0)'
					},
					0,
					() => {
						this._transtion(
							'wui_ssm_ani',
							{
								opacity: 1
							},
							250
						);
					}
				);
			} else {
				this._transtion(
					'wui_ssm_ani',
					{
						opacity: 0
					},
					250,
					() => {
						this._transtion(
							'wui_ssm_ani',
							{
								transform: 'translateX(-100%)'
							},
							0
						);
					}
				);
			}
			this._transtion(
				'wui_ss_ani',
				{
					transform: `translateY(${type ? '0' : '100%'})`
				},
				250
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
		maskClick(e) {
			if (!this.maskClosable) return;
			this.cancel(e);
		},
		cancel(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			this.$emit('cancel', {});
		},
		handleClick(e, index, idx) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			if (Array.isArray(this.itemList[0])) {
				this.$emit('click', {
					index: index,
					subIndex: idx,
					item: this.itemList[index][idx]
				});
			} else {
				this.$emit('click', {
					index: idx,
					item: this.itemList[idx]
				});
			}
		},
		stop(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
		}
	}
};
</script>

<style scoped>
.wui-share__sheet-mask {
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

.wui-ss__mask-show {
	/* #ifndef APP-NVUE */
	visibility: visible;
	/* #endif */
	opacity: 1 !important;
}

.wui-share__sheet-wrap {
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
	/* transition-property: opacity;
		transition-duration: .25s; */
	transform: translateY(100%);
	/* #endif */
	transform-origin: center center;
	flex-direction: column;
}

/* #ifdef APP-NVUE */
.wui-share__sheet-hidden {
	opacity: 0;
}

/* #endif */

.wui-share__sheet-radius {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	/* #ifndef APP-NVUE */
	overflow: hidden;
	/* #endif */
}

.wui-share__sheet-show {
	/* #ifndef APP-NVUE */
	transform: translate3d(0, 0, 0);
	visibility: visible;
	/* #endif */

	/* #ifdef APP-NVUE */
	opacity: 1 !important;
	/* #endif */
}

.wui-share__sheet-title {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 24rpx;
	color: #7f7f7f;
	padding: 24rpx 0;
	font-weight: normal;
}

.wui-share__sheet-box {
	/* #ifdef APP-NVUE */
	width: 100%;
	/* #endif */
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
	padding: 24rpx 0;
	opacity: 1;
}

.wui-share__sheet-scroll {
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
	flex-direction: row;
}

.wui-share__sheet-list {
	/* #ifndef APP-NVUE */
	white-space: nowrap;
	display: inline-flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	padding: 0 20rpx;
}

.wui-share__sheet-full {
	/* #ifndef APP-NVUE */
	min-width: 100%;
	box-sizing: border-box;
	/* #endif */
	justify-content: space-between;
}

.wui-share__sheet-item {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 16rpx;
}

.wui-share__sheet-item:active {
	opacity: 0.5;
}

.wui-share__sheet-icon {
	/* #ifndef APP-NVUE */
	display: flex;
	transform: translateZ(0);
	/* #endif */
	border-radius: 24rpx;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.wui-share__sheet-img {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	width: 96rpx;
	height: 96rpx;
}

.wui-share__sheet-text {
	font-size: 24rpx;
	font-weight: normal;
	padding-top: 16rpx;
}

.wui-share__sheet-button {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */

	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
	flex: 1;
	height: 96rpx;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-top: 24rpx;
	position: relative;
}

.wui-ss__btn-line {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	/* #ifdef APP-NVUE */
	height: 0.5px;
	z-index: -1;
	/* #endif */

	/* #ifndef APP-NVUE */
	height: 1px;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 0;
	z-index: 1;
	pointer-events: none;
	/* #endif */
}

.wui-share__sheet-btn {
	/* #ifndef APP-NVUE */
	display: flex;
	z-index: 2;
	/* #endif */

	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	text-align: center;
	line-height: 96rpx;
	justify-content: center;
	align-items: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	font-weight: normal;
}

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-ss__safe-weex {
	padding-bottom: 34px;
}

/* #endif */

.wui-share__sheet-btn:active {
	background: rgba(0, 0, 0, 0.2);
}
</style>
