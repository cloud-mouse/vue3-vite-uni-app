import { defineStore } from 'pinia';
import { getCache, setCache } from '@/utils/cache';
import { USER_INFO_KEY, USER_PATIENT } from '@/enums/cacheEnum';

interface UserState {
	id?: string | number;
	userInfo?: any;
	defaultPatientInfo?: any;
}

export const useUserStore = defineStore({
	id: 'user',
	state: (): UserState => ({
		id: '',
		userInfo: {},
		defaultPatientInfo: {}
	}),
	getters: {
		getUserInfo: state => state.userInfo
	},
	actions: {
		async initUserInfo() {
			await this.getUserCurrentInfo();
			this.userInfo = getCache<Object>(USER_INFO_KEY) || undefined;
			this.defaultPatientInfo = getCache<Object>(USER_PATIENT) || undefined;
		},
		setUserInfo(userInfo: Object | undefined) {
			setCache(USER_INFO_KEY, userInfo);
			this.userInfo = userInfo;
		},
		setDefaultPatientInfo(defaultPatientInfo: Object | undefined) {
			setCache(USER_PATIENT, defaultPatientInfo);
			this.defaultPatientInfo = defaultPatientInfo;
		},
		/**
		 * @description 获取用户信息
		 */
		async getUserCurrentInfo(): Promise<any> {
			try {
				// const resData = await getUserInfoApi();
				const resData = {
					code: 200,
					message: 'success',
					data: {
						name: '微信用户',
						userId: '1i28djtdo2rgbj96c1tt86oj4al7spd6',
						defaultPatientId: '',
						phone: '18895361234',
						registerSource: 'UNKNOW',
						imHasRegistered: true
					},
					ok: true
				};
				this.setUserInfo(resData?.data);
				return Promise.resolve(resData);
			} catch (err: any) {
				return Promise.reject(err);
			}
		}
	}
});
