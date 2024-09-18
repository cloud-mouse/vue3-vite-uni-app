<!--（手机号：  152 6 7     01375 6，身份证尾号：19193     5）-->
<template>
	<view
		class="wui-steps__wrap"
		:class="{ 'wui-steps__flex': direction === 'row' }"
		:style="{
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			background: background
		}"
	>
		<view
			class="wui-steps__node-wrap"
			:class="[
				direction === 'column' ? 'wui-steps__flex-row' : 'wui-steps__flex-col',
				direction === 'row' ? 'wui-steps__nw-col' : 'wui-steps__nw-row'
			]"
			v-for="(item, index) in items"
			:key="index"
			@tap.stop="handleClick(index)"
		>
			<view
				class="wui-steps__node-box"
				:class="[
					direction === 'row' ? 'wui-steps__flex-row' : 'wui-steps__flex-col',
					direction === 'row' ? '' : 'wui-steps__node-weex'
				]"
				:style="getStyles"
			>
				<view
					class="wui-steps__line"
					:class="[
						direction === 'row' ? 'wui-steps__line-row' : 'wui-steps__line-col',
						index <= current && index !== 0 && !activeColor ? 'wui-steps__background' : ''
					]"
					:style="{
						background: index === 0 ? 'transparent' : index <= current ? activeColor : nodeColor
					}"
					v-if="direction === 'row'"
				></view>
				<view class="wui-steps__node">
					<text
						class="wui-steps__node-text"
						:class="{
							'wui-steps__background': index <= current && !activeColor,
							'wui-steps__border': index <= current && !activeColor
						}"
						v-if="item.text && !(isMark && index == current)"
						:style="{
							background: index <= current ? activeColor : '#fff',
							borderColor: index <= current ? activeColor : nodeColor,
							color: index <= current ? '#fff' : color
						}"
						>{{ item.text }}</text
					>
					<view
						class="wui-steps__checkbox"
						:class="{ 'wui-steps__background': !activeColor }"
						:style="{ background: activeColor }"
						v-if="isMark && index == current"
					>
						<view class="wui-steps__checkmark"></view>
					</view>
					<view
						class="wui-steps__node-dot"
						:class="{
							'wui-steps__background': index <= current && !activeColor
						}"
						:style="{ background: index <= current ? activeColor : nodeColor }"
						v-if="!item.text && !item.src && !(isMark && index == current)"
					>
					</view>
					<image
						:src="index <= current ? item.activeSrc || item.src : item.src"
						mode="widthFix"
						class="wui-steps__node-icon"
						v-if="!item.text && item.src && !(isMark && index == current)"
						:style="{ borderRadius: radius || 0 }"
					></image>
				</view>
				<view
					class="wui-steps__line"
					:class="[
						direction === 'row' ? 'wui-steps__line-row' : 'wui-steps__line-col',
						index !== items.length - 1 && !activeColor && (index < current || (index == current && isWait && direction === 'row'))
							? 'wui-steps__background'
							: ''
					]"
					:style="{
						background:
							index === items.length - 1
								? 'transparent'
								: index < current || (index == current && isWait && direction === 'row')
								? activeColor
								: nodeColor
					}"
				>
				</view>
			</view>
			<view
				class="wui-steps__content"
				:class="[direction === 'row' ? 'wui-steps__content-row' : 'wui-steps__content-col']"
				:style="{
					paddingBottom: index === items.length - 1 || direction === 'row' ? '0rpx' : '64rpx',
					paddingLeft: direction === 'row' ? '20rpx' : isNvue ? `${height + 24}rpx` : '24rpx'
				}"
			>
				<text
					class="wui-steps__title"
					:class="{
						'wui-steps__text-row': direction === 'row',
						'wui-steps__color': index <= current && !activeColor
					}"
					v-if="item.title"
					:style="{
						color: index <= current ? activeColor : color,
						fontSize: size + 'rpx',
						fontWeight: fontWeight
					}"
					>{{ item.title }}</text
				>
				<text
					class="wui-steps__descr"
					:class="{
						'wui-steps__text-row': direction === 'row',
						'wui-steps__color': index <= current && !activeColor
					}"
					v-if="item.descr"
					:style="{
						color: index <= current ? activeColor : descrColor,
						fontSize: descrSize + 'rpx'
					}"
					>{{ item.descr }}</text
				>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-steps',
	emits: ['click'],
	props: {
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		current: {
			type: [Number, String],
			default: 0
		},
		//row/column
		direction: {
			type: String,
			default: 'row'
		},
		padding: {
			type: Array,
			default() {
				return [];
			}
		},
		background: {
			type: String,
			default: 'transparent'
		},
		height: {
			type: [Number, String],
			default: 50
		},
		nodeColor: {
			type: String,
			default: '#ccc'
		},
		color: {
			type: String,
			default: '#181818'
		},
		size: {
			type: [Number, String],
			default: 28
		},
		fontWeight: {
			type: [Number, String],
			default: 400
		},
		descrColor: {
			type: String,
			default: '#B2B2B2'
		},
		descrSize: {
			type: [Number, String],
			default: 24
		},
		// #ifdef APP-NVUE
		activeColor: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		activeColor: {
			type: String,
			default: ''
		},
		// #endif
		radius: {
			type: String,
			default: '0rpx'
		},
		//完成到当前步骤时是否需要对号标识
		isMark: {
			type: Boolean,
			default: true
		},
		isWait: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		getStyles() {
			let styles = `height:${this.height}rpx`;
			if (this.direction === 'column') {
				styles = `width:${this.height}rpx`;
			}
			return styles;
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isNvue
		};
	},
	methods: {
		handleClick(index) {
			this.$emit('click', {
				index: index,
				...this.items[index]
			});
		}
	}
};
</script>

<style scoped>
.wui-steps__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
	flex-direction: column;
}

.wui-steps__flex {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	/* #ifdef APP-NVUE */
	align-items: flex-start !important;
	/* #endif */
}

.wui-steps__node-wrap {
	position: relative;
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
}

.wui-steps__nw-col {
	flex: 1;
}

.wui-steps__flex-row {
	flex-direction: row;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	/* #endif */
}

.wui-steps__flex-col {
	flex-direction: column;
}

/* #ifdef APP-NVUE */
.wui-steps__nw-row {
	align-items: flex-start;
}

/* #endif */

.wui-steps__line {
	/* #ifndef APP-NVUE */
	transform-origin: center;
	/* #endif */
	flex: 1;
}

.wui-steps__line-row {
	/* #ifdef APP-NVUE */
	height: 0.5px;
	/* #endif */

	/* #ifndef APP-NVUE */
	height: 1px;
	transform: scaleY(0.5) translateZ(0);
	/* #endif */
}

.wui-steps__line-col {
	/* #ifdef APP-NVUE */
	width: 0.5px;
	/* #endif */

	/* #ifndef APP-NVUE */
	width: 1px;
	transform: scaleX(0.5) translateZ(0);
	/* #endif */
}

.wui-steps__node-box {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	align-items: center;
	overflow: hidden;
}

/* #ifdef APP-NVUE */
.wui-steps__node-weex {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
}

/* #endif */

.wui-steps__node {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	align-items: center;
	justify-content: center;
}

.wui-steps__node-text {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	border-radius: 50%;
	/* #endif */
	width: 40rpx;
	height: 40rpx;
	/* #ifdef APP-NVUE */
	border-radius: 24rpx;
	line-height: 40rpx;
	/* #endif */
	background-color: #fff;
	border-style: solid;
	border-width: 1rpx;
	font-size: 28rpx;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-weight: normal;
	overflow: hidden;
}

.wui-steps__node-icon {
	width: 40rpx;
	height: 40rpx;
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
}

.wui-steps__node-dot {
	width: 9px;
	height: 9px;
	/* #ifndef APP-NVUE */
	border-radius: 50%;
	/* #endif */
	/* #ifdef APP-NVUE */
	border-radius: 9px;
	/* #endif */
	background-color: #ccc;
}

.wui-steps__content {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: column;
}

.wui-steps__content-row {
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	word-break: break-all;
	/* #endif */
	padding: 12rpx 20rpx 0;
	align-items: center;
	overflow: hidden;
}

.wui-steps__content-col {
	padding-left: 24rpx;
	padding-bottom: 64rpx;
}

.wui-steps__title,
.wui-steps__descr {
	/* #ifndef APP-NVUE */
	display: block;
	word-break: break-all;
	/* #endif */
	padding-bottom: 8rpx;
	font-weight: normal;
}

.wui-steps__text-row {
	text-align: center;
}

.wui-steps__checkbox {
	width: 40rpx;
	height: 40rpx;
	/* #ifdef APP-NVUE */
	border-radius: 44rpx;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: inline-flex;
	box-sizing: border-box;
	border-radius: 50%;
	vertical-align: top;
	flex-shrink: 0;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: relative;
}

.wui-steps__checkmark {
	width: 22rpx;
	height: 40rpx;
	border-bottom-style: solid;
	border-bottom-width: 3px;
	border-bottom-color: #ffffff;
	border-right-style: solid;
	border-right-width: 3px;
	border-right-color: #ffffff;
	transform: rotate(45deg) scale(0.5);
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	transform: rotate(45deg) scale(0.5) translateZ(0);
	/* #endif */
	/* #ifdef APP-NVUE */
	transform: rotate(45deg) scale(0.5);
	/* #endif */
	transform-origin: 54% 48%;
}

/* #ifndef APP-NVUE */
.wui-steps__color {
	color: var(--wui-color-primary, #1396ff) !important;
}

.wui-steps__border {
	border-color: var(--wui-color-primary, #1396ff) !important;
}

.wui-steps__background {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
