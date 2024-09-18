<template>
	<view class="wui-scroll-list-class wui-scroll-list">
		<scroll-view
			class="wui-scroll-list__scroll-view"
			scroll-x
			:upper-threshold="0"
			:lower-threshold="0"
			@scroll="scrollHandler"
			@scrolltoupper="scrollToUpperHandler"
			@scrolltolower="scrollToLowerHandler"
		>
			<view class="wui-scroll-list__scroll-view__content">
				<slot></slot>
			</view>
		</scroll-view>

		<!-- 指示器-->
		<view v-if="indicator" class="wui-scroll-list__indicator" :style="[indicatorStyle]">
			<view class="wui-scroll-list__indicator__line" :style="[lineStyle]">
				<view class="wui-scroll-list__indicator__line__bar" :style="[barStyle]"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-scroll-list',
	props: {
		// 是否显示指示器
		indicator: {
			type: Boolean,
			default: true
		},
		// 指示器整体宽度
		indicatorWidth: {
			type: [String, Number],
			default: 50
		},
		// 指示器滑块的宽度
		indicatorBarWidth: {
			type: [String, Number],
			default: 20
		},
		// 指示器颜色
		indicatorColor: {
			type: String,
			default: '#E6E6E6'
		},
		// 指示器激活时颜色
		indicatorActiveColor: {
			type: String,
			default: '#01BEFF'
		},
		// 自定义指示器样式
		indicatorStyle: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	computed: {
		// 指示器滑块样式
		barStyle() {
			let style = {};
			// 获取滑动距离的比值
			// 滑块当前移动距离与总需滑动距离(指示器的总宽度减去滑块宽度)的比值 = scroll-view的滚动距离与目标滚动距离(scroll-view的实际宽度减去包裹元素的宽度)之比
			const scrollLeft = this.scrollInfo.scrollLeft,
				scrollWidth = this.scrollInfo.scrollWidth,
				barAllMoveWidth = uni.upx2px(this.indicatorWidth) - uni.upx2px(this.indicatorBarWidth);
			const x = (scrollLeft / (scrollWidth - this.scrollWidth)) * barAllMoveWidth;
			style.transform = `translateX(${x}px)`;
			// 设置滑块的宽度和背景颜色
			style.width = `${this.indicatorBarWidth}rpx`;
			style.backgroundColor = this.indicatorActiveColor;
			return style;
		},
		// 指示器整体样式
		lineStyle() {
			let style = {};
			style.width = `${this.indicatorWidth}rpx`;
			style.backgroundColor = this.indicatorColor;
			return style;
		}
	},
	data() {
		return {
			// 滑动时滑块信息
			scrollInfo: {
				scrollLeft: 0,
				scrollWidth: 0
			},
			// 滑动区域的宽度
			scrollWidth: 0
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
		});
	},
	methods: {
		// 初始化
		init() {
			this.getComponentWidth();
		},
		// 处理滚动事件
		scrollHandler(event) {
			this.scrollInfo = event.detail;
		},
		// 滚动到最左边触发事件
		scrollToUpperHandler() {
			this.$emit('left');
			this.scrollInfo.scrollLeft = 0;
		},
		// 滚动到最右边触发事件
		scrollToLowerHandler() {
			this.$emit('right');
			// this.scrollInfo.scrollLeft = uni.upx2px(this.indicatorWidth) - uni.upx2px(this.indicatorBarWidth)
		},
		// 获取组件的宽度
		getComponentWidth() {
			this._tGetRect('.wui-scroll-list').then(res => {
				if (!res) {
					setTimeout(() => {
						this.getComponentWidth();
					}, 10);
					return;
				}
				this.scrollWidth = res.width;
			});
		},
		/**
		 * 查询节点信息
		 * 当前方法在支付宝小程序中无法获取组件跟接点的尺寸
		 * 解决办法：为组件根部再套一个没有任何作用的view元素
		 */ _tGetRect(selector, all) {
			return new Promise(resolve => {
				uni
					.createSelectorQuery()
					.in(this)
					[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect);
						}
						if (!all && rect) {
							resolve(rect);
						}
					})
					.exec();
			});
		}
	}
};
</script>

<style scoped>
.wui-scroll-list {
	position: relative;
	white-space: nowrap;
	width: 100%;
}
.wui-scroll-list__scroll-view {
	display: flex;
	flex-direction: row;
}
.wui-scroll-list__scroll-view__content {
	display: flex;
	flex-direction: row;
}
.wui-scroll-list__indicator {
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 40rpx;
}
.wui-scroll-list__indicator__line {
	width: 120rpx;
	height: 8rpx;
	border-radius: 200rpx;
	overflow: hidden;
}
.wui-scroll-list__indicator__line__bar {
	width: 40rpx;
	height: 8rpx;
	border-radius: 200rpx;
}
</style>
