<template>
	<view class="app-main bj-[#f7f8fa]" :style="{ paddingBottom: tabBarHeight + 'px', height: height }">
		<slot></slot>
	</view>
	<TabBar @initHeight="initHeight" :current="current" v-if="isShowTabBar" />
</template>
<script lang="ts" setup name="AppProvider">
import TabBar from '@/components/Tabbar/index.vue';
import { ref } from 'vue';
import { px2rpx } from '@/utils/uniapi';
import { isPhoneX } from '@/utils/platform';

const props = defineProps({
	isShowTabBar: { type: Boolean, default: false },
	height: { type: [String], default: '100%' },
	current: { type: Number, default: 0 }
});
const tabBarHeight = ref<any>(0);
const initHeight = (e: any) => {
	//处理tabbar高度，避免内容被tabbar遮住
	let safeAreaH = isPhoneX() ? 34 : 0;
	tabBarHeight.value = e.height + safeAreaH;
};
</script>

<style lang="scss" scoped>
.app-main {
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	/* #ifndef APP-NVUE || MP-TOUTIAO */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
}
</style>
