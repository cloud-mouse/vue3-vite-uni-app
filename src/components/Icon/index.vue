<template>
	<!--本地 icon 资源, uniapp 打包到 app 仅支持标签 image, 打包小程序和 H5 均可支持标签 img -->
	<image
		class="icon"
		:src="props.file"
		v-if="isApp"
		@click="handlerImgClick"
		:style="{ width: props.width, height: props.height }"
	/>
	<img class="icon" :src="props.file" v-else @click="handlerImgClick" :style="{ width: props.width, height: props.height }" />
</template>
<script setup lang="ts">
import { judgePlatform } from '@/utils/platform';
import { PLATFORMS } from '@/enums/platformEnum';
const emits = defineEmits(['handlerImgClick']);
const isApp = judgePlatform(PLATFORMS.APP_PLUS);
const props = defineProps({
	file: {
		type: String,
		default: ''
	},
	width: {
		type: String,
		default: '20px'
	},
	height: {
		type: String,
		default: '20px'
	}
});
const handlerImgClick = () => {
	emits('handlerImgClick');
};
</script>
<style lang="scss" scoped>
.icon {
	display: inline-block;
	width: 16px;
	height: 16px;
	margin: 0;
}
</style>
