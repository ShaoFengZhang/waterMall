const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

	data: {

	},

	onLoad: function (options) {

	},

	onShow: function () {

	},

	//分享
	onShareAppMessage: function () {
		let img = 'https://tp.datikeji.com/a/15428753958334/lACHPNYKP5p4zmaJUul3jUhZmCfaiKGtXBQHqkes.png';
		return {
			title: '一分钟带你了解这个越买越省钱的神器，这不是开玩笑。',
			path: `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`,
			imageUrl: img,
		}
	},
})