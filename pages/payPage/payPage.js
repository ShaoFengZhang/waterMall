const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        ifShowRule: false,
		ifShowfanXian:false,

    },

    onLoad: function(options) {
        if (options) {
            this.setData({
                amount: options.amount,
                no_amount: options.no_amount,
                no_withdrow: options.no_withdrow,
				withdrow: options.withdrow,
                firstTimeWidthDraw: app.globalData.firstTimeWidthDraw,
                subsequenWidthDraw: app.globalData.subsequenWidthDraw,
                singleTopWidthDraw: app.globalData.singleTopWidthDraw,
            })
        };
		this.open_id = wx.getStorageSync("user_openID");
    },

    onShow: function() {

    },

    // 提现
	withDrawFun: function() {
        wx.showLoading({
            title: 'loading',
            mask: true,
        });
        if (parseFloat(this.data.no_withdrow) == 0) {
            wx.hideLoading();
            wx.showModal({
                title: '提现失败',
                content: `没有可提现余额`,
                showCancel: false,
                success: function(res) {

                }
            });
            return;
        } else {
			let withDrawUrl = wxAPIF.domin + `withDrow`;
			wxAPIF.wxRequest(app, withDrawUrl, "POST", {
				open_id: this.open_id,
            }, function(data) {
                console.log('withDrawUrl', data);
                wx.hideLoading();
                if (data.code == 0) {
                    wx.showModal({
                        title: '提现成功',
						content: `恭喜你,提现成功!`,
                        showCancel: false,
                        success: function(res) {
							wx.switchTab({
								url: '/pages/usercenter/usercenter'
							})
                        }
                    })

                } else {
					let content = data.msg ? data.msg:"请稍后重试";
                    wx.showModal({
                        title: '提现失败',
						content: content,
                        showCancel: false,
                        success: function(res) {
                        }
                    })
                }
            })
        }
    },

    // 跳转收支明细
    goToPayment: function() {
        wx.navigateTo({
            url: '/pages/paymentDetails/paymentDetails',
        })
    },

    // 规则提示框
    ifShowRuleBox: function() {
        this.setData({
            ifShowRule: !this.data.ifShowRule
        })
    },

	daiFanXianRouler:function(){
		this.setData({
			ifShowfanXian: !this.data.ifShowfanXian,
		})
	},

    // 分享
    onShareAppMessage: function() {
        return {
            title: '没一会儿已经赚了这么多钱，而且提现即时到账。好爽呢...',
			path: `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`,
        }
    },

	// gotoDetailRule
	gotoDetailRule:function(){
		wx.navigateTo({
			url: '/pages/DetailRule/DetailRule',
		})
	},
})