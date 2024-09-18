// （手机号：1 5 26  701  37  5  6，身份证尾号：19  1 93  5）
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
