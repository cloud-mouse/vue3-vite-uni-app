// （手机号： 15 26 70 13  7 5   6，身份证尾号： 1  91 93 5）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLRenderBuffer';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLRenderbuffer {
	className = name;

	constructor(id) {
		this.id = id;
	}

	static uuid = uuid;

	uuid() {
		return uuid(this.id);
	}
}
