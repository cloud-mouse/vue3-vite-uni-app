// （手机号：1 52    6 70 137   56，身份证尾号：   19 1 935）
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
