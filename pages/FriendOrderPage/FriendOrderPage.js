const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        selcetIndex: 1,
        orderList: [],
        invalid: false,
        ifShowUserData: true,
		scrollHeight: "74vh", 
		ifShowTanchaung:false,
		all_no_with_drow: 0,
		all_with_drow: 0,
		ifloadingup:false,
    },

    onLoad: function(options) {
		this.userID = wx.getStorageSync('user_openID');this.navType
		this.navType=1;
		this.setData({
			scrolloheight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 300,
			selcetIndex: this.navType,
			scrollHeight: "74vh",
		});
		this.pageIndex = 0;
		this.defaultList = [];
		this.pageCanAdd = true;
		this.getDataList(this.navType);
    },

    onShow: function() {
		this.setData({
			ifShowTanchaung: false,
		})
    },

    //获取数据
    getDataList: function(navType) {
        if (!this.pageCanAdd) {
            return;
        };
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        let _this = this;
		let getDataListUrl = wxAPIF.domin + 'firendsOrder';
        // this.pageIndex++;
        let data = {
            open_id: this.userID,
            type: navType,
            // page: this.pageIndex
        }
        wxAPIF.wxRequest(app, getDataListUrl, "POST", data, function(res) {
            // console.log("好友订单", res);
            if (res.code == 0) {
				let subClassArr=res.data;
				let shareClassArr=res.share_data;
				_this.subClassListArr=[];
				_this.shareClassListArr=[];
				for (let i = 0; i < subClassArr.length;i++){
					for (let n = 0; n < subClassArr[i].order_list.length;n++){

						let rate = subClassArr[i].order_list[n].promotion_rate;
						let price = (subClassArr[i].order_list[n].order_amount) / 100;
						subClassArr[i].order_list[n].cashBack = (price * rate / 1000 * app.globalData.comRote*0.216).toFixed(2);

						subClassArr[i].order_list[n].created_at = subClassArr[i].order_list[n].created_at.slice(0,10);
						subClassArr[i].order_list[n].pic = subClassArr[i].pic;
						subClassArr[i].order_list[n].userName = subClassArr[i].userName;
						_this.subClassListArr.push(subClassArr[i].order_list[n]);
						
					}
				};
				for (let i = 0; i < shareClassArr.length; i++) {
					for (let n = 0; n < shareClassArr[i].order_list.length; n++) {

						let rate = shareClassArr[i].order_list[n].promotion_rate;
						let price = (shareClassArr[i].order_list[n].order_amount) / 100;
						shareClassArr[i].order_list[n].cashBack = (price * rate / 1000 * app.globalData.comRote*0.0648).toFixed(2);


						shareClassArr[i].order_list[n].created_at = shareClassArr[i].order_list[n].created_at.slice(0,10)
						_this.shareClassListArr.push(shareClassArr[i].order_list[n]);
					}
				};
				console.log(_this.subClassListArr.concat(_this.shareClassListArr));
				let lastArrary = _this.subClassListArr.concat(_this.shareClassListArr);
				for (let i = 0; i < lastArrary.length;i++){
					if (lastArrary[i].order_status == -1) {
						lastArrary.splice(i, 1);
					}
				}

				_this.setData({
					orderList: lastArrary,
					all_no_with_drow: (parseFloat(res.all_no_with_drow) / 100).toFixed(2),
					all_with_drow: (parseFloat(res.all_with_drow) / 100).toFixed(2),
					ifloadingup:true,
				});
            };
            wx.hideLoading();
        })
    },

    // 下拉刷新数据
    dropDownRefresh: function() {
        // this.getDataList(this.data.selcetIndex);
    },

	dropDownRefresh1: function () {
		this.pageIndex == 0;
		this.getDataList(this.data.selcetIndex);
	},

    // 顶部选择类别点击事件
    topSelectClick: function(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        if (index == this.data.selcetIndex) {
            return;
        };
        this.pageIndex = 0;
        this.defaultList = [];
        this.pageCanAdd = true;
        this.setData({
            selcetIndex: index,
            topview: "orderListItem0",
        });
        this.getDataList(index);
    },

    // 分享
    onShareAppMessage: function() {
        return {
			title: '我邀请的这些好友每天都在帮忙赚钱，躺着收钱的感觉真好',
			path: `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`,
        }
    },

	// 影藏弹窗
	hidetanchaung:function(){
		this.setData({
			ifShowTanchaung: !this.data.ifShowTanchaung,
		})
	},

})