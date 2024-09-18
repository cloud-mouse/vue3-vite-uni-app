// （手机号：1    5  2 670137  5 6，身份证尾号：    1 91935）
export function getTransferedObjectUUID(name, id) {
	return `${name.toLowerCase()}-${id}`;
}
