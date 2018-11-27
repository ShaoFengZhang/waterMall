const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        orderMenuCurrent: 1,
        YOrder: '1',
        XOrder: '1',
        POrder: "1",
        defaultList: [],
		ifloadingup:false,
    },

    onLoad: function(options) {
        this.setData({
            scrolloheight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 88,
        });
        if (options.goodsName) {
            this.navTitle = options.goodsName;
            this.goods_id = options.goods_id;
        };
        wx.setNavigationBarTitle({
            title: this.navTitle
        });
        this.pageIndex = 0;
        this.defaultList = [];
        this.pageCanAdd = true;
        this.getDefaultList(this.goods_id);
    },

    onShow: function() {

    },

    // 下拉刷新数据
    dropDownRefresh: function() {
        this.getDefaultList(this.opt_id, this.sort_type);
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
                topId: 'scrollView0',
            });
            if (index == 3) {
                this.getDefaultList(this.goods_id, this.data.YOrder == 3 ? 8 : 7) //优惠券排列
            };
            if (index == 4) {
                this.getDefaultList(this.goods_id, this.data.XOrder == 3 ? 6 : 5) //销量排列
            };
            if (index == 2) {
                this.getDefaultList(this.goods_id, this.data.POrder == 2 ? 3 : 4) //价格排列
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
            topId: 'scrollView0',
        });
        this.pageIndex = 0;
        this.defaultList = [];
        this.pageCanAdd = true;
        if (index == 1) {
            this.getDefaultList(this.goods_id, 0) //综合排列
        };
        if (index == 2) {
            this.getDefaultList(this.goods_id, 3) //价格升序排列
        };
        if (index == 3) {
            this.getDefaultList(this.goods_id, 8) //优惠券降序排列
        };
        if (index == 4) {
            this.getDefaultList(this.goods_id, 6) //销量降序排列
        };
    },

    // 获取默认数据
    getDefaultList: function(opt_id, sort_type) {
        if (!this.pageCanAdd) {
            return;
        };
        wx.showLoading({
            title: '数据加载中',
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
            };

            _this.defaultList = _this.defaultList.concat(res.data.goods_search_response.goods_list);
            _this.setData({
                defaultList: _this.defaultList,
                ShuffList: _this.defaultList.slice(0, 3),
				ifloadingup:true,
            });
            if (res.data.goods_search_response.goods_list.length < 30 || res.data.goods_search_response.goods_list.length == 0) {
                _this.pageCanAdd = false;
            };
            if (res.data.goods_search_response.total_count == 0) {
                wx.hideLoading();
                wx.showToast({
                    title: '暂时没有数据!',
                    icon: "none",
                    duration: 1200,
                });

            }
        })
    },

    // 跳转商品详情事件
    goTodetail: function(e) {
        let good_id = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
        })
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
        var title = `听说你想找”${this.navTitle}”来这里购买吧，物美价廉还返现。`;
        var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
        }
    },


    // 返回顶部
    goToTop: function() {
        this.setData({
            topId: "scrollView0"
        })
    },

})