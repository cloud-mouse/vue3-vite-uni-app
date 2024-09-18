// （手机号：1  5  2 6 70 1 3 75 6，身份证尾号：1 9   19 35）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLFrameBuffer';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLFramebuffer {
	className = name;

	constructor(id) {
		this.id = id;
	}

	static uuid = uuid;

	uuid() {
		return uuid(this.id);
	}
}
