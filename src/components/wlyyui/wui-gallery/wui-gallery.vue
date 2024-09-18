<!--（手机号：152 6 7 01    37   56，身份证尾号：1 9 19   35）-->
<template>
	<view
		class="wui-gallery__wrap"
		:style="{ zIndex: zIndex }"
		:class="[show ? 'wui-gallery__show' : 'wui-gallery__hidden']"
		v-if="show || !isNvue"
		@tap.stop="hideGallery"
	>
		<swiper
			class="wui-gallery__img-wrap"
			:indicator-dots="false"
			@change="change"
			:current="defActive"
			:autoplay="false"
			:duration="500"
		>
			<swiper-item class="wui-gallery__swiper-item" v-for="(item, index) in imgUrls" :key="index">
				<image mode="aspectFit" class="wui-gallery__img" :src="item.src"></image>
			</swiper-item>
		</swiper>
		<view class="wui-gallery__index-wrap" :style="{ top: top + 'px' }">
			<text class="wui-gallery__index">{{ active + 1 }}/{{ imgUrls.length }}</text>
		</view>
		<view class="wui-gallery__descr-wrap" :class="{ 'wui-gallery__weex-safe': iphoneX && safeArea }" v-if="descr">
			<text class="wui-gallery__descr" :class="{ 'wui-gallery__text-ellipsis': ellipsis }" v-if="descr">{{ descr }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-gallery',
	emits: ['change', 'hide'],
	props: {
		urls: {
			type: Array,
			default() {
				return [];
			}
		},
		show: {
			type: Boolean,
			default: false
		},
		current: {
			type: [Number, String],
			default: 0
		},
		//文字超出是否省略成一行
		ellipsis: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: [Number, String],
			default: 9999
		},
		//是否适配底部安全区
		safeArea: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		urls(newVal, oldVal) {
			this.initData(newVal);
		},
		current(newVal) {
			this.defActive = this.active;
			let val = Number(newVal);
			setTimeout(() => {
				this.defActive = val;
				this.active = val;
			}, 20);
		}
	},
	mounted() {
		let sys = uni.getSystemInfoSync();
		this.top = sys.statusBarHeight + 20;
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphoneX = this.isPhoneX(sys);
		// #endif
		this.defActive = Number(this.current);
		this.active = this.defActive;
		this.initData(this.urls);
		this.getDescr(this.active);
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue: isNvue,
			imgUrls: [],
			active: 0,
			defActive: 0,
			top: 20,
			descr: '',
			iphoneX: false
		};
	},
	methods: {
		initData(vals) {
			if (vals && vals.length > 0) {
				if (typeof vals[0] === 'string') {
					vals = vals.map(item => {
						return {
							src: item
						};
					});
				}
				this.imgUrls = vals;
			}
		},
		change(e) {
			this.active = e.detail.current;
			this.getDescr(this.active);
			this.$emit('change', {
				index: this.active
			});
		},
		getDescr(index) {
			let item = this.imgUrls[index];
			if (item) {
				this.descr = item.descr || '';
			}
		},
		// #ifdef APP-NVUE || MP-TOUTIAO
		isPhoneX(res) {
			if (!this.safeArea) return false;
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
		hideGallery() {
			this.$emit('hide', {});
		}
	}
};
</script>

<style scoped>
.wui-gallery__wrap {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: #000;
}

.wui-gallery__img-wrap {
	flex: 1;
	position: relative;
	font-size: 0;
}

.wui-gallery__swiper-item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.wui-gallery__hidden {
	/* #ifndef APP-NVUE */
	display: none;
	visibility: hidden;
	/* #endif */
}

.wui-gallery__show {
	/* #ifndef APP-NVUE */
	display: flex;
	visibility: visible;
	/* #endif */
	flex-direction: column;
}

.wui-gallery__index-wrap {
	position: absolute;
	left: 0;
	right: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
}

.wui-gallery__index {
	/* #ifndef APP-NVUE */
	display: flex;
	align-items: center;
	justify-content: center;
	/* #endif */
	font-size: 34rpx;
	line-height: 34rpx;
	color: #fff;
	text-align: center;
	font-weight: normal;
	padding: 6rpx 20rpx;
	border-radius: 100px;
	background: rgba(0, 0, 0, 0.6);
}

.wui-gallery__descr-wrap {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(17, 17, 17, 0.6);
	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
}

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-gallery__weex-safe {
	padding-bottom: 34px;
}

/* #endif */

.wui-gallery__descr {
	flex: 1;
	font-size: 30rpx;
	color: #fff;
	font-weight: normal;
	padding: 26rpx 32rpx;
	/* #ifndef APP-NVUE */
	display: block;
	box-sizing: border-box;
	z-index: 10;
	/* #endif */
}

.wui-gallery__text-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	/* #ifndef APP-NVUE */
	white-space: nowrap;
	/* #endif */
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
}

.wui-gallery__img {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
	flex: 1;
}
</style>
