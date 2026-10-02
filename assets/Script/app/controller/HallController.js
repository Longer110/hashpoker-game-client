let my = require("my");
require("request_hall");
require("response_hall");
let UserInfo = require("UserInfo");
let CMD = require("protocol_hall");
let MSG = require("Msg_hall");
let MsgManager = require("MsgManager");
let i18n = require('i18n');
let UIFrame = require("UIFrame");
let CMD_LOGIN = require("protocol_login");
let Msg_login = require("Msg_login");

let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

// let isUpdate = true;

let HallController = cc.Class({
    extends: cc.Component,
    properties: {
        _onGetRoomListCallback: null,
        _onCheckEnterSubGameCallback: null,
    },
    register() {
        MsgManager.on(MSG.LogonRsp_CMD, this._loginHallCallback, this);     //登录大厅返回
        MsgManager.on(MSG.RoomListRsp_CMD, this._onGetRoomList, this); //房间列表返回
        MsgManager.on(MSG.BeforeLoadScenceRsp_CMD, this._onCheckEnterSubGame, this);
        MsgManager.on(Msg_login.ACCOUNT.SUB_GP_CURRENTGAMEQUERRY, this._onCheckInOtherGame, this);

        MsgManager.on(MSG.UserGoldLessStandardNotify_CMD, this._onUserGoldLessStandard, this);//用户金币低于设定值通知
    },
    unregister() {
        MsgManager.un(this._loginHallCallback, this);
        MsgManager.un(this._onGetRoomList, this);
        MsgManager.un(this._onCheckEnterSubGame, this);
        MsgManager.un(this._onUserGoldLessStandard, this);
    },
    //账号登录成功后，登录大厅
    loginHall() {
        let info = UserInfo.getInfo();
        let userId = info.nUserID;
    
        window.logTimestamp("SERVER_HALL_START ==> ");
        cc.log("HallController", "loginHall userId= " + userId);
        app.net.send(CMD.Main_CMD.value, CMD.Main_CMD.LogonReq_CMD, { nUserID: userId});
    },
    
    _loginHallCallback(data) {
        window.logTimestamp("SERVER_HALL_CALLBACK ==> ");
        app.stopTimestamp({
            loginHall: true
        });

        cc.log("HallController", "_loginHallCallback");
        if (data.nResult == 0) {
            //大厅登录返回，设置玩家信息
            let info = data.tUserInfo;
           
            let nGoldConvertType = 1;
            if(data.tExtraConfigureInfo){
                let extendStr = data.tExtraConfigureInfo.replace(/\ +/g,"")
                extendStr = extendStr.replace(/[\r\n]/g,"")
                try {
                    let configJson = JSON.parse(extendStr);
                    if(configJson.IsNeedGoldUnit != null){
                        nGoldConvertType = configJson.IsNeedGoldUnit
                    }
                    cc.log("_loginHallCallback json",configJson)
                } catch (error) {
                    cc.error("_loginHallCallback json 解析出错 ", extendStr, error);
                }
            }

            UserInfo.setInfo({
                nUserID: info.nUserID,
                nGold: info.nGold,
                nSex: info.nSex,
                // strNickName: info.sNickName,
                strNickNameBase64: info.sNickName, //服务器返回的昵称是 Base64 加密过的
                strHeadUrl: info.sFaceID,
                nVisitor: info.nVisitor,
                nClubId: data.nLastClubId,
                nGoldConvertType: nGoldConvertType,
                nCreateTime :info.sTime,
            });

            // // MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_SUCCESS, data);
            // target.emit(event.HALL_LOGIN_SUCCESS, data);
            
            // // 以下消息改为 NotifyHall 中触发
            // //登录大厅成功完成，避免多个地方监听HALL_LOGIN_SUCCESS导致顺序执行不可控问题
            // target.emit(event.HALL_LOGIN_FINISH, data);

            //埋点
            let sceneNmae = cc.director.getScene()?.name || "empty";
            if (sceneNmae.charAt(sceneNmae.length - 2) === "_") {
                sceneNmae = sceneNmae.substring(0, sceneNmae.length - 2);
            }
            app.statis.upload({
                sUiPath: sceneNmae,
                sEvent: "userInfo",
                iUserId: info.nUserID,
                sName: info.sNickName,
                bSex: info.nSex,
            });

            target.emit(event.HALL_LOGIN_SUCCESS, data);
            this._requestPlayingGameInfo();
        } 
        else {
            target.emit(event.HALL_LOGIN_FAIL, data);
        }
    },
    //查询在玩游戏状态
    _requestPlayingGameInfo(){
        let gameid = UserInfo.getInfo().gameid || 0;
        let roomid = -2; //0表示免费场，-1表示想进前一次在玩的房间，-2表示空
        let game = app.game.getGame();
        if(game){
            roomid = game.getSubRoomID();
            gameid = game.getSubGameID();
        }
        this._onCheckEnterSubGameCallback = (data) => {
            this._onCheckEnterSubGameCallback = null;
            let tCurrentPlay = null;
            if(data.nResult != 0){
                if(data.nGameId != 0){
                    tCurrentPlay = {
                        nGameId: data.nGameId,
                        nRoomId: data.nRoomId,
                        sTableId: data.sTableId,
                        nClubId: data.nClubId,
                    }
                }
            }
            data = {
                tCurrentPlay,
            }
            cc.log("请求进入子游戏", JSON.stringify(data));
            this._onPlayingNotify(data.tCurrentPlay);
            target.emit(event.HALL_LOGIN_FINISH, data);
        }
        this.checkEnterSubGame(gameid, roomid);
    },
    //重连时游戏状态通知
    _onPlayingNotify(data) {
        cc.warn(this.name, "登录大厅游戏状态返回：", data);

        //设置当前子游戏数据
        app.game.setData(data);
    },
    //检查是否在其它游戏中
    checkInOtherGame(nGameId, nRoomId){
        let data = {
            nUserId:UserInfo.getInfo().nUserID,
        }
        app.net.send(CMD_LOGIN.MDM_GP_LOGON.value, CMD_LOGIN.MDM_GP_LOGON.SUB_REQ_LOGON_CURRENTGAMEQUERRY, data);
    },
    _onCheckInOtherGame(data){
        let game = app.game.getGame();
        if(game){
            game.onCheckInOtherGame(data);
        }
    },

    //检查是否可进入子游戏
    checkEnterSubGame(nGameId, nRoomId) {
        let data = {
            nGameId: nGameId,
            nRoomId: nRoomId,
        }
        app.net.send(CMD.Main_CMD.value, CMD.Main_CMD.BeforeLoadScenceReq_CMD, data);
    },
    _onCheckEnterSubGame(data){
        if(this._onCheckEnterSubGameCallback){
            this._onCheckEnterSubGameCallback(data);
            return;
        }
        
        let game = app.game.getGame();
        if(game){
            cc.log("检查进入子游戏", JSON.stringify(data));
            game.onCheckEnterSubGame(data);
        }
    },
    //房间列表请求
    reqRoomList(nGameId, callback) {
        this._onGetRoomListCallback = callback;

        cc.log("HallController", "房间列表请求 getRoomList: nGameId="+nGameId);
        let data = {
            nGameId: nGameId,
        }
        app.net.send(CMD.Main_CMD.value, CMD.Main_CMD.RoomListReq_CMD, data);
    },
    //房间列表返回
    _onGetRoomList(data) {
        cc.log("HallController", "房间列表返回 _onGetRoomList:", data);
        
        //出现异常
        if (data.sErrStr) {
            if(this._onGetRoomListCallback){
                let callback = this._onGetRoomListCallback;
                this._onGetRoomListCallback = null;
                callback(data);
            }

            return;
        }
       
        // let robotRoom = [];
        // for (let index = 0; index < data.arrRoomItems.length; index++) {
        //     const element = data.arrRoomItems[index];
        //     //机器人模式
        //     if(app.config.IS_ROBOT){
        //         if(element.nRoomId >= 50){
        //             robotRoom.push(element);
        //         }
        //     }
        //     else{
        //         if(element.nRoomId < 50){
        //             robotRoom.push(element);
        //         }
        //     }
        // }
        // app.game.setRoomList(robotRoom);
        app.game.setRoomList(data.arrRoomItems);
        
        if(this._onGetRoomListCallback){
            let callback = this._onGetRoomListCallback;
            this._onGetRoomListCallback = null;
            callback(data);
        }
    },

    //用户金币低于设定值通知
    _onUserGoldLessStandard(data){
        //从大厅进入子游戏的才需要处理
        cc.log("用户金币低于设定值通知", app.config.FROM);
        if(app.config.FROM != 'hall'){
            return;
        }

        let result = app.native.invokeFunction("toggleRecharge", -2);
        let dev = app.config.ISDEVELOP;
        if(!result.data){
            dev && cc.warn("toggleRecharge", "网页版不需要处理")
        }
        else{
            dev && cc.warn("toggleRecharge", "已处理")
        }
    }
})

module.exports = HallController;