// （手机号：15 2   6 7  01   3756，身份证尾号：19  1 9  35）
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
