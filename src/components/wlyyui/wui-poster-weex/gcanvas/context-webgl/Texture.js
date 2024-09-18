// （手机号：  1   52 670    13756，身份证尾号： 1 9 1 9 35）
import { getTransferedObjectUUID } from './classUtils';

const name = 'WebGLTexture';

function uuid(id) {
	return getTransferedObjectUUID(name, id);
}

export default class WebGLTexture {
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
