import { defineStore } from 'pinia';
import { getCache, removeCache, setCache } from '@/utils/cache';
import { IS_LOGIN_OUT_KEY, TOKEN_KEY, USER_INFO_KEY, USER_PATIENT } from '@/enums/cacheEnum';
import { loginWechatApi, loginPwdApi } from '@/api/modules/auth';

import { useUserStore } from '@/state/modules/user';

interface AuthState {
	token?: string;
	isLoginOutKey?: boolean;
}

export const useAuthStore = defineStore({
	id: 'auth',
	state: (): AuthState => ({
		token: '',
		isLoginOutKey: false //防止多个401弹多次登录
	}),
	getters: {
		getToken: state => state.token,
		// isLogin: (state): boolean => !!state.token,
		isLogin: (state): boolean => (state.token ? true : false),
		getAuthorization: state => {
			return state.token ? { authorization: `Bearer ${state.token}` } : {};
		}
	},
	actions: {
		/**
		 * @description 初始化token
		 */
		initToken() {
			this.token = getCache<string>(TOKEN_KEY) || '';
		},
		/**
		 * @description 设置token
		 */
		setToken(token: string | undefined) {
			setCache(TOKEN_KEY, token);
			this.token = token;
		},
		/**
		 * @description 设置token
		 */
		setIsLoginOutKey(isLoginOutKey: boolean) {
			setCache(IS_LOGIN_OUT_KEY, isLoginOutKey);
			this.isLoginOutKey = isLoginOutKey;
		},
		/**
		 * @description 微信授权登录
		 */
		async wechatLogin(para: any): Promise<any> {
			try {
				// const res = await loginWechatApi(para);
				const res = {
					code: 200,
					message: 'success',
					data: {
						phone: '18895361234',
						token:
							'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImNyZWF0ZUF0IjoxNzI2NjQ0MDkzODM3fQ.eyJpc3MiOiJpc2RtIiwiaWQiOiIxaTI4ZGp0ZG8ycmdiajk2YzF0dDg2b2o0YWw3c3BkNiIsImV4cCI6MTcyOTIzNjA5Mywib3JnSWQiOiIxIiwibG9naW5Vc2VyVHlwZSI6IuaCo-iAhSJ9.cBy1NwlQpniX53c0EvncvCidzPfUb3Yb65v6AgZSe',
						userId: '1i28djtdo2rgbj96c1tt86oj4al7spd6'
					},
					ok: true
				};
				this.setToken(res.data.token);
				const userStore = useUserStore();
				await userStore.getUserCurrentInfo();
				return Promise.resolve(res);
			} catch (err: any) {
				return Promise.reject(err);
			}
		},
		/**
		 * @description 账密登录
		 */
		async loginPwd(para: any): Promise<any> {
			try {
				const res = await loginPwdApi(para);
				this.setToken(res.data.token);
				const userStore = useUserStore();
				await userStore.getUserCurrentInfo();
				return Promise.resolve(res);
			} catch (err: any) {
				return Promise.reject(err);
			}
		},
		/**
		 * @description 登出
		 */
		async loginOut(): Promise<any> {
			try {
				removeCache(TOKEN_KEY); //清除缓存token
				removeCache(USER_INFO_KEY); //清除缓存用户信息
				removeCache(USER_PATIENT); //清除缓存患者信息
				//防止出现多次登录提醒弹框
				setCache(IS_LOGIN_OUT_KEY, false); //登出标记置为false
				this.setToken('');
				return Promise.resolve(true);
			} catch (err: any) {
				return Promise.reject(err);
			}
		}
		/**
		 * @description 刷新token
		 */
		// async refreshToken(): Promise<LoginModel> {
		//     try {
		//         const { data } = await refreshToken();
		//         this.setToken(data.token);
		//         return Promise.resolve(data);
		//     } catch (err: any) {
		//         return Promise.reject(err);
		//     }
		// },
	}
});
