// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 服务器配置管理
// ]]


function ServerManager(){
    this._configs = new Map();
}

let proto = ServerManager.prototype;
proto.get = function (server_type) {
    return this._configs.get(server_type);
}
proto.set = function (server_type, server_config) {
    this._configs.set(server_type, server_config);
}

ServerManager.default = new ServerManager();
module.exports = ServerManager;