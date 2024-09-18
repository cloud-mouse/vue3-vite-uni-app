<!--（手机号：15 267   0 1 3 7   56，身份证尾号：191    93 5）-->
<template>
	<view class="wui-digital__roller-wrap">
		<view class="wui-digital__roller" v-for="(items, index) in columns" :key="index" :style="getStyles">
			<!-- #ifndef APP-NVUE -->
			<view
				class="wui-digital__roller-column"
				:style="{
					transform: `translate3d(0, -${(keys[index] || 0) * rollHeight}px, 0)`,
					transitionDuration: `${duration}s`
				}"
			>
				<text
					class="wui-digital__roller-item"
					:class="{ 'wui-digital__roller-color': !color }"
					v-for="(item, idx) in items"
					:key="idx"
					:style="{
						color: color,
						fontSize: size + 'rpx',
						lineHeight: size + 'rpx',
						fontWeight: fontWeight,
						height: rollHeight + 'px'
					}"
					>{{ item }}</text
				>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<view
				class="wui-digital__roller-column"
				:style="{
					transform: `translateY(-${(keys[index] || 0) * rollHeight}px)`
				}"
			>
				<text
					class="wui-digital__roller-item"
					v-for="(item, idx) in items"
					:key="idx"
					:style="{
						color: color,
						fontSize: size + 'rpx',
						lineHeight: size + 'rpx',
						fontWeight: fontWeight,
						height: rollHeight + 'px'
					}"
					>{{ item }}</text
				>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
export default {
	name: 'wui-digital-roller',
	props: {
		value: {
			type: [Number, String],
			default: ''
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
			default: 32
		},
		fontWeight: {
			type: [Number, String],
			default: 400
		},
		width: {
			type: [Number, String],
			default: 0
		},
		height: {
			type: [Number, String],
			default: 32
		},
		duration: {
			type: [Number, String],
			default: 1.2
		}
	},
	computed: {
		getStyles() {
			let styles = `height:${this.rollHeight}px;`;
			if (this.width && this.width != 0) {
				styles += `width:${this.width}rpx;`;
			}
			return styles;
		}
	},
	watch: {
		value(val) {
			this.initColumn(this.value);
		},
		height(val) {
			this.initHeight(val);
		}
	},
	data() {
		return {
			columns: [],
			keys: [],
			rollHeight: 0,
			rows: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
		};
	},
	created() {
		this.initHeight(this.height);
		this.initColumn(this.value);
	},
	methods: {
		initHeight(val) {
			let height = Math.floor(uni.upx2px(val || 0));
			height = height % 2 === 0 ? height : height + 1;
			this.rollHeight = height;
		},
		initColumn(val) {
			val = val + '';
			let vals = val.split('');
			let digit = vals.length,
				arr = [];
			for (let i = 0; i < digit; i++) {
				if (~this.rows.indexOf(vals[i])) {
					arr.push(this.rows);
				} else {
					arr.push([vals[i]]);
				}
			}
			this.columns = arr;
			this.startRoll(vals);
		},
		startRoll(vals) {
			let lengths = this.columns.length,
				indexs = [];

			while (vals.length) {
				let num = vals.pop();
				if (~this.rows.indexOf(num)) {
					indexs.unshift(Number(num));
				} else {
					indexs.unshift(0);
				}
			}
			while (indexs.length < lengths) {
				indexs.unshift(0);
			}
			this.keys = indexs;
		}
	}
};
</script>

<style scoped>
.wui-digital__roller-wrap {
	/* #ifndef APP-NVUE */
	display: inline-flex;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.wui-digital__roller {
	overflow: hidden;
}

.wui-digital__roller-column {
	/* #ifndef APP-NVUE */
	display: flex;
	transform: translate3d(0, 0, 0);
	/* #endif */
	/* #ifdef APP-NVUE */
	transform: translateY(0);
	/* #endif */
	align-items: center;
	justify-content: center;
	flex-direction: column;
	transition-property: transform;
	/* #ifndef APP-NVUE */
	transition-timing-function: cubic-bezier(0, 1, 0, 1);
	/* #endif */
	/* #ifdef APP-NVUE */
	transition-timing-function: ease;
	transition-duration: 0.8s;
	/* #endif */
}

.wui-digital__roller-item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	text-align: center;
}

/* #ifndef APP-NVUE */
.wui-digital__roller-color {
	color: var(--wui-color-primary, #1396ff) !important;
}

/* #endif */
</style>
