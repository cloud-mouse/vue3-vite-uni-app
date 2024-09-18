<!--（手机号：  15   2  670 13  756，身份证尾号：191 9  3  5）-->
<template>
	<view class="wui-rate__wrap" ref="wui_rate_wrap">
		<view
			class="wui-rate__item"
			:class="{ 'wui-rate__not-allowed': disabled }"
			:style="{ paddingRight: spacing + 'rpx' }"
			v-for="(item, index) in stars"
			:key="index"
			@touchstart.stop="touchstart"
			@touchmove.stop="touchmove"
			@mousedown.stop="mousedown"
			@mousemove.stop="mousemove"
			@mouseup="mouseup"
		>
			<wui-icon
				:disabled="disabled"
				:name="getName(index, intScore, decimalScore)"
				:size="size"
				:color="index < intScore || (index == intScore && decimalScore > 0) ? activeColor : color"
			></wui-icon>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom');
// #endif
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	emits: ['change'],
	name: 'wui-rate',
	// components:{
	// 	wuiIcon
	// },
	props: {
		max: {
			type: [Number, String],
			default: 5
		},
		score: {
			type: [Number, String],
			default: 0
		},
		color: {
			type: String,
			default: '#CCCCCC'
		},
		activeColor: {
			type: String,
			default: '#FFB703'
		},
		activeIcon: {
			type: String,
			default: 'w-star-fill'
		},
		inactiveIcon: {
			type: String,
			default: 'w-star'
		},
		halfIcon: {
			type: String,
			default: 'w-starhalf'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		size: {
			type: [Number, String],
			default: 56
		},
		spacing: {
			type: [Number, String],
			default: 0
		},
		allowHalf: {
			type: Boolean,
			default: false
		},
		halfRate: {
			type: [Number, String],
			default: 0.2
		},
		touchable: {
			type: Boolean,
			default: true
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	watch: {
		max(newValue, oldValue) {
			this.initData(newValue);
		},
		score(newValue, oldValue) {
			this.initRateScore(newValue);
		}
	},
	data() {
		return {
			stars: [],
			pageX: 0,
			intScore: 0,
			decimalScore: 0,
			isPC: false,
			rated: false
		};
	},
	created() {
		this.initData(this.max);
		this.initRateScore(this.score);
	},
	mounted() {
		setTimeout(() => {
			this._getSize();
		}, 100);
		// #ifdef H5
		this.isPC = this.IsPC();
		// #endif
	},
	methods: {
		getName(index, iScore, dScore) {
			let name = this.inactiveIcon;
			if (index < iScore) {
				name = this.activeIcon;
			}
			if (index === iScore && dScore > 0) {
				name = this.halfIcon;
			}
			return name;
		},
		initData(vals) {
			vals = Number(vals);
			if (isNaN(vals)) {
				vals = 5;
			}
			vals = Math.ceil(vals);
			this.stars = Array.from(new Array(vals + 1).keys()).slice(1);
		},
		initRateScore(val) {
			val = Number(val);
			let intVal = parseInt(val);
			let decimalVal = val % 1;
			if (!this.allowHalf) {
				intVal = decimalVal > 0 ? intVal + 1 : intVal;
				decimalVal = 0;
			}
			this.intScore = intVal;
			this.decimalScore = decimalVal;
		},
		// #ifdef H5
		IsPC() {
			let userAgentInfo = navigator.userAgent;
			let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
			let flag = true;
			for (let v = 0; v < Agents.length - 1; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		},
		// #endif
		_getSize() {
			// #ifndef APP-NVUE
			uni
				.createSelectorQuery()
				// #ifndef MP-ALIPAY
				.in(this)
				// #endif
				.select('.wui-rate__wrap')
				.boundingClientRect()
				.exec(ret => {
					if (ret) {
						this.pageX = ret[0].left || 0;
					}
				});
			// #endif
			// #ifdef APP-NVUE
			dom.getComponentRect(this.$refs['wui_rate_wrap'], ret => {
				const size = ret.size;
				if (size) {
					this.pageX = size.left;
				}
			});
			// #endif
		},
		_getRateScore(clientX) {
			const distance = clientX - this.pageX;
			let score = 0;
			if (distance > 0) {
				let width = uni.upx2px(Number(this.size) + Number(this.spacing));
				score = distance / width;
				let decimalScore = score % 1;
				if (!this.allowHalf) {
					decimalScore = decimalScore > 0 ? 1 : 0;
				} else {
					if (decimalScore > Number(this.halfRate)) {
						decimalScore = decimalScore <= 0.5 ? 0.5 : 1;
					} else {
						decimalScore = 0;
					}
				}
				score = parseInt(score) + decimalScore;
				let max = Number(this.max);
				score = score > max ? max : score;
			}
			this.initRateScore(score);
			this.$emit('change', {
				score: score,
				param: this.param
			});
		},
		touchstart(e) {
			// #ifdef H5
			if (this.isPC) return;
			// #endif
			if (this.disabled) return;
			const { clientX, screenX } = e.changedTouches[0];
			// Nvue下为 screenX，其他平台为clientX
			this._getRateScore(clientX || screenX);
		},
		touchmove(e) {
			// #ifdef H5
			if (this.isPC) return;
			// #endif
			if (this.disabled || !this.touchable) return;
			const { clientX, screenX } = e.changedTouches[0];
			this._getRateScore(clientX || screenX);
		},
		mousedown(e) {
			// #ifdef H5
			if (!this.isPC || this.disabled) return;
			const { clientX } = e;
			this._getRateScore(clientX);
			this.rated = true;
			// #endif
		},
		mousemove(e) {
			// #ifdef H5
			if (!this.isPC || !this.rated || this.disabled || !this.touchable) return;
			const { clientX } = e;
			this._getRateScore(clientX);
			// #endif
		},
		mouseup(e) {
			// #ifdef H5
			if (!this.isPC || this.disabled || !this.touchable) return;
			this.rated = false;
			// #endif
		}
	}
};
</script>

<style scoped>
.wui-rate__wrap {
	/* #ifndef APP-NVUE */
	display: inline-flex;
	/* #endif */
	line-height: 1;
	font-size: 0;
	flex-direction: row;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.wui-rate__not-allowed {
	/* #ifdef H5 */
	cursor: not-allowed !important;
	/* #endif */
}
</style>
