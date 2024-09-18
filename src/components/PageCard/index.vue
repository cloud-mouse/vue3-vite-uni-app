<template>
	<view class="relative nav-list">
		<template v-for="(item, index) in cardList" :key="index">
			<view
				class="nav-li text-#ffffff"
				@click="handleJump(item)"
				:style="[
					{
						animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1',
						backgroundColor: item.color
					}
				]"
			>
				<view class="nav-title">{{ item.name }}</view>
				<view class="nav-name">{{ item.note }}</view>
				<view class="nav-icon">
					<wui-icon :name="item.icon" :size="52" color="#ffffff"></wui-icon>
				</view>
			</view>
		</template>
	</view>
</template>
<script lang="ts" setup name="PageCard">
import { onMounted, ref } from 'vue';
const props = defineProps({
	list: { type: Array, default: () => [] }
});
const cardList = ref<any>('');
onMounted(() => {
	cardList.value = props.list;
});
const emits = defineEmits(['itemClick']);
//跳转
const handleJump = (item: any) => {
	emits('itemClick', item);
};
</script>

<style lang="scss" scoped>
.nav-list {
	display: flex;
	flex-wrap: wrap;
	padding: 0px 20rpx 0px;
	justify-content: space-between;
}
.nav-li {
	padding: 20rpx 30rpx;
	border-radius: 12rpx;
	width: 45%;
	margin: 0 2.5% 40rpx;
	background-image: url(https://womanhospital-oss.gjwlyy.com/common/picture/20230608/1686217105191573.png);
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 1;
}

.nav-li::after {
	content: '';
	position: absolute;
	z-index: -1;
	background-color: inherit;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: -10%;
	border-radius: 10rpx;
	opacity: 0.2;
	transform: scale(0.9, 0.9);
}

.nav-li.cur {
	color: #fff;
	background: rgb(94, 185, 94);
	box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
}

.nav-title {
	font-size: 32rpx;
	font-weight: 300;
}

.nav-title::first-letter {
	font-size: 40rpx;
	margin-right: 4rpx;
}

.nav-name {
	font-size: 28rpx;
	text-transform: Capitalize;
	margin-top: 20rpx;
	position: relative;
}

.nav-name::before {
	content: '';
	position: absolute;
	display: block;
	width: 40rpx;
	height: 6rpx;
	background: #fff;
	bottom: 0;
	right: 0;
	opacity: 0.5;
}

.nav-name::after {
	content: '';
	position: absolute;
	display: block;
	width: 100rpx;
	height: 1px;
	background: #fff;
	bottom: 0;
	right: 40rpx;
	opacity: 0.3;
}

.nav-name::first-letter {
	font-weight: bold;
	font-size: 36rpx;
	margin-right: 1px;
}

.nav-li text {
	position: absolute;
	right: 30rpx;
	top: 30rpx;
	font-size: 52rpx;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
}

.nav-icon {
	position: absolute;
	right: 10rpx;
	top: 10rpx;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
}

@keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40rpx);
	}

	100% {
		transform: translateY(0px);
	}
}

@-webkit-keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40rpx);
	}

	100% {
		transform: translateY(0px);
	}
}
</style>
