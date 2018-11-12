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
		withdrow:0,
		ifShowServiceMask:false,
    },

    onLoad: function(options) {
        this.userID = wx.getStorageSync('user_openID');
        // this.getDataFun();
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
					all_amount: (parseFloat(res.data.all_amount)/100).toFixed(2), //累计省钱
					amount: (parseFloat(res.data.amount)/100).toFixed(2), //钱包
					no_amount: (parseFloat(res.data.no_amount)/100).toFixed(2), //待返现
					user_collection: res.data.user_collection,
					no_withdrow: (parseFloat(res.data.no_withdrow) / 100).toFixed(2), //未提现/已返现
					withdrow: (parseFloat(res.data.withdrow) / 100).toFixed(2)
                })
            };
			wx.hideLoading();
        })
    },

    // 即将上线
    theOnline: function() {
        wx.showToast({
            title: '此功能即将上线,敬请期待',
            icon: 'none',
            duration: 800
        })
    },

    // 跳转服务客服
    goToCustomer: function(e) {
        let num = e.currentTarget.dataset.type;
		this.setData({
			ifShowServiceMask:true,
			serviceNum: num,
		})
    },

	closeMask:function(){
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
		let navType=e.currentTarget.dataset.index;
        wx.navigateTo({
			url: `/pages/orderManagement/orderManagement?no_amount=${this.data.no_amount}&no_withdrow=${this.data.no_withdrow}&navType=${navType}`,
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
	onShareAppMessage: function () {
		var title = "[到账提醒]有这么好的事，购物领券还返现";
		var img = '/assets/shareIcon.png';
		var path = `/pages/index/index?user_openId=${wx.getStorageSync('user_openID')}`;
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
	},
})