<!--（手机号： 15 2    6 70 13 7 56，身份证尾号：19  193   5）-->
<template>
	<view
		:id="elId"
		ref="wui_wi__el"
		class="wui-waterfall__item-wrap"
		:class="{ 'wui-waterfall__item-show': isShow }"
		:style="{
			width: width + 'px',
			background: background,
			borderRadius: radius + 'rpx',
			transform: transform
		}"
		@tap="handleTap"
	>
		<slot name="upper"></slot>
		<view
			:class="{ 'wui-waterfall__img-wrap': !isLoaded }"
			:style="{
				width: imgWidth != 0 ? imgWidth + 'rpx' : width + 'px',
				height: isLoaded ? 'auto' : width + 'px'
			}"
			v-if="isSrc"
		>
			<image
				class="wui-waterfall__img"
				:src="src"
				mode="widthFix"
				:webp="webp"
				:draggable="draggable"
				@load="handleLoad"
				@error="handleError"
				:style="{
					width: imgWidth != 0 ? imgWidth + 'rpx' : width + 'px',
					borderRadius: `${radius}rpx ${radius}rpx 0 0`
				}"
				v-if="isLoaded"
			></image>
		</view>
		<slot></slot>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-waterfall-item',
	emits: ['click'],
	inject: ['waterfall'],
	// #ifdef MP-WEIXIN
	options: {
		virtualHost: true
	},
	// #endif
	props: {
		// item项背景色
		background: {
			type: String,
			default: '#FFFFFF'
		},
		// item项圆角值，单位rpx
		radius: {
			type: [Number, String],
			default: 16
		},
		// 图片地址，如果列表包含图片，此参数为必传参数
		src: {
			type: String,
			default: ''
		},
		// 图片宽度，单位rpx，为0则默认使用列宽度
		imgWidth: {
			type: [Number, String],
			default: 0
		},
		// 默认不解析 webP 格式，只支持网络资源
		webp: {
			type: Boolean,
			default: false
		},
		// 是否能拖动图片
		draggable: {
			type: Boolean,
			default: true
		},
		// 自定义参数，随事件回传
		param: {
			type: [Number, String],
			default: 0
		}
	},
	created() {
		this.src && (this.isSrc = true);
		if (this.waterfall) {
			this.waterfall.childrenArr.push(this);
			if (this.waterfall.itemWidth) {
				this.width = this.waterfall.itemWidth;
			} else {
				this.waterfall.initParam(width => {
					this.width = width;
				});
			}
		}
	},
	mounted() {
		if (!this.src) {
			setTimeout(() => {
				this.$nextTick(() => {
					this.getWaterfallItemInfo();
				});
			}, 100);
		}
	},
	data() {
		const elId = `wui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		return {
			elId: elId,
			width: 0,
			height: 0,
			transform: '',
			isShow: false,
			isLoaded: true,
			isSrc: false
		};
	},
	methods: {
		// #ifdef APP-NVUE
		aniTransForm(x, y) {
			animation.transition(
				this.$refs['wui_wi__el'].ref,
				{
					styles: {
						transform: `translate(${x}px,${y}px)`
					},
					duration: 0,
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {}
			);
		},
		// #endif
		getWaterfallItemInfo() {
			this.getItemHeight(res => {
				if (this.waterfall) {
					this.waterfall.loadedArr.push('ok');
					if (this.waterfall.childrenArr.length === this.waterfall.loadedArr.length) {
						this.waterfall.startSorting();
					}
				}
			});
		},
		getItemHeight(callback, index = 0) {
			// #ifdef APP-NVUE
			const result = dom.getComponentRect(this.$refs['wui_wi__el'], option => {
				if (option && option.result && option.size) {
					this.height = parseInt(option.size.height + 1);
					callback && callback(this.height);
				}
			});
			// #endif

			// #ifndef APP-NVUE
			const element = uni.createSelectorQuery();
			element
				// #ifndef MP-ALIPAY
				.in(this)
				// #endif
				.select(`#${this.elId}`)
				.fields(
					{
						size: true
					},
					data => {
						if (index >= 20) return;
						if (data && data.height) {
							this.height = data.height;
							callback && callback(data.height);
						} else {
							index++;
							setTimeout(() => {
								this.getItemHeight(index);
							}, 50);
							return;
						}
					}
				)
				.exec();
			// #endif
		},
		handleLoad(e) {
			setTimeout(() => {
				this.getWaterfallItemInfo();
			}, 50);
		},
		handleError(e) {
			this.isLoaded = false;
			setTimeout(() => {
				this.getWaterfallItemInfo();
			}, 50);
		},
		handleTap() {
			this.$emit('click', {
				param: this.param
			});
		}
	}
};
</script>

<style scoped>
.wui-waterfall__item-wrap {
	position: absolute;
	left: 0;
	top: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	overflow: hidden;
	opacity: 0;
	transition-property: opacity;
	transition-duration: 0.3s;
	flex-direction: column;
}

.wui-waterfall__item-show {
	opacity: 1;
}

.wui-waterfall__img-wrap {
	background: #f1f4fa;
	overflow: hidden;
}

.wui-waterfall__img {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
}
</style>
