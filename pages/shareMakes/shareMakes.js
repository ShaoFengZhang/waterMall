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
        ifshowClockMask: false,
        ifShowProgess: false,
        ifShowupgradeRed: false,
        ifShowRuleMask: false,
		ifShowGuide1:false,
		ifShowGuide2:false,
        clockprice: 0,
        nAni1: "ani2",
        nAni2: "ani1",
        nAni3: "ani1",
        clockani: "ani1",
        barrageArr: [],
        smallProgessWidth: 0,
        levelICon: "/assets/01.png",
        time: util.formatTime(new Date()),
        botSwiper: [{
                title: '分享这些我能赚更多',
                botSwiperOne: [{
                        icon: "https://tp.datikeji.com/a/15447539388803/nPWBOx8hikUnrBvjTstHvSWmStAFK8j7xU5dR5c3.png",
                        text: "高佣金",
                        opt_id: 0,
                        opt_type: 2,
                    },
                    {
                        icon: "https://tp.datikeji.com/a/15447540024845/RNSSQF3TFxZwC5qOySHplrT9oDZliSCdDnxyfkxA.png",
                        text: "高人气",
                        opt_id: 15,
                        opt_type: 2,
                    },
                    {
                        icon: "https://tp.datikeji.com/a/15447540252562/ItJy6P6pMj3WUZ2VRMrwMPdLv1RRuw2M2BNfQecH.png",
                        text: "高销量",
                        opt_id: 0,
                        opt_type: 6,
                    },
                ]
            },
            {
                title: '雨雪纷纷也不怕，让我陪你过寒冬',
                botSwiperOne: [{
                        icon: "https://tp.datikeji.com/a/15447542612941/fjikUWmGCMgCjMkgBu5eogjPyydeEOrPN73nfeYk.png",
                        text: "男士冬上新",
                        opt_id: 3409,
                        opt_type: 2,
                    },
                    {
                        icon: "https://tp.datikeji.com/a/15447543862123/fxC9hx9W9hauqcHFcTCjK2EptyETxJynRuS1RuRe.png",
                        text: "女士冬上新",
                        opt_id: 3376,
                        opt_type: 2,
                    },
                    {
                        icon: "https://tp.datikeji.com/a/15447544188360/KgOpaCJoWONCGBIdzB5GzE2SnD5lM6gx7h2QzKV6.png",
                        text: "冬鞋上新",
                        opt_id: 3305,
                        opt_type: 2,
                    },
                ]
            },
            {
                title: '照亮你的美，人人换新机',
                botSwiperOne: [{
                        icon: "https://tp.datikeji.com/a/15447545959657/kry1opAM6IQxQD8wYTGXSskO830fNjESDaimmGlg.png",
                        text: "手机",
                        opt_id: 3133,
                        opt_type: 2,
                    },
                    {
                        icon: "https://tp.datikeji.com/a/15447546315634/jQSo45sn0QJ9WpZIR491TyznzGLyciW7ezzy4OnF.png",
                        text: "智能家居",
                        opt_id: 3368,
                        opt_type: 2,
                    },
                    {
                        icon: "https://tp.datikeji.com/a/15447546471974/MNCRtbGbZlTVGikE0yujCz6Ya72dWTIz3jlaCizb.png",
                        text: "智能穿戴",
                        opt_id: 3164,
                        opt_type: 2,
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
                        opt_id: 41,
                        opt_type: 2,
                    },
                ]
            },
        ],
    },

    onLoad: function(options) {
        let _this = this;
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
        this.getNowEnergy();
        this.index = 0;
    },

    onShow: function() {
        this.shareSunInfo();
        this.getDataList();
        this.getbarrage();
        this.setData({
            botSwiperCurrent: 0,
			ifShowGuide1: app.ifNewUser && !app.ShareGuide1click,
			ifShowGuide2: app.ifNewUser && !app.ShareGuide2click,
        });

        if (this.shareType) {
            this.shareType = false;
            wx.showToast({
                title: '能量值+5',
                icon: "none",
                duration: 1200,
            });
        }
    },

    onHide: function() {

    },

    // 分享
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

	// Guide1click
	Guide1click:function(){
		this.setData({
			ifShowGuide1:false,
		});
		app.ShareGuide1click=true;
	},

	// Guide2click
	Guide2click:function(){
		this.setData({
			ifShowGuide2:false,
		});
		app.ShareGuide2click = true;
	},

    // 时间选择
    bindTimeChange: function(e) {
        this.setData({
            time: e.detail.value
        })
    },

    // checkprice
    checkprice: function() {
        this.setData({
            ifShowupgradeRed: false,
        });
        wx.switchTab({
            url: '/pages/usercenter/usercenter',
        })
    },

    // IKnowClick
    IKnowClick: function() {
        this.setData({
            ifshowClockMask: false,
        })
    },

    //RuleMakIknow
    RuleMakIknow: function() {
        this.setData({
            ifShowRuleMask: !this.data.ifShowRuleMask,
        })
    },

    // upgradeKnow
    upgradeKnow: function() {
        this.setData({
            ifShowupgradeRed: false,
        })
    },

    // 预约签到
    makeAnFun: function() {
        wx.showLoading({
            title: '正在预约',
            mask: true,
        });
        let _this = this;
        let makeAnFunUrl = wxAPIF.domin + 'appointmentSign';
        let data = {
            open_id: this.userID,
            time: this.data.time,
        }
        wxAPIF.wxRequest(app, makeAnFunUrl, "POST", data, function(res) {
            wx.hideLoading();
            _this.IKnowClick();
            if (res.code == 0) {
                wx.showToast({
                    title: '预约成功',
                    icon: "none",
                })
            }
        });
    },

    // 跳转好友订单
    gotoFriendOrder: function() {
        wx.navigateTo({
            url: '/pages/FriendOrderPage/FriendOrderPage',
        })
    },

    // 跳转好友列表
    goToFriendList: function() {
        wx.navigateTo({
            url: '/pages/FriendList/FriendList',
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
        // wx.showToast({
        //     title: '此功能即将上线,敬请期待',
        //     icon: "none",
        //     duration: 800,
        // })
        wx.navigateTo({
            url: '/pages/zeroShopping/zeroShopping',
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
    showNormolBg: function() {
        wx.navigateTo({
            url: '/pages/FriendList/FriendList?nav=user',
        })
    },

    // 收集能量
    collectEnergy: function(e) {
        let _this = this;
        this.nowEnergyNum++;
        let num = e.currentTarget.dataset.num;
        let goodsid = e.currentTarget.dataset.goodsid;
        let order_sn = e.currentTarget.dataset.order_sn;
        this.collectEnergyUrl(goodsid, order_sn);
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
        setTimeout(function() {
            if (_this.nowEnergyNum == 3 && _this.canSpliceOrderArr) {
                _this.nowEnergyNum = 0;
                _this.data.orderList.splice(0, 3)
                _this.setData({
                    orderList: _this.data.orderList,
                    ifShowOne: true,
                    ifShowTwo: true,
                    ifShowThree: true,
                    nAni1: "ani2",
                    nAni2: "ani1",
                    nAni3: "ani1",
                });
                if (_this.data.orderList.length <= 3) {
                    _this.canSpliceOrderArr = false;
                }
            };
        }, 1210)
    },

    // 收集能量请求
    collectEnergyUrl: function(order_id, order_sn) {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let collectEnergyUrl = wxAPIF.domin + 'clockEnergy';
        let data = {
            open_id: this.userID,
            order_id: order_id,
            // order_sn: order_sn,
        }
        wxAPIF.wxRequest(app, collectEnergyUrl, "POST", data, function(res) {
            console.log(res);
            wx.hideLoading();
            if (res.code == 0) {
                wx.showToast({
                    title: '成长值+10',
                    icon: "none",
                    duration: 1200,
                });
                _this.getNowEnergy();
            }
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
            open_id: this.userID,
            type: 0,
        }
        wxAPIF.wxRequest(app, saveClockUrl, "POST", data, function(res) {
            console.log("签到", res);
            wx.hideLoading();
            if (res.code == 0) {
                _this.setData({
					clockani: "CnAni3",
                });
                _this.getNowEnergy();
                _this.shareSunInfo();
                setTimeout(function() {
                    _this.setData({
                        ifShowClock: false,
                        ifshowClockMask: true,
                        clockprice: res.num,
                    });
                    wx.showToast({
                        title: '成长值+8',
                        icon: "none",
                        duration: 1200,
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
                        wx.switchTab({
                            url: '/pages/shareMakes/shareMakes',
                        })
                    }
                })
            }
        })
    },

    // 快速邀请
    QuickToInvite: function() {
        if (!this.data.ifCanQuick) {
            return;
        }
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let QuickToInviteUrl = wxAPIF.domin + 'saveClock';
        let data = {
            open_id: this.userID,
            type: 1,
        }
        wxAPIF.wxRequest(app, QuickToInviteUrl, "POST", data, function(res) {
            console.log("快速邀请", res);
            wx.hideLoading();
            if (res.code == 0) {
                wx.showToast({
                    title: '能量值+5',
                    icon: "none",
                    duration: 1200,
                });
                _this.shareType = true;
                _this.getNowEnergy();
                _this.shareSunInfo();
            } else {
                wx.showModal({
                    title: '快速邀请提示',
                    content: `${res.msg}`,
                    showCancel: false,
                    complete: function() {
                        wx.switchTab({
                            url: '/pages/shareMakes/shareMakes',
                        })
                    }
                })
            }
        })
    },

    // 获取页面子集信息
    shareSunInfo: function() {
        // wx.showLoading({
        //     title: '数据加载中',
        //     mask: true,
        // });
        let _this = this;
        let shareSunInfoUrl = wxAPIF.domin + 'shareSunInfo';
        let data = {
            open_id: this.userID
        }
        wxAPIF.wxRequest(app, shareSunInfoUrl, "POST", data, function(res) {
            console.log("获取信息", res);
            // wx.hideLoading();
            if (res.code == 0) {
                _this.setData({
                    all_money: (parseFloat(res.data.all_money) / 100).toFixed(2),
                    all_royalty: (parseFloat(res.data.all_royalty) / 100).toFixed(2),
                    firend_num: res.data.firend_num,
                    ifShowClock: res.data.save_clock == 0 ? true : false,
                    ifCanQuick: res.data.save_share == 0 ? true : false,
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
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].userName == null) {
                        res.data.splice(i, 1);
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
						subClassArr[i].order_list[n].cashBack = (price * rate / 1000 * app.globalData.comRote * app.globalData.shareRote).toFixed(2);
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
						shareClassArr[i].order_list[n].cashBack = (price * rate / 1000 * app.globalData.comRote * app.globalData.shareGoodsRote).toFixed(2);
                        if (shareClassArr[i].order_list[n].order_status == 1 || shareClassArr[i].order_list[n].order_status == 2 || shareClassArr[i].order_list[n].order_status == 3) {
                            if (shareClassArr[i].order_list[n].is_clock != 1) {
                                _this.shareClassListArr.push(shareClassArr[i].order_list[n]);
                            }
                        }
                    }
                };
                let lastArrary = _this.subClassListArr.concat(_this.shareClassListArr);
                // 处理展示后续能量
                if (lastArrary.length > 3) {
                    _this.canSpliceOrderArr = true;
                } else {
                    _this.canSpliceOrderArr = false;
                }
                _this.nowEnergyNum = 0;
                _this.setData({
                    orderList: lastArrary.reverse(),
                });
                console.log(_this.data.orderList);
            }
        })
    },

    // 升级弹窗
    plantUpgrade: function() {
        clearInterval(this.progressTime);
        this.setData({
            smallProgessWidth: 0,
        });
        this.getNowEnergy();
    },

    //进度条长度增长
    progressGrowth: function(width) {
        let _this = this;
        clearInterval(this.progressTime);
        this.progressTime = setInterval(function() {
            if (_this.data.smallProgessWidth < width) {
                _this.setData({
                    smallProgessWidth: _this.data.smallProgessWidth + 4
                })
            } else {
                console.log("LLLLLLLL")
                clearInterval(_this.progressTime);
                return;
            }
        }, 25)
    },

    //判断是否领取升级红包
    whetherToUpgrade: function(score) {
        if (score > 3000) {
            this.receiveRedPackets(score, 3000);
            this.progressGrowth(70 * 6);
            return;
        } else if (score > 2000) {
            this.progressGrowth((score - 2000) * 420 / 1000);
            if (score == 3000) {
                this.receiveRedPackets(score, 3000);
            } else {
                this.receiveRedPackets(score, 2000);
            }
            return;
        } else if (score > 1000) {
            if (score == 2000) {
                this.receiveRedPackets(score, 2000);
                this.setData({
                    smallProgessWidth: 0,
                    ifShowProgess: false,
                });
                this.progressGrowth((score - 2000) * 420 / 1000);
            } else {
                this.receiveRedPackets(score, 1000);
                this.progressGrowth((score - 1000) * 420 / 1000);
            }
            return;
        } else if (score > 400) {
            if (score == 1000) {
                this.receiveRedPackets(score, 1000);
                this.setData({
                    smallProgessWidth: 0,
                    ifShowProgess: false,
                });
                this.progressGrowth((score - 1000) * 420 / 1000);
            } else {
                this.receiveRedPackets(score, 400);
                this.progressGrowth((score - 400) * 420 / 600);
            }
            return;
        } else if (score > 100) {
            if (score == 400) {
                this.receiveRedPackets(score, 400);
                this.setData({
                    smallProgessWidth: 0,
                    ifShowProgess: false,
                });
                this.progressGrowth((score - 400) * 420 / 600);
            } else {
                this.receiveRedPackets(score, 100);
                this.progressGrowth((score - 100) * 420 / 300);
            }
            return;
        } else if (score > 20) {
            if (score == 100) {
                this.receiveRedPackets(score, 100);
                this.setData({
                    smallProgessWidth: 0,
                    ifShowProgess: false,
                });
                this.progressGrowth((score - 100) * 420 / 300);
            } else {
                this.receiveRedPackets(score, 20);
                this.progressGrowth((score - 20) * 420 / 80);
            }
            return;
        } else {
            if (score == 20) {
                this.receiveRedPackets(score, 20);
                this.setData({
                    smallProgessWidth: 0,
                    ifShowProgess: false,
                });
                this.progressGrowth((score - 20) * 420 / 80);
            } else {
                this.progressGrowth(score * 420 / 20);
            }
        }
    },

    // 升级领取红包接口
    receiveRedPackets: function(nowScore, levelScore) {
        // wx.showLoading({
        //     title: '数据加载中',
        //     mask: true,
        // });
        let _this = this;
        let receiveRedPacketsUrl = wxAPIF.domin + 'upgrade';
        let data = {
            open_id: this.userID,
            growth_value: nowScore,
            all_growh_value: levelScore,
        }
        wxAPIF.wxRequest(app, receiveRedPacketsUrl, "POST", data, function(res) {
            // wx.hideLoading();
            console.log("升级领取红包", res);
            if (res.code == 0) {
                _this.setData({
                    upgradeRedNum: res.num,
                    ifShowupgradeRed: true,
                    smallProgessWidth: 0,
                });
            }

        });
    },

    // 得到现在的能量值
    getNowEnergy: function() {
        // wx.showLoading({
        //     title: '数据加载中',
        //     mask: true,
        // });
        let _this = this;
        let receiveRedPacketsUrl = wxAPIF.domin + 'upgrade';
        let data = {
            open_id: this.userID,
        }
        wxAPIF.wxRequest(app, receiveRedPacketsUrl, "Get", data, function(res) {
            console.log("得到现在的能量值", res);
            // wx.hideLoading();
            if (res.code == 0) {
                _this.setData({
                    userNowEnergy: res.growth_value,
                    ifShowProgess: res.growth_value > 0 ? true : false,
                    levelICon: res.growth_value > 19 ? (res.growth_value > 99 ? (res.growth_value > 399 ? (res.growth_value > 999 ? (res.growth_value > 1999 ? (res.growth_value > 2999 ? "/assets/06.png" : "/assets/06.png") : "/assets/05.png") : "/assets/04.png") : "/assets/03.png") : "/assets/02.png") : "/assets/01.png",
                });
                _this.whetherToUpgrade(res.growth_value);
            }
        });
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