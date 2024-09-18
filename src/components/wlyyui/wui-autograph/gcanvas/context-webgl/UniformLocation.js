// （手机号：1   526  7   013 75 6，身份证尾号：191 9   3 5）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLUniformLocation';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLUniformLocation {
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
