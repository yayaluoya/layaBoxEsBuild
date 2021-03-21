const os = require('os');
var moment = require('moment');

/**
 * 获取时间
 */
function getTime() {
    return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取局域网ip地址
 */
function getLocalIP() {
    let _ip = 'localhost';
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                _ip = alias.address;
            }
        }
    }
    // console.log(_ip);
    return _ip;
}

//
module.exports = {
    getTime,
    getLocalIP,
};