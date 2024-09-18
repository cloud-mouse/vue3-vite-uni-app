/**
 * 加速度计
 * 监听设备方向 (专业术语是什么啊...? T^T)
 *
 * 仿...$on $off
 * 记录注册的回调事件
 * 放数组
 */

// 是否在监听
let isListen = false;
// 记录回调函数
const callbackList = [];

let accX, accY, accZ;

// 设备之前的方向
let oldDirection = -1;

/**
 * 监听设备方向变化
 * @param {Function} callback 方向变化的回调函数
 * 	callback 返回参数: 0-正常竖向, 90-屏幕逆时针90度, -90-屏幕顺时针90度
 */
export function onDirectionChange(callback) {
	if (!typeof callback === 'function') {
		// callback.constructor === Function (判断是否函数)
		throw new Error('callback is not a function');
	}
	// 记录回调函数
	const index = callbackList.findIndex(cb => cb === callback);
	if (index === -1) {
		callbackList.push(callback);
	}
	if (isListen) {
		return;
	}
	uni.onAccelerometerChange(res => {
		const { x, y, z } = res;
		(accX = x), (accY = y), (accZ = z);
		// console.log('--- 加速度计 --->', { x: x.toFixed(1), y: y.toFixed(1), z: z.toFixed(1) });
		/**
		 * 竖屏: y <= -0.9
		 * 		requestFullScreen direction = 0
		 * 横屏: x 绝对值 >= 0.9
		 * 		x <= -0.9 屏幕朝左 -> direction =  90
		 * 		x >=  0.9 屏幕朝右 -> direction = -90
		 */
		let direction = -1;
		if (y <= -0.6) {
			direction = 0;
		} else if (x <= -0.6) {
			direction = 90;
		} else if (x >= 0.6) {
			direction = -90;
		}

		if (direction !== -1 && oldDirection != direction) {
			// (竖屏 || 横屏) && 方向变化 => 调用 callback 通知出去
			callbackList.forEach(cb => {
				cb(direction);
			});
		}
		oldDirection = direction;
	});
	// 开始监听
	startAccelerometer();
}

/**
 * 取消监听设备方向变化
 * @param {Function} callback
 */
export function offDirectionChange(callback) {
	let stop = false;
	if (typeof callback === 'function') {
		const index = callbackList.findIndex(cb => cb === callback);
		if (index !== -1) {
			callbackList.splice(index, 1);
		}
	} else {
		stop = true;
	}
	if (callbackList.length === 0) {
		stop = true;
	}
	if (stop && isListen) {
		// 没有传参callback || list数组为空 -> 取消监听
		uni.offAccelerometerChange(function (res) {
			console.log('加速度计取消监听', res);
		});
		// 停止监听
		stopAccelerometer();
	}
}

/**
 * @description 开始监听加速度数据
 * 封装 uni.startAccelerometer(OBJECT)
 */
function startAccelerometer() {
	return new Promise((resolve, reject) => {
		uni.startAccelerometer({
			interval: 'normal', // 'game','normal','ui'
			success: res => {
				console.log(res);
				resolve();
			},
			fail: err => {
				console.log(err);
				reject();
			}
		});
	});
}

/**
 * @description 停止监听加速度数据
 * 封装 uni.stopAccelerometer(OBJECT)
 */
function stopAccelerometer() {
	return new Promise((resolve, reject) => {
		uni.stopAccelerometer({
			success: res => {
				console.log(res);
				resolve();
			},
			fail: err => {
				console.log(err);
				reject();
			}
		});
	});
}
