// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 与原生app功能交互封装
// ]]

let AppBridge = require("AppBridge");
let MsgManager = require("MsgManager");
let AppNativeBase = require("AppNativeBase");

let USE_APP_CONFIG = true;

let toggle_value = function (visible) {
    if(visible=="on" || visible=="off"){
        return visible;
    }
    return visible ? "on" : "off";
}


/**
 * app发送过来的消息监听方式：
 * 消息监听：app.native.on(app.bridge.ACTION.APP_ACTION_xxx, callback, target);
 * 取消监听：app.native.targetOff(target);
 */
class AppNative extends AppNativeBase {
    static default = null;
    
    constructor(){
        super();
    }


    /**
     * 
     * @param {String} func_name 要调用的函数名
     * @param  {...any} args 函数参数，支持多个
     * @returns 
     * result={
     *  success: boolean,   //函数存在则为 true
     *  data: any           //函数返回值
     * }
     */
    invokeFunction(func_name, ...args){
        let result = {
            success: true,
            data: null,
        }

        let func = this[func_name];

        if(typeof func == 'function'){
            result.data = func.apply(this, args);
            if(typeof result.data == 'undefined'){
                result.data = null;
            }
        }
        else{
            result.success = false;
             //console.warn(`[ERROR] 主包 AppNative 方法 "${func_name}" 不存在 `);
            if(app.config.POST_INVOKE_FUNC_ERROR){
                app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                    error: AppBridge.errorID(203)
                });
            }
        }

        return result;
    }

    /*
    以下为h5发送给app的消息接口
    */

    /**
     * 通知app打开url
     * @param {String} url 
     */
    openURL(url){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_OPEN_URL,
            value: {
                url: url,
            }
        });
        // if(!app.config.IS_BUILDIN_APP){//本地包
        //     if(app.url.get("live")||app.url.get("nomsg")){
        //         cc.sys.openURL(url);
        //     }
        // }
    }

    /**
     * 子游戏初始化后调用此消息获取app配置
     * 注：通过监听 app.native.on(app.bridge.ACTION.APP_ACTION_APP_CONFIG, callback, target) 接收结果
     */
    getAppConfig(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_GET_APP_CONFIG,
        })
    }

    /**
     * 获取牌桌信息后调用此消息获取牌桌用户mic配置，传入需要获取mic开关的userid列表
     * 注：通过监听 app.native.on(app.bridge.ACTION.APP_ACTION_MIC_STATUS, callback, target) 接收结果
     * @param {*} array_userid 
     */
    getMicStatus(array_userid){
        if(!array_userid){
            array_userid = []
        }
        if(typeof array_userid == 'number'){
            array_userid = [array_userid]
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_GET_MIC_STATUS,
            value: array_userid,
        })
    }
    
    /**
     * 1 询问退出子游戏
     * 主播身份点击退出按钮通知APP弹出提示：是否结束直播；用户点击通知APP直接退出直播间
     * @param {String} gameid
     */
    toggleExitGame(gameid){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_SUBGAME_EXIT,
            value: {
                gameid: gameid,
            }
        });

        if(app.url.get("live")){
             //console.warn("toggleExitGame：", "网页版测试");
            let params = {
                msg: AppBridge.EVENT.SUBGAME_EXIT_START,
                key: AppBridge.CLIENT_KEY,
                data: {
                    gameid: gameid,
                }
            }
            MsgManager.fire("message", {data: JSON.stringify(params)});
        }
    }

    /**
     * 2 打开/关闭兑换窗口
     */
    toggleExchange(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_EXCHANGE,
            value: "",
        })
    }

    /**
     * 3 打开/关闭在线用户列表
     */
    toggleOnlinePlayer(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_ONLINE_PLAYER,
            value: "",
        })
    }

    /**
     * 4 打开/关闭聊天窗口
     */
    toggleChat(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_CHAT,
            value: "",
        })
    }

    /**
     * 5 打开"打赏"礼物窗口
     * @param {String} userid 用户ID
     * @param {String} username 用户ID
     */
    toggleReward(userid, username){
        if(!userid){
            userid = "";
        }
        if(!username){
            username = "";
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_REWARD,
            value: {
                userid: userid,
                username: username,
            },
        })
    }

    /**
     * 6 主播开/闭麦，主播点击可开启/关闭自己的语音
     * 7 PK用户闭麦，PK用户点击可开启/关闭自己的语音
     * @param {Boolean} enable
     * @param {String} userid
     */
    toggleMic(enable){
        if(!USE_APP_CONFIG) return;

        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SET_APP_CONFIG,
            value: {
                mic: toggle_value(enable),
            }
        })
    }

    /**
     * 6 主播开/闭麦，主播点击可开启/关闭自己的语音
     * 7 PK用户闭麦，PK用户点击可开启/关闭自己的语音
     * @param {String} userid
     * @param {Boolean} enable
     */
    setMicStatus(userid, enable){
        if(!userid){
            userid = 0;
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SET_MIC_STATUS,
            value: [{
                userid: userid,
                status: toggle_value(enable),
            }]
        })
    }

    /**
     * 8 红包
     */
    toggleRedPacket(){
        //暂不需要
    }

    /**
     * 9 开启/关闭APP端的礼物动效
     * @param {Boolean} enable 
     */
    toggleGiftEffect(enable){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SET_APP_CONFIG,
            value: {
                gift_effect: toggle_value(enable),
            }
        })
    }

    /**
     * 10 在线客服，点击唤起QQ
     */
    toggleOnlineService(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_ONLINE_SERVICE,
            value: "",
        })
    }

    /**
     * 11 主播点击可开启/关闭整个房间的语音，关闭后所有用户都听不到语音
     * 12 用户点击可开启/关闭整个房间的语音，关闭后只有当前用户听不到主播与PK用户的语音
     * @param {Boolean} enable
     */
    toggleRoomVoice(enable){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SET_APP_CONFIG,
            value: {
                room_voice: toggle_value(enable),
            }
        })
    }

    /**
     * 开启/关闭系统设置里的语音
     * @param {Boolean} enable
     */
    toggleSystemVoice(enable){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SET_APP_CONFIG,
            value: {
                system_voice: toggle_value(enable),
            }
        })
    }

    /**
     * 13 贡献榜（点击打开/关闭APP的贡献榜列表）
     */
    toggleGongXianBang(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_GONG_XIAN_BANG,
            value: "",
        })
    }

    /**
     * 14 --
     */

    /**
     * 15 用户信息弹窗(点击主播头像与PK用户头像需通知APP唤起用户信息弹窗) 
     */
    toggleUserInfo(userid, username){
        if(!userid){
            userid = 0;
        }
        if(!username){
            username = "";
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_USER_INFO,
            value: {
                userid: userid,
                username: username,
            },
        })
    }

    /**
     * 用户上桌
     * @param {String} userid 
     */
    tableUserSitdown(userid){
        if(!userid){
            userid = 0;
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TABLE_USER_SITDOWN,
            value: {
                userid: userid
            },
        })
    }

    /**
     * 用户下桌
     * @param {String} userid 
     */
    tableUserStandup(userid){
        if(!userid){
            userid = 0;
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TABLE_USER_STANDUP,
            value: {
                userid: userid
            },
        })
    }

    /**
     * 当前玩家游戏状态更新
     * @param {String} status 取值 ['idle' , 'playing'] 
     */
    updateUserStatus(status){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_UPDATE_USER_STATUS,
            value: {
                status: status
            },
        })
    }

    /**
     * 当前玩家游戏状态更新
     * @param {String} status 取值 ["idle", "playing"] 
     */
    updateGameStatus(status){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_UPDATE_GAME_STATUS,
            value: {
                status: status
            },
        })
    }

    /**
     * 打开分享 
     */
    share(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SHARE,
            value: "",
        })
    }

    /**
     * 邀请好友
     */
    inviteFriends(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_INVITE_FRIENDS,
            value: "",
        })
    }

    /**
     * 打开申请列表
     */
    applyList(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_APPLY_LIST,
            value: "",
        })
    }

    /**
     * 打开管理规则
     */
    manageRule(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_MANAGE_RULE,
            value: "",
        })
    }

    /**
    * 打开管理列表
    */
    manageList(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_MANAGE_LIST,
            value: "",
        })
    }

    /**
    * 打开管理功能
    */
    manageFunction(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_MANAGE_FUNCTION,
            value: "",
        })
    }

     /**
    * 屏蔽消息
    */
    shieldRewardMessage(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SHIELD_REWARD_MESSAGE,
            value: "",
        })
    }

    /**
     * 扫码玩游戏
     */
    scanQRCodeToPlayGame(){
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_SCAN_QRCODE_TO_PLAY_GAME,
            value: "",
        })
    }

    /** 
     * 游戏内顶层界面打开
    */
    openGameTopPanel(){
        let params = {
            key: AppBridge.ACTION.GAME_ACTION_TOP_PANEL_OPEN, 
            value: ""
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }

    /** 
     * 游戏内顶层界面关闭
    */
     closeGameTopPanel(){
        let params = {
            key: AppBridge.ACTION.GAME_ACTION_TOP_PANEL_CLOSE, 
            value: ""
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }
    
    /** 
     * 用户入座通知APP 玩游戏消耗金币数量
    */
     sitDownGoldCost(gold){
        gold = gold?gold:0;

        let params = {
            key: AppBridge.ACTION.GAME_ACTION_GOLD_TICKET, 
            value: {
                gold: gold,  //消耗金币数量
            },
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }
    
    /** 
     * 游戏开始时通知APP 玩游戏消耗金币数量
    */
    startGameGoldCost(gold){
        gold = gold?gold:0;

        let params = {
            key: AppBridge.ACTION.GAME_ACTION_GOLD_COST, 
            value: {
                gold: gold,  //消耗金币数量
            },
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }

    /** 
     * 结算后通知APP用户输赢金币
    */
     settleGoldWin(gold){
        gold = gold?gold:0;
        
        let params = {
            key: AppBridge.ACTION.GAME_ACTION_GOLD_WIN, 
            value: {
                gold: gold,  //消耗金币数量
            },
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }

    /**
     * 通知 app 打开充值界面
     * @param {number} amount 充值金额（传0表示不指定数额；传-1表示余额不足；传-2表示可领取补助）
     * @returns true or false 网页版返回false，表示未处理，需要调用者作后续处理
     * 
     * 调用示例:  
        let result = app.native.invokeFunction("toggleRecharge", -1);
        if(!result.data){
             //console.warn("TODO 后续处理")
        }
        else{
            //  //console.log("已处理");
        }
     */
    toggleRecharge(amount=0){
        //网页版返回false，表示未处理，需要调用者作后续处理
        let bSupport = App.compareCompatibleVersion("4.6.0.9999");
        if (app.url.get("live") || !app.config.ISLIVE || !bSupport) {
            return false;
        }

        let isPortrait = 0;
        let subgame = app.game.getGame();
        if(subgame){
            isPortrait = subgame.isLandscape() ? 0 : 1;
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_RECHARGE,
            value: {
                amount: amount,
                isPortrait: isPortrait,
            },
        })
        //返回true表示已处理，不需要调用者作后续处理
        return true
    }

    /**
     * 询问app在哪里显示退出弹窗
     * @returns 
     */
    toggleExitDialog(){
        //网页版返回false，表示未处理，需要调用者作后续处理
        let bSupport = App.compareCompatibleVersion("4.6.2.9999");
        if (app.url.get("live") || !bSupport) {
            return false;
        }

        //询问app是否退出游戏
        app.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_TOGGLE_SUBGAME_EXIT,
            value: "",
        })
        //返回true表示已处理，不需要调用者作后续处理
        return true;
    }
}

AppNative.default = new AppNative();
module.exports = AppNative;