const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        selectStar: false,
        shuffCurrent: 0,
		ifShowFirstBao: false,
		ifShowlastBao: false,
    },

    onLoad: function(options) {
        wx.hideShareMenu();
        this.setData({
            scrolloheight: wx.getSystemInfoSync().windowHeight * 2 - 92,
            scrolloheight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 92,
			pyq:app.pyq
        });

        if (app.globalData.userInfo) {
            console.log('goodif');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            console.log('goodelseif');
            app.userInfoReadyCallback = res => {
                console.log('goodindex');
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                let session_key = app.globalData.session_key;
                wxAPIF.checkUserInfo(app, res, iv, encryptedData, session_key);
            }
        } else {
            console.log('goodelse');
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                    let iv = res.iv;
                    let encryptedData = res.encryptedData;
                    let session_key = app.globalData.session_key;
                    wxAPIF.checkUserInfo(app, res, iv, encryptedData, session_key);
                }
            })
        };
        this.userID = wx.getStorageSync('user_openID');
        if (options && options.good_id) {
            this.good_id = parseInt(options.good_id);
            this.getGoodDetail(this.good_id);
            this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/index/index&scene=${wx.getStorageSync('u_id')}@${this.good_id}`;
            console.log(this.qrcodeImg);
			if (options.origin){
				this.dealwithRedbao();
			};
        };

    },

    onShow: function() {
        console.log(app.ifNewUser)
    },

    //轮播图改变事件 
    shuffChangeEvent: function(e) {
        let current = e.detail.current;
        this.setData({
            shuffCurrent: current,
        })
    },

    // 阻止分享按钮冒泡事件
    catchtap: function() {},

    // 请求商品详情
    getGoodDetail: function(good_id) {
        wx.showLoading({
            title: '正在加载宝贝',
            mask: true,
        });
        let _this = this;
        let getGoodDetailUrl = wxAPIF.domin + 'getGoodsDetail';
        wxAPIF.wxRequest(app, getGoodDetailUrl, "POST", {
            id: good_id,
            open_id: this.userID,
        }, function(res) {
            let GoodDetai = res.data.goods_promotion_url_generate_response.goods_promotion_url_list[0];
            _this.GoodDetai = GoodDetai;
            // GoodDetai.goods_detail.goods_name = util.formatStr(GoodDetai.goods_detail.goods_name, 60);
            let people = GoodDetai.goods_detail.sold_quantity;
            GoodDetai.goods_detail.sold_quantity = people >= 100000 ? parseInt((people / 10000)) + "万" : people;
            if (GoodDetai.goods_detail.coupon_end_time && GoodDetai.goods_detail.coupon_start_time) {
                GoodDetai.endtTime = util.formatTime(new Date(parseInt(GoodDetai.goods_detail.coupon_end_time) * 1000))
                GoodDetai.starttTime = util.formatTime(new Date(parseInt(GoodDetai.goods_detail.coupon_start_time) * 1000))
            } else {
                GoodDetai.endtTime = util.formatTime(new Date());
                GoodDetai.starttTime = util.formatTime(new Date());
            }

            // 处理佣金
            let rate = GoodDetai.goods_detail.promotion_rate;
            let price = (GoodDetai.goods_detail.min_group_price - GoodDetai.goods_detail.coupon_discount) / 100;

            GoodDetai.goods_detail.cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
			GoodDetai.goods_detail.parentCashBack = (price * rate / 1000 * app.globalData.comRote*0.216).toFixed(2);
            _this.setData({
                GoodDetai: GoodDetai,
                selectStar: res.type,
                gotopath: GoodDetai.we_app_info.page_path,
            });
            wx.hideLoading();
        })
    },

    // 获取用户信息
    getUserInfo: function(e) {
        console.log(e);
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
            if (btnID == "botStar") {
                this.collectionsGoodsFun();
            };
            if (btnID == "userInofBtn") {
                this.invitationNewUser();
            };
			if (btnID == "baoBtn") {
				this.lijilingqu();
			};
        }
    },

    // 返回顶部
    goToTop: function() {
        this.setData({
            topId: "goodWindow"
        })
    },

    // 返回首页
    goToIndex: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    // 收集FormID
    formSubmit: function(e) {
        let _this = this;
        let collectFormIdUrl = wxAPIF.domin + 'addForm';
        if (e.detail.formId == 'the formId is a mock one') {
            return;
        }
        let form_id = e.detail.formId;
        let data = {
            user_id: wx.getStorageSync('user_openID'),
            form_id: form_id,
        }
        wxAPIF.wxRequest(app, collectFormIdUrl, "POST", data, function(res) {
            console.log("???????")
        })
    },

    // 收藏商品
    collectionsGoodsFun: function() {
        let _this = this;
        let collectionsGoodsFunUrl = wxAPIF.domin + 'saveUserCollection';
        console.log(JSON.stringify(this.GoodDetai));
        let data = {
            open_id: this.userID,
            goods_id: this.good_id,
            goods_data: JSON.stringify(this.GoodDetai),
        }
        wxAPIF.wxRequest(app, collectionsGoodsFunUrl, "POST", data, function(res) {
            console.log(123, res)
            if (res.code == 0) {
                _this.setData({
                    selectStar: true,
                })
            };
            if (res.code == 1) {
                _this.setData({
                    selectStar: false,
                })
            };
        })
    },

    // 分享
    onShareAppMessage: function(e) {
        console.log(e);
        if (e.from == 'button') {
            var good_id = e.target.dataset.goodid;
            var img = e.target.dataset.img;
            console.log(good_id)
            var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}&good_id=${good_id}`;
            var title = `${app.globalData.userInfo.nickName}实力推荐的宝贝，购买返现还能赚钱！`;
        } else {
            var title = "我必须实力推荐这个宝贝，领券返现还能赚钱";
            var img = '';
            var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}&good_id=${good_id}`;
        };
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
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

    // 绘制Canvas
    drawcanvs: function() {
        wx.showLoading({
            title: '正在加载宝贝',
            mask: true,
        });
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        let canvasImg = 'https://tp.datikeji.com/a/15427142169424/re3PhduKY7F0JG4jkPBimK8qIt6pXcYXKsCGegkV.png';
        let price = this.data.GoodDetai.goods_detail.coupon_discount / 100;
        wx.getImageInfo({
            src: canvasImg,
            success: function(res) {
                _this.setData({
                    bgimgH: res.height,
                    bgimgW: res.width,
                });
                ctx.setFillStyle('#ffffff');
                ctx.drawImage(res.path, 0, 0, res.width, res.height);
                ctx.font = 'normal 600 80px sans-serif';
                ctx.setTextAlign('left');
                ctx.fillText(price, 436, 854);
                if (_this.data.GoodDetai.goods_detail.goods_gallery_urls[0]) {
                    if (_this.data.GoodDetai.goods_detail.goods_gallery_urls[0].indexOf("http://t00img.yangkeduo.com") == -1) {
                        _this.canvasImage = 'https://tp.datikeji.com/a/15429528497298/Hd26u90bs5rnXK6YLMLeTynnJhZW8U8xZfgSWYwc.png';
                    } else {
                        _this.canvasImage = _this.data.GoodDetai.goods_detail.goods_gallery_urls[0].replace('http', 'https');
                    }
                };
                console.log(_this.canvasImage);
                wx.getImageInfo({
                    src: _this.canvasImage,
                    success: function(res1) {
                        ctx.drawImage(res1.path, 53, 146, 540, 540);
                        wx.getImageInfo({
                            src: canvasImg,
                            success: function(res) {
                                wx.getImageInfo({
                                    src: _this.qrcodeImg,
                                    success: function(res2) {
                                        ctx.drawImage(res2.path, 28, 738, 176, 176);
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
            }
        })
    },

    // 生成临时图片
    showOffRecord: function() {
        let _this = this;
        wx.showLoading({
            title: '正在打包宝贝',
            mask: true,
        });
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW * 2,
            destHeight: this.data.bgimgH *2,
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
                    title: '宝贝准备就绪',
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

    // friendQUan按钮点击
    generateImages: function() {
        this.drawcanvs();
    },

    // 跳转微信小技巧
    goToPromptPages: function() {
        wx.navigateTo({
            url: '/pages/howInvite/howInvite',
        })
    },


	// goToGoodsList
	goToGoodsList: function (e) {
		console.log(e);
		this.setData({
			ifShowFirstBao: false,
			ifShowlastBao: false,
		});
		let goods_id = e.currentTarget.dataset.id;
		let goodsName = e.currentTarget.dataset.title;
		wx.navigateTo({
			url: `/pages/goodsList/goodsList?goodsName=${goodsName}&goods_id=${goods_id}`,
		})
	},

	// 红包弹窗处理 隐藏
	hideMask: function (e) {
		this.setData({
			ifShowFirstBao: false,
			ifShowlastBao: false,
		});
	},

	// 立即领取
	lijilingqu: function () {
		this.setData({
			ifShowFirstBao: false,
			ifShowlastBao: true,
		})
	},

	// 第一次点击红包
	firstClick: function () {
		if (!wx.getStorageSync('clickFirst')) {
			wx.setStorageSync("clickFirst", true);
			this.receiveNewPeople();
		}

	},

	// 用户领取新人奖励
	receiveNewPeople: function () {
		console.log("用户领取新人奖励");
		let _this = this;
		let receiveNewPeopleUrl = wxAPIF.domin + 'receiveNewPeople';
		wxAPIF.wxRequest(_this, receiveNewPeopleUrl, "POST", {
			open_id: wx.getStorageSync('user_openID'),
		}, function (res) {
			console.log(res);
			if (res.code == 0) { }
		})
	},

	// 处理红包函数
	dealwithRedbao:function(){
		if (app.globalData.user_order > 0) {
			this.setData({
				ifShowFirstBao: false,
				ifShowlastBao: false,
			})
		} else {
			if (wx.getStorageSync('clickFirst')) {
				this.setData({
					ifShowFirstBao: false,
					ifShowlastBao: false,
				})
			} else {
				this.setData({
					ifShowFirstBao: true,
				});
			}
		}
	},
})