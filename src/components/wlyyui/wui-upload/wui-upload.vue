<!--（手机号： 152670      13  7 56，身份证尾号：   19 193 5）-->
<template>
	<view class="wui-upload__wrap">
		<view
			class="wui-upload__item"
			:style="{
				width: width + 'rpx',
				height: height + 'rpx',
				borderRadius: radius + 'rpx'
			}"
			v-for="(item, index) in urls"
			:key="index"
		>
			<image
				class="wui-upload__img"
				:style="{
					width: width + 'rpx',
					height: height + 'rpx',
					borderRadius: radius + 'rpx'
				}"
				:src="item"
				mode="aspectFill"
				@tap.stop="previewImage(index)"
			></image>
			<view class="wui-upload__mask" v-if="status[index] !== 'success' && status[index] !== 'preupload'">
				<wui-icon name="w-warning-fill" color="#fff" :size="48" v-if="status[index] === 'error'"></wui-icon>
				<text class="wui-reupload__btn" @tap.stop="reUpload(index)" v-if="status[index] === 'error'">重新上传</text>
				<!-- #ifndef APP-NVUE -->
				<view class="wui-upload__loading" ref="wui_reupload_ld" v-if="status[index] === 'uploading'"></view>
				<text class="wui-upload__text" v-if="status[index] === 'uploading'">请稍候...</text>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<text class="wui-upload__text wui-upload__mtop" v-if="status[index] === 'uploading'">正在上传...</text>
				<!-- #endif -->
			</view>
			<view class="wui-upload__del" :style="{ background: delColor }" v-if="isDel" @tap.stop="deleteImage(index)">
				<wui-icon name="w-close" color="#fff" :size="32"></wui-icon>
			</view>
		</view>
		<view
			class="wui-upload__item"
			:class="[borderColor && borderColor !== true ? 'wui-upload__border' : 'wui-upload__noborder']"
			:style="{
				width: width + 'rpx',
				height: height + 'rpx',
				background: background,
				borderRadius: radius + 'rpx',
				borderColor: borderColor,
				borderStyle: borderSytle
			}"
			v-if="showAdd"
			@tap.stop="chooseImage"
		>
			<slot>
				<wui-icon name="w-plus" :size="addSize" :color="addColor"></wui-icon>
			</slot>
		</view>
	</view>
</template>

<script>
//非easycom模式取消注释引入字体组件，按实际路径进行调整
// import wuiIcon from "@/components/wlyyui/wui-icon/wui-icon.vue"
export default {
	name: 'wui-upload',
	emits: ['success', 'error', 'complete', 'preview'],
	// components:{
	// 	wuiIcon
	// },
	props: {
		width: {
			type: [Number, String],
			default: 200
		},
		height: {
			type: [Number, String],
			default: 200
		},
		fileList: {
			type: Array,
			default() {
				return [];
			}
		},
		max: {
			type: [Number, String],
			default: 9
		},
		isAdd: {
			type: Boolean,
			default: true
		},
		addColor: {
			type: String,
			default: '#333'
		},
		addSize: {
			type: [Number, String],
			default: 88
		},
		background: {
			type: String,
			default: '#eee'
		},
		radius: {
			type: [Number, String],
			default: 0
		},
		borderColor: {
			type: String,
			default: ''
		},
		//solid、dashed、dotted
		borderSytle: {
			type: String,
			default: 'solid'
		},
		isDel: {
			type: Boolean,
			default: true
		},
		delColor: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		confirmDel: {
			type: Boolean,
			default: false
		},
		url: {
			type: String,
			default: ''
		},
		immediate: {
			type: Boolean,
			default: false
		},
		sizeType: {
			type: Array,
			default() {
				return ['original', 'compressed'];
			}
		},
		sourceType: {
			type: Array,
			default() {
				return ['album', 'camera'];
			}
		},
		//图片后缀名限制
		suffix: {
			type: Array,
			default() {
				return [];
			}
		},
		//单张图片大小限制 MB
		size: {
			type: [Number, String],
			default: 4
		},
		name: {
			type: String,
			default: 'file'
		},
		header: {
			type: Object,
			default() {
				return {};
			}
		},
		formData: {
			type: Object,
			default() {
				return {};
			}
		},
		param: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			urls: [],
			//preupload、uploading、success、error
			status: []
		};
	},
	created() {
		this.initData(this.fileList);
	},
	watch: {
		fileList(vals) {
			this.initData(vals);
		}
	},
	computed: {
		showAdd() {
			let show = true;
			let len = this.urls.length;
			if (!this.isAdd || (this.max == -1 && len >= 9) || (this.max != -1 && len >= this.max)) {
				show = false;
			}
			return show;
		}
	},
	methods: {
		initData(urls) {
			urls = urls || [];
			this.status = [];
			let status = [];
			urls.forEach(item => {
				status.push('success');
			});
			this.urls = [...urls];
			this.status = status;
		},
		reUpload(index) {
			this.$set(this.status, index, 'uploading');
			this.uploadImage(index, this.urls[index])
				.then(res => {
					this._success(res);
				})
				.catch(res => {
					this._error(res);
				});
		},
		getStatus() {
			if (this.status.length === 0) return '';
			let status = 'preupload';
			if (this.status.indexOf('preupload') === -1) {
				status = ~this.status.indexOf('uploading') ? 'uploading' : 'success';
				if (status !== 'uploading' && ~this.status.indexOf('error')) {
					// 上传失败
					status = 'error';
				}
			}
			return status;
		},
		onComplete(action) {
			let status = this.getStatus();
			this.$emit('complete', {
				status: status,
				urls: this.urls,
				action: action,
				param: this.param
			});
		},
		_success(res) {
			let status = this.getStatus();
			this.$emit('success', {
				status: status,
				...res,
				param: this.param
			});
		},
		_error(res) {
			let status = this.getStatus();
			this.$emit('error', {
				status: status,
				...res,
				param: this.param
			});
		},
		result(url, index) {
			if (!url || index === undefined) return;
			this.$set(this.urls, index, url);
			setTimeout(() => {
				this.onComplete('upload');
			}, 0);
		},
		toast(text) {
			text &&
				uni.showToast({
					title: text,
					icon: 'none'
				});
		},
		chooseImage() {
			let max = Number(this.max);
			uni.chooseImage({
				count: max === -1 ? 9 : max - this.urls.length,
				sizeType: this.sizeType,
				sourceType: this.sourceType,
				success: e => {
					let imageArr = [];
					for (let i = 0; i < e.tempFiles.length; i++) {
						let len = this.urls.length;
						if (len >= max && max !== -1) {
							this.toast(`最多可上传${max}张图片`);
							break;
						}
						//过滤图片类型
						let path = e.tempFiles[i].path;

						if (this.suffix.length > 0) {
							let format = '';
							// #ifdef H5
							let type = e.tempFiles[i].type;
							format = type.split('/')[1];
							// #endif

							// #ifndef H5
							format = path.split('.')[path.split('.').length - 1];
							// #endif

							if (this.suffix.indexOf(format) == -1) {
								let text = `只能上传 ${this.suffix.join(',')} 格式图片！`;
								this.toast(text);
								continue;
							}
						}

						//过滤超出大小限制图片
						let size = e.tempFiles[i].size;

						if (Number(this.size) * 1024 * 1024 < size) {
							let err = `单张图片大小不能超过：${this.size}MB`;
							this.toast(err);
							continue;
						}
						imageArr.push(path);
						this.urls.push(path);
						this.status.push(this.immediate ? 'uploading' : 'preupload');
					}
					this.onComplete('choose');
					let start = this.urls.length - imageArr.length;
					if (this.immediate) {
						for (let j = 0; j < imageArr.length; j++) {
							let index = start + j;
							this.uploadImage(index, imageArr[j])
								.then(res => {
									this._success(res);
								})
								.catch(res => {
									this._error(res);
								});
						}
					}
				}
			});
		},
		uploadImage(index, imgUrl, url) {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: this.url || url,
					name: this.name,
					header: this.header,
					formData: this.formData,
					filePath: imgUrl,
					success: res => {
						if (res.statusCode === 200) {
							this.$set(this.status, index, 'success');
							resolve({
								res,
								index
							});
						} else {
							this.$set(this.status, index, 'error');
							reject({
								res,
								index
							});
						}
					},
					fail: res => {
						this.$set(this.status, index, 'error');
						// uni.showModal({
						// 	content: JSON.stringify(res)
						// })
						reject({
							res,
							index
						});
					}
				});
			});
		},
		deleteImage(index) {
			let status = this.getStatus();
			if (status === 'uploading') {
				this.toast('请等待上传结束再进行删除！');
			} else {
				if (this.confirmDel) {
					let _this = this;
					uni.showModal({
						content: '确定将该图片删除吗？',
						showCancel: true,
						confirmText: '确定',
						success(res) {
							if (res.confirm) {
								_this.urls.splice(index, 1);
								_this.status.splice(index, 1);
								_this.onComplete('delete');
							}
						}
					});
				} else {
					this.urls.splice(index, 1);
					this.status.splice(index, 1);
					this.onComplete('delete');
				}
			}
		},
		previewImage(index) {
			// #ifndef MP-BAIDU
			if (this.status.length === 0) return;
			uni.previewImage({
				current: this.urls[index],
				loop: true,
				urls: this.urls
			});
			// #endif
			//百度小程序使用
			this.$emit('preview', {
				index: index,
				urls: this.urls
			});
		},
		start() {
			if (!this.url) {
				this.toast('请传入服务器接口地址！');
				return;
			}
			let urls = [...this.urls];
			const len = urls.length;
			for (let i = 0; i < len; i++) {
				if (urls[i].startsWith('https')) {
					continue;
				} else {
					this.$set(this.status, i, 'uploading');
					this.uploadImage(i, urls[i], this.url)
						.then(res => {
							this._success(res);
						})
						.catch(error => {
							this._error(error);
						});
				}
			}
		}
	}
};
</script>

<style scoped>
.wui-upload__wrap {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
}

.wui-upload__item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	position: relative;

	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
}

.wui-upload__noborder {
	border-width: 0;
}

.wui-upload__border {
	border-width: 1px;
}

.wui-upload__del {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	height: 40rpx;
	width: 40rpx;
	/* #ifndef APP-NVUE */
	border-radius: 50%;
	display: flex;
	/* #endif */

	/* #ifdef APP-NVUE */
	border-radius: 20rpx;
	/* #endif */
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.wui-upload__mask {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.wui-reupload__btn {
	width: 144rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 4rpx 0;
	font-size: 24rpx;
	border: 1px solid #ffffff;
	color: #fff;
	border-radius: 32rpx;
	margin-top: 16rpx;
	font-weight: normal;
}

.wui-reupload__btn:active {
	opacity: 0.5;
}

.wui-upload__loading {
	width: 32rpx;
	height: 32rpx;
	border-width: 2px;
	border-style: solid;
	border-top-color: #ffffff;
	border-left-color: #7f7f7f;
	border-right-color: #7f7f7f;
	border-bottom-color: #7f7f7f;
	/* #ifdef APP-NVUE */
	border-radius: 20rpx;
	/* #endif */
	/* #ifndef APP-NVUE */
	border-radius: 50%;
	animation: wui-rotate 0.7s linear infinite;
	/* #endif */
	margin-bottom: 8rpx;
}

.wui-upload__text {
	font-size: 24rpx;
	color: #fff;
	margin-top: 16rpx;
	font-weight: normal;
}

/* #ifdef APP-NVUE */
.wui-upload__mtop {
	margin-top: 0;
}

/* #endif */

/* #ifndef APP-NVUE */
@keyframes wui-rotate {
	0% {
		transform: rotate(0);
	}

	100% {
		transform: rotate(360deg);
	}
}

/* #endif */
</style>
