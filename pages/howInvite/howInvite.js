const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

	data: {

	},

	imageload:function(){
		wx.hideLoading();
	},

	onLoad:function(){
		wx.showLoading({
			title: 'Loading',
			mask: true,
		});
	}

})