<template>
	<view class="wui-video-player" :style="style">
		<template v-if="tipVis">
			<view class="bg-img bg-mask" :style="{ backgroundImage: 'url(' + poster + ')' }">
				<view class="">
					<text>正在使用非WIFI网络，播放将产生流量费用</text>
					<button class="btn" @click="trafficPlayVideo">流量播放</button>
				</view>
			</view>
		</template>
		<template v-else-if="loading">
			<view class="bg-img bg-mask" :style="{ backgroundImage: 'url(' + poster + ')' }">
				<view class="">
					<view class="loading"></view>
					<text>加载中...</text>
				</view>
			</view>
		</template>
		<template v-else>
			<view v-show="videoVis" :style="style">
				<template v-if="showComp === 'video'">
					<WuiVideo
						ref="wuiVideo"
						:src="src"
						:poster="poster"
						:autoplay="autoplay"
						:muted="muted"
						:initial-time="initialTime"
						:controls="controls"
						:title="title"
						:controls-toggle-title="controlsToggleTitle"
						:upper-right-text="upperRightText"
						:definition="definition"
						:default-definition="defaultDefinition"
						:show-mute-btn="showMuteBtn"
						:playbackrate="playbackrate"
						:auto-full-screen="isAutoFullScreen"
						:style_="style"
						:custom="custom"
						:customName="customName"
						:onlyShowCustomInFullscreen="onlyShowCustomInFullscreen"
						@error="error"
						@ended="ended"
						@timeupdate="timeupdate"
						@changeUrl="changeUrl"
						@changeDefinition="changeDefinition"
					>
						<template #custom>
							<slot name="custom"></slot>
						</template>
					</WuiVideo>
				</template>
				<template v-else-if="showComp === 'live-player'">
					<WuiLivePlayer
						ref="wuiLivePlayer"
						:src="src"
						:mode="mode"
						:autoplay="autoplay"
						:muted="muted"
						:orientation="orientation"
						:controls="controls"
						:title="title"
						:controls-toggle-title="controlsToggleTitle"
						:upper-right-text="upperRightText"
						:definition="definition"
						:default-definition="defaultDefinition"
						:auto-full-screen="isAutoFullScreen"
						:show-play-btn="showPlayBtn"
						:show-full-screen-btn="showFullScreenBtn"
						:style_="style"
						:custom="custom"
						:customName="customName"
						:onlyShowCustomInFullscreen="onlyShowCustomInFullscreen"
						@error="error"
						@changeUrl="changeUrl"
						@changeDefinition="changeDefinition"
					>
						<template #custom>
							<slot name="custom"></slot>
						</template>
					</WuiLivePlayer>
				</template>
			</view>
			<view v-show="!videoVis" :style="style">
				<image :src="poster" mode="aspectFill" :style="style"></image>
			</view>
		</template>
	</view>
</template>

<script>
import WuiVideo from './components/wui-video/wui-video.vue';
import WuiLivePlayer from './components/wui-live-player/wui-live-player.vue';
import { compareVersion, getExt, getSystemInfoSync } from './index.js';
export default {
	name: 'wui-video-player',
	components: {
		WuiVideo,
		WuiLivePlayer
	},
	emits: ['trafficPlayVideo', 'error', 'changeDefinition', 'ended', 'timeupdate'],
	props: {
		src: {
			// 视频播放地址
			type: String,
			default: ''
		},
		poster: {
			// 封面图片地址
			type: String,
			default: ''
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		muted: {
			// 是否静音
			type: Boolean,
			default: false
		},
		initialTime: {
			type: Number
		},
		title: {
			type: String,
			default: ''
		},
		controlsToggleTitle: {
			type: Boolean,
			default: false
		},
		upperRightText: {
			// 右上角文本
			type: String,
			default: ''
		},
		definition: {
			// 清晰度视频地址列表
			// [{ key: 'sd', name: '标清', src: 'http://xxx' }]
			type: Array,
			default: () => []
		},
		defaultDefinition: {
			// 默认清晰度
			type: String,
			default: 'sd'
		},
		width: {
			type: String,
			default: ''
		},
		borderRadius: {
			type: String,
			default: '0rpx'
		},
		height: {
			type: String,
			default: ''
		},
		hideVideo: {
			// 是否隐藏视频组件
			type: Boolean,
			default: false
		},
		delay: {
			// 隐藏后显示视频组件的时延 默认500ms
			type: Number,
			default: 500
		},
		tipNotWifi: {
			// 网络类型非 wifi, 是否提示
			type: Boolean,
			default: false
		},
		controls: {
			type: Boolean,
			default: true
		},
		showMuteBtn: {
			type: Boolean,
			default: false
		},
		playbackrate: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		autoFullScreen: {
			type: Boolean,
			default: false
		},
		useLivePlayer: {
			type: Boolean,
			default: false
		},
		autoSwitchComp: {
			// 使用live-play 视频格式不支持，是否自动切换video
			type: Boolean,
			default: false
		},
		mode: {
			// live-player 模式 live(直播), RTC(实时通话, 该模式时延更低)
			type: String,
			default: 'live',
			validator(value) {
				return ['live', 'RTC'].indexOf(value) !== -1;
			}
		},
		orientation: {
			// 画面方向
			type: String,
			default: 'horizontal',
			validator(value) {
				return ['vertical', 'horizontal'].indexOf(value) !== -1;
			}
		},
		showPlayBtn: {
			type: Boolean,
			default: false
		},
		showFullScreenBtn: {
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
			videoVis: true,
			isWifi: false,
			tipVis: false,
			SDKVersion: '',
			videoUrl: ''
		};
	},
	watch: {
		hideVideo: {
			handler(val, oldVal) {
				// #ifdef MP-WEIXIN
				if (this.showComp === 'video') {
					if (this.SDKVersion && compareVersion('2.4.0', this.SDKVersion)) {
						// 微信小程序 <video> v2.4.0 起支持同层渲染 不需隐藏视频
						this.videoVis = true;
						return;
					}
				} else if (this.showComp === 'live-player') {
					if (this.SDKVersion && compareVersion('2.9.1', this.SDKVersion)) {
						// 微信小程序 <live-player> v2.9.1 起支持同层渲染 不需隐藏视频
						this.videoVis = true;
						return;
					}
				}
				// #endif
				if (val) {
					this.videoVis = false;
				} else if (!val && oldVal) {
					// 弹窗收起
					setTimeout(() => {
						this.videoVis = true;
					}, this.delay);
				} else {
					this.videoVis = true;
				}
			},
			immediate: true
		}
	},
	computed: {
		style() {
			if (this.width && this.height) {
				return `width: ${this.width}; height: ${this.height};borderRadius: ${this.borderRadius};`;
			}
			return 'width: 100%; height: 100%;';
		},
		showComp() {
			if (!this.useLivePlayer) {
				return 'video';
			}
			const ext = getExt(this.videoUrl); // 视频格式
			// #ifdef MP-BAIDU
			if (this.autoSwitchComp) {
				// 百度小程序支持 m3u8 格式
				const videoFormat = ['m3u8'];
				if (videoFormat.indexOf(ext) !== -1) {
					return 'live-player';
				}
				return 'video';
			} else {
				return 'live-player';
			}
			// #endif
			// #ifdef MP-QQ
			// QQ小程序
			return 'live-player';
			// #endif
			// #ifdef MP-WEIXIN
			if (this.SDKVersion && compareVersion('1.7.0', this.SDKVersion)) {
				// 微信小程序 基础库 1.7.0 起支持 live-player
				if (this.autoSwitchComp) {
					// 微信小程序支持 flv, rtmp 格式
					const videoFormat = ['flv', 'rtmp'];
					if (videoFormat.indexOf(ext) !== -1) {
						return 'live-player';
					}
					return 'video';
				} else {
					return 'live-player';
				}
			}
			// #endif
			return 'video';
		},
		isAutoFullScreen() {
			if (!this.autoFullScreen) return false;
			// #ifdef MP-WEIXIN
			if (this.SDKVersion && compareVersion('2.9.3', this.SDKVersion)) {
				// 基础库 2.9.3 开始支持 wx.offAccelerometerChange
				return true;
			}
			// #endif
			// #ifdef APP || H5
			return true;
			// #endif
			return false;
		}
	},
	async created() {
		this.isWifi = await this.networkTypeIsWifi();
		if (this.tipNotWifi && !this.isWifi) {
			this.tipVis = true;
		}

		const systemInfo = getSystemInfoSync();
		if (systemInfo.SDKVersion) {
			this.SDKVersion = systemInfo.SDKVersion;
		}
	},
	methods: {
		networkTypeIsWifi() {
			// uni.getNetworkType 的封装 获取网络类型
			return new Promise((resolve, reject) => {
				uni.getNetworkType({
					success: res => {
						resolve(res.networkType === 'wifi'); // 网络状态是否 WiFi
					},
					fail: err => {
						console.log(err);
						reject();
					}
				});
			});
		},
		trafficPlayVideo() {
			this.tipVis = false;
			uni.showToast({
				title: '您当前正在使用移动数据, 记得注意流量变化',
				icon: 'none'
			});
			this.$emit('trafficPlayVideo');
		},
		pauseVideo() {
			// 父组件调用 暂停视频
			if (this.showComp === 'video') {
				this.$refs['wuiVideo'].pauseVideo();
			} else if (this.showComp === 'live-player') {
				this.$refs['wuiLivePlayer'].pause();
			}
		},
		error(event) {
			this.$emit('error', event);
		},
		ended(event) {
			this.$emit('ended', event);
		},
		timeupdate(event) {
			this.$emit('timeupdate', event);
		},
		changeUrl(url) {
			// wui-video / wui-live-player 修改视频播放地址
			// 判断视频格式 是否修改播放视频的组件
			this.videoUrl = url;
		},
		changeDefinition(key) {
			// 切换清晰度
			this.$emit('changeDefinition', key);
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style.scss';
.wui-video-player {
	color: #ffffff;
	position: relative;
	.bg-img.bg-mask {
		height: 100%;
		& > view {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text {
				text-align: center;
				margin: 20rpx 40rpx;
			}
			.loading {
				width: 50rpx;
				height: 50rpx;
				border: 2rpx solid #ffffff;
				border-radius: 50% 50% 0 0;
				border-left: none;
				border-bottom: none;
				border-right: none;
				animation: spin 2s infinite linear;
			}
			@keyframes spin {
				0% {
					transform: rotate(0);
				}
				100% {
					transform: rotate(359deg);
				}
			}
		}
	}
}
</style>
