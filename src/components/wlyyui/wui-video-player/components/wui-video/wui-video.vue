<template>
	<view class="wui-video" :style="style_">
		<video
			:src="videoUrl"
			:poster="poster"
			:autoplay="autoplay"
			:muted="muted"
			:initial-time="initialTime"
			:controls="controls"
			:title="title"
			:objectFit="objectFit"
			:show-mute-btn="showMuteBtn"
			:enable-play-gesture="true"
			id="wui-video"
			:style="style_"
			@play="play"
			@pause="pause"
			@loadedmetadata="loadedmetadata"
			@error="error"
			@waiting="waiting"
			@timeupdate="timeupdate"
			@controlstoggle="controlstoggle"
			@fullscreenchange="fullscreenchange"
			@ended="ended"
		>
			<!-- APP video标签层级问题....看不到... ∴ 没用<cover-view> -->
			<view class="load-text">{{ videoLoadText }}</view>
			<!-- #ifndef MP-ALIPAY -->
			<!-- 钉钉小程序 video 嵌套组件 报错：系统错误正在排查 render层的报错，开发工具的调试器看不到错误日志  -->
			<WuiControls
				ref="wuiControls"
				:definition="definition"
				:curDefinition="curDefinition"
				:playbackrate="playbackrate"
				:curRate="curRate"
				:upperRightText="upperRightText"
				:fullscreen="fullscreen"
				:custom="custom"
				:customName="customName"
				:onlyShowCustomInFullscreen="onlyShowCustomInFullscreen"
				@changeDefinition="changeDefinition"
				@changeRate="changeRate"
			>
				<template #custom>
					<slot name="custom"></slot>
				</template>
			</WuiControls>
			<!-- #endif -->
		</video>

		<view class="cover-title" v-if="controlsToggleTitle" v-show="coverViewVis">
			<text>{{ title }}</text>
		</view>
	</view>
</template>

<script>
import WuiControls from '../wui-controls/wui-controls.vue';
import { onDirectionChange, offDirectionChange } from '../../autoFullScreen.js';
export default {
	name: 'wui-video',
	components: {
		WuiControls
	},
	emits: ['changeUrl', 'error', 'timeupdate', 'ended'],
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
		autoFullScreen: {
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
		},
		objectFit: {
			//当视频大小与 video 容器大小不一致时，视频的表现形式。contain：包含，fill：填充，cover：覆盖
			type: String,
			default: 'contain'
		}
	},
	data() {
		return {
			videoUrl: '',
			curDefinition: this.defaultDefinition,
			curRate: '1.0',
			videoLoadText: '正在加载请稍等',
			coverViewVis: false,
			ctx: null,
			fullscreen: false
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
		},
		changeDefinition(key) {
			// 切换清晰度
			this.curDefinition = key;
			this.init();
			this.$emit('changeDefinition', key);
		},
		changeRate(key) {
			// 切换倍速
			this.createContext();
			const rate = Number(key);
			this.ctx.playbackRate(rate);
			this.curRate = key;
		},
		createContext() {
			if (!this.ctx) {
				// 创建并返回 video 上下文 ctx 对象 	id, this
				this.ctx = uni.createVideoContext('wui-video', this);
			}
		},
		play(event) {
			console.log('play');
		},
		pause(event) {
			console.log('pause');
		},
		pauseVideo() {
			// 父组件调用 暂停视频
			this.createContext();
			this.ctx.pause();
		},
		loadedmetadata(event) {
			console.log('loadedmetadata 视频元数据加载完成', event.detail);
			this.videoLoadText = '';
		},
		error(event) {
			console.log('error 视频播放出错', event);
			this.videoLoadText = '视频播放出错';
			this.$emit('error', event);
		},
		waiting(event) {
			console.log('waiting', event.detail);
			this.videoLoadText = '缓存中请稍等';
		},
		timeupdate(event) {
			// console.log('timeupdate', event.detail);
			this.videoLoadText = '';
			this.$emit('timeupdate', event);
		},
		controlstoggle(event) {
			const show = event.detail.show;
			this.coverViewVis = Boolean(show);
			this.$refs['wuiControls'].controlstoggle(show);
		},
		fullscreenchange(event) {
			// 当视频进入和退出全屏时触发，event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal
			console.log('fullscreenchange:', event.detail);
			this.fullscreen = event.detail.fullScreen && event.detail.direction == 'horizontal';
		},
		directionChange(direction) {
			// 监听设备方向变化
			console.log('--- directionChange --->', direction);
			this.createContext();
			if (direction === 0) {
				// 退出全屏
				this.ctx.exitFullScreen();
			} else {
				// 进入全屏
				this.ctx.requestFullScreen({ direction });
			}
		},
		ended(event) {
			this.$emit('ended', event);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../style.scss';
.wui-video {
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
