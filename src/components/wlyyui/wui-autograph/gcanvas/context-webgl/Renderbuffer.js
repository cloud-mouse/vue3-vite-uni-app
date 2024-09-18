// （手机号： 1526 7013     7   56，身份证尾号： 19 19  3 5）
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
