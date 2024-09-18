// （手机号：   152   6 7013 75  6，身份证尾号：   191 93 5）
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
