const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        ifShowSearchIcon: true,
        placeholderTxt: "搜索商品名/复制拼多多商品标题",
        inputValue: '',
        dataList: [],
        searchTop: 500,
    },

    onLoad: function(options) {
        this.setData({
            botBoxHeight: app.windowHeight * 750 / app.sysWidth - 488 + 16
        })
        this.pageIndex = 0;
        this.defaultList = [];
    },

    onShow: function() {
    },

    //键盘输入时触发
    bindinput: function(e) {
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
    clearInputTxt: function() {
        this.setData({
            placeholderTxt: '搜索商品名/复制拼多多商品标题',
            inputValue: '',
            ifShowSearchIcon: true,
        })
    },

    // 点击完成按钮时触发
    bindconfirm: function() {
        if (!this.data.inputValue) {
            wx.showToast({
                title: '请输入商品信息',
                icon: 'none',
                duration: 1200
            })
        } else {
            wx.navigateTo({
                url: `/pages/searchDetails/searchDetails?inputValue=${this.data.inputValue}`,
            })
        }
    },

    // 改变样式
    changview: function() {
        console.log(123);
        this.setData({
            botBoxHeight: 3010,
            searchTop: 80,
            toView: 'changview',
        })
    },

    // 分享
    onShareAppMessage: function() {
        var title = "购物之前先领券，省钱省到乐翻天";
        var img = '';
		var path = `/pages/index/index?user_openId=${wx.getStorageSync('user_openID')}`;
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },


})