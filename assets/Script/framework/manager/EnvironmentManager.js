
let envs = {
    IS_LIVE_ONLY: false,            //标志是否直播独立项目
    USE_PremultiplyAlpha: false,    //是否使用左乘透明混合模式
    appkey: "DEFAULT",
    lang: "",
    skin: "",
    design: cc.size(1334, 750),
}

let EnvironmentManager = function (params) {
    this.name = "EnvironmentManager";
}

let proto = EnvironmentManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}
proto.get = function (key) {
    return envs[key];
}
proto.set = function (object) {
    if(typeof object != 'object'){
        cc.error("EnvironmentManager", "无效的环境变量", object);
        return;
    }
    for (const key in object) {
        if(envs[key] !== undefined ){
            const value = object[key];
            if((typeof envs[key]) !== typeof value){
                cc.warn("TYPE ERROR--> key:[" + key + "], type:" + (typeof envs[key]) + "!=" + (typeof value) );
            }
            envs[key] = value;
        }
        else{
            cc.error("EnvironmentManager", "属性未定义: key="+key);
        }
    }
    // cc.warn(this.name, "env = " + JSON.stringify(envs));
}
proto.getAll = function (params) {
    return envs;
}

EnvironmentManager.default = new EnvironmentManager(null);
module.exports = EnvironmentManager;