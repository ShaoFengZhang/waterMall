const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
		selectStar:false,
		shuffCurrent: 0,
    },

    onLoad: function(options) {
        this.setData({
            scrolloheight: wx.getSystemInfoSync().windowHeight * 2 - 92
        });
		
        if (app.globalData.userInfo) {
            console.log('goodif');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            console.log('goodelseif');
            app.userInfoReadyCallback = res => {
                console.log('goodindex');
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
				let iv = res.iv;
				let encryptedData = res.encryptedData;
				let session_key = app.globalData.session_key ;
				wxAPIF.checkUserInfo(app, res, iv, encryptedData, session_key);
            }
        } else {
            console.log('goodelse');
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
        this.userID = wx.getStorageSync('user_openID');
        if (options && options.good_id) {
            this.good_id = parseInt(options.good_id);
            this.getGoodDetail(this.good_id)
        };
    },

    onShow: function() {

    },

	//轮播图改变事件 
	shuffChangeEvent: function (e) {
		let current = e.detail.current;
		this.setData({
			shuffCurrent: current,
		})
	},

	// 阻止分享按钮冒泡事件
	catchtap: function () { },
	
    // 请求商品详情
    getGoodDetail: function(good_id) {
        let _this = this;
        let getGoodDetailUrl = wxAPIF.domin + 'getGoodsDetail';
        wxAPIF.wxRequest(app, getGoodDetailUrl, "POST", {
            id: good_id,
			open_id: this.userID,
        }, function(res) {
            let GoodDetai = res.data.goods_promotion_url_generate_response.goods_promotion_url_list[0];
			_this.GoodDetai = GoodDetai;
            // GoodDetai.goods_detail.goods_name = util.formatStr(GoodDetai.goods_detail.goods_name, 60);
            let people = GoodDetai.goods_detail.sold_quantity;
            GoodDetai.goods_detail.sold_quantity = people >= 100000 ? parseInt((people / 10000)) + "万" : people;
            GoodDetai.endtTime = util.formatTime(new Date(parseInt(GoodDetai.goods_detail.coupon_end_time) * 1000))
            GoodDetai.starttTime = util.formatTime(new Date(parseInt(GoodDetai.goods_detail.coupon_start_time) * 1000));

			// 处理佣金
			let rate = GoodDetai.goods_detail.promotion_rate;
			let price = (GoodDetai.goods_detail.min_group_price - GoodDetai.goods_detail.coupon_discount) / 100;

			GoodDetai.goods_detail.cashBack = (price * rate / 1000 * app.globalData.comRote).toFixed(2);
            _this.setData({
                GoodDetai: GoodDetai,
				selectStar:res.type,
				gotopath: GoodDetai.we_app_info.page_path,
            });
        })
    },

    // 获取用户信息
    getUserInfo: function(e) {
		let btnID = e.currentTarget.id;
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
			if (btnID == "botStar"){
				this.collectionsGoodsFun();
			}
        }
    },

	// 返回顶部
	goToTop:function(){
		this.setData({
			topId:"goodWindow"
		})
	},

    // 返回首页
    goToIndex: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

	// 收集FormID
	collectFormId:function(e){
		let _this = this;
		let collectFormIdUrl = wxAPIF.domin + 'addForm';
		let form_id = e.detail.formId;
		let data = {
			user_id: this.userID,
			form_id: form_id,
		}
		wxAPIF.wxRequest(app, collectFormIdUrl, "POST", data, function (res) {	
		})
	},

    // 收藏商品
    collectionsGoodsFun: function() {
        let _this = this;
		let collectionsGoodsFunUrl = wxAPIF.domin + 'saveUserCollection';
		console.log(JSON.stringify(this.GoodDetai));
        let data = {
			open_id: this.userID,
			goods_id:this.good_id,
			goods_data: JSON.stringify(this.GoodDetai),
        }
		wxAPIF.wxRequest(app, collectionsGoodsFunUrl, "POST", data, function(res) {
            console.log(123,res)
			if(res.code==0){
				_this.setData({
					selectStar:true,
				})
			};
			if(res.code==1){
				_this.setData({
					selectStar: false,
				})
			};
        })
    },

	// 分享
	onShareAppMessage: function (e) {
		if (e.from == 'button') {
			var good_id = e.target.dataset.goodid;
			var img = e.target.dataset.img;
			console.log(good_id)
			var path = `/pages/goodsDetails/goodsDetails?user_openId=${wx.getStorageSync('user_openID')}&good_id=${good_id}`;
			var title = `${app.globalData.userInfo.nickName}实力推荐的宝贝，限时领券购买还返现，简直是疯了！`;
		} else {
			var title = "实力推荐这个宝贝，限时领券购买还返现，简直是疯了！";
			var img = '';
			var path = `/pages/index/index?user_openId=${wx.getStorageSync('user_openID')}`;
			console.log(path)
		};
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
	},
})