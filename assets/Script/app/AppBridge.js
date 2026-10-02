// v1.0.47@2022.04.20
let AppBridge = {
    CLIENT_KEY: "chessset_h5",
    LIVE_KEY: "chessset_live",
    MESSAGE: "LIVEAPP_MESSAGE",
        
    errorID: function (code) {
         //console.log("error code: ", code, AppBridge.errorInfo(code));
        return code;
    },
    errorInfo: function (code) {
        return AppBridge.ERROR[code];
    },

    APPKEY: {
        HELLO_GAME: "HELLO_GAME",
        MORE_WIN: "MORE_WIN",
        MAYA: "MAYA",
        CCLIVE: "CCLIVE",
    },

    EVENT: {
        /**
         * 游戏错误码通知(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.GAME_ERROR, data);
         * data = {
         *  error: AppBridge.errorID(0),
         *  value: Object,
         * }
         * error = 0 for success, !0 for fail.
         */
        GAME_ERROR: "GAME_ERROR",
        
        /**
         * 游戏功能点动作触发(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.GAME_ACTION, data);
         * data = {
         *  key: AppBridge.ACTION.GAME_ACTION_TOGGLE_VIDEO, // 视频开/关
         *  value: 'on',                                    // 取值 [on,off]
         * }
         */
        GAME_ACTION: "GAME_ACTION",

        /**
         * APP功能点动作触发(app->h5)
         * e.g. for app:
         * webview.postMessage(AppBridge.EVENT.APP_ACTION, data);
         * data = {
         *  key: AppBridge.ACTION.APP_ACTION_ROOM_LOCK,     // 房间是否已上锁
         *  value: 'on',                                    // 取值 [on,off]，on已上锁，off未上锁
         * }
         */
        APP_ACTION: "APP_ACTION",

        /**
         * 游戏初始化完成(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.GAME_INITED, data);
         * data = {
         *  version: require("ConfigGame").VERSION
         * }
         */
        GAME_INITED: "GAME_INITED",

        /**
         * 资源缓存开始(app->h5)
         * e.g. for app:
         * webview.postMessage(AppBridge.EVENT.CACHE_START, data);
         * data = {
         *  lang: "zh_cn",    //语言标志
         *  list: [121, 122], //需要预先缓存的子游戏id列表
         * }
         */
        CACHE_START: "CACHE_START",

        /**
         * 资源缓存完成(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.CACHE_FINISH, data);
         * data = {
         *  list: [121, 122], //成功缓存的子游戏id列表
         * }
         */
        CACHE_FINISH: "CACHE_FINISH",

        /**
         * 子游戏进入场景开始(app->h5)
         * e.g. for app:
         * webview.postMessage(AppBridge.EVENT.SUBGAME_ENTER_START, data);
         * data = {
         *  passwordroom: 0,    //密码房(0:不是密码房；1:是密码房)
         *  adminuser: 0,       //是否管理员用户(0：非管理员；1:是管理员)
         *  vipprivilege: {     //VIP特权配置
         *      lowmode: 1      //低调模式（取值 [0, 1]）
         *  },
         *  compatibleVersion: "x.x.x", //功能兼容版本号。用于旧app未及时更新时，h5游戏内控制相应功能兼容
         *  area: "",           //游戏服务器所在区域，空串表示无限制。其它取值包括但不限于['china', 'hongkong', 'singapore']，具体由后台配置
         *  viewer: 1,          //观众登录模式（只能观看，不能参与）取值 [0, 1]
         *                          0：普通模式；1: 观众模式. 
         *                          注意：观众模式不需要指定token;
         *  token: "xxx",       //令牌登录模式 (优先级：viewer > token)
         *  gameid: 121,
         *  tableid: "123#456",
         *  anchor: 0,          //是否主播 取值 [0, 1]
         *                          0: 非主播；1: 主播
         *  lang: "zh_cn",      //语言标志, 取值 [zh_cn, zh_tw, en, th]
         *  skin: "a",          //皮肤标志，取值 [transparent, bluebottom, fullscreenag]
         *                          transparent:默认全透明皮肤; bluebottom:牌桌蓝色底皮肤； fullscreenag:类似视讯AG的皮肤
         *  from: "",           //从哪里进入游戏，取值[hall, live]，hall表示从大厅进入、live表示从直播间进入
         * 
         *  tableswitch:1,       //换桌开关 取值 [0,1]   0：关闭 1：开启
         * 
         *  viewinfo: {
         *      status_bar_height: 0,       //手机状态栏高度（如果除了状态栏，app还有其它内容要游戏作顶部偏移，也加入这个值传给游戏）
         *      top: 100,                   //webview 与手机屏幕顶部距离（或者是类似iphoneX刘海屏状态栏的偏移量）
         *      bottom: 100,                //webview 与手机屏幕底部距离（或者是类似iphoneX底部浮动条的偏移量）
         *      width: 750,                 //webview 宽
         *      height: 1334 - top - bottom,//webview 高
         *      bottom_left_offset: 0,      //全面屏底部左侧偏移量
         *      bottom_right_offset: 0,     //全面屏底部右侧偏移量
         *   },
         * }
         */
        SUBGAME_ENTER_START: "SUBGAME_ENTER_START",

        /**
         * 子游戏进入场景完成(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.SUBGAME_ENTER_FINISH, data);
         * data = {
         *  gameid: 121,    
         *  width: 750,     //直播项目游戏内牌桌面板 width
         *  height: 445,    //直播项目游戏内牌桌面板 height
         *  isPortrait: 0,  //取值: 0/1,    //1表示竖屏
         *  error: AppBridge.errorID(0)
         * }
         * error = 0 for success, !0 for fail.
         */
        SUBGAME_ENTER_FINISH: "SUBGAME_ENTER_FINISH",

        /**
         * H5通知隐藏webview(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.GAME_HIDE, data);
         * data = {
         * }
         */
        GAME_HIDE: "GAME_HIDE",

        /**
         * App通知H5直播间已关闭(app->h5)
         * e.g. for app:
         * webview.postMessage(AppBridge.EVENT.ROOM_CLOSE, data);
         * data = {
         * }
         */
        ROOM_CLOSE: "ROOM_CLOSE",

        /**
         * 子游戏退出场景开始(app->h5)
         * e.g. for app:
         * webview.postMessage(AppBridge.EVENT.SUBGAME_EXIT_START, data);
         * data = {
         *  gameid: 121,
         * }
         */
        SUBGAME_EXIT_START: "SUBGAME_EXIT_START",

        /**
         * 子游戏退出场景完成(h5->app)
         * e.g. for h5:
         * h5.postMessage(AppBridge.EVENT.SUBGAME_EXIT_FINISH, data);
         * data = {
         *  gameid: 121,
         *  error: AppBridge.errorID(0)
         * }
         * error = 0 for success, !0 for fail.
         */
        SUBGAME_EXIT_FINISH: "SUBGAME_EXIT_FINISH",
    },
    ACTION: {
        //*游戏功能点动作触发(h5->app)*/////////////////////////////
        /**
         * app接收到的消息体结构示例：
         * params = {
         *      msg: AppBridge.EVENT.GAME_ACTION,
         *      data: {
         *          key: AppBridge.ACTION.GAME_ACTION_TOGGLE_VIDEO,
         *          value: "on",
         *      },
         *      key: AppBridge.CLIENT_KEY,
         * }
         */
        GAME_ACTION_LOGIN: "GAME_ACTION_LOGIN",                 //h5通知app跳转去登录（观众登录h5游戏后，在游戏中点击下注等操作时，h5触发此消息，通知app跳去登录）

        GAME_ACTION_TOGGLE_VIDEO: "GAME_ACTION_TOGGLE_VIDEO",   //视频显示开关, （h5内按钮触发，通知app显示/隐藏直播视频）
                                                                /*
                                                                value="on", //取值 ["on", "off"] 
                                                                */

        GAME_ACTION_TOGGLE_CHAT: "GAME_ACTION_TOGGLE_CHAT",     //聊天窗口开关（h5内按钮触发，通知app打开/关闭聊天界面）
        

        GAME_ACTION_PLAY_INFO: "GAME_ACTION_PLAY_INFO",         //h5通知app当前牌局信息，取值对象:
                                                                /*
                                                                value={
                                                                    gold: 0,                //主播余额
                                                                    play_serial: "xxx",     //牌局号
                                                                    table_serial: "xxx",    //牌桌号
                                                                    content: "xxx",         //展示文字内容 (牌局号xxx 百家乐xxx 主播余额xxx)
                                                                                            //注：如果主播余额为-1的时候，表示没有主播，不需要拼接主播余额
                                                                }
                                                                */

        GAME_ACTION_CHANGE_TABLE: "GAME_ACTION_CHANGE_TABLE",   //h5通知app切换牌桌
                                                                /*
                                                                value={
                                                                    liveid: "xxx",     //app直播间id
                                                                    anchorid: "xxx",   //app主播id
                                                                    tableid: "xxx",    //牌桌id
                                                                }
                                                                */

                                                                
        GAME_ACTION_TOGGLE_SUBGAME_EXIT: "GAME_ACTION_TOGGLE_SUBGAME_EXIT",   
                                                                //h5 询问 app 是否退出子游戏 -->
                                                                //app 确认退出后发送 EVENT.SUBGAME_EXIT_START 通知 h5 正式开始开始退出子游戏 -->
                                                                //h5 完成退出逻辑后，发送 EVENT.SUBGAME_EXIT_FINISH 通知 app，app 释放 webview
                                                                
        GAME_ACTION_TOGGLE_EXCHANGE: "GAME_ACTION_TOGGLE_EXCHANGE", //h5通知app打开/关闭兑换窗口

        GAME_ACTION_TOGGLE_ONLINE_PLAYER: "GAME_ACTION_TOGGLE_ONLINE_PLAYER", //h5通知app打开/关闭在线用户列表

        GAME_ACTION_TOGGLE_REWARD: "GAME_ACTION_TOGGLE_REWARD", //h5通知app打开/关闭"打赏"礼物窗口
                                                                /*
                                                                value={
                                                                    userid: "xxx",        //打赏的用户id（id为空串表示机器人）
                                                                    username: "username", //打赏的用户昵称
                                                                }
                                                                */

        GAME_ACTION_TOGGLE_ONLINE_SERVICE: "GAME_ACTION_TOGGLE_ONLINE_SERVICE", //h5通知app打开/关闭在线客服，点击唤起QQ

        GAME_ACTION_TOGGLE_GONG_XIAN_BANG: "GAME_ACTION_TOGGLE_GONG_XIAN_BANG", //贡献榜（点击打开/关闭APP的贡献榜列表）

        GAME_ACTION_TOGGLE_USER_INFO: "GAME_ACTION_TOGGLE_USER_INFO", //打开 App 用户信息弹窗
                                                                /*
                                                                value={
                                                                    userid: "xxx",     //点击的用户id
                                                                    username: "username", //用户昵称
                                                                }
                                                                */
                                           
        GAME_ACTION_GET_APP_CONFIG: "GAME_ACTION_GET_APP_CONFIG",//h5向app获取配置。比如toggle控制的开关(麦克风、礼物动效、房间语言等)
                                                                //app收到此消息后，发送APP_ACTION_APP_CONFIG，返回相关配置

        GAME_ACTION_SET_APP_CONFIG: "GAME_ACTION_SET_APP_CONFIG",//h5通知app更新相关配置
                                                                //注：value对象中的某个属性存在的时候才更新
                                                                /*
                                                                value={
                                                                    mic: "on",  //麦克风开关，取值 ["on", "off"] 
                                                                                //主播开/闭麦，主播点击可开启/关闭自己的语音
                                                                                //PK用户闭麦，PK用户点击可开启/关闭自己的语音

                                                                                注：v1.0.20@2020.11.06 后弃用mic属性，使用 GET/SET_ MIC_STATUS 接口，通过userid设置对战用户mic状态

                                                                    gift_effect: "on", //礼物动效开关，取值 ["on", "off"] 

                                                                    room_voice: "on",   //房间语音开关，取值 ["on", "off"]
                                                                                        //主播点击可开启/关闭整个房间的语音，关闭后所有用户都听不到语音
                                                                                        //PK用户点击可开启/关闭整个房间的语音，关闭后只有当前用户听不到主播与PK用户的语音

                                                                    system_voice: "on", //开启/关闭系统设置里的语音，取值 ["on", "off"] 

                                                                    game_server_list: "on",//开启/关闭 游戏好路选桌开关，取值 ["on","off"]

                                                                }
                                                                */
                                                                                                                       
        GAME_ACTION_GET_MIC_STATUS: "GAME_ACTION_GET_MIC_STATUS", //h5向app获取牌桌对战用户mic开关状态配置
                                                                    //app收到此消息后，发送 APP_ACTION_MIC_STATUS，返回mic开关状态配置
                                                                    // value=[userid, ...], 对战用户id数组

        GAME_ACTION_SET_MIC_STATUS: "GAME_ACTION_SET_MIC_STATUS", //h5通知app更新对战用户mic开关状态配置
                                                                /*
                                                                //对战用户mic开关数组
                                                                value=[
                                                                        {
                                                                            userid: "xxx",//用户id
                                                                            status: "on", //取值 ["on", "off"] 
                                                                        },
                                                                        ...
                                                                    ],
                                                                */


        GAME_ACTION_TABLE_USER_SITDOWN: "GAME_ACTION_TABLE_USER_SITDOWN",//用户上桌
                                                                /*
                                                                value={
                                                                    userid: "xxx", //用户id
                                                                } 
                                                                */

        GAME_ACTION_TABLE_USER_STANDUP: "GAME_ACTION_TABLE_USER_STANDUP",//用户下桌
                                                                /*
                                                                value={
                                                                    userid: "xxx", //用户id
                                                                } 
                                                                */

        GAME_ACTION_OPEN_URL: "GAME_ACTION_OPEN_URL", // 通知 app 打开url  
                                                                /*
                                                                value={
                                                                    url: "xxx", //需要打开的url
                                                                } 
                                                                */

        GAME_ACTION_UPDATE_USER_STATUS: "GAME_ACTION_UPDATE_USER_STATUS", //通知 app 当前玩家的游戏状态
                                                                /*
                                                                value={
                                                                    status: "idle" / "playing", //当前玩家的游戏状态(空闲中/游戏中)，取值 ["lookon", "playing"] 
                                                                }
                                                                */

        GAME_ACTION_UPDATE_GAME_STATUS: "GAME_ACTION_UPDATE_GAME_STATUS", //通知 app 当前游戏的状态
                                                                /**
                                                                 * value={
                                                                    status: "idle" / "playing", //当前游戏状态(空闲中/游戏中)，取值 ["idle", "playing"] 
                                                                }
                                                                 */
        GAME_ACTION_SHARE: "GAME_ACTION_SHARE", //打开分享
        GAME_ACTION_INVITE_FRIENDS: "GAME_ACTION_INVITE_FRIENDS", //邀请好友 无参数
        GAME_ACTION_APPLY_LIST: "GAME_ACTION_APPLY_LIST", //打开申请列表  

        GAME_ACTION_SHIELD_REWARD_MESSAGE: "GAME_ACTION_SHIELD_REWARD_MESSAGE", //屏蔽聊天区打赏消息 点击按钮后弹出屏蔽消息窗体
        GAME_ACTION_MANAGE_LIST: "GAME_ACTION_MANAGE_LIST",                   //管理列表 点击弹出管理列表窗体
        GAME_ACTION_MANAGE_RULE: "GAME_ACTION_MANAGE_RULE",                   //管理规则 点击弹出管理规则弹窗
        GAME_ACTION_MANAGE_FUNCTION: "GAME_ACTION_MANAGE_FUNCTION",           //管理功能 点击后弹出管理功能窗体

        GAME_ACTION_APP_SLIDEABLE: "GAME_ACTION_APP_SLIDEABLE", //通知 app 是否可滑动（比如游戏内有滚动界面时，通知app其不可滑动）
                                                                /**
                                                                 * value={
                                                                    slideable: 0, //取值 [0, 1]。0表示不可滑动，1表示可滑动 
                                                                }
                                                                 */

        GAME_ACTION_RECHARGE: "GAME_ACTION_RECHARGE",           //通知 app 调起充值
                                                                /**
                                                                value={
                                                                    amount: 0,  //充值金额（预留字段，传0表示不指定数额；传-1表示余额不足；传-2表示小于设定金额可领取补助）
                                                                    isPortrait: 0/1,    //1表示竖屏
                                                                }
                                                                */

        GAME_ACTION_TOP_PANEL_OPEN: "GAME_ACTION_TOP_PANEL_OPEN",  //游戏内顶层界面打开
        GAME_ACTION_TOP_PANEL_CLOSE: "GAME_ACTION_TOP_PANEL_CLOSE",//游戏内顶层界面关闭

        GAME_ACTION_SCAN_QRCODE_TO_PLAY_GAME: "GAME_ACTION_SCAN_QRCODE_TO_PLAY_GAME", //扫码玩游戏

        GAME_ACTION_TOGGLE_RED_DOT: "GAME_ACTION_TOGGLE_RED_DOT", //红点提示
                                                                /*
                                                                value={
                                                                    xxx: 1,   //xxx表示约定的功能标志，当前可选取值 (礼品盒："gift_box")；1可表示具体数目，不需要具体值的话可以只传1
                                                                    ...
                                                                }
                                                                */

        GAME_ACTION_APP_MENU_LIST: "GAME_ACTION_APP_MENU_LIST", //h5游戏通知app当前需要展示哪些菜单项
                                                                /*
                                                                value=[
                                                                    "game_fish_table",
                                                                    "game_bag",
                                                                    ... // 所有可选项参考 APP_ACTION_MENU_EVENT 【event_key】可选值
                                                                ]
                                                                */

        GAME_ACTION_GOLD_TICKET: "GAME_ACTION_GOLD_TICKET",     //用户入座通知APP 玩游戏入场券金币数量
                                                                /*
                                                                value={
                                                                    gold: xxx,  //入场券金币数量
                                                                }
                                                                */
        
        GAME_ACTION_GOLD_COST: "GAME_ACTION_GOLD_COST",         //游戏开始时通知APP 玩游戏消耗金币数量
                                                                /*
                                                                value={
                                                                    gold: xxx,  //消耗金币数量
                                                                }
                                                                */

        GAME_ACTION_GOLD_WIN: "GAME_ACTION_GOLD_WIN",           //结算后通知APP用户输赢金币
                                                                /*
                                                                value={
                                                                    gold: xxx,   //输赢金币数量（负数为输）
                                                                }
                                                                */


        //////////////////////////////////////////////////////////
        //*APP功能点动作触发(app-->h5)*/////////////////////////////
        /**
         * app发送的消息体结构示例：
         * params = {
         *      msg: AppBridge.EVENT.APP_ACTION,
         *      data: {
         *          key: AppBridge.ACTION.APP_ACTION_TOGGLE_FULLSCREEN,
         *          value: "on",
         *      },
         *      key: AppBridge.LIVE_KEY,
         * }
         */
        APP_ACTION_ROOM_LOCK: "APP_ACTION_ROOM_LOCK",           //房间是否已上锁, 取值 [on, off] 
                                                                //on已上锁，off未上锁
                                                                //注：在玩家通过SUBGAME_ENTER_START进入游戏时，如果房间已上锁，app应马上触发此消息，通知h5房间是上锁状态
                                                                //另：主播中途切换上锁/解锁房间时，app应当触发此消息通知h5房间上锁状态的改变

        APP_ACTION_TOGGLE_FULLSCREEN: "APP_ACTION_TOGGLE_FULLSCREEN",   
                                                                //APP界面全屏/半屏 取值[on, off] (全屏时触发h5特殊玩法)
                                                                /*
                                                                value="on", // 取值[on, off]
                                                                */

        APP_ACTION_CHAT_INFO: "APP_ACTION_CHAT_INFO",           //通知h5更新消息数目
                                                                /*
                                                                value={
                                                                    number: 999, //新消息数目
                                                                }
                                                                */

        APP_ACTION_ONLINE_PLAYER_INFO: "APP_ACTION_ONLINE_PLAYER_INFO",  
                                                                //通知h5更新在线人数
                                                                /*
                                                                value={
                                                                    number: 999, //在线人数
                                                                }
                                                                */

        APP_ACTION_APP_CONFIG: "APP_ACTION_APP_CONFIG",         //app向h5发送相关属性配置。（需要更新的属性才发送）
                                                                //value取值与 GAME_ACTION_SET_APP_CONFIG 对应，详见 GAME_ACTION_SET_APP_CONFIG

        APP_ACTION_MIC_STATUS: "APP_ACTION_MIC_STATUS",   //app向h5发送相关属性配置。（需要更新的属性才发送）
                                                          //value取值与 GAME_ACTION_SET_MIC_STATUS 对应，详见 GAME_ACTION_SET_MIC_STATUS

        APP_ACTION_MIC_VOLUME: "APP_ACTION_MIC_VOLUME",     //app向h5发送mic音量消息
                                                            /*
                                                            value=[
                                                                {
                                                                    userid: "xxx",
                                                                    volume: 0/1, //mic音量大小，取值[0~100]。0表示没声音，大于等于1表示有声音
                                                                }
                                                            ]
                                                            */

        APP_ACTION_ENTER_FOREGROUND: "APP_ACTION_ENTER_FOREGROUND", //app通知h5游戏进入前台
        APP_ACTION_ENTER_BACKGROUND: "APP_ACTION_ENTER_BACKGROUND", //app通知h5游戏进入后台
        APP_ACTION_NETWORK_MODE: "APP_ACTION_NETWORK_MODE", //app通知h5手机网络模式。目前定义有 wifi 和 4g 模式
                                                            /*
                                                            value={
                                                                mode: "wifi" | "5g" | "4g" | "3g" | "2g" | "none" | "unknown",
                                                            }
                                                            */
                                                           
        APP_ACTION_GET_GAME_STATUS:"APP_ACTION_GET_GAME_STATUS",//APP获取游戏的状态   GAME_ACTION_UPDATE_GAME_STATUS 返回游戏的状态
        APP_ACTION_APPLY_LIST_NEWS:"APP_ACTION_APPLY_LIST_NEWS",//APP有新申请列表消息 显示红点
        APP_ACTION_KICKOUT_TABLE: "APP_ACTION_KICKOUT_TABLE", // 踢出牌桌后可旁观   
                                                            /*
                                                            value=[
                                                                {
                                                                    userid: "xxx",
                                                                },
                                                                ...
                                                            ]
                                                            */

        
        APP_ACTION_MENU_EVENT: "APP_ACTION_MENU_EVENT", // app 与 h5 菜单交互事件
                                                            /**
                                                            value={
                                                                //菜单按钮事件，可选值详见【event_key】可选值：
                                                                event_key: "", 
                                                                //菜单按钮事件数据 
                                                                event_data: {
                                                                    userid: xxx, //当前用户ID
                                                                }, 
                                                            }
                                                            */

                                                            /**
                                                            【event_key】可选值：

                                                            "game_rule": 游戏规则，
                                                            "game_record": 游戏记录
                                                            "game_system_setting": 系统设置
                                                            "game_surrender": 投降
                                                            "game_trusteeship": 托管
                                                            "game_standup": 站起
                                                            "game_kickout": 踢人
                                                            "game_recommended_figure": 推荐图
                                                            "game_pause": "游戏暂停"
                                                            "game_resume": "游戏开始"
                                                            "game_fish_table": "鱼表"
                                                            "game_fish_room": "鱼私人房间按钮"
                                                            "game_bag": "背包"
                                                            "game_list_open": "打开了捕鱼菜单列表"

                                                            【event_data】特别说明：
                                                            {
                                                                evetn_key: "game_recommended_figure",
                                                                event_data: {
                                                                    hide: 0, //是否隐藏推荐图。取值[0, 1]：0不隐藏 1隐藏
                                                                }
                                                            }

                                                            其它统一传参 userid
                                                            {
                                                                evetn_key: "xxx",
                                                                event_data: {
                                                                    userid: '当前用户ID',
                                                                }
                                                            }
                                                            */

        APP_ACTION_MIC_USER_LIST: "APP_ACTION_MIC_USER_LIST", //app 通知 h5 主播上麦列表
                                                            /**
                                                            value=[
                                                                {
                                                                    userid: "xxx",  //上麦的用户ID
                                                                    status: 0,      //麦的状态， 取值[0, 1，2，3]：0正常连麦状态 ，1麦克风不可用，2本地闭麦，3静音
                                                                },
                                                                ...
                                                            ]
                                                             */
        
        APP_ACTION_GAME_SHOW: "APP_ACTION_GAME_SHOW",       //通知h5游戏已显示，游戏内部可播放声音等
        APP_ACTION_GAME_HIDE: "APP_ACTION_GAME_HIDE",       //通知h5游戏已隐藏，游戏内部需关闭声音等     
        APP_ACTION_SHOW_EXIT_DIALOG: "APP_ACTION_SHOW_EXIT_DIALOG",       //通知h5游戏退出弹窗在哪里处理
                                                            /**
                                                             value="app" / "game"
                                                             */                                                    

    },
    ERROR: {
        0: "SUCCESS",
        100: "GAME_ENGINE_NOT_READY",   //游戏引擎环境未就绪
        101: "SERVER_UNDER_MAINTENANCE",//游戏维护中
        102: "IN_GAME_FAILE_TIMEOUT",//查询当前正在玩的游戏超时
        103: "IN_LOGIN_FAILE",       //账号登录失败(token登录失败，需要获取新token)
        104: "IN_GAME_FAILE_CHECK",  //上次玩的游戏还没结束，value={gameid,tableid}
        105: "IN_GAME_LOGIN_FAILE",  //子游戏登录失败
        106: "ACCOUNT_LOGON_REPEAT", //账号重复登录
        107: "KICK_OUT_FROM_ROOM",   //已退出游戏(牌桌已解散)
        108: "CONNECT_TIME_OUT",     //连接超时，请检查网络连接并重新登录
        109: "GET_LANGUAGE_ERROR",   //获取游戏语言包资源出错
        110: "GET_ASSETS_ERROR",     //获取游戏子包资源出错，子游戏启动失败
        200: "VERSION_INCONSISTENCY", /*客户端版本与服务器配置版本不一致。
                                      * app接收到此消息后，应该调用webapi获取新的版本号，重新初始化h5页面
                                      * value={version:xxx}
                                      */
        201: "SUBGAME_NOT_EXITS",    //未配置的子游戏ID
        202: "TABLE_ID_CAN_NOT_BE_NULL",    //tableid不能为空
        203: "MAIN_PACKAGE_UNCOMPATIBILITY", //主包不兼容（当h5子游戏调用主包的方法不存在时，触发此消息）
    },
};

module.exports = AppBridge;