let systemInfo = null; // 系统信息

/**
 * @description 封装 uni.getSystemInfo 异步获取系统信息
 */
export function getSystemInfo() {
	return new Promise((resolve, reject) => {
		if (systemInfo) {
			return resolve(systemInfo);
		}
		uni.getSystemInfo({
			success: res => {
				systemInfo = res;
				resolve(res);
			},
			fail: reject
		});
	});
}

/**
 * @description 封装 uni.getSystemInfoSync 同步获取系统信息
 */
export function getSystemInfoSync() {
	const res = uni.getSystemInfoSync();
	systemInfo = res;
	return res;
}

/**
 * @description 版本号比较
 * @param {String} v1
 * @param {String} v2
 * @return {Boolean} v2 大于 v1 返回true, 否则返回false
 * compareVersion('1.9.9', '1.11.0'); // true
 */
export function compareVersion(v1, v2) {
	v1 = v1.split('.');
	v2 = v2.split('.');
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 < num2) {
			return true;
		} else if (num1 > num2) {
			return false;
		}
	}

	return false;
}

/**
 * 防抖 debounce
 * 栗子：实时搜索，拖拽
 */
export function debounce(fn, delay = 500) {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}

/**
 * 获取扩展名
 * @param {String} url 视频播放地址
 */
export function getExt(url) {
	const index = url.indexOf('?');
	if (index != -1) {
		url = url.substring(0, index);
	}
	let ext = '';
	const reg = /.+\./;
	ext = url.replace(reg, '').toLowerCase();
	return ext;
}
