// （手机号：1  52 6  7013 7    56，身份证尾号：1   919  35）
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
