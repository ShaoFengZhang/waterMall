const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        defaultList: [],
		ifloadingup:false,
    },

    onLoad: function(options) {
        this.userID = wx.getStorageSync('user_openID');
    },

    onShow: function() {
		this.setData({
			defaultList: [],
			ifloadingup: false,
		})
        this.pageIndex = 0;
        this.defaultList = [];
        this.pageCanAdd = true;
        this.getBabyData();
    },

	// 返回顶部
	goToTop: function () {
		this.setData({
			toView: "dataListBox"
		})
	},

    // 获取数据
    getBabyData: function() {
        if (!this.pageCanAdd) {
			wx.showToast({
				title: '没有更多数据了',
				icon:'none',
				duration:800,
			})
            return;
        }
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
        let getBabyDataUrl = wxAPIF.domin + 'saveUserCollection';
        this.pageIndex++;

        let data = {
            open_id: this.userID,
            page: this.pageIndex,
        }
        wxAPIF.wxRequest(app, getBabyDataUrl, "GET", data, function(res) {
            if (res.code == 1) {
                for (let i = 0; i < res.data.length; i++) {
                    _this.data.defaultList.push(JSON.parse(res.data[i].goods_data));
                };
				if (_this.data.defaultList.length < 30 || _this.data.defaultList.length==0) {
                    _this.pageCanAdd = false;
                }
                for (let i = 0; i < _this.data.defaultList.length; i++) {
                    // 处理佣金
                    let rate = _this.data.defaultList[i].goods_detail.promotion_rate;
                    let price = (_this.data.defaultList[i].goods_detail.min_group_price - _this.data.defaultList[i].goods_detail.coupon_discount) / 100;

					_this.data.defaultList[i].cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
                }
                _this.defaultList = _this.defaultList.concat(_this.data.defaultList);
                _this.setData({
                    defaultList: _this.defaultList,
					ifloadingup:true,
                });
                if (_this.data.defaultList.length == 0) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '还没有收藏宝贝哦!',
                        icon: 'none',
                        duration: 1200,
                    })
                };
            }

        })
    },

    // 下拉刷新数据
    dropDownRefresh: function() {
		this.getBabyData();
    },

    // 跳转商品详情事件
    goTodetail: function(e) {
        let good_id = e.currentTarget.dataset.goodid;
        console.log(good_id);
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
        })
    },

    // 图片加载完成
    imageLoad: function() {
        this.imageNum++;
        if ((this.imageNum % 30) == 0) {
            wx.hideLoading();
            return;
        }
        wx.hideLoading();
    },

	//回到首页
    goToIndex: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    // 阻止分享按钮冒泡事件
    catchtap: function() {},

    // 分享
    onShareAppMessage: function(e) {
        if (e.from == 'button') {
            var good_id = e.target.dataset.goodid;
            var img = e.target.dataset.img;
			var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}&good_id=${good_id}`;
			var title = "我必须实力推荐这个宝贝，领券返现还能赚钱";
        } else {
			var title = "据说这些宝贝会不定期0元送，你也赶快来加入购物车。";
            var img = '';
			var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        };
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },
})