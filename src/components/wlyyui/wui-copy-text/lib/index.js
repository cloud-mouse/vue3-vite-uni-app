// （手机号：  1526  70    137  56，身份证尾号： 19  1 9 35）
/*!
 * 剪贴板
 *
 */
// #ifdef H5
import ClipboardJS from './clipboard.min.js';
// #endif

/**
 * data 需要复制的数据
 * callback 回调
 * e 当用户点击后需要先请求接口再进行复制时，需要传入此参数（H5端）
 * **/
const getClipboardData = function (data, callback, e) {
	// #ifdef APP-PLUS || MP
	uni.setClipboardData({
		data: data,
		success(res) {
			'function' == typeof callback && callback(true);
		},
		fail(res) {
			'function' == typeof callback && callback(false);
		}
	});
	// #endif

	// #ifdef H5
	let event = window.event || e || {};
	let clipboard = new ClipboardJS('', {
		text: () => data
	});
	clipboard.on('success', e => {
		'function' == typeof callback && callback(true);
		clipboard.off('success');
		clipboard.off('error');
		clipboard.destroy();
	});
	clipboard.on('error', e => {
		'function' == typeof callback && callback(false);
		clipboard.off('success');
		clipboard.off('error');
		clipboard.destroy();
	});
	clipboard.onClick(event);
	// #endif
};
export default {
	getClipboardData: getClipboardData
};
