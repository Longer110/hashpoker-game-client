// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 直播项目配置
// ]]

let ConfigGameDefault = require("ConfigGameDefault");
let ConfigEnvDefault = require("ConfigEnvDefault");

let ConfigGame = {
    PLATFORM: "clubWeb",
    ISLIVE: true,                           //是否与直播app相关的项目（用于区分项目是否与直播app有交互）
    IS_LIVE_ONLY: true,                     //是否直播项目（用于区分 合集-直播 项目）
    SKIN_DEFAULT: "c",                      //当URL未指定skin参数时，皮肤默认取值
    SKIN: "c",                              //皮肤(默认值：default)
    SKINALL: ["default", "a", "b", "c", "d"],    //当前支持的皮肤列表
    LANG_DEFAULT: "zh",                     //当URL未指定lang参数时，语言默认取值
    LANG: "zh",                             //语言
    LANGALL: ["zh", "zh_tw", "en", "th", "vi", "kh", "id"],   //当前支持的语言列表
    IS_CLUB_ONLY: true,                     //俱乐部
    ENABLE_AUTO_PRELOAD: true,
    CHANNEL:"10000000002",
    ENVIRONMENT: "",
    IS_SLIDE_ADVERT: true,                  //是否可以上下滑动大厅牌局广告
    IS_APPSTORE_APP: false,                 //是否appstore应用（appstore包）
    IS_SHOW_APP_SHARE: false,                //是否显示app分享
    FPS: 60,

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

    //配置子游戏支持的皮肤和多语言
    SUBGAME_CONFIG: {
        //鱼虾蟹
        [121]: {
            SKIN: {
                ALL: function(){
                    return ["default", "a", "b","c"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "en", "th", "vi"]
                },
            },
        },
        //百家乐
        [122]: {
            SKIN: {
                ALL: function(){
                    return ["default", "a", "b", "c"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "en", "th", "vi"]
                },
            },
        },
        //德州
        [123]: {
            SKIN: {
                ALL: function(){
                    return ["default", "a", "b", "c"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "vi", "th", "en"]
                },
            },
        },
        //德州
        [125]: {
            SKIN: {
                ALL: function(){
                    return ["default", "a", "b", "c"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "vi", "th", "en", "kh", "id"]
                },
            },
        },
        //短牌德州
        [175]: {
            SKIN: {
                ALL: function(){
                    return ["c"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "vi", "th", "en", "kh", "id"]
                },
            },
        },
        //奥马哈
        [126]: {
            SKIN: {
                ALL: function(){
                    return ["c"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "vi", "th", "en", "kh", "id"]
                },
            },
        },
        //飞行棋
        [133]: {
            SKIN: {
                ALL: function(){
                    return ["a", "b", "c", "d"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "th", "vi", "en"]
                },
            },
        },
        //色碟
        [153]: {
            SKIN: {
                DEFAULT: function(){    //如果子游戏不支持 app.config.SKIN, 则使用这里配置的默认皮肤
                    return ["default"]
                },
                ALL: function(){
                    return ["default","b","c"];
                }, 
            },
            LANG: {
                DEFAULT: function(){    //如果子游戏不支持 app.config.SKIN, 则使用这里配置的默认皮肤
                    return ["zh"]
                },
                ALL: function (skin) {
                    return ["zh", "zh_tw", "th", "vi", "en"]
                },
            },
        },
        //骰宝
        [155]: {
            SKIN: {
                ALL: function(){
                    return ["default"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "th", "vi", "en"]
                },
            },
        },
        //足球
        [129]: {
            SKIN: {
                ALL: function(){
                    return ["default"];
                }, 
            },
            LANG: {
                ALL: function (skin) {
                    return ["zh", "zh_tw", "th", "vi", "en"]
                },
            },
        },
    }
}

let ConfigEnv = {
    USE_PremultiplyAlpha: true,    //是否使用左乘透明混合模式
    appkey: "LIVE",
}

//遍历覆盖默认属性
for (const key in ConfigEnv) {
    ConfigEnvDefault[key] = ConfigEnv[key];
}
for (const key in ConfigGame) {
    if(key=="TEST_GAME_ITEM"){
        ConfigGameDefault[key] = ConfigGame[key].concat(ConfigGameDefault[key]);
    }
    else{
        ConfigGameDefault[key] = ConfigGame[key];
    }
}

ConfigGameDefault.init();

module.exports = ConfigGameDefault;