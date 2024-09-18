// （手机号：    15 2 670137 5   6，身份证尾号：   191  935）
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
