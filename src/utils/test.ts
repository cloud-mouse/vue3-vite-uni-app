/**
 * 验证电子邮箱格式
 */
export function isEmail(value: any) {
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}

/**
 * 验证手机格式
 */
export function isMobile(value: any) {
	return /^1[23456789]\d{9}$/.test(value);
}

/**
 * 验证URL格式
 */
export function isUrl(value: any) {
	return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value);
}

/**
 * 验证日期格式
 */
export function isDate(value: any) {
	return !/Invalid|NaN/.test(new Date(value).toString());
}

/**
 * 验证ISO类型的日期格式
 */
export function isDateISO(value: any) {
	return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
}

/**
 * 验证十进制数字
 */
export function isNumber(value: any) {
	return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
}

/**
 * 验证整数
 */
export function isDigits(value: any) {
	return /^\d+$/.test(value);
}

/**
 * 验证身份证号码
 */
export function isIdCard(value: any) {
	return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
}

/**
 * 是否车牌号
 */
export function isCarNo(value: any) {
	// 新能源车牌
	const xreg =
		/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
	// 旧车牌
	const creg =
		/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if (value.length === 7) {
		return creg.test(value);
	} else if (value.length === 8) {
		return xreg.test(value);
	} else {
		return false;
	}
}

/**
 * 金额,只允许2位小数
 */
export function amount(value: any) {
	//金额，只允许保留两位小数
	return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
}

/**
 * 中文
 */
export function chinese(value: any) {
	const reg = /^[\u4e00-\u9fa5]+$/gi;
	return reg.test(value);
}

/**
 * 只能输入字母
 */
export function letter(value: any) {
	return /^[a-zA-Z]*$/.test(value);
}

/**
 * 只能是字母或者数字
 */
export function enOrNum(value: any) {
	//英文或者数字
	const reg = /^[0-9a-zA-Z]*$/g;
	return reg.test(value);
}

/**
 * 验证是否包含某个值
 */
export function contains(value: any, param: any) {
	return value.indexOf(param) >= 0;
}

/**
 * 验证一个值范围[min, max]
 */
export function range(value: any, param: any) {
	return value >= param[0] && value <= param[1];
}

/**
 * 验证一个长度范围[min, max]
 */
export function rangeLength(value: any, param: any) {
	return value.length >= param[0] && value.length <= param[1];
}

/**
 * 是否固定电话
 */
export function isLandline(value: any) {
	const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
	return reg.test(value);
}
/**
 * 是否是undefined
 */
export function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined';
}
/**
 判断是否为null
 *
 */
export function isNull(val: unknown): val is null {
	return val === null;
}
/**
 * 是否非undefined
 */
export function isUnDef<T = unknown>(val?: T): val is T {
	return !isDef(val);
}
/**
 判断是否为undefined且null
 *
 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) && isNull(val);
}

/**
 判断是否为undefined或null
 *
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) || isNull(val);
}
/**
 * 判断是否为空
 */
export function isEmpty(value: any) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if (!value) return true;
			break;
		case 'number':
			if (0 === value || isNaN(value)) return true;
			break;
		case 'object':
			if (null === value || value.length === 0) return true;
			for (const i in value) {
				return false;
			}
			return true;
	}
	return false;
}

/**
 * 是否json字符串
 */
export function isJsonString(value: any) {
	if (typeof value == 'string') {
		try {
			const obj = JSON.parse(value);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
	return false;
}

/**
 * 是否数组
 */
export function isArray(value: any) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === '[object Array]';
	}
}

/**
 * 是否对象
 */
export function isObject(value: any) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 是否短信验证码
 */
export function isCode(value: any, len = 6) {
	return new RegExp(`^\\d{${len}}$`).test(value);
}
