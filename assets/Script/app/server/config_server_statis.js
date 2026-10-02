// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 统计服务器配置
// ]]
let my = require("my");

let ServerRecord = require("config_server_record");
//统计服与日志服配置相同
let server_config = ServerRecord._default;

class ServerStatis extends my.ServerBase {
    static _default = server_config;
    _configs = null;
    constructor(){
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
                    NAME: "官方默认-Statis",
                    HEAD: "wss",
                    HOST: "game-api.hashpoker.vip",
                    PORT: 50043,
                }
            ];
            cc.warn("ServerStatis: 服务器配置无效，使用默认兜底配置");
        }
        this.setServerList(configs);
    }
}

module.exports = ServerStatis;