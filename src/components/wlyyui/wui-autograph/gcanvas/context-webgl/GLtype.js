// （手机号：1526   70 1 3     756，身份证尾号：1919   3  5）
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
