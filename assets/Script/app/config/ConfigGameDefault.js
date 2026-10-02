/*****************************************************************************
* @Author:      mygame
* @Date:        2020-06-01 12:05:23
* @Description: 全局项目配置
*****************************************************************************/


/**
 * WEB发布版URL上目前可选参数及其含义
 * 
 * account  是否为账号登录
 * guest    是否游客登录
 * token    使用token的值登录
 * channel  当前登录渠道号
 * platform 当前登录平台号
 * console  控制台是否打印日志 
 * client   是否连接客户服
 * public   是否连接公测服
 * serverlist   是否可选择服务器列表
 * shopid       分店id
 * gameid   配置跳转子游戏
 * skin     指定皮肤
 * fullscreen 指定fullscreen=1时，不显示全屏手势
 * environment 指定游戏所属环境（fc: 封测、hd: 灰度、zs: 正式）
 * single   是否单机游戏
 * robot    机器人模式（表示该合集游戏进入的都是只有机器人的房间）
 * compatibleVersion 指定app兼容版本
 *
 * 以下直播项目专用：
 * live     指定是否网页测试
 * nomsg    指定是否网页主播（网页主播版不需要与app消息交互）
 * zb       指定是否主播端（主播端显示牌桌背景）可全局搜索 "zb" 查看引用
 * viewer   指定为观众登录 （只能观看，不能下注）
 * from     从哪里调起子游戏，暂定可选值 ['hall', 'live']; hall 表示大厅，live表示直播间
 * 
 * apihost  指定web api测试地址 
 */

let object = {
    APPKEY: "DEFAULT",
    CHANNEL: "10000000001",
    PLATFORM: "sets",
    VERSION: "1.1.",            //web版项目构建后 VERSION = VERSION前三段 + . + BUILDVERSION
    BUILDVERSION: "202601071234",     //01年02月03日04时05分   web版项目构建后会被 ChessSetConfig.BUILDVERSION 覆盖
    
    ISLIVE: false,                  //是否与直播app相关的项目（用于区分项目是否与直播app有交互）
    IS_LIVE_ONLY: false,            //是否直播项目（用于区分 合集-直播 项目）
    IS_NATIVE_LIB: false,           //是否原生库项目
    IS_CLUB_ONLY: false,             //俱乐部
    IS_APPGAME: false,              //是否是APP项目(false 原生库   true app项目)
    IS_BUILDIN_APP: false,          //是否App内置版本（app本地化加载webview）
    SHOW_LAUNCH_LOADING: true,      //游戏启动后是否自动显示loading
    FIRST_ENTER_SUBGAME: true,      //接收到 subgame_enter_start 时，是否优先进入游戏，不需要等账号登录成功
    POST_INVOKE_FUNC_ERROR: false,  //子游戏调用主包函数不存在时，是否发消息通知app
    NEED_WAIT_FOR_CHECKED: true,    //是否需要等待检测是否在其它游戏中
    IS_SINGLE: false,               //是否单机游戏（NEED_WAIT_FOR_CHECKED=false）
    IS_PLAYBACK: false,             //是否牌局回放
    IS_ROBOT: false,                //表示该合集游戏进入的都是只有机器人的房间
    GATEWAY_URL: "",                //提供动态网关列表的web接口 http://192.168.0.215:82/GetIPStatic.ip
    UPDATE_URL:"https://platform.deaizhou.com/",   //提供热更后台
    SUBPACKAGE:false,               //是否分包，true表示各个子游戏的资源是单独分开的，需要下载，false 表示不分包，合并在一起
    FPS: 30,                        //帧率

    IS_SOCKET: false,               //是否支持socket
    IS_REGISTER: false,


    SKIN_DEFAULT: "a",              //当URL未指定skin参数时，皮肤默认取值
    SKIN: "a",                      //当前使用的皮肤
    SKINALL: ["a", "b"],            //当前支持的皮肤列表

    LANG_DEFAULT: "zh",             //当URL未指定lang参数时，语言默认取值
    LANG: "zh",                     //当前使用的语言
    LANGALL: ["zh", "zh_tw", "en", "th", "vi", "kh", "id"],   //当前支持的语言列表[th 泰国 kh 柬埔寨 vi 越南 id 印尼语]

    AREA: "",                       //服务器所在区域，暂定可选值 ['china', 'hongkong']
    FROM_DEFAULT: "live",           //FROM 的默认值
    FROM: "live",                   //从哪里调起子游戏，暂定可选值 ['hall', 'live']; hall 表示大厅，live表示直播间

    FILTER_GAMES: [0],            //网页版大厅游戏列表展示的gameid，为0表示展示所有游戏，否则只展示指定gameid
    DOMAIN_ACCOUNT: [], //帐号登录域名列表（指定域名只允许账号登录）（优先级高）
    DOMAIN_GUEST: [],   //游客登录域名列表（指定域名只允许游客登录）
    PASSWORDROOM: 0,  //直播游戏 密码房 0：不是密码房 1： 是密码房
    
    ISSTAG: false,                  //是否欧洲牌照项目
    DISABLE_URL_STAG: false,       //是否禁用url stag参数
    DISABLE_URL_SKIN: false,       //是否禁用url skin参数
    IS_CLUB_AUDIT_SWITCH: false,   //是否开启俱乐部审核开关
    ENABLE_CHANNEL: false,          //是否渠道包
    SELECT_TABLE_SWITCH: true,         //换桌开关
    VIDEO_BTN_SWITCH: true,            //视频开关
    IS_SHOW_FLOAT:false,                //保留2位小数点开关
    IS_OPEN_NATIVEUPDATE:false,         //是否启动热更新 true启用，false不启用
    IS_SHOW_GOLD_CHANGE_MODE_2:true,    //金币转换接口2
    DISABLE_RECORD_DETAILS: false,   //是否禁用战绩详情

    SHOW_FXQ_BTN: true, //飞行棋按钮开关（聊天、兑换、在线人数）
    FXQ_HIDE_XZQ_SWITCH: true,      //飞行棋隐藏下注区开关
    ENABLE_SERVER_VERSION: false,   //是否判断服务器版本
    OFFLINE_FOLLOWBET: false,       //离线跟投开关
    ENABLE_AUTO_PRELOAD: false,     //是否自动预加载
    ENABLE_STATISTICS: false,       //是否启用数据统计
    PRELOAD_SUBGAME_MAX_COUNT: 0,   //合集子游戏默认预加载的游戏个数(0表示加载所有的)
    IS_BLOCKCHAIN_AND_OFFICIAL: false, //是否是区块链官方房

    ISTelegramMiniApp: false,                  //新加:是否是外网模拟telegram mini app
    ISDEVELOP: true,                //是否为内部开发版  web版项目构建后会被 ChessSetConfig.ISDEVELOP 覆盖

    
    DEVELOPVERSION : 0,                  //区分开发版本，0：测试服，1：预发布，2：正式服

    IMKEY:"",                           //IM KEY
    //渠道包发布定制(以下配置当 ENABLE_CHANNEL 为 true 时才判断)
    CUSTOM:{
        ENABLE_DOWNLOAD_LOG: false,  //是否可下载日志（点击界面左下角时）
        ENABLE_UPLOAD_LOG: true,     //是否可上传日志到服务器
        ENABLE_SELECT_SERVER: false, //是否可选择服务器列表
        ENABLE_SHOW_LOGIN: false,    //是否显示登录界面
        ENABLE_SHOW_VERSION: true,   //是否显示版本号（设置界面）
    },    
    
    //新游戏开发时，大厅可增加测试游戏配置
    TEST_GAME_ITEM: [
        // {
        //     isLive: true,                       //是否直播子包
        //     nGameId: 999,                       //配置gameid
        //     sGamePath: "subgame-name",          //配置子游戏启动路径             
        //     manager: "game-common",             //棋牌项目子入口模块都是 game-common
        //     depends: ["game-live-assets"],      //合集依赖资源包 game-set-assets ，直播依赖资源包 game-live-assets
        //     options: {                          //直播间可选项
        //         tableID: "xxx#xxx",
        //         nLiveUserID: 0,
        //     }
        // },
        // {
        //     isLive: false,                      
        //     nGameId: 999,
        //     sGamePath: "subgame-name",                
        //     manager: "game-common",             
        //     depends: ["game-set-assets"],       
        // }
    ],
    //大厅列表是否显示测试游戏
    SHOW_TEST_GAME: true,

    //配置子游戏支持的皮肤和多语言
    SUBGAME_CONFIG: {
        [999]: {
            SKIN: {
                DEFAULT: function(){    //如果子游戏不支持 app.config.SKIN, 则使用这里配置的默认皮肤
                    return app.config.SKIN_DEFAULT
                },
                ALL: function(){ //子游戏支持的所有皮肤
                    return ["a", "b"];
                }, 
            },
            LANG: {
                DEFAULT: function(){    //如果子游戏不支持 app.config.LANG, 则使用这里配置的默认语言
                    return app.config.LANG_DEFAULT
                },
                ALL: function (skin) { //有可能某个皮肤还没支持多语言，这里用函数做判断
                    return ["zh", "zh_tw", "en", "th", "vi"]
                },
            },
        }
    }
};

function init() {
    if(!window) return;

    //just for test
    let UrlUtil = require("UrlUtil").default;
    let gateway = UrlUtil.get("gateway");
    if(gateway){
        object.GATEWAY_URL = gateway;
    }

    //window.ChessSetConfig在build-templates/web-mobile/src/ChessSetConfig.js中定义
    if(window && window.ChessSetConfig){
        for (const key in object) {
            let value = window.ChessSetConfig[key];
            if(typeof value != "undefined"){
                if(key!="CUSTOM"){
                    if(key=='TEST_GAME_ITEM'){
                        object[key] = object[key].concat(value);
                    }
                    else if(key=='SUBGAME_CONFIG'){
                        for (const custom_key in value) {
                            object[key][custom_key] = value[custom_key];
                        }
                    }
                    else{
                        object[key] = value;
                    }
                }
                else{
                    for (const custom_key in value) {
                        object[key][custom_key] = value[custom_key];
                        if(object.hasOwnProperty(custom_key)){
                            object[custom_key] = value[custom_key];
                        }
                    }
                }
            }
        }
    }
    if(window && window.ChessSetEnv){
        if(window.ChessSetEnv.IS_LIVE_ONLY){
            object.IS_LIVE_ONLY = true;
            object.ISLIVE = true;
        }
    }
    
    // let version = object.VERSION;
    // let array = version.split('.');
    // //最后一段替换为BUILDVERSION
    // array[array.length-1] = object.BUILDVERSION;
    // object.VERSION = array.join('.');
    // if(window.ChessSetConfig && window.ChessSetConfig.VERSION){
    //     object.VERSION = window.ChessSetConfig.VERSION;
    // }

     //游客登录域名列表（指定域名只允许游客登录）
    object.DOMAIN_GUEST = [];
    //帐号登录域名列表（指定域名只允许账号登录）
    object.DOMAIN_ACCOUNT = [];

    //是否渠道包
    if(!object.ENABLE_CHANNEL){
        if(window && window.ChessSetConfig){
            let guest = window.ChessSetConfig.DOMAIN_GUEST;
            let account = window.ChessSetConfig.DOMAIN_ACCOUNT;
    
            if(guest instanceof Array){
                object.DOMAIN_GUEST = guest;
            }
            if(account instanceof Array){
                object.DOMAIN_ACCOUNT = account;
            }
        }
    }
    else{
        //window.ChannelConfig在build-templates/web-mobile/src/ChannelConfig.js中定义
        if(window && window.ChannelConfig){
            object.ChannelConfig = window.ChannelConfig;

            //如果是渠道包，object.ISDEVELOP 强制设置为 false
            object.ISDEVELOP = false;

            let custom = window.ChannelConfig.CUSTOM;
            if(typeof custom === 'object'){
                //使用渠道里配置的 CHANNEL 和 PLATFORM 
                if(custom.CHANNEL && custom.CHANNEL!=""){
                    object.CHANNEL = custom.CHANNEL;
                }
                if(custom.PLATFORM && custom.PLATFORM!=""){
                    object.PLATFORM = custom.PLATFORM;
                }

                //网关 url
                if(custom.GATEWAY_URL && custom.GATEWAY_URL!=""){
                    object.GATEWAY_URL = custom.GATEWAY_URL;
                }
            }

            if(window.ChannelConfig.IMKEY){
                object.IMKEY = window.ChannelConfig.IMKEY
            }
            // if(window.ChannelConfig.GATEWAY_URL && window.ChannelConfig.GATEWAY_URL!=""){
            //     object.GATEWAY_URL = window.ChannelConfig.GATEWAY_URL;
            // }

            if(window.ChannelConfig.SERVER_WEBAPI && window.ChannelConfig.SERVER_WEBAPI.length > 0){
                let item = window.ChannelConfig.SERVER_WEBAPI[0];
                object.GATEWEBAPI_URL = item.HEAD+"://"+item.HOST+":"+item.PORT;
            }

            if(window.ChannelConfig.SERVER_UPDATEWEB && window.ChannelConfig.SERVER_UPDATEWEB.length > 0){
                let item = window.ChannelConfig.SERVER_UPDATEWEB[0];
                object.UPDATE_URL = item.HEAD+"://"+item.HOST+":"+item.PORT+"/";
            }

            let guest = window.ChannelConfig.DOMAIN_GUEST;
            let account = window.ChannelConfig.DOMAIN_ACCOUNT;
            if(guest instanceof Array){
                object.DOMAIN_GUEST = guest;
            }
            if(account instanceof Array){
                object.DOMAIN_ACCOUNT = account;
            }
        }
    }
}

object.init = init;

module.exports = object;