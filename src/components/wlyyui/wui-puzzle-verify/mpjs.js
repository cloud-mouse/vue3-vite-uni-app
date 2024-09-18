// （手机号： 1    5 267013  7  56，身份证尾号：1 9  193  5）
// @ts-nocheck
// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
	data() {
		return {
			transform: '',
			transformSlot: '',
			startX: 0,
			lastLeft: 0,
			resetAni: false
		};
	},
	watch: {
		resetNum(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this.styleChange(0);
		}
	},
	methods: {
		getSlipDistance(left) {
			let width = this.width - this.x - 44;
			let distance = left / (this.width - (this.sliderH * 2)) * width;
			return distance > width ? width : distance;
		},
		styleChange(left) {
			if (left == 0) {
				this.resetAni = true;
			} else {
				this.resetAni = false;
			}
			let slotLeft = this.getSlipDistance(left);
			this.transformSlot = 'translate3d(' + slotLeft + 'px,0,0)';
			this.transform = 'translate3d(' + left + 'px,0,0)';
		},
		touchstart(e) {
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.clientX;
		},
		touchmove(e) {
			if (this.isPass || this.disabled || !this.cutSrc || !this.isShow) return;
			let touch = e.touches[0] || e.changedTouches[0];
			let pageX = touch.clientX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.width - (this.sliderH * 2);
			left = left >= width ? width : left;
			this.startX = pageX;
			this.lastLeft = left;
			this.styleChange(left);
		},
		touchend(e) {
			if (this.isPass || this.disabled || !this.cutSrc || !this.isShow) return;
			//前端验证
			let slotLeft = this.getSlipDistance(this.lastLeft);
			//后端验证
			this.verify({
				slip: slotLeft
			});
		}
	}
};

// #endif

// #ifdef APP-PLUS|| MP-WEIXIN || H5
// eslint-disable-next-line prettier/prettier
export default {};
// #endif
