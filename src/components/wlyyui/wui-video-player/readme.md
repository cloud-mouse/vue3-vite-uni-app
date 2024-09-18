# wui-video-player 视频播放器组件

只是在 uniapp 的 video 组件外多包一层
## 用法

### 示例1

通过src传参

``` html
<view style="width: 100vw; height: 400rpx;">
    <hic-video-player
        :src="url"
        :poster="poster"
        title="明智之举"
        upperRightText="VAE"></hic-video-player>
</view>
```

``` js
export default {
	data() {
		return {
			url: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/mda-kjq8j5b86q720jcr.mp4',
			poster: 'http://n.sinaimg.cn/sinacn10/640/w720h720/20180624/27c7-heirxye9435927.jpg'
		}
	}
}
```

### 示例2

通过definition切换清晰度

``` html
<view style="width: 100%; height: 400rpx;">
	<hic-video-player
		:definition="definition"
		autoplay
		title="明智之举"
		upperRightText="VAE"></hic-video-player>
</view>
```

``` js
export default {
	data() {
		return {
			definition: [	// 清晰度视频地址列表
				{ key: 'sd', name: '标清', src: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/mda-kjq8j5b86q720jcr.mp4' },
				{ key: 'hd', name: '高清', src: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/hd/mda-kjq8j5b86q720jcr.mp4' },
				{ key: 'sd_', name: '超清', src: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/sc/mda-kjq8j5b86q720jcr.mp4' }
			],
		}
	}
}
```

### 示例3

非wifi网络提示流量播放

vuex存数据，本次打开应用提示过一次，不再提示（完整代码见示例项目）

``` HTML
<view id="realVideo">
	<hic-video-player
		:definition="definition"
		:poster="poster"
		autoplay
		title="明智之举"
		controls-toggle-title
		upperRightText="VAE"
		:width="width" :height="height"
		:tipNotWifi="!playVideoByTraffic"
		@trafficPlayVideo="trafficPlayVideo"></hic-video-player>
</view>
```

``` javaScript
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			// 封面图片地址
			poster: 'http://n.sinaimg.cn/sinacn10/640/w720h720/20180624/27c7-heirxye9435927.jpg',
			// 清晰度视频地址列表
			definition: [
				{ key: 'sd', name: '标清', src: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/mda-kjq8j5b86q720jcr.mp4' },
				{ key: 'hd', name: '高清', src: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/hd/mda-kjq8j5b86q720jcr.mp4' },
				{ key: 'sd_', name: '超清', src: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/sc/mda-kjq8j5b86q720jcr.mp4' }
			],
			width: '',
			height: '',
		}
	},
	computed: {
		// 使用流量播放视频
		...mapGetters(['playVideoByTraffic'])
	},
	mounted() {
		uni.createSelectorQuery().in(this).select('#realVideo').boundingClientRect(res => {
			this.width = res.width + 'px';
			let height = (res.width / 16) * 9;
			this.height = Math.round(height*100)/100 + 'px';
			// 视频宽高比 16:9
		}).exec();
	},
	methods: {
		// 本次打开应用，提示过一次，不再提示
		...mapMutations(['trafficPlayVideo'])
	}
}
```
vuex：store/index.js

```javascript
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		promptOnce: false	// 是否 提示过一次
	},
	getters: {
		playVideoByTraffic: (state) => {
            // 使用流量播放视频
            return state.promptOnce;
        }
	},
	mutations: {
		trafficPlayVideo(state) {
            state.promptOnce = true;
        }
	}
});

export default store;
```

### 示例4

通过 playbackrate 设置倍速播放

``` HTML
<view style="width: 100vw; height: 400rpx;">
	<hic-video-player
		:src="url"
		:poster="poster"
		playbackrate
		title="明智之举"
		upperRightText="VAE"></hic-video-player>
</view>
```

``` js
export default {
	data() {
		return {
			url: 'https://vd4.bdstatic.com/mda-kjq8j5b86q720jcr/mda-kjq8j5b86q720jcr.mp4',
			poster: 'http://n.sinaimg.cn/sinacn10/640/w720h720/20180624/27c7-heirxye9435927.jpg'
		}
	}
}
```

### 示例5

通过useLivePlayer，设置使用live-player实时音视频播放组件

使用live-player 组件需注意：如果发布到小程序，需要先通过各家小程序的审核。指定类目的小程序才能使用（[微信小程序类目 (opens new window)](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)、[百度小程序类目 (opens new window)](https://smartprogram.baidu.com/docs/develop/component/media/#live-player/)），审核通过后在各家小程序管理后台自助开通该组件权限。

详细说明见官方文档

``` vue
<template>
    <view style="width: 100vw; height: 400rpx;">
        <hic-video-player
            :definition="definition"
            autoplay
            title="live-player"
            useLivePlayer></hic-video-player>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                definition: [
                    { key: 'sd', name: '标清', src: 'http://xxx.flv' },
                    { key: 'hd', name: '高清', src: 'http://xxx.flv' },
                    { key: 'sd_', name: '超清', src: 'http://xxx.flv' }
                ],
            }
        }
    }
</script>
```

来自业务需求，实现了部分props属性，有时间慢慢优化.....(⌐■_■)

## API

### hic-video-player Props
| 参数                       | 说明                                                        | 类型    | 默认值   | 平台差异说明 | 差异说明    |
| -------------------------- | ----------------------------------------------------------- | ------- | -------- | ------------ | ----------- |
| src                        | 视频播放地址                                                | String  |          |              |             |
| poster                     | 封面图片地址                                                | String  |          |              |             |
| autoplay                   | 是否自动播放                                                | Boolean | false    |              |             |
| muted                      | 是否静音播放                                                | Boolean | false    |              |             |
| initialTime                | 指定视频初始播放位置，单位为秒 (s)                          | Number  |          |              | video       |
| title                      | 全屏时在顶部展示的视频标题                                  | String  |          | 微信小程序   |             |
| controlsToggleTitle        | 非全屏时，切换 controls 是否显示顶部 title                  | Boolean | false    | 微信小程序   |             |
| upperRightText             | 右上角文本                                                  | String  |          | 微信小程序   |             |
| definition                 | 视频清晰度地址列表，具体看下表                              | Array   | []       |              |             |
| defaultDefinition          | 默认清晰度（可选值：definition的key）                       | String  | sd       |              |             |
| width                      | 宽度，须自带单位                                            | String  |          |              |             |
| height                     | 高度，须自带单位                                            | String  |          |              |             |
| hideVideo                  | 是否隐藏视频组件                                            | Boolean | false    |              |             |
| delay                      | 隐藏后显示视频组件的时延，默认500ms                         | Number  | 500      |              |             |
| tipNotWifi                 | 网络类型非WiFi，是否提示                                    | Boolean | false    |              |             |
| controls                   | 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）       | Boolean | true     |              |             |
| showMuteBtn                | 是否显示静音按钮                                            | Boolean | false    |              | video       |
| playbackrate               | 是否设置倍速播放                                            | Boolean | false    |              | video       |
| loading                    | 是否数据加载中                                              | Boolean | false    |              |             |
| autoFullScreen             | 设备方向变化，是否自动全屏                                  | Boolean | false    |              |             |
| useLivePlayer              | 是否切换使用live-player组件                                 | Boolean | false    |              |             |
| autoSwitchComp             | 使用live-play 视频格式不支持，是否自动切换video             | Boolean | false    |              | live-player |
| mode                       | 模式（可选值：live-直播, RTC-实时通话, 该模式时延更低）     | String  | live     |              | live-player |
| orientation                | 画面方向（可选值：vertical/horizontal）                     | String  | vertical |              | live-player |
| showPlayBtn                | 是否显示播放/暂停按钮                                       | Boolean | false    |              | live-player |
| showFullScreenBtn          | 是否显示全屏按钮                                            | Boolean | false    |              | live-player |
| custom                     | 是否添加自定义按钮(位置同切换清晰度、倍速，配合slot-custom) | Boolean | false    |              |             |
| customName                 | 自定义按钮名称                                              | String  |          |              |             |
| onlyShowCustomInFullscreen | 只全屏下显示custom按钮                                      | Boolean | false    |              |             |

#### definition Options

参考：`[{ key: 'sd', name: '标清', src: 'http://xxx' }]`

| 参数 | 说明       | 类型   | 可选值        |
| ---- | ---------- | ------ | ------------- |
| key  | 清晰度key  | String | sd/hd/...     |
| name | 清晰度名称 | String | 标清/高清/... |
| src  | 视频地址   | String |               |

### hic-video-player Events

| 事件名           | 说明                          | 参数                | 差异说明 |
| ---------------- | ----------------------------- | ------------------- | -------- |
| trafficPlayVideo | 使用流量播放                  |                     |          |
| error            | 视频播放出错时触发            | event               |          |
| changeDefinition | 切换清晰度                    | definition 对应 key |          |
| ended            | 当播放到末尾时触发 ended 事件 | event               | video    |
| timeupdate       | 播放进度变化时触发            | event               | video    |

### hic-video-player Methods

| 方法名            | 说明                            | 参数                |
| ---------------- | ------------------------------- | ------------------ |
| pauseVideo       | 暂停视频                         |                    |

### hic-video-player Slots

| name   | 说明       |
| ------ | ---------- |
| custom | 自定义控件 |

## 说明

- hideVideo：是否隐藏视频组件

  - 未实现同层渲染的移动端，视频组件层级最高。如果页面需要显示弹框，会被视频组件遮挡。

  - 解决方法：通过props参数，设置 `hideVideo` 为 `true`，隐藏视频组件。

  - 组件内部通过 `v-show` 替换视频组件，显示封面图片。

- autoFullScreen：设备方向变化，是否自动全屏

  - 通过监听加速度数据，判断设备方向（专业术语是什么啊...? T^T），设备方向变化，调用视频组件的`requestFullScreen`方法，进入全屏
  - 一个小问题：video组件，手机长边向下屏幕朝左，会自动全屏，再将手机转动180°，视频方向没有发生变化...（没找到解决方法...`live-player`会自动旋转180°，没有这个问题）
  - 平台差异，查看官方文档：[uniapp 加速度计 accelerometer](https://uniapp.dcloud.net.cn/api/system/accelerometer.html)

- 关于运行到浏览器，播放https视频，视频播放出错的问题.....

  - 找了几个http的视频，播放没有问题，应该是....http协议不支持播放https的视频吧....（浅浅一只前端，百度一圈的结果）

  - 视频地址来自：[插件市场：nvue自定义播放器（只支持安卓,ios）](https://ext.dcloud.net.cn/plugin?id=785)

    ```json
    [
    	{ key: 'sd', name: '标清', src: 'http://baobab.kaiyanapp.com/api/v1/playUrl?vid=164016&resourceType=video&editionType=low&source=aliyun&playUrlType=url_oss' },
    	{ key: 'hd', name: '高清', src: 'http://baobab.kaiyanapp.com/api/v1/playUrl?vid=164016&resourceType=video&editionType=normal&source=aliyun&playUrlType=url_oss' },
    	{ key: 'sd_', name: '超清', src: 'http://baobab.kaiyanapp.com/api/v1/playUrl?vid=164016&resourceType=video&editionType=high&source=aliyun&playUrlType=url_oss' }
    ]
    ```

    
