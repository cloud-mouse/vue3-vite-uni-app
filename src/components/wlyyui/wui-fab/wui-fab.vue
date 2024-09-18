<!--（手机号：15   2 6 7  01 37  56，身份证尾号：1   91 9 35）-->
<template>
	<view @touchmove.stop.prevent="stop">
		<view
			class="wui-fab__mask"
			:class="{ 'wui-fab__mask-show': isShow }"
			:style="getStyle"
			ref="wui_mask_ani"
			v-if="mask"
			@tap.stop="maskClick"
		></view>
		<view
			class="wui-fab__btn-wrap"
			:class="[position === 'left' ? 'wui-fab__wrap-left' : 'wui-fab__wrap-right']"
			:style="getStyles"
		>
			<view
				class="wui-fab__btn-list"
				:class="{
					'wui-fab__btn-hidden': isHidden,
					'wui-fab__list-ani': isShow,
					'wui-fab__list-left': position === 'left',
					'wui-fab__list-right': position === 'right'
				}"
				ref="wui_fab_ani"
			>
				<view
					class="wui-fab__button-box"
					:class="[position === 'left' ? 'wui-fab__button-left' : 'wui-fab__button-right']"
					v-for="(btn, idx) in fabs"
					:key="idx"
					@tap.stop="handleClick($event, idx)"
				>
					<text
						class="wui-fab__btn-text"
						v-if="btn.text"
						:style="{
							fontSize: (btn.size || 32) + 'rpx',
							color: btn.color || '#fff',
							textAlign: position === 'left' ? 'left' : 'right'
						}"
						>{{ btn.text }}</text
					>
					<view
						class="wui-fab__button"
						:class="{ 'wui-fab__btn-color': !background && !btn.background }"
						:style="{
							width: width + 'rpx',
							height: width + 'rpx',
							background: btn.background || background
						}"
					>
						<wui-icon :name="btn.name" v-if="btn.name" :color="btn.abbrColor || '#fff'" :size="btn.abbrSize || 64"></wui-icon>
						<image
							:src="btn.src"
							:style="{
								width: (btn.width || 56) + 'rpx',
								height: (btn.height || 56) + 'rpx',
								borderRadius: (btn.radius || 0) + 'rpx'
							}"
							v-if="!btn.name && btn.src"
							mode="widthFix"
						></image>
						<text
							class="wui-fab__btn-abbr"
							:style="{
								fontSize: (btn.abbrSize || 36) + 'rpx',
								lineHeight: (btn.abbrSize || 36) + 'rpx',
								color: btn.abbrColor || '#fff'
							}"
							v-if="!btn.name && !btn.src && btn.abbr"
							>{{ btn.abbr }}</text
						>
					</view>
				</view>
			</view>
			<view
				class="wui-fab__btn-main"
				:class="{ 'wui-fab__btn-color': !background }"
				:style="{
					width: width + 'rpx',
					height: width + 'rpx',
					background: background
				}"
				@tap.stop="handleClick($event, -1)"
			>
				<view class="wui-fab__btn-inner" :class="{ 'wui-fab__btn-ani': isShow }" ref="wui_fm_ani">
					<slot>
						<wui-icon name="w-plus" :color="color" :size="80"></wui-icon>
					</slot>
				</view>
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
	name: 'wui-fab',
	emits: ['click', 'change'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		fabs: {
			type: Array,
			default() {
				return [];
			}
		},
		position: {
			type: String,
			default: 'right'
		},
		distance: {
			type: [Number, String],
			default: 80
		},
		bottom: {
			type: [Number, String],
			default: 120
		},
		width: {
			type: [Number, String],
			default: 108
		},
		// #ifdef APP-NVUE
		background: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		background: {
			type: String,
			default: ''
		},
		// #endif
		color: {
			type: String,
			default: '#fff'
		},
		mask: {
			type: Boolean,
			default: true
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
			default: 99
		}
	},
	computed: {
		getStyles() {
			let styles = `bottom:${this.bottom}rpx;z-index:${this.zIndex};`;
			if (this.position === 'left') {
				styles += `left:${this.distance}rpx;`;
			} else {
				styles += `right:${this.distance}rpx;`;
			}
			return styles;
		},
		getStyle() {
			return `background:${this.maskBackground};z-index:${Number(this.zIndex) - 10};`;
		}
	},
	watch: {
		isShow(val) {
			this.$emit('change', {
				isShow: val
			});
		}
	},
	data() {
		return {
			isShow: false,
			isHidden: true,
			timer: null
		};
	},
	// #ifndef APP-NVUE
	// #ifndef VUE3
	beforeUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	},
	// #endif
	// #endif
	// #ifdef APP-NVUE
	mounted() {
		if (!this.$refs['wui_fab_ani']) return;
		let styles = {
			transform: 'scale(0)',
			opacity: 0
		};
		animation.transition(
			this.$refs['wui_fab_ani'].ref,
			{
				styles,
				duration: 0,
				needLayout: false,
				delay: 0
			},
			() => {}
		);
	},
	// #endif
	methods: {
		stop() {},
		// #ifdef APP-NVUE
		_animation(type) {
			let styles = {
				transform: `scale(${type ? 1 : 0})`,
				opacity: type ? 1 : 0
			};
			if (!this.$refs['wui_fab_ani'] || !this.$refs['wui_fm_ani']) return;

			if (this.mask && this.$refs['wui_mask_ani']) {
				animation.transition(
					this.$refs['wui_mask_ani'].ref,
					{
						styles: {
							transform: `translateX(${type ? '0' : '-100%'})`
						},
						duration: 0,
						needLayout: false,
						delay: 0 //ms
					},
					() => {}
				);
			}
			animation.transition(
				this.$refs['wui_fm_ani'].ref,
				{
					styles: {
						transform: `rotate(${type ? '135deg' : '0deg'})`
					},
					duration: 250,
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.isHidden = true;
					}
				}
			);
			animation.transition(
				this.$refs['wui_fab_ani'].ref,
				{
					styles,
					duration: 250,
					timingFunction: 'ease-in-out',
					needLayout: false,
					delay: 0 //ms
				},
				() => {}
			);
		},
		// #endif
		handleClick: function (e, index) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			this.isHidden = false;
			clearTimeout(this.timer);
			this.$nextTick(() => {
				if (index === -1 && this.fabs.length > 0) {
					this.isShow = !this.isShow;
					// #ifdef APP-NVUE
					this._animation(this.isShow);
					// #endif
				} else {
					this.$emit('click', {
						index: index
					});
					this.isShow = false;
					// #ifdef APP-NVUE
					this._animation(this.isShow);
					// #endif
				}
				// #ifndef APP-NVUE
				if (!this.isShow) {
					this.timer = setTimeout(() => {
						this.isHidden = true;
					}, 250);
				}
				// #endif
			});
		},
		maskClick(e) {
			// #ifdef APP-NVUE
			e.stopPropagation();
			// #endif
			if (!this.maskClosable) return;
			this.isShow = false;
			// #ifndef APP-NVUE
			this.timer = setTimeout(() => {
				this.isHidden = true;
			}, 250);
			// #endif

			// #ifdef APP-NVUE
			this._animation(this.isShow);
			// #endif
		}
	}
};
</script>

<style scoped>
.wui-fab__mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	opacity: 0;
	/* #ifndef APP-NVUE */
	visibility: hidden;
	transition-property: visibility, opacity;
	/* #endif */
	transition-duration: 0.25s;
	/* #ifdef APP-NVUE */
	transition-property: opacity;
	transition-timing-function: ease-in-out;
	transform: translateX(-100%);
	/* #endif */
}

.wui-fab__mask-show {
	opacity: 1;
	/* #ifdef APP-NVUE */
	transform: translateX(0);
	/* #endif */
	/* #ifndef APP-NVUE */
	visibility: visible;
	/* #endif */
}

.wui-fab__btn-wrap {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	position: fixed;
	bottom: 120rpx;
}

.wui-fab__wrap-left {
	align-items: flex-start;
	left: 80rpx;
}

.wui-fab__wrap-right {
	align-items: flex-end;
	right: 80rpx;
}

.wui-fab__btn-list {
	/* #ifndef APP-NVUE */
	display: flex;
	visibility: hidden;
	transition: all 0.25s ease-in-out;
	transform: scale3d(0, 0, 1);
	opacity: 0;
	/* #endif */
	flex-direction: column;
}

.wui-fab__list-left {
	transform-origin: 0 100%;
	align-items: flex-start;
}

.wui-fab__list-right {
	transform-origin: 100% 100%;
	align-items: flex-end;
}

.wui-fab__btn-hidden {
	width: 0;
	height: 0;
}

.wui-fab__list-ani {
	/* #ifndef APP-NVUE */
	opacity: 1;
	transform: scale3d(1, 1, 1);
	visibility: visible;
	/* #endif */
}

.wui-fab__button-box {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 32rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-fab__button-left {
	flex-direction: row-reverse;
	justify-content: flex-start;
}

.wui-fab__button-right {
	flex-direction: row;
	justify-content: flex-end;
}

.wui-fab__btn-text {
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	padding-left: 24rpx;
	padding-right: 24rpx;
	font-weight: normal;
}

.wui-fab__button {
	/* #ifndef APP-NVUE */
	display: flex;
	border-radius: 50%;
	/* #endif */
	/* #ifdef APP-NVUE */
	border-radius: 100px;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.wui-fab__btn-abbr {
	text-align: center;
	font-weight: normal;
}

.wui-fab__btn-main {
	/* #ifndef APP-NVUE */
	display: flex;
	border-radius: 50%;
	/* #endif */
	/* #ifdef APP-NVUE */
	border-radius: 100px;
	/* #endif */
	box-shadow: 0 10rpx 14rpx 0 rgba(0, 0, 0, 0.1);
	align-items: center;
	justify-content: center;
	transform: rotate(0deg);
	overflow: hidden;

	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-fab__btn-inner {
	/* #ifndef APP-NVUE */
	display: flex;
	transform: rotate(0deg);
	transition: transform 0.25s;
	/* #endif */
	align-items: center;
	justify-content: center;
}

/* #ifndef APP-NVUE */
.wui-fab__btn-ani {
	transform: rotate(135deg);
}

/* #endif */

/* #ifndef APP-NVUE */
.wui-fab__btn-color {
	background: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
