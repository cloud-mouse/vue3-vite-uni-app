import { request } from '@/api/index';
import { PORT1 } from '@/api/config/servicePort';
/**
 * 获取用户信息
 */
export function getUserInfoApi() {
	return request.get<any>(PORT1 + `/userInfo`, {
		custom: {
			auth: true
		}
	});
}
