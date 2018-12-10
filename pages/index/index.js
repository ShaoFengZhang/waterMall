const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
import config from '../../utils/config.js';
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        defaultList: [],
        selectIndex: 0,
        ShuffList: [],
        shuffCurrent: 0,
        dataList: [],
        orderMenuCurrent: 1,
        YOrder: '1',
        XOrder: '1',
        POrder: "1",
        ifShowMenu: false,
        TopClassData: config.leftClass,
        SecondTopClassData: config.leftClass[0],
        ifShowFirstBao: false,
        ifShowlastBao: false,
        ifShowSuspension: false,
    },
    onLoad: function(options) {
        let _this = this;
        this.pageCanAdd = true;
		// _this.TopLeftClassData = config.leftClass;
        if (app.globalData.userInfo) {
            console.log('if');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            console.log('elseif');
            app.userInfoReadyCallback = res => {
                console.log('index');
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
            console.log('else');
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
        this.imageNum = 0;
        this.pageIndex = 0;
        this.defaultList = [];
        this.getDefaultList();
        this.getTopClassData();

        // 获取配置信息,新人红包是否显示
        app.getConfigData = this.getConfigData;

        // 模板消息路径配置
        if (options && options.pay) {
            console.log("LLLLLLLLLLLLL")
            app.goToPayMent = this.goToPayMent;
            if (wx.getStorageSync('user_openID') && !app.callgoToPayMent) {
                this.goToPayMent();
            }
        };
        if (options && options.order) {
            console.log("SSSSSSSSSSS")
            app.goToOrderMent = this.goToOrderMent;
            if (wx.getStorageSync('user_openID') && !app.callgoToOrderMent) {
                this.goToOrderMent();
            }
        }

        // 首页参数处理
        if (options && options.user_openId) {
            wx.showLoading({
                title: '精品宝贝挑选中',
                mask: true,
            });
            this.parentId = options.user_openId;
            this.shareGoodsId = options.good_id ? options.good_id : 'no';
            console.log("LLLLLLLLL", app.callArgsDealWith)
            if (wx.getStorageSync('user_openID') && !app.callArgsDealWith) {
                this.argsDealWith();
            }
            app.argsDealWith = this.argsDealWith;
        }
        console.log('????????', options);
        if (options && options.scene) {
            console.log('SCENE');
            wx.showLoading({
                title: '精品宝贝挑选中',
                mask: true,
            });
            let scene = decodeURIComponent(options.scene);
            let parentId = scene.split('@')[0];
            let goodsid = scene.split('@')[1];
            this.parentId = parentId;
            this.shareGoodsId = goodsid;
            console.log(this.parentId);
            console.log(this.shareGoodsId);
            console.log("LLLLLLLLL", app.callArgsDealWith)
            if (wx.getStorageSync('user_openID') && !app.callArgsDealWith) {
                this.argsDealWith();
            }
            app.argsDealWith = this.argsDealWith;
        }
    },

    onShow: function() {
        if (wx.getStorageSync('user_openID')) {
            this.getConfigData();
        }
        this.setData({
            autoplay: true,
        });
    },

    onHide: function() {
        this.setData({
            autoplay: false,
        });
    },

    onPullDownRefresh: function() {},

    getUserInfo: function(e) {
        console.log(e);
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
            this.lijilingqu();
        } else {
            this.setData({
                ifShowFirstBao: false,
                ifShowlastBao: false,
                ifShowSuspension: true,
            })
        }
    },

    // 返回顶部
    goToTop: function() {
        this.setData({
            toView: "secondClass"
        })
    },

    // 获取默认数据
    getDefaultList: function(opt_id, sort_type) {
        if (!this.pageCanAdd) {
            return;
        };

        wx.showLoading({
            title: '精品宝贝挑选中',
            mask: true,
        });
        let _this = this;
        this.pageIndex++;
        this.imageNum = 0;
        let getIndexListUrl = wxAPIF.domin + 'getGoodsList';
        let paegSize = 30;
        this.sort_type = sort_type ? sort_type : '';
        this.opt_id = opt_id ? opt_id : '';
        let data = {
            page: this.pageIndex,
            paeg_size: paegSize,
            opt_id: opt_id ? opt_id : '',
            sort_type: sort_type ? sort_type : ''
        }
        wxAPIF.wxRequest(app, getIndexListUrl, "POST", data, function(res) {

            for (let i = 0; i < res.data.goods_search_response.goods_list.length; i++) {
                // res.data.goods_search_response.goods_list[i].goods_name = util.formatStr(res.data.goods_search_response.goods_list[i].goods_name, 40);

                // 处理人数显示
                let people = res.data.goods_search_response.goods_list[i].sold_quantity;
                res.data.goods_search_response.goods_list[i].sold_quantity = people >= 100000 ? parseInt((people / 10000)) + "万" : people;

                // 处理佣金
                let rate = res.data.goods_search_response.goods_list[i].promotion_rate;
                let price = (res.data.goods_search_response.goods_list[i].min_group_price - res.data.goods_search_response.goods_list[i].coupon_discount) / 100;

                res.data.goods_search_response.goods_list[i].cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
            };

            _this.defaultList = _this.defaultList.concat(res.data.goods_search_response.goods_list);
            _this.setData({
                defaultList: _this.defaultList,
                ShuffList: _this.defaultList.slice(0, 3),
            });
            if (res.data.goods_search_response.goods_list.length < 30 || res.data.goods_search_response.goods_list.length == 0) {
                _this.pageCanAdd = false;
            }
        })
    },

    // 得到顶部分类数据
    getTopClassData: function() {
        let _this = this;
        let getTopClassDataUrl = wxAPIF.domin + 'getCategory';
        wxAPIF.wxRequest(app, getTopClassDataUrl, "POST", {}, function(res) {
            console.log(res);
            if (res.code == 0) {
				_this.TopLeftClassData = res.data;
				app.TopLeftClassData = res.data;
                _this.setData({
                    TopClassData: res.data,
                    SecondTopClassData: res.data[0],
                })
            } else {
				_this.TopLeftClassData = config.leftClass;
				app.TopLeftClassData = config.leftClass;
				_this.setData({
					TopClassData: config.leftClass,
					SecondTopClassData: config.leftClass[0],
				})
            }

        })
    },

    // 顶部分类点击事件
    topClassClick: function(e) {
        let optID = e.currentTarget.dataset.optid;
        let index = parseInt(e.currentTarget.dataset.index);
        if (index == this.data.selectIndex) {
            return;
        };
        this.pageIndex = 0;
        this.pageCanAdd = true;
        this.setData({
            selectIndex: index,
            toView: 'secondClass',
            optID: optID == 0 ? "" : optID,
			SecondTopClassData: this.TopLeftClassData[index]
        });
        this.defaultList = [];
        if (index == 0) {
            this.getDefaultList();
        } else {
            this.getDefaultList(optID); //默认为综合排序
        }
    },

    // 顶部排序菜单点击事件
    orderMenuClick: function(e) {
        let index = e.currentTarget.dataset.menuindex;
        if ((index == 3 || index == 4 || index == 2) && index == this.data.orderMenuCurrent) {
            this.pageIndex = 0;
            this.defaultList = [];
            this.pageCanAdd = true;
            this.setData({
                orderMenuCurrent: index,
                YOrder: index == 3 ? (this.data.YOrder == 3 ? '2' : '3') : '1',
                XOrder: index == 4 ? (this.data.XOrder == 3 ? '2' : '3') : '1',
                POrder: index == 2 ? (this.data.POrder == 3 ? '2' : '3') : '1',
                toView: 'dataListBox',
            });
            if (index == 3) {
                this.getDefaultList(this.data.optID, this.data.YOrder == 3 ? 8 : 7) //优惠券排列
            };
            if (index == 4) {
                this.getDefaultList(this.data.optID, this.data.XOrder == 3 ? 6 : 5) //销量排列
            };
            if (index == 2) {
                this.getDefaultList(this.data.optID, this.data.POrder == 2 ? 3 : 4) //价格排列
            };
        };
        if (index == this.data.orderMenuCurrent) {
            return;
        };
        this.setData({
            orderMenuCurrent: index,
            YOrder: index == 3 ? '3' : "1",
            XOrder: index == 4 ? '3' : "1",
            POrder: index == 2 ? '2' : "1",
            toView: 'dataListBox',
        });
        this.pageIndex = 0;
        this.defaultList = [];
        this.pageCanAdd = true;
        if (index == 1) {
            this.getDefaultList(this.data.optID, 0) //综合排列
        };
        if (index == 2) {
            this.getDefaultList(this.data.optID, 3) //价格升序排列
        };
        if (index == 3) {
            this.getDefaultList(this.data.optID, 8) //优惠券降序排列
        };
        if (index == 4) {
            this.getDefaultList(this.data.optID, 6) //销量降序排列
        };
    },

    // 跳转到搜索页
    goToSearch: function() {
		wx.switchTab({
			url: '/pages/search/search',
		});
    },

    //轮播图改变事件 
    shuffChangeEvent: function(e) {
        let current = e.detail.current;
        this.setData({
            shuffCurrent: current,
        })
    },

    // scroolview滑动事件
    topScrollChange: function(e) {
        let scrollTop = e.detail.scrollTop * 750 / app.sysWidth;
        if (this.data.selectIndex == 0) {
            return;
        }
        if (parseInt(scrollTop) >= 700) {
            this.ifscrollB = false;
            if (!this.ifscrollT) {
                this.ifscrollT = true;
                this.setData({
                    ifShowMenu: true,
                });

                // this.pageIndex = 0;
                // this.defaultList = [];
            }

        } else {
            this.ifscrollT = false;
            if (!this.ifscrollB) {
                this.ifscrollB = true;
                this.setData({
                    ifShowMenu: false,
                })

                // this.pageIndex = 0;
                // this.defaultList = [];
            }

        }
    },

    // 图片加载事件
    imageLoad: function() {
        this.imageNum++;
        if ((this.imageNum % 30) == 0) {
            wx.hideLoading();
            return;
        }
        wx.hideLoading();
    },

    // 跳转商品详情事件
    goTodetail: function(e) {
        wx.showLoading({
            title: 'loading',
            mask: true,
        });
        let good_id = e.currentTarget.dataset.goodid;
        setTimeout(function() {
            wx.navigateTo({
                url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
            });
            wx.hideLoading();
        }, 1000)

    },

    // 跳转MailList事件
    gotoMailList: function(e) {
        let navType = e.currentTarget.dataset.type;
        let navTitle = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `/pages/goodMailList/goodMailList?navType=${navType}&navTitle=${navTitle}`,
        })
    },

    // 阻止分享按钮冒泡事件
    catchtap: function() {},

    // 下拉刷新数据
    dropDownRefresh: function() {
        this.getDefaultList(this.opt_id, this.sort_type);
    },

    // 分享
    onShareAppMessage: function(e) {
        if (e.from == 'button') {
            var good_id = e.target.dataset.goodid;
            var img = e.target.dataset.img;
            var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}&good_id=${good_id}`;
            var title = "我必须实力推荐这个宝贝，领券返现还能赚钱";
        } else {
            var title = "@所有人 省钱秘籍等你拿，动动手指就到家。";
            var img = 'https://tp.datikeji.com/a/15428752701695/e90GTmiwG1LWaPF6K8UQLoiZtLjI2LA0Okwn2EEx.png';
            var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        };
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    // 即将上线
    theOnline: function() {
        wx.showToast({
            title: '此功能即将上线,敬请期待',
            icon: 'none',
            duration: 800
        })
    },

    // 收集FormId
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

    // goToGoodsList
    goToGoodsList: function(e) {
        console.log(e);
        this.setData({
            ifShowFirstBao: false,
            ifShowlastBao: false,
            ifShowSuspension: true,
        });
        let goods_id = e.currentTarget.dataset.id;
        let goodsName = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `/pages/goodsList/goodsList?goodsName=${goodsName}&goods_id=${goods_id}`,
        })
    },

    // 红包弹窗处理 隐藏
    hideMask: function(e) {
        console.log(e);
        console.log("hideMask");
        this.setData({
            ifShowFirstBao: false,
            ifShowlastBao: false,
            ifShowSuspension: true,
        });
    },

    // 立即领取
    lijilingqu: function() {
        this.setData({
            ifShowFirstBao: false,
            ifShowlastBao: true,
        })
    },

    // 获取配置数据
    getConfigData: function() {
        let _this = this;
        let getConfigDataUrl = wxAPIF.domin + 'isExamine';
        wxAPIF.wxRequest(_this, getConfigDataUrl, "POST", {
            open_id: wx.getStorageSync('user_openID')
        }, function(res) {
            console.log(res);
            if (res.code == 0) {
                app.globalData.firstTimeWidthDraw = res.data.one;
                app.globalData.subsequenWidthDraw = res.data.three;
                app.globalData.singleTopWidthDraw = res.data.two;
				app.pyq=res.data.pyq;
                // 处理显示不显示红包

                if (res.data.user_order > 0) {
                    app.globalData.user_order = res.data.user_order;
                    _this.setData({
                        ifShowSuspension: false,
                        ifShowFirstBao: false,
                        ifShowlastBao: false,
                    })
                } else {
                    if (wx.getStorageSync('clickFirst')) {
                        _this.setData({
                            ifShowSuspension: true,
                            ifShowFirstBao: false,
                            ifShowlastBao: false,
                        })
                    } else {
                        _this.setData({
                            ifShowFirstBao: true,
                            ifShowSuspension: false,
                            ifShowlastBao: false,
                        });
                    }
                }

            }
        })
    },

    // 第一次点击红包
    firstClick: function() {
        if (!wx.getStorageSync('clickFirst')) {
            wx.setStorageSync("clickFirst", true);
            this.receiveNewPeople();
        }

    },

    // 显示第一个红包
    showFirstBao: function() {
        if (this.data.hasUserInfo) {
            this.setData({
                ifShowlastBao: true,
            })
        } else {
            this.setData({
                ifShowFirstBao: true,
            })
        }

    },

    // 首页参数处理函数
    argsDealWith: function() {
        app.callArgsDealWith = false;
        console.log("首页处理函数");
        console.log(this.parentId);
        console.log(app.user_OpenId);
        console.log(this.parentId == app.user_OpenId);
        console.log(this.shareGoodsId);
        // 判断两个ID是否相等
        if (this.parentId != app.u_id) {
            // 绑定父子关系
            this.bindParent();
        } else {
            if (this.shareGoodsId != 'no') {
                wx.navigateTo({
                    url: `/pages/goodsDetails/goodsDetails?good_id=${this.shareGoodsId}`,
                })
            }
        }
    },

    // 绑定父子集关系
    bindParent: function() {
        let _this = this;
        let bindParentUrl = wxAPIF.domin + 'bindParent';
        wxAPIF.wxRequest(_this, bindParentUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            parent_id: this.parentId,
        }, function(res) {
            console.log("绑定父子关系");
            console.log(res);
            if (res.code == -1) {
                wx.hideLoading();
                wx.showModal({
                    title: '温馨提示',
                    content: '网络错误,请稍后再试',
                    showCancel: false,
                    success: function() {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    },
                })
            } else {
                if (_this.shareGoodsId != 'no') {
                    _this.bindShare();
                } else {
                    wx.hideLoading();
                }
            }
        })
    },

    // 绑定分享关系
    bindShare: function() {
        console.log("绑定分享关系 ");
        let _this = this;
        let bindShareUrl = wxAPIF.domin + 'bindShare';
        console.log("???", this.parentId, '???????', this.shareGoodsId, '????', wx.getStorageSync('user_openID'))
        wxAPIF.wxRequest(_this, bindShareUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            share_id: this.parentId, //分享者ID
            goods_id: this.shareGoodsId //分享货物ID
        }, function(res) {
            console.log(res);
            wx.hideLoading();
            if (res.code == -1) {
                wx.showModal({
                    title: '温馨提示',
                    content: '网络错误,请稍后再试',
                    showCancel: false,
                    success: function() {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    },
                })
            } else {
                // if (!_this.data.ifShowFirstBao) {
                wx.navigateTo({
                    url: `/pages/goodsDetails/goodsDetails?good_id=${_this.shareGoodsId}&&origin=index`,
                })
                // }
                return;
            }
        })
    },

    // 用户领取新人奖励
    receiveNewPeople: function() {
        console.log("用户领取新人奖励");
        let _this = this;
        let receiveNewPeopleUrl = wxAPIF.domin + 'receiveNewPeople';
        wxAPIF.wxRequest(_this, receiveNewPeopleUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
        }, function(res) {
            console.log(res);
            if (res.code == 0) {}
        })
    },

    //跳转如何分享页
    goToSharePage: function() {
        wx.navigateTo({
            url: '/pages/shareFriendGuide/shareFriendGuide',
        })
    },

    // 跳转收支明细
    goToPayMent: function() {
        app.callgoToPayMent = false;
        wx.navigateTo({
            url: '/pages/paymentDetails/paymentDetails',
        })
    },

    //跳转我的订单
    goToOrderMent: function() {
        app.callgoToOrderMent = false;
        wx.navigateTo({
            url: `/pages/orderManagement/orderManagement?templateInfo=123`,
        })
    },
})