const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        shareBtnTxt: '领取机会',
        ifShowLingqu: false,
        iniviteNumber: 3,
		ifShowTopBgNew:false,
		ifShowRuleMask:false,
		ifShowNewUserMask:false,
    },

    onLoad: function(options) {
        this.userID = wx.getStorageSync('user_openID');
        
		this.setData({
			ifShowTopBgNew: app.ifNewUser && (options.shareNew),
		})
    },

    onShow: function() {
		this.getGoodsList();
	},

    // 分享
    onShareAppMessage: function(e) {
        console.log(e);
        if (e.from == 'button') {
            if (e.target.id == "contineShare") {
				var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}&level=${this.data.zero_level}`;
                var title = "老铁快来0元抢宝贝，不要白不要";
                var img = '';
            };
            if (e.target.id == "shareGoodBtn") {
				var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
                var good_id = e.target.dataset.goodid;
                var img = e.target.dataset.img;
                var title = `老铁快来0元抢宝贝，不要白不要`;
            }

        } else {
			var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
            var title = "好吃不过汤圆，好东西居然只要0元";
            var img = '';
        };
		console.log(path);
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    catchtap: function() {},

    // 跳转规则
    goToRulerPage: function() {
		this.setData({
			ifShowRuleMask: !this.data.ifShowRuleMask,
		})
    },

	// 红包去首页
	goToIndex:function(){
		this.setData({
			ifShowNewUserMask: false,
		});
		wx.switchTab({
			url: '/pages/index/index',
		})
	},

    // 跳转商品详情事件
    goTodetail: function(e) {
        if (this.data.zero_num <=0) {
            wx.showToast({
                title: '您暂时没有0元购机会',
                icon: "none",
                duration: 1200,
            });
            return false;
        }
        wx.showLoading({
            title: 'loading',
            mask: true,
        });
        let good_id = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}&order_type=${1}`,
        });
        wx.hideLoading();

    },

    // 领取机会
    zeroReceiveChance: function() {
        if (this.data.zero_level > 3) {
            wx.showToast({
                title: '新一轮0元购活动筹备中',
                icon: "none",
                duration: 1200,
            });
            return;
        }
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let zeroReceiveChanceUrl = wxAPIF.domin + 'zeroReceive';
        let data = {
            open_id: this.userID,
            zero_level: this.data.zero_level,
        }
        wxAPIF.wxRequest(app, zeroReceiveChanceUrl, "POST", data, function(res) {
            wx.hideLoading();
            if (res.code == 0) {
                _this.getGoodsList();
            }

        })
    },

	//帮助0元购
	helpFriendBuy:function(){
		this.setData({
			ifShowNewUserMask: true,
		})
	},

    // 获取数据
    getGoodsList: function() {
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let getGoodsListUrl = wxAPIF.domin + 'zeroBuy';
        let data = {
            open_id: this.userID,
        }
        wxAPIF.wxRequest(app, getGoodsListUrl, "POST", data, function(res) {
            wx.hideLoading();
            console.log(res);
            if (res.code == 0) {
                for (let i = 0; i < res.data.user.length; i++) {
					if (res.data.user[i].pic == null) {
						res.data.user[i].pic = '/assets/defaultIcon.png'
                    }
                };
				if ((res.data.zero_level == 1 && res.data.user.length == 4) || (res.data.zero_level == 2 && res.data.user.length == 5) || (res.data.zero_level == 3 && res.data.user.length == 6)) {
                    _this.setData({
                        ifShowLingqu: true,
                    })
                } else {
                    _this.setData({
                        ifShowLingqu: false,
                    })
                }
                if (res.data.zero_level > 3) {
                    _this.setData({
                        ifShowLingqu: true,
                        shareBtnTxt: '新一轮0元购活动筹备中',
                    })
                }
                _this.setData({
                    zero_level: res.data.zero_level,
                    zero_num: res.data.zero_num,
                    user_num: res.data.user_num,
                    goodslistArr: res.data.goods_list,
					userList:res.data.user,
					shareUserNum: res.data.zero_level == 1 ? 4 : res.data.zero_level==2?5:6
                });
				console.log(_this.data.userList)
            }
        })
    },
})