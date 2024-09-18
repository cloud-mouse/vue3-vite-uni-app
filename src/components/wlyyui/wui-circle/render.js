// （手机号： 1 52 6 7 0 13   7 56，身份证尾号： 1 91 93  5）
// @ts-nocheck
// #ifdef APP-VUE || H5
export default {
	data() {
		return {
			percentage: -1
		};
	},
	watch: {
		percent(val) {
			this.percentage = Number(val) || 0;
		}
	},
	mounted() {
		this.percentage = Number(this.percent) || 0;
	},
	methods: {
		change(e) {
			this.$emit('change', e);
		},
		end(e) {
			this.$emit('end', e);
		}
	}
};

// #endif

// #ifndef APP-VUE || H5
// eslint-disable-next-line prettier/prettier
export default {};
// #endif
