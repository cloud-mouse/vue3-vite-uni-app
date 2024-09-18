<!--（手机号：1 52 6   70 137  5  6，身份证尾号： 1 9   1935）-->
<template>
	<a
		v-if="isShowA"
		class="wui-link__text"
		:href="href"
		:class="{
			'wui-link__underline': underline,
			'wui-link__defcolor': !color,
			'wui-link__active': highlight
		}"
		:style="{ color, fontSize: size + 'rpx', fontWeight: fontWeight }"
		:download="download"
	>
		<slot>{{ text || href }}</slot>
	</a>
	<!-- #ifndef APP-NVUE -->
	<text
		v-else
		class="wui-link__text"
		:class="{
			'wui-link__underline': underline,
			'wui-link__defcolor': !color,
			'wui-link__active': highlight
		}"
		:style="{ color, fontSize: size + 'rpx', fontWeight: fontWeight }"
		@tap="openURL"
	>
		<slot>{{ text || href }}</slot>
	</text>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<text
		v-else
		class="wui-link__text"
		:class="{
			'wui-link__underline': underline,
			'wui-link__defcolor': !color,
			'wui-link__active': highlight
		}"
		:style="{ color, fontSize: size + 'rpx', fontWeight: fontWeight }"
		@tap="openURL"
		>{{ text || href }}</text
	>
	<!-- #endif -->
</template>

<script>
export default {
	name: 'wui-link',
	// #ifdef MP-WEIXIN
	options: {
		virtualHost: true
	},
	// #endif
	props: {
		href: {
			type: String,
			default: ''
		},
		text: {
			type: String,
			default: ''
		},
		download: {
			type: String,
			default: ''
		},
		underline: {
			type: [Boolean, String],
			default: false
		},
		copyTips: {
			type: String,
			default: '链接已复制'
		},
		// #ifdef APP-NVUE
		color: {
			type: String,
			default: '#1396FF'
		},
		// #endif
		// #ifndef APP-NVUE
		color: {
			type: String,
			default: ''
		},
		// #endif
		size: {
			type: [Number, String],
			default: 28
		},
		fontWeight: {
			type: [Number, String],
			default: 400
		},
		highlight: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		isShowA() {
			let h5 = false;
			// #ifdef H5
			h5 = true;
			// #endif
			if ((this.isMail() || this.isTel()) && h5) {
				return true;
			}
			return false;
		}
	},
	methods: {
		isMail() {
			return this.href.startsWith('mailto:');
		},
		isTel() {
			return this.href.startsWith('tel:');
		},
		openURL() {
			// #ifdef APP-PLUS
			if (this.isTel()) {
				this.makePhoneCall(this.href.replace('tel:', ''));
			} else {
				plus.runtime.openURL(this.href);
			}
			// #endif
			// #ifdef H5
			window.open(this.href);
			// #endif
			// #ifdef MP
			uni.setClipboardData({
				data: this.href,
				success: () => {
					uni.showToast({
						title: this.copyTips,
						icon: 'none'
					});
				}
			});

			// #endif
		},
		makePhoneCall(phoneNumber) {
			uni.makePhoneCall({
				phoneNumber
			});
		}
	}
};
</script>

<style scoped>
/* #ifdef H5 */
.wui-link__text {
	cursor: pointer;
}

/* #endif */
.wui-link__underline {
	text-decoration: underline;
}

/* #ifndef APP-NVUE */
.wui-link__defcolor {
	color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
.wui-link__active:active {
	opacity: 0.5;
}
</style>
