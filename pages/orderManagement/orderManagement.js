const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        selcetIndex: 1,
        orderList: [],
        invalid: false,
        ifShowUserData: true,
        scrollHeight: "74vh",
        ifloadingup: false,
    },

    onLoad: function(options) {
        this.userID = wx.getStorageSync('user_openID');
        if (options && options.no_amount) {
            this.no_amount = options.no_amount;
            this.no_withdrow = options.no_withdrow;
            this.navType = options.navType;
            this.setData({
                no_amount: this.no_amount,
                no_withdrow: this.no_withdrow,
                selcetIndex: this.navType,
                ifShowUserData: true,
                scrollHeight: "74vh",
            });
            this.pageIndex = 0;
            this.defaultList = [];
            this.pageCanAdd = true;
            this.getDataList(this.navType);
        };
        if (options && options.templateInfo) {
            this.navType = 7;
            this.setData({
                selcetIndex: this.navType,
                ifShowUserData: false,
                scrollHeight: "86vh",
            });
            this.pageIndex = 0;
            this.defaultList = [];
            this.pageCanAdd = true;
            this.getDataList(this.navType);
            this.getConfigData();
        }
    },

    onShow: function() {

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
				app.pyq = res.data.pyq;
            }
        })
    },

    //获取数据
    getDataList: function(navType) {
        console.log(this.pageCanAdd);
        if (!this.pageCanAdd) {
            wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 800,
            });
            return;
        };
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let getDataListUrl = wxAPIF.domin + 'userOrder';
        this.pageIndex++;
        let data = {
            open_id: this.userID,
            type: navType,
            page: this.pageIndex
        }
        wxAPIF.wxRequest(app, getDataListUrl, "POST", data, function(res) {
            console.log(123, res);
            if (res.code == 0) {
                for (let i = 0; i < res.data.length; i++) {
                    let rate = res.data[i].promotion_rate;
                    let price = (res.data[i].order_amount) / 100;

                    res.data[i].cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
                }
                _this.defaultList = _this.defaultList.concat(res.data);
                for (let i = 0; i < _this.defaultList.length; i++) {
                    if (_this.defaultList[i].order_status == -1) {
                        _this.defaultList.splice(i, 1);
                    }
                }
                _this.setData({
                    orderList: _this.defaultList,
                    ifloadingup: true,
                });
                if (res.data.length < 30 || res.data.length == 0) {
                    _this.pageCanAdd = false;
                };
            };
            wx.hideLoading();
        })
    },

    // 收集FormID
    collectFormId: function(e) {
		console.log(1311313);
        let _this = this;
        let collectFormIdUrl = wxAPIF.domin + 'addForm';
        let form_id = e.detail.formId;
        let data = {
            user_id: this.userID,
            form_id: form_id,
        }
        wxAPIF.wxRequest(app, collectFormIdUrl, "POST", data, function(res) {})
    },

    // 下拉刷新数据
    dropDownRefresh: function() {
        this.getDataList(this.data.selcetIndex);
    },

    // 返回首页
    goToHome: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    // 跳转商品详情事件
    goTodetail: function(e) {
        wx.showLoading({
            title: 'loading',
            mask: true,
        });
        let good_id = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
        });
        wx.hideLoading();

    },

    // 顶部选择类别点击事件
    topSelectClick: function(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        if (index == this.data.selcetIndex) {
            return;
        };
        this.pageIndex = 0;
        this.defaultList = [];
        this.pageCanAdd = true;
        this.setData({
            selcetIndex: index,
            topview: "orderListItem0",
        });
        this.getDataList(index);
    },

    // 分享
    onShareAppMessage: function() {
        return {
            title: '购物居然可以这么省钱，还返现。系统漏洞么？快来买买买',
            path: `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`,
        }
    },

    // 阻止分享按钮冒泡事件
    catchtap: function() {},
})