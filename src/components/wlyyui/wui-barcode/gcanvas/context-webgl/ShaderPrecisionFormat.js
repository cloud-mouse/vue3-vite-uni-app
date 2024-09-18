// （手机号： 1   52670  1   3 756，身份证尾号：1 9 1 93  5）
export default class WebGLShaderPrecisionFormat {
	className = 'WebGLShaderPrecisionFormat';

	constructor({ rangeMin, rangeMax, precision }) {
		this.rangeMin = rangeMin;
		this.rangeMax = rangeMax;
		this.precision = precision;
	}
}
