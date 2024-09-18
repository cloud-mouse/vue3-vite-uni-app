<template>
	<view class="wui-controls">
		<template v-if="hasCoverView">
			<view class="cover-view" v-show="coverViewVis">
				<view class="wrap" :class="{ 'full-screen': fullscreen }">
					<view class="text" v-if="definitionName" @click="showDefinition">{{ definitionName }}</view>
					<view class="text" v-if="rateName" @click="showRate">{{ rateName }}</view>
					<view class="text" v-if="custom && customName && (!onlyShowCustomInFullscreen || fullscreen)" @click="showCustom">{{
						customName
					}}</view>
				</view>
			</view>
			<view v-show="definitionVis" class="full-coverage" :class="{ 'full-screen': fullscreen }" @click="hideDefinition">
				<view class="full-coverage__content">
					<view class="title">清晰度</view>
					<view class="list">
						<view
							v-for="item in definition"
							:key="item.key"
							class="item"
							:class="{ active: item.key == curDefinition }"
							@click.stop="changeDefinition(item.key)"
						>
							<view class="">
								<view>{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-show="rateVis" class="full-coverage" :class="{ 'full-screen': fullscreen }" @click="hideRate">
				<view class="full-coverage__content">
					<view class="title">播放速度</view>
					<view class="list">
						<view
							v-for="item in rateList"
							:key="item.key"
							class="item"
							:class="{ active: item.key == curRate }"
							@click.stop="changeRate(item.key)"
							>{{ item.name }}</view
						>
					</view>
				</view>
			</view>
			<view v-if="custom" v-show="customVis" class="full-coverage" :class="{ 'full-screen': fullscreen }" @click="hideCustom">
				<slot name="custom"></slot>
			</view>
		</template>
		<template v-if="upperRightText">
			<view class="upper-right-text" :class="{ 'full-screen': fullscreen }">
				<view class="text">{{ upperRightText }}</view>
			</view>
		</template>
	</view>
</template>

<script>
import { compareVersion, getSystemInfoSync } from '../../index.js';
export default {
	name: 'wui-controls',
	emits: ['changeDefinition', 'changeRate'],
	props: {
		definition: {
			type: Array,
			default: () => []
		},
		curDefinition: {
			// 当前视频清晰度
			type: String,
			default: ''
		},
		curRate: {
			// 当前视频播放速度
			type: String,
			default: '1.0'
		},
		upperRightText: {
			type: String,
			default: ''
		},
		playbackrate: {
			type: Boolean,
			default: false
		},
		fullscreen: {
			type: Boolean,
			default: false
		},
		custom: {
			type: Boolean,
			default: false
		},
		customName: {
			type: String,
			default: ''
		},
		onlyShowCustomInFullscreen: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			coverViewVis: false,
			definitionVis: false,
			rateVis: false,
			customVis: false,
			SDKVersion: ''
		};
	},
	watch: {
		fullscreen: {
			handler(val, oldVal) {
				if (!val && oldVal) {
					// 取消全屏 隐藏全部遮罩
					this.hideDefinition();
					this.hideRate();
					this.hideCustom();
				}
			}
		}
	},
	computed: {
		hasDefinition() {
			return Array.isArray(this.definition) && this.definition.length;
		},
		definitionName() {
			// 清晰度名称
			if (this.hasDefinition && this.curDefinition) {
				const index = this.definition.findIndex(item => item.key == this.curDefinition);
				if (index != -1) {
					return this.definition[index].name;
				}
			}
			return '';
		},
		rateList() {
			// 支持的倍率有 0.5/0.8/1.0/1.25/1.5。
			// #ifdef MP-WEIXIN
			if (this.SDKVersion && !compareVersion('1.4.0', this.SDKVersion)) {
				// 微信基础库 1.4.0 开始支持
				return [];
			}
			// #endif
			const list = [
				{ key: '0.5', name: '0.5X' },
				{ key: '0.8', name: '0.8X' },
				{ key: '1.0', name: '1.0X' },
				{ key: '1.25', name: '1.25X' },
				{ key: '1.5', name: '1.5X' }
			];
			// #ifdef MP-WEIXIN
			if (this.SDKVersion && compareVersion('2.6.3', this.SDKVersion)) {
				// 微信基础库2.6.3 起支持 2.0 倍速
				list.push({ key: '2.0', name: '2.0X' });
			}
			// #endif
			return list;
		},
		hasRate() {
			return this.playbackrate && Array.isArray(this.rateList) && this.rateList.length;
		},
		rateName() {
			if (!this.hasRate) return '';
			if (this.curRate == '1.0') {
				return '倍速';
			}
			const index = this.rateList.findIndex(item => item.key == this.curRate);
			if (index != -1) {
				return this.rateList[index].name;
			}
			console.warn('没有对应的播放速度');
			return '倍速';
		},
		hasCoverView() {
			return this.hasDefinition || this.hasRate;
		}
	},
	created() {
		const systemInfo = getSystemInfoSync();
		if (systemInfo.SDKVersion) {
			this.SDKVersion = systemInfo.SDKVersion;
		}
	},
	methods: {
		controlstoggle(show) {
			// 父组件调用 显示隐藏 coverView
			if (this.hasCoverView) {
				this.coverViewVis = Boolean(show);
			}
		},
		showDefinition() {
			if (this.hasDefinition) {
				this.definitionVis = true;
			}
		},
		hideDefinition() {
			this.definitionVis = false;
		},
		changeDefinition(key) {
			// 切换清晰度
			this.hideDefinition();
			this.$emit('changeDefinition', key);
		},
		showRate() {
			if (this.hasRate) {
				this.rateVis = true;
			}
		},
		hideRate() {
			this.rateVis = false;
		},
		changeRate(key) {
			// 切换倍速
			this.hideRate();
			this.$emit('changeRate', key);
		},
		showCustom() {
			if (this.custom) {
				this.customVis = true;
			}
		},
		hideCustom() {
			this.customVis = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../style.scss';
.wui-controls {
	color: #ffffff;
	.cover-view {
		position: absolute;
		// top: var(--safe-area-inset-top);
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		.wrap {
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			&.full-screen {
				@include full-screen();
			}
		}
		.text {
			padding: 5rpx 15rpx;
			line-height: 1.4;
			border: 1rpx solid #ffffff;
			border-radius: 10rpx;
		}
		.text + .text {
			margin-top: 20rpx;
		}
	}
	.full-coverage {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 10rpx;
		background-color: rgba(0, 0, 0, 0.6);
		&.full-screen {
			@include full-screen();
		}
		&__content {
			width: 100%;
			height: 100%;
			padding: 20rpx;
			box-sizing: border-box;

			font-size: $font-lg;
			line-height: 1.4;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			background-color: rgba(0, 0, 0, 0.5);
			.title {
				font-weight: bold;
			}
			.list {
				padding-top: 30rpx;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.item {
					width: 160rpx;
					padding: 20rpx 30rpx;
					box-sizing: border-box;
					font-size: $font-lg;
					background-color: rgba(0, 0, 0, 0.3);
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 6rpx;
					margin-top: 10rpx;
					margin-right: 14rpx;
				}
				.item.active {
					color: $main;
					border-bottom: 5rpx solid $main;
					font-weight: 600;
				}
			}
		}
	}
	.upper-right-text {
		position: absolute;
		top: var(--safe-area-inset-top);
		right: 0;
		z-index: -1;
		padding: 20rpx;
		&.full-screen {
			@include full-screen();
		}
		.text {
			line-height: 1;
			background-color: rgba(128, 128, 128, 0.5);
			border-radius: 4rpx;
			padding: 10rpx;
			@include text-cut;
		}
	}
}
</style>
