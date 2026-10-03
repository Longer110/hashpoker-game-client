// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: 登录逻辑控制相关类
// ]]

let my = require("my");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG_FRAMEWORKS = require("Msg");
let MSG = require("Msg_login");
let MD5 = require("md5");
let i18n = require('i18n');
let LocalStorage = require("LocalStorage");
let UIDialog = require("UIDialog");

// let WXSDK = require("WXSDK");
let UserInfo = require("UserInfo");
let CMD = require("protocol_login");

// let LoginInstance = require("init_login")
// let ConfigGame = require("ConfigGame");
let Utils = require("Utils");
let Base64 = require("base64");

let USE_BLOCK = false;

//登录方式
let ELoginType = UserInfo.ELoginType;

cc.Class({
    extends: cc.Component,

    properties: {
        _loginData: null,
        _loginType: ELoginType.NONE,
        _wxLoginData: null,
        _wxUserData: null,
        _wxKey: null,
        _blockIndex: 0,
        _count: 0,
        _timeoutid: 0,
        _isLogining: false,//“正在登录”状态
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        this._isLogining = false
        this.register()
    },
    register() {
        this.unregister()
        //websock监听
        my.net.on(my.NetworkEvent.OPEN, this._onWebsocketOpen, this);
        my.net.on(my.NetworkEvent.CLOSE, this._onWebsocketClose, this);
        my.net.on(my.NetworkEvent.RECONNECT, this._onWebsocketReconnect, this);
        my.net.on(my.NetworkEvent.FAIL, this._onWebsocketFail, this);
        my.net.on(my.NetworkEvent.CONNECTING, this._onWebsocketConnecting, this);
        my.net.on(my.NetworkEvent.CONNECTED, this._onWebsocketConnected, this);

        // MsgManager.on(MSG_FRAMEWORKS.WEBSOCKET.OPEN, this._onWebsocketOpen, this);
        // MsgManager.on(MSG_FRAMEWORKS.WEBSOCKET.CLOSE, this._onWebsocketClose, this);
        // MsgManager.on(MSG_FRAMEWORKS.WEBSOCKET.ERROR, this._onWebsocketError, this);

        //本地监听
        MsgManager.on(MSG.NOTIFY.LOGIN_START, this._loginServer, this);
        MsgManager.on(MSG.NOTIFY.REGISTER_START, this._registerServer, this);
        MsgManager.on(MSG.NOTIFY.LOGIN_WX_START, this._loginWX, this);
        MsgManager.on(MSG.NOTIFY.LOGIN_GUEST, this._loginServerGuest, this);
        MsgManager.on(MSG.NOTIFY.LOGIN_TOKEN, this._loginServerToken, this);
        MsgManager.on(MSG.NOTIFY.LOGIN_VIEWER, this._loginServerViewer, this);
        MsgManager.on(MSG.NOTIFY.LOGIN_INVALID, this._loginServerInvalid, this);

        //服务器监听
        MsgManager.on(MSG.ACCOUNT.SUB_GP_LOGON_SUCCESS, this._onLoginCallback, this);
        MsgManager.on(MSG.ACCOUNT.SUB_GP_REGISTER_RESULT, this._onRegisterCallback, this);
        MsgManager.on(MSG.ACCOUNT.SUB_WX_LOGON_RESULT, this._onLoginServerWXCallback, this);
        MsgManager.on(MSG.ACCOUNT.SUB_GP_WEIXIN_KEY, this._onLoginServerKeyWXCallback, this);
        MsgManager.on(MSG.ACCOUNT.SUB_GP_WEIXIN_ERROR, this._onLoginServerErrorWXCallback, this);
        MsgManager.on(MSG.ACCOUNT.SUB_WX_REGISTER_RESULT, this._onRegisterServerWXCallback, this);
        //微信监听
        // MsgManager.on(MSG.ENGINE.WX_EVENT_SHOW, this._onWXShowCallbak, this);
        // MsgManager.on(MSG.ENGINE.WX_EVENT_HIDE, this._onWXHideCallbak, this);

        //网关监听
        MsgManager.on(MSG.GATEWAY.SUB_GATEWAY_NOTICE, this._onGatewayNotifyCallback, this);
        MsgManager.on(MSG.GATEWAY.SUB_GATEWAY_STOP_SERVER_MAINTAIN, this._onStopServerCallback, this);
        MsgManager.on(MSG.GATEWAY.SUB_REP_CHECKOFFICIAL, this._onCheckOfficial, this);
    },
    unregister() {
        my.net.targetOff(this);
        // MsgManager.un(this._onWebsocketOpen);
        // MsgManager.un(this._onWebsocketClose);
        // MsgManager.un(this._onWebsocketError);

        MsgManager.un(this._loginServer, this);
        MsgManager.un(this._registerServer, this);
        MsgManager.un(this._loginWX, this);
        MsgManager.un(this._loginServerGuest, this);
        MsgManager.un(this._loginServerToken, this);
        MsgManager.un(this._loginServerViewer, this);
        MsgManager.un(this._loginServerInvalid, this);

        MsgManager.un(this._onLoginCallback, this);
        MsgManager.un(this._onRegisterCallback, this);
        MsgManager.un(this._onLoginServerWXCallback, this);
        MsgManager.un(this._onLoginServerKeyWXCallback, this);
        MsgManager.un(this._onLoginServerErrorWXCallback, this);
        MsgManager.un(this._onRegisterServerWXCallback, this);
        MsgManager.un(this._onGatewayNotifyCallback, this);
        MsgManager.un(this._onStopServerCallback, this);
        MsgManager.un(this._onCheckOfficial, this);

        // MsgManager.un(this._onWXShowCallbak);
        // MsgManager.un(this._onWXHideCallbak);
        this._clearTimeout();
    },

    // update (dt) {},

    _onWebsocketOpen(data) {
        //console.warn("LoginController", "_onWebsocketOpen", data);

        if (app.config.IS_CLUB_ONLY) {
            //俱乐部 断线重连有自动登录标志才登录
            if (!LocalStorage.getAutoLoginState()) {
                if (this._blockIndex) {
                    UIFrame.hideBlock(this._blockIndex);
                    this._blockIndex = 0;
                }
                return;
            }
        }

        this._isLogining = false;

        //掉线重连重新登录
        if (this._loginData) {
            //  //console.debug("普通断线重新登录");
            // if(UserInfo.isLogin()){
            //     let data = this._loginData;
            //     this._requestServer(data);
            // }
            // else{
            //      //console.debug("账号尚未登录");
            // }
            if (this._loginType == ELoginType.TOKEN) {
                MsgManager.fire(MSG.NOTIFY.LOGIN_TOKEN);
            }
            else if (this._loginType == ELoginType.ACCOUNT) {
                cc.warn("账号密码登陆断线重连")
                MsgManager.fire(MSG.NOTIFY.LOGIN_START, this._loginData);
            }
            else if (this._loginType == ELoginType.GUEST) {
                MsgManager.fire(MSG.NOTIFY.LOGIN_GUEST);
            }
            // else if (this._loginData.isRegister) {
            //     MsgManager.fire(MSG.NOTIFY.REGISTER_START, this._loginData);
            // }
            else if (this._loginType == ELoginType.VIEWER) {
                MsgManager.fire(MSG.NOTIFY.LOGIN_VIEWER);
            } else if (this._loginType == ELoginType.PHONE) {
                this._loginData.Type = this._loginType;
                MsgManager.fire(MSG.NOTIFY.LOGIN_START, this._loginData);
            } else if (this._loginType == ELoginType.MAILBOX) {
                this._loginData.Type = this._loginType;
                MsgManager.fire(MSG.NOTIFY.LOGIN_START, this._loginData);
            }
            else {
                // MsgManager.fire(MSG.NOTIFY.LOGIN_START, this._loginData);
                MsgManager.fire(MSG.NOTIFY.REGISTER_START, this._loginData);
            }

        }
        else if (this._wxLoginData) {
            //  //console.debug("微信断线重新登录");
            // let data = this._wxLoginData;
            // if(!UserInfo.isLogin() || !this._wxKey){
            //     data.logonType = 4;
            // }
            // else{
            //     data.logonType = 2; //微信端掉线重连
            //     data.code = this._wxKey;
            // }
            // this._requestServerWX(data);
        }
    },
    _onWebsocketClose(data) {
        this._isLogining = false;
        console.warn("LoginController", "_onWebsocketClose", data);
        UserInfo.setInfo({
            boolHasLogined: false,
            boolHallLogined: false,
        })
    },
    _onWebsocketConnecting() {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }
        this._blockIndex = UIFrame.showLoading(i18n.t("COMMON.JIA_ZAI_ZHONG"), true, function (params) {
            this._blockIndex = 0;
        }.bind(this), -1);
    },
    _onWebsocketConnected() {
        if (this._blockIndex) {
            if (!this._isLogining) {
                UIFrame.hideBlock(this._blockIndex);
                this._blockIndex = 0;
            }
        }
    },
    _onWebsocketReconnect() {
        //埋点
        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "reconnect",
            iUserId: UserInfo.getInfo().nUserID,
        });

        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }
        this._blockIndex = UIFrame.showLoading(i18n.t("COMMON.JIA_ZAI_ZHONG"), true, function (params) {
            this._blockIndex = 0;
        }.bind(this), -1);
    },
    _onWebsocketFail() {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }

        let AppBridge = app.bridge;
        app.postMessage(AppBridge.EVENT.GAME_ERROR, {
            error: AppBridge.errorID(108)
        });
        //连接失败（包括重连、自动切换网关都失败了）
        let text = i18n.t("COMMON.TIMEOUT_TO_LOGIN");
        this._showDialog(text, (isOK) => {
            if (cc.sys.isNative && app.config.IS_CLUB_ONLY) {
                app.storage.setAutoLoginState(false);
                if (!app.isInLoginScene) {
                    MsgManager.fire("logout");

                    app.res.loadLogin();
                }
            }
            else {
                if (!app.net.isConnect()) {
                    this._connect();
                }

                if (this._loginData) {
                    this._requestServer(this._loginData);
                }
            }
        })
    },

    // _onWebsocketError(data){
    //     console.warn("LoginController", "_onWebsocketError", data);
    // },
    _onWXShowCallbak(params) {
        //console.log("_onWXShowCallbak", this.name, params)
        if (!app.net.isConnect()) {
            //console.debug("微信断线重连");
            // app.net.refresh();
        }
    },
    _onWXHideCallbak(params) {
        //console.log("_onWXHideCallbak", this.name, params)
    },

    _onLoginSuccess(data) {
        // data.nLoginCount = 1
        if (data && data.nUserID) {
            UserInfo.setInfo({
                nUserID: data.nUserID,
                boolHasLogined: true,
                nLoginCount: data.nLoginCount,
            })

            let msg = "ID=" + data.nUserID + "&&DEVICE=" + Utils.getDevicesId();
            if (cc.sys.isBrowser) {
                msg += "&&HASH=" + Base64.encode(window.location.href + `[${data.nUserID}]`);
            }
            console.log("LoginController", "_onLoginSuccess", msg);
            QYLogs.dumpSysInfo();
        }


        // data.nLoginCount == 1 //登录次数
        //账号登录成功之后，继续登录大厅
        target.emit(event.SERVER_LOGIN_SUCCESS, data);
        return;
        // this._loginHall(data);
    },
    _onLoginFail(data) {
        if (data.nError == 5) {
            cc.log('LoginController', '_onLoginFail', '走注册流程', JSON.stringify(this._loginData))
            //走注册流程
            MsgManager.fire(MSG.NOTIFY.REGISTER_START, this._loginData);
            return;
        }
        if (data.nError == 3) {
            let path = "popup/dialog/UIDialog";
            let text = "你的账号已被封禁，无法登录\n请联系KKpoker客服处理"
            app.ui.loadPopup(path, function (component) {
                UIFrame.clearAllBlock();
                this.node.addChild(component.node, 1024);
                component.setBtnText(UIDialog.EShowType.OKCANCEL, '联系客服');
                component.show(text, function (isOK) {
                    if (isOK) {
                        Utils.openTelegramLink("https://t.me/kkpoker_vip");

                        // cc.sys.openURL("https://t.me/kkpoker_vip")
                    }
                    app.net.setEnabled(false)
                    app.net.disConnect(true);
                }.bind(this));
            }.bind(this));
            return
        }
        //登录失败
        target.emit(event.SERVER_LOGIN_FAIL, data);
        return;
    },
    _onRegistFail(data) {
        //注册失败
        target.emit(event.SERVER_REGIST_FAIL, data);
        return;
    },
    // _loginHall(data){
    //     if (data && data.nError == 1) {
    //         // let HallInstance = require("init_hall");
    //         // HallInstance.loginHall()
    //         app.res.loadHall(function onLaunched(params) {
    //             cc.log("LoginController", "load hall success");
    //         });
    //     }
    //     else{
    //         UIFrame.showTips("登录服务器失败");
    //     }
    // },

    //普通登录回调
    _onLoginCallback(data) {
        window.logTimestamp("SERVER_LOGIN_CALLBACK => ");
        app.stopTimestamp({
            loginAccount: true
        });

        cc.warn("账号密码登陆返回", "_onLoginCallback", JSON.stringify(data));
        // if (USE_BLOCK) {
        //     UIFrame.hideBlock(this._blockIndex);
        //     this._blockIndex = 0;
        // }

        this._isLogining = false;
        this._clearTimeout();
        this._count = 0;
        if (this._blockIndex > 0) {
            UIFrame.hideBlock(this._blockIndex);
        }
        this._blockIndex = 0;

        //埋点
        let loginType = 1;
        if (this._loginData && this._loginData.isToken) {
            loginType = 3;
        }
        if (this._loginData && this._loginData.isGuest) {
            loginType = 2;
        }

        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "loginEnd",
            sVersion: app.config.VERSION,
            bType: loginType,
            sPlatfrom: app.config.CHANNEL,
            sChanel: app.config.CHANNEL,
            iResult: data.nError == 1 ? 1 : 0,
            sReason: data.nError,
            iUserId: data.nUserID,
        });

        //登录失败
        if (data.nError != 1) {
            this._onLoginFail(data);
            if (app.config.IS_CLUB_ONLY) {
                LocalStorage.setAutoLoginState(false);
            }
            return;
        }

        if (data.hasOwnProperty("sToken") && data.sToken !== "") {
            let tokenStr = UserInfo.getInfo().token;
            app.storage.setToken(tokenStr, data.sToken);
            try {
                let AppWebApi = require("AppWebApi");
                let isJwt = false;
                try {
                    if (AppWebApi._isGameJwt && typeof AppWebApi._isGameJwt === "function") {
                        isJwt = AppWebApi._isGameJwt(data.sToken);
                    } else {
                        isJwt = (data.sToken.split(".").length === 3);
                    }
                } catch (eCheck) { isJwt = false; }
                if (AppWebApi && AppWebApi.setRestToken && typeof AppWebApi.setRestToken === "function") {
                    if (isJwt) {
                        AppWebApi.setRestToken(data.sToken);
                        try { QYLogs.error("LoginController", "[Rup_Logon.sToken] ★是游戏JWT★（3段），缓存到 AppWebApi.setRestToken len=" + data.sToken.length + " prefix=" + data.sToken.substring(0, 8) + "..."); } catch (e) {}
                    } else {
                        try { QYLogs.error("LoginController", "[Rup_Logon.sToken] 不是游戏JWT（段数=" + data.sToken.split(".").length + "），符合文档 §1.2 Type=3令牌登录返回的是WS重连令牌。改用 URL ?token= 作为REST token。"); } catch (e) {}
                        let urlToken = UserInfo.getInfo().token;
                        let urlTokenIsJwt = false;
                        try {
                            if (AppWebApi._isGameJwt) urlTokenIsJwt = AppWebApi._isGameJwt(urlToken);
                            else urlTokenIsJwt = (urlToken && urlToken.split(".").length === 3);
                        } catch (eCk) {}
                        if (urlToken && urlTokenIsJwt) {
                            AppWebApi.setRestToken(urlToken);
                            try { QYLogs.error("LoginController", "[URL ?token=] 是游戏JWT，作为 REST token 缓存 len=" + urlToken.length + " prefix=" + urlToken.substring(0, 8) + "..."); } catch (e) {}
                        } else {
                            try { QYLogs.error("LoginController", "[URL ?token=] 段数=" + (urlToken||"").split(".").length + "，无法作为 REST JWT，等待后续兜底"); } catch (e) {}
                        }
                    }
                }
            } catch (e) {
                try { QYLogs.error("LoginController", "[Rup_Logon.sToken] setRestToken 异常: " + e.message); } catch (e2) {}
            }
        }

        if (false && data.hasOwnProperty("sVersions") && data.sVersions !== "") {
            //服务器返回的版本号
            cc.log("LoginController: 版本号 ", app.config.VERSION, data.sVersions);

            if (CC_BUILD) {
                //如果url指定了v参数，则需要判断版本号
                //或者url指定了live参数，表示是网页测试版，也需要判断版本号
                if (app.url.get("v") || app.url.get("live")) {
                    if (app.config.ENABLE_SERVER_VERSION) {
                        if (app.config.VERSION != data.sVersions) {
                            let diff = true;
                            //非网页测试版时只对比前三段
                            if (!app.url.get("live") && typeof app.config.VERSION == 'string' && typeof data.sVersions == 'string') {
                                let verLocal = app.config.VERSION.split('.');
                                let verServer = data.sVersions.split('.');
                                if (verLocal.length > 3 && verServer.length > 3) {
                                    verLocal.splice(3, verLocal.length - 3);
                                    verServer.splice(3, verServer.length - 3);
                                    let strLocal = verLocal.join(".");
                                    let strServer = verServer.join(".");
                                    //前三段一致时不需要提示
                                    if (strLocal == strServer) {
                                        diff = false;
                                    }
                                }
                            }
                            if (diff) {
                                cc.warn("[ERROR] 版本不一致：", app.config.VERSION, data.sVersions);
                                target.emit(event.SERVER_VERSION_ERROR, data);
                                //版本不一致，不执行后续逻辑
                                return;
                            }
                        }
                    }
                }
            }
        }

        if (cc.sys.isNative && data.hasOwnProperty("sVersions") && data.sVersions !== "") {
            // app.config.VERSION = data.sVersions;
            app.config.NEW_VERSION = data.sVersions;
        }

        this._updateLoginType(this._loginType);
        this._updateLoginSkin(data.sSkin);
        this._onLoginSuccess(data);
        this._udpateHelpUIType(data.sUiType);
    },
    _updateLoginType(loginType) {
        UserInfo.setInfo({
            loginType: loginType,
        })

        let token = UserInfo.getInfo().token;
        //如果登录方式不是令牌登录，token置空
        if (token && loginType != ELoginType.TOKEN) {
            UserInfo.setInfo({
                token: "",
            })
        }
    },
    _updateLoginSkin(skin) {
        if (app.config.IS_CLUB_ONLY) {
            return;
        }

        if (skin && skin != "") {
            //优先使用 app 设置的皮肤 
            if (app.getAppSkin() && app.getAppSkin() != "") {
            }
            else {
                let isValid = Utils.checkValid(skin, app.config.SKINALL);
                if (isValid) {
                    app.config.SKIN = skin;
                    app.storage.setSkin(skin);
                }
            }
        }
    },
    _udpateHelpUIType(sUiType) {
        if (sUiType && sUiType != "") {
            app.config.DIFF_GROUP_UI_TYPE = sUiType;
        }
    },
    //普通注册回调
    _onRegisterCallback(data) {
        cc.log("LoginController", "_onRegisterCallback", data);
        this._isLogining = false;
        //注册失败
        if (data.nError != 1) {
            // if(USE_BLOCK){
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
            // }
            // let key = "REGISTER_ERROR." + data.nError;
            // UIFrame.showTips(i18n.t(key));
            this._loginData = null;
            this._onRegistFail(data);
            if (app.config.IS_CLUB_ONLY) {
                LocalStorage.setAutoLoginState(false);
            }
            return;
        }

        //埋点
        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "registerEnd",
            sVersion: app.config.VERSION,
            bType: 1,
            sPlatfrom: app.config.CHANNEL,
            sChanel: app.config.CHANNEL,
            iResult: data.nError == 1 ? 1 : 0,
            sReason: data.nError,
            iUserId: data.nUserID,
        });

        //如果是注册类型，注册成功后修改为登录类型
        if (this._loginType == ELoginType.NONE) {
            this._loginType = ELoginType.ACCOUNT;
        }
        else if (this._loginType == ELoginType.GUEST) {//游客第一次登录时，服务器会自动注册账号，返回注册成功协议
        }

        app.config.IS_REGISTER = true;

        this._updateLoginSkin(data.sSkin);
        //注册成功，直接登录
        this._onLoginCallback(data);
    },

    isTgPlatformsCheck() {
        if (app.config.ISTelegramMiniApp) {
            window.Telegram = { WebApp: { ready: () => { }, expand: () => { }, initDataUnsafe: "user=%7B%22id%22%3A6314526224%2C%22first_name%22%3A%22cocos%22%2C%22last_name%22%3A%22TESS%22%2C%22username%22%3A%22zmax11100%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FmnOQLYJbwdRRJFZO7-pFaZOS-iDf0sbcrHohzqK-dTb01cC6UzIct9BqC8Xp9yiq.svg%22%7D&chat_instance=-917354196225748053&chat_type=supergroup&auth_date=1760690202&signature=yKn-rc32vAyn3_MNsdffdgDuTu3_Ep7Anazwof9Z3Qm6QF3kXmFl5zqRYmXsN0AvC4dlaKu9g06pGXI_DBA&hash=0d5a51dbe84459092f62541c3892f8da46ad2286cdcf3540c61863cfa785f4fc" } };
            return true
        }
        let isTelegramMiniApp = (typeof window.Telegram !== 'undefined' && !!window.Telegram.WebApp);
        const tg = window.Telegram?.WebApp;


        //tg不显示全屏
        // if (tg && tg.requestFullscreen) {
        //      tg.requestFullscreen();
        // } 
        const p = tg?.platform;
        const validPlatforms = ['android', 'ios', 'tdesktop', 'web', 'weba', 'macos'];
        if (isTelegramMiniApp && validPlatforms.includes(p)) {
            return true
        }
        return false
    },
    _connect() {
        // let server = app.server.get("net").SERVER;
        // if(!server){
        //     server = app.storage.getDEVServer();
        //     app.server.get("net").SERVER = server;
        // }
        let ServerNet = app.server.get("net");
        let server = null;
        let connected = false;
        if (!this.isTgPlatformsCheck()) {
            server = app.storage.getDEVServer();
            if (!server) {
                server = {
                    NAME: "内网1",
                    HEAD: "ws",
                    HOST: "192.168.31.90",
                    PORT: 50043,
                }
            }
            connected = app.net.isConnect();
        } else {
            //外网直接访问地址（443=wss默认端口，NetworkManager 会自动省略 :443）
            server = {
                NAME: "外网",
                HEAD: "wss",
                HOST: "game-api.hashpoker.vip",
                PORT: 443,
            }

        }
        console.log("LoginController", "_connect = " + connected, server);
        if (!connected) {
            app.net.connect(server);
        }
    },
    //普通登录
    _loginServer(params) {

        if (app.config.IS_SINGLE) {
            console.log("LoginController", "单机版本游戏不登录");
            return;
        }

        window.logTimestamp("SERVER_LOGIN_START => ");

        console.log("LoginController", "_loginServer", params);
        if (this._isLogining) {
            console.warn("LoginController", "登录状态中，忽略本次account登录。");
            return;
        }

        if (!params || typeof params != "object") {
            cc.error("参数类型错误");
            console.log("params error");
            UIFrame.showTips("参数类型错误");
            this._onLoginFail(null);
            return;
        }

        let strName = params.Accounts || params.strName;
        let strPWD = params.Password || MD5.hex(params.strPWD);

        if (!params.Accounts && (strName.length == 0 || strPWD.length == 0)) {
            UIFrame.showTips("参数不能为空");
            this._onLoginFail(null);
            console.log("params error is null");
            return;
        }

        let data = this._getDefaultLoginData();
        data.Accounts = strName;
        data.Password = strPWD;

        if (params.sDeviceModel) {
            data.sDeviceModel = params.sDeviceModel;
        }

        if (params.sGps) {
            data.sGps = params.sGps;
        }

        app.storage.setAppUserID(data.Accounts);
        app.storage.setLastLoginWay("ACCOUNT");
        this._loginType = ELoginType.ACCOUNT;
        if (params.hasOwnProperty("Type") || params.hasOwnProperty("nRegistWay")) {
            //新增手机和邮箱登录
            if (params.Type) {
                this._loginType = params.Type;
                data.Type = params.Type;
            } else {
                //注册成功后断线重连
                this._loginType = params.nRegistWay;
                data.Type = params.nRegistWay;
            }


        }
        console.log("login data connect ", "_loginServer data=", JSON.stringify(data));

        this._connect();
        console.log("login data", "_loginServer data=", JSON.stringify(data));
        this._requestServer(data);

        if (!app.net.isConnect()) return;
        //埋点
        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "loginStart",
            sVersion: app.config.VERSION,
            bType: 1,
            sPlatfrom: app.config.CHANNEL,
            sChanel: app.config.CHANNEL,
            iResult: 0,
            sReason: "",
            iUserId: -1,
        });
    },

    //游客登录
    _loginServerGuest() {
        if (app.config.IS_SINGLE) {
            console.log("LoginController", "单机版本游戏不登录");
            return;
        }

        window.logTimestamp("SERVER_LOGIN_START_GUEST => ");

        console.log("LoginController", "_loginServerGuest");
        if (this._isLogining) {
            console.warn("LoginController", "登录状态中，忽略本次guest登录。");
            return;
        }

        //账号
        let strName = app.storage.getGuestID();
        //密码，默认为123456
        let strPWD = "123456";
        if (!strName) {
            strName = Utils.getDevicesId();
            app.storage.setGuestID(strName);
        }

        let data = this._getDefaultLoginData();
        data.Accounts = strName;
        data.Password = MD5.hex(strPWD);
        data.Type = 0;
        data.isGuest = true;

        app.storage.setLastLoginWay("GUEST");

        this._loginType = ELoginType.GUEST;
        this._connect();
        this._requestServer(data);

        if (!app.net.isConnect()) return;
        //埋点
        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "loginStart",
            sVersion: app.config.VERSION,
            bType: 2,
            sPlatfrom: app.config.CHANNEL,
            sChanel: app.config.CHANNEL,
            iResult: 0,
            sReason: "",
            iUserId: -1,
        });
    },

    //观众登录
    _loginServerViewer() {
        if (app.config.IS_SINGLE) {
            console.log("LoginController", "单机版本游戏不登录");
            return;
        }

        window.logTimestamp("SERVER_LOGIN_START_VIEWER => ");

        console.log("LoginController", "_loginServerViewer");
        if (this._isLogining) {
            console.warn("LoginController", "登录状态中，忽略本次观众登录。");
            return;
        }

        cc.log("_loginServerViewer")
        let data = this._getDefaultLoginData();
        data.Type = 4;
        data.Accounts = "VIEWER";
        data.Password = "";

        app.storage.setAppUserID(data.Accounts);
        app.storage.setLastLoginWay("VIEWER");

        this._loginType = ELoginType.VIEWER;
        this._connect();
        this._requestServer(data);
    },

    //无效的登录
    _loginServerInvalid() {
        target.emit(event.GAME_LAUNCH_INVALID);
        return;
    },

    _showDialog(text, callback) {
        let showType = UIDialog.EShowType.OK;

        let params = {};
        params.showType = showType;
        params.text = text;
        params.callback = function (isOK) {
            if (callback) {
                callback(isOK);
            }
        }.bind(this);
        MsgManager.fire(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, params);

        // let path = "popup/dialog/UIDialog";
        // app.common.ui.loadPopup(path, function (component) {
        //     this.node.addChild(component.node, cc.macro.MAX_ZINDEX-1);
        //     component.setShowType(UIDialog.EShowType.OK);
        //     component.show(text, function (isOK) {
        //         callback&&callback(isOK);
        //     }.bind(this));
        //     component.node.position = cc.Vec2.ZERO;
        // }.bind(this), {
        //     loader: my.wrapper.COMMON,
        // });
    },

    //令牌登录
    _loginServerToken() {
        if (app.config.IS_SINGLE) {
            console.log("LoginController", "单机版本游戏不登录");
            return;
        }

        window.logTimestamp("SERVER_LOGIN_START_TOKEN => ");

        console.log("LoginController", "_loginServerToken");
        if (this._isLogining) {
            console.warn("LoginController", "登录状态中，忽略本次token登录。");
            return;
        }

        let data = this._getDefaultLoginData();
        data.Type = 3;
        //url上的令牌
        let tokenStr = UserInfo.getInfo().token;
        //url上的令牌
        // let tokenStr = app.url.get("token");
        //首次令牌
        let firstToken = app.storage.getFirstToken(tokenStr);
        if (tokenStr !== firstToken) {
            app.storage.setFirstToken(tokenStr, tokenStr);
            data.sToken = tokenStr;
            app.storage.setToken(tokenStr, tokenStr);
        }
        else {
            data.sToken = app.storage.getToken(tokenStr);
        }

        data.isToken = true;

        app.storage.setLastLoginWay("TOKEN");
        this._loginType = ELoginType.TOKEN;
        this._connect();
        this._requestServer(data);

        if (!app.net.isConnect()) return;
        //埋点
        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "loginStart",
            sVersion: app.config.VERSION,
            bType: 3,
            sPlatfrom: app.config.CHANNEL,
            sChanel: app.config.CHANNEL,
            iResult: 0,
            sReason: "",
            iUserId: -1,
        });
    },

    _requestServer(data) {
        if (this._isLogining) {
            console.warn("LoginController", "登录状态中，忽略本次登录。data=", data);
            return;
        }

        console.warn("LoginController", "_请求登录中", this._isLogining);
        this._isLogining = true;
        //保存登录数据，用于掉线重连
        this._loginData = data;



        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }

        if(app){

        }
        cc.warn("账号密码登陆发送服务器数据", "_requestServer data=", JSON.stringify(data));
        app.net.send(CMD.MDM_GP_LOGON.value, CMD.MDM_GP_LOGON.SUB_REQ_LOGON, data);
        this._requestTableInfo();

        if (!this._blockIndex) {
            this._blockIndex = UIFrame.showLoading(i18n.t("COMMON.JIA_ZAI_ZHONG"), true, function (params) {
                this._blockIndex = 0;
            }.bind(this), -1);
        }
        this._setLoginTimeout();

    },
    _clearTimeout() {
        if (this._timeoutid > 0) {
            clearTimeout(this._timeoutid);
            this._timeoutid = 0;
        }
    },
    _setLoginTimeout() {
        this._clearTimeout();
        this._timeoutid = setTimeout(function () {
            this._isLogining = false;
            if (this._count >= 2) {
                this._count = 0;
                if (this._blockIndex) {
                    UIFrame.hideBlock(this._blockIndex);
                    this._blockIndex = 0;
                }
                let text = i18n.t("LOGIN.LOGINFAIL");
                this._showDialog(text + "\n请检查网络后重试", (isOK) => {
                    if (isOK) {
                        if (!app.net.isConnect()) {
                            this._connect();
                        }
                        this._count = 0;
                        this._requestServer(this._loginData);
                    }
                });
                this._clearTimeout();
                return;
            }
            this._count++;
            this._requestServer(this._loginData);
            console.log("LoginController", "登录超时重试：count=" + this._count);
        }.bind(this), 1000 * 10); //10秒
    },
    _getDefaultLoginData() {
        let data = {
            Accounts: "",
            Password: "",
            Type: 1,
            SysVersion: Utils.getSystemVersion(),
            Models: Utils.getDevicesId(),
            Channel: app.config.CHANNEL,
            Location: "广州",
            sVersions: app.config.VERSION,
            sPlatform: app.config.PLATFORM,
        };

        //url上的分店id
        let shopID = app.url.get("shopID");
        if (null != shopID) {
            data.nShopId = Number(shopID);
        }


        let inviteUserId = "";
        const tg = window.Telegram?.WebApp;
        if (tg) {
            const startParam = tg.initDataUnsafe?.start_param;
            if (startParam){
                if (startParam.startsWith("invite_")){
                    inviteUserId = startParam.replace("invite_", "");
                }else{
                    inviteUserId = startParam
                }
                
            }
        };
        if (!inviteUserId || inviteUserId.length == 0){
            inviteUserId = ""
        }

        data.Models = inviteUserId + ""
        return data;
    },


    //普通注册
    _registerServer(params) {
        if (typeof params != "object") {
            cc.error("参数类型错误");
            UIFrame.showTips("参数类型错误");
            this._onLoginFail(null);
            return;
        }

        let strName = params.Accounts || params.strName;
        let strPWD = params.Password || MD5.hex(params.strPWD);


        if (!params.Accounts && (strName.length == 0 || strPWD.length == 0)) {
            UIFrame.showTips("参数不能为空");
            this._onLoginFail(null);
            return;
        }

        // let data = {
        //     Accounts: strName,
        //     Password: MD5.hex(strPWD),
        //     NickName:"我的世界",
        //     Sex:0,
        //     SysVersion:"mac",
        //     Models:"haibuzhidao",
        //     Channel: app.config.CHANNEL,
        //     IP:"192.168.1.1",
        //     PhoneType:"mac",
        //     Location:"广州",
        //     sVersions: app.config.VERSION,
        //     sPlatform: app.config.PLATFORM,
        // };


        console.log("LoginController", "_registerServer", params);

        if (USE_BLOCK) {
            this._blockIndex = UIFrame.showBlock(i18n.t("NETWORK.REGISTING"), true, function (params) {
                UIFrame.hideBlock(this._blockIndex);
                this._blockIndex = 0;
            }.bind(this));
        }

        //保存登录数据，用于掉线重连
        this._loginData = this._getDefaultLoginData();
        this._loginData.Accounts = strName;
        this._loginData.Password = strPWD;

        if (params.hasOwnProperty("sFaceID")) {
            //俱乐部注册账号可以设置头像
            this._loginData.sFaceID = params.sFaceID;
        }

        if (params.hasOwnProperty("NickName")) {
            this._loginData.NickName = params.NickName;
        }

        if (params.hasOwnProperty("Sex")) {
            this._loginData.Sex = params.Sex;
        }

        this._loginType = ELoginType.NONE;
        if (params.hasOwnProperty("nRegistWay")) {
            this._loginData.nRegistWay = params.nRegistWay;
            this._loginType = params.nRegistWay;
        }

        if (params.hasOwnProperty("sVeriCode")) {
            this._loginData.sVeriCode = params.sVeriCode;
        }

        let sendData = Utils.clone(this._loginData);

        if (app.config.IS_CLUB_ONLY) {
            //俱乐部用来做推广码，直播合集传空串
            sendData.Models = JSON.stringify({ nType: 1, sValue: params.Models || "" });
            this._loginData.Models = params.Models || "";
        } else {
            sendData.Models = JSON.stringify({ nType: 2, sValue: this._loginData.Models });
        }




        app.storage.setLastLoginWay("ACCOUNT");
        this._connect();
        app.net.send(CMD.MDM_GP_LOGON.value, CMD.MDM_GP_LOGON.SUB_REQ_REGISTER, sendData);

        //埋点
        let sceneName = cc.director.getScene()?.name || "empty";
        if (sceneName.charAt(sceneName.length - 2) === "_") {
            sceneName = sceneName.substring(0, sceneName.length - 2);
        }
        app.statis.upload({
            sUiPath: sceneName,
            sEvent: "registerStart",
            sVersion: app.config.VERSION,
            bType: 1,
            sPlatfrom: app.config.CHANNEL,
            sChanel: app.config.CHANNEL,
            iResult: 0,
            sReason: "",
            iUserId: -1,
        });
    },

    //微信SDK登录
    _loginWX(wx_login_position_node) {
        if (this._wxUserData) {
            this._loginServerWX(this._wxUserData);
            return;
        }

        WXSDK.init(wx_login_position_node);
        WXSDK.login(function (success, data) {
            cc.log("WXSDK.login: ", success, data);
            if (success) {
                this._wxUserData = data;
                if (data) {
                    this._loginServerWX(data);
                }
                else if (!WXSDK.isValid()) {
                    this._onLoginFail(null);
                }
            }
        }.bind(this));
    },
    //服务器微信登录
    _loginServerWX(res) {
        if (!res) return;

        let rawData = null;
        if (res.rawData) {
            rawData = JSON.parse(res.rawData) || {};
        }
        //保存昵称跟头像
        if (rawData.nickName) {
            UserInfo.setInfo({
                strNickName: rawData.nickName,
                strHeadUrl: rawData.avatarUrl,
            })
        };

        let code = {
            // rawData: res.rawData,
            code: res.code,
            encryptedData: res.encryptedData,
            iv: res.iv,
        }
        let logonType = 4;
        if (UserInfo.isLogin()) {
            logonType = 2; //重连
        }
        let data = {
            logonType: logonType,              //登录类型:   1 授权登录，2 重连 3 4:web微信登录
            code: JSON.stringify(code),
            accountType: 2,       //账号类型:  1账号，2微信
            lastLogonIP: "192.168.1.1",
            logonPhoneType: "11",
            logonUserSystemVersion: "1",
            logonModels: "123456",
            channel: app.config.CHANNEL,
            sPlatform: app.config.PLATFORM,
            sVersions: app.config.VERSION,
        }

        this._requestServerWX(data);
    },
    _requestServerWX(data) {
        this._wxLoginData = data;
        //console.log("[LOGIN]:", data);
        if (!app.net.isConnect()) {
            app.net.refresh();
            // UIFrame.showTips(i18n.t("NETWORK.UNCONNECTED"));
            return;
        }

        app.net.request(CMD.ACCOUNT.value, CMD.ACCOUNT.SUB_GP_LOGON_TENCENT, data);
    },

    //微信登录成功返回
    _onLoginServerWXCallback(data) {
        //console.log("_onLoginServerWXCallback", data);

        //登录失败
        if (data && data.nError != 1) {
            let key = "LOGON." + data.nError;
            UIFrame.showTips(i18n.t(key));
            this._onLoginFail(data);
            return;
        }

        this._onLoginSuccess(data);
    },

    //微信注册成功返回
    _onRegisterServerWXCallback(data) {
        //注册失败
        if (data.nError != 1) {
            let key = "REGISTER." + data.nError;
            UIFrame.showTips(i18n.t(key));
            return;
        }

        this._onLoginServerWXCallback(data);
    },

    //微信登录成功后返回key
    _onLoginServerKeyWXCallback(data) {
        if (data) {
            this._wxKey = data.sKey;
        }
        //console.log("_onLoginServerKeyWXCallback key = ", data.sKey, data);
    },

    //微信登录错误
    _onLoginServerErrorWXCallback(data) {
        //console.log("_onLoginServerErrorWXCallback", data.nError, data);
    },



    //网关跑马灯返回
    _onGatewayNotifyCallback(data) {
        cc.warn("TODO", "网关跑马灯返回");
        target.emit(event.SERVER_GATEWAY_NOTICE, data);
        return;
    },

    //网关通知子游戏维护
    _onStopServerCallback(data) {
        cc.warn("TODO", "网关通知子游戏维护", data);
        if (data && data.cStat == 3) {
            //游戏维护消息
            let myData = {
                cStat: data.cStat,
                sTimeStart: data.nSTime ? data.nSTime : 0,
                sTimeEnd: data.nETime ? data.nETime : 0,
            }
            target.emit(event.SERVER_SUBGAME_WEI_HU_ZHONG, myData);
        }

    },

    //网关获取牌桌信息（检查是否是官方房和区块链）
    _requestTableInfo() {
        if (!app.net.isConnect()) {
            return;
        }

        let gameData = app.game.getData();
        if (!gameData || !gameData.sTableId) {
            return;
        }

        let data = app.storage.getItem("IS_BLOCKCHAIN_AND_OFFICIAL", {});
        let list = data.tableList || [];
        let isOfficial = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].sTableId == gameData.sTableId) {
                app.config.IS_BLOCKCHAIN_AND_OFFICIAL = true;
                isOfficial = true;
                break;
            }

        }

        let nowTime = Date.parse(new Date());
        let oldTime = data.time || nowTime;
        let diff = nowTime - oldTime;
        if (diff > 60 * 60 * 24 * 7) {
            app.storage.setItem("IS_BLOCKCHAIN_AND_OFFICIAL", {});
        }

        if (isOfficial) {
            return;
        }

        let params = {
            sTableId: gameData.sTableId,
        }

        app.net.send(CMD.MDM_GP_GATEWAY.value, CMD.MDM_GP_GATEWAY.SUB_REQ_CHECKOFFICIAL, params);
    },

    _onCheckOfficial(data) {
        if (!data) {
            return;
        }

        if (data.IsOffical && data.nTableType == 2) {
            app.config.IS_BLOCKCHAIN_AND_OFFICIAL = true;
            let tmpData = app.storage.getItem("IS_BLOCKCHAIN_AND_OFFICIAL", {});
            if (!tmpData.time) {
                tmpData.time = Date.parse(new Date());
            }
            if (!tmpData.tableList) {
                tmpData.tableList = [];
            }
            tmpData.tableList.push({ sTableId: data.sTableId })
            app.storage.setItem("IS_BLOCKCHAIN_AND_OFFICIAL", tmpData);
        }
    },

    changeLoginPsw(psw) {
        this._loginData.Password = psw;
    },

    changeLoginAccount(account) {
        this._loginData.Accounts = account;
    },
});
