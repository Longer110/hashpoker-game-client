// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 日志记录服务器配置
// ]]
let my = require("my");

let ServerNet = require("config_server_net");
let ServerNet_DEFAULT = ServerNet._default;

let ServerNet_BROWER_SET = ServerNet_DEFAULT.brower.sets;
let ServerNet_BROWER_LIVE = ServerNet_DEFAULT.brower.live;

let ServerNet_NATIVE_SET = ServerNet_DEFAULT.native.sets;
let ServerNet_NATIVE_LIVE = ServerNet_DEFAULT.native.live;

let server_config = {
    brower: {
        sets: {
            "DEV": [
                ServerNet.getItemByName("内测1", ServerNet_BROWER_SET.DEV) || ServerNet_BROWER_SET.DEV[0],
                ServerNet.getItemByName("内测2", ServerNet_BROWER_SET.DEV) || ServerNet_BROWER_SET.DEV[1] || ServerNet_BROWER_SET.DEV[0],
            ],
            "RELEASE": ServerNet_BROWER_SET.RELEASE,
            "CLIENT": ServerNet_BROWER_SET.CLIENT,
        },
        live: {
            "DEV": [
                ServerNet.getItemByName("lianzi-域名", ServerNet_BROWER_LIVE.DEV) || ServerNet_BROWER_LIVE.DEV[0],
                ServerNet.getItemByName("huigong-ip", ServerNet_BROWER_LIVE.DEV) || ServerNet_BROWER_LIVE.DEV[1] || ServerNet_BROWER_LIVE.DEV[0],
            ],
            "RELEASE": ServerNet_BROWER_LIVE.RELEASE,
            "CLIENT": ServerNet_BROWER_LIVE.CLIENT,
        },
    },
    native: {
        sets: {
            "DEV": [
                ServerNet.getItemByName("内测1", ServerNet_NATIVE_SET.DEV) || ServerNet_NATIVE_SET.DEV[0],
                ServerNet.getItemByName("内测2", ServerNet_NATIVE_SET.DEV) || ServerNet_NATIVE_SET.DEV[1] || ServerNet_NATIVE_SET.DEV[0],
            ],
            "RELEASE": ServerNet_NATIVE_SET.RELEASE,
            "CLIENT": ServerNet_NATIVE_SET.CLIENT,
        },
        live: {
            "DEV": [
                ServerNet.getItemByName("内测1", ServerNet_NATIVE_LIVE.DEV) || ServerNet_NATIVE_LIVE.DEV[0],
                ServerNet.getItemByName("内测2", ServerNet_NATIVE_LIVE.DEV) || ServerNet_NATIVE_LIVE.DEV[1] || ServerNet_NATIVE_LIVE.DEV[0],
            ],
            "RELEASE": ServerNet_NATIVE_LIVE.RELEASE,
            "CLIENT": ServerNet_NATIVE_LIVE.CLIENT,
        },
    }
}

class ServerRecord extends my.ServerBase {
    static _default = server_config;
    _configs = null;
    constructor() {
        super();
        let app = window.app;
        let configs = server_config;

        if(app.config.IS_SOCKET){
            //原生/浏览器
            configs = (cc.sys.isNative ? configs["native"] : configs["brower"]) || {};
        }else{
            configs = configs["brower"];
        }

        
        //直播/合集
        configs = (app.config.ISLIVE ? configs["live"] : configs["sets"]) || {};

        if(app.url.get("client")==1){//内部客户服
            configs = configs["CLIENT"];
        }
        else if (app.config.ISDEVELOP) { //开发（内测）环境
            configs = configs["DEV"];
        } else { //发布（封测）环境
            configs = configs["RELEASE"];
        }
        if (!configs || !(configs instanceof Array)) {
            configs = [
                {
                    NAME: "官方默认-Record",
                    HEAD: "wss",
                    HOST: "game-api.hashpoker.vip",
                    PORT: 50043,
                }
            ];
            cc.warn("ServerRecord: 服务器配置无效，使用默认兜底配置");
        }
        this.setServerList(configs);
    }
}

module.exports = ServerRecord;