<template>
	<AppProvider>
		<view class="w-screen flex flex-col items-center pt-320rpx">
			<view class="w-600rpx h-300rpx">
				<image mode="left right top bottom" class="w-full h-full" src="/static/svg/404.svg" />
			</view>
			<view class="mb-40rpx w-full">
				<view class="px-32rpx break-all">{{ go }} 页面找不到了~</view>
			</view>
			<view class="w-full px-30rpx">
				<wui-button text="返回首页" @click="backHome"></wui-button>
			</view>
		</view>
	</AppProvider>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { useRouter } from '@/hooks/router';
import AppProvider from '@/components/AppProvider/inedx.vue';
const go = ref<string>('');
const router = useRouter();
const redirect = ref<string>('');
onLoad((query: any) => {
	go.value = query.go || '';
	redirect.value = query.redirect || '';
});

/**
 * 返回首页
 */
const backHome = () => {
	router.pushTab(redirect.value);
};
</script>
<style lang="scss" scoped></style>
