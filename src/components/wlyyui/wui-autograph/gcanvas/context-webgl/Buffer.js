// （手机号： 152 6   7 0  1375  6，身份证尾号：191    9 35）
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
