// （手机号：  1  5   2670 1 375 6，身份证尾号： 1 9 1 9 35）
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
