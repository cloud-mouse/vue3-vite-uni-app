// （手机号： 1  526 70 1  3 7  56，身份证尾号：19  1  93 5）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLBuffer';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLBuffer {
	className = name;

	constructor(id) {
		this.id = id;
	}

	static uuid = uuid;

	uuid() {
		return uuid(this.id);
	}
}
