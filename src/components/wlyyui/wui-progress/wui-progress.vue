<!--（手机号： 1 5  2 6 7 01 3 75 6，身份证尾号：   1  91935）-->
<template>
	<view class="wui-progress__wrap">
		<view
			class="wui-progress__bar-bg"
			:style="{
				height: height + 'rpx',
				borderRadius: radius + 'rpx',
				background: background
			}"
		>
			<!-- #ifndef APP-NVUE -->
			<view
				class="wui-progress__bar"
				:class="{ 'wui-progress__active-color': !activeColor }"
				:style="{
					background: activeColor,
					transform: `translate3d(-${translateX},0,0)`,
					transitionDuration: `${time}s`
				}"
			>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-NVUE -->
			<view ref="wui_pg_ani" class="wui-progress__bar" :style="{ background: activeColor }"></view>
			<!-- #endif -->
		</view>
		<text
			class="wui-progress__percent"
			:style="{
				width: percentWidth + 'rpx',
				fontSize: size + 'rpx',
				color: color
			}"
			v-if="showInfo"
		>
			{{ percentage }}%
		</text>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-progress',
	emits: ['activeend'],
	props: {
		percent: {
			type: [Number, String],
			default: 0
		},
		height: {
			type: [Number, String],
			default: 8
		},
		radius: {
			type: [Number, String],
			default: 8
		},
		showInfo: {
			type: Boolean,
			default: false
		},
		//右侧百分比字体大小 rpx
		size: {
			type: [Number, String],
			default: 28
		},
		//右侧百分比颜色
		color: {
			type: String,
			default: '#333'
		},
		//右侧百分比宽度
		percentWidth: {
			type: [Number, String],
			default: 96
		},
		//未选择的进度条的颜色
		background: {
			type: String,
			default: '#CCCCCC'
		},
		//已选进度条颜色,可渐变
		activeColor: {
			type: String,
			// #ifdef APP-NVUE
			default: '#1396FF',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		//进度增加1%所需毫秒数
		duration: {
			type: [Number, String],
			default: 15
		}
	},
	watch: {
		percent(val) {
			this.darwProgress();
		}
	},
	mounted() {
		this.darwProgress();
	},
	data() {
		return {
			percentage: 0,
			translateX: '-100%',
			time: 0
		};
	},
	methods: {
		// #ifdef APP-NVUE
		_animation(translateX, duration) {
			if (!this.$refs['wui_pg_ani']) return;
			animation.transition(
				this.$refs['wui_pg_ani'].ref,
				{
					styles: {
						transform: `translateX(-${translateX})`
					},
					duration: duration * 1000,
					timingFunction: 'linear',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					this.$emit('activeend', {});
				}
			);
		},
		// #endif
		darwProgress() {
			let percent = Number(this.percent);
			percent = percent > 100 ? 100 : percent;
			this.time = (Number(this.duration) * Math.abs(percent - this.percentage)) / 1000;
			if (percent < this.percentage && this.percentage - percent > 30) {
				//后百分比数大于30时 时间缩短
				this.time = this.time / 2;
			}
			this.percentage = percent;
			this.translateX = 100 - percent + '%';

			// #ifndef APP-NVUE
			setTimeout(() => {
				this.$emit('activeend', {});
			}, this.time);
			// #endif

			// #ifdef APP-NVUE
			this._animation(this.translateX, this.time);
			// #endif
		}
	}
};
</script>

<style scoped>
.wui-progress__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
}

.wui-progress__bar-bg {
	/* #ifndef APP-NVUE */
	width: 100%;
	transform: translateZ(0);
	/* #endif */
	flex: 1;
	position: relative;
	overflow: hidden;
}

.wui-progress__bar {
	/* #ifndef APP-NVUE */
	width: 100%;
	z-index: 2;
	/* #endif */
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	/* #ifndef APP-NVUE */
	transform: translate3d(-100%, 0, 0);
	transition-delay: 0s;
	transition-property: transform;
	transition-timing-function: linear;
	/* #endif */

	/* #ifdef APP-NVUE */
	transform: translateX(-100%);
	/* #endif */
	transition-duration: 0s;
}

.wui-progress__percent {
	text-align: center;
	/* #ifndef APP-NVUE */
	display: block;
	flex-shrink: 0;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-progress__active-color {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
