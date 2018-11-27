const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        firend_num: 0,
        all_money: 0,
        friendList: [],
        father_name: '',
        father_pic: '',
		ifloadingup:false,
    },

    onLoad: function(options) {
        this.setData({
            scrolloheight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 350,
            scrolloheight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 500,
        });
        this.getData();
    },

    onShow: function() {

    },

    onHide: function() {

    },

    // 分享
    onShareAppMessage: function(e) {
		console.log(e);
		var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
		if (e.from == 'button') {
			let shareID = e.target.id;
			if (shareID == "friendShareID"){//子类后边的邀请
				var title = "老铁，最近省钱商城又上了很多优质商品了。快回来挑点吧。";
				var img = 'https://tp.datikeji.com/a/15428754566915/zPr5iO24OHKhllzmHyx0dpLe1d6GEK0rTm43COCE.png'; //待制作召回
			};
			if (shareID == "shareID"){ //父类后边的邀请
				var title = "送你一个现金红包，我已经拿到了，你也快来领取吧！";
				var img = 'https://tp.datikeji.com/a/15428755321043/QfEACZQ0VacJMG5LYwDdPmumpJEM9fENCy9qZqBj.png'; //待制做新人
			};
		} else {
			var title = "请你做我的VIP好友，大家有钱一起赚。";
			var img = 'https://tp.datikeji.com/a/15428755321043/QfEACZQ0VacJMG5LYwDdPmumpJEM9fENCy9qZqBj.png'; //待制作胶囊
		};
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
    },

    // 获取数据
    getData: function() {
        console.log("获取数据");
        let _this = this;
        let firendsListUrl = wxAPIF.domin + 'firendsList';
        wxAPIF.wxRequest(_this, firendsListUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
        }, function(res) {
            if (res.code == 0) {
                console.log(res);
                if (res.data.firends.length > 0) {
                    for (let i = 0; i < res.data.firends.length; i++) {
                        res.data.firends[i].firend_money = (parseFloat(res.data.firends[i].firend_money) / 100).toFixed(2);
                    }
                }
                _this.setData({
                    friendList: res.data.firends,
                    father_name: res.data.father_name,
                    father_pic: res.data.father_pic,
                    firend_num: res.data.firend_num,
                    all_money: (res.data.all_money / 100).toFixed(2),
					scrolloheight: res.data.father_name ? (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 500 : (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 350 ,
					ifloadingup: true,
                })
            }
        })
    },
})