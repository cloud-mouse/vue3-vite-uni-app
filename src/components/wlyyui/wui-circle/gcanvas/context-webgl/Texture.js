// （手机号：15 26 70   1375     6，身份证尾号：1919 3    5）
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
