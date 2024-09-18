// （手机号： 15  2  670 1 3 7 5 6，身份证尾号：  19 19 3 5）
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
