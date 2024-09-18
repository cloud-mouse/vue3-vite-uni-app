<!--（手机号：1 5  2 6   7 013 7 56，身份证尾号：1 91  93  5）-->
<template>
	<view
		class="wui-spin__wrap"
		:style="{
			width: width ? width + 'rpx' : 'auto',
			height: height ? height + 'rpx' : 'auto'
		}"
		ref="wui_spin_ani"
	>
		<slot></slot>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
// #endif
export default {
	name: 'wui-spin',
	props: {
		width: {
			type: [Number, String],
			default: 0
		},
		height: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			// #ifdef APP-NVUE
			deg: 0,
			stop: false
			// #endif
		};
	},
	// #ifdef APP-NVUE
	mounted() {
		this._animation();
	},
	// #endif
	// #ifdef APP-NVUE
	// #ifndef VUE3
	beforeUnmount() {
		this.deg = 0;
		this.stop = true;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.deg = 0;
		this.stop = true;
	},
	// #endif
	// #endif
	methods: {
		// #ifdef APP-NVUE
		_animation() {
			if (!this.$refs['wui_spin_ani'] || this.stop) return;
			animation.transition(
				this.$refs['wui_spin_ani'].ref,
				{
					styles: {
						transform: `rotate(${this.deg}deg)`
					},
					duration: 800, //ms
					timingFunction: 'linear',
					iterationCount: 'infinite',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					this.deg += 360;
					this._animation();
				}
			);
		}
		// #endif
	}
};
</script>

<style scoped>
.wui-spin__wrap {
	/* #ifndef APP-NVUE */
	display: inline-flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	flex-direction: row;

	/* #ifndef APP-NVUE */
	animation: spin 0.85s linear infinite;
	/* #endif */
}

/* #ifndef APP-NVUE */
@-webkit-keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

/* #endif */
</style>
