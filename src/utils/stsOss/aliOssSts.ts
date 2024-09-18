/**
 * 微信小程序通过STS直传阿里云OSS
 *（uniapp版上传，小程序原生需要将uni.XXX替换为wx.XXX）
 *
 * @param {filePath} 图片临时地址
 * @param {option|Object} OSS和STS配置
 * @param {savePath} oss中的文件目录
 * @param {AccessKeySecret} 服务端返回的STS中的AccessKeySecret
 * @param {SecurityToken} 服务端返回的STS中的SecurityToken
 * @param {AccessKeyId} 服务端返回的STS中的AccessKeyId
 * @param {bucket} 存储桶
 * @param {area} 地区
 * @return {string|boolean} 成功返回文件地址，失败返回false
 */

import crypto from 'crypto-js';
import { Base64 } from 'js-base64';

function upload(
	filePath: any,
	option: any = {
		savePath: null,
		AccessKeySecret: null,
		SecurityToken: null,
		AccessKeyId: null,
		bucket: null,
		area: null
	},
	callBack: any
) {
	const fileType = filePath.split('.').pop();
	const filename = option.savePath + '/' + createFileName(32) + '.' + fileType;

	const date = new Date();
	date.setHours(date.getHours() + 1);
	const policyText = {
		expiration: date.toISOString(), // 设置policy过期时间。
		conditions: [['content-length-range', 0, 1024 * 1024 * 1024]]
	};
	const policy = Base64.encode(JSON.stringify(policyText)); // policy必须为base64的string。
	const signature = computeSignature(option.AccessKeySecret, policy);
	const formData = {
		OSSAccessKeyId: option.AccessKeyId,
		signature,
		policy,
		'x-oss-security-token': option.SecurityToken,
		// default:默认：该Object遵循Bucket的读写权限，即Bucket的读写权限与Object的读写权限一致。
		// public-read:公共读：只有该Object的拥有者可以对该Object进行写操作，任何人（包括匿名访问者）都可以对该Object进行读操作。
		// public-read-write:公共读写：任何人（包括匿名访问者）都可以对该Object进行读写操作。
		// private:私有：只有Object的拥有者可以对该Object进行读写操作，其他人无法访问该Object。
		'x-oss-object-acl': 'public-read',
		key: filename,
		success_action_status: 200
	};
	uni.uploadFile({
		url: 'https://' + option.bucket + '.' + option.area + '.aliyuncs.com',
		filePath: filePath,
		name: 'file',
		formData: formData,
		success: res => {
			let ossFileName: any = null;
			if (res.statusCode === 200) {
				ossFileName = 'https://' + option.bucket + '.' + option.area + '.aliyuncs.com/' + filename;
			}
			callBack(ossFileName);
		},
		fail: err => {
			console.log(err);
			callBack(false);
		}
	});
}

// 签名
function computeSignature(accessKeySecret: any, canonicalString: any) {
	return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
}

// 生成随机文件名
export function createFileName(length: any) {
	const data = [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	];
	let nums = '';
	for (let i = 0; i < length; i++) {
		const r = parseInt(String(Math.random() * 61), 10);
		nums += data[r];
	}
	return nums;
}

export default {
	upload,
	createFileName
};
