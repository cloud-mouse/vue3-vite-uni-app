<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useAuthStore } from '@/state/modules/auth';
import { removeInterceptor, setupInterceptors } from '@/utils/interceptors';
import { useRouterStore } from '@/state/modules/router';
import { computed, watch, ref } from 'vue';
import { useUserStore } from '@/state/modules/user';
/** IM 引入结束 */
onLaunch(() => {
	// #ifndef APP-PLUS || H5
	mpUpdate(); //小程序更新
	// #endif
	removeInterceptor();
	setupInterceptors();
	const appStore = useRouterStore();
	appStore.initialize();
	console.log('App Launch');
});
const authStore = useAuthStore();
const userStore = useUserStore();
onShow(() => {
	authStore.initToken();
	console.log('App onShow');
	if (isLogin.value) {
		initUserInfo();
	}
});
onHide(() => {
	console.log('App Hide');
});
//是否登录
const isLogin = computed(() => {
	return authStore.isLogin;
});
//初始化用户信息
const initUserInfo = () => {
	if (isLogin.value) {
		userStore.initUserInfo();
	}
};
const mpUpdate = () => {
	console.log('mpUpdate');
	const updateManager = uni.getUpdateManager();
	updateManager.onCheckForUpdate(res => {
		// 检测新版本后的回调
		if (res.hasUpdate) {
			// 如果有新版本提醒并进行强制升级
			uni.showModal({
				content: '新版本已经准备好，是否重启应用？',
				showCancel: false,
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						updateManager.onUpdateReady(res => {
							// 新版本下载完成的回调
							updateManager.applyUpdate(); // 强制当前小程序应用上新版本并重启
						});

						updateManager.onUpdateFailed(res => {
							// 新版本下载失败的回调
							// 新版本下载失败，提示用户删除后通过冷启动重新打开
							uni.showModal({
								content: '下载失败，请删除当前小程序后重新打开',
								showCancel: false,
								confirmText: '知道了'
							});
						});
					}
				}
			});
		}
	});
};
// 监听登录状态
watch(
	[() => authStore?.isLogin, () => userStore?.userInfo?.userId],
	newVal => {
		if (newVal[0] === true && newVal[1]) {
		}
	},
	{
		immediate: true
	}
);
</script>
<style lang="scss">
@import '@/assets/main.scss';
@import '@/components/wlyyui/wui-theme/wui-theme.css';
</style>
