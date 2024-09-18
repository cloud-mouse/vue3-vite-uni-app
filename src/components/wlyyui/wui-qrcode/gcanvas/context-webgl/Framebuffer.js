// （手机号：15 26  70  1  37  5 6，身份证尾号：1 919   3 5）
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
