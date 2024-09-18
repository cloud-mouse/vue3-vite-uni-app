<template>
	<AppProvider :is-show-tab-bar="true" :current="0">
		<view class="content-box pb-160rpx">
			<view class="w-full h-560rpx absolute top-0 left-0 right-0">
				<image
					class="w-full h-full relative"
					src="https://gitee.com/zhangmouren66/image-store/raw/master/images/1726642880693xn_home_bg.png"
				></image>
			</view>
			<view class="w-full px-24rpx relative">
				<!-- 顶部状态栏高度 -->
				<wui-status-bar></wui-status-bar>
				<view class="flex items-center mt-8rpx">
					<image
						class="w-96rpx h-96rpx"
						src="https://gitee.com/zhangmouren66/image-store/raw/master/images/1726642939225gensci_logo.png"
					></image>
					<text class="ml-12rpx text-#333 text-36rpx font-500">uni-app 模板</text>
				</view>
			</view>
			<view class="relative w-full mt-42rpx px-24rpx" v-if="!isLogin">
				<LoginCard></LoginCard>
			</view>
			<view class="w-full h-200rpx text-#333 text-36rpx font-500 z-10 text-center p-32rpx" v-else>已登录</view>
		</view>
	</AppProvider>
</template>
<script setup lang="ts" name="Home">
import { computed } from 'vue';
// 组件
import AppProvider from '@/components/AppProvider/inedx.vue';
import LoginCard from './components/login_card.vue';
import { useAuthStore } from '@/state/modules/auth';
import { onShow, onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
const authStore = useAuthStore();
onLoad((options: any) => {
	console.log('options', options);
});
const isLogin = computed(() => {
	return authStore.isLogin;
});
onShow(() => {
	if (isLogin.value) {
		console.log('isLogin---->1', authStore.isLogin);
		// ... do something
	}
});

// 分享
onShareAppMessage(() => {
	return {
		title: '',
		imageUrl: ''
	};
});
// 朋友圈
onShareTimeline(() => {
	return {
		title: '',
		query: '', //'share=' + state.share, // 可不填 传递的参数，只能是这种格式
		imageUrl: ''
	};
});
</script>
<style lang="scss">
.content-box {
	display: flex;
	flex-direction: column;
}
</style>
