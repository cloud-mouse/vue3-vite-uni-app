<!--（手机号：  15  2670 13  7  5 6，身份证尾号：  1 919 3 5）-->
<template>
	<view class="wui-collapse__wrap">
		<slot></slot>
	</view>
</template>
<script>
export default {
	name: 'wui-collapse',
	emits: ['change'],
	props: {
		// 是否开启手风琴效果
		accordion: {
			type: Boolean,
			default: false
		}
	},
	created() {
		this.children = [];
	},
	methods: {
		collapseChange(obj, isOpen, idx) {
			if (this.accordion && isOpen) {
				this.children.forEach((item, index) => {
					if (item !== obj) {
						item.isOpen = false;
					}
				});
			}
			this.$emit('change', {
				index: idx,
				isOpen: isOpen
			});
		}
	}
};
</script>
<style scoped>
.wui-collapse__wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
	flex-direction: column;
	background: #fff;
}
</style>
