<!--（手机号： 1526   70  1 3 7  56，身份证尾号：1 9  1  935）-->
<template>
	<view
		class="wui-notice__bar"
		:style="{
			background: background,
			paddingTop: padding[0] || 0,
			paddingRight: padding[1] || 0,
			paddingBottom: padding[2] || padding[0] || 0,
			paddingLeft: padding[3] || padding[1] || 0,
			height: scrollable || single ? height + 'rpx' : 'auto'
		}"
		@click="onClick"
	>
		<view class="wui-notice__shrink" @tap.stop="leftClick">
			<slot></slot>
		</view>
		<view
			class="wui-notice__wrap"
			:class="{ 'wui-notice__wrap-scroll': scrollable }"
			:style="{ height: scrollable && !isNvue ? size + 'rpx' : 'auto' }"
			ref="wui_notice_box"
		>
			<view
				:id="elId_box"
				:class="{
					'wui-notice__content': scrollable,
					'wui-notice__content-single': !scrollable && single
				}"
			>
				<text
					ref="animationEle"
					class="wui-notice__text"
					:id="elId"
					:style="{
						color: color,
						fontSize: size + 'rpx',
						lineHeight: scrollable && !isNvue ? size + 'rpx' : 'normal',
						fontWeight: bold ? 'bold' : 'normal',
						width: wrapWidth + 'px',
						animationDuration: animationDuration,
						'-webkit-animationDuration': animationDuration,
						animationPlayState: webviewHide ? 'paused' : animationPlayState,
						'-webkit-animationPlayState': webviewHide ? 'paused' : animationPlayState,
						animationDelay: animationDelay,
						'-webkit-animationDelay': animationDelay
					}"
					:class="{
						'wui-notice__single': !scrollable && single,
						'wui-notice__scrollable': scrollable,
						'wui-notice__text-color': !color && !isNvue
					}"
					>{{ content }}
				</text>
			</view>
		</view>
		<view class="wui-notice__shrink" @tap.stop="rightClick">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
const animation = weex.requireModule('animation');
// #endif
export default {
	name: 'wui-notice-bar',
	emits: ['click', 'leftClick', 'rightClick'],
	props: {
		height: {
			type: [Number, String],
			default: 72
		},
		content: {
			type: String,
			default: ''
		},
		size: {
			type: [Number, String],
			default: 28
		},
		color: {
			type: String,
			// #ifdef APP-NVUE
			default: '#FF2B2B',
			// #endif
			// #ifndef APP-NVUE
			default: ''
			// #endif
		},
		bold: {
			type: Boolean,
			default: false
		},
		background: {
			type: String,
			default: 'rgba(255, 43, 43, .05)'
		},
		padding: {
			type: Array,
			default() {
				return [];
			}
		},
		single: {
			type: Boolean,
			default: false
		},
		scrollable: {
			type: Boolean,
			default: false
		},
		speed: {
			type: [Number, String],
			default: 100
		},
		activeMode: {
			type: String,
			default: 'backwards'
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		const elId = `wui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		const elId_box = `wui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		let isNvue = false;
		// #ifdef APP-NVUE
		isNvue = true;
		// #endif
		return {
			elId: elId,
			elId_box: elId_box,
			noticeWidth: 0,
			boxWidth: 0,
			wrapWidth: '',
			webviewHide: false,
			// #ifdef APP-NVUE
			stopAnimation: false,
			// #endif
			isNvue: isNvue,
			animationDuration: 'none',
			animationPlayState: 'paused',
			animationDelay: '0s'
		};
	},
	mounted() {
		// #ifdef APP-PLUS
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		let currentWebview = page.$getAppWebview();
		currentWebview.addEventListener('hide', () => {
			this.webviewHide = true;
		});
		currentWebview.addEventListener('show', () => {
			this.webviewHide = false;
		});
		// #endif
		this.$nextTick(() => {
			this.initAnimation();
		});
	},
	watch: {
		scrollable(val) {
			if (val) {
				this.$nextTick(() => {
					this.initAnimation();
				});
			}
		},
		content(val) {
			this.$nextTick(() => {
				this.initAnimation();
			});
		}
	},
	//APP-NVUE 暂不支持vue3
	// #ifdef APP-NVUE
	// #ifndef VUE3
	beforeUnmount() {
		this.stopAnimation = true;
	},
	// #endif
	// #ifdef VUE3
	beforeUnmount() {
		this.stopAnimation = true;
	},
	// #endif
	// #endif
	methods: {
		initAnimation() {
			if (!this.content || this.content == '') return;
			if (this.scrollable) {
				// #ifndef APP-NVUE
				let query = [],
					boxWidth = 0,
					noticeWidth = 0;
				let noticeQuery = new Promise((resolve, reject) => {
					const element = uni.createSelectorQuery();
					element
						// #ifndef MP-ALIPAY
						.in(this)
						// #endif
						.select(`#${this.elId}`)
						.boundingClientRect()
						.exec(ret => {
							this.noticeWidth = ret[0].width;
							resolve();
						});
				});
				if (this.activeMode === 'forwards') {
					let boxQuery = new Promise((resolve, reject) => {
						const element = uni.createSelectorQuery();
						element
							// #ifndef MP-ALIPAY
							.in(this)
							// #endif
							.select(`#${this.elId_box}`)
							.boundingClientRect()
							.exec(ret => {
								this.boxWidth = ret[0].width;
								resolve();
							});
					});
					query.push(boxQuery);
				}
				query.push(noticeQuery);
				Promise.all(query).then(() => {
					this.animationDuration = `${this.noticeWidth / Number(this.speed)}s`;
					if (this.activeMode === 'forwards') {
						this.animationDelay = `-${this.boxWidth / Number(this.speed)}s`;
					}
					setTimeout(() => {
						this.animationPlayState = 'running';
					}, 1000);
				});
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['animationEle'], res => {
					let winWidth = uni.getSystemInfoSync().windowWidth;
					this.noticeWidth = res.size.width;
					animation.transition(
						this.$refs['animationEle'],
						{
							styles: {
								transform: this.activeMode === 'backwards' ? `translateX(0)` : `translateX(-${winWidth}px)`
							},
							duration: 0,
							timingFunction: 'linear',
							delay: 0
						},
						() => {
							if (!this.stopAnimation) {
								animation.transition(
									this.$refs['animationEle'],
									{
										styles: {
											transform: `translateX(-${this.noticeWidth}px)`
										},
										timingFunction: 'linear',
										duration: ((this.noticeWidth - winWidth) / Number(this.speed)) * 1000,
										delay: 1000
									},
									() => {
										if (!this.stopAnimation) {
											this.loopAnimation();
										}
									}
								);
							}
						}
					);
				});
				// #endif
			}
			// #ifdef APP-NVUE
			if (!this.scrollable && this.single) {
				dom.getComponentRect(this.$refs['wui_notice_box'], res => {
					this.wrapWidth = res.size.width;
				});
			}
			// #endif
		},
		loopAnimation() {
			// #ifdef APP-NVUE
			animation.transition(
				this.$refs['animationEle'],
				{
					styles: {
						transform: `translateX(0)`
					},
					duration: 0
				},
				() => {
					if (!this.stopAnimation) {
						animation.transition(
							this.$refs['animationEle'],
							{
								styles: {
									transform: `translateX(-${this.noticeWidth}px)`
								},
								duration: (this.noticeWidth / Number(this.speed)) * 1000,
								timingFunction: 'linear',
								delay: 0
							},
							() => {
								if (!this.stopAnimation) {
									this.loopAnimation();
								}
							}
						);
					}
				}
			);
			// #endif
		},
		onClick() {
			this.$emit('click', {
				param: this.param
			});
		},
		leftClick() {
			this.$emit('leftClick', {
				param: this.param
			});
		},
		rightClick() {
			this.$emit('rightClick', {
				param: this.param
			});
		}
	}
};
</script>

<style scoped>
.wui-notice__bar {
	/* #ifndef APP-NVUE */
	display: flex;
	width: 100%;
	box-sizing: border-box;
	/* #endif */
	flex-direction: row;
	align-items: center;
}

.wui-notice__shrink {
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	/* #endif */

	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-notice__wrap {
	flex: 1;
	flex-direction: column;
	overflow: hidden;
}

.wui-notice__wrap-scroll {
	flex-direction: row;
}

/* #ifndef APP-NVUE */
.wui-notice__wrap-scroll {
	position: relative;
}

/* #endif */

.wui-notice__content {
	/* #ifdef APP-NVUE */
	flex: 0;
	/* #endif */
	/* #ifndef APP-NVUE */
	flex: 1;
	display: block;
	overflow: hidden;
	/* #endif */
}

.wui-notice__text {
	/* #ifndef APP-NVUE */
	word-break: break-all;
	/* #endif */
}

.wui-notice__content-single {
	/* #ifndef APP-NVUE */
	display: flex;
	flex: none;
	width: 100%;
	justify-content: center;
	/* #endif */
}

.wui-notice__single {
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
	/* #ifndef APP-NVUE */
	display: block;
	width: 100%;
	white-space: nowrap;
	/* #endif */
	flex-direction: row;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wui-notice__scrollable {
	/* #ifdef APP-NVUE */
	lines: 1;
	padding-left: 750rpx;
	/* #endif */
	/* #ifndef APP-NVUE */
	position: absolute;
	display: block;
	white-space: nowrap;
	padding-left: 101%;
	animation: notice_ani 10s 0s linear infinite both;
	animation-play-state: paused;
	-webkit-backface-visibility: hidden;
	-webkit-perspective: 1000;
	/* #endif */
}

/* #ifndef APP-NVUE */
@keyframes notice_ani {
	100% {
		transform: translate3d(-100%, 0, 0);
	}
}

.wui-notice__text-color {
	color: var(--wui-color-danger, #ff2b2b) !important;
}

/* #endif */
</style>
