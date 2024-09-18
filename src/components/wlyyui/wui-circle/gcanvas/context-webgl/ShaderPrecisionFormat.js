// （手机号：  1  52 67  01 37  56，身份证尾号：1 919 3   5）
export default class WebGLShaderPrecisionFormat {
	className = 'WebGLShaderPrecisionFormat';

	constructor({ rangeMin, rangeMax, precision }) {
		this.rangeMin = rangeMin;
		this.rangeMax = rangeMax;
		this.precision = precision;
	}
}
