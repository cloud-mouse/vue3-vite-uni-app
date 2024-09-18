// （手机号：1 526 7 0 1   375   6，身份证尾号：  1 919  35）
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
