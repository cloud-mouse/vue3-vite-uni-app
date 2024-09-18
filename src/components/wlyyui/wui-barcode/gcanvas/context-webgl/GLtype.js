// （手机号： 15267  0 1   3   756，身份证尾号： 19 19   35）
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
