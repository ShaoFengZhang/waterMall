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
		POrder:"1",
        ifShowMenu: false,
		TopClassData: config.topClass,
    },
    onLoad: function() {
        if (app.globalData.userInfo) {
            console.log('if');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
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
        // this.getTopClassData();
		this.userID = wx.getStorageSync('user_openID');
    },

	onShow:function(){
		this.setData({
			// shuffCurrent: 0,
			autoplay:true,
		});
	},

	onHide:function(){
		this.setData({
			// shuffCurrent: 0,
			autoplay:false,
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
        }
    },

	// 返回顶部
	goToTop: function () {
		this.setData({
			toView: "topShuff"
		})
	},

    // 获取默认数据
    getDefaultList: function(opt_id,sort_type) {
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
			sort_type: sort_type ? sort_type:''
        }
        wxAPIF.wxRequest(app, getIndexListUrl, "POST", data, function(res) {

            for (let i = 0; i < res.data.goods_search_response.goods_list.length; i++) {
                // res.data.goods_search_response.goods_list[i].goods_name = util.formatStr(res.data.goods_search_response.goods_list[i].goods_name, 40);

				// 处理人数显示
				let people = res.data.goods_search_response.goods_list[i].sold_quantity;
				res.data.goods_search_response.goods_list[i].sold_quantity = people >= 100000 ? parseInt((people / 10000))+ "万" : people;

				// 处理佣金
				let rate = res.data.goods_search_response.goods_list[i].promotion_rate;
				let price = (res.data.goods_search_response.goods_list[i].min_group_price - res.data.goods_search_response.goods_list[i].coupon_discount)/100;

				res.data.goods_search_response.goods_list[i].cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
            };

            _this.defaultList = _this.defaultList.concat(res.data.goods_search_response.goods_list);
            _this.setData({
                defaultList: _this.defaultList,
                ShuffList: _this.defaultList.slice(0, 3),
            });
        })
    },

    // 得到顶部分类数据
    getTopClassData: function() {
        let _this = this;
        let getTopClassDataUrl = wxAPIF.domin + 'getCatergotyList';
        let firstData = {
            level: 0,
            opt_id: 0,
            opt_name: '推荐'
        }
        wxAPIF.wxRequest(app, getTopClassDataUrl, "POST", {}, function(res) {
            let dataList = res[0].goods_opt_get_response.goods_opt_list;
            dataList.unshift(firstData);
            _this.setData({
                TopClassData: dataList
            })
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
        this.setData({
            selectIndex: index,
            toView: 'topShuff',
			optID: optID == 0 ? "" : optID,
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
        if ((index == 3 || index == 4 || index==2) && index == this.data.orderMenuCurrent) {
			this.pageIndex = 0;
			this.defaultList = [];
            this.setData({
                orderMenuCurrent: index,
                YOrder: index == 3 ? (this.data.YOrder == 3 ? '2' : '3') : '1',
                XOrder: index == 4 ? (this.data.XOrder == 3 ? '2' : '3') : '1',
                POrder: index == 2 ? (this.data.POrder == 3 ? '2' : '3') : '1',
				toView: 'dataListBox',
            });
			if (index == 3) {
				this.getDefaultList(this.data.optID, this.data.YOrder==3?8:7) //优惠券排列
			};
			if (index == 4) {
				this.getDefaultList(this.data.optID, this.data.XOrder == 3 ? 6 :5) //销量排列
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
		if (index == 1) {
			this.getDefaultList(this.data.optID, 0) //综合排列
		};
		if (index==2){
			this.getDefaultList(this.data.optID,3) //价格升序排列
		};
		if (index == 3) {
			this.getDefaultList(this.data.optID, 8) //优惠券降序排列
		};
		if (index == 4){
			this.getDefaultList(this.data.optID, 6) //销量降序排列
		};
    },

    // 跳转到搜索页
    goToSearch: function() {
        wx.switchTab({
            url: '/pages/search/search',
        })
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
        if (parseInt(scrollTop) >= 480) {
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
        let good_id = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
        })
    },

	// 跳转MailList事件
	gotoMailList:function(e){
		let navType = e.currentTarget.dataset.type;
		let navTitle=e.currentTarget.dataset.title;
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
			var path = `/pages/goodsDetails/goodsDetails?user_openId=${wx.getStorageSync('user_openID')}&good_id=${good_id}`;
			var title ="实力推荐这个宝贝，限时领券购买还返现，简直是疯了！";
        } else {
			var title = "@所有人 省钱秘籍等你拿，动动小手就到家";
			var img = '/assets/shareIcon.png';
			var path = `/pages/index/index?user_openId=${wx.getStorageSync('user_openID')}`;
        };
        return {
            title: title,
			path: path,
            imageUrl: img,
        }
    },

	// 即将上线
	theOnline: function () {
		wx.showToast({
			title: '此功能即将上线,敬请期待',
			icon: 'none',
			duration: 800
		})
	},

	// 收集FormId
	formSubmit:function(e){
		let _this = this;
		let collectFormIdUrl = wxAPIF.domin + 'addForm';
		if (e.detail.formId == 'the formId is a mock one'){
			return;
		}
		let form_id = e.detail.formId;
		let data = {
			user_id: this.userID,
			form_id: form_id,
		}
		wxAPIF.wxRequest(app, collectFormIdUrl, "POST", data, function (res) {
		})
	},
})