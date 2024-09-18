import { getEnvMode } from '@/utils/env';
import { CURRENT_PLATFORM } from '@/enums/platformEnum';
const platform: any = CURRENT_PLATFORM; //系统环境
let environment = ''; //小程序环境
let BASEURL1: any = {};
if (platform === 'MP-WEIXIN') {
	const {
		miniProgram: { envVersion }
	} = uni.getAccountInfoSync();
	environment = envVersion;
	// * 后端接口请求地址1
	BASEURL1 = {
		develop: '', //开发版
		trial: '', //体验版
		release: '' //正式版
	};
}
if (platform === 'H5') {
	environment = getEnvMode();
	// * 后端接口请求地址1
	BASEURL1 = {
		development: '', //开发版
		test: '', //体验版
		production: '' //正式版
	};
}
export const PORT1 = BASEURL1[environment];
