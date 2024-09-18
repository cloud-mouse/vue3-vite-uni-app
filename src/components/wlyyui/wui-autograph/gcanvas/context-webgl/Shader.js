// （手机号：  1 5  26   701 37 56，身份证尾号： 191 9   35）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLShader';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLShader {
	className = name;

	constructor(id, type) {
		this.id = id;
		this.type = type;
	}

	static uuid = uuid;

	uuid() {
		return uuid(this.id);
	}
}
