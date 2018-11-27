const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        selectLine:1,
		ifloadingup:false,
    },

    onLoad: function(options) {
		this.userID = wx.getStorageSync('user_openID');
		this.getDataFun(0);
		this.getConfigData();
    },

    onReady: function() {

    },

    onShow: function() {

    },

	// 分享
	onShareAppMessage: function () {
		return {
			title: '没一会儿已经赚了这么多钱，而且提现即时到账。好爽呢...',
			path: `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`,
		}
	},

	// 获取数据
	getDataFun: function (args) {
		wx.showLoading({
			title: '数据加载中',
			mask: true,
		});
		let _this = this;
		let getDataFunUrl = wxAPIF.domin + 'IncomeExpenditure';
		let data = {
			open_id: this.userID,
			type: args,
		}
		wxAPIF.wxRequest(app, getDataFunUrl, "POST", data, function (res) {
			if(res.code==0){
				for (let i = 0; i < res.data.length; i++){
					res.data[i].amount = (parseFloat(res.data[i].amount) / 100).toFixed(2);
					console.log(res.data[i].amount)
				};
				_this.setData({
					payMentList:res.data,
					ifloadingup:true,
				})
			};
			wx.hideLoading();	
		})
	},

	// 获取配置数据
	getConfigData: function () {
		let _this = this;
		let getConfigDataUrl = wxAPIF.domin + 'isExamine';
		wxAPIF.wxRequest(_this, getConfigDataUrl, "POST", {
			open_id: wx.getStorageSync('user_openID')
		}, function (res) {
			console.log(res);
			if (res.code == 0) {
				app.globalData.firstTimeWidthDraw = res.data.one;
				app.globalData.subsequenWidthDraw = res.data.three;
				app.globalData.singleTopWidthDraw = res.data.two;
			}
		})
	},

	topSelectClick:function(e){
		let index = parseInt(e.currentTarget.dataset.selectindex);
		if (index == this.data.selectLine){
			return;
		}
		this.setData({
			selectLine:index,
		});
		this.getDataFun(index-1);
	},
})