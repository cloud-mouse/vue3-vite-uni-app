<!--（手机号： 1  52 6 7 01 3  7 56，身份证尾号：19  19 3  5）-->
<template>
	<view class="wui-collapse__item">
		<view
			@click="onClick(!isOpen)"
			class="wui-collapse-item__title"
			:class="{ 'wui-collapse__disabled': disabled }"
			:style="{ background: background }"
		>
			<view class="wui-collapse__title">
				<slot></slot>
			</view>
			<view
				v-if="arrow"
				:class="{
					'wui-collapse__arrow-active': isOpen,
					'wui-collapse__item-ani': animation
				}"
				class="wui-collapse__arrow"
				:style="{ marginRight: arrowRight + 'rpx' }"
			>
				<view class="wui-collapse__arrow-inner" :style="{ borderColor: arrowColor }"></view>
			</view>
			<view
				v-if="isBorder"
				:style="{ background: borderColor, left: borderLeft + 'rpx' }"
				class="wui-collapse__border"
				:class="{ 'wui-collapse__border-color': !borderColor }"
			></view>
		</view>
		<view
			class="wui-collapse__content-wrap"
			:class="{ 'wui-collapse-__content-ani': animation }"
			:style="{ height: (isOpen ? height : 0) + 'px', background: contentBg }"
		>
			<view :id="elId" ref="wui_collapse__el" class="wui-collapse__content" :class="{ 'wui-collapse__content-open': isHeight }">
				<slot name="content"></slot>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
// #endif
export default {
	name: 'wui-collapse-item',
	emits: ['change'],
	props: {
		//item项索引或者唯一标识
		index: {
			type: [Number, String],
			default: 0
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		background: {
			type: String,
			default: '#fff'
		},
		//是否显示动画,如果动画卡顿严重建议不开启
		animation: {
			type: Boolean,
			default: true
		},
		// 是否展开
		open: {
			type: Boolean,
			default: false
		},
		isBorder: {
			type: Boolean,
			default: true
		},
		// #ifdef APP-NVUE
		borderColor: {
			type: String,
			default: '#EEEEEE'
		},
		// #endif
		// #ifndef APP-NVUE
		borderColor: {
			type: String,
			default: ''
		},
		// #endif
		borderLeft: {
			type: [Number, String],
			default: 0
		},
		arrow: {
			type: Boolean,
			default: true
		},
		arrowColor: {
			type: String,
			default: '#B2B2B2'
		},
		arrowRight: {
			type: [Number, String],
			default: 24
		},
		contentBg: {
			type: String,
			default: '#fff'
		}
	},
	data() {
		const elId = `wui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		return {
			isOpen: false,
			isHeight: null,
			height: 0,
			elId
		};
	},
	watch: {
		open(val) {
			this.isOpen = val;
		}
	},
	updated(e) {
		this.$nextTick(() => {
			this.init();
		});
	},
	created() {
		this.collapse = this.getCollapse();
		if (this.collapse && this.collapse.children.indexOf(this) === -1) {
			this.collapse.children.push(this);
		}
		this.oldHeight = 0;
	},
	// #ifndef VUE3
	// TODO vue2
	beforeUnmount() {
		this.uninstall();
	},
	// #endif
	// #ifdef VUE3
	// TODO vue3
	beforeUnmount() {
		this.uninstall();
	},
	// #endif
	mounted() {
		this.isOpen = this.open;
		this.init();
	},
	methods: {
		init() {
			// #ifndef APP-NVUE
			this.getCollapseHeight();
			// #endif
			// #ifdef APP-NVUE
			this.getNvueHeight();
			// #endif
		},
		uninstall() {
			if (this.collapse) {
				this.collapse.children.forEach((item, index) => {
					if (item === this) {
						this.collapse.children.splice(index, 1);
					}
				});
			}
		},
		onClick(isOpen) {
			if (this.disabled) return;
			this.isOpen = isOpen;
			if (this.collapse) {
				this.collapse.collapseChange(this, isOpen, this.index);
			} else {
				this.$emit('change', {
					index: this.index,
					isOpen: isOpen
				});
			}
		},
		getCollapseHeight(index = 0) {
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
						if (index >= 10) return;
						if (!data) {
							index++;
							this.getCollapseHeight(index);
							return;
						}
						// #ifdef APP-NVUE
						this.height = data.height + 1;
						// #endif
						// #ifndef APP-NVUE
						this.height = data.height;
						// #endif
						this.isHeight = true;
					}
				)
				.exec();
		},
		getNvueHeight() {
			const result = dom.getComponentRect(this.$refs['wui_collapse__el'], option => {
				if (option && option.result && option.size) {
					// #ifdef APP-NVUE
					this.height = option.size.height + 1;
					// #endif
					// #ifndef APP-NVUE
					this.height = option.size.height;
					// #endif
					this.isHeight = true;
				}
			});
		},
		getCollapse(name = 'wui-collapse') {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== name) {
				parent = parent.$parent;
				if (!parent) return false;
				parentName = parent.$options.name;
			}
			return parent;
		}
	}
};
</script>

<style scoped>
.wui-collapse__item {
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
}

.wui-collapse-item__title {
	/* #ifndef APP-NVUE */
	display: flex;
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
	transition: border-bottom-color 0.3s;

	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	position: relative;
}

.wui-collapse__border {
	position: absolute;
	bottom: 0;
	right: 0;
	/* #ifdef APP-NVUE */
	height: 0.5px;
	z-index: -1;
	/* #endif */
	/* #ifndef APP-NVUE */
	height: 1px;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 100%;
	z-index: 1;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-collapse__border-color {
	background: var(--wui-color-border, #eeeeee) !important;
}

/* #endif */

.wui-collapse__disabled {
	opacity: 0.5;
	/* #ifdef H5 */
	cursor: not-allowed;
	/* #endif */
}

.wui-collapse__title {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	flex: 1;
}

.wui-collapse__arrow-inner {
	height: 40rpx;
	width: 40rpx;
	border-width: 0 3px 3px 0;
	border-style: solid;
	transform: rotate(45deg) scale(0.5);
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	position: absolute;
	top: -6rpx;
	left: 0;
}

.wui-collapse__arrow {
	width: 40rpx;
	height: 40rpx;
	transform: rotate(0deg);
	position: relative;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	/* #endif */
}

.wui-collapse__arrow-active {
	transform: rotate(180deg);
}

.wui-collapse__item-ani {
	transition-property: transform;
	transition-duration: 0.3s;
	transition-timing-function: ease;
}

.wui-collapse__content-wrap {
	/* #ifndef APP-NVUE */
	will-change: height;
	box-sizing: border-box;
	/* #endif */
	overflow: hidden;
	position: relative;
	height: 0;
}

.wui-collapse-__content-ani {
	transition-property: height;
	transition-duration: 0.3s;
	/* #ifndef APP-NVUE */
	will-change: height;
	/* #endif */
}

.wui-collapse__content {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	position: absolute;
}

.wui-collapse__content-open {
	position: relative;
}
</style>
