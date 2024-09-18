<!--（手机号：1  5 26 70  13  7  56，身份证尾号：1 9 1   935）-->
<template>
	<view
		class="wui-modal__wrap"
		:style="{ background: maskBackground, zIndex: zIndex }"
		:class="{ 'wui-modal__fadein': isShow }"
		@tap="closeModal"
		@touchmove.stop.prevent="stop"
		v-if="isShow || !isNvue"
		ref="wui_modal_ani"
	>
		<view
			class="wui-modal__inner"
			:style="{
				width: width + 'rpx',
				background: background,
				borderRadius: boxRadius + 'rpx',
				paddingTop: padding + 'rpx',
				paddingBottom: padding + 'rpx'
			}"
			@tap.stop="stop"
		>
			<text class="wui-modal__title" :style="{ fontSize: size + 'rpx', color: color }" v-if="title && title !== true">{{
				title
			}}</text>
			<text
				class="wui-modal__descr"
				:style="{ fontSize: descrSize + 'rpx', color: descrColor }"
				:class="{ 'wui-modal__descr-pt': !title }"
				v-if="descr && descr !== true"
				>{{ descr }}</text
			>
			<slot></slot>
			<view
				class="wui-modal__btn-wrap"
				:style="getWidth"
				:class="{ 'wui-modal__btn-row': direction === 'row' }"
				v-if="vals.length > 0"
			>
				<view
					class="wui-modal__button"
					:class="{
						'wui-modal__button-col': direction === 'column' && index !== vals.length - 1,
						'wui-modal__button-bg': !entity.plain && !entity.background,
						'wui-modal__button-border': entity.plain,
						'wui-modal__button-bc': entity.plain && !entity.background
					}"
					:style="{
						borderRadius: radius + 'rpx',
						background: entity.plain ? 'transparent' : entity.background || '#1396FF',
						borderColor: entity.plain ? entity.background || '#1396FF' : 'transparent'
					}"
					v-for="(entity, index) in vals"
					:key="index"
				>
					<text
						class="wui-modal__button-inner"
						:class="{
							'wui-modal__button-color': !entity.color && entity.plain
						}"
						:style="{
							color: entity.color || (entity.plain ? '#1396FF' : '#fff'),
							borderRadius: radius + 'rpx'
						}"
						@tap.stop="handleClick($event, index)"
						>{{ entity.text }}</text
					>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif

export default {
	name: 'wui-modal',
	emits: ['click', 'cancel'],
	props: {
		//是否显示
		show: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		size: {
			type: [Number, String],
			default: 34
		},
		color: {
			type: String,
			default: '#333'
		},
		descr: {
			type: String,
			default: ''
		},
		descrSize: {
			type: [Number, String],
			default: 28
		},
		descrColor: {
			type: String,
			default: '#7F7F7F'
		},
		buttons: {
			type: Array,
			default() {
				return [
					{
						text: '取消',
						plain: true
					},
					{
						text: '确定'
					}
				];
			}
		},
		//row、column
		direction: {
			type: String,
			default: 'row'
		},
		radius: {
			type: [Number, String],
			default: 16
		},
		width: {
			type: [Number, String],
			default: 640
		},
		background: {
			type: String,
			default: '#FFFFFF'
		},
		boxRadius: {
			type: [Number, String],
			default: 16
		},
		//外层上下padding值【1.8.0+】
		padding: {
			type: [Number, String],
			default: 32
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
			type: Number,
			default: 1001
		}
	},
	data() {
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			isShow: false,
			isNvue: isNvue,
			vals: []
		};
	},
	computed: {
		getWidth() {
			return 'width:' + (Number(this.width) - 60) + 'rpx';
		}
	},
	watch: {
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
		buttons(newVal) {
			this.initData(newVal);
		}
	},
	created() {
		this.initData(this.buttons);
	},
	methods: {
		initData(vals) {
			if (vals && vals.length > 0) {
				if (typeof vals[0] !== 'object') {
					vals = vals.map(item => {
						return {
							text: item
						};
					});
				}
				this.vals = vals;
			}
		},
		stop() {},
		closeModal() {
			if (!this.maskClosable) return;
			this.$emit('cancel', {});
		},
		handleClick(e, index) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			if (!this.isShow) return;
			this.$emit('click', {
				index: Number(index),
				...this.vals[index]
			});
		},
		open() {
			this.isShow = true;
			// #ifdef APP-NVUE
			this.$nextTick(() => {
				setTimeout(() => {
					this._animation(true);
				}, 50);
			});
			// #endif
		},
		close(type) {
			// #ifndef APP-NVUE
			this.isShow = false;
			// #endif
			// #ifdef APP-NVUE
			this._animation(false);
			// #endif
		},
		// #ifdef APP-NVUE
		_animation(type) {
			let styles = {
				transform: `scale(${type ? 1 : 1.2}) `,
				opacity: type ? 1 : 0
			};

			if (!this.$refs['wui_modal_ani']) return;
			animation.transition(
				this.$refs['wui_modal_ani'].ref,
				{
					styles,
					duration: 300, //ms
					timingFunction: 'ease',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.isShow = false;
					}
				}
			);
		}
		// #endif
	}
};
</script>

<style scoped>
.wui-modal__wrap {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: center;
	align-items: center;
	transition-timing-function: ease;
	transition-duration: 0.3s;
	/* #ifdef APP-NVUE */
	transition-property: transform, opacity;
	transform: scale(1.2);
	/* #endif */
	opacity: 0;
	/* #ifndef APP-NVUE */
	transform: scale3d(1.2, 1.2, 1);
	transition-property: all;
	visibility: hidden;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-modal__fadein {
	opacity: 1;
	transform: scale3d(1, 1, 1);
	visibility: visible;
}

/* #endif */

.wui-modal__inner {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
}

.wui-modal__title {
	text-align: center;
	font-size: 34rpx;
	color: #333;
	font-weight: 600;
	padding-top: 12rpx;
	padding-bottom: 24rpx;
	/* #ifndef APP-NVUE */
	word-break: break-all;
	/* #endif */
}

.wui-modal__descr {
	text-align: center;
	color: #999;
	font-size: 28rpx;
	padding-bottom: 24rpx;
	font-weight: normal;
	/* #ifndef APP-NVUE */
	word-break: break-all;
	/* #endif */
}

.wui-modal__descr-pt {
	padding-top: 36rpx;
}

.wui-modal__btn-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	padding-top: 12rpx;
}

.wui-modal__btn-row {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.wui-modal__button {
	flex: 1;
	margin-left: 20rpx;
	margin-right: 20rpx;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	height: 68rpx;
	position: relative;
	/* #ifndef APP-NVUE */
	overflow: hidden;
	box-sizing: border-box;
	/* #endif */
}

.wui-modal__button-col {
	margin-bottom: 0 !important;
}

.wui-modal__button-border {
	/* #ifdef APP-NVUE */
	border-width: 0.5px;
	/* #endif */

	/* #ifndef APP-NVUE */
	border-width: 1px;
	transform: translateZ(0);
	/* #endif */
	/* #ifdef H5 */
	border-width: 1px;
	/* #endif */
	border-style: solid;
}

/* #ifndef APP-NVUE */
.wui-modal__button-bg {
	background: var(--wui-color-primary, #1396ff) !important;
}

.wui-modal__button-bc {
	border-color: var(--wui-color-primary, #1396ff) !important;
}

.wui-modal__button-color {
	color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */

.wui-modal__button-inner {
	/* #ifndef APP-NVUE */
	display: flex;
	white-space: nowrap;
	box-sizing: border-box;
	/* #endif */
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	align-items: center;
	justify-content: center;
	text-align: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	/* #ifdef APP-NVUE */
	lines: 1;
	line-height: 64rpx;
	/* #endif */
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 26rpx;
	font-weight: normal;
	color: #ffffff;
}

.wui-modal__button-inner:active {
	/* #ifdef APP-NVUE */
	background-color: rgba(0, 0, 0, 0.2);
	/* #endif */

	/* #ifndef APP-NVUE */
	background-color: var(--wui-bg-color-hover, rgba(0, 0, 0, 0.2));
	/* #endif */
}
</style>
