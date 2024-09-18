<!--（手机号：15   26 7 0  1 3 75 6，身份证尾号：19193     5）-->
<template>
	<view class="wui-vtabs-content__wrap" ref="wui_vtabs__el" :id="'wui-vtabs-content__' + tabIndex">
		<slot></slot>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
// #endif
export default {
	name: 'wui-vtabs-content',
	inject: ['vtabs'],
	props: {
		tabIndex: {
			type: [Number, String],
			default: 0
		}
	},
	mounted() {
		if (this.vtabs && this.vtabs.linkage) {
			this.vtabs.children.push(this);
			setTimeout(() => {
				this.calcHeight(height => {
					this.vtabs.getCalcHeight(height, Number(this.tabIndex));
				});
			}, 300);
		}
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
	methods: {
		calcHeight(callback, index = 0) {
			// #ifdef APP-NVUE
			const result = dom.getComponentRect(this.$refs['wui_vtabs__el'], option => {
				if (option && option.result && option.size) {
					callback && callback(option.size.height + 1);
				}
			});
			// #endif

			// #ifndef APP-NVUE
			uni
				.createSelectorQuery()
				// #ifndef MP-ALIPAY
				.in(this)
				// #endif
				.select(`#wui-vtabs-content__${this.tabIndex}`)
				.fields(
					{
						size: true
					},
					data => {
						if (index >= 12) return;
						if (data && data.height) {
							callback && callback(data.height);
						} else {
							index++;
							setTimeout(() => {
								this.calcHeight(callback, index);
							}, 50);
							return;
						}
					}
				)
				.exec();
			// #endif
		},
		uninstall() {
			if (this.vtabs && this.vtabs.linkage) {
				this.vtabs.uninstall(Number(this.tabIndex), this);
			}
		}
	}
};
</script>

<style scoped>
.wui-vtabs-content__wrap {
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
}
</style>
