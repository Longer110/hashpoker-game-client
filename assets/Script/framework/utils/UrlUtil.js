// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: url 地址处理小工具
// ]]

let UrlUtil = function (params) {
    this.name = "UrlUtil";
    this._search = "";
    this._params = {};
    this.load();
}

let proto = UrlUtil.prototype;
proto.load = function (params) {
    if(!cc.sys.isBrowser) return;

    var search = window.location.search;
    search = search.replace(new RegExp("%23", 'g'), "#");
    this._search = search;
    this._params = {};
}
proto.reload = function () {
    this.load();
}
proto.destroy = function (params) {
}

//获取URL上的参数
proto.get = function(name) { 
    if(!cc.sys.isBrowser || !name) return null;
    
    let value = this._params[name];
    if(value!==undefined){
        return value;
    }

    var search = this._search;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = search.substr(1).match(reg); 
    if (r != null){
        value = unescape(r[2]);
    }
    else{
        value = null;
    }
    this._params[name] = value;
    return value;
}

//手动设置参数
proto.set = function (name, value) {
    if(!cc.sys.isBrowser || !name) return;
    this._params[name] = value;
}

proto.parse = function (url, name) {
    let search = url;
    search = search.replace(new RegExp("%23", 'g'), "#");
    let index = search.indexOf("?");
    if(index>=0){
        search = search.substr(index);
    }

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = search.substr(1).match(reg); 
    let value = null;
    if (r != null){
        value = unescape(r[2]);
    }
    else{
        value = null;
    }
    return value;
}

UrlUtil.default = new UrlUtil(null);
module.exports = UrlUtil;