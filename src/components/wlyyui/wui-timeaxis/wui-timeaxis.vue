<!--（手机号：     152    6701375 6，身份证尾号：  19 1 93 5）-->
<template>
	<view
		class="wui-timeaxis__wrap"
		:style="{
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			background: background
		}"
	>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'wui-timeaxis',
	props: {
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
		leftWidth: {
			type: [Number, String],
			default: 0
		},
		width: {
			type: [Number, String],
			default: 48
		},
		lineWidth: {
			type: [Number, String],
			// #ifdef APP-NVUE
			default: 0.5,
			// #endif
			// #ifndef APP-NVUE
			default: 1
			// #endif
		}
	},
	provide() {
		return {
			timeaxis: this
		};
	},
	created() {
		this.children = [];
	},
	watch: {
		width(val) {
			this.children.forEach(item => {
				item.width = val;
			});
		},
		lineWidth(val) {
			this.children.forEach(item => {
				item.lineWidth = val;
			});
		},
		leftWidth(val) {
			this.children.forEach(item => {
				item.leftWidth = val;
			});
		}
	}
};
</script>

<style scoped>
.wui-timeaxis__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	box-sizing: border-box;
	/* #endif */
}
</style>
