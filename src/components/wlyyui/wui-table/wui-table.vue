<!--（手机号：   152 6 7 0 13 7  56，身份证尾号： 1919 3   5）-->
<template>
	<view class="wui-table__wrap" :style="{height:height>0 || height!=0?height+'rpx':'auto',width:width+'px'}">
		<!-- #ifdef MP-BAIDU -->
		<scroll-view :show-scrollbar="false" scroll-x
			:style="{width:width+'px',height:height>0 || height!=0?height+'rpx':'auto'}" class="wui-table__scroll-view"
			:class="{'wui-table__flex-row':!height || height==0}">
			<!-- #endif -->
			<!-- #ifndef MP-BAIDU -->
			<scroll-view :show-scrollbar="false" scroll-x :scroll-y="height>0 && height!=0"
				:style="{width:width+'px',height:height>0 || height!=0?height+'rpx':'auto'}"
				class="wui-table__scroll-view" :class="{'wui-table__flex-row':!height || height==0}">
				<!-- #endif -->
				<view class="wui-table--inner" :style="{width:totalW+'px'}">
					<view class="wui-table--tr"
						:class="{'wui-table__border-bottom':horBorder,'wui-table__border-top':horBorder && show,'wui-table--header-fixed':fixed}"
						:style="{borderBottomColor:horBorder?borderColor:'transparent',borderTopColor:horBorder && show?borderColor:'transparent'}"
						v-if="show">
						<view class="wui-table--td"
							:class="{'wui-table__border-right':border,'wui-table__border-left':border && index===0,'wui-table__center': (item.align || align)==='center','wui-table__right':(item.align || align)==='right','wui-table--col-fixed':item.fixed && !isNvue}"
							:style="{borderRightColor:border?borderColor:'transparent',borderLeftColor:border && index===0?borderColor:'transparent',background:item.background || headerBgColor,width:(item.width+divideW)+'px',paddingTop:padding+'rpx',paddingBottom:padding+'rpx',left:item.fixed && item.fixed!=='right' && !isNvue?item.left+'px':'auto',right:item.fixed==='right' && !isNvue?item.right+'px':'auto'}"
							v-for="(item,index) in hData" :key="index">
							<text class="wui-table--td-text"
								:class="{'wui-text__center':(item.align || align)==='center','wui-text__right':(item.align || align)==='right','wui-td__ellipsis':ellipsis}"
								:style="{width:(item.width+divideW)+'px',color:item.color || color,fontSize:(item.size || size)+'rpx',fontWeight:fontWeight}">{{item.label || item.prop}}</text>
							<view class="wui-table__td-sk" :style="{backgroundColor:borderColor}"
								v-if="border && item.fixed==='right'"></view>
						</view>
					</view>
					<view class="wui-table--tr"
						:class="{'wui-table__border-bottom':horBorder,'wui-table__border-top':horBorder && !show && index===0}"
						:style="{borderBottomColor:horBorder?borderColor:'transparent',borderTopColor:horBorder && !show && index===0?borderColor:'transparent'}"
						v-for="(item,index) in itemList" :key="index" @tap.stop="trClick(index)">
						<view class="wui-table--td"
							:class="{'wui-table__border-right':border,'wui-table__border-left':border && idx===0,'wui-table__center':(model.align || align)==='center','wui-table__right':(model.align || align)==='right','wui-table__td-wrap':model.type===3,'wui-table--col-fixed':model.fixed && !isNvue}"
							v-for="(model,idx) in hData" :key="model.tdId"
							:style="{borderRightColor:border?borderColor:'transparent',borderLeftColor:border && idx===0?borderColor:'transparent',background:item.background || ((index+1)%2===0 && stripe?stripeColor:background),width:(model.width+divideW)+'px',paddingTop:padding+'rpx',paddingBottom:padding+'rpx',left:model.fixed && model.fixed!=='right' && !isNvue?model.left+'px':'auto',right:model.fixed==='right' && !isNvue?model.right+'px':'auto'}">
							<template v-if="model.type!==3">
								<image class="wui-table--td-img" :src="item[model.prop] || ''" mode="widthFix"
									v-if="model.type===2"
									:style="{width:(model.imgWidth || 120)+'rpx',height:model.imgHeight?model.imgHeight+'rpx':'auto'}">
								</image>
								<text class="wui-table--td-text"
									:class="{'wui-text__center':(model.align || align)==='center','wui-text__right':(model.align || align)==='right','wui-td__ellipsis':ellipsis,'wui-td__wrap':!ellipsis}"
									v-else
									:style="{color:getColColor(model,item[model.prop],index),fontSize:(model.textSize || textSize) +'rpx',width:(model.width+divideW)+'px'}">{{item[model.prop] || ''}}</text>
							</template>
							<template v-else>
								<text class="wui-table--btn" :class="{'wui-td__btn-ml':j>0}"
									:style="{fontSize:(btn.size || textSize) +'rpx',color:btn.color,fontWeight:btn.fontWeight || 'normal'}"
									v-for="(btn,j) in model.buttons" :key="btn.bId"
									@tap.stop="handleTap(index,j)">{{btn.text}}</text>
							</template>
							<view class="wui-table__td-sk" :style="{backgroundColor:borderColor}"
								v-if="border && model.fixed==='right'"></view>
						</view>
					</view>
				</view>
			</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'wui-table',
		emits: ['click', 'rowClick'],
		props: {
			header: {
				type: Array,
				default () {
					return [];
				}
			},
			show: {
				type: Boolean,
				default: true
			},
			size: {
				type: [Number, String],
				default: 28
			},
			color: {
				type: String,
				default: '#7F7F7F'
			},
			fontWeight: {
				type: [Number, String],
				default: 600
			},
			headerBgColor: {
				type: String,
				default: '#fff'
			},
			fixed: {
				type: Boolean,
				default: false
			},
			//数据集合
			itemList: {
				type: Array,
				default () {
					return [];
				}
			},
			//总宽度 < 屏幕宽度- gap*2时，是否铺满
			full: {
				type: Boolean,
				default: false
			},
			//Table 的高度，默认为自动高度，单位rpx。
			height: {
				type: [Number, String],
				default: 0
			},
			//组件外层设置的左右padding值（距离屏幕左右侧距离），rpx
			gap: {
				type: [Number, String],
				default: 0
			},
			//是否带有纵向边框
			border: {
				type: Boolean,
				default: true
			},
			//是否带有横向边框
			horBorder: {
				type: Boolean,
				default: true
			},
			//边框颜色
			borderColor: {
				type: String,
				default: '#eee'
			},
			//如果有固定项，不可设置透明
			background: {
				type: String,
				default: '#fff'
			},
			// 是否为斑马纹table
			stripe: {
				type: Boolean,
				default: false
			},
			//斑马纹颜色
			stripeColor: {
				type: String,
				default: '#F8F8F8'
			},
			textSize: {
				type: [Number, String],
				default: 28
			},
			textColor: {
				type: String,
				default: '#333'
			},
			//单元格对齐方式:left/center/right
			align: {
				type: String,
				default: 'center'
			},
			//文字超出是否省略，默认换行
			ellipsis: {
				type: Boolean,
				default: false
			},
			//单元格上下padding值，单位rpx
			padding: {
				type: [Number, String],
				default: 20
			}
		},
		watch: {
			header(val) {
				this.handleHeader(this.header);
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				width: 0,
				//列宽度需要加上此值
				divideW: 0,
				hData: [],
				tableData: [],
				totalW: 0,
				isNvue: isNvue,
				scrollH: 0
			};
		},
		created() {
			this.handleHeader(this.header);
		},
		methods: {
			getPx(value) {
				let val = parseInt(uni.upx2px(Number(value)));
				return val % 2 === 0 ? val : val + 1;
			},
			getId(index) {
				return `${index}_tr_${Math.ceil(Math.random() * 10e5).toString(36)}`;
			},
			handleHeader(vals) {
				if (!vals || vals.length === 0) return;
				vals = JSON.parse(JSON.stringify(vals));
				let winWidth = uni.getSystemInfoSync().windowWidth;
				let width = 0,
					left = 0,
					right = 0;
				let len = vals.length;
				vals.map((item, index) => {
					item.tdId = this.getId(index);
					item.width = this.getPx(item.width || 200);
					width += item.width;
					if (item.fixed) {
						item.left = item.fixed !== 'right' ? left : 0;
						left += item.width;
					}
					if (item.type === 3 && item.buttons) {
						item.buttons.map((btn, idx) => {
							btn.bId = this.getId(index);
						});
					}
				});
				for (let i = 0; i < len; i++) {
					let item = vals[len - i - 1];
					if (item && item.fixed) {
						item.right = item.fixed === 'right' ? right : 0;
						right += item.width;
					}
				}
				let gap = this.gap == 0 ? 0 : this.getPx(Number(this.gap) * 2);
				this.totalW = width;
				let totalWidth = winWidth - gap;
				this.width = width > totalWidth ? totalWidth : width;
				if (this.full && totalWidth > this.width) {
					this.divideW = Math.floor((totalWidth - this.width) / len);
					let lastW = (totalWidth - this.width) % len;
					let item = vals[len - 1];
					item.width += lastW;
					let dw = this.divideW * len + lastW;
					this.width += dw;
					this.totalW += dw;
				}
				this.hData = vals;
			},
			handleTap(index, j) {
				let item = this.itemList[index];
				this.$emit('click', {
					item: item,
					index: index,
					buttonIndex: j
				});
			},
			trClick(index) {
				let item = this.itemList[index];
				this.$emit('rowClick', {
					item: item,
					index: index
				});
			},
			getColColor(model, value, index) {
				let color = '';
				if (model.fn && typeof model.fn === 'function') {
					color = model.fn(value, index);
				}
				return color || model.textColor || this.textColor;
			},
			columnColorMethod(fn, prop) {
				if (!fn || !prop) return;
				const data = this.hData;
				const index = data.findIndex(item => item.prop === prop);
				if (index !== -1) {
					let item = data[index];
					item.fn = fn;
					this.hData = data;
				}
			}
		}
	};
</script>

<style scoped>
	.wui-table__wrap {
		position: relative;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		margin: 0 auto;
		/* #endif */
		/* #ifndef MP-BAIDU */
		overflow: hidden;
		/* #endif */
		font-size: 0;
	}

	.wui-table__border-top {
		border-top-width: 1px;
		border-top-style: solid;
	}

	.wui-table__border-left {
		border-left-width: 1px;
		border-left-style: solid;
	}

	.wui-table__border-right {
		border-right-width: 1px;
		border-right-style: solid;
	}

	.wui-table__border-bottom {
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}

	.wui-table--tr {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
	}

	.wui-table--td {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding-left: 16rpx;
		padding-right: 16rpx;
		position: relative;
	}

	.wui-table__td-sk {
		position: absolute;
		left: -1px;
		width: 1px;
		top: 0;
		bottom: 0;
	}

	.wui-table__td-wrap {
		flex-wrap: wrap;
	}

	.wui-table--td-text {
		font-weight: 400;
	}

	.wui-table--td-img {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	.wui-table--btn {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		text-align: center;
		padding: 2px 0;
	}

	.wui-table--btn:active {
		opacity: .5;
	}

	.wui-td__btn-ml {
		margin-left: 24rpx;
	}

	.wui-table--header-fixed {
		position: sticky;
		top: 0;
		/* #ifndef APP-NVUE */
		z-index: 12;
		/* #endif */
		left: 0;
		right: 0;
	}

	.wui-table--col-fixed {
		position: sticky;
		/* #ifndef APP-NVUE */
		z-index: 2;
		/* #endif */
	}

	.wui-table__center {
		justify-content: center;
		text-align: center;
	}

	.wui-table__right {
		justify-content: flex-end;
		text-align: right;
	}

	.wui-text__center {
		text-align: center;
	}

	.wui-text__right {
		text-align: right;
	}

	.wui-td__ellipsis {
		/* #ifndef APP-NVUE */
		overflow: hidden;
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		text-overflow: ellipsis;
	}

	/* #ifndef APP-NVUE */
	.wui-td__wrap {
		word-break: break-all;
	}

	/* #endif */

	.wui-table__scroll-view {
		position: relative;
	}
  .wui-table--inner {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

	/* #ifdef APP-NVUE */
	.wui-table__flex-row {
		flex-direction: row;
	}

	/* #endif */

	/* #ifdef MP-BAIDU */
	.wui-table--inner {
		display: inline-block;
		padding-bottom: 40rpx;
	}

	/* #endif */
</style>
