import { request } from '@/api/index';
import { PORT1 } from '@/api/config/servicePort';

/**
 * 微信授权登录
 * @param params
 */
export function wechatAuthCodeApi(params: any) {
	return request.get<any>(PORT1 + `/wechat/code?appId=${params.appId}&code=${params.code}`, {
		custom: {
			auth: false
		}
	});
}
/**
 * 获取openid、sessionKey、unionid
 * @param params
 */
export function loginWechatApi(params: any) {
	return request.post<any>(PORT1 + '/wechat/login/wechat', params, {
		custom: {
			auth: false
		}
	});
}
/**
 *  账号密码登录
 */
export function loginPwdApi(params: any) {
	return request.post<any>(PORT1 + '/login/password', params, {
		custom: {
			auth: false
		}
	});
}
/**
 * 登出
 */
export function logout() {
	return request.delete(PORT1 + '/logout', {});
}

/**
 * 刷新token
 */
export function refreshToken() {
	return request.post<any>(PORT1 + '/refresh/token', {});
}
