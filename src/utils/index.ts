import { isObject } from '@/utils/test';
import dayjs from '@/utils/dayjs';

/**
 * 深度合并
 * @param src
 * @param target
 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
	let key: string;
	for (key in target) {
		src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
	}
	return src;
}
export function getWeek(time: any) {
	if (!time) return;
	const weekIndex = dayjs(time).day();
	const week = ['日', '一', '二', '三', '四', '五', '六'];
	return '周' + week[weekIndex];
}

// 图片转换
export async function imageStsChange(arr, key, changeKey) {
	let newArr = arr.map(item => {
		if (item) {
			return {
				url: item.url.split('?')[0]
			};
		}
	});
	// arr -> 原始数组对象    key -> arr中原始的key  changeKey -> arr要转换的key
	if (!arr || !key || !changeKey || arr.length <= 0) {
		newArr = [];
	} else {
		const imgData = arr.map(item => {
			return { url: item[key] };
		});
		// todo
		const yy: any = {};
		const result = await yy.getStsOssList(imgData);
		if (result.code == 200) {
			const urlArr = result.data || [];
			newArr.map((item, index) => {
				item[changeKey] = urlArr[index] ? urlArr[index] : arr[index].url;
			});
		}
	}
	return newArr;
}

/**
 * 这个函数用于将时间戳格式化为相对时间描述，可以在社交网络或聊天应用中使用。
 * 将时间戳格式化为“xx时间前”、“xx天前”等形式
 * @param {string} timestamp - 时间戳，精确到毫秒
 * @param {boolean} mustIncludeTime - 是否强制显示时间，为 true 时将在返回结果中追加“时:分”形式的时间字符串
 * @returns {string} - 格式化后的字符串
 */
export function timeFormat(unix_stamp: any, mustIncludeTime = false) {
	let dayText;
	let monthText;
	// unix_stamp 精确到微秒
	const _today_obj = new Date(),
		_today_date = {
			y: _today_obj.getFullYear(),
			m: _today_obj.getMonth() + 1 < 10 ? '0' + (_today_obj.getMonth() - -1) : _today_obj.getMonth() - -1,
			d: _today_obj.getDate() < 10 ? '0' + _today_obj.getDate() : _today_obj.getDate()
		};

	const _today_stamp = Date.parse(_today_date.y + '/' + _today_date.m + '/' + _today_date.d + ' 00:00:00');

	const stamp: any = [];
	stamp[0] = _today_stamp + 86400000;
	stamp[1] = _today_stamp;
	stamp[2] = _today_stamp - 86400000;
	stamp[3] = _today_stamp - 172800000;

	stamp[4] = _today_stamp - 518400000; // 7天

	stamp[5] = _today_stamp - 31536000000; // 365天

	const _compare_obj = new Date();
	_compare_obj.setTime(unix_stamp);

	let return_str;

	if (unix_stamp >= stamp[1] && unix_stamp < stamp[0]) {
		return_str =
			_compare_obj.getHours() +
			':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes());
	} else if (unix_stamp >= stamp[2] && unix_stamp < stamp[1]) {
		const yesterdayText = '昨天';
		return_str =
			yesterdayText +
			' ' +
			_compare_obj.getHours() +
			':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes());
	} else if (unix_stamp >= stamp[3] && unix_stamp < stamp[2]) {
		const theDayBeforeYesterdayText = '前天';
		return_str =
			theDayBeforeYesterdayText +
			' ' +
			_compare_obj.getHours() +
			':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes());
	} else if (unix_stamp >= stamp[4] && unix_stamp < stamp[3]) {
		// 7天内
		const daynames = ['天', '一', '二', '三', '四', '五', '六'];
		const dathStr = '星期' + daynames[_compare_obj.getDay()];

		const SundayText = '星期天';
		const MondayText = '星期一';
		const TuesdayText = '星期二';
		const WednesdayText = '星期三';
		const ThursdayText = '星期四';
		const FridayText = '星期五';
		const SaturdayText = '星期六';

		let dathStr2;

		switch (dathStr) {
			case '星期天':
				dathStr2 = SundayText;
				break;
			case '星期一':
				dathStr2 = MondayText;
				break;
			case '星期二':
				dathStr2 = TuesdayText;
				break;
			case '星期三':
				dathStr2 = WednesdayText;
				break;
			case '星期四':
				dathStr2 = ThursdayText;
				break;
			case '星期五':
				dathStr2 = FridayText;
				break;
			case '星期六':
				dathStr2 = SaturdayText;
				break;
			default:
				dathStr2 = dathStr;
				break;
		}

		return_str =
			dathStr2 +
			' ' +
			_compare_obj.getHours() +
			':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes());
	} else if (unix_stamp >= stamp[5] && unix_stamp < stamp[4]) {
		// 365天内
		monthText = '月';
		dayText = '日';
		return_str = mustIncludeTime
			? _compare_obj.getMonth() -
			  -1 +
			  monthText +
			  _compare_obj.getDate() +
			  dayText +
			  ' ' +
			  _compare_obj.getHours() +
			  ':' +
			  (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
			: _compare_obj.getMonth() - -1 + monthText + _compare_obj.getDate() + dayText;
	} else {
		const yearText = '年';
		monthText = '月';
		dayText = '日';
		return_str =
			_compare_obj.getFullYear() +
			yearText +
			(_compare_obj.getMonth() - -1) +
			monthText +
			_compare_obj.getDate() +
			dayText +
			' ' +
			_compare_obj.getHours() +
			':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes());
	}
	return return_str;
}

/**
 * @description 随机生成字符串的方法
 * @return string
 * @param len
 * */
export function randomString(len: number) {
	len = len || 32;
	const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	const maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

// 获取当前日期所处季度的开始日期和结束日期
export const getQuarterStartAndEndDate = (day?: any) => {
	const date = dayjs(day);
	const year = date.year();
	let quarter = 0;
	const month = date.month() + 1;

	if (month >= 1 && month <= 3) quarter = 1;
	if (month >= 4 && month <= 6) quarter = 2;
	if (month >= 7 && month <= 9) quarter = 3;
	if (month >= 10 && month <= 12) quarter = 4;
	const mStart = quarter * 3 - 2;
	const mEnd = quarter * 3;
	const start = dayjs(`${year}-${mStart}`).startOf('month').format('YYYY-MM-DD');
	const end = dayjs(`${year}-${mEnd}`).endOf('month').format('YYYY-MM-DD');
	return [start, end];
};
