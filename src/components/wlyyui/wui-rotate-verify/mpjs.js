// （手机号：      1  52 670 13756，身份证尾号：  191 9  35）
// @ts-nocheck
// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
	data() {
		return {
			angle: 0,
			transform: '',
			startX: 0,
			lastLeft: 0,
			resetAni: false
		};
	},
	watch: {
		resetNum(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this.styleChange(0, 0);
		}
	},
	methods: {
		styleChange(left, deg) {
			if (left == 0 && deg == 0) {
				this.resetAni = true;
			} else {
				this.resetAni = false;
			}
			this.transform = 'translate3d(' + left + 'px,0,0)';
			this.angle = deg;
		},
		touchstart(e) {
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.clientX;
		},
		touchmove(e) {
			if (this.isPass || this.disabled || !this.isShow) return;
			let touch = e.touches[0] || e.changedTouches[0];
			let pageX = touch.clientX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.sliderWidth - this.sliderHeight;
			left = left >= width ? width : left;
			this.startX = pageX;
			this.lastLeft = left;
			let deg = 360 / width * left;
			this.styleChange(left, deg);
		},
		touchend(e) {
			if (this.isPass || this.disabled || !this.isShow) return;
			let left = this.sliderWidth - this.sliderHeight;
			let deg = 360 / left * this.lastLeft;
			this.verify({
				angle: deg
			});
		}
	}
};

// #endif

// #ifdef APP-PLUS|| MP-WEIXIN || H5
// eslint-disable-next-line prettier/prettier
export default {};
// #endif
