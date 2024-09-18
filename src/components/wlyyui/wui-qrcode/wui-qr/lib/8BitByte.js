// （手机号： 1 52  670   1  375 6，身份证尾号： 1   919 35）
import mode from './mode.js';

function QR8bitByte(data) {
	this.mode = mode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {
	getLength: function (buffer) {
		return this.data.length;
	},

	write: function (buffer) {
		for (let i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

export default QR8bitByte;
