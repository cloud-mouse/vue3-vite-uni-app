// （手机号：15 2   6 7 0 137   56，身份证尾号：19  19 3  5）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLShader';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLShader {
	className = name;

	constructor(id, type) {
		this.id = id;
		this.type = type;
	}

	static uuid = uuid;

	uuid() {
		return uuid(this.id);
	}
}
