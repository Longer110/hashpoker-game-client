// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UserInfo = require("UserInfo");
let my = require("my");

let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

let UIFrame = require("UIFrame");
let i18n = require("i18n");
let MttCacheData = require("MttCacheData");

let AppBridge = require("AppBridge");
let LocalStorage = require("LocalStorage");
let UINoticeData = require("UINoticeData");
let Utils = require("Utils");
let UIDialog = require("UIDialog");
let MSG_FRAMEWORKS = require("Msg");


class MttClubManger{
    name = "MttClubManger";
    static default = null;
    static create() {
        if (!MttClubManger.default) {
            MttClubManger.default = new MttClubManger();
        }
        return MttClubManger.default;
    }

    constructor() {
        cc.log("MttClubManger:constructor");
        this.init();
    }

    init(){

        this.isLoginHas = false;
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtLogonRsp_CMD, this._onTEvtLogonRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtEventsOpenRsp_CMD, this._onTEvtEventsOpenRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtUserCntNotify_CMD, this._onTEvtUserCntNotify, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtRuleDNotify_CMD, this._onTEvtRuleDNotify, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtUsersRsp_CMD, this._onTEvtUsersRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtAwardsRsp_CMD, this._onTEvtAwardsRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtSignUpRsp_CMD, this._onTEvtSignUpRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtSignUpCancelRsp_CMD, this._onTEvtSignUpCancelRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtSignUpDRsp_CMD, this._onTEvtSignUpDRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtWatchRsp_CMD, this._onTEvtWatchRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtEnterRsp_CMD, this._onTEvtEnterRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtCancelNotify_CMD, this._onTEvtCancelNotify, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtToStartNotify_CMD, this._onTEvtToStartNotify, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtCheckRsp_CMD, this._onTEvtCheckRsp, this);
        MsgManager.on(MSG.GAME_CLUB_MTT.TEvtStatusNotify_CMD, this._onTEvtStatusNotify, this);

        my.net.on(my.NetworkEvent.CLOSE, this._onWebsocketClose, this);
        target.on(event.HALL_LOGIN_FINISH, this._onHallLoginSuccess, this);
    }

    _onWebsocketClose(data){
        cc.log("MttClubManger:_onWebsocketClose");
        this.closeNet();
    }
    //登录大厅成功返回
    _onHallLoginSuccess(data) {
        // this.login();
    }

    //MTT 登录返回
    _onTEvtLogonRsp(data){
        cc.log("MttClubManger:_onTEvtLogonRsp");
        if(data.nRlt == 0){
            cc.log("比赛服登录成功");
            this.isLoginHas = true;
            if(this.isOpenMttList){
                this.openMttList();
            }
        }
    }
    //MTT 赛事列表返回
    _onTEvtEventsOpenRsp(data){
        cc.log("MttClubManger:_onTEvtEventsOpenRsp");
        MttCacheData.setMttList(data)
        MsgManager.fire(MSG.NOTIFY.MTT_LIST_REFRESH);
    }
    //MTT 报名人数变化通知
    _onTEvtUserCntNotify(data){
        cc.log("MttClubManger:_onTEvtUserCntNotify");
        MttCacheData.updateMttUserCnt(data);
    }
    //MTT 比赛信息=>规则(动态部分)变化 通知
    _onTEvtRuleDNotify(data){
        cc.log("MttClubManger:_onTEvtRuleDNotify");
        if(data.nRlt == 0){
            MttCacheData.updateRule(data);
        }
        
    }
     //MTT 比赛信息=>玩家列表 返回
    _onTEvtUsersRsp(data){
        cc.log("MttClubManger:_onTEvtUsersRsp");
        MttCacheData.addPlayers(data);
        MsgManager.fire(MSG.NOTIFY.MTT_PLAYERLIST_REFRESH);
    }
    //MTT 比赛信息=>奖励列表 返回
    _onTEvtAwardsRsp(data){
        cc.log("MttClubManger:_onTEvtAwardsRsp");
        MttCacheData.addAwards(data);
        MsgManager.fire(MSG.NOTIFY.MTT_AWARDLIST_REFRESH);
    }
    //MTT 报名 返回
    _onTEvtSignUpRsp(data){
        cc.log("MttClubManger:_onTEvtSignUpRsp");
        if(data.nRlt == 0){
            MttCacheData.updateMttSignUp(data);
        }else if(data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.1"));
        }else if(data.nRlt == 2){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.2"));
        }else if(data.nRlt == 3){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.3"));
        }
    }
    //MTT 取消报名 返回
    _onTEvtSignUpCancelRsp(data){
        cc.log("MttClubManger:_onTEvtSignUpCancelRsp");
        if(data.nRlt == 0){
            MttCacheData.updateMttSignUpCancel(data);
        }else{
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.4"));
        }
    }
    //MTT 延迟报名 返回
    _onTEvtSignUpDRsp(data){
        cc.log("MttClubManger:_onTEvtSignUpDRsp");
        if(data.nRlt == 0){
            MttCacheData.updateMttSignUp(data);

            let nGameId = 125;
            if(data.hasOwnProperty("nGameId")){
                nGameId = data.nGameId;
            }
            if(data.hasOwnProperty("sTableId")){
                let gameData = {
                    nGameId: nGameId,
                    sTableId: data.sTableId,
                }
                this.enterGame(gameData);
            }
        }else if(data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.1"));
        }else if(data.nRlt == 2){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.2"));
        }else if(data.nRlt == 3){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.3"));
        }else if(data.nRlt == 5){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.5"));
        }
    }
    //MTT 观战 返回
    _onTEvtWatchRsp(data){
        cc.log("MttClubManger:_onTEvtWatchRsp");
        MttCacheData.updateStateAndnOp(data);


        let nGameId = 125;
        if(data.hasOwnProperty("nGameId")){
            nGameId = data.nGameId;
        }

        if(data.hasOwnProperty("sTableId")){
            let gameData = {
                nGameId: nGameId,
                sTableId: data.sTableId,
            }
            this.enterGame(gameData);
        }else{
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.4"));
        }
    }
    //MTT 进入比赛 返回
    _onTEvtEnterRsp(data){
        cc.log("MttClubManger:_onTEvtEnterRsp");
        MttCacheData.updateStateAndnOp(data);
        if(data.nRlt == 2){

            let nGameId = 125;
            if(data.hasOwnProperty("nGameId")){
                nGameId = data.nGameId;
            }
            if(data.hasOwnProperty("sTableId")){
                let gameData = {
                    nGameId: nGameId,
                    sTableId: data.sTableId,
                }
                this.enterGame(gameData);
            }
        }else if(data.nRlt == 5){
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.5"));
        }else{
            UIFrame.showTips(i18n.t("CLUB_MTT.ERROR.4"));
        }
    }
    //MTT 走马灯 比赛未达到开赛要求,被取消 通知
    _onTEvtCancelNotify(data){
        cc.log("MttClubManger:_onTEvtCancelNotify");
        let detail = i18n.t("CLUB_MTT.CancelMttTip");
        let str = Utils.replaceAll(detail, "XXX", data.sName);
        let showType = UIDialog.EShowType.OK;
        let params = {};
        params.showType = showType;
        params.text = str;
        params.callback = function (isOK) {
        }.bind(this);
        this.ShowPrompt(params)
        MsgManager.fire(MSG.NOTIFY.MTT_CANCELNOTIFY,{
            nEventId:data.nEventId,
            detail:str,
            sName:data.sName,
        });
    }
    //MTT 走马灯 比赛即将开始 通知
    _onTEvtToStartNotify(data){
        cc.log("MttClubManger:_onTEvtToStartNotify");
        let detail = i18n.t("CLUB_MTT.StartMttTip");
        let detailHall = i18n.t("CLUB_MTT.StartMttTipHall");
        let str = Utils.replaceAll(detail, "XXX", data.sName);
        let str2 =  Utils.replaceAll(detailHall, "XXX", data.sName);
        let nEventId = data.nEventId;
        let showType = UIDialog.EShowType.OKCANCEL;
        let params = {};
        params.showType = showType;
        params.text = str2;
        params.callback = function (isOK) {
            if(isOK){
                this.contest(nEventId);
            }
        }.bind(this);
        this.ShowPrompt(params)
        MsgManager.fire(MSG.NOTIFY.MTT_STARTNOTIFY,{
            nEventId:data.nEventId,
            detail:str,
            sName:data.sName,
            nRemainT:data.nRemainT,
        });
    }
    //MTT 入口提示查询 返回
    _onTEvtCheckRsp(data){
        cc.log("MttClubManger:_onTEvtCheckRsp");
    }

    //MTT 赛事状态更新
    _onTEvtStatusNotify(data){
        cc.log("MttClubManger:_onTEvtStatusNotify");
        MttCacheData.updateStateAndnOp(data);
    }

    //连接断开
    closeNet(){
        this.isLoginHas = false;
    }
    //登录比赛服
    login(){
        if(this.isLoginHas){
            cc.log("MttClubManger:login 比赛服已经登录");
            return
        }
        let params = {
            nUserID:UserInfo.getInfo().nUserID,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtLogonReq_CMD, params);
    }
    //打开比赛列表
    openMttList(){

        if(!this.isLoginHas){
            cc.log("MttClubManger:login 比赛服没有登录");
            return
        }
        let params = {
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtEventsOpenReq_CMD, params);

        MttCacheData.startMttListSchedule();
        this.isOpenMttList = true;
    }
    //关闭比赛列表
    closeMttList(){
        if(!this.isLoginHas){
            cc.log("MttClubManger:login 比赛服没有登录");
            return
        }
        let params = {
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtEventsCloseReq_CMD, params);

        MttCacheData.stopMttListSchedule();
        this.isOpenMttList = false;
    }

    signup(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtSignUpReq_CMD, params);
    }

    delayedsignup(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtSignUpDReq_CMD, params);
    }

    cancelsignup(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtSignUpCancelReq_CMD, params);
    }

    //观战
    battle(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtWatchReq_CMD, params);
    }
    //进入比赛
    contest(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtEnterReq_CMD, params);
    }

    //获取玩家列表
    getUsers(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtUsersReq_CMD, params);
        MttCacheData.clearPlayers();
    }

    
    //获取奖励列表
    getAwards(nEventId){
        let params = {
            nEventId:nEventId,
        }
        app.net.send(CMD.GAME_CLUB_MTT.value, CMD.GAME_CLUB_MTT.TEvtAwardsReq_CMD, params);
        MttCacheData.clearAwards();
    }


    enterGame(data){
        let appkey = app.url.get("appkey");
        if(!appkey){
            appkey = AppBridge.CLIENT_KEY;
        }
        let token = UserInfo.getInfo().token;
        let loginType = UserInfo.getLoginType();
        let viewer = 0;
        if(UserInfo.isViewer()){
            viewer = 1;
            token = "";
        }
        let anchor = 0;
        if(app.getIsAnchor()){
            anchor = 1;
        }
        //LANGTEST：测试时手动修改语言标志
        let lang = app.config.LANGTEST || LocalStorage.getSysLanguage();
        app.config.LANGTEST = undefined;
        
        let skin = app.config.SKIN;
        let params = {
            msg: AppBridge.EVENT.SUBGAME_ENTER_START,
            key: appkey,
            data: {
                token: UserInfo.getInfo().token,
                gameid: data.nGameId,
                tableid: data.sTableId,
                lang: lang,
                skin: skin,
                viewer: viewer,
                anchor: anchor,
                isClubMttMatch:true,

                loginType: loginType, //网页版才有，指定登录方式，避免账号登录无效
            }
        }
        MsgManager.fire("message", {data: JSON.stringify(params)});
    }


    ShowPrompt(data){
        cc.log("ShowPrompt")
        let scene = cc.director.getScene()
        let canvas = scene ? scene.getChildByName("Canvas"):null;
        if(cc.isValid(scene) && scene.name == "main-hall" && cc.isValid(canvas)){

            cc.log("ShowPrompt load")
            let path = "prefab/UIDialog";
            let parent = app.node;
            let wrapper = app.ClubViews;
            wrapper.ui.loadPopup(path, function (component) {
                parent.addChild(component.node, 1024);
                component.setShowType(data.showType);
                component.setUIBtnTitle();
                component.show(data.text, function (isOK) {
                    if(data.callback){
                        data.callback(isOK);
                    }
                });
                component.node.position = cc.Vec2.ZERO;

                cc.log("ShowPrompt add")
            }.bind(this)            
            , {
                path_resources: "main-hall/resources/"
            });
        }
        
    }


    showMttRule(nEventId){
        let scene = cc.director.getScene()
        let canvas = scene ? scene.getChildByName("Canvas"):null;
        let wrapper = app.ClubViews;
        let path = "main-hall/resources/prefab/";
        let name = "MttRule";
        path = wrapper.path(name,null,path);
        wrapper.bundle.load(path,cc.Prefab,(error, prefab)=>{
            if(!error){
                let node = cc.instantiate(prefab);
                if(cc.isValid(canvas)){
                    canvas.addChild(node, 0, name);
                    let com = node.getComponent(name);
                    if (com){
                        com.init(MttCacheData.getMttDataById(nEventId));
                    }
                }
            }else{
                cc.error("showMttRule loadui error = ", error)
            }
        })
    }

}

let clubMtt = MttClubManger.create();
window["clubMtt"] = clubMtt;
module.exports = clubMtt;
