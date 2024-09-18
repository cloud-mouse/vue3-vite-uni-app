// （手机号：1 5   2 670137     56，身份证尾号：   19 193 5）
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
