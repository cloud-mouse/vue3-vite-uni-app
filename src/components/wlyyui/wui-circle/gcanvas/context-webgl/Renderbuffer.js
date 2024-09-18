// （手机号：1526    70 1 37   5 6，身份证尾号： 19 19   35）
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
