// （手机号：1   5  2  6701 37 5 6，身份证尾号： 1  9193  5）
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
