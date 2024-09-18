<!--（手机号：  1  5267   0137   56，身份证尾号：1  9 1  935）-->
<template>
  <view class="wui-index__list" ref="wui_index_list" id="wui_index_list" :style="{
    top:top +'rpx'
  }">
    <!-- #ifdef APP-NVUE -->
    <list class="wui-index__list-sv" scrollable="true" show-scrollbar="false">
      <cell>
        <slot></slot>
      </cell>

      <!-- #ifdef VUE2 -->
      <template v-for="(list, idx) in lists">
        <!-- #endif -->
        <!-- #ifdef VUE3 -->
        <template v-for="(list, idx) in lists" :key="list.key">
          <!-- #endif -->
          <header :ref="'wui_il_letter_' + idx">
            <view class="wui-index__list-letter" :class="{'wui-il__key-bg':!background}"
                  :style="{background:background}">
              <text class="wui-il__letter-text"
                    :style="{color:color}">{{list.descr || list.letter}}</text>
            </view>
          </header>
          <!-- #ifdef VUE2 -->
          <cell :key="list.key">
            <!-- #endif -->
            <!-- #ifdef VUE3 -->
            <cell>
              <!-- #endif -->
              <!-- #endif -->
              <!-- #ifndef APP-NVUE -->
              <scroll-view class="wui-index__list-sv" scroll-y :scroll-into-view="scrollViewId">
                <slot></slot>
                <view :id="'wui_il_letter_'+idx" v-for="(list, idx) in lists" :key="list.key">
                  <!-- #endif -->
                  <!-- #ifndef APP-NVUE -->
                  <view class="wui-index__list-letter" :class="{'wui-il__key-bg':!background}"
                        :style="{background:background}">
                    <text class="wui-il__letter-text"
                          :style="{color:color}">{{list.descr || list.letter}}</text>
                  </view>
                  <!-- #endif -->
                  <!-- 解构插槽 item项样式内容自定义 -->
                  <view v-if="custom">
                    <view v-for="(model,index) in list.data" :key="index" @tap="onTap(idx,index)">
                      <slot name="item" :model="model" :idx="idx" :index="index"
                            :last="list.data.length-1===index" :isSelect="isSelect" :isSrc="isSrc"
                            :subRight="subRight"></slot>
                    </view>
                  </view>
                  <view v-else>
                    <w-index-list-item @itemClick="onClick" :model="model" :idx="idx" :index="index"
                                       :last="list.data.length-1===index" :isSelect="isSelect"
                                       :borderColor="borderColor" :selectedColor="selectedColor" :isSrc="isSrc"
                                       :subRight="subRight" v-for="(model,index) in list.data" :key="index">
                    </w-index-list-item>
                  </view>
                  <!-- #ifndef APP-NVUE -->
                </view>
                <slot name="footer"></slot>
              </scroll-view>
              <!-- #endif -->
              <!-- #ifdef APP-NVUE -->
            </cell>
        </template>
        <cell>
          <slot name="footer"></slot>
        </cell>
    </list>
    <!-- #endif -->
    <!-- #ifndef VUE3 -->
    <view class="wui-il__indicator" :class="{'wui-il__nvue-android':nvueAndroid}"
          :style="{ top: indicators[touchmoveIndex] + 'px' }" v-if="touching && touchmoveIndex!==-1">
      <view class="wui-il__indicator-after"></view>
      <text class="wui-il__indicator-text">{{ lists[touchmoveIndex] && lists[touchmoveIndex].letter }}</text>
    </view>
    <!-- #endif -->

    <!-- #ifdef VUE3 -->
    <!-- #ifndef APP-NVUE -->
    <view class="wui-il__indicator" :class="{'wui-il__nvue-android':nvueAndroid}"
          :style="{ top: indicators[touchmoveIndex] + 'px' }" v-if="touching && touchmoveIndex!==-1">
      <view class="wui-il__indicator-after"></view>
      <text class="wui-il__indicator-text">{{ lists[touchmoveIndex] && lists[touchmoveIndex].letter }}</text>
    </view>
    <!-- #endif -->

    <!-- #ifdef APP-NVUE -->
    <view class="wui-il__indicator" :class="{'wui-il__nvue-android':nvueAndroid}"
          :style="{ top: idtHeight/2 + 'px' }" v-if="touching && touchmoveIndex!==-1">
      <view class="wui-il__indicator-after"></view>
      <text class="wui-il__indicator-text">{{ lists[touchmoveIndex] && lists[touchmoveIndex].letter }}</text>
    </view>
    <!-- #endif -->

    <!-- #endif -->

    <view class="wui-index__letter" :style="styles" @touchstart="touchStart" @touchmove.stop.prevent="touchMove"
          @touchend="touchEnd" @mousedown.stop="mousedown" @mousemove.stop.prevent="mousemove"
          @mouseleave.stop="mouseleave" v-if="!isNvue || styles">
      <view class="wui-letter__item" v-for="(item, i) in lists" :key="i">
        <!-- @tap="letterTap(i)" -->
        <text class="wui-letter__key" :class="{'wui-il__key-color':i === touchmoveIndex && !activeBackground}"
              :style="{ background: i === touchmoveIndex ? activeBackground : 'transparent', color: i === touchmoveIndex? activeColor : keyColor }">{{ item.letter }}</text>
      </view>
    </view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
// #endif
import wIndexListItem from './wui-index-list-item.vue';
// #ifdef APP-PLUS
function throttle(func, delay) {
  let prev = Date.now();
  return function() {
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
}

function touchMove(e) {
  let pageY = e.touches[0].pageY;
  let index = this.getIndex(pageY - this.winOffsetY);
  if (this.touchmoveIndex === index) {
    return false;
  }
  let item = this.lists[index];
  if (item) {
    // #ifndef APP-NVUE
    this.scrollViewId = `wui_il_letter_${index}`;
    this.touchmoveIndex = index;
    // #endif
    // #ifdef APP-NVUE
    dom.scrollToElement(this.$refs[`wui_il_letter_${index}`][0], {
      animated: false
    });
    this.touchmoveIndex = index;
    // #endif
  }
}
const throttleTouchMove = throttle(touchMove, 40);
// #endif
export default {
  name: 'wui-index-list',
  emits: ['click', 'init'],
  components: {
    wIndexListItem
  },
  props: {
    //列表数据
    listData: {
      type: Array,
      default () {
        return [];
      }
    },
    height: {
      type: [Number, String],
      default: 64
    },
    top: {
      type: [Number, String],
      default: 0
    },
    color: {
      type: String,
      default: '#181818'
    },
    background: {
      type: String,
      // #ifdef APP-NVUE
      default: '#F1F4FA',
      // #endif
      // #ifndef APP-NVUE
      default: ''
      // #endif
    },
    keyColor: {
      type: String,
      default: '#7F7F7F'
    },
    activeColor: {
      type: String,
      default: '#FFFFFF'
    },
    activeBackground: {
      type: String,
      // #ifdef APP-NVUE
      default: '#465CFF',
      // #endif
      // #ifndef APP-NVUE
      default: ''
      // #endif
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    //checkbox未选中时边框颜色
    borderColor: {
      type: String,
      default: '#ccc'
    },
    selectedColor: {
      type: String,
      // #ifdef APP-NVUE
      default: '#465CFF',
      // #endif
      // #ifndef APP-NVUE
      default: ''
      // #endif
    },
    //是否显示图片
    isSrc: {
      type: Boolean,
      default: false
    },
    //次要内容是否居右侧
    subRight: {
      type: Boolean,
      default: true
    },
    custom: {
      type: Boolean,
      default: false
    },
    //H5端使用，是否使用了默认导航栏，默认44px
    isHeader: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    listData(val) {
      this.initData();
    }
  },
  data() {
    let isNvue = false;
    // #ifdef APP-NVUE
    isNvue = true;
    // #endif
    return {
      lists: [],
      idtHeight: 0,
      winOffsetY: 0,
      winHeight: 0,
      styles: '',
      indicators: [],
      start: 0,
      touching: false,
      touchmoveIndex: -1,
      scrollViewId: '',
      touchmovable: true,
      loaded: false,
      isPC: false,
      nvueAndroid: false,
      isNvue: isNvue
    };
  },
  mounted() {
    // #ifdef APP-NVUE
    const res = uni.getSystemInfoSync();
    if (res.platform.toLocaleLowerCase() == 'android') {
      this.nvueAndroid = true;
    }
    // #endif

    // #ifdef H5
    this.isPC = this.IsPC();
    // #endif
    setTimeout(() => {
      this.initData();
    }, 50);
  },
  methods: {
    getIndex(y) {
      let index = -1;
      // #ifdef H5
      if (this.isHeader) {
        y += 44;
      }
      // #endif
      // #ifdef APP-NVUE
      if (this.nvueAndroid) {
        index = Math.floor(y / uni.upx2px(40));
      } else {
        index = Math.floor((y - this.start) / uni.upx2px(40));
      }
      // #endif

      // #ifndef APP-NVUE
      // if (y > this.start && y < this.start + uni.upx2px(this.idtHeight)) {}
      index = Math.floor((y - this.start) / uni.upx2px(40));
      // #endif
      return index;
    },
    initData() {
      this.lists = [];
      let height = 0;
      let lists = [];
      let tempArr = [...(this.listData || [])];
      for (let i = 0, len = tempArr.length; i < len; i++) {
        let model = tempArr[i];
        if (!model.data || model.data.length === 0) {
          continue;
        }
        height += 40;
        model.originalIndex = i;
        model.key = `wui_key_${Math.ceil(Math.random() * 10e5).toString(36)}`;
        lists.push(model);
      }
      this.idtHeight = height;
      this.styles = `height:${height}rpx;`;
      //nvue vue3 rpx 失效
      // #ifdef APP-NVUE
      // #ifdef VUE3
      this.idtHeight = uni.upx2px(height);
      this.styles = `height:${this.idtHeight}px;`;
      // #endif
      // #endif
      this.lists = lists;
      // #ifndef APP-NVUE
      uni.createSelectorQuery()
        // #ifndef MP-ALIPAY
        .in(this)
        // #endif
        .select('#wui_index_list')
        .boundingClientRect()
        .exec(ret => {
          this.winOffsetY = ret[0].top - this.top/2;
          this.winHeight = ret[0].height;
          this.setStyles();
        });
      // #endif
      // #ifdef APP-NVUE
      dom.getComponentRect(this.$refs['wui_index_list'], (res) => {
        this.winOffsetY = res.size.top - this.top/2;
        this.winHeight = res.size.height;
        this.setStyles();
      });
      // #endif
      this.$nextTick(() => {
        this.$emit('init');
      });
    },
    setStyles() {
      this.indicators = [];

      this.styles =
        `height:${this.idtHeight}rpx;top:${this.winHeight / 2}px;-webkit-transform: translateY(-${this.idtHeight/2}rpx);transform: translateY(-${this.idtHeight/2}rpx)`;
      // #ifdef APP-NVUE
      // #ifdef VUE3
      this.styles =
        `height:${this.idtHeight}px;top:${this.winHeight / 2}px;-webkit-transform: translateY(-${this.idtHeight/2}px);transform: translateY(-${this.idtHeight/2}px)`;
      // #endif
      // #endif
      let start = this.winHeight / 2 - uni.upx2px(this.idtHeight) / 2;
      this.start = start;
      this.lists.forEach((item, index) => {
        //20为40的一半，50为100的一半
        const top = start + uni.upx2px(index * 40 + 20 - 50);
        this.indicators.push(top);
      });
    },
    startEmits(idx, index) {
      let item = this.lists[idx];
      let data = item.data[index] || {};
      this.$emit('click', {
        index: item.originalIndex,
        letter: item.letter,
        subIndex: index,
        ...data
      });
    },
    onTap(idx, index) {
      this.startEmits(idx, index);
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
    onClick(e) {
      const {
        idx,
        index
      } = e;
      this.startEmits(idx, index);
    },
    touchStart(e) {
      this.touching = true;
      let pageY = this.isPC ? e.pageY : e.touches[0].pageY;
      let index = this.getIndex(pageY - this.winOffsetY);
      let item = this.lists[index];
      if (item) {
        this.scrollViewId = `wui_il_letter_${index}`;
        this.touchmoveIndex = index;
        // #ifdef APP-NVUE
        dom.scrollToElement(this.$refs[`wui_il_letter_${index}`][0], {
          animated: false
        });
        // #endif
      }
    },
    touchMove(e) {
      // #ifndef APP-PLUS
      let pageY = this.isPC ? e.pageY : e.touches[0].pageY;
      let index = this.getIndex(pageY - this.winOffsetY);
      if (this.touchmoveIndex === index) return false;
      let item = this.lists[index];
      if (item) {
        this.scrollViewId = `wui_il_letter_${index}`;
        this.touchmoveIndex = index;
      }
      // #endif
      // #ifdef APP-PLUS
      throttleTouchMove.call(this, e);
      // #endif
    },
    touchEnd() {
      this.touching = false;
      this.touchmoveIndex = -1;
    },
    mousedown(e) {
      if (!this.isPC) return;
      this.touchStart(e);
    },
    mousemove(e) {
      if (!this.isPC) return;
      this.touchMove(e);
    },
    mouseleave(e) {
      if (!this.isPC) return;
      this.touchEnd(e);
    }
    //开发工具中移动端如果touch事件失效，请检查开发工具或者真机调试
    // letterTap(index) {
    // #ifdef H5
    // if (this.touching) return;
    // let item = this.lists[index]
    // if (item) {
    // 	this.scrollViewId = `wui_il_letter_${index}`
    // 	this.touchmoveIndex = index
    // }
    // this.touchEnd()
    // #endif
    // }
  }
};
</script>

<style scoped>
.wui-index__list {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.wui-index__list-sv {
  flex: 1;
}

.wui-index__list-letter {
  /* #ifndef APP-NVUE */
  width: 100%;
  box-sizing: border-box;
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  /* #endif */
  flex: 1;
  padding: 0 32rpx;
  height: 64rpx;
  line-height: 64rpx;
  flex-direction: row;
  align-items: center;

  /* #ifdef APP-NVUE */
  border-top-style: solid;
  border-top-width: 0.5px;
  border-top-color: #eee;
  border-bottom-style: solid;
  border-bottom-width: 0.5px;
  border-bottom-color: #eee;
  /* #endif */
}

.wui-il__letter-text {
  font-size: 28rpx;
  font-weight: 600;
}

/* #ifndef APP-NVUE */
.wui-index__list-letter::before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  border-top: 1px solid var(--wui-color-border, #EEEEEE);
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}

.wui-index__list-letter::after {
  content: '';
  position: absolute;
  border-bottom: 1px solid var(--wui-color-border, #EEEEEE);
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 100%;
  bottom: 0;
  right: 0;
  left: 0;
}

/* #endif */
.wui-index__letter {
  position: fixed;
  right: 0;
  text-align: center;
  z-index: 10;
  /* #ifndef APP-NVUE */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  /* #endif */
  flex-direction: column;
}

.wui-letter__item {
  flex: 1;
  padding: 0 8rpx;
  font-weight: bold;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  justify-content: center;
}

.wui-letter__key {
  width: 40rpx;
  height: 40rpx;
  font-size: 26rpx;
  transform: scale(0.8);
  transform-origin: center center;
  /* #ifndef APP-NVUE */
  display: flex;
  border-radius: 50%;
  /* #endif */
  /* #ifdef APP-NVUE */
  border-radius: 40rpx;
  line-height: 40rpx;
  /* #endif */
  align-items: center;
  justify-content: center;
  text-align: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.wui-il__indicator {
  position: fixed;
  width: 100rpx;
  height: 100rpx;
  z-index: 999;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  border-radius: 10rpx;
  right: 100rpx;
}

/* #ifdef APP-NVUE */
.wui-il__nvue-android {
  width: 128rpx !important;
  padding-right: 28rpx;
  right: 72rpx !important;
}

/* #endif */

.wui-il__indicator-text {
  text-align: center;
  color: #ffffff;
  font-size: 60rpx;
  font-weight: bold;
}

.wui-il__indicator-after {
  width: 100rpx;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
  border-radius: 100rpx 0 100rpx 100rpx;
  background: #c9c9c9;
  transform: rotate(45deg);
}

/* #ifndef APP-NVUE */
.wui-il__key-color {
  background: var(--wui-color-primary, #465CFF) !important;
}

.wui-il__key-bg {
  background: var(--wui-bg-color-grey, #F1F4FA) !important;
}

/* #endif */
</style>
