const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        defaultList: [],
    },

    onLoad: function(options) {
        console.log(options);
        let _this = this;
        this.pageCanAdd = true;
        this.imageNum = 0;
        this.pageIndex = 0;
        this.defaultList = [];
        this.userID = wx.getStorageSync('user_openID');
        if (options && options.goodsid) {
            wx.setNavigationBarTitle({
                title: options.title,
            });
            this.goodsId = options.goodsid;
			this.opt_type = options.opt_type;
        };


		this.getDefaultList(this.goodsId, this.opt_type);
    },

    onShow: function() {

    },

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

    catchtap: function() {},

    // 下拉刷新数据
    dropDownRefresh: function() {
		this.getDefaultList(this.goodsId, this.opt_type);
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

	// 返回顶部
	goToTop: function () {
		this.setData({
			toView: "scroll0"
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

                // 处理人数显示
                let people = res.data.goods_search_response.goods_list[i].sold_quantity;
                res.data.goods_search_response.goods_list[i].sold_quantity = people >= 100000 ? parseInt((people / 10000)) + "万" : people;

                // 处理佣金
                let rate = res.data.goods_search_response.goods_list[i].promotion_rate;
                let price = (res.data.goods_search_response.goods_list[i].min_group_price - res.data.goods_search_response.goods_list[i].coupon_discount) / 100;

                res.data.goods_search_response.goods_list[i].cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
				res.data.goods_search_response.goods_list[i].parentCashBack = (price * rate / 1000 * app.globalData.comRote * app.globalData.shareRote).toFixed(2);
            };

            _this.defaultList = _this.defaultList.concat(res.data.goods_search_response.goods_list);
            _this.setData({
                defaultList: _this.defaultList,
            });
			if (_this.data.defaultList.length==0){
				wx.hideLoading();
				wx.showModal({
					title: '温馨提示',
					content: '此分类暂时没有数据,请返回!',
					showCancel:false,
					success:function(){
						wx.navigateBack({
							delta: 1
						})
					}
				})
			}
            if (res.data.goods_search_response.goods_list.length < 30 || res.data.goods_search_response.goods_list.length == 0) {
                _this.pageCanAdd = false;
            };
        })
    },


})