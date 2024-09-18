<!--（手机号： 1 52 6   7 01 3 75 6，身份证尾号：  19  19 35）-->
<template>
	<view
		class="wui-landscape__wrap"
		:class="{
			'wui-landscape__fixed': !absolute,
			'wui-landscape__absolute': absolute,
			'wui-landscape__show': isShow
		}"
		:style="{ background: maskBackground, zIndex: zIndex }"
		v-if="isShow || !isNvue"
		@tap.stop="closeWin"
		ref="wui_landscape_ani"
	>
		<view class="wui-landscape__inner">
			<slot></slot>
			<view
				class="wui-landscape__icon"
				:class="{
					'wui-landscape__icon-rt': position == 2,
					'wui-landscape__icon-def': position == 3
				}"
				:style="getStyles"
				v-if="closable"
			>
				<view @tap.stop="close">
					<icon :type="type" :size="size" :color="color"></icon>
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
	name: 'wui-landscape',
	emits: ['close'],
	props: {
		show: {
			type: Boolean,
			default: false
		},
		closable: {
			type: Boolean,
			default: true
		},
		type: {
			type: String,
			default: 'cancel'
		},
		color: {
			type: String,
			default: '#fff'
		},
		size: {
			type: [Number, String],
			default: 28
		},
		position: {
			type: [Number, String],
			default: 3
		},
		distance: {
			type: [Number, String],
			default: 120
		},
		absolute: {
			type: Boolean,
			default: false
		},
		maskClosable: {
			type: Boolean,
			default: false
		},
		maskBackground: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		zIndex: {
			type: Number,
			default: 1001
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		getStyles() {
			let distance = Math.abs(Number(this.distance));
			let styles = `bottom: -${distance}rpx;`;
			if (this.position != 3) {
				styles = `top: -${distance}rpx;`;
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
			isShow: false,
			src: '',
			text: '',
			isNvue: isNvue
		};
	},
	watch: {
		show: {
			handler(newVal) {
				if (newVal) {
					this.open();
				} else {
					// #ifndef APP-NVUE
					this.isShow = false;
					// #endif

					// #ifdef APP-NVUE
					this._animation(false);
					// #endif
				}
			},
			immediate: true
		}
	},
	mounted() {
		if (this.show) {
			this.open();
		}
	},
	methods: {
		// #ifdef APP-NVUE
		_animation(type) {
			if (!this.$refs['wui_landscape_ani']) return;
			animation.transition(
				this.$refs['wui_landscape_ani'].ref,
				{
					styles: {
						opacity: type ? 1 : 0
					},
					duration: 250, //ms
					timingFunction: 'ease-in',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					if (!type) {
						this.isShow = false;
					}
				}
			);
		},
		// #endif
		closeWin(e) {
			if (!this.maskClosable) return;
			this.close(e);
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
		close(e) {
			// #ifdef APP-NVUE
			e && e.stopPropagation();
			// #endif
			this.$emit('close', {
				param: this.param
			});
		}
	}
};
</script>

<style scoped>
.wui-landscape__wrap {
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1002;
	/* #ifndef APP-NVUE */
	display: flex;
	transition: all ease-in 0.25s;
	transform: scale3d(1, 1, 0);
	visibility: hidden;
	/* #endif */
	opacity: 0;
	align-items: center;
	justify-content: center;
}

.wui-landscape__fixed {
	position: fixed;
}

.wui-landscape__absolute {
	position: absolute;
}

/* #ifndef APP-NVUE */
.wui-landscape__show {
	opacity: 1;
	transform: scale3d(1, 1, 1);
	visibility: visible;
}

/* #endif */

.wui-landscape__inner {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
}

.wui-landscape__icon {
	position: absolute;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	left: 0;
	right: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: flex-start;
	flex-direction: row;
}

.wui-landscape__icon-rt {
	justify-content: flex-end !important;
}

.wui-landscape__icon-def {
	justify-content: center !important;
}
</style>
