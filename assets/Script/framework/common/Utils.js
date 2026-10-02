// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 项目独立工具类
// ]]

let UtilManager = require("UtilManager");

let Utils = UtilManager;

Utils.hello  = function (params) {
    cc.log("Utils", "hello " + params);
}

module.exports = Utils;