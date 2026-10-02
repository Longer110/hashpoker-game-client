// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: SDK管理
// ]]

let SDKManager = function (params) {
    this.name = "SDKManager";
}

let proto = SDKManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}

SDKManager.default = new SDKManager(null);
module.exports = SDKManager;