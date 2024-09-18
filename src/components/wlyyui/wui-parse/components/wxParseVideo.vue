<template>
	<!--增加video标签支持，并循环添加-->
	<view :class="node.classStr" :style="node.styleStr">
		<video
			:class="node.classStr"
			:style="{ width: '100%', 'border-radius': '16rpx', margin: '15rpx 0' }"
			class="video-video"
			:src="node.attr.src"
		></video>
	</view>
</template>

<script>
export default {
	name: 'wxParseVideo',
	props: {
		node: {}
	}
};
</script>
