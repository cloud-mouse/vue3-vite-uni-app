// （手机号：   1  526701 3   7 56，身份证尾号：   1919  35）
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
