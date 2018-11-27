const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
import config from '../../utils/config.js';

Page({

    data: {
        ifShowSearchIcon: true,
        placeholderTxt: "搜索商品名/复制拼多多商品标题",
        inputValue: '',
        dataList: [],
        searchTop: 500,
        ifShowTopClassBar: true,
        TopselectIndex: 1,
        HotSearchTopArray: ["纸巾", "袜子", "垃圾袋", ],
        HotSearchBotArray: ["保暖", "零食", "文具", "洗衣液", "手机壳"],
        departCurrent: 0,
        departTitleTxt: "百货",
        classItemArray: config.leftClass[1].classArray,
    },

    onLoad: function(options) {
        this.setData({
            botBoxHeight: app.windowHeight * 750 / app.sysWidth - 488 + 16,
            departmentBoxHeight: app.windowHeight * 750 / app.sysWidth - 388,
            classScrollHeight: app.windowHeight * 750 / app.sysWidth - 386 - 110,
            departmentLeftArray: config.leftClass.slice(1),
        })
    },

    onShow: function() {
        this.getSearchHotWords();
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
    bindconfirm: function(e) {
        if (e.currentTarget.dataset.content) {
            let content = e.currentTarget.dataset.content;
            wx.navigateTo({
                url: `/pages/searchDetails/searchDetails?inputValue=${content}`,
            })
            return;
        }
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

    // 分享
    onShareAppMessage: function() {
        var title = "购物之前先领券，省钱省到乐翻天";
        var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
        }
    },

    // 顶部分类点击事件
    topClassClick: function(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        if (index == this.data.TopselectIndex) {
            return;
        };
        this.setData({
            TopselectIndex: index,
            ifShowTopClassBar: index == 1 ? true : false,
        });
    },

    // 底部左边分类点击事件
    departMentClick: function(e) {
        let array = e.currentTarget.dataset.array;
        let index = e.currentTarget.dataset.index;
        if (index == this.data.departCurrent) {
            return;
        } else {
            this.setData({
                departCurrent: index,
                departTitleTxt: array.title,
                classItemArray: array.classArray,
            })
        }
    },

    // 底部右边类目点击事件
    goToGoodsList: function(e) {
        if (e.currentTarget.dataset.content) {
            let content = e.currentTarget.dataset.content;
            let goodsName = content.name;
            let goods_id = content.opt_id;
            wx.navigateTo({
                url: `/pages/goodsList/goodsList?goodsName=${goodsName}&goods_id=${goods_id}`,
            })
        }

    },

    //获取搜索热点
    getSearchHotWords: function() {
        let _this = this;
        let getSearchHotWordsUrl = wxAPIF.domin + 'getTag';
        wxAPIF.wxRequest(app, getSearchHotWordsUrl, "POST", {}, function(res) {
            console.log(res);
            if (res.code == 0 && res.data.length > 0) {
                _this.setData({
                    HotSearchTopArray: res.data.slice(0, 3),
                    HotSearchBotArray: res.data.slice(3)
                })
            }

        })
    },
})