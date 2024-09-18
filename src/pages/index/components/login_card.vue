<template>
	<view class="flex flex-col w-full bg-#ffffff rounded-16rpx pt-24rpx pb-40rpx px-32rpx">
		<view class="text-38rpx font-500 text-#333333 mb-10rpx">您的账户</view>
		<view class="text-28rpx font-400 text-#999999 mb-24rpx">点击登录以继续使用</view>
		<view>
			<wui-button
				class="w-full flex"
				radius="96rpx"
				type="primary"
				size="36rpx"
				background="linear-gradient(147deg, #0085CD 0%, #00A161 100%)"
				bold
				@click="handleJumpLogin"
				>去登录</wui-button
			>
		</view>
	</view>
</template>
<script lang="ts" setup name="LoginCard">
import { ref } from 'vue';
import { useRouter } from '@/hooks/router';
const router = useRouter();
// 测试消息推送
const handleSubMessage = (callback: any) => {
	uni.requestSubscribeMessage({
		tmplIds: ['MO4uDpN99_a4of0AWv_j9uJ4ksfelzu3oU138QSaYvY', '2RupmP6V1761Iyber0OoYIUPVCaoY6iRL2EUmMfHb4c'],
		success: (res: any) => {
			callback();
		}
	});
};
const handleJumpLogin = () => {
	router.push('/pages/login/index');
	// handleSubMessage(() => {
	// 	router.push('/pages/login/index');
	// });
};
</script>

<style lang="scss" scoped></style>
