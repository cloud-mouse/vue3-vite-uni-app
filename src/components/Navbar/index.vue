<template>
	<view class="head-wrapper">
		<wui-nav-bar
			z-index="8888"
			is-fixed
			:title="navbarTitle"
			:background="navbarBgColor"
			:size="navbarTitleSize"
			:color="navbarTextColor"
			@rightClick="rightClick"
			@init="getHeadHeight"
			:custom="isCustom"
		>
			<template v-if="!isCustom">
				<!--#ifndef MP-ALIPAY-->
				<template v-if="backShow">
					<wui-icon name="w-arrowleft" @click="onBack" :size="navbarLeftIconSize" :color="navbarTextColor"></wui-icon>
				</template>
				<template v-if="isHomeShow && !backShow">
					<wui-icon @click="onBackHome" name="w-warehouse" :size="navbarLeftIconSize" :color="navbarTextColor"></wui-icon>
				</template>
				<!--#endif-->
			</template>
			<slot></slot>
			<template v-slot:right>
				<slot name="right"></slot>
			</template>
		</wui-nav-bar>
		<view :style="{ height: headHeight + 'rpx' }"></view>
	</view>
</template>
<script lang="ts" setup name="Navbar">
import { px2rpx } from '@/utils/uniapi';
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from '@/hooks/router';
import { useGlobalStyle } from '@/hooks/useGlobalStyle';
import { HOME_PAGE } from '@/enums/routerEnum';
const { navigationBarBackgroundColor, navigationBarTitleText, navigationBarTextStyle } = useGlobalStyle();

const { currentRoute, currentPages } = useRoute();

const props = defineProps({
	bgColor: { type: String, default: '#ffffff' },
	title: { type: String },
	titleColor: { type: String },
	titleSize: { type: [String, Number], default: 32 },
	iconSize: { type: Number, default: 48 },
	isBackShow: { type: Boolean, default: true },
	isHomeShow: { type: Boolean, default: true },
	isCustom: { type: Boolean, default: false }
});
const emits = defineEmits(['rightClick', 'headInit']);
const navbarBgColor = computed(() => props.bgColor || navigationBarBackgroundColor);
const navbarTitle = computed(() => props.title || currentRoute?.style?.navigationBarTitleText || navigationBarTitleText);
const navbarTextColor = computed(() => props.titleColor || currentRoute?.style?.navigationBarTextStyle || navigationBarTextStyle);
const navbarTitleSize = computed(() => {
	return `${props.titleSize}rpx`;
});
const navbarLeftIconSize = computed(() => {
	return `${props.iconSize}`;
});
const backShow = computed(() => {
	return currentPages.length > 1 && props.isBackShow;
});
const router = useRouter();
const onBack = () => {
	router.back();
};
const onBackHome = () => {
	router.pushTab(HOME_PAGE);
};
const rightClick = e => {
	emits('rightClick', e);
};
const headHeight = ref<any>(0);
const getHeadHeight = e => {
	headHeight.value = `${px2rpx(e.height + e.statusBarHeight)}`;
	emits('headInit', e);
};
</script>

<style lang="scss" scoped></style>
