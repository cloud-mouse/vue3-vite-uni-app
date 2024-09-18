<template>
	<view class="wui-live-player" :style="style_" @click="showControls">
		<!-- 点击视频 显示controls -->
		<live-player
			id="wui-live-player"
			:src="videoUrl"
			:mode="mode"
			:autoplay="autoplay"
			:muted="muted"
			:orientation="orientation"
			object-fit="contain"
			:style="style_"
			@statechange="statechange"
			@fullscreenchange="fullscreenchange"
			@error="error"
		>
			<!-- @netstatus="netstatus" -->
			<view class="load-text">{{ videoLoadText }}</view>
			<view v-show="coverViewVis">
				<view class="controls" :class="{ 'full-screen': fullscreen }">
					<view>
						<template v-if="showPlayBtn">
							<view v-show="playing" class="pause" @click="bindStop">
								<image src="../../static/pause.svg"></image>
							</view>
							<view v-show="!playing" class="play" @click="bindPlay">
								<image src="../../static/play.svg"></image>
							</view>
						</template>
					</view>
					<view>
						<!-- <template v-if="">
							<view></view>
						</template> -->
						<template v-if="showFullScreenBtn">
							<view v-show="fullscreen" class="exit-fullscreen" @click="exitFullScreen">
								<image src="../../static/exit-fullscreen.svg"></image>
							</view>
							<view v-show="!fullscreen" class="fullscreen" @click="requestFullScreen">
								<image src="../../static/fullscreen.svg"></image>
							</view>
						</template>
					</view>
				</view>
			</view>
			<WuiControls
				ref="wuiControls"
				:definition="definition"
				:curDefinition="curDefinition"
				:playbackrate="false"
				:upperRightText="upperRightText"
				:fullscreen="fullscreen"
				:custom="custom"
				:customName="customName"
				:onlyShowCustomInFullscreen="onlyShowCustomInFullscreen"
				@changeDefinition="changeDefinition"
			>
				<template #custom>
					<slot name="custom"></slot>
				</template>
			</WuiControls>
			<!-- live-player 没有倍速修改 -->
		</live-player>

		<view v-if="controlsToggleTitle" v-show="coverViewVis" class="cover-title">
			<text>{{ title }}</text>
		</view>
	</view>
</template>

<script>
import WuiControls from '../wui-controls/wui-controls.vue';
import { debounce } from '../../index.js';
import { onDirectionChange, offDirectionChange } from '../../autoFullScreen.js';
export default {
	name: 'wui-live-player',
	components: {
		WuiControls
	},
	emits: ['changeUrl', 'error'],
	props: {
		src: {
			// 视频播放地址
			type: String,
			default: ''
		},
		mode: {
			// live-player 模式 live(直播), RTC(实时通话, 该模式时延更低)
			type: String,
			default: 'live',
			validator(value) {
				return ['live', 'RTC'].indexOf(value) !== -1;
			}
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
		orientation: {
			// 画面方向
			type: String,
			default: 'vertical',
			validator(value) {
				return ['vertical', 'horizontal'].indexOf(value) !== -1;
			}
		},
		controls: {
			// 是否显示默认播放控件（播放/暂停按钮、全屏）
			type: Boolean,
			default: true
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
		autoFullScreen: {
			type: Boolean,
			default: false
		},
		showPlayBtn: {
			type: Boolean,
			default: false
		},
		showFullScreenBtn: {
			type: Boolean,
			default: false
		},
		style_: {
			type: String,
			default: ''
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
			videoUrl: '',
			curDefinition: this.defaultDefinition,
			videoLoadText: '正在加载请稍等',
			coverViewVis: false,
			ctx: null,
			playing: false,
			fullscreen: false,

			codeMap: {
				2001: '已经连接服务器',
				2002: '已经连接服务器,开始拉流',
				2003: '网络接收到首个视频数据包(IDR)',
				2004: '视频播放开始',
				2005: '视频播放进度',
				2006: '视频播放结束',
				2007: '视频加载中',
				2008: '解码器启动',
				2009: '视频分辨率改变',
				'-2301': '网络断连，且经多次重连抢救无效，更多重试请自行重启播放',
				'-2302': '获取加速拉流地址失败',
				'-2304': 'H265硬件解码器无法启动',
				2101: '当前视频帧解码失败',
				2102: '当前音频帧解码失败',
				2103: '网络断连, 已启动自动重连',
				2104: '服务端网络不稳',
				2105: '当前视频播放出现卡顿',
				2106: '硬解启动失败，采用软解',
				2107: '当前视频帧可能丢帧',
				2108: '当前流硬解第一个I帧失败，SDK自动切软解',
				3001: 'RTMP -DNS解析失败',
				3002: 'RTMP服务器连接失败',
				3003: 'RTMP服务器握手失败',
				3005: 'RTMP 读/写失败'
			}
		};
	},
	watch: {
		src: {
			handler(val) {
				this.init();
			}
		},
		definition: {
			handler(val) {
				this.init();
			}
		}
	},
	computed: {
		hasDefinition() {
			return Array.isArray(this.definition) && this.definition.length;
		}
	},
	mounted() {
		this.init();
		this.showControls();
		if (this.autoFullScreen) {
			onDirectionChange(this.directionChange);
		}
	},
	// #ifndef VUE3
	beforeUnmount() {
		if (this.autoFullScreen) {
			offDirectionChange(this.directionChange);
		}
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		if (this.autoFullScreen) {
			offDirectionChange(this.directionChange);
		}
	},
	// #endif
	methods: {
		init() {
			if (this.hasDefinition) {
				// 清晰度列表 definition 有传, 取清晰度列表的src地址
				if (!this.curDefinition) {
					this.curDefinition = this.defaultDefinition || this.definition[0].key;
				}
				let index = this.definition.findIndex(item => item.key == this.curDefinition);
				if (index == -1) {
					index = 0;
				}
				this.videoUrl = this.definition[index].src;
			} else {
				// 没有 取 this.src
				this.videoUrl = this.src;
			}
			this.$emit('changeUrl', this.videoUrl);
			this.$nextTick(() => {
				this.bindPlay();
			});
		},
		changeDefinition(key) {
			// 切换清晰度
			this.curDefinition = key;
			this.init();
			this.$emit('changeDefinition', key);
		},
		createContext() {
			if (!this.ctx) {
				// 创建并返回 video 上下文 ctx 对象 	id, this
				this.ctx = uni.createLivePlayerContext('wui-live-player', this);
			}
		},
		statechange(event) {
			const detail = event.detail;
			const code = event.detail.code;
			console.log('live-player code:', code, this.codeMap[code], detail);
			switch (code) {
				case 2008: // 解码器启动
				case 2001: // 已经连接服务器
				case 2103: // 网络断连, 已启动自动重连
				case 2004: // 视频播放开始
					this.videoLoadText = '缓存中请稍等';
					break;
				case 2003: // 网络接收到首个视频数据包(IDR)
					this.videoLoadText = '';
					break;
				case -2301: // 网络断连，且经多次重连抢救无效，更多重试请自行重启播放
				case -2304: // H265硬件解码器无法启动
					this.videoLoadText = '视频播放出错';
					this.$emit('error', event);
					break;
				case 2105: // 当前视频播放出现卡顿
					this.videoLoadText = this.codeMap[code] || '';
					// 没有事件通知视频变为不卡顿状态, ∴ 延迟 2s 手动清空页面的提示信息
					this.clearLoadText();
					break;
				default:
					this.videoLoadText = this.codeMap[code] || '';
			}
		},
		clearLoadText: debounce(function () {
			// 延迟 2秒 清空提示信息
			this.videoLoadText = '';
		}, 2 * 1000),
		fullscreenchange(event) {
			// 全屏变化事件
			console.log('live-player fullscreenchange:', event.detail);
			this.fullscreen = event.detail.fullScreen;
		},
		error(event) {
			console.error('live-player error:', event.detail.errMsg);
			this.$emit('error', event);
		},
		// netstatus(event) {
		// 	// 节流 ?
		// 	const detail = event.detail;
		// 	const info = event.detail.info;
		// 	console.log('live-player net:', info, this.netMap[info], detail);
		// },
		bindPlay() {
			return new Promise((resolve, reject) => {
				this.createContext();
				this.ctx.play({
					success: res => {
						console.log('play success', res);
						this.playing = true;
						resolve();
					},
					fail: err => {
						console.log('play fail', err);
						reject();
					}
				});
			});
		},
		bindStop() {
			return new Promise((resolve, reject) => {
				this.createContext();
				this.ctx.stop({
					success: res => {
						console.log('stop success', res);
						this.playing = false;
						resolve();
					},
					fail: err => {
						console.log('stop fail', err);
						reject();
					}
				});
			});
		},
		requestFullScreen(direction = 90) {
			// 进入全屏
			return new Promise((resolve, reject) => {
				if (typeof direction !== 'number') {
					direction = 90; // 可能是事件对象 event
				}
				this.createContext();
				this.ctx.requestFullScreen({
					direction, // 设置全屏时的方向，有效值为 0(正常竖向), 90(屏幕逆时针90度), -90(屏幕顺时针90度)
					success: res => {
						console.log('fullscreen success', res);
						resolve();
					},
					fail: err => {
						console.log('fullscreen fail', err);
						reject();
					}
				});
			});
		},
		exitFullScreen() {
			// 退出全屏
			return new Promise((resolve, reject) => {
				this.createContext();
				this.ctx.exitFullScreen({
					success: res => {
						console.log('exitFullscreen success', res);
						resolve();
					},
					fail: err => {
						console.log('exitFullscreen fail', err);
						reject();
					}
				});
			});
		},
		showControls() {
			if (!this.controls) return;
			if (!this.coverViewVis) {
				this.controlstoggle(true);
			}
			// 视频播放 5s 隐藏 controls
			this.hideControls();
		},
		hideControls: debounce(function () {
			if (this.coverViewVis) {
				if (!this.playing) {
					// 视频暂停 不隐藏 controls
					return;
				}
				this.controlstoggle(false);
			}
		}, 5 * 1000),
		controlstoggle(show) {
			this.coverViewVis = Boolean(show);
			this.$refs['wuiControls'].controlstoggle(show);
		},
		pause() {
			// 父组件调用 暂停视频
			this.bindStop();
		},
		directionChange(direction) {
			// 监听设备方向变化
			console.log('directionChange', direction);
			this.createContext();
			if (direction === 0) {
				// 退出全屏
				this.exitFullScreen();
			} else {
				// 进入全屏
				this.requestFullScreen(direction);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../style.scss';
$width: 40rpx;
.wui-live-player {
	.controls {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 15rpx;
		height: $width * 2;
		background-image: linear-gradient(-1deg, rgba(0, 0, 0, 0.3), transparent);
		display: flex;
		justify-content: space-between;
		align-items: center;
		&.full-screen {
			@include full-screen();
		}
		& > view {
			display: flex;
			align-items: center;
		}
		.play,
		.pause,
		.fullscreen,
		.exit-fullscreen {
			width: $width * 2;
			height: $width;
			text-align: center;
		}
		image {
			width: 100%;
			height: 100%;
		}
	}
	.cover-title {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.2);
		font-size: $font-lg;
		font-weight: bold;
		padding: 10rpx;
	}
}
</style>
