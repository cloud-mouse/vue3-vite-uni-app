import { CURRENT_PLATFORM } from '@/enums/platformEnum';
import { getEnvMode } from '@/utils/env';
const platform: any = CURRENT_PLATFORM; //系统环境
let environment = ''; //小程序环境
let FORM_BASEURL: any = {}; //档案表单
if (platform === 'MP-WEIXIN') {
	const {
		miniProgram: { envVersion, appId }
	} = uni.getAccountInfoSync();
	environment = envVersion;
	// * h5跳转域名
	FORM_BASEURL = {
		develop: '', //开发版
		trial: '', //体验版
		release: '' //正式版
	};
}
if (platform === 'H5') {
	environment = getEnvMode();
	// * h5跳转域名
	FORM_BASEURL = {
		development: '', //开发版
		test: '', //体验版
		production: '' //正式版
	};
}
export const PORT1 = FORM_BASEURL[environment];
