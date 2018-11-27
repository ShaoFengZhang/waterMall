const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        orderMenuCurrent: 1,
        YOrder: '1',
        XOrder: '1',
        defaultList: [],
		ifloadingup:false,
    },

    onLoad: function(options) {
        this.setData({
            scrolloheight: wx.getSystemInfoSync().windowHeight * 2 - 88
        })
        if (options.navType) {
            var navTitle=options.navTitle;
            this.dataType = options.navType; //取数据参数
        };
        wx.setNavigationBarTitle({
            title: navTitle
        });
        this.pageIndex = 0;
        this.defaultList = [];
		this.pageCanAdd = true;
        this.getDataFUn();
    },

    onShow: function() {

    },

	// 返回顶部
	goToTop: function () {
		this.setData({
			topId: "scrollView0"
		})
	},

    // 获得具体数据函数
    getDataFUn: function(args) {
		if (!this.pageCanAdd) {
			wx.showToast({
				title: '没有更多的数据了!',
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
        this.pageIndex++;
        let getDataFUnUrl = wxAPIF.domin + 'getChannelInfo';
        let data = {
            channel_type: this.dataType,
            page: this.pageIndex,
        };
        wxAPIF.wxRequest(app, getDataFUnUrl, "POST", data, function(res) {
            // for (let i = 0; i < res.data.goods_basic_detail_response.list.length; i++) {
            //     res.data.goods_basic_detail_response.list[i].goods_name = util.formatStr(res.data.goods_basic_detail_response.list[i].goods_name, 32)
            // };
			if (res.data.goods_basic_detail_response.list < 30 || res.data.goods_basic_detail_response.list==0){
				_this.pageCanAdd=false;
			}
            _this.defaultList = _this.defaultList.concat(res.data.goods_basic_detail_response.list);
            _this.total = res.data.goods_basic_detail_response.total;
			if (_this.total==0){
				wx.hideLoading();
				wx.showToast({
					title: '暂时没有数据!',
					icon: "none",
					duration: 1200,
				});
			}
            _this.setData({
                defaultList: _this.defaultList,
				ifloadingup:true,
            });
        })
    },

    // 跳转商品详情事件
    goTodetail: function(e) {
        let good_id = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
        })
    },

    // 下拉刷新数据
    dropDownRefresh: function() {
        this.getDataFUn();
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

    // 分享
    onShareAppMessage: function() {
        if (this.dataType == 0) {
            var title = "9块9包邮了还返现，这价格是标错了么？大家快来抢啊…";
		} else if (this.dataType == 1) {
			var title = "最近卖得超级火爆的东西居然被我找到了优惠券，嘿嘿…";
        }else{
			var title = "好东西都是靠抢来的，只不过有些明抢，这些可以白拿。";
		}
		let path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
        }
    },

})