<!--（手机号：1   5  26 7   01375 6，身份证尾号：  19 19 3 5）-->
<template>
	<view
		class="wui-backtop__wrap"
		:style="{
			width: width + 'rpx',
			height: width + 'rpx',
			borderRadius: isNvue ? width + 'rpx' : '50%',
			bottom: bottom + 'rpx',
			right: right + 'rpx',
			background: background
		}"
		v-if="isShow && visible"
		@tap.stop="goBacktop"
	>
		<wui-icon :name="name" :size="52" :color="color" v-if="!custom"></wui-icon>
		<slot></slot>
	</view>
</template>

<script>
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	name: 'wui-backtop',
	emits: ['click'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		scrollTop: {
			type: [Number, String]
		},
		targetRef: {
			type: String,
			default: ''
		},
		threshold: {
			type: [Number, String],
			default: 320
		},
		width: {
			type: [Number, String],
			default: 80
		},
		bottom: {
			type: [Number, String],
			default: 160
		},
		right: {
			type: [Number, String],
			default: 40
		},
		background: {
			type: String,
			default: '#FFFFFF'
		},
		name: {
			type: String,
			default: 'w-top'
		},
		color: {
			type: String,
			default: '#333333'
		},
		custom: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		scrollTop(newValue, oldValue) {
			this.scrollChange();
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue: isNvue,
			isShow: false,
			visible: true
		};
	},
	methods: {
		goBacktop: function () {
			// #ifndef APP-NVUE
			//防止fixed元素先消失再显示
			this.visible = false;
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 120
			});
			setTimeout(() => {
				this.visible = true;
			}, 220);
			// #endif

			// #ifdef APP-NVUE
			if (this.targetRef) {
				dom.scrollToElement(this.targetRef, {});
			}
			// #endif
			this.$emit('click', {});
		},
		scrollChange() {
			let show = this.scrollTop > this.threshold;
			if ((show && this.isShow) || (!show && !this.isShow)) return;
			this.isShow = show;
		}
	}
};
</script>

<style scoped>
.wui-backtop__wrap {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	position: fixed;
	z-index: 888;
	box-shadow: 0 0 6px rgb(0 0 0 / 12%);
	justify-content: center;
	align-items: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}
</style>
