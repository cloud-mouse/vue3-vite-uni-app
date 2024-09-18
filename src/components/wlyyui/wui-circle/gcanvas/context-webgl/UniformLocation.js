// （手机号：1   5 2 670   13 75 6，身份证尾号：1 919 3   5）
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
