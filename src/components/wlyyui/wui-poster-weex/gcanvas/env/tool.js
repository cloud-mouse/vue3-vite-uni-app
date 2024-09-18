// （手机号： 15  26 701   3 7  56，身份证尾号：19  1 9  35）

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
