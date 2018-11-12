const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        selectLine:1
    },

    onLoad: function(options) {
		this.userID = wx.getStorageSync('user_openID');
		this.getDataFun(0);
    },

    onReady: function() {

    },

    onShow: function() {

    },

    onShareAppMessage: function() {},

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
				_this.setData({
					payMentList:res.data,
					dataType:res.type
				})
			};
			wx.hideLoading();	
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