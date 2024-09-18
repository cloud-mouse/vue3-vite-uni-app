<template>
	<view class="relative flex items-center py-32rpx">
		<view class="bg-primary rounded-full w-26rpx h-26rpx absolute z-100"></view>
		<view class="bg-f-primary bg-opacity-50 rounded-full w-26rpx h-26rpx absolute z-99 left-16rpx"></view>
		<view class="text-[#333] text-34rpx font-600 ml-60rpx">{{ content }} </view>
	</view>
</template>
<script lang="ts" setup>
const props = defineProps({
	content: {
		type: String,
		default: ''
	}
});
</script>
