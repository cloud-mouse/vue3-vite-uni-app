/**
 * 微信小程序通过STS直传腾讯云cos
 *（uniapp版上传，小程序原生需要将uni.XXX替换为wx.XXX）
 */
import { createFileName } from './aliOssSts';
import { handelPostPolice } from './handelPostPolice'; // 引入直传数据解析方法
/**
 *
 * @param {*} filePath              文件路径
 * @param {string} option      COS上传参数{AccessKeySecret, SecurityToken, AccessKeyId, Bucket, area, provider, expiration}
 * @returns
 */
export const uploadFileOrPic = (filePath, option) => {
	const fileType = filePath.split('.').pop();
	const filename = option.savePath + '/' + createFileName(32) + '.' + fileType;
	// COS上传数据 转 直传数据
	const opt = handelPostPolice(filePath, filename, option);
	// 上传图片
	return new Promise((resolve, reject) => {
		const formData = {
			key: opt.cosKey,
			policy: opt.policy, // 这个传 policy 的 base64 字符串
			success_action_status: 200,
			'q-sign-algorithm': 'sha1',
			'q-ak': option.AccessKeyId,
			'q-key-time': opt.qKeyTime,
			'q-signature': opt.qSignature,
			'x-cos-security-token': option.SecurityToken,
			'X-cos-acl': 'public-read'
		};
		uni.uploadFile({
			url: 'https://' + opt.cosHost, // 腾讯云服务器地址
			filePath: filePath, //本地上传文件路径
			name: 'file',
			formData: formData,
			success: res => {
				if (res.statusCode === 200) {
					const fileUrl = 'https://' + opt.cosHost + '/' + camSafeUrlEncode(opt.cosKey).replace(/%2F/g, '/');
					resolve(fileUrl);
				} else {
					reject(res);
				}
			},
			error(err) {
				reject(err);
			}
		});
	});
};
// 对更多字符编码的 url encode 格式
const camSafeUrlEncode = function (str) {
	return encodeURIComponent(str)
		.replace(/!/g, '%21')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29')
		.replace(/\*/g, '%2A');
};
export default {
	uploadFileOrPic
};
