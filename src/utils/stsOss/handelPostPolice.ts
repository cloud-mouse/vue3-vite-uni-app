// 临时密钥服务例子
import crypto from 'crypto-js';
import { Base64 } from 'js-base64';
/**
 * @param {*} filePath          文件路径
 * @param {string} fileName     文件名
 * @param {object} config      COS上传参数{AccessKeySecret, SecurityToken, AccessKeyId, Bucket, area, provider, expiration}
 * @returns
 */
export const handelPostPolice = (filePath, fileName, config) => {
	const nowTime = new Date();
	// 开始计算凭证
	const cosHost = `${config.bucket}.cos.${config.area}.myqcloud.com`;
	const cosKey = `${nowTime.getFullYear()}-${nowTime.getMonth() + 1}/${new Date().getTime()}${fileName
		.split('/')
		.pop()}`; /* 上传后的文件在桶中的位置，如果想要放在text文件下，可以定义为text/文件名。文件地址可以前端自己定义，也可以后端返回。 */
	const now = Math.round(Date.now() / 1000);
	const exp = now + 900;
	const qKeyTime = now + ';' + exp;
	// 生成上传要用的 policy
	const policy = JSON.stringify({
		expiration: new Date(exp * 1000).toISOString(),
		conditions: [
			{ 'q-sign-algorithm': 'sha1' },
			{ 'q-ak': config.AccessKeyId },
			{ 'q-sign-time': qKeyTime },
			{ bucket: config.bucket },
			{ key: cosKey }
		]
	});
	// 步骤一：生成 SignKey
	const signKey = crypto.HmacSHA1(qKeyTime, config.AccessKeySecret).toString(crypto.enc.Hex);
	// 步骤二：生成 StringToSign
	const stringToSign = crypto.SHA1(policy).toString(crypto.enc.Hex);
	// 步骤三：生成 Signature
	const qSignature = crypto.HmacSHA1(stringToSign, signKey).toString(crypto.enc.Hex);
	const data = {
		cosHost: cosHost,
		cosKey: cosKey,
		policy: Base64.encode(policy),
		qAk: config.AccessKeyId,
		qKeyTime: qKeyTime,
		qSignature: qSignature
	};
	return data;
};
