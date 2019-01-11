const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        firend_num: 0,
        all_money: 0,
        friendList: [],
        ifloadingup: false,
        ifShowNormolBg: true,
    },

    onLoad: function(options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            }
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            })
        };

		
        this.setData({
            scrolloheight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 580,
        });
        this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/index/index&scene=${wx.getStorageSync('u_id')}@no`;
        console.log(this.qrcodeImg);
        this.setData({
            qrcodeImg: this.qrcodeImg,
        })
        this.getData();
		if (options && options.nav) {
			this.setData({
				ifShowNormolBg: false,
			});
			wx.setNavigationBarTitle({
				title: '我的邀请码'
			});
		}
    },

    // 获取用户信息
    getUserInfo: function(e) {
        let btnID = e.currentTarget.id;
        if (e && e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            });
            let iv = e.detail.iv;
            let encryptedData = e.detail.encryptedData;
            let session_key = app.globalData.session_key;
            wxAPIF.checkUserInfo(app, e.detail, iv, encryptedData, session_key);
            if (btnID == "baoBtn") {
                this.showNormolBg();
            };
        } else {
            wx.showToast({
                title: '专属二维码需要授权哦~',
                icon: 'none',
                duration: 800,
            })
        }
    },

    // 获取数据
    getData: function() {
        console.log("获取数据");
		wx.showLoading({
			title: 'loading',
			mask: true,
		});
        let _this = this;
        let firendsListUrl = wxAPIF.domin + 'firendsList';
        wxAPIF.wxRequest(_this, firendsListUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
        }, function(res) {
            if (res.code == 0) {
                console.log(res);
                if (res.data.firends.length > 0) {
                    for (let i = 0; i < res.data.firends.length; i++) {
                        res.data.firends[i].firend_money = (parseFloat(res.data.firends[i].firend_money) / 100).toFixed(2);
						res.data.firends[i].firend_no_money = (parseFloat(res.data.firends[i].firend_no_money) / 100).toFixed(2);
                    }
                }
                _this.setData({
                    friendList: res.data.firends,
                    father_name: res.data.father_name,
                    father_pic: res.data.father_pic,
                    firend_num: res.data.firend_num,
                    all_money: (res.data.all_money / 100).toFixed(2),
                    ifloadingup: true,
                })
            };
			wx.hideLoading();
        })
    },

    //展示名片
    showNormolBg: function() {
		wx.setNavigationBarTitle({
			title: '我的邀请码'
		});
        this.setData({
            ifShowNormolBg: !this.data.ifShowNormolBg,
        });
		
    },

    // 分享
    onShareAppMessage: function(e) {
        console.log(e);
        var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        if (e.from == 'button') {
            let shareID = e.target.id;
            if (shareID == "friendShareID") { //子类后边的邀请
                var title = "老铁，最近省钱商城又上了很多优质商品了。快回来挑点吧。";
                var img = 'https://tp.datikeji.com/a/15428754566915/zPr5iO24OHKhllzmHyx0dpLe1d6GEK0rTm43COCE.png'; //待制作召回
            };
            if (shareID == "shareID") { //父类后边的邀请
                var title = "送你一个现金红包，我已经拿到了，你也快来领取吧！";
                var img = 'https://tp.datikeji.com/a/15428755321043/QfEACZQ0VacJMG5LYwDdPmumpJEM9fENCy9qZqBj.png'; //待制做新人
            };
        } else {
            var title = "请你做我的VIP好友，大家有钱一起赚。";
            var img = 'https://tp.datikeji.com/a/15428755321043/QfEACZQ0VacJMG5LYwDdPmumpJEM9fENCy9qZqBj.png'; //待制作胶囊
        };
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    //生成二维码
    GenerateQr: function() {
        this.drawcanvs();
    },

    // 绘制Canvas
    drawcanvs: function() {
        wx.showLoading({
            title: '正在生成名片',
            mask: true,
        });
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        let canvasImg = '../../assets/qrbg.png';
        let bottxt = "长按识别二维码，大家一起来赚钱";
        let toptxt = "我的邀请码";
        let uerName = app.globalData.userInfo.nickName;
        let userImg = app.globalData.userInfo.avatarUrl;
        wx.getImageInfo({
            src: canvasImg,
            success: function(res) {
                ctx.drawImage(canvasImg, 0, 0, res.width, res.height);
                ctx.setFillStyle('#797979');
                ctx.setFontSize(28);
                ctx.setTextAlign('center');
                ctx.fillText(bottxt, res.width / 2, 790);
                ctx.setFontSize(26);
                ctx.setTextAlign('left');
                ctx.fillText(toptxt, 202, 138);
                ctx.setFillStyle('#333333');
                ctx.fillText(uerName, 202, 88);
                wx.getImageInfo({
                    src: userImg,
                    success: function(res2) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(114, 100, 60, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(res2.path, 54, 40, 120, 120);
                        ctx.restore();
                        ctx.beginPath();
                        ctx.setLineWidth(2);
                        ctx.arc(114, 100, 62, 0, 2 * Math.PI);
                        ctx.setStrokeStyle('rgba(237,73,64,0.3)');
                        ctx.stroke();
                        wx.getImageInfo({
                            src: _this.qrcodeImg,
                            success: function(res1) {
                                ctx.drawImage(res1.path, 74, 196, 530, 537);
                                ctx.draw();
                                setTimeout(function() {
                                    wx.hideLoading();
                                    _this.showOffRecord();
                                }, 1000)

                            }
                        })
                    }
                })



            }
        })
    },

    // 生成临时图片
    showOffRecord: function() {
        let _this = this;
        wx.showLoading({
			title: '正在保存名片',
            mask: true,
        });
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW * 2,
            destHeight: this.data.bgimgH * 2,
            canvasId: 'canvas',
            success: function(res) {
                wx.hideLoading();
                _this.canvasSaveArgs = res;
                _this.saveCanvas(res);
				wx.setNavigationBarTitle({
					title: '好友列表'
				});
				_this.setData({
					ifShowNormolBg: !_this.data.ifShowNormolBg,
				});
            }
        })
    },

    // 保存图片
    saveCanvas: function(res) {
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function() {
                wx.showModal({
                    title: '名片生成成功',
                    content: `记得发送到${app.pyq}哦~`,
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

    catchtap: function() {},
})