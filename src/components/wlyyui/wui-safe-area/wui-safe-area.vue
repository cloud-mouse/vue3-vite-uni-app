<!--（手机号：1  5 2  6 70   1375 6，身份证尾号：1  9 19 3 5）-->
<template>
	<view class="wui-safe__area-wrap" :class="{ 'wui-safe__area-weex': iphonex }" :style="{ background: background }"></view>
</template>

<script>
export default {
	name: 'wui-safe-area',
	props: {
		//背景颜色
		background: {
			type: String,
			default: '#FFFFFF'
		}
	},
	created() {
		// #ifdef APP-NVUE || MP-TOUTIAO
		this.iphonex = this.isPhoneX();
		// #endif
	},
	data() {
		return {
			iphonex: false
		};
	},
	methods: {
		// #ifdef APP-NVUE || MP-TOUTIAO
		isPhoneX() {
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
		}
		// #endif
	}
};
</script>

<style scoped>
.wui-safe__area-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */

	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
	flex: 1;
	flex-direction: row;
}

/* #ifdef APP-NVUE || MP-TOUTIAO */
.wui-safe__area-weex {
	padding-bottom: 34px;
}

/* #endif */
</style>
