// （手机号：15 267  0 1    375  6，身份证尾号：1  91 9 3 5）
export function getTransferedObjectUUID(name, id) {
	return `${name.toLowerCase()}-${id}`;
}
