const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

	data: {
		ifShowCollection:false,
	},

	onLoad: function (options) {
		this.userID = wx.getStorageSync('user_openID');
		this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/index/index&scene=${wx.getStorageSync('u_id')}@no`;
		console.log(this.qrcodeImg);
	},

	onShow: function () {

	},

	onHide: function () {

	},

	onUnload: function () {

	},

	onShareAppMessage: function (e) {
		var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
		
		if (e.from == 'button') {
			var img ="https://tp.datikeji.com/a/15428757949870/wkkEhOYIpk4DpnLJ37bmDsHS4CuLQAip4qszaDlo.png";
			var title = "送你一个现金红包，我已经拿到了，你也快来领取吧！";
		} else {
			var img = 'https://tp.datikeji.com/a/15428755321043/QfEACZQ0VacJMG5LYwDdPmumpJEM9fENCy9qZqBj.png';
			var title = "请你做我的VIP好友，大家有钱一起赚。";
		};
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
	},

	// 邀请新人
	invitationNewUser: function () {
		this.setData({
			ifShowBotFuchang: true,
		})
	},

	// 关闭邀请新人
	cloaseMask: function () {
		this.setData({
			ifShowBotFuchang: false,
		})
	},

	// 朋友圈按钮点击
	generateImages: function () {
		this.drawcanvs();
	},

	// 绘制Canvas
	drawcanvs: function () {
		wx.showLoading({
			title: 'loading',
			mask: true,
		});
		let _this = this;
		let ctx = wx.createCanvasContext('canvas');
		let canvasImg = 'https://tp.datikeji.com/a/15422784724773/3aeBeVYPf6Jftn0gzyJRS8mfP60v5M0oFImsG9TK.png';
		let toptxt = '我已经领到新人红包，你也快来';
		let bottxt = "长按二维码领取红包";
		wx.getImageInfo({
			src: canvasImg,
			success: function (res) {
				_this.setData({
					bgimgH: res.height,
					bgimgW: res.width,
				});
				ctx.setFillStyle('#ffffff');
				ctx.fillRect(0, 0, res.width, res.height);
				ctx.drawImage(res.path, 0, 0, res.width, res.height);
				ctx.setFontSize(24);
				ctx.setTextAlign('center');
				ctx.fillText(toptxt, res.width / 2, 326);
				ctx.fillText(bottxt, res.width / 2, 684);
				wx.getImageInfo({
					src: _this.qrcodeImg,
					success: function (res1) {
						ctx.beginPath();
						ctx.setLineWidth(2);
						ctx.arc(282, 498, 140, 0, 2 * Math.PI);
						ctx.setStrokeStyle('#ffffff');
						// ctx.stroke();
						ctx.fill()
						ctx.drawImage(res1.path, 142, 358, 280, 280);
						ctx.draw();
						setTimeout(function(){
							wx.hideLoading();
							_this.showOffRecord();
						},1000)
						
					}
				})
			}
		})
	},

	// 生成临时图片
	showOffRecord: function () {
		let _this = this;
		wx.showLoading({
			title: '正在给红包充钱',
			mask: true,
		});
		wx.canvasToTempFilePath({
			destWidth: this.data.bgimgW * 2,
			destHeight: this.data.bgimgH * 2,
			canvasId: 'canvas',
			success: function (res) {
				wx.hideLoading();
				_this.saveCanvas(res);
			}
		})
	},

	// 保存图片
	saveCanvas: function (res) {
		wx.saveImageToPhotosAlbum({
			filePath: res.tempFilePath,
			success: function () {
				wx.showModal({
					title: '红包准备就绪',
					content: '记得发送到朋友圈,发送技巧请看下方',
					showCancel: false,
					success: function (data) {
						wx.previewImage({
							urls: [res.tempFilePath]
						})
					}
				});
			},
			fail: function () {
				wx.previewImage({
					urls: [res.tempFilePath]
				})
			}
		})
	},

	// 跳转微信小技巧
	goToPromptPages: function () {
		wx.navigateTo({
			url: '/pages/howInvite/howInvite',
		})
	},

	ShowCollection:function(){
		this.setData({
			ifShowCollection: !this.data.ifShowCollection
		})
	},
})