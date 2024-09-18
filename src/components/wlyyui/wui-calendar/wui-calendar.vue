<!--（手机号： 15 2  67  01 3 7 5 6，身份证尾号：1 91   9 35）-->
<template>
	<view class="wui-calendar__wrap" :style="{ width: dateWidth, background: background }">
		<view class="wui-calendar__header">
			<view class="wui-calendar__icon-left" :class="['wui-calendar__pl']" @tap.stop="changeYear(-1)">
				<wui-icon :name="name" :color="arrowColor" :size="arrowSize"></wui-icon>
			</view>
			<view class="wui-calendar__icon-left" :class="['wui-calendar__pl']" @tap.stop="changeMonth(-1)" v-if="!isMultiple">
				<wui-icon :name="name" :color="arrowColor" :size="arrowSize"></wui-icon>
			</view>
			<text
				class="wui-calendar__title"
				:style="{
					width: yearsWidth + 'rpx',
					fontSize: yearsSize + 'rpx',
					lineHeight: yearsSize + 'rpx',
					color: yearsColor
				}"
				>{{ title }}</text
			>
			<view class="wui-calendar__pl" @tap.stop="changeMonth(1)" v-if="!isMultiple">
				<wui-icon :name="name" :color="arrowColor" :size="arrowSize"></wui-icon>
			</view>
			<view class="wui-calendar__pl" @tap.stop="changeYear(1)">
				<wui-icon :name="name" :color="arrowColor" :size="arrowSize"></wui-icon>
			</view>
		</view>
		<view class="wui-calendar__date-header" :style="{ borderBottomColor: lineColor }">
			<text
				class="wui-calendar__date"
				:style="{ color: titleColor, width: itemWidth }"
				v-for="(item, index) in header"
				:key="index"
				>{{ item }}</text
			>
			<!-- #ifndef APP-NVUE -->
			<view class="wui-calendar__border" :style="{ background: lineColor }"></view>
			<!-- #endif -->
		</view>
		<swiper
			:indicator-dots="false"
			:autoplay="false"
			:current="defCurrent"
			:duration="300"
			:vertical="vertical"
			@change="swiperChange"
			class="wui-calendar__swiper"
			v-if="isMultiple"
		>
			<swiper-item v-for="(item, index) in monthArr" :key="item.key">
				<view class="wui-calendar__date-wrap">
					<view
						class="wui-calendar__date"
						:style="{ width: itemWidth }"
						:class="['wui-calendar__dh']"
						v-for="(week, i) in item.weekdayArr"
						:key="week"
					></view>
					<!--vue3中text嵌套text会出现警告和部分错误信息-->
					<view
						class="wui-calendar__date"
						:class="{
							'wui-calendar__dh': true,
							'wui-calendar__diaabled': _isDisAbled(index, idx),
							'wui-calendar__left-radius': _isRadius(index, idx, true),
							'wui-calendar__right-radius': _isRadius(index, idx)
						}"
						v-for="(sub, idx) in item.daysArr"
						:key="idx"
						@tap.stop="dateClick(index, sub)"
						:style="{
							background: getBackground(index, idx, values),
							width: itemWidth
						}"
					>
						<text class="wui-calendar__date-val" :style="{ color: getTextColor(index, idx, values)?.color }">{{ sub }}</text>
						<text
							class="wui-calendar__date-lunar"
							v-if="showLunar && language !== 'en'"
							:style="{ color: getTextColor(index, idx, values)?.color }"
							>{{ getTextColor(index, idx, values)?.text }}</text
						>
						<text
							class="wui-calendar__date-descr"
							v-if="!showLunar || language === 'en'"
							:style="{ color: getTextColor(index, idx, values)?.color }"
							>{{ getTextColor(index, idx)?.text }}</text
						>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="wui-calendar__swiper" v-else>
			<view class="wui-calendar__date-wrap">
				<view
					class="wui-calendar__date"
					:style="{ width: itemWidth }"
					:class="['wui-calendar__dh']"
					v-for="week in singleMonth.weekdayArr"
					:key="week"
				></view>
				<!--vue3中text嵌套text会出现警告和部分错误信息-->
				<view
					class="wui-calendar__date"
					:class="{
						'wui-calendar__dh': true,
						'wui-calendar__diaabled': _isDisAbled(month - 1, idx),
						'wui-calendar__left-radius': _isRadius(month - 1, idx, true),
						'wui-calendar__right-radius': _isRadius(month - 1, idx)
					}"
					v-for="(sub, idx) in singleMonth.daysArr"
					:key="idx"
					@tap.stop="dateClick(month - 1, sub)"
					:style="{
						background: getBackground(month - 1, idx, values),
						width: itemWidth
					}"
				>
					<text class="wui-calendar__date-val" :style="{ color: getTextColor(month - 1, idx, values)?.color }">{{ sub }}</text>
					<text
						class="wui-calendar__date-lunar"
						v-if="showLunar && language !== 'en'"
						:style="{ color: getTextColor(month - 1, idx, values).color }"
						>{{ getTextColor(month - 1, idx, values)?.text }}</text
					>
					<text
						class="wui-calendar__date-descr"
						v-if="!showLunar || language === 'en'"
						:style="{ color: getTextColor(month - 1, idx, values)?.color }"
						>{{ getTextColor(month - 1, idx, values)?.text }}</text
					>
				</view>
			</view>
		</view>
		<view class="wui-calendar__btn-wrap" v-if="showBtn">
			<view
				class="wui-calendar__btn"
				:class="{
					'wui-calendar__btn-color': !btnBackground,
					'wui-calendar__diaabled': btnDisabled
				}"
				:style="{ background: btnBackground }"
			>
				<text
					class="wui-calendar__btn"
					:class="{
						'wui-calendar__btn-text': true,
						'wui-calendar__btn-active': !btnDisabled
					}"
					:style="{ color: btnColor }"
					@tap.stop="handleClick"
					>{{ btnText }}</text
				>
			</view>
		</view>
	</view>
</template>

<script>
import lunar from './index.js';
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	name: 'wui-calendar',
	emits: ['change'],
	// components: {
	// 	wuiIcon
	// },
	props: {
		type: {
			type: [Number, String],
			default: 1
		},
		value: {
			type: [Array, String],
			default() {
				return [];
			}
		},
		minDate: {
			type: String,
			default: '2010-01-01'
		},
		maxDate: {
			type: String,
			default: '2030-12-31'
		},
		showLunar: {
			type: Boolean,
			default: false
		},
		language: {
			type: String,
			default: 'cn'
		},
		isMultiple: {
			type: Boolean,
			default: true
		},
		vertical: {
			type: Boolean,
			default: true
		},
		width: {
			type: [Number, String],
			default: 0
		},
		background: {
			type: String,
			default: '#FFFFFF'
		},
		name: {
			type: String,
			default: 'w-roundright-fill'
		},
		arrowSize: {
			type: [Number, String],
			default: 40
		},
		arrowColor: {
			type: String,
			default: '#7F7F7F'
		},
		yearsWidth: {
			type: [Number, String],
			default: 200
		},
		yearsSize: {
			type: [Number, String],
			default: 32
		},
		yearsColor: {
			type: String,
			default: '#181818'
		},
		titleColor: {
			type: String,
			default: '#181818'
		},
		lineColor: {
			type: String,
			default: '#EEEEEE'
		},
		color: {
			type: String,
			default: '#181818'
		},
		activeColor: {
			type: String,
			default: '#FFFFFF'
		},
		//选中日期背景色
		activeBackground: {
			type: String,
			default: '#1396FF'
		},
		rangeColor: {
			type: String,
			default: '#1396FF'
		},
		rangeBackground: {
			type: String,
			default: '#F1F4FA'
		},
		start: {
			type: String,
			default: '开始'
		},
		end: {
			type: String,
			default: '结束'
		},
		isToday: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		showBtn: {
			type: Boolean,
			default: false
		},
		btnText: {
			type: String,
			default: '确定'
		},
		btnBackground: {
			type: String,
			default: '#1396FF'
		},
		btnColor: {
			type: String,
			default: '#FFFFFF'
		},
		// 日期格式化函数
		formatter: {
			type: [Function, null],
			default: null
		}
	},
	data() {
		return {
			lang: [],
			header: [],
			monthArr: [],
			singleMonth: {
				weekdayArr: [],
				daysArr: []
			},
			dateWidth: '100%',
			title: '',
			year: 2010,
			month: 1,
			today: '',
			minArr: [],
			maxArr: [],
			values: [],
			defCurrent: 0,
			btnDisabled: false,
			// 过滤处理方法
			innerFormatter: value => value
		};
	},
	computed: {
		initChange() {
			return `${this.type}-${this.minDate}-${this.maxDate}-${this.value}`;
		},
		itemWidth() {
			// #ifdef APP-NVUE
			return (Number(this.dateWidth.replace('px', '')) - 1) / 7 + 'px';
			// #endif

			// #ifndef APP-NVUE
			return '14.2857%';
			// #endif
		}
	},
	watch: {
		width(val) {
			this.getWidth(val);
		},
		language(val) {
			this.setLang(val);
		},
		values(vals) {
			this._btnDisabled(vals);
		},
		initChange(vals) {
			this.init();
		},
		isMultiple(val) {
			if (!val) {
				this.singleMonth = this.monthArr[this.month - 1];
			}
		}
	},
	created() {
		this.setLang(this.language);
		this.getWidth(this.width);
		this.init();
		this._btnDisabled(this.values);
	},
	methods: {
		// 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
		setFormatter(e) {
			this.innerFormatter = e;
		},
		_btnDisabled(vals) {
			if (this.type == 3 && vals.length < 2) {
				this.btnDisabled = true;
			} else {
				this.btnDisabled = false;
			}
		},
		setLang(val) {
			this.header = lunar.lang[`h_${val}`] || lunar.lang.h_cn;
			this.setTitle();
		},
		getWidth(val) {
			//宽度值不宜太低
			let dw = Number(val);
			if (dw && dw >= 600) {
				dw = uni.upx2px(dw);
			} else {
				let sys = uni.getSystemInfoSync();
				dw = sys.windowWidth;
			}
			// #ifndef APP-NVUE
			this.dateWidth = val ? dw + 'px' : '100%';
			// #endif
			// #ifdef APP-NVUE
			this.dateWidth = dw + 'px';
			// #endif
		},
		swiperChange(e) {
			let current = e.detail.current;
			let month = current + 1;
			this.title = this.language === 'en' ? `${lunar.lang.m_en[month - 1]} ${this.year}` : `${this.year}年${month}月`;
		},
		getLunar(month, day) {
			let obj = lunar.solarTolunar(this.year, month, day);
			return obj.IDayCn;
		},
		initDate(date) {
			if (!date || date === true || date === 'true') return '';
			let fdate = date.replace(/\-/g, '/').split('/');
			return [Number(fdate[0] || -1), Number(fdate[1] || -1), Number(fdate[2] || -1)];
		},
		formatNum(num) {
			num = Number(num);
			return num < 10 ? '0' + Math.abs(num) : num + '';
		},
		compareDate(arr) {
			if (!arr && arr.length === 0) return -1;
			let timestamp = [];
			let indexs = {};
			arr.forEach((item, index) => {
				let d = item.replace(/\-/g, '/');
				d = `${d} 00:00:00`;
				let stamp = new Date(d).getTime();
				timestamp.push(stamp);
				indexs[stamp.toString()] = index;
			});
			let newArr = [];
			while (timestamp.length > 0) {
				let min = Math.min(...timestamp);
				let index = indexs[min.toString()];
				newArr.push(arr[index]);
				timestamp.splice(timestamp.indexOf(min), 1);
			}
			return newArr;
		},
		toArray(start, end) {
			return Array.from(new Array(end + 1).keys()).slice(start);
		},
		getMonthDay(year, month) {
			let days = new Date(year, month, 0).getDate();
			return days;
		},
		getWeekday(year, month) {
			let date = new Date(`${year}/${month}/01 00:00:00`);
			return date.getDay();
		},
		_isSection(date, start, end) {
			let ts = new Date(date.replace(/\-/g, '/')).getTime();
			let s = new Date(start.replace(/\-/g, '/')).getTime();
			let e = new Date(end.replace(/\-/g, '/')).getTime();
			return ts > s && ts < e;
		},
		getTextColor(index, idx, values) {
			//底部文字
			let month = index + 1;
			let day = idx + 1;
			let text = '';
			let date = `${this.year}-${this.formatNum(month)}-${this.formatNum(day)}`;
			if (this.type == 3) {
				if (values.length > 0) {
					if (values[0] == date && values[0] != values[1]) {
						let st = this.start;
						text = st && st !== 'true' && st !== true ? st : '';
					} else if (values[1] == date) {
						let et = this.end;
						text = et && et !== 'true' && et !== true ? et : '';
					}
				}
			}
			if (!text) {
				text = this.showLunar ? this.getLunar(month, day) : '';
				if (this.isToday) {
					//今天 简繁同体
					let td = this.language === 'en' ? 'Today' : '今天';
					text = this.today === date ? td : text;
				}
			}
			const bottomInfo = {
				text: '',
				color: '',
				isColor: false,
				date: date
			};
			const formatter = this.formatter || this.innerFormatter;
			// console.log('formatter____>', formatter(bottomInfo));
			if (formatter(bottomInfo)?.text) {
				text = formatter(bottomInfo).text;
			}
			// 颜色
			let color = '';
			if (!values || values.length === 0) {
				if (formatter(bottomInfo)?.color) {
					color = formatter(bottomInfo).color;
				} else {
					color = this.color;
				}
				return { text: text, color: color };
			}
			if (formatter(bottomInfo)?.color) {
				color = formatter(bottomInfo).color;
			} else {
				color = this.color;
			}
			let month1 = this.formatNum(index + 1);
			let day1 = this.formatNum(idx + 1);
			let date1 = `${this.year}-${month1}-${day1}`;
			if (this.type == 3) {
				if (~values.indexOf(date1)) {
					color = this.activeColor;
				} else if (values[1] && this._isSection(date1, values[0], values[1])) {
					color = this.rangeColor;
				}
			} else {
				if (~values.indexOf(date1)) {
					color = this.activeColor;
				}
			}
			return { text: text, color: color };
		},
		// getBottomInfo
		getText(index, idx) {
			let month = index + 1;
			let day = idx + 1;
			let text = '';
			let date = `${this.year}-${this.formatNum(month)}-${this.formatNum(day)}`;
			console.log('date22222', date);
			if (this.type == 3) {
				let values = this.values;
				if (values.length > 0) {
					if (values[0] == date && values[0] != values[1]) {
						let st = this.start;
						text = st && st !== 'true' && st !== true ? st : '';
					} else if (values[1] == date) {
						let et = this.end;
						text = et && et !== 'true' && et !== true ? et : '';
					}
				}
			}
			if (!text) {
				text = this.showLunar ? this.getLunar(month, day) : '';
				if (this.isToday) {
					//今天 简繁同体
					let td = this.language === 'en' ? 'Today' : '今天';
					text = this.today === date ? td : text;
				}
			}
			const bottomInfo = {
				text: '',
				color: '',
				isColor: false,
				date: date
			};
			const formatter = this.formatter || this.innerFormatter;
			// console.log('formatter____>', formatter(bottomInfo));
			if (formatter(bottomInfo)?.text) {
				text = formatter(bottomInfo).text;
			}
			console.log('bottomInfoText', text);
			return text;
		},
		getBackground(index, idx, values) {
			let background = 'transparent';
			if (!values || values.length === 0) return background;
			let month = this.formatNum(index + 1);
			let day = this.formatNum(idx + 1);
			let date = `${this.year}-${month}-${day}`;
			let type = this.type;
			if (type == 3) {
				if (~values.indexOf(date)) {
					background = this.activeBackground;
				} else if (values[1] && this._isSection(date, values[0], values[1])) {
					background = this.rangeBackground;
				}
			} else {
				if (~values.indexOf(date)) {
					background = this.activeBackground;
				}
			}
			return background;
		},
		_isRadius(index, idx, start) {
			let radius = this.type != 3 ? true : false;
			if (this.type == 3 && this.values && this.values.length > 0) {
				let month = index + 1;
				let day = idx + 1;
				let date = `${this.year}-${this.formatNum(month)}-${this.formatNum(day)}`;
				if (start) {
					radius = date === this.values[0];
				} else {
					radius = date === this.values[1];
				}
			}
			return radius;
		},
		getMonthsArr(year) {
			let monthArr = [];
			for (let i = 0; i < 12; i++) {
				let month = i + 1;
				let daysArr = this.toArray(1, this.getMonthDay(year, month));
				let weekdayArr = this.toArray(1, this.getWeekday(year, month));
				weekdayArr = weekdayArr.map(item => {
					return `week_${i}_${item}`;
				});
				monthArr.push({
					key: `m_${month}`,
					weekdayArr,
					daysArr
				});
			}
			return monthArr;
		},
		_isDisAbled(index, idx) {
			let bool = false;
			let date = `${this.year}/${index + 1}/${idx + 1}`;
			let min = this.minArr.join('/');
			let max = this.maxArr.join('/');
			let ts = new Date(date).getTime();
			if (ts < new Date(min).getTime() || ts > new Date(max).getTime()) {
				bool = true;
			}
			return bool;
		},
		setTitle() {
			this.title = this.language === 'en' ? `${lunar.lang.m_en[this.month - 1]} ${this.year}` : `${this.year}年${this.month}月`;
		},
		init() {
			const now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let day = now.getDate();
			this.minArr = this.initDate(this.minDate) || [2010, 1, 1];
			this.maxArr = this.initDate(this.maxDate) || [2030, 12, 31];
			this.today = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`;
			let value = this.value;
			let def = [-1];
			if (value && value.length > 0) {
				if (typeof value === 'string') {
					def = this.initDate(value) || [-1, -1, -1];
					value = [value];
				} else {
					const len = value.length;
					if (len > 1) {
						value = this.compareDate(value);
					}
					if (this.type == 3 && value.length > 2) {
						value = [value[0], value[1]];
					}
					def = this.initDate(value[len - 1]) || [-1, -1, -1];
					if (def[0] !== -1) {
						year = def[0];
						month = def[1];
					}
				}
				value = value.map(item => {
					let arr = this.initDate(item);
					return `${arr[0]}-${this.formatNum(arr[1])}-${this.formatNum(arr[2])}`;
				});
				this.values = value;
			}
			this.year = year;
			this.month = month;
			this.setTitle();
			this.monthArr = this.getMonthsArr(year);
			if (!this.isMultiple) {
				this.singleMonth = this.monthArr[month - 1];
			} else {
				this.$nextTick(() => {
					setTimeout(() => {
						this.defCurrent = month - 1;
					}, 20);
				});
			}
		},
		checkYear(year) {
			if (year < this.minArr[0] || year > this.maxArr[0]) {
				uni.showToast({
					title: '日期已超出可切换范围！',
					icon: 'none'
				});
				return false;
			}
			return true;
		},
		changeMonth(num) {
			let month = num + this.month;
			let year = 0;
			if (num > 0) {
				year = month > 12 ? this.year + 1 : this.year;
				month = month > 12 ? 1 : month;
			} else {
				year = month < 1 ? this.year - 1 : this.year;
				month = month < 1 ? 12 : month;
			}
			if (this.checkYear(year)) {
				this.month = month;
				this.year = year;
				this.setTitle();
				this.monthArr = this.getMonthsArr(year);
				this.singleMonth = this.monthArr[this.month - 1];
			}
		},
		changeYear(num) {
			let year = num + this.year;
			if (this.checkYear(year)) {
				this.year = year;
				if (this.isMultiple) {
					this.month = 1;
					this.defCurrent = 0;
				}
				this.setTitle();
				this.monthArr = this.getMonthsArr(year);
				if (!this.isMultiple) {
					this.singleMonth = this.monthArr[this.month - 1];
				}
			}
		},
		getWeekText(date) {
			date = new Date(`${date.replace(/\-/g, '/')} 00:00:00`);
			let week = date.getDay();
			//英文
			let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			if (this.language === 'en') {
				weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			}
			return weeks[week];
		},
		dateClick(index, day) {
			if (this.disabled) return;
			if (!this._isDisAbled(index, day - 1)) {
				let month = this.formatNum(index + 1);
				let date = `${this.year}-${month}-${this.formatNum(day)}`;
				let type = this.type;
				let values = [...this.values];
				if (type == 3) {
					let start = values[0];
					let sts = -1;
					if (start) {
						sts = new Date(start.replace(/\-/g, '/')).getTime();
					}
					let ets = new Date(date.replace(/\-/g, '/')).getTime();
					if (start && values.length === 1 && sts <= ets) {
						values.push(date);
					} else {
						values = [date];
					}
				} else {
					let idx = values.indexOf(date);
					if (idx != -1) {
						values.splice(idx, 1);
					} else {
						if (type == 2) {
							values.push(date);
						} else {
							values = [date];
						}
					}
				}
				this.values = values;
				setTimeout(() => {
					if (!this.showBtn) {
						this._change();
					}
				}, 0);
			}
		},
		_change() {
			let values = this.values;
			let type = this.type;
			if (type == 3 && values.length < 2) return;
			let value = '';
			let week = '';
			let lunarArr = {};
			if (type == 1) {
				value = values[0] || '';
				if (value) {
					week = this.getWeekText(value);
					if (this.showLunar && this.language !== 'en') {
						let d = this.initDate(value);
						lunarArr = lunar.solarTolunar(d[0], d[1], d[2]);
					}
				}
			} else {
				value = values;
				week = [];
				lunarArr = [];
				value.forEach(item => {
					week.push(this.getWeekText(item));
					if (this.showLunar && this.language !== 'en') {
						let d = this.initDate(item);
						lunarArr.push(lunar.solarTolunar(d[0], d[1], d[2]));
					}
				});
			}

			this.$emit('change', {
				value: value,
				week: week,
				today: this.today,
				lunar: lunarArr
			});
		},
		handleClick() {
			if (this.btnDisabled) return;
			this._change();
		}
	}
};
</script>

<style scoped>
.wui-calendar__header {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 20rpx 0 30rpx;
}

.wui-calendar__title {
	/* #ifndef APP-NVUE */
	display: block;
	white-space: nowrap;
	/* #endif */
	font-weight: normal;
	text-align: center;
}

.wui-calendar__icon-left {
	transform: rotate(180deg);
}

.wui-calendar__pl {
	padding-left: 16rpx;
}

.wui-calendar__pl:active {
	opacity: 0.5;
}

.wui-calendar__date-header {
	/* #ifndef APP-NVUE */
	display: flex;
	width: 100%;
	box-sizing: border-box;
	position: relative;
	border-bottom-width: 0;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	padding: 12rpx 0;
	/* #ifdef APP-NVUE */
	border-bottom-width: 0.5px;
	border-bottom-style: solid;
	/* #endif */
}

/* #ifndef APP-NVUE */
.wui-calendar__border {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	height: 1px;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	transform-origin: 0 100%;
	z-index: 1;
}

/* #endif */

.wui-calendar__date-wrap {
	/* #ifndef APP-NVUE */
	display: flex;
	width: 100%;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
	padding: 12rpx 0;
	position: relative;
}

.wui-calendar__date {
	/* #ifndef APP-NVUE */
	display: flex;
	width: 14.2857%;
	box-sizing: border-box;
	overflow: hidden;
	/* #endif */
	text-align: center;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
	z-index: 2;
	font-size: 24rpx;
	font-weight: normal;
}

.wui-calendar__dh {
	height: 104rpx;
}

.wui-calendar__left-radius {
	border-top-left-radius: 8rpx;
	border-bottom-left-radius: 8rpx;
}

.wui-calendar__right-radius {
	border-top-right-radius: 8rpx;
	border-bottom-right-radius: 8rpx;
}

.wui-calendar__date-val {
	font-size: 32rpx;
	font-weight: normal;
}

.wui-calendar__date-lunar {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	font-size: 24rpx;
	font-weight: normal;
	transform: scale(0.8);
	text-align: center;
}

.wui-calendar__date-descr {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: block;
	/* #endif */
	font-size: 24rpx;
	line-height: 24rpx;
	position: absolute;
	left: 0;
	right: 0;
	transform: scale(0.8);
	text-align: center;
	bottom: 8rpx;
	z-index: 2;
	font-weight: normal;
}

.wui-calendar__swiper {
	/* #ifndef APP-NVUE */
	width: 100%;
	/* #endif */
	min-height: 600rpx;
}

.wui-calendar__diaabled {
	opacity: 0.4;
}

.wui-calendar__btn-wrap {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	box-sizing: border-box;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
}

.wui-calendar__btn {
	/* #ifndef APP-NVUE */
	width: 100%;
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 88rpx;
	border-radius: 44rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	font-size: 32rpx;
	font-weight: normal;
	text-align: center;
}

/* #ifdef APP-NVUE */
.wui-calendar__btn-text {
	line-height: 88rpx;
}

/* #endif */
.wui-calendar__btn-active:active {
	background: rgba(0, 0, 0, 0.2);
}
</style>
