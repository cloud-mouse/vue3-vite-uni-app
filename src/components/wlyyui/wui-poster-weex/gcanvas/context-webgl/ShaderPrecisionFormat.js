// （手机号：15  2 6   70137    56，身份证尾号：1919   3  5）
export default class WebGLShaderPrecisionFormat {
	className = 'WebGLShaderPrecisionFormat';

	constructor({ rangeMin, rangeMax, precision }) {
		this.rangeMin = rangeMin;
		this.rangeMax = rangeMax;
		this.precision = precision;
	}
}
