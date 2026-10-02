// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let Msg_login = require('Msg_login');
let LocalStorage = require("LocalStorage");
let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let HallClubLogic = require("HallClubLogic");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let UIDialog = require("UIDialog");

let HALL_MSG = require("Msg_hall");

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
        label_name: cc.Label,
        content: cc.Node,
        label_ID: cc.Label,
        // label_sign: cc.Label,
        label_redPoint_num: cc.Label,
        // vip: cc.Node,
        // noVip: cc.Node,
        // nRecharge: cc.Node,
        // nPanel: cc.Node,
        //label_gold: cc.Label,
        // label_diamond: cc.Label,
        // cashLabel: cc.Label,
        // noCashLabel: cc.Label,
        prefabSetting: cc.Prefab,

        webView: cc.Prefab,

        // prefabChange: cc.Prefab,
        prefabNotice: cc.Prefab,
        // prefabShop: cc.Prefab,
        // prefabPay: cc.Prefab,
        // prefabSecurityPsw: cc.Prefab,
        noticeRedPoint: cc.Node,
        // infoPanel: cc.Node,
        // prefabExchange: cc.Prefab,
        // prefabRechargeRecord: cc.Prefab,
        // infoTitle: cc.Node,
        // cash: cc.Label,
        // noCash: cc.Label,
        // re_label: cc.Label,
        // tx_label: cc.Label,
        // helpPanel: cc.Sprite,
        // activityRedPoint: cc.Node,

        //gold_label: cc.Label,
        // diamond_label: cc.Label,

        // prefabDiamondShop: cc.Prefab,
        prefabHallHelp: cc.Prefab,
        prefabHallMyBinding: cc.Prefab,
        prefabBill: cc.Prefab,
        prefabMyInfo: cc.Prefab,
        prefabPayPassword: cc.Prefab,
        // prefabLanguage: cc.Prefab,
        // prefabAgree: cc.Prefab,
        // prefabRecharge: cc.Prefab,
        // prefabCustomerService: cc.Prefab,
        // prefabChannel: cc.Prefab,
        // label_gameCount: cc.Label,  //总牌局数
        label_totalHand: cc.Label, //总手数
        label_allWinAndLose: cc.Label, //总输赢
        label_inPoolRate: cc.Label, //入池率
        label_addBetRate: cc.Label, //加注率    
        label_allinRate: cc.Label, //Allin胜率
        label_showdownRate: cc.Label, //摊牌率
        label_handProfit: cc.Label, //手均胜率
        label_winRate: cc.Label, //胜率
        //胜率百分比圆圈图展示
        progress_winRate: cc.Sprite,
        label_mailText: cc.Label, //显示已绑定邮箱
        bindMailRedPoint: cc.Node, //绑定邮箱红点
        bindPayPswRedPoint: cc.Node, //设置支付密码红点

        _poolPopup: [],
        _prefabs: [],
        _userInfo: null,
        _redPointData: [],
        _clubShop: null,
        _mySetting: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._poolPopup = []
        this.regiester();

        app.util.addClickSoundToNode(this.node);
    },

    start() {
        // if (app.config.LANG == "en"){
        //     let label_title = this.node.getChildByName("content").getChildByName("top").getChildByName("label_title").getComponent(cc.Label);
        //     label_title.string = label_title.string.toUpperCase();
        // }
    },

    init(activityIndex) {
        //this.infoPanel.active = false;
        this.destroyPopup()
        //this.initRe();
        // this._setAuditSwitch();
        this.regiester();
        this.getMyInfo();
        this.getUserRedDot();
        this.selectGameRecordToggle({ target: { name: "title_texas" } });
        this.reqNoticeData();

        if (activityIndex) {
            this.node.active = false;
            this.onClickActivity();
        }
    },


    setNodeColor(node, color16) {
        let curColor = cc.Color.BLACK.fromHEX(color16);
        let color = new cc.Color(curColor.r, curColor.g, curColor.b);
        node.color = color;
    },

    selectGameRecordToggle(event) {
        let btnName = event.target.name;
        let dataNode = this.content.getChildByName("datanode")
        let gameId = 125
        if (btnName == "title_texas") {
            gameId = 125
            dataNode.getChildByName("title_texas").getChildByName("line").active = true
            dataNode.getChildByName("title_shortTexas").getChildByName("line").active = false
            this.setNodeColor(dataNode.getChildByName("title_texas").getChildByName("name"), "#00FF86")
            this.setNodeColor(dataNode.getChildByName("title_shortTexas").getChildByName("name"), "#E8DFD1")
        } else if (btnName == "title_shortTexas") {
            gameId = 175
            dataNode.getChildByName("title_texas").getChildByName("line").active = false
            dataNode.getChildByName("title_shortTexas").getChildByName("line").active = true
            this.setNodeColor(dataNode.getChildByName("title_shortTexas").getChildByName("name"), "#00FF86")
            this.setNodeColor(dataNode.getChildByName("title_texas").getChildByName("name"), "#E8DFD1")
        }


        this.getTexasGameRecord(gameId);
    },


    onDisable() {
        let node = this.node.getChildByName("popup");
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if (child) {
                child.destroy();
            }

        }
        this.destroyPopup()
    },

    onDestroy() {
        this.unRegiester();
    },

    unRegiester() {
        MsgManager.un(this._onUserInfo);
        MsgManager.un(this._onUserRedDot);
        MsgManager.un(this._onSetSecurityPsw);
        MsgManager.un(this.onOpenClubPay);
        MsgManager.un(this.onUserMsgNotify);
        MsgManager.un(this.onCorrCapital);
        // MsgManager.un(this._onPayInfo);
        // MsgManager.un(this._onCashInfo);
        MsgManager.un(this._onClubsFileConfig);
        MsgManager.un(this._onGetValueByKey);
        MsgManager.un(this._tableRecord);
        MsgManager.un(this._showNoticeRedBot);

        target.targetOff(this);
    },

    regiester() {
        this.unRegiester();

        MsgManager.on(HALL_MSG.ClubSUserNoticeResp_CMD, this._showNoticeRedBot, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoResp_ui, this._onUserInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserRedDotResp_ui, this._onUserRedDot, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserMsgNotify_ui, this.onUserMsgNotify, this);
        MsgManager.on(MSG.NOTIFY.OPEN_CLUB_SHOP_PAY, this.onOpenClubPay, this);
        MsgManager.on(MSG.NOTIFY.SET_SECURITY_PSW, this._onSetSecurityPsw, this);
        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this.onCorrCapital, this); //网关金币更新
        // MsgManager.on(MSG.NOTIFY.ClubSPayInfoRep_ui, this._onPayInfo, this); //充值信息返回
        // MsgManager.on(MSG.NOTIFY.ClubSCashInfoRep_ui, this._onCashInfo, this); //用户提现信息返回
        MsgManager.on(MSG.NOTIFY.ClubsFileConfigRsp_ui, this._onClubsFileConfig, this);
        MsgManager.on(MSG.NOTIFY.ClubGetValueByKeyRsp_ui, this._onGetValueByKey, this);
        // MsgManager.on(MSG.NOTIFY.ClubSGetPersonTableRecordRsp_ui, this._tableRecord, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetPersonTableStaticRsp_ui, this._tableRecord, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, this._onUserInfo, this);
        target.on(event.SHOW, this.getMyInfo, this);
    },

    getUserRedDot() {
        let params = {
            nNouse: 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserRedDotReq_CMD, params);
    },

    getMyInfo() {
        cc.log("--------------玩家个人信息请求----------------");
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    getSwitch() {
        cc.log("--------------开关请求----------------");
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            sKey: "10001",
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubGetValueByKeyReq_CMD, params);
    },

    getRe(nType) {
        let params = { nType: nType };
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPayInfoReq_CMD, params);
    },

    getTransferWay() {
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubTransferWayReq_CMD, { nUserId: UserInfo.getInfo().nUserID });
    },

    //获取德州游戏记录
    getTexasGameRecord(gameId) {
        let data = {
            nGameId: gameId,
            nGoldType: 1,
            nClubId: -1,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetPersonTableStaticReq_CMD, data);
    },

    _parseTgUserFromInit(initDataUnsafe) {
        if (!initDataUnsafe) return null;
        if (typeof initDataUnsafe === "object") {
            if (initDataUnsafe.user && typeof initDataUnsafe.user === "object") return initDataUnsafe.user;
            if (typeof initDataUnsafe.id !== "undefined" && (initDataUnsafe.username || initDataUnsafe.first_name || initDataUnsafe.photo_url)) return initDataUnsafe;
            return null;
        }
        if (typeof initDataUnsafe !== "string") return null;
        var raw = initDataUnsafe.trim();
        if (!raw) return null;
        if (raw.charAt(0) === "{" || raw.charAt(0) === "[") {
            try {
                var p1 = JSON.parse(raw);
                if (p1) {
                    if (p1.user && typeof p1.user === "object") return p1.user;
                    if (typeof p1.id !== "undefined") return p1;
                }
            } catch (e) {}
        }
        var win = window;
        var userStr = null;
        try {
            if (win.URLSearchParams) {
                var usp = new win.URLSearchParams(raw);
                userStr = usp.get("user");
            }
        } catch (eQS) { userStr = null; }
        if (!userStr) {
            try {
                var m = raw.match(/[?&]?user=([^&]+)/);
                if (m && m[1]) userStr = decodeURIComponent(m[1]);
            } catch (e) { userStr = null; }
        }
        if (!userStr) return null;
        try {
            if (userStr.indexOf("%") >= 0) userStr = decodeURIComponent(userStr);
        } catch (eDec) {}
        try {
            var p2 = JSON.parse(userStr);
            if (p2 && typeof p2 === "object") return p2;
        } catch (e) {}
        return null;
    },

    _normalizeTgPhotoUrl(rawUrl) {
        if (!rawUrl || typeof rawUrl !== "string") return "";
        var url = String(rawUrl).trim();
        if (!url) return "";
        try {
            if (/%[0-9A-Fa-f]{2}/.test(url)) url = decodeURIComponent(url);
        } catch (e) {}
        url = url.replace(/\\\//g, "/").replace(/\\/g, "");
        return url.trim();
    },

    _getFinalFaceId(serverFaceId) {
        var faceId = serverFaceId || "";
        // 优先使用 UserInfo 中缓存的头像（登录成功时用 Telegram photo_url 兜底写入的 strHeadUrl）
        var cachedHead = UserInfo.getInfo().strHeadUrl;
        if (cachedHead && typeof cachedHead === "string" && cachedHead.toLowerCase().startsWith("http")) {
            faceId = cachedHead;
        }
        // 再次兜底：如果服务端没有传 http 头像，且是 Telegram 环境，直接读取本地 initDataUnsafe/initData 中的 user.photo_url
        if ((!faceId || typeof faceId !== "string" || !faceId.toLowerCase().startsWith("http")) &&
            cc.sys.isBrowser && window.Telegram && window.Telegram.WebApp) {
            var tgUser = null;
            try {
                if (window.Telegram.WebApp.initDataUnsafe) tgUser = this._parseTgUserFromInit(window.Telegram.WebApp.initDataUnsafe);
                if (!tgUser && window.Telegram.WebApp.initData) tgUser = this._parseTgUserFromInit(window.Telegram.WebApp.initData);
            } catch (e) { tgUser = null; }
            if (tgUser) {
                var photoUrl = this._normalizeTgPhotoUrl(tgUser.photo_url);
                if (photoUrl && photoUrl.toLowerCase().startsWith("http")) {
                    faceId = photoUrl;
                    UserInfo.setInfo({ strHeadUrl: faceId });
                    console.log("HallMyInfoNew", "[TG 头像兜底] 最终使用本地 Telegram 头像:", faceId);
                }
            }
        }
        // 对最终的 http URL 再做一次统一清洗（去除 \/ 反斜杠等）
        if (faceId && typeof faceId === "string" && faceId.toLowerCase().startsWith("http")) {
            faceId = this._normalizeTgPhotoUrl(faceId);
        }
        if (!faceId) faceId = "1";
        return faceId;
    },

    initUI(data) {

        cc.log('HallMyInfo initUI ', JSON.stringify(data))
        this.label_name.string = Base64.decode(data.sName);//玩家昵称
        this.label_ID.string = "ID:" + data.nUserId;
        // if (!data.nVip) {
        //     this.noVip.active = true;
        //     this.vip.active = false;
        // } else {
        //     this.noVip.active = false;
        //     this.vip.active = true;
        //     let vipLv = this.vip.getChildByName("vipLv");
        //     if (vipLv) {
        //         vipLv.string = data.nVip;
        //     }
        // }

        //this.gold_label.string = '$' + Utils.convertNumberToStr(data.nGold);
        var finalFaceId = this._getFinalFaceId(data.sFaceId);
        Utils.changeUserHead(this.head, finalFaceId, app.ClubAssets);
        if (data.sMail) {
            if (data.sMail.indexOf('@') != -1) {
                let strArr = data.sMail.split('@')
                this.label_mailText.string = Utils.getTextMask(strArr[0]) + '@' + strArr[1]
            } else {
                this.label_mailText.string = data.sMail
            }
        }
        this.setRedPointShow();
        // if (data.sPersonality != "") {
        //     this.label_sign.string = Utils.getShortText(Base64.decode(data.sPersonality), 200);
        // } else {
        //     this.label_sign.lang = "CLUB_HALL.SIGNATURE_tip";
        // }

        //this.diamond_label.string = Utils.convertNumberToStr(data.nGold);

        //this._onCashInfo(data)
    },

    //点击复制玩家ID
    onClickCopyID() {
        cc.log("点击复制玩家ID");
        // 复制玩家ID到剪贴板
        let userId = UserInfo.getInfo().nUserID;
        Utils.copyToClipBoard(userId.toString());
    },

    initRe() {
        this._config = HallClubLogic.getReConfig(LocalStorage.getSysLanguage());
        if (this._config) {
            if (this.cash) {
                this.cash.string = this._config.cashGold || "";
            }

            if (this.noCash) {
                this.noCash.string = this._config.noCashGold || "";
            }

            if (this.re_label) {
                this.re_label.string = this._config.recharge || "";
            }

            if (this.tx_label) {
                this.tx_label.string = this._config.withdrawal || "";
            }

            this._loadImg(this._config.url);
        } else {
            // this.nRecharge.active = false;
            // let widget = this.nPanel.getComponent(cc.Widget);
            // widget.top = 537;
            // widget.bottom = 143;

            // widget.updateAlignment();
        }
    },

    //设置审核开关
    _setAuditSwitch() {
        // let isOpen = cc.sys.isNative && app.config.IS_APPSTORE_APP;
        // let isBind = HallClubLogic.isBlindPlayer();

        // if (isOpen && !isBind){
        //     // this.nRecharge.active = false;
        //     let widget = this.nPanel.getComponent(cc.Widget);
        //     widget.top = 537;
        //     widget.bottom = 143;
        //     widget.updateAlignment();
        // }else{
        //     // this.nRecharge.active = true;
        //     let widget = this.nPanel.getComponent(cc.Widget);
        //     widget.top = 779;
        //     widget.bottom = 143;
        //     widget.updateAlignment();
        //     this.getTransferWay();
        //     return;
        // }

        // if (isOpen){
        //     let exchange = this.nPanel.getChildByName("exchange");
        //     exchange.active = false;
        // }
    },

    onClickChangeData() {
        //修改资料
        let node = cc.instantiate(this.prefabChange);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallMyChangeData");
        if (component && this._userInfo) {
            component.init(this._userInfo, function (data) {
                this.initUI(data, this.initUI.bind(this));
            }.bind(this))
        }
    },

    onClickSetting() {
        //设置
        let node = cc.instantiate(this.prefabSetting);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallMySetting");
        if (component && this._userInfo) {
            this._mySetting = component;
            component.initUI(this, this._userInfo);
        }
    },

    reqNoticeData() {
        let params = {
            nIdOfStart: 0,
            nCnt: 20,
            nType: 1
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserNoticeReq_CMD, params);
    },

    _showNoticeRedBot(data) {
        this.noticeRedPoint.active = data.nUnReadCnt > 0
    },

    onClickNotice() {
        // UIFrame.showTips("暂无消息通知");
        // return
        //通知
        let node = cc.instantiate(this.prefabNotice);
        this.getAddNode().addChild(node, 1024, "HallMyNotice");

        let component = node.getComponent("HallMyNotice");
        if (component) {
            component.init(this._redPointData, this);
        }
        this.noticeRedPoint.active = false
    },

    //点击代理按钮
    onClickAgent() {
        //弹窗提示敬请期待
        UIFrame.showTips(i18n.t("HALL.STAY_TUNED"));
    },

    onClickGameShop() {
        //商城
        let node = cc.instantiate(this.prefabShop);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallClubShop");
        if (component && this._userInfo) {
            this._clubShop = component;
            component.init(this._userInfo['nGold']);
        }
    },

    onClickRecord() {
        //记录
    },

    onClickExchange() {
        //兑换码
        let node = cc.instantiate(this.prefabExchange);
        this.getAddNode().addChild(node, 1024);
    },

    onClickService() {
        //客服
        // UIFrame.showTips("敬请期待");
        // let userInfo = UserInfo.getInfo();
        // HallClubLogic.openCustomerService(userInfo.strNickName, userInfo.nUserID);


        let prefab = this.prefabHallHelp
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }

    },


    //邮箱绑定
    onClickMailBinding(isToPassworld) {
        if (UserInfo.getInfo().sMail) {
            UIFrame.showTips(i18n.t("HALL.BOUND_EMAIL"));
            return
        }
        let prefab = this.prefabHallMyBinding
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            let component = node.getComponent("HallMyBinding");
            if (component) {
                component.init(this, 2, isToPassworld);
            }
        }

    },


    // 支付密码
    onClickPayPassworld() {
        if (!UserInfo.getInfo().sMail) {
            UIFrame.showTips(i18n.t("HALL.BIND_EMAIL"));
            this.scheduleOnce(() => {
                this.onClickMailBinding(true)
            }, 1)
            return
        }
        if (this.prefabPayPassword) {
            let node = cc.instantiate(this.prefabPayPassword)
            this.getAddNode().addChild(node, 1);
            let component = node.getComponent("HallMyPayPassworld");
            if (component) {
                component.setData(this.onClickPayPasswordCallback.bind(this));
            }
        }
    },

    //支付密码回调
    onClickPayPasswordCallback() {
        this.setRedPointShow();
    },

    //绑定邮箱提示窗
    onClickShowBindMailTip() {
        let path = "popup/dialog/UIDialog";
        let text = i18n.t("HALL.UNBOUND_EMAIL");
        app.ui.loadPopup(path, function (component) {
            UIFrame.clearAllBlock();
            this.node.addChild(component.node, 1024);
            component.setBtnText(UIDialog.EShowType.OKCANCEL, i18n.t("HALL.GO_BIND"));
            component.show(text, function (isOK) {
                if (isOK) this.onClickMailBinding();
            }.bind(this));
        }.bind(this));
    },

    //设置支付密码提示窗
    onClickShowSetPayPswTip() {
        let path = "popup/dialog/UIDialog";
        if (!UserInfo.getInfo().sMail) {
            let text = i18n.t("HALL.UNBOUND_EMAIL_AND_PAY_PASSWORD");
            app.ui.loadPopup(path, function (component) {
                UIFrame.clearAllBlock();
                this.node.addChild(component.node, 1024);
                component.setBtnText(UIDialog.EShowType.OKCANCEL, i18n.t("HALL.GO_BIND"));
                component.show(text, function (isOK) {
                    if (isOK) this.onClickMailBinding(true);
                }.bind(this));
            }.bind(this));
        } else {
            let text = i18n.t("HALL.UNBOUND_PAY_PASSWORD");
            app.ui.loadPopup(path, function (component) {
                UIFrame.clearAllBlock();
                this.node.addChild(component.node, 1024);
                component.setBtnText(UIDialog.EShowType.OKCANCEL, i18n.t("HALL.GO_SET"));
                component.show(text, function (isOK) {
                    if (isOK) this.onClickPayPassworld();
                }.bind(this));
            }.bind(this));
        }

    },

    //设置红点显示
    setRedPointShow() {
        let info = UserInfo.getInfo();
        if (info.sMail) {
            this.bindMailRedPoint.active = false;
        } else {
            this.bindMailRedPoint.active = true;
        }
        if (info.nOpenProtection != 1) {
            this.bindPayPswRedPoint.active = true;
        } else {
            this.bindPayPswRedPoint.active = false;
        }
    },

    // 桌面设置
    onClickDeskSetting() {
        // const tg = window.Telegram?.WebApp;
        // try {
        //     if(tg && tg.addToHomeScreen){
        //         tg.addToHomeScreen();
        //         setTimeout(async () => {
        //             const status = await tg.checkHomeScreenStatus?.();
        //             if (status === 'added') {
        //                 UIFrame.showTips("已添加到桌面")
        //             } else {
        //                 UIFrame.showTips("添加到桌面失败，请检查telegram版本和相关权限")
        //             }
        //         }, 1500);
        //     }else{
        // 	    UIFrame.showTips("当前telegram版本,无法添加到桌面,请使用最新版本")
        //     }
        // } catch (error) {
        // 	UIFrame.showTips("当前telegram版本,无法添加到桌面,请使用最新版本")
        // }

        this._showSettingPanel();
    },

    _showSettingPanel() {
        let data = {
            callBack: function (obj) {
                if (obj.bg) {
                    MsgManager.fire(MSG.NOTIFY.NOTIFY_GAME_BG, obj);
                }

                if (obj.poker) {
                    MsgManager.fire(MSG.NOTIFY.NOTIFY_POKERS);
                }
            }
        }

        MsgManager.fire(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, { nRlt: 0 });

        let path = "prefab/HallGameSetting";
        app.ClubViews.ui.loadPopup(path, function (component) {
            this.getAddNode().addChild(component.node, 1024);
            component.init(data);
            component.node.name = "TexasSettingPanel";
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
            , {
                path_resources: "main-hall/resources/"
            });
    },



    onClickActivity() {
        //活动
        this.loadActivityUI("HallActivityMain");
    },

    onClickRechargeHistory() {
        let node = cc.instantiate(this.prefabRechargeRecord);
        this.getAddNode().addChild(node, 1024);
    },

    onClickIcon() {
        this.infoPanel.active = true;
        let language = LocalStorage.getSysLanguage();
        if (language != "zh" && language != "zh_tw" && language != "en") {
            if (this.infoTitle) {
                this.infoTitle.active = false;
            }
        }
    },

    onClickBtnClose() {
        this.infoPanel.active = false;
    },


    OnClickDiamond() {
        let prefab = this.prefabDiamondShop
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickBill() {
        let prefab = this.prefabBill
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            node.getComponent("HallMyBill").init(null, 0);
        }

    },

    OnClickLanguage() {
        let prefab = this.prefabLanguage
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickLanguage() {
        let prefab = this.prefabLanguage
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickAgree() {
        let prefab = this.prefabAgree
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickCustomerService() {
        // let prefab = this.prefabCustomerService
        // if (prefab) {
        //     let node = cc.instantiate(prefab);p
        //     this.getAddNode().addChild(node, 1024);
        // }
        // UIFrame.showTips("敬请期待");

        // cc.sys.openURL(HallClubCacheData.getClubTGServerConfig())
        Utils.openTelegramLink(HallClubCacheData.getClubTGServerConfig());

        return

        let _url = "https://t.me/tttestkkpoker_bot"
        let cloneWebView = cc.instantiate(this.webView);
        cloneWebView.parent = this.node;
        cloneWebView.name = "webViewNode"
        let webViewComponent = cloneWebView.getComponent("miniWebView");
        if (webViewComponent) {
            webViewComponent.openWebView(_url)
        }

    },



    onClickInvite() {
        const tg = window.Telegram?.WebApp;

        let botName = "localhost_hxdzpk_bot";
        let appName = "star";

        if (app.config.DEVELOPVERSION == 2) {
            botName = "localhost_hxdzpk_bot";
            appName = "star";
        }

        const inviteUserId = UserInfo.getInfo().nUserID;

        const miniAppUrl =
            `https://t.me/${botName}/${appName}?startapp=invite_${inviteUserId}`;

        if (!tg) {
            Utils.copyToClipBoard(miniAppUrl);
            return;
        }

        const encodedUrl = encodeURIComponent(miniAppUrl);
        const encodedText = encodeURIComponent("邀请您加入 HASH Poker");

        const telegramShareUrl =
            `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

        if (tg.openTelegramLink) {
            tg.openTelegramLink(telegramShareUrl);
        } else if (tg.shareUrl) {
            tg.shareUrl(miniAppUrl);
        } else {
            Utils.copyToClipBoard(miniAppUrl);
        }
    },



    OnClickChannel() {
        let prefab = this.prefabChannel
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickRecharge() {
        let prefab = this.prefabRecharge
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    getAddNode() {
        let scene = cc.director.getScene();
        return scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup")
    },

    //修改手机号码
    changePhone(phone) {
        this._userInfo.sPhone = phone;
    },

    //修改邮箱
    changeMailbox(mailbox, isToPassworld) {
        this._userInfo.sMail = mailbox;
        if (mailbox.indexOf('@') != -1) {
            let strArr = mailbox.split('@')
            this.label_mailText.string = Utils.getTextMask(strArr[0]) + '@' + strArr[1]
        } else {
            this.label_mailText.string = mailbox
        }
        this.setRedPointShow();
        if (isToPassworld) {
            this.onClickPayPassworld()
        }
    },

    _onUserInfo(data) {
        //  {"nRlt":0,"sErrStr":"sucess","tUserInfo":{"nUserId":37000015,"sFaceId":"1","sName":"cXFx","nSex":0,"nGold":199980,"sTime":"2025-05-15 15:28:08",
        //     "sPhone":"","nAllCount":0,"nMaxProfit":0,"sPersonality":"","nHandCount":0,"nMaxHandProfit":0,"nVip":0,"nExp":0,
        //     "nGloryLevel":0,"nLevelStart":0,"nOpenProtection":0,"nWithDrawGold":0,"nNotWithDrawGold":199980,"nReviewedGold":0,"nExchangeRate":1,"nTransSwitch":0,"sMail":""}}
        if (data.nRlt == 0) {
            this._userInfo = data.tUserInfo;
            // 顺便同步 Telegram 头像/昵称到 UserInfo 缓存（如果有的话），供后续全局使用
            var extraInfo = {
                sMail: data.tUserInfo.sMail,
                nOpenProtection: data.tUserInfo.nOpenProtection,
                nFreeCount: data.tUserInfo.nFreeCount,
                nPrice: data.tUserInfo.nPrice,
            };
            var tgFace = this._getFinalFaceId(data.tUserInfo.sFaceId);
            if (tgFace && typeof tgFace === "string" && tgFace.toLowerCase().startsWith("http")) {
                extraInfo.strHeadUrl = tgFace;
            }
            UserInfo.setInfo(extraInfo);
            this.initUI(this._userInfo);
        } else {
            var finalFace = this._getFinalFaceId(data.sFaceId);
            if (data.sFaceId || finalFace) {
                Utils.changeUserHead(this.head, finalFace, app.ClubAssets);
            }
            if (data.sName) {
                this.label_name.string = Base64.decode(data.sName);
            }


        }
    },

    _onUserRedDot(data) {
        let bShowNoticeRedPoint = false;
        let bShowActivityRedPoint = false;
        let redPointNum = 0;
        this.resetRedPoint();

        for (let i = 0; i < data.arrRedot.length; i++) {
            if ((data.arrRedot[i].nType == 3 || data.arrRedot[i].nType == 2) && data.arrRedot[i].nCount > 0) {
                bShowNoticeRedPoint = true;
                redPointNum += data.arrRedot[i].nCount;
            }

            if (data.arrRedot[i].nType == 4 && data.arrRedot[i].nCount > 0) {
                bShowActivityRedPoint = true;
            }
        }

        if (bShowNoticeRedPoint) {
            this.updateRedPoint(1, bShowNoticeRedPoint, redPointNum);
            this._redPointData = data.arrRedot;

            let node = this.getAddNode().getChildByName("HallMyNotice");
            if (node) {
                let component = node.getComponent("HallMyNotice");
                if (component) {
                    component.init(data.arrRedot, this);
                }
            }
        }

        if (bShowActivityRedPoint) {
            this.updateRedPoint(2, bShowActivityRedPoint);
        }
    },

    //redType: 1：通知红点， 2：活动红点
    updateRedPoint(redType, bRedPoint, redPointNum) {
        if (redType == 1) {
            this.noticeRedPoint.active = bRedPoint;
            this.label_redPoint_num.string = '' + redPointNum;
            if (!bRedPoint) {
                this._redPointData = [];
            }
        } else {
            //this.activityRedPoint.active = bRedPoint;
        }

        let bShowRedPoint = false;
        if (this.noticeRedPoint.active) {
            bShowRedPoint = true;
        }
        MsgManager.fire(MSG.NOTIFY.UPDATE_NOTICE_REDPOINT, bShowRedPoint);
    },

    resetRedPoint() {
        this.noticeRedPoint.active = false;
        //this.activityRedPoint.active = false;
    },

    onUserMsgNotify(data) {
        if (data.arrRedot) {
            this.getUserRedDot();
        }
    },

    onOpenClubPay(data) {
        let node = cc.instantiate(this.prefabPay);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallClubShopPay");
        if (component) {
            component.initPay(data.nGoodId, this.label_name.string, data.title, data.money);
        }
    },

    _onSetSecurityPsw(data) {
        if (data) {
            const type = data.type;
            if (type == 'setSecurityPsw' || type == 'resetSecurityPsw' || type == 'secondSecurityPswConfirm') {
                let node = this.addSecurityPswPanel();
                let component = node.getComponent("HallEditSecurityPsw");
                if (component) {
                    component.initUI(type, null, data.cancelCallBack, data.sKey);
                }
            } else if (type == 'serverBack') {
                if (data.nRlt == 0) {
                    const isOpen = data['isOpen'];
                    this._userInfo && (this._userInfo['nOpenProtection'] = isOpen);
                    if (this._mySetting && this._mySetting.isValid) {
                        this._mySetting.initUI(this, this._userInfo);
                    }
                }
            }
        }
    },

    addSecurityPswPanel() {
        let node = cc.instantiate(this.prefabSecurityPsw);
        this.getAddNode().addChild(node, 1024);
        return node;
    },

    //网关通知金币变化
    onCorrCapital(data) {
        // this.gold_label.string = Utils.convertNumberToStr(data.nGold);
        if (this._userInfo) {
            this._userInfo.nGold = data.nGold;
        }
        if (this._clubShop && this._clubShop.node.isValid) {
            this._clubShop.init(data.nGold);
        }
    },

    _onPayInfo(data) {
        // data.sUrl = "https://www.hao123.com/"
        if (data.nType == 1 || data.nType == 3) {
            if (data.sUrl) {
                let url = data.sUrl;
                if (data.sUrl.indexOf("?") < 0) {
                    url = url + "?sToken=" + data.sToken;
                } else {
                    url = url + "&sToken=" + data.sToken;
                }

                let language = app.config.LANG;
                url = url + "&langCode=" + language;

                if (this._userInfo.nTransSwitch == 0) {
                    if (data.nType == 1) {
                        this.loadUI("HallRCWay", { url: url, userInfo: Utils.clone(this._userInfo) });
                    } else if (data.nType == 3) {
                        this.loadUI("HallWDWay", { url: url, userInfo: Utils.clone(this._userInfo) });
                    }
                } else {
                    cc.sys.openURL(url);
                }
            } else if (this._userInfo.nTransSwitch == 0) {
                if (data.nType == 3) {
                    this.loadUI("HallWithdraw", { nType: data.nType, userInfo: Utils.clone(this._userInfo) });
                } else {
                    // this.loadUI("HallPayType", {nType: data.nType, userInfo: Utils.clone(this._userInfo)});

                    let name = 'HallMyBill'
                    let node = cc.instantiate(this.prefabBill);
                    this.getAddNode().addChild(node, 1, name);
                    let com = node.getComponent(name);
                    if (com) {
                        com.init(data);
                    }
                }
            }
        }
    },

    _onCashInfo(data) {
        cc.log("--------------用户提现信息返回----------------");

        if (data.hasOwnProperty("nWithDrawGold")) {//可提现金币
            this.cashLabel.string = Utils.convertNumberToStr(data.nWithDrawGold);
            if (this._userInfo) {
                this._userInfo.nWithDrawGold = data.nWithDrawGold;
            }
        }

        if (data.hasOwnProperty("nNotWithDrawGold")) {//不可提现金币
            this.noCashLabel.string = Utils.convertNumberToStr(data.nNotWithDrawGold);
            if (this._userInfo) {
                this._userInfo.nNotWithDrawGold = data.nNotWithDrawGold;
            }
        }
    },

    _onClubsFileConfig(data) {
        this.initRe();
    },

    //在线充值和提现开关
    _onGetValueByKey(data) {
        if (data && data.sValue == "0") {
            this._isOpenOnlineRe = true;
            if (this._curType) {
                this.getRe(this._curType);
                this._curType = 0;
            }
        } else {
            this._isOpenOnlineRe = false;
            if (this._userInfo.nTransSwitch == 0) {
                if (this._curType == 3) {
                    this.loadUI("HallWithdraw", { nType: this._curType, userInfo: Utils.clone(this._userInfo) });
                } else {
                    this.loadUI("HallPayType", { nType: this._curType, userInfo: Utils.clone(this._userInfo) });
                }

            }
        }
    },




    // {
    //     "tStatics": {
    //         "nPaiJuCnt": 17,
    //         "nHandCnt": 21,
    //         "nWinLose": 732,
    //         "nInpoolRate": 47.6,
    //         "nBFlopRaiseRate": 9.5,
    //         "nAllInAndWinRate": 0,
    //         "nWinRate": 23.8,
    //         "nQiPaiRate": 0,
    //         "nHandProfit": 0
    //     },
    //     "nGameId": 125,
    //     "nGoldType": 1,
    //     "nClubId": 17
    // }

    // label_totalHand: cc.Label, //总手数
    //     label_allWinAndLose: cc.Label, //总输赢
    //     label_inPoolRate: cc.Label, //入池率
    //     label_addBetRate: cc.Label, //加注率    
    //     label_allinRate: cc.Label, //Allin胜率
    //     label_showdownRate: cc.Label, //摊牌率
    //     label_winRate: cc.Label, //胜率
    //     //胜率百分比圆圈图展示
    //     progress_winRate: cc.Sprite,
    //德州游戏记录返回
    _tableRecord(data) {
        cc.log("--------------德州游戏记录返回----------------", JSON.stringify(data));
        if (data.tStatics) {
            this.label_allWinAndLose.string = (Math.round(data.tStatics.nWinLose * 100) / 100) + "";//总输赢
            this.label_totalHand.string = (Math.round(data.tStatics.nHandCnt * 100) / 100) + "";//手牌数
            this.label_winRate.string = Math.round(data.tStatics.nWinRate * 100) / 100 + "%";//胜率
            this.label_addBetRate.string = Math.round(data.tStatics.nBFlopRaiseRate * 100) / 100 + "%";//加注率
            this.label_allinRate.string = Math.round(data.tStatics.nAllInAndWinRate * 100) / 100 + "%";//allin胜率
            this.label_showdownRate.string = Math.round(data.tStatics.nQiPaiRate * 100) / 100 + "%";//摊牌率
            this.label_inPoolRate.string = Math.round(data.tStatics.nInpoolRate * 100) / 100 + "%";//入池率
            this.label_handProfit.string = Math.round(data.tStatics.nHandProfit * 100) / 100;//手均盈利

            this.progress_winRate.fillRange = data.tStatics.nWinRate / 100;
        } else {
            UIFrame.showTips(i18n.t("HALL.NO_MORE_DATA"));
        }
    },

    _loadImg(url) {
        if (!url) {
            return;
        }
        cc.assetManager.loadRemote(url, function (error, texture) {
            if (error) {
                QYLogs.error("HallMyInfo", "加载资源出错: url=" + url, error);
            }
            else {
                if (cc.isValid(this.helpPanel)) {
                    let spriteFrame = new cc.SpriteFrame(texture);
                    this.helpPanel.spriteFrame = spriteFrame;
                }

            }
        }.bind(this))
    },

    loadUI(name, data) {
        let wrapper = app.ClubViews;
        let path = "main-hall/resources/manualTransfer/";
        path = wrapper.path(name, null, path);
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (!error && cc.isValid(this)) {
                let node = cc.instantiate(prefab);
                this.getAddNode().addChild(node, 1, name);
                let com = node.getComponent(name);
                if (com) {
                    com.init(data);
                }
            } else {
                cc.error("myInfo loadui error = ", error)
            }

        }.bind(this))
    },

    loadActivityUI(name, data) {
        let wrapper = app.ClubViews;
        let path = "main-hall/resources/activity/";
        path = wrapper.path(name, null, path);
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (!error && cc.isValid(this)) {
                let node = cc.instantiate(prefab);
                this.node.parent.addChild(node, 1, name);
                let com = node.getComponent("HallActivityMain");
                if (com) {
                    com.init(this);
                }

                this.node.active = true;

            } else {
                cc.error("myInfo loadui error = ", error)
                this.node.active = true;
            }

        }.bind(this))
    },

    //个人信息资料
    onClickMyInfo() {
        //console.log("==========onClickMyInfo===onClickMyInfo=====")
        let prefabMyInfo = cc.instantiate(this.prefabMyInfo)
        this.node.addChild(prefabMyInfo)
        let component = prefabMyInfo.getComponent("HallMyInfo");
        if (component && this._userInfo) {
            component.initUI(this._userInfo)
            this._poolPopup.push(component.node)
        }
    },

    destroyPopup() {
        if (!this._poolPopup || this._poolPopup.length === 0) return
        for (let j = 0; j < this._poolPopup.length; j++) {
            const element = this._poolPopup[j];
            if (element) {
                element.destroy();
            }
        }
        this._poolPopup = []
    }
});