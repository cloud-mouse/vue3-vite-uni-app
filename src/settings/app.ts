export const globalConfig = {
	appId: 'xxxxxxxxxxxxxx'
};
export const specUrlObj = {
	xxxxxxxxxxxxxx: ''
};
export const sYsUrlObj = {
	wxb2c909925a17eaa6lalalal: ``,
	xxxxxxxxxxxxxx: `/`
};
export const getSpecImgUrl = (path: any, width: any = 750) => {
	return `${specUrlObj[globalConfig.appId]}`;
};
export const getSysImgUrl = (path: any, width: any = 750) => {
	return `${sYsUrlObj[globalConfig.appId]}${path}`;
};
