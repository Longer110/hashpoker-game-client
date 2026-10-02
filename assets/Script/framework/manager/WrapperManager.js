const mains ={
    COMMON: "app-common",
    HOME: "main-home",
    LOGIN: "main-login",
    HALL: "main-hall",
}

function WrapperManager(){
    this._instances = new Map();
    this._wrappers = new Map();
    for (const key in mains) {
        let bundleName = mains[key];
        this[key] = bundleName;
        let func_key = "get" + key.substr(0, 1).toUpperCase() + key.substr(1).toLowerCase();
        this[func_key] = function () {
            return this.get(bundleName);
        }.bind(this);
    }
}

let proto = WrapperManager.prototype;
proto.get = function (bundleName) {
    return this._wrappers.get(bundleName);
}
proto.set = function (bundle_name, bundle_game) {
    this._wrappers.set(bundle_name, bundle_game);
}
proto.delete = function(bundle_name){
    this._wrappers.delete(bundle_name);
}

proto.register = function(bundle_name, instance){
    this._instances.set(bundle_name, instance);
}
proto.unregister = function (bundle_name) {
    let instance = this._instances.get(bundle_name);
    this._instances.delete(bundle_name);
    return instance;
}
proto.getWrapper = function (bundle_name) {
    return this._instances.get(bundle_name);
}

WrapperManager.default = new WrapperManager();
module.exports = WrapperManager;