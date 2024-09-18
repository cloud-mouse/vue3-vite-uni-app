<!-- 底部导航栏 -->
<template>
	<wui-tabbar
		:isFixed="true"
		z-index="9999"
		:tabBar="tabsVal"
		:current="currentTabIndex"
		@init="init"
		@click="beforeSwitch"
		hide-tab-bar
	></wui-tabbar>
</template>

<script lang="ts" name="TabBar" setup>
import { ref } from 'vue';
import { useRouter } from '@/hooks/router';
import { onShow } from '@dcloudio/uni-app';
import { useAuthStore } from '@/state/modules/auth';
const props = defineProps({
	current: { type: [Number, String], default: 0 },
	// 背景色
	bgcolor: { type: String, default: '#F2F2F2' },
	// 颜色
	color: { type: String, default: '#474747' },
	// 激活颜色
	activeColor: { type: String, default: '#9BC6FC' },
	// tab选项
	tabs: {
		type: Array,
		default: () => [
			{
				iconPath: '/static/images/tabBar/my_service.png',
				selectedIconPath: '/static/images/tabBar/my_service_current.png',
				text: '我的服务',
				onlyIcon: false,
				path: `/pages/index/index`
			},
			{
				iconPath: '/static/images/tabBar/mine_center.png',
				selectedIconPath: '/static/images/tabBar/mine_center_current.png',
				text: '个人中心',
				onlyIcon: false,
				path: `/pages/mine/index`
			}
		]
	}
});
const currentTabIndex = ref<any>(0);
const router = useRouter();
const authStore = useAuthStore();
const emits = defineEmits(['tabClick', 'initHeight']);
let tabsVal = ref<any>([]);
onShow(() => {
	// uniapp获取当前页面路径
	// 方法1：(App、小程序、H5通用)
	let pages: any = getCurrentPages(); //获取页面栈数组
	let page = pages[pages.length - 1]; //获取当前页面对象
	let route = page.route; //获取当前页面路由
	//在微信小程序或是app中，通过page.options；如果是H5，则需要page.route.query（H5中的page.options为undefined）
	let options = page.options || page.route.query;
	// selectRoute(route);
	tabsVal.value = props.tabs;
	currentTabIndex.value = props.current;
});
// 匹配当前路由页面
// function selectRoute(curPath: any) {
// 	curPath = curPath.substr(0, 1) == '/' ? curPath : '/' + curPath;
// 	props.tabs.map((item: any, index: any) => {
// 		if (item.path == curPath) {
// 			currentTabIndex.value = index;
// 		}
// 	});
// }
const beforeSwitch = (item: any) => {
	uni.switchTab({
		url: item.path
	});
};
const init = (e: any) => {
	emits('initHeight', e);
};
</script>
