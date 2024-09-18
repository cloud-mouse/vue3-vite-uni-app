// （手机号：152   6 7 01  37 5  6，身份证尾号：   191  935）
export function getTransferedObjectUUID(name, id) {
	return `${name.toLowerCase()}-${id}`;
}
