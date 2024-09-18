import AliOss from '@/utils/stsOss/aliOssSts';
import TxCos from '@/utils/stsOss/txCosSts'; // 腾讯云
import { Toast } from '@/utils/uniapi/prompt';
/**
 * 微信小程序图片上传
 * @param {ossObj|Object} 临时sts信息,通过后端返回
 * @param {type|Object} 相机or相册
 * @param {filePathName|string} 文件路径名称
 * @return {string|boolean} 成功返回文件地址，失败返回false
 */
export function chooseImage(type: any = 'album', ossData: any, filePathName: string, callBack: any) {
	const ossObj = {
		AccessKeySecret: ossData.AccessKeySecret,
		SecurityToken: ossData.SecurityToken,
		AccessKeyId: ossData.AccessKeyId,
		bucket: ossData.bucket,
		area: ossData.area // bucket 所在地
	};
	if (type === 'album') {
		uni.chooseImage({
			count: 9,
			sizeType: ['compressed', 'camera'],
			sourceType: ['album'],
			success: function (res: any) {
				if (res.errMsg == 'chooseImage:ok') {
					const filePathList = res.tempFiles;
					for (let i = 0; i < filePathList.length; i++) {
						const filePath = filePathList[i].path;
						const option = {
							savePath: filePathName || 'app/image',
							...ossObj
						};
						if (ossData.provider === 'Tencent') {
							TxCos.uploadFileOrPic(filePath, option)
								.then(res => {
									if (res) {
										callBack(res);
									} else {
										Toast('图片上传失败，请稍后重试');
									}
								})
								.catch(err => {
									console.log(err);
									Toast('图片上传失败，请稍后重试');
								});
						} else {
							AliOss.upload(filePath, option, function (res: any) {
								if (res) {
									callBack(res);
								} else {
									Toast('图片上传失败，请稍后重试');
								}
							});
						}
					}
				} else {
					Toast('图片选择失败');
				}
			}
		});
	}
	if (type === 'camera') {
		uni.chooseMedia({
			count: 9,
			mediaType: ['image'],
			sourceType: ['camera'],
			camera: 'back',
			success(res: any) {
				const filePathList = res.tempFiles;
				for (let i = 0; i < filePathList.length; i++) {
					const filePath = res && res.tempFiles && filePathList[i].tempFilePath;
					const option = {
						savePath: filePathName || 'image',
						...ossObj
					};
					if (ossData.provider === 'Tencent') {
						TxCos.uploadFileOrPic(filePath, option)
							.then(res => {
								if (res) {
									callBack(res);
								} else {
									Toast('图片上传失败，请稍后重试');
								}
							})
							.catch(err => {
								console.log(err);
								Toast('图片上传失败，请稍后重试');
							});
					} else {
						AliOss.upload(filePath, option, function (res: any) {
							if (res) {
								callBack(res);
							} else {
								Toast('图片上传失败，请稍后重试');
							}
						});
					}
				}
			}
		});
	}
}
