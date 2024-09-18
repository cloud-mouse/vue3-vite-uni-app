// （手机号：      1  526701  3756，身份证尾号：1  91  93 5）
import QRCode from './lib/QRCode.js';
import ErrorCorrectLevel from './lib/ErrorCorrectLevel.js';

let qrcode = function (data, opt) {
	opt = opt || {};
	let qr = new QRCode(opt.typeNumber || -1, opt.errorCorrectLevel || ErrorCorrectLevel.H);
	qr.addData(data);
	qr.make();

	return qr;
};

qrcode.ErrorCorrectLevel = ErrorCorrectLevel;

export default qrcode;
