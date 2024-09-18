<template>
	<web-view :src="url"></web-view>
</template>
<script lang="ts" setup name="showThirdH5">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
const url = ref('');
onLoad((options: any) => {
	console.log('options.url', options.url);
	url.value = decodeURIComponent(options.url);
});
</script>

<style lang="scss" scoped></style>
