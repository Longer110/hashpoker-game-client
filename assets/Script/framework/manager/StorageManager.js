// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: UI界面管理
// ]]

let env = require("EnvironmentManager").default;

let StorageManager = function (params) {
    this.name = "StorageManager";
}

let proto = StorageManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}
proto.prefix = function (key){
    let prefix = env.get("appkey");
    key = `${prefix}_${key}`;
    return key;
}
proto.getItem = function (key, defaultValue) {
    key = this.prefix(key);
    let value = cc.sys.localStorage.getItem(key);
    if(typeof value === 'number'){
    }
    else if (null != value) {
        if (typeof value == 'string') {
            try {
                let obj = JSON.parse(value);
                value = obj;
            } catch(e) {
                value = defaultValue;
            }
        }
        else{
            value = defaultValue;
        }
    }
    else {
        value = defaultValue;
    }
    return value;
}
proto.setItem = function (key, value) {
    key = this.prefix(key);
    if (null == value) {
        value = "";
    }
    cc.sys.localStorage.setItem(key, JSON.stringify(value));
}

//根据用户ID来保存本地记录
proto.getUserItem = function (userID, itemKey, defaultValue) {
    let key = itemKey + "_" + userID;
    return this.getItem(key, defaultValue);
}
proto.setUserItem = function (userID, itemKey, itemValue) {
    let key = itemKey + "_" + userID;
    this.setItem(key, itemValue);
}

proto.setGatewayList = function (value) {
    this.setItem(KEY.GATEWAY_LIST, value);
}

StorageManager.default = new StorageManager(null);
module.exports = StorageManager;