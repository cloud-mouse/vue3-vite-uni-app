<!--（手机号：1526   7     0137  56，身份证尾号：19  19 3  5）-->
<template>
	<view class="wui-grid__wrap" :class="[isShow ? 'wui-grid__wrap-show' : 'wui-grid__wrap-hidden']">
		<view
			:id="elemId"
			ref="wui_grid"
			class="wui-grid"
			:class="{ 'wui-grid__border': showBorder }"
			:style="{
				'border-left-color': borderColor,
				'border-top-color': borderColor
			}"
		>
			<slot></slot>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom');
// #endif
export default {
	name: 'wui-grid',
	emits: ['click'],
	props: {
		// 每行显示个数
		columns: {
			type: Number,
			default: 3
		},
		// 是否显示边框
		showBorder: {
			type: Boolean,
			default: true
		},
		// 边框颜色 仅nvue有效
		borderColor: {
			type: String,
			default: '#EEEEEE'
		},
		// 是否正方形显示,默认为 true
		square: {
			type: Boolean,
			default: true
		}
	},
	provide() {
		return {
			grid: this
		};
	},
	data() {
		const elemId = `wui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		return {
			elemId: elemId,
			width: 0,
			height: 0,
			isShow: false
		};
	},
	created() {
		this.children = [];
		let sys = uni.getSystemInfoSync();
		this.width = 100 / this.columns + '%';
		if (this.square) {
			this.height = (sys.windowWidth - 1) / this.columns + 'px';
		}
	},
	watch: {
		columns(val) {
			this.$nextTick(() => {
				this.init();
			});
		},
		showBorder(val) {
			this.childChange();
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
		});
	},
	methods: {
		init() {
			setTimeout(() => {
				this.getWidth((width, height) => {
					this.children.forEach((item, index) => {
						item.width = width;
						item.height = height;
					});
					this.isShow = true;
				});
			}, 50);
		},
		childChange() {
			this.children.forEach((item, index) => {
				item.showBorder = this.showBorder;
			});
		},
		handleClick(e) {
			this.$emit('click', e);
		},
		getWidth(fn) {
			let isNoSupported = false;
			// #ifdef MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-KUAISHOU || MP-JD || MP-360 || MP-LARK
			isNoSupported = true;
			// #endif

			// #ifndef APP-NVUE
			this.width = 100 / this.columns + '%';
			if (this.square || isNoSupported) {
				uni
					.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
					// #endif
					.select(`#${this.elemId}`)
					.boundingClientRect()
					.exec(ret => {
						const width = Number((ret[0].width - 1) / this.columns) + 'px';
						if (this.square) this.height = width;
						if (isNoSupported) this.width = width;
						fn(this.width, this.height);
					});
			} else {
				fn(this.width, this.height);
			}
			// #endif
			// #ifdef APP-NVUE
			dom.getComponentRect(this.$refs['wui_grid'], ret => {
				this.width = Number((ret.size.width - 1) / this.columns) + 'px';
				if (this.square) {
					this.height = this.width;
				}
				fn(this.width, this.height);
			});
			// #endif
		}
	}
};
</script>

<style scoped>
.wui-grid__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: column;
	transition-property: opacity;
	transition-duration: 0.2s;
	transition-timing-function: ease-in-out;
}

.wui-grid__wrap-hidden {
	opacity: 0;
}

.wui-grid__wrap-show {
	opacity: 1;
}

.wui-grid {
	/* #ifndef APP-NVUE */
	display: flex;
	width: 100%;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
}

.wui-grid__border {
	position: relative;
	/* #ifdef APP-NVUE */
	border-left-style: solid;
	border-left-width: 0.5px;
	border-top-style: solid;
	border-top-width: 0.5px;
	/* #endif */
	/* #ifndef APP-NVUE */
	z-index: 1;
	border-left: 0;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-grid__border::before {
	content: ' ';
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 1px;
	border-top: 1px solid var(--wui-color-border, #eeeeee);
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	z-index: 1;
}

.wui-grid__border::after {
	content: ' ';
	position: absolute;
	left: 0;
	top: 0;
	width: 1px;
	height: 100%;
	border-left: 1px solid var(--wui-color-border, #eeeeee);
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	-webkit-transform: scaleX(0.5);
	transform: scaleX(0.5);
}

/* #endif */
</style>
