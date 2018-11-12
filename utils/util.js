const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('.')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//字符串截取加点

const formatStr = (str, len) => {
    let length = str.lenght;
    if (length === void 0) {
        length = len;
    };
    let r = /[^\x00-\xff]/g;
    if (str.replace(r, "mm").length <= length) {
        return str + "";
    };
    let m = Math.floor(length / 2);
    for (let i = m; i < str.length; i++) {
        if (str.substring(0, i).replace(r, "mm").length >= length) {
            return str.substring(0, i) + "...";
        }
    };
    return str + "";
}

module.exports = {
    formatTime: formatTime,
	formatStr: formatStr,
}