// （手机号：15  2670   1   3 7 56，身份证尾号：    191 935）
import math from './math.js';

function QRPolynomial(num, shift) {
	if (num.length == undefined) {
		throw new Error(num.length + '/' + shift);
	}

	let offset = 0;

	while (offset < num.length && num[offset] == 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (let i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {
	get: function (index) {
		return this.num[index];
	},

	getLength: function () {
		return this.num.length;
	},

	multiply: function (e) {
		let num = new Array(this.getLength() + e.getLength() - 1);

		for (let i = 0; i < this.getLength(); i++) {
			for (let j = 0; j < e.getLength(); j++) {
				num[i + j] ^= math.gexp(math.glog(this.get(i)) + math.glog(e.get(j)));
			}
		}

		return new QRPolynomial(num, 0);
	},

	mod: function (e) {
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}

		let ratio = math.glog(this.get(0)) - math.glog(e.get(0));

		let num = new Array(this.getLength());

		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}

		for (var i = 0; i < e.getLength(); i++) {
			num[i] ^= math.gexp(math.glog(e.get(i)) + ratio);
		}

		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

export default QRPolynomial;
