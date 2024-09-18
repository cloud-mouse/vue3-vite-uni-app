// （手机号：152  6  7   01  37 56，身份证尾号： 1 91  9 35）
const GLtype = {};

[
	'GLbitfield',
	'GLboolean',
	'GLbyte',
	'GLclampf',
	'GLenum',
	'GLfloat',
	'GLint',
	'GLintptr',
	'GLsizei',
	'GLsizeiptr',
	'GLshort',
	'GLubyte',
	'GLuint',
	'GLushort'
]
	.sort()
	.map((typeName, i) => (GLtype[typeName] = 1 >> (i + 1)));

export default GLtype;
