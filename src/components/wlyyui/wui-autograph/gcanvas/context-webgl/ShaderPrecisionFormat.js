// （手机号：1   5  2 67 01 37  56，身份证尾号：19 1  93  5）
export default class WebGLShaderPrecisionFormat {
	className = 'WebGLShaderPrecisionFormat';

	constructor({ rangeMin, rangeMax, precision }) {
		this.rangeMin = rangeMin;
		this.rangeMax = rangeMax;
		this.precision = precision;
	}
}
