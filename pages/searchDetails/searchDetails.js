const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        defaultList: [],
		orderMenuCurrent: 1,
		YOrder: '1',
		XOrder: '1',
		POrder: "1",
		ifShowMenu: true,
		ifShowSearchIcon:true,
		inputValue:'',
		placeholderTxt: "搜索商品名/复制拼多多商品标题",
		ifloadingup:false,
    },

    onLoad: function(options) {
		this.setData({
			scrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 168
		})
		this.pageIndex = 0;
		this.defaultList = [];
		this.topValue='';
		this.pageCanAdd = true;
		if(options){
			this.setData({
				inputValue: options.inputValue,
				ifShowSearchIcon: false,
			});
			this.topValue = options.inputValue;
			this.getDefaultList(options.inputValue);
		}
    },

    onShow: function() {

    },

    onReachBottom: function() {

    },

	// 顶部排序菜单点击事件
	orderMenuClick: function (e) {
		let index = e.currentTarget.dataset.menuindex;
		if ((index == 3 || index == 4 || index == 2) && index == this.data.orderMenuCurrent) {
			this.pageIndex = 0;
			this.defaultList = [];
			this.setData({
				orderMenuCurrent: index,
				YOrder: index == 3 ? (this.data.YOrder == 3 ? '2' : '3') : '1',
				XOrder: index == 4 ? (this.data.XOrder == 3 ? '2' : '3') : '1',
				POrder: index == 2 ? (this.data.POrder == 3 ? '2' : '3') : '1',
				toView: 'scrollView0',
			});
			this.pageCanAdd=true;
			if (index == 3) {
				this.getDefaultList(this.data.inputValue, this.data.YOrder == 3 ? 8 : 7) //优惠券排列
			};
			if (index == 4) {
				this.getDefaultList(this.data.inputValue, this.data.XOrder == 3 ? 6 : 5) //销量排列
			};
			if (index == 2) {
				this.getDefaultList(this.data.inputValue, this.data.POrder == 2 ? 3 : 4) //价格排列
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
			toView: 'scrollView0',
		});
		this.pageIndex = 0;
		this.defaultList = [];
		this.pageCanAdd = true;
		if (index == 1) {
			this.getDefaultList(this.data.inputValue, 0) //综合排列
		};
		if (index == 2) {
			this.getDefaultList(this.data.inputValue, 3) //价格升序排列
		};
		if (index == 3) {
			this.getDefaultList(this.data.inputValue, 8) //优惠券降序排列
		};
		if (index == 4) {
			this.getDefaultList(this.data.inputValue, 6) //销量降序排列
		};
	},

	// 返回顶部
	goToTop: function () {
		this.setData({
			toView: "scrollView0"
		})
	},

	//键盘输入时触发
	bindinput: function (e) {
		let value = e.detail.value;
		if (!value) {
			this.setData({
				placeholderTxt: '搜索商品名/复制拼多多商品标题',
				ifShowSearchIcon: true,
				inputValue: value,
			})
		} else {
			this.setData({
				ifShowSearchIcon: false,
				inputValue: value,
			})
		}
	},

	// clear输入框内容时触发
	clearInputTxt: function () {
		this.setData({
			placeholderTxt: '搜索商品名/复制拼多多商品标题',
			inputValue: '',
			ifShowSearchIcon: true,
		})
	},

	// 点击完成按钮/搜索按钮时触发
	bindconfirm: function () {
		
		if (!this.data.inputValue) {
			wx.showToast({
				title: '请输入商品信息',
				icon: 'none',
				duration: 1200
			})
		} else {
			if (this.topValue == this.data.inputValue){
				return;
			}else{
				this.pageIndex = 0;
				this.defaultList = [];
				this.topValue = this.data.inputValue;
				this.pageCanAdd = true;
				this.setData({
					toView: 'scrollView0',
					orderMenuCurrent: 1,
					YOrder: '1',
					XOrder: '1',
					POrder: "1",
				});
				this.getDefaultList(this.data.inputValue);
			}			
		}
	},

	// 获取默认数据
	getDefaultList: function (keyword,sort_type) {
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
		let getIndexListUrl = wxAPIF.domin + 'getGoodsList';
		let paegSize = 30;
		this.sort_type = sort_type ? sort_type : '';
		let data = {
			page: this.pageIndex,
			paeg_size: paegSize,
			keyword: keyword,
			sort_type: sort_type ? sort_type : ''
		}
		wxAPIF.wxRequest(app, getIndexListUrl, "POST", data, function (res) {
			if (res.data.error_response){
				wx.showToast({
					title: '请输入有效内容',
					icon: "none",
					duration: 2200,
				});
				return;
			}
			if (res.data.goods_search_response.total_count==0){
				wx.showToast({
					title: '请输入有效内容',
					icon:"none",
					duration:2200,
				})
			}
			for (let i = 0; i < res.data.goods_search_response.goods_list.length; i++) {
				// res.data.goods_search_response.goods_list[i].goods_name = util.formatStr(res.data.goods_search_response.goods_list[i].goods_name, 40);
				let people = res.data.goods_search_response.goods_list[i].sold_quantity;
				res.data.goods_search_response.goods_list[i].sold_quantity = people >= 100000 ? parseInt((people / 10000)) + "万" : people;
			};
			if (res.data.goods_search_response.goods_list.length < 30 || res.data.goods_search_response.goods_list.length==0){
				_this.pageCanAdd=false;
			}
			_this.defaultList = _this.defaultList.concat(res.data.goods_search_response.goods_list);
			_this.setData({
				defaultList: _this.defaultList,
				ifloadingup:true,
			});
			wx.hideLoading();
		})
	},

	// 下拉刷新数据
	dropDownRefresh: function () {
		this.getDefaultList(this.data.inputValue, this.sort_type)
	},

	// 跳转商品详情事件
	goTodetail: function (e) {
		let good_id = e.currentTarget.dataset.goodid;
		wx.navigateTo({
			url: `/pages/goodsDetails/goodsDetails?good_id=${good_id}`,
		})
	},

	// 分享
	onShareAppMessage: function () {
		var title = "我必须实力推荐这些宝贝，领券返现还能赚钱";
		var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
		return {
			title: title,
			path: path,
		}
	},
})