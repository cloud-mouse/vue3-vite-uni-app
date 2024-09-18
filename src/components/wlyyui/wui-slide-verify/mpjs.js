// （手机号：  152 6 7   013  75 6，身份证尾号：1 9 1 9 3 5）
// @ts-nocheck
// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
	data() {
		return {
			transform: '',
			fwidth: 0,
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
		styleChange(left) {
			if (left == 0) {
				this.resetAni = true;
			} else {
				this.resetAni = false;
			}
			this.fwidth = left;
			this.transform = 'translate3d(' + left + 'px,0,0)';
		},
		touchstart(e) {
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.clientX;
		},
		touchmove(e) {
			if (this.isPass) return;
			let touch = e.touches[0] || e.changedTouches[0];
			let pageX = touch.clientX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.totalWidth - this.sliderW;
			left = left >= width ? width : left;
			this.startX = pageX;
			this.lastLeft = left;
			this.styleChange(left);
		},
		touchend(e) {
			if (this.isPass) return;
			let left = this.targetWidth - this.sliderW;
			if (Math.abs(left - this.lastLeft) <= Number(this.range)) {
				// this.styleChange(left)
				this.success();
			} else {
				this.startX = 0;
				this.lastLeft = 0;
				this.styleChange(0);
				this.fail();
			}
		}
	}
};

// #endif

// #ifdef APP-PLUS|| MP-WEIXIN || H5
// eslint-disable-next-line prettier/prettier
export default {};
// #endif
