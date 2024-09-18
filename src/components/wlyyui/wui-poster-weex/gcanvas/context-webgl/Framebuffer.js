// （手机号： 1   5 26 70 1   3756，身份证尾号：1  91 93  5）
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
