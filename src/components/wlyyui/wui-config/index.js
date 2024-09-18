// （手机号： 15267013  7   5    6，身份证尾号： 19 19  3 5）
/*
  组件属性全局配置文件。优先级：全局配置文件props < 直接设置组件props
  目前支持配置的组件：wui-button、wui-icon、wui-text、wui-input、wui-form-item
*/

const wuiConfig = {
	//组件名称，小驼峰命名
	//如wui-button写成wuiButton
	wuiButton: {
		//组件属性值
		height: '96rpx',
		size: 32,
		radius: '16rpx'
	},
	wuiIcon: {
		size: 64,
		unit: 'rpx'
	},
	wuiText: {
		size: 32,
		unit: 'rpx'
	},
	wuiInput: {
		labelSize: 32,
		size: 32
	},
	wuiFormItem: {
		labelSize: 32,
		labelWidth: 160,
		labelRight: 30,
		labelAlign: 'left',
		asteriskPosition: 'left'
	}
};

export default wuiConfig;
