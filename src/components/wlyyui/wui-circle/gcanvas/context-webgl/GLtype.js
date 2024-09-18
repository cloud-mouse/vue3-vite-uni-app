// （手机号：  1526    7   01375 6，身份证尾号：  19  19 35）
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
