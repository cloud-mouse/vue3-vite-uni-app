<!-- 蓝色登录页面2 -->
<template>
	<view
		class="container"
		:style="{ background: `https://gitee.com/zhangmouren66/image-store/raw/master/images/1726643036813xn_login_bj.png` }"
	>
		<Navbar></Navbar>
		<view class="w-full px-32rpx pt-190rpx">
			<view class="w-full flex justify-center items-center flex-col">
				<view class="w-176rpx h-176rpx rounded-32rpx bg-#ffffff flex items-center justify-center mb-130rpx">
					<image
						mode="widthFix"
						src="https://gitee.com/zhangmouren66/image-store/raw/master/images/1726642939225gensci_logo.png"
					></image>
				</view>
				<view class="w-full mb-228rpx">
					<wui-button
						background="linear-gradient(119deg, #0085CD 0%, #00A161 100%)"
						openType="getPhoneNumber"
						@getphonenumber="getPhoneNumber"
						size="36"
						:disabled="!isChecked"
						disabled-color="#ffffff"
						disabled-background="#CACACA"
						radius="49rpx"
						text="一键登录"
						@click="handleSubMessage"
					></wui-button>
					<view class="text-36rpx font-400 text-#333333 text-center mt-28rpx" @click="handleJumpHome">暂不登录</view>
				</view>
				<view class="w-full">
					<view class="flex items-center h-100rpx text-24rpx px-30rpx">
						<wui-label>
							<view class="flex items-center">
								<wui-checkbox :checked="isChecked" color="#0085cd" :scaleRatio="1" @change="handleNoticeChange"></wui-checkbox>
								<view class="text-26rpx ml-16rpx text-#333333"
									>我已认真阅读并同意
									<text class="text-f-primary" @click.stop="handleJumpPrivacyPolicy('1')">《用户协议》</text>与<text
										class="text-f-primary"
										@click.stop="handleJumpPrivacyPolicy('2')"
										>《隐私条款》</text
									>
								</view>
							</view>
						</wui-label>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup name="Login">
import { onUnmounted, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAuthStore } from '@/state/modules/auth';
import Navbar from '@/components/Navbar/index.vue';
import { useRouter } from '@/hooks/router';
import { Toast } from '@/utils/uniapi/prompt';
import { globalConfig } from '@/settings/app';

const redirect = ref<string | undefined>(undefined);

onLoad((query: any) => {
	redirect.value = query.redirect ? decodeURIComponent(query.redirect) : undefined;
	// #ifndef APP-PLUS || H5
	getAuthorize();
	// #endif
});
const authStore = useAuthStore();
const appId = globalConfig.appId;
const router = useRouter();
const codeTimer = ref<any>(null);
onUnmounted(() => {
	clearInterval(codeTimer.value);
});
const getAuthorize = () => {
	uni.getSetting({
		success: (res: any) => {
			wechatAuthCode();
			codeTimer.value = setInterval(() => {
				wechatAuthCode();
			}, 100000);
		}
	});
};
//微信获取用户code，
const loginCode = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				resolve(res);
			},
			fail(err) {
				reject(err);
			}
		});
	});
};

const wechatCode: any = ref();
const wechatAuthCode = async () => {
	let res: any = await loginCode();
	if (res.code && ['login:ok'].includes(res.errMsg)) {
		wechatCode.value = res.code;
		//后端通过code调用微信API返回openid/unionid/session_key参数， 存储起来,前端无法直接调用微信相关API
		// const resData = wechatAuthCodeApi({
		// 	code: res.code,
		// 	appId
		// });
		const resData = {
			code: 200,
			message: 'success',
			data: { sessionKey: 'xxxx=', openid: 'x-LTk-SRI', unionid: null },
			ok: true
		};
	} else {
		//异常处理，再次发起请求或者抛出异常
		// .....
	}
};
//2、获取手机授权登录
const getPhoneNumber = async (e: any) => {
	const { iv, encryptedData } = e;
	if (!iv || !encryptedData) return;
	const phoneInfo: any = {
		iv,
		encryptedData
	};

	uni.getUserInfo({
		withCredentials: true,
		success: async result => {
			const { iv, signature, encryptedData, rawData } = result;
			await wxPhoneLogin({ iv, signature, encryptedData, rawData }, { ...phoneInfo });
		},
		fail: err => {
			console.log('err--->', err);
		}
	});
};
// 3、登录获取用户信息TOKEN
const wxPhoneLogin = async (userInfo: any, phoneInfo: any) => {
	try {
		const res = await authStore.wechatLogin({
			code: wechatCode.value,
			appId,
			userInfo,
			phoneInfo
		});

		if (res.code === 200) {
		}
		if (res.code === 200) {
			Toast('登录成功!', { duration: 1500 });
			if (redirect.value) {
				router.go(redirect.value, { replace: true });
				return;
			}
			router.back();
		}
	} catch (e) {
		console.log(e);
	}
};
const isChecked = ref<any>(false);
const handleNoticeChange = (e: any) => {
	isChecked.value = e.checked;
};
const handleJumpHome = () => {
	router.pushTab('/pages/index/index');
};
const handleSubMessage = () => {
	// 消息订阅
	uni.requestSubscribeMessage({
		tmplIds: ['mML_9f_FKjL7SfIIUDkgxWQZHtEX-Xa-RIzuDDhKbqg', 'Bjn7fT8Y2gDhlfd6wkrDOtRD8wpVpdnCGGR25Ie10qE'],
		success: (res: any) => {
			console.log('requestSubscribeMessage', res);
		}
	});
};
const handleJumpPrivacyPolicy = (type: any) => {
	console.log('隐私跳转');
};
</script>
<style lang="scss" scoped>
.container {
	height: 100%;
	background-size: 100% 100%;
}
:deep(.wui-button) {
	font-weight: 500;
}
:deep(.text-f-primary) {
	color: #0072b0;
}
</style>
