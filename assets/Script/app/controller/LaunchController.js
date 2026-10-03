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
            g.fillColor = cc.color(8, 16, 42, 255);
            g.fill();

            let bgGradSteps = 18;
            for (let si = 0; si < bgGradSteps; si++) {
                let t = si / bgGradSteps;
                let r = Math.floor(8 + t * (28 - 8));
                let gg = Math.floor(16 + t * (50 - 16));
                let b = Math.floor(42 + t * (100 - 42));
                let layerH = H / bgGradSteps;
                g.rect(-halfW, halfH - (si + 1) * layerH, W, layerH + 1);
                g.fillColor = cc.color(r, gg, b, 255);
                g.fill();
            }

            let vignetteSteps = 12;
            let vgMaxR = Math.sqrt(halfW * halfW + halfH * halfH);
            for (let vi = vignetteSteps; vi >= 1; vi--) {
                let vr = vgMaxR * (vi / vignetteSteps);
                let alpha = Math.floor(6 + (vignetteSteps - vi) * 3);
                g.circle(0, 0, vr);
                g.fillColor = cc.color(2, 6, 20, alpha);
                g.fill();
            }

            let haloCx = -halfW * 0.45;
            let haloCy = halfH * 0.55;
            let haloR = Math.min(W, H) * 0.52;
            let haloSteps = 10;
            for (let hi = haloSteps; hi >= 1; hi--) {
                let hr = haloR * (hi / haloSteps);
                let alpha = Math.floor(4 + (haloSteps - hi) * 4);
                g.circle(haloCx, haloCy, hr);
                g.fillColor = cc.color(70, 100, 175, alpha);
                g.fill();
            }

            let halo2Cx = halfW * 0.5;
            let halo2Cy = -halfH * 0.5;
            let halo2R = Math.min(W, H) * 0.45;
            for (let hi = haloSteps; hi >= 1; hi--) {
                let hr = halo2R * (hi / haloSteps);
                let alpha = Math.floor(3 + (haloSteps - hi) * 3);
                g.circle(halo2Cx, halo2Cy, hr);
                g.fillColor = cc.color(50, 80, 150, alpha);
                g.fill();
            }

            let cornerSize = Math.min(W, H) * 0.12;
            let cornerLineW = 2.2;
            let cornerAlpha = 110;

            let drawCorner = function (cx, cy, dirX, dirY) {
                g.moveTo(cx, cy - dirY * cornerSize * 0.75);
                g.lineTo(cx, cy);
                g.lineTo(cx - dirX * cornerSize * 0.75, cy);
                g.strokeColor = cc.color(205, 170, 100, cornerAlpha);
                g.lineWidth = cornerLineW;
                g.stroke();

                let inS = cornerSize * 0.55;
                let off = cornerSize * 0.08;
                g.moveTo(cx - dirX * off, cy - dirY * (inS + off));
                g.lineTo(cx - dirX * off, cy - dirY * off);
                g.lineTo(cx - dirX * (inS + off), cy - dirY * off);
                g.strokeColor = cc.color(205, 170, 100, Math.floor(cornerAlpha * 0.55));
                g.lineWidth = 1.2;
                g.stroke();
            };
            drawCorner(-halfW + cornerSize * 0.18, halfH - cornerSize * 0.18, -1, 1);
            drawCorner(halfW - cornerSize * 0.18, halfH - cornerSize * 0.18, 1, 1);
            drawCorner(-halfW + cornerSize * 0.18, -halfH + cornerSize * 0.18, -1, -1);
            drawCorner(halfW - cornerSize * 0.18, -halfH + cornerSize * 0.18, 1, -1);

            let gridStep = Math.min(W, H) * 0.095;
            g.lineWidth = 0.45;
            g.strokeColor = cc.color(120, 155, 210, 10);
            for (let gx = -halfW; gx <= halfW + gridStep; gx += gridStep) {
                g.moveTo(gx, -halfH);
                g.lineTo(gx, halfH);
            }
            for (let gy = -halfH; gy <= halfH + gridStep; gy += gridStep) {
                g.moveTo(-halfW, gy);
                g.lineTo(halfW, gy);
            }
            g.stroke();

            let dotCount = 80;
            for (let i = 0; i < dotCount; i++) {
                let dx = (Math.random() * 2 - 1) * halfW * 0.96;
                let dy = (Math.random() * 2 - 1) * halfH * 0.96;
                let r = 0.6 + Math.random() * 1.4;
                let shade = Math.random();
                let col;
                if (shade < 0.72) {
                    col = cc.color(200, 220, 255, 55 + Math.floor(Math.random() * 35));
                } else {
                    col = cc.color(235, 205, 145, 60 + Math.floor(Math.random() * 35));
                }
                g.circle(dx, dy, r);
                g.fillColor = col;
                g.fill();
            }

            let accentDotCount = 6;
            for (let i = 0; i < accentDotCount; i++) {
                let dx = (Math.random() * 2 - 1) * halfW * 0.82;
                let dy = (Math.random() * 2 - 1) * halfH * 0.82;
                let rings = 3;
                for (let ri = rings; ri >= 1; ri--) {
                    let rr = (2.2 + ri * 3.2);
                    let a = 10 + (rings - ri) * 14;
                    g.circle(dx, dy, rr);
                    g.strokeColor = cc.color(205, 170, 100, a);
                    g.lineWidth = 0.9;
                    g.stroke();
                }
                g.circle(dx, dy, 1.6);
                g.fillColor = cc.color(230, 195, 135, 150);
                g.fill();
            }

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
            badge.width = 560;
            badge.height = 460;
            parentNode.addChild(badge, 99);

            let hp = new cc.Node('_hp_text_');
            hp.width = 500;
            hp.height = 240;
            let lbl = hp.addComponent(cc.Label);
            lbl.string = "哈希德州";
            lbl.fontSize = 170;
            lbl.lineHeight = 170;
            lbl.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
            lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            lbl.enableBold = true;
            lbl.color = cc.color(245, 215, 125, 255);
            hp.color = cc.color(245, 215, 125, 255);
            hp.setAnchorPoint(0.5, 0.5);
            hp.setPosition(0, 28);
            let hpO = hp.addComponent(cc.LabelOutline);
            hpO.color = cc.color(140, 95, 25, 200);
            hpO.width = 5.2;
            badge.addChild(hp, 10);

            let suits = new cc.Node('_suits_');
            suits.setAnchorPoint(0.5, 0.5);
            suits.setPosition(0, -118);
            suits.width = 360;
            suits.height = 72;

            let s1 = new cc.Node("s1");
            let l1 = s1.addComponent(cc.Label);
            l1.string = "\u2660";
            l1.fontSize = 58;
            l1.lineHeight = 58;
            l1.enableWrapText = false;
            s1.color = cc.color(25, 25, 35, 255);
            s1.setPosition(-44, 0);
            suits.addChild(s1);

            let s2 = new cc.Node("s2");
            let l2 = s2.addComponent(cc.Label);
            l2.string = "\u2665";
            l2.fontSize = 58;
            l2.lineHeight = 58;
            l2.enableWrapText = false;
            s2.color = cc.color(205, 55, 75, 255);
            s2.setPosition(44, 0);
            suits.addChild(s2);

            let s3 = new cc.Node("s3");
            let l3 = s3.addComponent(cc.Label);
            l3.string = "\u25C6";
            l3.fontSize = 36;
            l3.lineHeight = 36;
            l3.enableWrapText = false;
            s3.color = cc.color(232, 199, 106, 255);
            s3.setPosition(0, 2);
            suits.addChild(s3);

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
