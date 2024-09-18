<template>
	<AppProvider :is-show-tab-bar="true" :current="1">
		<view class="content-box">
			<view class="w-full px-32rpx relative z-1">
				<!--      患者信息-->
				<view class="mine-card-bg w-full flex items-center h-164rpx mb-24rpx mt-40rpx pl-32rpx bg-#ffffff">
					<wui-lazyload :width="96" :height="96" :radius="9999" mode="scaleToFill" src="/static/images/avatar.png"></wui-lazyload>
					<view class="flex-1 ml-24rpx">
						<template v-if="!isLogin">
							<view class="text-32rpx text-primary underline" @click="handleLogin">登录</view>
						</template>
						<template v-if="isLogin">
							<view class="text-36rpx text-#333333 font-500 mb-10rpx">{{ userInfo?.selfPatient?.name || userInfo?.name }}</view>
							<view class="text-28rpx text-#999999 font-400 flex items-center" v-if="false">
								<text>
									{{ userInfo?.selfPatient ? '查看详情' : '绑定本人信息' }}
								</text>
								<wui-icon name="w-arrowright" color="#999999" :size="40"></wui-icon>
							</view>
						</template>
					</view>
				</view>
				<!--      设置中心-->
				<view class="w-full bg-#ffffff rounded-16rpx box-shadow overflow-hidden mb-24rpx">
					<template v-for="(item, index) in settingList_a" :key="index">
						<view @click="handleSettingItem(item)">
							<wui-list-cell arrow>
								<view class="flex items-center">
									<image class="w-48rpx h-48rpx" mode="widthFix" :src="item.icon"></image>
									<text class="ml-20rpx text-30rpx font-400 text-#333333">{{ item.title }}</text>
								</view>
							</wui-list-cell>
						</view>
					</template>
				</view>
				<view v-if="isLogin">
					<wui-button
						class="w-full flex"
						radius="96rpx"
						type="primary"
						size="30rpx"
						background="#ffffff"
						color="#333333"
						@click="handleLoginOut"
						>退出登录</wui-button
					>
				</view>
			</view>
		</view>
		<wui-actionsheet
			:size="32"
			:color="'#333333'"
			:show="show"
			:tips="tips"
			:itemList="itemList"
			:isCancel="isCancel"
			@click="itemClick"
			@cancel="cancel"
		></wui-actionsheet>
	</AppProvider>
</template>
<script setup lang="ts" name="Mine">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from '@/hooks/router';
import { useAuthStore } from '@/state/modules/auth';
import { useUserStore } from '@/state/modules/user';
import { onShow } from '@dcloudio/uni-app';
import { Toast } from '@/utils/uniapi/prompt';
// 组件
import AppProvider from '@/components/AppProvider/inedx.vue';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
onMounted(() => {});
const settingList_a = ref<any>([
	{
		icon: '/static/images/mine_steward.png',
		title: '联系客服',
		url: '',
		urlType: 3
	}
]);
const userInfo = ref<any>({});
onShow(() => {
	if (isLogin.value) {
		getUserInfo();
	}
});
const isLogin = computed(() => {
	return authStore.isLogin;
});
const getUserInfo = () => {
	userStore.getUserCurrentInfo().then((res: any) => {
		userInfo.value = res.data;
	});
};
const handleLogin = () => {
	router.push('/pages/login/index');
	// handleSubMessage(() => {
	// 	router.push('/pages/login/index');
	// });
};
//退出登录
const show = ref(false);
const isCancel = ref<any>(true);
const tips = ref('是否确认退出？');
const itemList = ref([
	{
		text: '确认',
		color: '#EB4E3D'
	}
]);
const handleLoginOut = () => {
	show.value = true;
};
const itemClick = e => {
	authStore.loginOut();
	cancel();
};
const cancel = () => {
	show.value = false;
};
const handleSettingItem = (item: any) => {
	if (item.urlType === 3) {
		uni.makePhoneCall({
			phoneNumber: '18895361234' //仅为示例，并非真实的电话号码
		});
		return;
	}
	if (item.url) {
		router.push(item.url);
	} else {
		Toast('功能暂未开放');
	}
};
</script>
<style lang="scss">
.content-box {
	overflow: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.mine-card-bg {
		background: linear-gradient(22deg, #ffffff 0%, rgba(255, 255, 255, 0.47) 100%);
		box-shadow: 0rpx 0rpx 32rpx 0rpx #e9f4ee;
		border-radius: 16rpx;
	}
}
.content-box:before {
	content: '';
	background: linear-gradient(180deg, #eff9ff 0%, #f5f5f5 100%);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 560rpx;
	z-index: 0;
}
:deep(.wui-actionsheet__tips) {
	border-bottom: 1rpx solid #e5e5e5;
}
:deep(.wui-actionsheet__wrap) {
	margin-bottom: 115rpx;
}
:deep(.wui-actionsheet__operate-box) {
	padding-bottom: 16rpx;
}
</style>
