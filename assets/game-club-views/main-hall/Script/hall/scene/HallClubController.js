// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      qgs
//     * @DateTime:    2021-12-01 15:05:23
//     * @Description: 大厅
//     * 
// ]]

let MsgManager = require("MsgManager");
let clubGameConfig = require("clubGameConfig");
let CMD = require("protocol_club");
let MSG = require("Msg_club");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let ConfigGame = require("ConfigGame");
let i18n = require("i18n");
let NotifyCenter = require("NotifyCenter");
let HallClubCacheData = require("HallClubCacheData");
let UIClubDialog = require("UIClubDialog");
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let HallClubControl = require("HallClubControl");
let LocalStorage = require("LocalStorage");
let HallClubLogic = require("HallClubLogic");
// let componentList = ["HallGame", "HallClubMain", "HallCareerMain", "HallMyInfo","HallMttMain"];
let componentList = ["HallCommunity", "HallGame", "HallClubMain", "HallActivityMain", "HallMyInfoNew"];
let _btnCommunityHideList = ["btn_community"];
let _defaultCurTag = 4;
// let componentList = ["HallGame", "HallMyInfo"];
// let GoogleAdController = require("GoogleAdController");
let SDKPlatform = require("SDKPlatform");
let Base64 = require("base64");
let CryptoJS = require('aes');
let core = require('core');
let UIDialog = require("UIDialog");
let TopNotificationManager = require("TopNotificationManager");

cc.Class({
    extends: cc.Component,

    properties: {
        menuList: {
            default: [],
            type: cc.Node,
            tooltip: '菜单按钮',
        },
        prefabList: {
            default: [],
            type: cc.Prefab,
            tooltip: '模块预制体',
        },

        content: cc.Node,
        popup: cc.Node,
        btn_club: cc.Node,
        adPrefab: cc.Prefab,
        createUserInfo: cc.Prefab,
        moreInfoPrefab: cc.Prefab,

        _curTag: 4, //1:社区 2：牌局 3：俱乐部 4： 活动 5:我的 (默认活动页)
        _inviteRedPoint: 0, //通知里面邀请未处理数量
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },


    start() {
        this.registerMsg();
        this.loadPrefab(2);
        HallClubControl.init(this);
        this.loginClub();
        HallClubCacheData.savePlayBackData({});
        this.getUserRedDot();
        // this.openMoreInfo();
        // this.showCreateUserInfo();//去除第一次登录显示修改名称和头像

    },




    showCreateUserInfo() {
        let userInfo = UserInfo.getInfo()
        if (userInfo.nLoginCount == 1) {
            if (this.createUserInfo) {
                let node = cc.instantiate(this.createUserInfo);
                this.node.addChild(node);
                let component = node.getComponent("LoginCreateHead");
                if (component) {
                    component.init(userInfo.strNickName, userInfo.strHeadUrl);
                }
            }
            UserInfo.setInfo({
                nLoginCount: userInfo.nLoginCount + 1,
            })
        }
    },


    onDestroy() {
        this.unRegisterMsg();
    },

    registerMsg() {
        MsgManager.on(MSG.NOTIFY.ClubSLogOnResp_ui, this._onLoginClubCallBack, this);
        MsgManager.on(MSG.NOTIFY.ClubSCreateResp_ui, this._onCreateClubCallBack, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetUserClubListResp_ui, this._onGetUserClubList, this);
        MsgManager.on(MSG.NOTIFY.OPEN_DIALOG, this.showDialog, this);
        MsgManager.on(MSG.NOTIFY.INPUT_PASSWORD, this.inputPassword, this);
        MsgManager.on(MSG.NOTIFY.ClubSKickOutNotify_ui, this.clubSickOutNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserMsgNotify_ui, this.userMsgNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserRedDotResp_ui, this._onUserRedDot, this);
        MsgManager.on(MSG.NOTIFY.ClubSSceneChangeNotify_ui, this._onSceneChangeNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSAdvertiseMentGoldRsp_ui, this._onAdvertiseMentGold, this);
        MsgManager.on(MSG.NOTIFY.UPDATE_NOTICE_REDPOINT, this.updateNoticeRedPoint, this);
        MsgManager.on(MSG.NOTIFY.LOGIN_CLUB, this.loginClub, this);
        MsgManager.on(MSG.NOTIFY.ClubActivityInfoRsp_ui, this._onActivityInfo, this);
        MsgManager.on(MSG.NOTIFY.CLUB_OPEN_ACTIVITY_UI, this._onOpenActivityUI, this);

        MsgManager.on(MSG.NOTIFY.LABEL_RUN_ACTION, this._runLabelAction, this);

        MsgManager.on(MSG.NOTIFY.GOOGLE_AD.VIDEO, this._googleVideoCallBack, this);
        MsgManager.on(MSG.NOTIFY.GOOGLE_AD.VIDEO_FAILED, this._googleVideoFailedCallBack, this);
        MsgManager.on(MSG.NOTIFY.ClubSInvitedPlayGameRsp_ui, this._onShowTopFriend, this);
        MsgManager.on(MSG.NOTIFY.ClubSWebKickOutNotify_ui, this._onUserKickOut, this); //黑名单踢出

        MsgManager.on(MSG.NOTIFY.ClubSNameCountNotify_ui, this._onClubSNameCountNotify, this); //改名次数通知
    },

    unRegisterMsg() {
        MsgManager.un(this._onOpenActivityUI);
        MsgManager.un(this._onActivityInfo);
        MsgManager.un(this._onLoginClubCallBack);
        MsgManager.un(this._onCreateClubCallBack);
        MsgManager.un(this._onGetUserClubList);
        MsgManager.un(this.showDialog);
        MsgManager.un(this.inputPassword);
        MsgManager.un(this.clubSickOutNotify);
        MsgManager.un(this.userMsgNotify);
        MsgManager.un(this._onUserRedDot);
        MsgManager.un(this._onSceneChangeNotify);
        MsgManager.un(this.updateNoticeRedPoint);
        MsgManager.un(this._runLabelAction);
        MsgManager.un(this.loginClub);
        MsgManager.un(this._onAdvertiseMentGold);
        MsgManager.un(this._onShowTopFriend, this);
        MsgManager.un(this._onUserKickOut, this);
        MsgManager.un(this._onClubSNameCountNotify, this);

        target.targetOff(this);
        // if (HallClubControl){
        //     HallClubControl.onDestroy();
        // }

        MsgManager.un(this._googleVideoCallBack);
        MsgManager.un(this._googleVideoFailedCallBack);
    },

    // update (dt) {},

    //------------------ 服务器返回BEGIN-----------------------------

    //创建俱乐部返回
    _onCreateClubCallBack(data) {
        if (data.nRlt == 0) {
            for (let i = 0; i < this.popup.children.length; i++) {
                if (this.popup.children[i].name == "HallCreateClub") {
                    this.popup.children[i].destroy();
                }
            }
            UIFrame.showTips(i18n.t("CLUB_ERROR.CREATE_CLUB_SUCCESS"));
            this.requestClubList();
            let curLoginClubId = HallClubCacheData.getCurLoginClub();
            if (curLoginClubId) {
                return;
            }
            let params = {
                nUserId: UserInfo.getInfo().nUserID,
                nNewClubId: data.nClubId,
            }
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSwitchReq_CMD, params);
        } else if (data.nRlt == 1) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
        } else if (data.nRlt == 2) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_ERROR2"));
        } else if (data.nRlt == 3) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_CLUB_NAME_ERROR"));
        } else if (data.nRlt == 4) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
        } else if (data.nRlt == 5) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NAME_ERROR1"));
        } else if (data.nRlt == 6) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NAME_ERROR2"));
        } else if (data.nRlt == 7) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.CREATE_CLUB_ERROR"));
        }
    },

    //登录俱乐部成功返回
    _onLoginClubCallBack(data) {
        if (data.nRlt != 0) {
            let params = {
                isUseRichText: true,
                text: i18n.t("CLUB_ERROR.UNKNOW_ERROR"),
                callBack: null,
            }
            if (data.nRlt == 1) {
                params.text = i18n.t("CLUB_ERROR.USER_ID_ERROR");
            } else if (data.nRlt == 2) {
                params.text = i18n.t("CLUB_ERROR.NOT_HAS_CLUB");
            } else if (data.nRlt == 3) {
                params.text = i18n.t("CLUB_ERROR.DIFF_ARRAY");
            } else if (data.nRlt == 4) {
                params.text = i18n.t("CLUB_ERROR.ADMIN_MGR2");
            } else if (data.nRlt == 5) {
                params.callBack = function () {
                    // let clubId = HallClubLogic.getCanLoginClubId();
                    // this.loginClub(0);
                }.bind(this);
                params.text = i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER");
            } else if (data.nRlt == 6) {
                params.callBack = function () {
                    this._logOut();
                }.bind(this);
                params.text = i18n.t("CLUB_HALL_TIP.WEI_HU_ZHONG");
            } else if (data.nRlt == 7) {
                params.callBack = function () {
                    this._logOut();
                }.bind(this);
                params.text = i18n.t("CLUB_HALL_TIP.ACCOUNT_BLOCKED");
            } else if (data.nRlt == 8) {
                params.callBack = function () {
                    this._logOut();
                }.bind(this);
                params.text = i18n.t("CLUB_HALL_TIP.IP_BLOCKED");
            } else if (data.nRlt == 9) {
                params.callBack = function () {
                    this._logOut();
                }.bind(this);
                params.text = i18n.t("CLUB_HALL_TIP.GPS_BLOCKED");
            }
            this.showDialog(params);
            return;
        }
        if (!data.tScence) {
            return;
        }

        if (HallClubLogic.isShowClub()) {
            //显示俱乐部
            // this.btn_club.active = true;
        } else {
            //隐藏俱乐部
            // this.btn_club.active = false;
        }


        if (this._curTag == 1) {
            this.loadPrefab(1, true);
            this.setBtnStatus("btn_community");
        }
        else if (this._curTag == 2) {
            //牌局界面
            this.loadPrefab(2, true);
            this.setBtnStatus("btn_game");
        } else if (this._curTag == 3) {
            //俱乐部界面
            if (data.tScence && data.tScence.nClubId == 0) {
                //牌局界面
                this.loadPrefab(2, true);
                this.setBtnStatus("btn_game");

            } else {
                //俱乐部界面
                this.loadPrefab(3, true);
                this.setBtnStatus("btn_club");
            }
        } else if (this._curTag == 4) {
            this.loadPrefab(4, true);
        } else if (this._curTag == 5) {
            this.loadPrefab(5, true, true);
        }

        this.updateClubRedPoint();

        this.nAdertisementGoldLeftCnt = data.tScence.nAdertisementGoldLeftCnt || 0;
        // this.showGoogleAd();

        let userId = UserInfo.getInfo().nUserID;
        if (!LocalStorage.getItem("CLUB_MW_STRING" + userId)) {
            let str = LocalStorage.getLoginPWD();
            if (str) {
                let params = {
                    nUserId: userId,
                    mwString: CryptoJS.encryptByECBAndIv(core.enc.Utf8.parse(str), "DZhoubttpokerTHE", "DZHOU24274AFFDG6"),
                }
                app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserMWStringReq_CMD, params);
            }

        }

        let params = {
            nUserId: userId,
        }

        if (cc.sys.isNative && app.config.IS_APPSTORE_APP) {
            //绑定用户
            if (data.hasOwnProperty("ifBinging") && data.ifBinging == 1) {
                app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubsFileConfigReq_CMD, params);
            }
        } else {
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubsFileConfigReq_CMD, params);
        }

        this.sendRecommend();

        //this.getAtivityInfo();
    },

    _onGetUserClubList(data) {
        if (HallClubCacheData.getCurLoginClub() == null) {
            this.loginClub();
        }

        if (this._curTag == 3) {
            //俱乐部界面
            let com = this.getComponentByName(componentList[2]);
            if (com) {
                com.updateMenu(data.arrClub);
            }
        } else if (this._curTag == 2) {
            //牌局界面
            let com = this.getComponentByName(componentList[1]);
            if (com) {
                com.updateMenu(data.arrClub);
            }
        }
    },

    //被踢出俱乐部
    clubSickOutNotify(data) {
        let clubId = HallClubCacheData.getCurLoginClub();
        HallClubCacheData.kickOutClub(data.nClubId);

        if (data.nClubId == clubId) {
            HallClubCacheData.setCurLoginClub(null);
            for (let i = 0; i < this.popup.children.length; i++) {
                this.popup.children[i].destroy();
            }

            let clubId = HallClubLogic.getCanLoginClubId();

            if (clubId == null) {
                if (this._curTag == 2) {
                    this.loadPrefab(2);
                }
            }

            this.loginClub();
        }
    },

    userMsgNotify(data) {
        if (data.nType == 1 && data.tApply.nStatus == 1) {
            this.requestClubList();
            let clubId = HallClubCacheData.getCurLoginClub();
            if (clubId == 0 && this._curTag == 2) {
                clubId = data.tClubInfo.nClubId;
                this.changeClub(clubId);
            }
        } else if (data.arrRedot) {
            let bShowRedPoint = false;
            for (let i = 0; i < data.arrRedot.length; i++) {
                if (data.arrRedot[i].nType != 1 && data.arrRedot[i].nCount > 0) {
                    bShowRedPoint = true;
                }

            }

            let redPointNode = this.menuList[3].getChildByName("redPoint");
            if (redPointNode) {
                redPointNode.active = bShowRedPoint;
            }

            this.updateNoticeRedPoint(bShowRedPoint)
        }
    },

    _onUserRedDot(data) {
        let bShowRedPoint = false;
        for (let i = 0; i < data.arrRedot.length; i++) {
            if (data.arrRedot[i].nType != 1 && data.arrRedot[i].nCount > 0) {
                bShowRedPoint = true;
            }

        }

        this.updateNoticeRedPoint(bShowRedPoint);
    },

    _onSceneChangeNotify(data) {
        this.updateClubRedPoint();
    },

    //------------------ 服务器返回END-----------------------------

    //------------------ 请求服务器BEGIN-----------------------------
    /*登录俱乐部
    nClubId: 0表示登录大厅，其他登录俱乐部
    */
    loginClub(loginClubId) {
        let clubList = HallClubCacheData.getClubList();
        if (!clubList) {
            //要先获取到俱乐部列表才能登录俱乐部
            this.requestClubList();
            return;
        }

        let clubId = HallClubCacheData.getCurLoginClub();
        let lastClubId = UserInfo.getInfo().nClubId;
        if (loginClubId != undefined) {
            clubId = loginClubId;
        } else if (lastClubId) {
            clubId = lastClubId;
        } else if (clubId == null) {
            clubId = HallClubLogic.getCanLoginClubId();
        }

        if (clubId == null) {
            //-1表示没有大厅也没有俱乐部
            clubId = -1;
        }

        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            nClubId: 0,
        }

        this._appStartUrl = SDKPlatform.getAppStartUrl();
        if (this._appStartUrl && this._appStartUrl != "") {
            let value = HallClubLogic.getQueryString("i", this._appStartUrl)
            QYLogs.warn("inviteCode = ", value);
            if (value) {
                params.nInviteCode = value;
            }
        }


        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSLogOnReq_CMD, params);

        UserInfo.getInfo().nClubId = null;
    },

    /*
    获取俱乐部列表
    */
    requestClubList() {
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetUserClubListReq_CMD, params);
    },

    /*
    获取红点信息
    */
    getUserRedDot() {
        let params = {
            nNouse: 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserRedDotReq_CMD, params);
    },

    //获取活动信息
    getAtivityInfo() {
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            nActivityType: 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubActivityInfoReq_CMD, params);
    },

    //------------------ 请求服务器END-----------------------------

    _cleanupClubOverlay() {
        try {
            var clubComponent = this.getComponentByName("HallClubMain");
            if (clubComponent) {
                clubComponent._clubPageVisible = false;
                if (clubComponent._destroyRecommendContainer) {
                    clubComponent._destroyRecommendContainer();
                }
            }
        } catch (e) {}

        try {
            var scene = cc.director.getScene();
            var canvas = scene ? scene.getChildByName("Canvas") : cc.find("Canvas");
            var cleanNodes = function(parent) {
                if (!parent || !parent.children) return;
                for (var i = parent.childrenCount - 1; i >= 0; i--) {
                    var child = parent.children[i];
                    if (!child) continue;
                    var name = String(child.name || "");
                    if (name.indexOf("_rest_") === 0) {
                        child.active = false;
                        child.stopAllActions();
                        child.destroy();
                    } else {
                        cleanNodes(child);
                    }
                }
            };
            cleanNodes(canvas);
        } catch (e) {}
    },

    onClickMenuCallBack(event, customEventData) {
        var targetName = event && event.target ? event.target.name : "";
        if (targetName !== "btn_club") {
            this._cleanupClubOverlay();
        }
        if (event.target.name === "btn_community") {
            var currentClubId = HallClubCacheData.getCurLoginClub();
            if (currentClubId !== null && Number(currentClubId) !== 0) {
                this.changeClub(0);
            }
            if (this._curTag == 1) {
                return;
            }

            //点击社区按钮
            this.loadPrefab(1, true);
            this.setBtnStatus(event.target.name, true);
        } else if (event.target.name === "btn_club") {
            //点击俱乐部
            if (this._curTag == 3) {
                return;
            }

            let clubId = HallClubCacheData.getCurLoginClub();
            if (!clubId) {
                clubId = HallClubLogic.getCanLoginClubId(clubId);
                if (clubId) {
                    this.changeClub(clubId);
                } else {
                    this.loadPrefab(3, true);
                    this.setBtnStatus(event.target.name, true);
                }

            } else {
                this.loadPrefab(3, true);
                this.setBtnStatus(event.target.name, true);
            }

            this._curTag = 3;
        } else if (event.target.name === "btn_game") {
            if (this._curTag == 2) {
                return;
            }

            //点击牌局按钮
            let clubId = HallClubCacheData.getCurLoginClub();
            if (clubId == null) {
                this.loginClub();
            }
            this.loadPrefab(2, true);
            this.setBtnStatus(event.target.name, true);

            this._curTag = 2;
        }
        // else if (event.target.name === "btn_career") {
        //     //点击生涯
        //     if (this._curTag == 3) {
        //         return;
        //     }
        //     this.loadPrefab(3, true);
        //     this.setBtnStatus(event.target.name, true);
        // } 
        else if (event.target.name === "btn_activity") {
            //点击活动
            if (this._curTag == 4) {
                return;
            }
            this.loadPrefab(4, true);
            this.setBtnStatus(event.target.name, true);
        } else if (event.target.name === "btn_my") {
            //点击我的
            if (this._curTag == 5) {
                return;
            }
            this.loadPrefab(5, true);
            this.setBtnStatus(event.target.name, true);
        }
        else if (event.target.name === "btn_my1") {
            //点击我的
            if (this._curTag == 6) {
                return;
            }
            this.loadPrefab(6, true);
            this.setBtnStatus(event.target.name, true);
        }
        // else if (event.target.name === "btn_mtt") {//mtt

        //     //点击我的
        //     if (this._curTag == 5) {
        //         return;
        //     }
        //     // if(clubMtt){
        //     //     clubMtt.openMttList();
        //     // }
        //     this.loadPrefab(5, true);
        //     this.setBtnStatus(event.target.name, true);
        // }


    },

    setBtnStatus(nodeName, isClick) {
        for (let i = 0; i < this.menuList.length; i++) {
            let btnNode = this.menuList[i];
            let btnNor = btnNode.getChildByName("nor");
            let btnSel = btnNode.getChildByName("sel");
            // if (i == 3) {
            //     let labelN = btnNor.getComponentInChildren(cc.Label);
            //     let labelS = btnSel.getComponentInChildren(cc.Label);
            //     labelN.lang = "CLUB_HALL.TITLE_MY";
            //     labelS.lang = "CLUB_HALL.TITLE_MY";
            // }
            if (btnNode.name == nodeName) {
                btnSel.active = true;
                btnNor.active = false;
                if (isClick) {
                    // let animation = btnSel.getComponent(cc.Animation);
                    // if (animation){
                    //     animation.play();
                    // }
                }
            } else {
                btnSel.active = false;
                btnNor.active = true;
            }
        }
    },

    //inde: 1--社区 2--俱乐部 3--牌局 4--活动 5--我的
    loadPrefab(index, isClick, isNotDeletPopup) {
        //删除其他界面
        if (!isNotDeletPopup) {
            for (let i = 0; i < this.popup.children.length; i++) {
                this.popup.children[i].destroy();
            }

        }
        if (this._curTag != index) {
            for (let i = 0; i < this.content.children.length; i++) {
                this.content.children[i].active = false;
            }
        }
        this._curTag = index;
        let child = this.content.getChildByName("1000" + index.toString());
        if (child) {
            child.active = true;
            let component = child.getComponent(componentList[index - 1]);
            if (component && index == 3) {
                component._clubPageVisible = true;
                component._initEntryLock = 0;
            }
            if (component && isClick) {
                component.init();
            }
            return;
        }
        // this.content.destroyAllChildren();
        let prefab = this.prefabList[index - 1];
        if (prefab) {
            let node = cc.instantiate(prefab);

            this.content.addChild(node, 0, "1000" + index.toString());
            let component = node.getComponent(componentList[index - 1]);
            if (component && index == 3) {
                component._clubPageVisible = true;
                component._initEntryLock = 0;
            }
            if (component && isClick) {
                component.init();
            }

        }
    },

    getComponentByName(name) {
        let children = this.content.children;
        let component = null;
        for (let i = 0; i < children.length; i++) {
            if (children[i].getComponent(name)) {
                component = children[i].getComponent(name);
                break;
            }

        }
        return component;
    },

    changeClub(clubId) {
        HallClubCacheData.setCurLoginClub(clubId);
        let params =
        {
            nUserId: UserInfo.getInfo().nUserID,
            nNewClubId: clubId,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSwitchReq_CMD, params);
    },

    showDialog(data) {
        HallClubControl.showDialog(data);
    },

    inputPassword(data) {
        let addChilds = function (child) {
            this.node.addChild(child);
            let component = child.getComponent("HallClubInputPassword");
            if (component) {
                component.init(data);
            }
        }.bind(this);

        if (this._inputPasswordPrefab) {
            let node = cc.instantiate(this._inputPasswordPrefab);
            addChilds(node);
            return;
        }

        let wrapper = app.ClubViews;
        let path = "HallClubInputPassword";
        path = wrapper.path(path, null, "main-hall/resources/prefab/");
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (!error && cc.isValid(this)) {
                this._inputPasswordPrefab = prefab;
                let node = cc.instantiate(prefab);
                addChilds(node);
            } else {
            }

        }.bind(this))
    },

    updateNoticeRedPoint(bShow) {
        // let redPointNode = this.menuList[3].getChildByName("redPoint");
        // if (redPointNode){
        //     redPointNode.active = bShow;
        // }
    },

    updateClubRedPoint() {
        // let count = HallClubLogic.getUnTreatedApplyCount();
        // let redPointNode = this.menuList[1].getChildByName("redPoint");
        // if (redPointNode){
        //     redPointNode.active = count > 0;
        // }
    },

    //名字太长了，要滚动显示
    _runLabelAction(node) {
        node.stopAllActions();
        let width = node.parent.width;
        let labelWidth = node.width;
        node.x = width / 2;
        let _space = labelWidth - width;

        if (_space > 0) {
            let action1 = cc.moveTo(1, node.x - _space / 2, node.y);
            let delay = cc.delayTime(1);
            let action2 = cc.moveTo(1, width / 2 + _space / 2, node.y);
            node.runAction(cc.repeatForever(cc.sequence(action1, delay, action2, delay)));
        }
    },
    //登出
    _logOut() {
        //断开游戏连接
        if (app.net.isConnect()) {
            app.net.disConnect(true);
            app.net.release();
        }
        LocalStorage.setAutoLoginState(false);
        MsgManager.fire("logout");
        //退出登录，返回到登录界面
        app.res.loadLogin(function onComplete(params) {
        })
    },

    //谷歌激励视频观看回调
    _googleVideoCallBack(data) {
        if (data == "success") {
            // this.getAdvertiseMentGold();
        }

        //加载激励广告
        // GoogleAdController.loadRewardAd();
    },

    //谷歌激励广告下载失败
    _googleVideoFailedCallBack() {
        this.getAdvertiseMentGold();
    },

    //显示谷歌激励广告弹框
    showGoogleAd() {
        if (this.content.getChildByName("gooleAd")) {
            return;
        }

        if (this.nAdertisementGoldLeftCnt && this.nAdertisementGoldLeftCnt > 0) {
            let clubData = HallClubCacheData.getCurClubData();
            let gold = clubData ? clubData.tMyself.nGold : 0;
            if (gold < 20 && cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                let node = cc.instantiate(this.adPrefab);
                this.content.addChild(node, 0, "gooleAd");
            }
        }

    },

    //获取激励广告奖励
    getAdvertiseMentGold() {
        let params = {
            nType: 1,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSAdvertiseMentGoldRep_CMD, params);
    },

    //激励广告奖励返回
    _onAdvertiseMentGold(data) {
        if (data.nRlt == 0) {
            this.nAdertisementGoldLeftCnt = data.nTodayMaxGetCnt - data.nTodayCnt;
        } else {
            this.nAdertisementGoldLeftCnt = 0;
        }

    },

    openMoreInfo(data) {
        if (!app.config.IS_REGISTER) {
            return;
        }

        app.config.IS_REGISTER = false;

        let node = cc.instantiate(this.moreInfoPrefab);
        this.node.addChild(node, 0, "LoginRegMoreInfo");
        let com = node.getComponent("LoginRegMoreInfo");
        if (com) {
            com.init(this, data);
        }
    },


    //玩家封禁消息
    _onUserKickOut() {
        let path = "popup/dialog/UIDialog";
        let text = "你的账号已被封禁，无法登录\n请联系KKpoker客服处理"
        app.ui.loadPopup(path, function (component) {
            UIFrame.clearAllBlock();
            this.node.addChild(component.node, 1024);
            component.setBtnText(UIDialog.EShowType.OKCANCEL, '联系客服');
            component.show(text, function (isOK) {
                if (isOK) {
                    Utils.openTelegramLink(HallClubCacheData.getClubTGServerConfig());
                    // cc.sys.openURL(HallClubCacheData.getClubTGServerConfig())
                }
                this._onLoginScene()
            }.bind(this));
        }.bind(this));
    },

    //俱乐部改名次数通知
    _onClubSNameCountNotify(userInfo) {

        cc.log("_onClubSNameCountNotify userInfodata =", userInfo);

        if (userInfo.isRecharge) {
            let wrapper = app.ClubViews;
            let path = "HallMyChangeData";
            path = wrapper.path(path, null, "main-hall/resources/prefab/");
            wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
                if (!error && cc.isValid(this)) {
                    let node = cc.instantiate(prefab);
                    this.node.addChild(node);

                    let component = node.getComponent("HallMyChangeData");
                    if (component && userInfo) {
                        component.initUI(userInfo)
                    }
                } else {
                }

            }.bind(this))
        }
    },

    //返回登录页
    _onLoginScene() {
        app.net.setEnabled(false)
        app.net.disConnect(true);
        app.res.loadLogin(function onComplete(error, wrapper) {
            if (error) {
                cc.error("SceneLaunch", error, wrapper);
                return;
            }
        }, null);
    },


    //推荐关系
    sendRecommend() {
        if (!cc.sys.isNative) {
            let recommendId = app.url.get("userid");
            if (!recommendId || recommendId == UserInfo.getInfo().nUserID) {
                return;
            }

            let params = {
                nUserId: UserInfo.getInfo().nUserID,
                nRecommendId: recommendId,
                nRegisterWay: UserInfo.getInfo().loginType,
            }
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubRecommendUserReq_CMD, params);
            return;
        }

        let url = this._appStartUrl;
        if (url && url != "") {
            let value = HallClubLogic.getQueryString("id", url)
            QYLogs.warn("recommendUserId = ", value);
            if (value) {
                let params = {
                    nUserId: UserInfo.getInfo().nUserID,
                    nRecommendId: value,
                    nRegisterWay: UserInfo.getInfo().loginType,
                }
                app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubRecommendUserReq_CMD, params);
            }
        }



    },


    //显示被邀请好友弹窗
    _onShowTopFriend(data) {
        if (data && this._curTag != 4) {
            UIFrame.showTopNotification(TopNotificationManager.NotificationTypeEnum.INVITE_FRIEND, data, { duration: 10 });
        }
    },

    //显示系统消息弹窗
    _onShowSysTopInfoTips(data) {
        if (data && this._curTag != 4) {
            UIFrame.showSysTopInfoTips(data)
        }
    },

    _onActivityInfo(data) {
        this.getUserRedDot();
        if (data.nActiSwitch) {
            this._activityConfig = JSON.parse(data.nActiSwitch);
            //牌局界面
            // let com = this.getComponentByName(componentList[2]);
            // if (com) {
            //     com.initAdPageView(this._activityConfig);
            // }
        }
    },

    //打开活动界面
    _onOpenActivityUI(index) {
        this.loadPrefab(4, true, true);
        this.setBtnStatus("btn_my");
        this._curTag = 4;
        let component = this.getComponentByName(componentList[3]);
        if (component) {
            component.init(index);
        }

    },
});
