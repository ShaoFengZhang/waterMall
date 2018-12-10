const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        all_money: 0,
        all_royalty: 0,
        firend_num: 0,
        ifShowClock: false,
        ifShowOne: true,
        ifShowTwo: true,
        ifShowThree: true,
		ifshowClockMask:false,
		clockprice:0,
        nAni1: "ani2",
        nAni2: "ani1",
        nAni3: "ani1",
        clockani: "ani1",
        barrageArr: [],
        botSwiper: [{
                title: '分享这些我能赚更多',
                botSwiperOne: [{
					icon: "https://tp.datikeji.com/a/15441524304270/hIMnFQdDDFyNGJI9ic1JHR8G01AeqQebOgoIV10y.png",
                        text: "高佣金",
                        opt_id: 0,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15441520843476/RnKvI3llPzoEJxqoC48g4EoZFCVjcOa7noquPOfO.png",
                        text: "高人气",
                        opt_id: 15,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15441521106987/hLbue0T8j6tjnYeKxVcyS2OeZqArYYYoMd1u3EII.png",
                        text: "高销量",
                        opt_id: 0,
                        opt_type: 6,
                    },
                ]
            },
            {
                title: '家人最喜欢的宝贝',
                botSwiperOne: [{
					icon: "https://tp.datikeji.com/a/15440923053176/046yo3FKKDs9J48bguzxLAS3K8FckcBifNHfJzpr.png",
                        text: "宝妈奶爸",
                        opt_id: 4,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15440923317178/cHYJMltlM9n5vCCYni8EjxQFXjCsK5XewJfrbuLJ.png",
                        text: "家有学霸",
                        opt_id: 3176,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15440923516584/9GZnxc3OwCsPzTLcqGUY55s2pont5y0O1xvs0vfQ.png",
                        text: "我爱我家",
                        opt_id: 818,
                        opt_type: 2,
                    },
                ]
            },
            {
                title: '我的朋友是吃货',
                botSwiperOne: [{
					icon: "https://tp.datikeji.com/a/15440923796264/Oa38xPiZc9onQ7rPJIYPhVJcWtFs344zXfORvEjU.png",
                        text: "他爱吃水果",
                        opt_id: 140,
                        opt_type: 2,

                    },
                    {
						icon: "https://tp.datikeji.com/a/15440924009425/BHvWERCULs8cMtjlbO3j3oPm0HYYAefSbGmc6GhC.png",
                        text: "她爱吃零食",
                        opt_id: 2,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15440924161519/cwfytSgGZcWRBmyrCjL1P5OIRoRfu7Ev5Y2IAXob.png",
                        text: "美酒佳酿",
                        opt_id: 109,
                        opt_type: 2,
                    },
                ]
            },
            {
                title: '爱美之心人皆有之',
                botSwiperOne: [{
					icon: "https://tp.datikeji.com/a/15440924335787/9mWx9Z0IONpcBQCELcCdsPG92RYdRMIvfd9IO6ht.png",
                        text: "潮流装扮",
                        opt_id: 14,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15440924543241/0E1Qbjonwm8Mv7xYXdwBL2QbUxOCpEZwg3EULxkI.png",
                        text: "美妆护肤",
                        opt_id: 16,
                        opt_type: 2,
                    },
                    {
						icon: "https://tp.datikeji.com/a/15440924795519/YqnWllJGHyBsBioYMcxNqT2rAVnir5wK8kUHHdBX.png",
                        text: "精美首饰",
                        opt_id: 44,
                        opt_type: 2,
                    },
                ]
            },
        ],
    },

    onLoad: function(options) {
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
        this._createLeftCloudAnimations();
        this._createRightCloudAnimations();
    },

    onShow: function() {
        this.shareSunInfo();
        this.getDataList();
        this.getbarrage();
        this.setData({
            botSwiperCurrent: 0,
        })
    },

    onHide: function() {

    },

    onShareAppMessage: function(e) {
        let path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
		let img = 'https://tp.datikeji.com/a/15440928671348/Ygc8cqwbOCE4mw4O5YjAXqrSXg8dbmuh1YnyvCZV.jpeg';
        if (e.from == 'button') {
			var title = "你不用做任何事，直接躺着种树收钱就可以了。";
        } else {
			var title = "每天只要签到就有红包，我找不到不推荐的给你的理由。";

        };
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

	// checkprice
	checkprice:function(){
		this.setData({
			ifshowClockMask: false,
		});
		wx.switchTab({
			url: '/pages/usercenter/usercenter',
		})
	},

	// IKnowClick
	IKnowClick:function(){
		this.setData({
			ifshowClockMask: false,
		})
	},

	// 跳转好友订单
	gotoFriendOrder:function(){
		wx.navigateTo({
			url: '/pages/FriendOrderPage/FriendOrderPage',
		})
	},

    // 跳转新的商品列表
    goToNewList: function(e) {
        let goodsId = e.currentTarget.dataset.goodsid;
        let title = e.currentTarget.dataset.title;
        let opt_type = e.currentTarget.dataset.opttype;
        wx.navigateTo({
            url: `/pages/newGoodsList/newGoodsList?goodsid=${goodsId}&title=${title}&opt_type=${opt_type}`,
        })
    },

    // 跳转零元购
    GotoZeroBuy: function() {
        // wx.navigateTo({
        // 	url: '/pages/zeroShopping/zeroShopping',
        // })
        wx.showToast({
            title: '此功能即将上线',
            icon: "none",
            duration: 800,
        })
    },

    //跳转如何分享页
    goToSharePage: function() {
        wx.navigateTo({
            url: '/pages/shareFriendGuide/shareFriendGuide',
        })
    },

    // 跳转分享赚攻略
    goToGoodWay: function() {
        wx.navigateTo({
            url: '/pages/makeMoneyWay/makeMoneyWay',
        })
    },

	// 跳转名片页面
	showNormolBg: function () {
		wx.navigateTo({
			url: '/pages/FriendList/FriendList?nav=user',
		})
	},

    // 收集能量
    collectEnergy: function(e) {
        let _this = this;
        let num = e.currentTarget.dataset.num;
        let goodsid = e.currentTarget.dataset.goodsid;
        this.collectEnergyUrl(goodsid);
        if (num == 'one') {
            this.setData({
                nAni1: "nAni1",
            });
            setTimeout(function() {
                _this.setData({
                    ifShowOne: false,
                });
            }, 1200)

        } else if (num == 'two') {
            this.setData({
                nAni2: "nAni2",
            });
            setTimeout(function() {
                _this.setData({
                    ifShowTwo: false,
                });
            }, 1200)
        } else if (num == 'three') {
            this.setData({
                nAni3: "nAni3",
            });
            setTimeout(function() {
                _this.setData({
                    ifShowThree: false,
                });
            }, 1200)
        };
        wx.showToast({
            title: '具体金额查看订单管理',
            icon: "none",
            duration: 1800,
        });

    },

    // 收集能量请求
    collectEnergyUrl: function(order_id) {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let collectEnergyUrl = wxAPIF.domin + 'clockEnergy';
        let data = {
            open_id: this.userID,
            order_id: order_id,
        }
        wxAPIF.wxRequest(app, collectEnergyUrl, "POST", data, function(res) {
            console.log(res);
            wx.hideLoading();
        })
    },

    // 签到函数
    saveClock: function() {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let saveClockUrl = wxAPIF.domin + 'saveClock';
        let data = {
            open_id: this.userID
        }
        wxAPIF.wxRequest(app, saveClockUrl, "POST", data, function(res) {
            console.log("签到", res);
            wx.hideLoading();
            if (res.code == 0) {
                _this.setData({
                    clockani: "CnAni3",
                });
                setTimeout(function() {
                    _this.setData({
                        ifShowClock: false,
						ifshowClockMask:true,
						clockprice:res.num
                    });
                }, 1200)

            } else {
                _this.setData({
                    clockani: "CnAni3",
                });
                setTimeout(function() {
                    _this.setData({
                        ifShowClock: false,
                    });
                }, 1200)
                wx.showModal({
                    title: '签到提示',
                    content: `${res.msg}`,
                    showCancel: false,
                    complete: function() {
                        // wx.switchTab({
                        // 	url: '/pages/shareMakes/shareMakes',
                        // })
                    }
                })
            }
        })
    },

    // 获取页面子集信息
    shareSunInfo: function() {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let shareSunInfoUrl = wxAPIF.domin + 'shareSunInfo';
        let data = {
            open_id: this.userID
        }
        wxAPIF.wxRequest(app, shareSunInfoUrl, "POST", data, function(res) {
            console.log("获取信息", res);
            wx.hideLoading();
            if (res.code == 0) {
                _this.setData({
                    all_money: (parseFloat(res.data.all_money) / 100).toFixed(2),
                    all_royalty: (parseFloat(res.data.all_royalty) / 100).toFixed(2),
                    firend_num: res.data.firend_num,
                    ifShowClock: res.data.save_clock == 0 ? true : false,
                });
            }
        });
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

    // 获取弹幕
    getbarrage: function() {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let getbarrageUrl = wxAPIF.domin + 'getBarrage';
        let data = {
            open_id: this.userID
        }
        wxAPIF.wxRequest(app, getbarrageUrl, "POST", data, function(res) {
            console.log("获取信息", res);
            wx.hideLoading();
            let PuseArr = [{
                    "userName": "省钱买分享赚已经累计为用户省下近10万元",
                    "type": 10,
                },
                {
                    "userName": "省钱买分享赚已累计为活跃用户赚了98695元",
                    "type": 10,
                },
                {
                    "userName": "省钱买分享赚活跃用户邀请新人已分到5366元",
                    "type": 10,
                },
                {
                    "userName": "官方统计指数表明邀请好友是最快省钱赚钱的方法",
                    "type": 10,
                }
            ]
            if (res.code == 0) {
                console.log(res);
				for(let i=0; i<res.data.length; i++){
					if (res.data[i].userName==null){
						res.data.splice(i,1);
					}
				}
                _this.setData({
                    barrageArr: PuseArr.concat(res.data),
                })
            }
        });
    },

    //获取数据
    getDataList: function(navType) {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let getDataListUrl = wxAPIF.domin + 'firendsOrder';
        let data = {
            open_id: this.userID,
            type: 1,
        }
        wxAPIF.wxRequest(app, getDataListUrl, "POST", data, function(res) {
			wx.hideLoading();
            if (res.code == 0) {
                let subClassArr = res.data;
                let shareClassArr = res.share_data;
                _this.subClassListArr = [];
                _this.shareClassListArr = [];
                // 子类订单
                for (let i = 0; i < subClassArr.length; i++) {
                    for (let n = 0; n < subClassArr[i].order_list.length; n++) {
                        let rate = subClassArr[i].order_list[n].promotion_rate;
                        let price = (subClassArr[i].order_list[n].order_amount) / 100;
                        subClassArr[i].order_list[n].cashBack = (price * rate / 1000 * app.globalData.comRote * 0.216).toFixed(2);
                        if (subClassArr[i].order_list[n].order_status == 1 || subClassArr[i].order_list[n].order_status == 2 || subClassArr[i].order_list[n].order_status == 3) {
                            if (subClassArr[i].order_list[n].is_clock != 1) {
                                _this.subClassListArr.push(subClassArr[i].order_list[n]);
                            }
                        }
                    }
                };
                // 分享关系订单
                for (let i = 0; i < shareClassArr.length; i++) {
                    for (let n = 0; n < shareClassArr[i].order_list.length; n++) {

                        let rate = shareClassArr[i].order_list[n].promotion_rate;
                        let price = (shareClassArr[i].order_list[n].order_amount) / 100;
                        shareClassArr[i].order_list[n].cashBack = (price * rate / 1000 * app.globalData.comRote * 0.0648).toFixed(2);
                        if (shareClassArr[i].order_list[n].order_status == 1 || shareClassArr[i].order_list[n].order_status == 2 || shareClassArr[i].order_list[n].order_status == 3) {
                            if (shareClassArr[i].order_list[n].is_clock != 1) {
                                _this.shareClassListArr.push(shareClassArr[i].order_list[n]);
                            }
                        }
                    }
                };
                let lastArrary = _this.subClassListArr.concat(_this.shareClassListArr);

                _this.setData({
                    orderList: lastArrary.reverse().slice(0, 3),
                });
                console.log(_this.data.orderList);
            }
        })
    },

    // 左边云的动画
    _createLeftCloudAnimations() {
        let _this = this;
        let animate = wx.createAnimation({
            timingFunction: "ease-in-out",
            duration: 35810
        });
        var next = true;
        setInterval(function() {
            if (next) {
                //根据需求实现相应的动画
                animate.translateX(app.windowwidth + 40).step({
                    timingFunction: "ease-in-out",
                    duration: 35800
                });
                animate.translateX(0).step({
                    timingFunction: "step-end",
                    duration: 10
                });
                next = !next;
            } else {
                animate.translateX(app.windowwidth + 40).step({
                    timingFunction: "ease-in-out",
                    duration: 35800
                });
                animate.translateX(0).step({
                    timingFunction: "step-end",
                    duration: 10
                });
                next = !next;
            }
            _this.setData({
                //导出动画到指定控件animation属性
                leftCloudAnimations: animate.export(),
            })
        }, 2000)
        // this.LeftCloudAnimation = animate.export();
    },

    // 右边云的动画
    _createRightCloudAnimations() {
        let _this = this;
        let animate = wx.createAnimation({
            timingFunction: "ease-in-out",
            duration: 35810
        });
        var next = true;
        setInterval(function() {
            if (next) {
                //根据需求实现相应的动画
                animate.translateX(-app.windowwidth - 62).step({
                    timingFunction: "ease-in-out",
                    duration: 35800
                });
                animate.translateX(0).step({
                    timingFunction: "step-end",
                    duration: 10
                });
                next = !next;
            } else {
                animate.translateX(-app.windowwidth - 62).step({
                    timingFunction: "ease-in-out",
                    duration: 35800
                });
                animate.translateX(0).step({
                    timingFunction: "step-end",
                    duration: 10
                });
                next = !next;
            }
            _this.setData({
                //导出动画到指定控件animation属性
                rightCloudAnimations: animate.export(),
            })
        }, 1000)
        // this.LeftCloudAnimation = animate.export();
    },

})