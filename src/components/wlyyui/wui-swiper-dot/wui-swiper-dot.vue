<!--（手机号： 15   267 0   1 375 6，身份证尾号： 1 9  193 5）-->
<template>
	<view class="wui-swiper__wrap">
		<slot></slot>
		<view
			v-if="type == 1"
			class="wui-swiper__dot"
			:style="{
				left: dots.left + 'rpx',
				right: dots.right + 'rpx',
				bottom: dots.bottom + 'rpx'
			}"
		>
			<view
				@tap.stop="itemClick(index)"
				class="wui-swiper__dot-item"
				:class="{
					'wui-swiper__dot-bg': !dots.activeBackground && index == current
				}"
				:style="{
					width: index == current ? activeWidth : width,
					height: height,
					borderRadius: radius,
					background: index == current ? dots.activeBackground : dots.background,
					marginLeft: dots.margin + 'rpx',
					marginRight: dots.margin + 'rpx'
				}"
				v-for="(item, index) in items"
				:key="index"
			></view>
		</view>
		<view
			v-if="type == 2"
			class="wui-swiper__dot"
			:style="{
				left: dots.left + 'rpx',
				right: dots.right + 'rpx',
				bottom: dots.bottom + 'rpx'
			}"
		>
			<text
				@tap.stop="itemClick(index)"
				class="wui-swiper__dot-item wui-swiper__flex-center"
				:class="{
					'wui-swiper__dot-bg': !dots.activeBackground && index == current
				}"
				:style="{
					width: width,
					height: height,
					borderRadius: radius,
					background: index == current ? dots.activeBackground : dots.background,
					marginLeft: dots.margin + 'rpx',
					marginRight: dots.margin + 'rpx',
					color: index == current ? dots.activeColor : dots.color,
					fontSize: dots.size + 'rpx'
				}"
				v-for="(item, index) in items"
				:key="index"
				>{{ index + 1 }}</text
			>
		</view>
		<view
			v-if="type == 3"
			class="wui-swiper__dot"
			:style="{
				left: dots.left + 'rpx',
				right: dots.right + 'rpx',
				bottom: dots.bottom + 'rpx',
				height: (dots.height < 64 ? 64 : dots.height) + 'rpx',
				background: dots.background,
				paddingLeft: dots.padding + 'rpx',
				paddingRight: dots.padding + 'rpx'
			}"
		>
			<text
				@tap.stop="itemClick(current)"
				class="wui-swiper__dot-item wui-swiper__nav-ellipsis"
				:style="{ fontSize: dots.size + 'rpx', color: dots.color }"
				>{{ items[current][field] }}</text
			>
		</view>
		<view v-if="type == 4" class="wui-swiper__dot" :style="{ right: dots.right + 'rpx', bottom: dots.bottom + 'rpx' }">
			<text
				@tap.stop="itemClick(current)"
				class="wui-swiper__dot-item wui-swiper__flex-center"
				:style="{
					width: width,
					height: height,
					borderTopLeftRadius: radius,
					borderBottomLeftRadius: radius,
					background: dots.background,
					color: dots.color,
					fontSize: dots.size + 'rpx'
				}"
				>{{ current + 1 }}/{{ items.length }}</text
			>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-swiper-dot',
	emits: ['click'],
	props: {
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		type: {
			type: [Number, String],
			default: 1
		},
		current: {
			type: [Number, String],
			default: 0
		},
		styles: {
			type: Object,
			default() {
				return {};
			}
		},
		field: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			dots: {
				left: 0,
				right: 0,
				bottom: 32,
				width: 16,
				activeWidth: 16,
				height: 16,
				radius: true,
				background: 'rgba(0,0,0,.6)',
				// #ifdef APP-NVUE
				activeBackground: '#1396FF',
				// #endif
				// #ifndef APP-NVUE
				activeBackground: '',
				// #endif
				color: '#fff',
				activeColor: '#fff',
				size: 28,
				margin: 8,
				padding: 32
			},
			width: 0,
			activeWidth: 0,
			height: 0,
			radius: 0
		};
	},
	watch: {
		styles(newVal) {
			this.dots = Object.assign(this.dots, this.styles);
			this.initStyles();
		}
	},
	created() {
		this.dots = Object.assign(this.dots, this.styles);
		this.initStyles();
	},
	methods: {
		getPx(val, radius) {
			let res = 0;
			if (val && radius) {
				res = Math.floor(uni.upx2px(val));
				res = res % 2 === 0 ? res : res + 1;
			}
			return res + 'px';
		},
		initStyles() {
			//处理圆角变形
			this.width = this.getPx(this.dots.width, true);
			this.activeWidth = this.getPx(this.dots.activeWidth, true);
			this.height = this.getPx(this.dots.height, true);
			this.radius = this.getPx(this.dots.width, this.dots.radius);
		},
		itemClick(index) {
			this.$emit('click', {
				index: index
			});
		}
	}
};
</script>

<style scoped>
.wui-swiper__wrap {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: column;
	position: relative;
}

.wui-swiper__dot {
	position: absolute;
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 2;
	overflow: hidden;
}

.wui-swiper__dot-item {
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
}

.wui-swiper__nav-ellipsis {
	flex: 1;
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: block;
	white-space: nowrap;
	/* #endif */
	overflow: hidden;
	text-overflow: ellipsis;
}

.wui-swiper__flex-center {
	justify-content: center;
	text-align: center;
}

/* #ifndef APP-NVUE */
.wui-swiper__dot-bg {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
