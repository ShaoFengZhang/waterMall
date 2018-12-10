const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        shareUserLastArr: [{
			icon: 'https://tp.datikeji.com/a/15441503444038/j4p8nIdv5j4tC6lUG1yvJWcO4pzEqduNcbHyfmTd.png',
                money: "199.99",
                friendNum: 90,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441503662186/Wk09ofqFBxH9IaGdGzdLgfa5O4qX9LEwqzE64oRA.png',
                money: "196.68",
                friendNum: 80,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441503795569/JA2ulPOBoAYGDQLKhNGPCBjeSxV1wGYJ56h5fwjm.png',
                money: "168.20",
                friendNum: 82,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441504041459/sSASBvWbUyoSpQHC6QdcqsbNSUasa5P1ky0kGSTz.png',
                money: "156.88",
                friendNum: 84,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441504238424/X42fGU0Tou9gYPJ32FiLmkjJkb3VkS8jA8DBuAyO.png',
                money: "142.22",
                friendNum: 70,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441504392496/QMPxl6fvNJAaeKNO8mrgvqGO1QXrbyNUx6QZqVTm.png',
                money: "130.62",
                friendNum: 65,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441504697592/YInIuITTFXI0ECeCltON8q94315Rc199LbEL6Fh1.png',
                money: "100.00",
                friendNum: 60,
            }
        ],
        shareUserFirstArr: [{
			icon: 'https://tp.datikeji.com/a/15441502365434/C5ZUeVumZrtV2JtDHh9BJvnLv7fLTcBXxqW5tYpt.png',
                money: "230.12",
                friendNum: 100,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441502567540/odxtDwZQBtJ30UqiOZITPCsn6qguJYNNndT27Rt5.png',
                money: "210.00",
                friendNum: 98,
            },
            {
				icon: 'https://tp.datikeji.com/a/15441502728182/VTxQaeylzvxIkLFRT7q49SHyitXdkrW0D8CqNeK2.png',
                money: "200.66",
                friendNum: 98,
            }
        ],
    },

    onLoad: function(options) {

    },

    onShow: function() {

    },

    onShareAppMessage: function(e) {
        var path = `/pages/index/index?user_openId=${wx.getStorageSync('u_id')}`;
        if (e.from == 'button') {
            var img = 'https://tp.datikeji.com/a/15428757949870/wkkEhOYIpk4DpnLJ37bmDsHS4CuLQAip4qszaDlo.png';
			var title = "送你一个现金红包，我已经拿到了，你也快来领取吧！";
        } else {
			var img = 'https://tp.datikeji.com/a/15428757949870/wkkEhOYIpk4DpnLJ37bmDsHS4CuLQAip4qszaDlo.png';
			var title = "躺着赚钱真是不能说的秘密，数钱数到我手抽筋！";

        };
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },
})