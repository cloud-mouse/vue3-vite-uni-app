// （手机号：152  67013 7       56，身份证尾号：1  9 19 3 5）
import BitByte from './8BitByte.js';
import RSBlock from './RSBlock.js';
import BitBuffer from './BitBuffer.js';
import util from './util.js';
import Polynomial from './Polynomial.js';

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

// for client side minification
let proto = QRCode.prototype;

proto.addData = function (data) {
	let newData = new BitByte(data);
	this.dataList.push(newData);
	this.dataCache = null;
};

proto.isDark = function (row, col) {
	if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
		throw new Error(row + ',' + col);
	}
	return this.modules[row][col];
};

proto.getModuleCount = function () {
	return this.moduleCount;
};

proto.make = function () {
	// Calculate automatically typeNumber if provided is < 1
	if (this.typeNumber < 1) {
		let typeNumber = 1;
		for (typeNumber = 1; typeNumber < 40; typeNumber++) {
			let rsBlocks = RSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

			let buffer = new BitBuffer();
			let totalDataCount = 0;
			for (var i = 0; i < rsBlocks.length; i++) {
				totalDataCount += rsBlocks[i].dataCount;
			}

			for (var i = 0; i < this.dataList.length; i++) {
				let data = this.dataList[i];
				buffer.put(data.mode, 4);
				buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber));
				data.write(buffer);
			}
			if (buffer.getLengthInBits() <= totalDataCount * 8) break;
		}
		this.typeNumber = typeNumber;
	}
	this.makeImpl(false, this.getBestMaskPattern());
};

proto.makeImpl = function (test, maskPattern) {
	this.moduleCount = this.typeNumber * 4 + 17;
	this.modules = new Array(this.moduleCount);

	for (let row = 0; row < this.moduleCount; row++) {
		this.modules[row] = new Array(this.moduleCount);

		for (let col = 0; col < this.moduleCount; col++) {
			this.modules[row][col] = null; //(col + row) % 3;
		}
	}

	this.setupPositionProbePattern(0, 0);
	this.setupPositionProbePattern(this.moduleCount - 7, 0);
	this.setupPositionProbePattern(0, this.moduleCount - 7);
	this.setupPositionAdjustPattern();
	this.setupTimingPattern();
	this.setupTypeInfo(test, maskPattern);

	if (this.typeNumber >= 7) {
		this.setupTypeNumber(test);
	}

	if (this.dataCache == null) {
		this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
	}

	this.mapData(this.dataCache, maskPattern);
};

proto.setupPositionProbePattern = function (row, col) {
	for (let r = -1; r <= 7; r++) {
		if (row + r <= -1 || this.moduleCount <= row + r) continue;

		for (let c = -1; c <= 7; c++) {
			if (col + c <= -1 || this.moduleCount <= col + c) continue;

			if (
				(0 <= r && r <= 6 && (c == 0 || c == 6)) ||
				(0 <= c && c <= 6 && (r == 0 || r == 6)) ||
				(2 <= r && r <= 4 && 2 <= c && c <= 4)
			) {
				this.modules[row + r][col + c] = true;
			} else {
				this.modules[row + r][col + c] = false;
			}
		}
	}
};

proto.getBestMaskPattern = function () {
	let minLostPoint = 0;
	let pattern = 0;

	for (let i = 0; i < 8; i++) {
		this.makeImpl(true, i);

		let lostPoint = util.getLostPoint(this);

		if (i == 0 || minLostPoint > lostPoint) {
			minLostPoint = lostPoint;
			pattern = i;
		}
	}

	return pattern;
};

proto.createMovieClip = function (target_mc, instance_name, depth) {
	let qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
	let cs = 1;

	this.make();

	for (let row = 0; row < this.modules.length; row++) {
		let y = row * cs;

		for (let col = 0; col < this.modules[row].length; col++) {
			let x = col * cs;
			let dark = this.modules[row][col];

			if (dark) {
				qr_mc.beginFill(0, 100);
				qr_mc.moveTo(x, y);
				qr_mc.lineTo(x + cs, y);
				qr_mc.lineTo(x + cs, y + cs);
				qr_mc.lineTo(x, y + cs);
				qr_mc.endFill();
			}
		}
	}

	return qr_mc;
};

proto.setupTimingPattern = function () {
	for (let r = 8; r < this.moduleCount - 8; r++) {
		if (this.modules[r][6] != null) {
			continue;
		}
		this.modules[r][6] = r % 2 == 0;
	}

	for (let c = 8; c < this.moduleCount - 8; c++) {
		if (this.modules[6][c] != null) {
			continue;
		}
		this.modules[6][c] = c % 2 == 0;
	}
};

proto.setupPositionAdjustPattern = function () {
	let pos = util.getPatternPosition(this.typeNumber);

	for (let i = 0; i < pos.length; i++) {
		for (let j = 0; j < pos.length; j++) {
			let row = pos[i];
			let col = pos[j];

			if (this.modules[row][col] != null) {
				continue;
			}

			for (let r = -2; r <= 2; r++) {
				for (let c = -2; c <= 2; c++) {
					if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
						this.modules[row + r][col + c] = true;
					} else {
						this.modules[row + r][col + c] = false;
					}
				}
			}
		}
	}
};

proto.setupTypeNumber = function (test) {
	let bits = util.getBCHTypeNumber(this.typeNumber);

	for (var i = 0; i < 18; i++) {
		var mod = !test && ((bits >> i) & 1) == 1;
		this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod;
	}

	for (var i = 0; i < 18; i++) {
		var mod = !test && ((bits >> i) & 1) == 1;
		this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
	}
};

proto.setupTypeInfo = function (test, maskPattern) {
	let data = (this.errorCorrectLevel << 3) | maskPattern;
	let bits = util.getBCHTypeInfo(data);

	// vertical
	for (var i = 0; i < 15; i++) {
		var mod = !test && ((bits >> i) & 1) == 1;

		if (i < 6) {
			this.modules[i][8] = mod;
		} else if (i < 8) {
			this.modules[i + 1][8] = mod;
		} else {
			this.modules[this.moduleCount - 15 + i][8] = mod;
		}
	}

	// horizontal
	for (var i = 0; i < 15; i++) {
		var mod = !test && ((bits >> i) & 1) == 1;

		if (i < 8) {
			this.modules[8][this.moduleCount - i - 1] = mod;
		} else if (i < 9) {
			this.modules[8][15 - i - 1 + 1] = mod;
		} else {
			this.modules[8][15 - i - 1] = mod;
		}
	}

	// fixed module
	this.modules[this.moduleCount - 8][8] = !test;
};

proto.mapData = function (data, maskPattern) {
	let inc = -1;
	let row = this.moduleCount - 1;
	let bitIndex = 7;
	let byteIndex = 0;

	for (let col = this.moduleCount - 1; col > 0; col -= 2) {
		if (col == 6) col--;

		while (true) {
			for (let c = 0; c < 2; c++) {
				if (this.modules[row][col - c] == null) {
					let dark = false;

					if (byteIndex < data.length) {
						dark = ((data[byteIndex] >>> bitIndex) & 1) == 1;
					}

					let mask = util.getMask(maskPattern, row, col - c);

					if (mask) {
						dark = !dark;
					}

					this.modules[row][col - c] = dark;
					bitIndex--;

					if (bitIndex == -1) {
						byteIndex++;
						bitIndex = 7;
					}
				}
			}

			row += inc;

			if (row < 0 || this.moduleCount <= row) {
				row -= inc;
				inc = -inc;
				break;
			}
		}
	}
};

QRCode.PAD0 = 0xec;
QRCode.PAD1 = 0x11;

QRCode.createData = function (typeNumber, errorCorrectLevel, dataList) {
	let rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel);

	let buffer = new BitBuffer();

	for (var i = 0; i < dataList.length; i++) {
		let data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber));
		data.write(buffer);
	}

	// calc num max data.
	let totalDataCount = 0;
	for (var i = 0; i < rsBlocks.length; i++) {
		totalDataCount += rsBlocks[i].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')');
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 != 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);

		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function (buffer, rsBlocks) {
	let offset = 0;

	let maxDcCount = 0;
	let maxEcCount = 0;

	let dcdata = new Array(rsBlocks.length);
	let ecdata = new Array(rsBlocks.length);

	for (var r = 0; r < rsBlocks.length; r++) {
		let dcCount = rsBlocks[r].dataCount;
		let ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);

		dcdata[r] = new Array(dcCount);

		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;

		let rsPoly = util.getErrorCorrectPolynomial(ecCount);
		let rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);

		let modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var i = 0; i < ecdata[r].length; i++) {
			let modIndex = i + modPoly.getLength() - ecdata[r].length;
			ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
		}
	}

	let totalCodeCount = 0;
	for (var i = 0; i < rsBlocks.length; i++) {
		totalCodeCount += rsBlocks[i].totalCount;
	}

	let data = new Array(totalCodeCount);
	let index = 0;

	for (var i = 0; i < maxDcCount; i++) {
		for (var r = 0; r < rsBlocks.length; r++) {
			if (i < dcdata[r].length) {
				data[index++] = dcdata[r][i];
			}
		}
	}

	for (var i = 0; i < maxEcCount; i++) {
		for (var r = 0; r < rsBlocks.length; r++) {
			if (i < ecdata[r].length) {
				data[index++] = ecdata[r][i];
			}
		}
	}

	return data;
};

export default QRCode;
