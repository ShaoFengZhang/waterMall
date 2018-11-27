const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        extraData: {
            id: '41232'
        },
        all_amount: 0,
        amount: 0,
        no_amount: 0,
        user_collection: 0,
        withdrow: 0,
        ifShowServiceMask: false,
        ifShowBotFuchang: false,
    },

    onLoad: function(options) {
        this.userID = wx.getStorageSync('user_openID');
		this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/index/index&scene=${wx.getStorageSync('u_id')}@no`;
		console.log(this.qrcodeImg);
    },

    onShow: function() {
        this.getDataFun();
       
    },

    onHide: function() {

    },

    // 获取数据
    getDataFun: function() {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let getDataFunUrl = wxAPIF.domin + 'userPage';
        let data = {
            open_id: this.userID,
        }
        wxAPIF.wxRequest(app, getDataFunUrl, "POST", data, function(res) {
            console.log(123, res);
            if (res.code == 0) {
                _this.setData({
                    all_amount: (parseFloat(res.data.all_amount) / 100).toFixed(2), //累计省钱
                    amount: (parseFloat(res.data.amount) / 100).toFixed(2), //钱包
                    no_amount: (parseFloat(res.data.no_amount) / 100).toFixed(2), //待返现
                    user_collection: res.data.user_collection,
                    no_withdrow: (parseFloat(res.data.no_withdrow) / 100).toFixed(2), //未提现/已返现
                    withdrow: (parseFloat(res.data.withdrow) / 100).toFixed(2),
					all_with_drow: (parseFloat(res.data.all_with_drow) / 100).toFixed(2), //好友帮赚
					count: res.data.count //好友数量
                })
            };
            wx.hideLoading();
        })
    },

    // 邀请新人
    invitationNewUser: function() {
        this.setData({
            ifShowBotFuchang: true,
        })
    },

    // 关闭邀请新人
    cloaseMask: function() {
        this.setData({
            ifShowBotFuchang: false,
        })
    },

    // 跳转服务客服
    goToCustomer: function(e) {
        let num = e.currentTarget.dataset.type;
        this.setData({
            ifShowServiceMask: true,
            serviceNum: num,
        })
    },

    closeMask: function() {
        this.setData({
            ifShowServiceMask: false,
        })
    },

    // 跳转到收藏页
    goToCollection: function() {
        wx.navigateTo({
            url: '/pages/babyCollection/babyCollection',
        })
    },

    // 跳转订单
    goToOrder: function(e) {
        let navType = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: `/pages/orderManagement/orderManagement?no_amount=${this.data.no_amount}&no_withdrow=${this.data.no_withdrow}&navType=${navType}`,
        })
    },

	// 跳转好友订单
	goToFriendOrder:function(e){
		let navType = e.currentTarget.dataset.index;
		wx.navigateTo({
			url: `/pages/FriendOrderPage/FriendOrderPage`,
		})
	},

	// 跳转好友列表
	goToFriendList:function(){
		wx.navigateTo({
			url: `/pages/FriendList/FriendList`,
		})
	},

    // 跳转提现页面
    goToWithDraw: function() {
        console.log(12)
        wx.navigateTo({
            url: `/pages/payPage/payPage?no_amount=${this.data.no_amount}&no_withdrow=${this.data.no_withdrow}&amount=${this.data.amount}&withdrow=${this.data.withdrow}`,
        })
    },

    // 跳转新手问题页面
    goToProblemPage: function() {
        wx.navigateTo({
            url: '/pages/userProblem/userProblem',
        })
    },

    // 分享
    onShareAppMessage: function(e) {
		var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
		if (e.from == 'button') {
			var img = 'https://tp.datikeji.com/a/15428757949870/wkkEhOYIpk4DpnLJ37bmDsHS4CuLQAip4qszaDlo.png';
			var title = "送你一个现金红包，我已经拿到了，你也快来领取吧！";
		} else {
			var img = '';
			var title = "[到账提醒]有这么好的事，购物领券还返现";
			
		};
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
    },

	// 朋友圈按钮点击
	generateImages: function () {
		this.drawcanvs();
	},

    // 绘制Canvas
    drawcanvs: function() {
        wx.showLoading({
			title: '正在生成红包',
            mask: true,
        });
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        let canvasImg = 'https://tp.datikeji.com/a/15422784724773/3aeBeVYPf6Jftn0gzyJRS8mfP60v5M0oFImsG9TK.png';
        let toptxt = '我已经领到新人红包，你也快来';
        let bottxt = "长按二维码领取红包";
        wx.getImageInfo({
            src: canvasImg,
            success: function(res) {
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
    showOffRecord: function() {
		let _this=this;
		wx.showLoading({
			title: '正在给红包充钱',
			mask: true,
		});
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW * 2,
            destHeight: this.data.bgimgH * 2,
            canvasId: 'canvas',
            success: function(res) {
                wx.hideLoading();
				_this.canvasSaveArgs = res;
				_this.saveCanvas(res)
            }
        })
    },

	// 保存图片
    saveCanvas: function(res) {
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function() {
                wx.showModal({
                    title: '红包准备就绪',
                    content: '记得发送到朋友圈,发送技巧请看下方',
                    showCancel: false,
                    success: function(data) {
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                });
            },
            fail: function() {
                wx.previewImage({
                    urls: [res.tempFilePath]
                })
            }
        })
    },

	// 即将上线
	theOnline: function () {
		wx.showToast({
			title: '关注公众号,申请体验资格',
			icon: 'none',
			duration: 800
		})
	},

	// 跳转微信小技巧
	goToPromptPages: function () {
		wx.navigateTo({
			url: '/pages/howInvite/howInvite',
		})
	},

})