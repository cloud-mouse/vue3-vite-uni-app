// （手机号： 15 2 6 701      3756，身份证尾号：   1919 3 5）
export function getTransferedObjectUUID(name, id) {
	return `${name.toLowerCase()}-${id}`;
}
