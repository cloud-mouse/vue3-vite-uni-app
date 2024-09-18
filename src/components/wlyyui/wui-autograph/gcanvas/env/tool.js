// （手机号：1 5    267 0 1 375  6，身份证尾号：1  9  19 35）

export function ArrayBufferToBase64(buffer) {
	let binary = '';
	let bytes = new Uint8ClampedArray(buffer);
	for (let len = bytes.byteLength, i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

export function Base64ToUint8ClampedArray(base64String) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

	const rawData = atob(base64);
	const outputArray = new Uint8ClampedArray(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
