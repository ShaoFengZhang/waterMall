const domin = "https://xcx12.18yx.com/api/";
const LoginURl = `${domin}login`;
const checkUserUrl = `${domin}updateUser`;

const wxloginfnc = (app) => {
    wx.login({
        success: res => {
            let data = {
                code: res.code
            };
            wx.request({
				url: LoginURl,
                method: "POST",
                data: data,
                success: function(value) {
					app.user_OpenId = value.data.data;
					app.ifNewUser = !value.data.code;
					wx.setStorageSync('user_openID', value.data.data);
					app.globalData.session_key = value.data.session_key;
					getSettingfnc(app);
                }
            });
        },
    })
};

const getSettingfnc = (app) => {
    wx.getSetting({
        success: res => {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                    lang: "zh_CN",
                    success: res => {
						// console.log(res);
						let iv=res.iv;
						let encryptedData = res.encryptedData;
						let session_key = app.globalData.session_key;
                        app.globalData.userInfo = res.userInfo;
						checkUserInfo(app, res, iv, encryptedData, session_key);
                        if (app.userInfoReadyCallback) {
                            app.userInfoReadyCallback(res);
                        }
                    }
                })
            }
        }
    })
};

const checkUserInfo = (app, res, iv, encryptedData, session_key) => {
	if (wx.getStorageSync('rawData') != res.rawData) {
		wx.setStorage({
			key: "rawData",
			data: res.rawData
		})
		requestURl(app, checkUserUrl, "POST", {
			// rowData: res.rawData,
			open_id: app.user_OpenId,
			iv:iv,
			encryptedData: encryptedData,
			session_key: session_key
		}, function (data) {
			console.log('checkUser', data);
			if(res.code==-1 ||res.code==-2){
				wxloginfnc(app);
			}
		});
	}
};

const requestURl = (app, url, method, data, cb) => {
    wx.request({
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': '+json',
        },
        data: data,
        method: method,
        success: function(resdata) {
            app.netBlock = 0;
            // console.log(url, resdata);
            cb(resdata.data);
        },
        fali: function(res) {
            wx.showModal({
                title: '提示',
                content: '网络异常,请稍后再试',
                showCancel: false,
                success: function(res) {}
            })
        },
        complete: function(res) {
            if (!res.statusCode) {
                app.netBlock++;
                wx.hideLoading();
                if (app.netBlock < 3) {
                    requestURl2(app, url, method, data, cb)
                } else {
                    app.netBlock = 0;
                    wx.showModal({
                        title: '提示',
                        content: '网络异常,请稍后再试',
                        showCancel: false,
                        success: function(res) {
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    })
                }

            }

        }
    })
};

module.exports = {
    wxRequest: requestURl,
	wxloginfnc: wxloginfnc,
	checkUserInfo: checkUserInfo,
	domin: domin,
}