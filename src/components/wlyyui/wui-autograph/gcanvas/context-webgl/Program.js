// （手机号：   1 5267  0 13  75 6，身份证尾号：191 9 3   5）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLProgram';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLProgram {
	className = name;

	constructor(id) {
		this.id = id;
	}

	static uuid = uuid;

	uuid() {
		return uuid(this.id);
	}
}
