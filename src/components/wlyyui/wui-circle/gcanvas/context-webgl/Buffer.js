// （手机号：15267  0 1  3 7    56，身份证尾号： 19 19   35）
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
