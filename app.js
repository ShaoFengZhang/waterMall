import wxAPIF from './utils/wxApiFun.js';
const ald = require('./utils/ald-stat.js');
App({
    onLaunch: function(options) {
        let _this = this;
        wx.getSystemInfo({
            success(res) {
                _this.pix = res.pixelRatio;
                _this.windowHeight = res.windowHeight;
                _this.windowwidth = res.windowWidth;
                _this.sysWidth = res.windowWidth;
                _this.Bheight = res.screenHeight - res.windowHeight - res.statusBarHeight - 44;
                var tempB = parseInt(`${res.version.split(".")[0]}${res.version.split(".")[1]}${res.version.split(".")[2]}`) //判断版本
            }
        })
        this.callArgsDealWith = true;
        this.callgoToPayMent = true;
        this.callgoToOrderMent = true;
        console.log("this.callArgsDealWith123");
        wxAPIF.wxloginfnc(this);

        // 强制更新
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function(res) {
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
            })
        })
    },

    onShow: function() {
        // if (this.getConfigData) {
        //     this.getConfigData();
        // }
    },

    globalData: {
        userInfo: null,
        comRote: 0.72,
    },
})