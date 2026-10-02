// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// let WXSDK = require("WXSDK");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_login");
let Utils = require("Utils");
let UserInfo = require("UserInfo");

// let App = require("App");

let MAX_LAUNCH_INTERVAL = 0; //启动时长(s)
cc.Class({
    extends: cc.Component,

    properties: {
        panelWeb: cc.Node,
        panelWX: cc.Node,
        panelContent: cc.Node,
        progress_node: cc.Node,

        labelText: cc.Label,
        labelPercent: cc.Label,

        _textString: "",
        _launchInterval: 0,
        _isLoaded: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if(app.config.IS_LIVE_ONLY) return;
        
        this._applyHashPokerLaunchStyle();

        this.panelWX.active = true;
        this.panelWeb.active = false;
        if (this.labelPercent) {
            this.labelPercent.string = "";
        }

        this._textString = "正在加载资源，请稍候";

        // let sizeDesign = cc.view.getDesignResolutionSize();
        // let winSize = cc.winSize;
        // let scaleX = winSize.width/sizeDesign.width;
        // let scaleY = winSize.height/sizeDesign.height;
        // let scale = Math.min(scaleX, scaleY);
        // this.panelContent.scale = scale;
        // this._initURLParams(); //改为在App._initURLParams()里获取
    },
    onDestroy() {
        // // MsgManager.un(this._onAppLoaded);
        // UIFrame.setLoadingPercentHandler(null);
    },

    start() {
    },

    update(dt) {
        if(app.config.IS_LIVE_ONLY) return;

        this._launchInterval += dt;

        if (!this._isLoaded) {
            this._launchInterval += dt;

            let text = [".", "..", "...", "....", ".....", "......",];
            let num = this._launchInterval * 1000 / 500;
            let index = Math.floor(num) % text.length;
            if (this.labelText) {
                this.labelText.string = this._textString + " " + text[index % text.length];
            }
        };

        if (this._launchInterval >= MAX_LAUNCH_INTERVAL) {
            if (!this._isLoaded && App.isLoaded()) {
                //游戏启动埋点
                let sceneNmae = cc.director.getScene().name;
                if(sceneNmae.charAt(sceneNmae.length - 2) === "_"){
                        sceneNmae = sceneNmae.substring(0,sceneNmae.length-2);
                }  
                app.statis.upload({
                    sUiPath: sceneNmae,
                    sEvent: "gameStart",
                    sOS: cc.sys.os,
                    sOsVersion: cc.sys.osVersion,
                    sBrowser: Utils.getUserAgent(),
                    sBrowserVer: cc.sys.browserVersion,
                    sModel: "unkown",
                    sDeviceId: Utils.getDevicesId(),
                });

                this._isLoaded = true;
                // if(WXSDK.isValid()){
                // 	this._onAppLoaded();
                // }
                // else{
                // 	this.panelWeb.active = true;
                // }

                //隐藏注册登录、服务器选择界面
                this.panelWeb.active = false; 

                //设置界面是否显示退出登录按钮
                app.config.SHOW_LOGOUT_BTN = false;

                let flag = app.url.get("account");
                let showLogin = flag==='1' ? true : false;

                // 关键修复：token 来源兜底。AppMain 已把 Telegram Base64 解码后的 token 写入 UserInfo，
                // 同时也 set 到了 my.url。这里优先读 UserInfo，再兜底 my.url，避免任一侧丢失导致 LOGIN_INVALID。
                let uiToken = UserInfo.getInfo()?.token;
                let urlToken = app.url.get("token");
                let tokenStr = (uiToken && uiToken !== "") ? uiToken : urlToken;
                let tokenLogin = (tokenStr !== undefined && tokenStr !== null && tokenStr !== "");
                let guest = app.url.get("guest")==='1' ? true : false;
                 
                // if(!app.config.ISDEVELOP){
                if(true){
                    let domain = window.location.origin;
                    let pathname = window.location.pathname;
                    if(pathname.length>1){
                        let index = pathname.lastIndexOf('/');
                        if(index>0){
                            pathname = pathname.substring(0, index+1);
                        }
                    }
                    domain += pathname;
                    
                    let checkkey = function (item, key) {
                        let handle = false;
                        if(item[key]){
                            if(item[key]==window.location[key] || item[key]==window.location[key]+'/'){
                                handle = true;
                            }
                        }
                        return handle;
                    }
                    //指定为游客登录
                    let array = [];
                    array = app.config.DOMAIN_GUEST instanceof Array ? app.config.DOMAIN_GUEST : [];
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        let handle = false;
                        if(typeof element == 'object'){
                            do {
                                handle = checkkey(element, 'origin');
                                if(handle) break;
                                handle = checkkey(element, 'hostname');
                                if(handle) break;
                                handle = checkkey(element, 'host');
                                if(handle) break;
                            } while (false);
                        }
                        else if(typeof element == 'string'){
                            if(domain==element || domain==element+'/'){
                                handle = true;
                            }
                        }
                        if(handle){
                            guest = true;
                            break;
                        }
                    }

                    //指定为帐号登录
                    array = app.config.DOMAIN_ACCOUNT instanceof Array ? app.config.DOMAIN_ACCOUNT : [];
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        let handle = false;
                        if(typeof element == 'object'){
                            do {
                                handle = checkkey(element, 'origin');
                                if(handle) break;
                                handle = checkkey(element, 'hostname');
                                if(handle) break;
                                handle = checkkey(element, 'host');
                                if(handle) break;
                            } while (false);
                        }
                        else if(typeof element == 'string'){
                            if(domain==element || domain==element+'/'){
                                handle = true;
                            }
                        }
                        if(handle){
                            showLogin = true;
                            break;
                        }
                    }
                }

                let processType = 0;
                let ELoginType = UserInfo.ELoginType;
                if (tokenLogin) {
                    UserInfo.setInfo({
                        loginType: ELoginType.TOKEN,
                    });
                    //令牌登录
                    MsgManager.fire(MSG.NOTIFY.LOGIN_TOKEN);
                }
                else{
                    //如果是渠道包
                    if(app.config.ENABLE_CHANNEL){
                        //以url上的配置优先
                        if(showLogin){
                        }
                        else{
                            showLogin = app.config.CUSTOM.ENABLE_SHOW_LOGIN;
                        }
                    }

                    if(!CC_BUILD){
                        if(app.config.CLICKED_CHANGE_ACCOUNT){//点击了切换账号后退出到登录界面的情况
                            UserInfo.setInfo({
                                loginType: ELoginType.ACCOUNT,
                            });
                            
                            this.panelWX.active = false;
                            this.panelWeb.active = true;
                            this.progress_node.active = false;
                            app.config.SHOW_LOGOUT_BTN = true;
                        }
                        else if(app.storage.getLastLoginWay()=="GUEST"){//上一次登录方式为游客方式
                            UserInfo.setInfo({
                                loginType: ELoginType.GUEST,
                            });
                            MsgManager.fire(MSG.NOTIFY.LOGIN_GUEST);  
                        }
                        else if(app.storage.getLastLoginWay()=="ACCOUNT"){//上一次登录方式为账号方式
                            UserInfo.setInfo({
                                loginType: ELoginType.ACCOUNT,
                            });

                            // this.panelWX.active = false;
                            // this.panelWeb.active = true;
                            // this.panelWeb.getChildByName("panel_1").active = false;
                            // this.panelWeb.getChildByName("panel_2").active = true;
                            processType = 1;
                            app.config.SHOW_LOGOUT_BTN = true;
                        }                        
                        else if(guest){
                            UserInfo.setInfo({
                                loginType: ELoginType.GUEST,
                            });
                            //游客登录
                            MsgManager.fire(MSG.NOTIFY.LOGIN_GUEST);  
                        }
                        else{
                            UserInfo.setInfo({
                                loginType: ELoginType.ACCOUNT,
                            });

                            //帐号登录
                            // this.panelWX.active = false;
                            // this.panelWeb.active = true;
                            processType = 2;
                            app.config.SHOW_LOGOUT_BTN = true;
                        }
                    }
                    else if(app.config.CLICKED_CHANGE_ACCOUNT){//点击了切换账号后退出到登录界面的情况
                        UserInfo.setInfo({
                            loginType: ELoginType.ACCOUNT,
                        });
                        
                        this.panelWX.active = false;
                        this.panelWeb.active = true;
                        this.progress_node.active = false;
                        app.config.SHOW_LOGOUT_BTN = true;
                    }
                    else if(app.storage.getLastLoginWay()=="GUEST"){//上一次登录方式为游客方式
                        UserInfo.setInfo({
                            loginType: ELoginType.GUEST,
                        });
                        MsgManager.fire(MSG.NOTIFY.LOGIN_GUEST);  
                    }
                    else if(app.storage.getLastLoginWay()=="ACCOUNT"){//上一次登录方式为账号方式
                        UserInfo.setInfo({
                            loginType: ELoginType.ACCOUNT,
                        });

                        // this.panelWX.active = false;
                        // this.panelWeb.active = true;
                        // this.panelWeb.getChildByName("panel_1").active = false;
                        // this.panelWeb.getChildByName("panel_2").active = true;
                        processType = 1;
                        app.config.SHOW_LOGOUT_BTN = true;
                    }                    
                    else if (showLogin) {
                        UserInfo.setInfo({
                            loginType: ELoginType.ACCOUNT,
                        });

                        //帐号登录
                        // this.panelWX.active = false;
                        // this.panelWeb.active = true;
                        processType = 2;
                        app.config.SHOW_LOGOUT_BTN = true;
                    }
                    else if(guest) {
                        UserInfo.setInfo({
                            loginType: ELoginType.GUEST,
                        });
                        //游客登录
                        MsgManager.fire(MSG.NOTIFY.LOGIN_GUEST);                    
                    }
                    else {
                        let isTgEnv = false;
                        try {
                            if (cc.sys.isBrowser) {
                                const tgWA = window.Telegram?.WebApp;
                                const validPlatforms = ['android', 'ios', 'tdesktop', 'web', 'weba', 'macos'];
                                if (tgWA) {
                                    const p = tgWA.platform;
                                    if (p && validPlatforms.includes(p)) isTgEnv = true;
                                    if (!isTgEnv && (tgWA.initData || tgWA.initDataUnsafe || tgWA.ready || tgWA.expand)) isTgEnv = true;
                                }
                                if (!isTgEnv) {
                                    const href = window.location.href || "";
                                    const curSearch = window.location.search || "";
                                    if (href.indexOf("tgWebApp") !== -1 || curSearch.indexOf("tgWebApp") !== -1) isTgEnv = true;
                                }
                                if (!isTgEnv) {
                                    const wn = window.name;
                                    if (wn && typeof wn === "string" && wn.toLowerCase().indexOf("telegram") !== -1) isTgEnv = true;
                                }
                                if (!isTgEnv && navigator && navigator.userAgent) {
                                    const ua = navigator.userAgent;
                                    if (ua.indexOf("Telegram") !== -1 || ua.indexOf("TG Mini App") !== -1) isTgEnv = true;
                                }
                            }
                        } catch (e) {}

                        if (isTgEnv) {
                            cc.warn("LaunchController: Telegram 环境无 token, 进入登录场景（将通过 Telegram initData 自动登录）");
                            UserInfo.setInfo({
                                loginType: ELoginType.ACCOUNT,
                            });
                            processType = 2;
                            app.config.SHOW_LOGOUT_BTN = true;
                        } else {
                            UserInfo.setInfo({
                                loginType: ELoginType.NONE,
                            });
                            MsgManager.fire(MSG.NOTIFY.LOGIN_INVALID);
                            return;
                        }
                    }
                }

                // if(!this.panelWeb.active){
                //     UIFrame.setLoadingPercentHandler(function (percent) {
                //         percent = Math.ceil(percent*100);
                //         if(percent>100){
                //             percent=100;
                //         }
                //         this.labelPercent.string = percent + "%";
                //     }.bind(this));
                // }
                
                MsgManager.fire(MSG.NOTIFY.LOGIN_INIT, this.panelWeb.active);
                MsgManager.fire(MSG.NOTIFY.LOGIN_SHOW_PANEL, processType);
            }
        }
    },

    // _onAppLoaded() {
    //     UIFrame.loadScene("hall", null, null, null, true);
    // },

    // _initURLParams(){
    //     let platform = app.url.get("platform");
    //     if(null!=platform){
    //         app.config.PLATFORM = platform;
    //     }
    //     let channel = app.url.get("channel");
    //     if(null!=channel){
    //         app.config.CHANNEL = channel;
    //     }
    // },

    _applyHashPokerLaunchStyle() {
        try {
            let scene = cc.director.getScene();
            let canvas = scene ? scene.getChildByName("Canvas") : null;
            if (!canvas) {
                cc.warn("LaunchController._applyHashPokerLaunchStyle: 未找到 Canvas");
                return;
            }

            let defSpl = cc.find("Canvas/reference/default_sprite_splash", scene)
                || cc.find("default_sprite_splash", canvas);
            if (defSpl) {
                let dSpr = defSpl.getComponent(cc.Sprite);
                if (dSpr) { dSpr.spriteFrame = null; dSpr.enabled = false; }
                defSpl.opacity = 0;
            }
            let ref = canvas.getChildByName("reference");
            if (ref && ref.childrenCount > 0) {
                for (let ri = 0; ri < ref.childrenCount; ri++) {
                    let ch = ref.children[ri];
                    if (ch.name && ch.name.indexOf("splash") !== -1) {
                        let spr = ch.getComponent(cc.Sprite);
                        if (spr) { spr.spriteFrame = null; spr.enabled = false; }
                        ch.opacity = 0;
                    }
                }
            }

            let app = scene.getChildByName("[APP]") || scene.getChildByName("APP");
            let loadingBlock = app ? app.getChildByName("LoadingBlock") : cc.find("APP/LoadingBlock", scene) || cc.find("[APP]/LoadingBlock", scene);
            if (loadingBlock) {
                let lbSpr = loadingBlock.getComponent(cc.Sprite);
                if (lbSpr) { lbSpr.spriteFrame = null; lbSpr.enabled = false; }
                let blk = loadingBlock.getChildByName("block");
                if (blk) {
                    let blkSpr = blk.getComponent(cc.Sprite);
                    if (blkSpr) { blkSpr.spriteFrame = null; blkSpr.enabled = false; }
                    blk.opacity = 0;
                }
            }

            let bgName = "_tech_fullscreen_bg_";
            let oldFull = canvas.getChildByName(bgName);
            if (oldFull) oldFull.destroy();
            let techBg = new cc.Node(bgName);
            techBg.setAnchorPoint(0.5, 0.5);
            techBg.setPosition(0, 0);
            let winS = cc.winSize;
            let W = Math.max(winS.width, canvas.width || 1080);
            let H = Math.max(winS.height, canvas.height || 1920);
            techBg.width = W;
            techBg.height = H;
            techBg.opacity = 255;
            canvas.insertChild(techBg, 0);

            if (cc.director.setClearColor) {
                cc.director.setClearColor(cc.color(10, 15, 44, 255));
            }

            let g = techBg.addComponent(cc.Graphics);
            let halfW = W * 0.5;
            let halfH = H * 0.5;

            g.rect(-halfW, -halfH, W, H);
            g.fillColor = cc.color(10, 15, 44, 255);
            g.fill();

            let stripW = 260;
            let cols = Math.ceil((W + H) / stripW) + 2;
            for (let c = -cols; c < cols; c++) {
                g.moveTo(-halfW + c * stripW, -halfH);
                g.lineTo(-halfW + c * stripW + H, halfH);
                g.lineTo(-halfW + c * stripW + H + stripW * 0.45, halfH);
                g.lineTo(-halfW + c * stripW + stripW * 0.45, -halfH);
                g.close();
                g.fillColor = (c % 2 === 0) ? cc.color(28, 22, 85, 85) : cc.color(55, 28, 120, 65);
                g.fill();
            }

            g.circle(-halfW * 0.38, halfH * 0.48, Math.min(W, H) * 0.4);
            g.fillColor = cc.color(115, 65, 190, 115);
            g.fill();
            g.circle(halfW * 0.38, -halfH * 0.48, Math.min(W, H) * 0.38);
            g.fillColor = cc.color(55, 95, 210, 105);
            g.fill();

            let starCount = 100;
            for (let i = 0; i < starCount; i++) {
                let sx = (Math.random() * 2 - 1) * halfW * 0.95;
                let sy = (Math.random() * 2 - 1) * halfH * 0.95;
                let r = 0.9 + Math.random() * 2.8;
                let shade = Math.random();
                let col;
                if (shade < 0.5) col = cc.color(255, 255, 255, 195 + Math.floor(Math.random() * 60));
                else if (shade < 0.85) col = cc.color(195, 215, 255, 175 + Math.floor(Math.random() * 70));
                else col = cc.color(255, 228, 155, 195 + Math.floor(Math.random() * 60));
                g.circle(sx, sy, r);
                g.fillColor = col;
                g.fill();
            }

            let cubes = [
                { x: -halfW * 0.7, y: halfH * 0.7, s: 46, col: cc.color(95, 135, 250, 115) },
                { x: halfW * 0.7, y: halfH * 0.45, s: 60, col: cc.color(255, 195, 125, 105) },
                { x: -halfW * 0.58, y: -halfH * 0.6, s: 68, col: cc.color(95, 135, 250, 115) },
                { x: halfW * 0.7, y: -halfH * 0.68, s: 56, col: cc.color(255, 215, 165, 110) },
                { x: halfW * 0.1, y: halfH * 0.82, s: 36, col: cc.color(155, 185, 255, 90) },
                { x: -halfW * 0.18, y: -halfH * 0.85, s: 42, col: cc.color(255, 230, 175, 85) },
                { x: -halfW * 0.84, y: -halfH * 0.1, s: 34, col: cc.color(85, 125, 235, 105) },
                { x: halfW * 0.88, y: -halfH * 0.08, s: 30, col: cc.color(255, 220, 165, 95) }
            ];
            for (let k = 0; k < cubes.length; k++) {
                let cu = cubes[k];
                let cx = cu.x, cy = cu.y, s = cu.s, hs = s * 0.5;
                g.rect(cx - hs, cy - hs, s, s);
                g.fillColor = cu.col;
                g.fill();
                g.moveTo(cx - hs, cy); g.lineTo(cx + hs, cy);
                g.moveTo(cx, cy - hs); g.lineTo(cx, cy + hs);
                g.strokeColor = cc.color(255, 255, 255, 125);
                g.lineWidth = 1.1;
                g.stroke();
                g.rect(cx - hs, cy - hs, s, s);
                g.strokeColor = cc.color(255, 255, 255, 155);
                g.lineWidth = 1.5;
                g.stroke();
            }

            g.circle(-halfW * 0.9, halfH * 0.88, 8);
            g.fillColor = cc.color(255, 218, 128, 215);
            g.fill();
            g.circle(halfW * 0.88, -halfH * 0.9, 9);
            g.fillColor = cc.color(255, 218, 128, 215);
            g.fill();

            this._drawHPBadgeOnNode(canvas, W, H);

            cc.log("LaunchController._applyHashPokerLaunchStyle: 启动页科技风背景 + HP 徽章已绘制 (Canvas全屏节点)");
        } catch (e) {
            cc.warn("LaunchController._applyHashPokerLaunchStyle 失败:", e && e.message);
        }
    },

    _drawHPBadgeOnNode(parentNode, W, H) {
        if (!parentNode) return;
        W = W || parentNode.width || 1080;
        H = H || parentNode.height || 1920;
        try {
            let badgeName = "_launch_hp_badge_";
            let existing = parentNode.getChildByName(badgeName);
            if (existing) existing.destroy();

            let badge = new cc.Node(badgeName);
            badge.setAnchorPoint(0.5, 0.5);
            let badgeY = Math.floor(H * 0.04);
            badge.setPosition(0, badgeY);
            badge.width = 460;
            badge.height = 460;
            parentNode.addChild(badge, 99);

            let g = badge.addComponent(cc.Graphics);
            let R = 210;

            g.circle(0, 0, R + 24);
            g.fillColor = cc.color(255, 225, 140, 30);
            g.fill();

            g.circle(0, 0, R);
            g.fillColor = cc.color(232, 199, 106, 255);
            g.fill();

            g.circle(0, 0, R - 5);
            g.strokeColor = cc.color(180, 140, 50, 200);
            g.lineWidth = 3;
            g.stroke();

            g.circle(0, 0, R - 18);
            g.fillColor = cc.color(12, 18, 56, 255);
            g.fill();

            for (let i = 0; i < 12; i++) {
                let ang = (Math.PI * 2 / 12) * i;
                let rx = Math.cos(ang) * (R - 30);
                let ry = Math.sin(ang) * (R - 30);
                g.circle(rx, ry, 4.5);
                g.fillColor = cc.color(255, 220, 130, 245);
                g.fill();
            }

            let hp = new cc.Node('_hp_text_');
            let lbl = hp.addComponent(cc.Label);
            lbl.string = "HP";
            lbl.fontSize = 180;
            lbl.lineHeight = 180;
            lbl.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
            lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            lbl.color = cc.color(245, 215, 125, 255);
            hp.color = cc.color(245, 215, 125, 255);
            hp.setAnchorPoint(0.5, 0.5);
            hp.setPosition(0, 18);
            let hpO = hp.addComponent(cc.LabelOutline);
            hpO.color = cc.color(140, 95, 25, 200);
            hpO.width = 5;
            badge.addChild(hp, 10);

            let suits = new cc.Node('_suits_');
            suits.setAnchorPoint(0.5, 0.5);
            suits.setPosition(0, -120);
            let sLbl = suits.addComponent(cc.Label);
            sLbl.string = '\u2660       \u2665       \u25C6';
            sLbl.fontSize = 52;
            sLbl.lineHeight = 52;
            sLbl.fontFamily = "Arial, sans-serif";
            sLbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            sLbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            sLbl.color = cc.color(235, 205, 115, 255);
            suits.color = cc.color(235, 205, 115, 255);
            let sO = suits.addComponent(cc.LabelOutline);
            sO.color = cc.color(100, 65, 15, 220);
            sO.width = 2.5;
            badge.addChild(suits, 10);

            let titleName = "_hash_poker_title_";
            let oldTitle = parentNode.getChildByName(titleName);
            if (oldTitle) oldTitle.destroy();
            let title = new cc.Node(titleName);
            let titleLbl = title.addComponent(cc.Label);
            titleLbl.string = "HASH POKER";
            titleLbl.fontSize = 72;
            titleLbl.lineHeight = 88;
            titleLbl.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
            titleLbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            titleLbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            title.color = cc.color(232, 199, 106, 255);
            title.setAnchorPoint(0.5, 0.5);
            let titleY = badgeY - Math.floor(H * 0.22);
            title.setPosition(0, titleY);
            parentNode.addChild(title, 95);

            let tO = title.addComponent(cc.LabelOutline);
            tO.color = cc.color(150, 105, 30, 200);
            tO.width = 4;
        } catch (e) {
            cc.warn("LaunchController._drawHPBadgeOnNode 失败:", e && e.message);
        }
    },
});
