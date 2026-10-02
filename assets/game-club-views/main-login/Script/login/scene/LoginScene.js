// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let SceneBase = require("SceneBase");
let MsgManager = require("MsgManager");
let MSG = require("Msg_login");
// let NetManager = require("NetManager");
let UserInfo = require("UserInfo");
let i18n = require('i18n');
let LocalStorage = require("LocalStorage");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let DynamicListView = require("DynamicListView");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let HallClubCacheData = require("HallClubCacheData");
let HallClubLogic = require("HallClubLogic");
let CMD = require("protocol_login");
//let PeekCard = require("PeekCard");

// let USE_BLOCK = true;

let app = require("App");

let ELoginType = UserInfo.ELoginType;

cc.Class({
    extends: SceneBase,

    properties: {
        editName: cc.EditBox,
        editPwd: cc.EditBox,
        editInvite: cc.EditBox,
        _blockIndex: 0,
        panel_reg: cc.Node,
        panel_login: cc.Node,
        telegram_login: cc.Node,
        toggle_selectServer: cc.Toggle,
        serverName: cc.Label,
        editServer: cc.EditBox,
        btn_showReg: cc.Node,
        label_create: cc.Label,
        label_forgetPsw: cc.Label,
        protocol: cc.RichText,
        label_login: cc.Label,
        label_reg: cc.Label,
        label_loginAccount: cc.Label,
        btn_showPassword: cc.Node,
        dropUp: cc.Node,
        panel_inviteCode: cc.Node,

        loginType: cc.Node,
        loginTypeList: {
            default: [],
            type: cc.Node
        },

        editLoginPhone: cc.EditBox,              //手机号
        editLoginPhonePsw: cc.EditBox,          //手机登录密码
        editLoginMailbox: cc.EditBox,           //邮箱
        editLoginMailboxPsw: cc.EditBox,        //邮箱登录密码
        editLoginAccount: cc.EditBox,           //账号
        editLoginAccountPsw: cc.EditBox,        //账号登录密码
        showPsw: {
            default: [],
            type: cc.Node
        },

        countryCode: cc.Label,
        LoginAreaPhone: cc.Prefab,
        LoginRegister: cc.Prefab,
        LoginResetPswCheck: cc.Prefab,

        scrollview: {
            default: null,
            type: cc.ScrollView
        },
        mask: {
            default: null,
            type: cc.Node
        },
        itmeContent: {
            default: null,
            type: cc.Node
        },
        item: {
            default: null,
            type: cc.Prefab
        },

        btnTestToggle: cc.Node,

        _isShowPassword: true,
        _password: "",
        _loginType: 1, //1：手机登录 2：邮箱登录 3：账号登录

        //CardBack: cc.SpriteFrame = null,
        //CardPiont: cc.SpriteFrame = null,
        //CardShadow: cc.SpriteFrame = null,
        //peekCard: PeekCard = undefined,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let loginCtrl = app.getComponent("LoginController");
        if (loginCtrl) {
            loginCtrl._isLogining = false;
        } else {
            cc.warn("LoginScene.onLoad: LoginController 尚未挂载，跳过设置 _isLogining");
        }
        this._super();
        app.net.setAutoSwitchServer(false);
        App.isInLoginScene = true;
        window.HALL_SCROLL_OFFSET = null;

        this.register();
        this._init();

        this._tgAutoLoginTried = 0;
        this._tgPanelTried = 0;
        this._ensureTgLoginOrFallback();
    },

    _ensureTgLoginOrFallback() {
        if (this._tgAutoLoginDone) return;
        if (this.isTgPlatformsCheck()) {
            cc.warn("LoginScene: 检测到 Telegram 环境，触发自动登录（重试轮次=" + this._tgAutoLoginTried + "）");
            this._tgAutoLoginDone = true;
            this.checkTelegramMiniApp();
            return;
        }
        this._tgAutoLoginTried = (this._tgAutoLoginTried || 0) + 1;
        if (this._tgAutoLoginTried < 8) {
            this.scheduleOnce(() => {
                this._ensureTgLoginOrFallback();
            }, 0.25);
        } else {
            cc.warn("LoginScene: 多次重试未检测到 Telegram SDK，按普通 Web 环境处理");
        }
    },

    _ensureTgPanelHidden() {
        const layerView = this.node.getChildByName("LayerView");
        const panelWeb = layerView ? layerView.getChildByName("PanelWeb") : null;
        const panelNode = panelWeb ? panelWeb.getChildByName("panel") : null;
        if (!this.isTgPlatformsCheck()) {
            this._tgPanelTried = (this._tgPanelTried || 0) + 1;
            if (this._tgPanelTried < 6) {
                this.scheduleOnce(() => this._ensureTgPanelHidden(), 0.3);
            }
            return;
        }
        if (panelNode) {
            panelNode.active = false;
            cc.warn("LoginScene: 已隐藏 Telegram 环境下的账号登录面板（重试轮次=" + this._tgPanelTried + "）");
        }
        const pTg = panelNode ? panelNode.getChildByName("telegram_login") : null;
        const pLogin = panelNode ? panelNode.getChildByName("panel_login") : null;
        if (pTg) pTg.active = false;
        if (pLogin) pLogin.active = false;
    },


    // buildPeekCard(){
    //     this.peekCard.node.active = false;
    //     this.peekCard._originalDir = peekCard._dirType = PeekCard.DirType.vertical;
    //     // 设置搓牌区域大小 默认是Canvas设计分辨率大小
    //     this.peekCard.setTouchAreaSize(cc.size(1280, 720))
    //     // 优先设置牌大小
    //     this.peekCard.setCardSize(cc.size(this.peekCard.width - 20, this.peekCard.height - 30));

    //     // 动态设置搓牌方向(允许在其他位置调用)
    //     this.peekCard.dirType = dirType;

    //     this.peekCard.setCardBack(this.CardBack);
    //     this.peekCard.setCardFace(this.CardPiont);
    //     this.peekCard.setShadow(this.CardShadow);

    //     this.peekCard.directionLength = 20;
    //     this.peekCard.moveSpeed = 0.6;
    //     this.peekCard.angleFixed = 5;

    //     this.peekCard.init();    //搓牌前必须调用

    // },

    isTgPlatformsCheck() {
        if (app.config.ISTelegramMiniApp) {
            if (!window.Telegram || !window.Telegram.WebApp) {
                window.Telegram = { WebApp: { ready: () => { }, expand: () => { }, initDataUnsafe: "user=%7B%22id%22%3A6314526224%2C%22first_name%22%3A%22cocos%22%2C%22last_name%22%3A%22TESS%22%2C%22username%22%3A%22zmax11100%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FmnOQLYJbwdRRJFZO7-pFaZOS-iDf0sbcrHohzqK-dTb01cC6UzIct9BqC8Xp9yiq.svg%22%7D&chat_instance=-917354196225748053&chat_type=supergroup&auth_date=1760690202&signature=yKn-rc32vAyn3_MNsdffdgDuTu3_Ep7Anazwof9Z3Qm6QF3kXmFl5zqRYmXsN0AvC4dlaKu9g06pGXI_DBA&hash=0d5a51dbe84459092f62541c3892f8da46ad2286cdcf3540c61863cfa785f4fc" } };
            }
            return true
        }
        const tg = window.Telegram?.WebApp;
        const validPlatforms = ['android', 'ios', 'tdesktop', 'web', 'weba', 'macos'];
        if (tg) {
            const p = tg.platform;
            if (p && validPlatforms.includes(p)) return true;
            if (tg.initData || tg.initDataUnsafe || tg.ready || tg.expand) return true;
        }
        if (cc.sys.isBrowser) {
            try {
                const href = window.location.href || "";
                const search = window.location.search || "";
                if (href.indexOf("tgWebApp") !== -1 || search.indexOf("tgWebApp") !== -1) {
                    return true;
                }
                if (window.name && typeof window.name === "string" && window.name.indexOf("telegram") !== -1) {
                    return true;
                }
                const ua = navigator && navigator.userAgent ? navigator.userAgent : "";
                if (ua && (ua.indexOf("Telegram") !== -1 || ua.indexOf("TelegramMiniApp") !== -1 || ua.indexOf("TG Mini App") !== -1)) {
                    return true;
                }
            } catch (e) {}
        }
        return false
    },



    checkTelegramMiniApp() {
        if (this.isTgPlatformsCheck()) {
            this.getTelegramData();
        }
    },

    onDestroy() {
        this._super();
        App.isInLoginScene = false;

        target.targetOff(this);
        // MsgManager.un(this._onLoginInitPanel,this);

        if (this.scview) {
            this.scview.destroy();
        }
        app.net.setAutoSwitchServer(true);

        this.unRegister();
        let loginCtrl = app.getComponent("LoginController");
        if (loginCtrl) {
            loginCtrl._isLogining = false;
        } else {
            cc.warn("LoginScene.onDestroy: LoginController 不存在，跳过设置 _isLogining");
        }
    },

    start() {
        HallClubCacheData.initData();
        this.panel_login.getChildByName("btn_forgetPsw").active = false;

        this.btnTestToggle.active = app.config.ISDEVELOP;

        this._injectTechBackgroundCSS();
        this._ensureBackgroundStyle();
        this._replaceLogoWithStaticImage();
        this.scheduleOnce(() => {
            this._enhanceLoginUI();
        }, 0.1);
    },

    _replaceLogoWithStaticImage() {
        let spineNode = cc.find("LayerView/PanelWeb/LayerBG/spine", this.node);
        if (!spineNode) {
            spineNode = cc.find("LayerView/LayerBG/spine", this.node);
        }
        if (!spineNode) {
            let layerView = this.node.getChildByName("LayerView");
            if (layerView) {
                let panelWeb = layerView.getChildByName("PanelWeb");
                if (panelWeb) {
                    let children = panelWeb.children;
                    for (let i = 0; i < children.length; i++) {
                        let layerBG = children[i].getChildByName("spine");
                        if (layerBG) {
                            spineNode = layerBG;
                            break;
                        }
                        let found = children[i].getChildByName("spine");
                        if (found) {
                            spineNode = found;
                            break;
                        }
                    }
                }
            }
        }
        if (!spineNode && typeof sp !== 'undefined' && sp.Skeleton) {
            let allSpines = this.node.getComponentsInChildren(sp.Skeleton);
            if (allSpines && allSpines.length > 0) {
                spineNode = allSpines[0].node;
            }
        }
        if (!spineNode) {
            cc.warn("LoginScene._replaceLogoWithStaticImage: 未找到 spine logo 节点，将创建新节点");
            let bgLayer = cc.find("LayerView/PanelWeb/LayerBG", this.node)
                || cc.find("LayerView/LayerBG", this.node)
                || this.node;
            spineNode = new cc.Node("_static_logo_");
            bgLayer.addChild(spineNode, 50);
        }

        if (typeof sp !== 'undefined' && sp.Skeleton) {
            let skeleton = spineNode.getComponent(sp.Skeleton);
            if (skeleton) {
                skeleton.enabled = false;
            }
        }

        let sprite = spineNode.getComponent(cc.Sprite);
        if (!sprite) {
            sprite = spineNode.addComponent(cc.Sprite);
        }

        let sloganNode = this._findSloganNode(true);
        let sloganWorldPos = null;
        let sloganHeight = 0;
        if (sloganNode) {
            let sloganLabel = sloganNode.getComponent(cc.Label);
            sloganHeight = sloganNode.height || (sloganLabel ? sloganLabel.fontSize + 10 : 50);
            let worldPos = sloganNode.parent.convertToWorldSpaceAR(sloganNode.position);
            sloganWorldPos = worldPos;
        }

        this._loadLogoTexture((texture) => {
            if (texture) {
                this._applyLogoSprite(sprite, spineNode, texture, sloganWorldPos, sloganHeight);
            } else {
                cc.warn("LoginScene._replaceLogoWithStaticImage: 所有加载路径均失败，跳过 logo 替换");
            }
        });
    },

    _loadLogoTexture(callback) {
        let tried = 0;
        let totalTries = 0;
        let wrappers = [app.common, app.ClubViews, app.ClubLoginAssets, app.ClubAssets, app.LoginAssets].filter(Boolean);
        let paths = ["Texture/logo", "Texture/logo.jpg", "texture/logo", "texture/logo.jpg", "login/logo", "login/logo.jpg", "Texture/common/logo", "Texture/common/logo.png", "main-login/Texture/logo", "main-login/Texture/logo.jpg"];
        totalTries = wrappers.length * paths.length + 1;

        let tryNext = () => {
            if (tried >= totalTries) {
                callback(null);
                return;
            }
            if (tried < wrappers.length * paths.length) {
                let wIdx = Math.floor(tried / paths.length);
                let pIdx = tried % paths.length;
                let w = wrappers[wIdx];
                let p = paths[pIdx];
                tried++;
                try {
                    if (w && w.bundle && typeof w.bundle.load === 'function') {
                        w.bundle.load(p, cc.Texture2D, (err, tex) => {
                            if (!err && tex) {
                                callback(tex);
                            } else {
                                tryNext();
                            }
                        });
                    } else {
                        tryNext();
                    }
                } catch (e) {
                    tryNext();
                }
            } else {
                tried++;
                try {
                    cc.loader.loadRes("Texture/logo", cc.Texture2D, (err, tex) => {
                        if (!err && tex) {
                            callback(tex);
                        } else {
                            callback(null);
                        }
                    });
                } catch (e) {
                    callback(null);
                }
            }
        };
        tryNext();
    },

    _findSloganNode(autoCreate) {
        let allLabels = this.node.getComponentsInChildren(cc.Label);
        for (let i = 0; i < allLabels.length; i++) {
            let lbl = allLabels[i];
            let str = lbl.string || "";
            if (str.indexOf("安") !== -1 && str.indexOf("公") !== -1 && str.indexOf("明") !== -1) {
                return lbl.node;
            }
        }
        let result = cc.find("LayerView/PanelWeb/LayerBG/bg/New Label", this.node);
        if (!result) {
            result = cc.find("LayerView/LayerBG/bg/New Label", this.node);
        }
        if (!result && autoCreate) {
            let bgLayer = cc.find("LayerView/PanelWeb/LayerBG", this.node)
                || cc.find("LayerView/LayerBG", this.node)
                || this.node;
            let slogan = new cc.Node("_slogan_auto_");
            let lbl = slogan.addComponent(cc.Label);
            lbl.string = "- 安全 · 公平 · 透明 -";
            lbl.fontSize = 36;
            lbl.lineHeight = 44;
            lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            slogan.color = cc.color(220, 235, 255, 235);
            slogan.setAnchorPoint(0.5, 0.5);
            slogan.setPosition(0, 250);
            bgLayer.addChild(slogan, 60);
            result = slogan;
        }
        return result;
    },

    _applyLogoSprite(sprite, node, texture, sloganWorldPos, sloganHeight) {
        if (!cc.isValid(sprite) || !cc.isValid(node)) {
            return;
        }
        sprite.spriteFrame = new cc.SpriteFrame(texture);
        sprite.type = cc.Sprite.Type.SIMPLE;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;

        let texW = texture.width;
        let texH = texture.height;
        let maxW = 420;
        let maxH = 420;
        let scale = Math.min(maxW / texW, maxH / texH, 1);
        let logoW = texW * scale;
        let logoH = texH * scale;
        node.width = logoW;
        node.height = logoH;

        let targetY = 520;
        if (sloganWorldPos) {
            let sloganTopWorldY = sloganWorldPos.y + sloganHeight * 0.5;
            let gap = 130;
            let logoCenterWorldY = sloganTopWorldY + gap + logoH * 0.5;
            let worldPos = cc.v2(sloganWorldPos.x, logoCenterWorldY);
            if (node.parent) {
                let localPos = node.parent.convertToNodeSpaceAR(worldPos);
                targetY = localPos.y;
                node.setPosition(localPos.x, targetY);
            } else {
                node.setPosition(0, targetY);
            }
        } else {
            node.setPosition(0, targetY);
        }

        node.anchorX = 0.5;
        node.anchorY = 0.5;

        this._logoNode = node;
        this._logoHeight = logoH;
        this._logoWorldPos = node.parent ? node.parent.convertToWorldSpaceAR(node.position) : cc.v2(0, targetY);
        if (typeof this._enhanceLoginUI === 'function') {
            this.scheduleOnce(() => { this._enhanceLoginUI(15); }, 0.05);
        }
    },

    _enhanceLoginUI(retryCount) {
        retryCount = retryCount || 0;
        const maxRetries = 15;
        this._addHashPokerTitle();
        this._beautifySlogan();
        let hasSlogan = !!this._findSloganNode();
        let hasLogo = !!this._logoNode;
        if ((!hasSlogan || !hasLogo) && retryCount < maxRetries) {
            cc.warn(`LoginScene._enhanceLoginUI: 第 ${retryCount + 1} 次重试，hasSlogan=${hasSlogan}, hasLogo=${hasLogo}`);
            this.scheduleOnce(() => {
                this._enhanceLoginUI(retryCount + 1);
            }, 0.3);
            return;
        }
        this._fixBadgeTitleSloganPositions();
    },

    _fixBadgeTitleSloganPositions() {
        try {
            let bgLayer = cc.find("LayerView/PanelWeb/LayerBG", this.node)
                || cc.find("LayerView/LayerBG", this.node)
                || this.node;
            if (!bgLayer) return;
            let layerH = bgLayer.height || 1920;

            let badgeY = Math.floor(layerH * 0.275);
            let titleY = badgeY - 270;
            let sloganY = titleY - 180;

            let spine = bgLayer.getChildByName("spine");
            if (!spine) {
                let allNodes = this.node.getComponentsInChildren(cc.Node);
                for (let ni = 0; ni < allNodes.length; ni++) {
                    if (allNodes[ni].name === "spine") { spine = allNodes[ni]; break; }
                }
            }
            if (spine) {
                let spW = spine.getComponent(cc.Widget);
                if (spW) { spW.enabled = false; if (spW.updateAlignment) spW.updateAlignment(); }
                spine.x = 0;
                spine.y = badgeY;
                try { spine.scaleX = 0; spine.scaleY = 0; } catch (e) {}
                try { spine.opacity = 0; } catch (e) {}
                try { spine.setContentSize(0, 0); } catch (e) {}
                try { spine.setAnchorPoint(0.5, 0.5); } catch (e) {}
            }

            let hpBadgeNode = bgLayer.getChildByName("_hp_badge_sep_");
            if (hpBadgeNode) {
                let bw = hpBadgeNode.getComponent(cc.Widget);
                if (bw) { bw.enabled = false; if (bw.updateAlignment) bw.updateAlignment(); }
                if (hpBadgeNode.parent !== bgLayer) { try { hpBadgeNode.removeFromParent(false); bgLayer.addChild(hpBadgeNode, 70); } catch (e) {} }
                hpBadgeNode.x = 0;
                hpBadgeNode.y = badgeY;
                hpBadgeNode.setAnchorPoint(0.5, 0.5);
                if (hpBadgeNode.width < 300) hpBadgeNode.width = 460;
                if (hpBadgeNode.height < 300) hpBadgeNode.height = 460;
                hpBadgeNode.scaleX = 1; hpBadgeNode.scaleY = 1;
                hpBadgeNode.opacity = 255;
                try { hpBadgeNode.color = cc.color(255, 255, 255, 255); } catch (e) {}
                try {
                    let bad = hpBadgeNode.getComponent(cc.Sprite);
                    if (bad) {
                        if (bad.spriteFrame) bad.spriteFrame = null;
                        bad.enabled = false;
                    }
                } catch (e) {}
                if (!this._logoNode || this._logoNode !== hpBadgeNode) {
                    this._logoNode = hpBadgeNode;
                    this._logoHeight = hpBadgeNode.height || 460;
                    this._logoWorldPos = hpBadgeNode.parent
                        ? hpBadgeNode.parent.convertToWorldSpaceAR(hpBadgeNode.position)
                        : cc.v2(0, hpBadgeNode.y);
                }
            }

            let titleNodeName = "_hash_poker_title_";
            let title = bgLayer.getChildByName(titleNodeName);
            if (!title) {
                let allTitles = this.node.getComponentsInChildren(cc.Label);
                for (let ti = 0; ti < allTitles.length; ti++) {
                    if (allTitles[ti].string && allTitles[ti].string.indexOf("HASH POKER") !== -1) {
                        title = allTitles[ti].node;
                        break;
                    }
                }
            }
            if (title) {
                let tiW = title.getComponent(cc.Widget);
                if (tiW) { tiW.enabled = false; if (tiW.updateAlignment) tiW.updateAlignment(); }
                if (title.parent !== bgLayer) { title.removeFromParent(false); bgLayer.addChild(title, 90); }
                title.x = 0;
                title.y = titleY;
                title.opacity = 255;
                let tl = title.getComponent(cc.Label);
                if (tl) {
                    tl.fontSize = 92;
                    tl.lineHeight = 112;
                    tl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                    tl.string = "HASH POKER";
                    tl.fontFamily = "Arial Black, Arial, sans-serif";
                    tl.enableWrapText = false;
                }
                let tOutline = title.getComponent(cc.LabelOutline);
                if (!tOutline) {
                    tOutline = title.addComponent(cc.LabelOutline);
                    tOutline.color = cc.color(120, 80, 30, 220);
                    tOutline.width = 4;
                } else {
                    tOutline.color = cc.color(120, 80, 30, 220);
                    tOutline.width = 4;
                }
            }

            let slogan = this._findSloganNode();
            if (slogan) {
                let slW = slogan.getComponent(cc.Widget);
                if (slW) { slW.enabled = false; if (slW.updateAlignment) slW.updateAlignment(); }
                if (slogan.parent !== bgLayer) { slogan.removeFromParent(false); bgLayer.addChild(slogan, 95); }
                slogan.x = 0;
                slogan.y = sloganY;
                slogan.opacity = 255;
                let sl = slogan.getComponent(cc.Label);
                if (sl) {
                    sl.string = "— 安 全 · 公 平 · 透 明 —";
                    sl.fontSize = 54;
                    sl.lineHeight = 64;
                    sl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                    sl.color = cc.color(215, 235, 255, 245);
                    sl.enableWrapText = false;
                }
                let slOutline = slogan.getComponent(cc.LabelOutline);
                if (!slOutline) {
                    slOutline = slogan.addComponent(cc.LabelOutline);
                    slOutline.color = cc.color(20, 35, 80, 200);
                    slOutline.width = 2.5;
                } else {
                    slOutline.color = cc.color(20, 35, 80, 200);
                    slOutline.width = 2.5;
                }
            }

            let panelWeb = cc.find("LayerView/PanelWeb", this.node)
                || cc.find("LayerView", this.node).getChildByName("PanelWeb");
            if (panelWeb) {
                let panelNode = panelWeb.getChildByName("panel");
                if (panelNode) {
                    if (this.isTgPlatformsCheck()) {
                        panelNode.active = false;
                        const pLogin2 = panelNode.getChildByName("panel_login");
                        const pReg2 = panelNode.getChildByName("panel_reg");
                        const pTg2 = panelNode.getChildByName("telegram_login");
                        if (pLogin2) pLogin2.active = false;
                        if (pReg2) pReg2.active = false;
                        if (pTg2) pTg2.active = false;
                        this.scheduleOnce(() => this._ensureTgPanelHidden(), 0.25);
                    } else {
                        let pW = panelNode.getComponent(cc.Widget);
                        if (pW) { pW.enabled = false; if (pW.updateAlignment) pW.updateAlignment(); }
                        for (let ci = 0; ci < panelNode.childrenCount; ci++) {
                            let ch = panelNode.children[ci];
                            let chw = ch.getComponent(cc.Widget);
                            if (chw) { chw.enabled = false; if (chw.updateAlignment) chw.updateAlignment(); }
                            if (ch.name === "bg" && (ch.width >= 400 || ch.height >= 300)) {
                                let csp = ch.getComponent && ch.getComponent(cc.Sprite);
                                if (csp) {
                                    if (csp.spriteFrame) csp.spriteFrame = null;
                                    csp.enabled = false;
                                }
                                ch.opacity = 0;
                                ch.color = cc.color(255, 255, 255, 0);
                            }
                        }
                        let pLogin = panelNode.getChildByName("panel_login");
                        let pReg = panelNode.getChildByName("panel_reg");
                        let pTg = panelNode.getChildByName("telegram_login");
                        if (pLogin) { pLogin.active = true; pLogin.opacity = 255; }
                        if (pReg) { pReg.active = false; pReg.opacity = 255; }
                        if (pTg) { pTg.active = false; pTg.opacity = 255; }
                        let pSel = panelNode.getChildByName("panel_selectServer");
                        if (pSel) pSel.active = true;
                        panelNode.opacity = 255;
                        panelNode.active = true;
                        panelNode.y = sloganY - 240;
                    }
                }
            }

            if (panelWeb) {
                let protocolTip = panelWeb.getChildByName("protocol");
                if (!protocolTip) {
                    let allLabels = this.node.getComponentsInChildren(cc.Label);
                    for (let ti = 0; ti < allLabels.length; ti++) {
                        let st = allLabels[ti].string || "";
                        if (st.indexOf("正在连接") !== -1 || st.indexOf("连接服务器") !== -1 || st.indexOf("Connect") !== -1) {
                            protocolTip = allLabels[ti].node.parent;
                            break;
                        }
                    }
                }
                if (protocolTip) {
                    let tipW = protocolTip.getComponent(cc.Widget);
                    if (tipW) { tipW.enabled = false; if (tipW.updateAlignment) tipW.updateAlignment(); }
                    let layerH = (bgLayer && bgLayer.height) || 1920;
                    let canvas = cc.find("Canvas", this.node) || this.node;
                    let win = cc.view.getVisibleSize && cc.view.getVisibleSize();
                    let winH = (win && win.height) || cc.winSize && cc.winSize.height || layerH;
                    let targetParent = canvas || bgLayer;
                    if (protocolTip.parent !== targetParent) {
                        try {
                            protocolTip.removeFromParent(false);
                            targetParent.addChild(protocolTip, 260);
                        } catch (e) {}
                    }
                    protocolTip.setAnchorPoint(0.5, 0.5);
                    protocolTip.x = 0;
                    protocolTip.y = -Math.floor(winH * 0.428);
                    protocolTip.opacity = 245;
                    protocolTip.active = true;
                    if (protocolTip.width < 850) protocolTip.width = 900;
                    if (protocolTip.height < 70) protocolTip.height = 80;
                    for (let ci = 0; ci < protocolTip.childrenCount; ci++) {
                        let ch = protocolTip.children[ci];
                        let chw = ch.getComponent(cc.Widget);
                        if (chw) { chw.enabled = false; if (chw.updateAlignment) chw.updateAlignment(); }
                        ch.setAnchorPoint(0.5, 0.5);
                        ch.x = 0;
                        ch.y = 0;
                        if (ch.width < protocolTip.width - 60) ch.width = protocolTip.width - 60;
                        if (ch.height < protocolTip.height - 16) ch.height = protocolTip.height - 16;
                        let chlb = ch.getComponent(cc.Label);
                        if (chlb) {
                            chlb.fontSize = 40;
                            chlb.lineHeight = 52;
                            chlb.color = cc.color(220, 230, 255, 245);
                            chlb.enableWrapText = false;
                            chlb.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                            chlb.verticalAlign = cc.Label.VerticalAlign.CENTER;
                            chlb.overflow = cc.Label.Overflow.NONE;
                        }
                    }
                }
            }

            if (this.isTgPlatformsCheck()) {
                let allLabels2 = this.node.getComponentsInChildren(cc.Label);
                for (let li = 0; li < allLabels2.length; li++) {
                    const lb = allLabels2[li];
                    const st = lb.string || "";
                    if (st.indexOf("切换登录") !== -1) {
                        lb.node.active = false;
                        let walkBtn = lb.node;
                        for (let up = 0; up < 6 && walkBtn && walkBtn.parent; up++) {
                            if (walkBtn.getComponent && walkBtn.getComponent(cc.Button)) {
                                walkBtn.active = false;
                                break;
                            }
                            walkBtn = walkBtn.parent;
                        }
                    }
                }
                let allBtns2 = this.node.getComponentsInChildren(cc.Button);
                for (let bi = 0; bi < allBtns2.length; bi++) {
                    const bInst = allBtns2[bi];
                    if (bInst.clickEvents && bInst.clickEvents.length > 0) {
                        for (let ci = 0; ci < bInst.clickEvents.length; ci++) {
                            const ce = bInst.clickEvents[ci];
                            if (ce && ce.handler && (ce.handler === "OnClickSwitchLogin" || ce.handler === "onClickSwitchLogin" || ce.handler.indexOf("SwitchLogin") !== -1)) {
                                bInst.node.active = false;
                                break;
                            }
                        }
                    }
                }
            } else {
            let allLabels = this.node.getComponentsInChildren(cc.Label);
            let toggleLabelNode = null;
            for (let li = 0; li < allLabels.length; li++) {
                let lb = allLabels[li];
                let st = lb.string || "";
                if (st.indexOf("切换登录") !== -1) {
                    toggleLabelNode = lb.node;
                    break;
                }
            }
            let toggleBtn = null;
            if (toggleLabelNode) {
                toggleBtn = toggleLabelNode;
                for (let up = 0; up < 6 && toggleBtn && toggleBtn.parent; up++) {
                    if (toggleBtn.getComponent && toggleBtn.getComponent(cc.Button)) break;
                    toggleBtn = toggleBtn.parent;
                }
            }
            if (!toggleBtn || !toggleBtn.getComponent || !toggleBtn.getComponent(cc.Button)) {
                let allBtns = this.node.getComponentsInChildren(cc.Button);
                for (let bi = 0; bi < allBtns.length; bi++) {
                    let bInst = allBtns[bi];
                    if (bInst.clickEvents && bInst.clickEvents.length > 0) {
                        for (let ci = 0; ci < bInst.clickEvents.length; ci++) {
                            let ce = bInst.clickEvents[ci];
                            if (ce && ce.handler && (ce.handler === "OnClickSwitchLogin" || ce.handler === "onClickSwitchLogin" || ce.handler.indexOf("SwitchLogin") !== -1)) {
                                toggleBtn = bInst.node;
                                break;
                            }
                        }
                        if (toggleBtn) break;
                    }
                }
            }
            if (toggleBtn) {
                let foundLabelInside = null;
                let walkLabel = function (n, d, m, out) {
                    if (!n || d > m) return;
                    let lb = n.getComponent && n.getComponent(cc.Label);
                    if (lb && (lb.string || "").indexOf("切换登录") !== -1) {
                        out.label = lb.node;
                        return;
                    }
                    if (n.childrenCount > 0) for (let i = 0; i < n.childrenCount && !out.label; i++) walkLabel(n.children[i], d + 1, m, out);
                };
                let out = { label: null };
                walkLabel(toggleBtn, 0, 4, out);
                foundLabelInside = out.label;
                if (!foundLabelInside && toggleLabelNode) {
                    if (toggleLabelNode.parent !== toggleBtn) {
                        try {
                            toggleLabelNode.removeFromParent(false);
                            toggleBtn.addChild(toggleLabelNode, 1);
                        } catch (e) {}
                    }
                    foundLabelInside = toggleLabelNode;
                }
                if (toggleBtn.parent !== bgLayer) {
                    try {
                        toggleBtn.removeFromParent(false);
                        bgLayer.addChild(toggleBtn, 100);
                    } catch (e) {}
                }
                let tgW = toggleBtn.getComponent(cc.Widget);
                if (tgW) { tgW.enabled = false; if (tgW.updateAlignment) tgW.updateAlignment(); }
                toggleBtn.x = 0;
                toggleBtn.y = Math.floor(layerH * 0.44);
                if (toggleBtn.width < 260) toggleBtn.width = 260;
                if (toggleBtn.height < 90) toggleBtn.height = 90;
                toggleBtn.opacity = 255;
                toggleBtn.active = true;
                let tgBtnComp = toggleBtn.getComponent(cc.Button);
                if (tgBtnComp) {
                    tgBtnComp.interactable = true;
                    if (tgBtnComp._touchEnabled === false) tgBtnComp._touchEnabled = true;
                }
                if (foundLabelInside) {
                    let tgLw = foundLabelInside.getComponent(cc.Widget);
                    if (tgLw) { tgLw.enabled = false; if (tgLw.updateAlignment) tgLw.updateAlignment(); }
                    foundLabelInside.x = 0;
                    foundLabelInside.y = 0;
                    if (foundLabelInside.width < 240) foundLabelInside.width = 240;
                    if (foundLabelInside.height < 76) foundLabelInside.height = 76;
                    foundLabelInside.opacity = 255;
                    foundLabelInside.active = true;
                    let tgL = foundLabelInside.getComponent(cc.Label);
                    if (tgL) {
                        tgL.fontSize = 50;
                        tgL.lineHeight = 60;
                        tgL.enableWrapText = false;
                        tgL.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                        tgL.verticalAlign = cc.Label.VerticalAlign.CENTER;
                        tgL.color = cc.color(255, 255, 255, 255);
                    }
                }
            }
            }

            cc.log("_fixBadgeTitleSloganPositions: 布局位置已修正 badgeY=", badgeY, "titleY=", titleY, "sloganY=", sloganY);
        } catch (e) {
            cc.warn("_fixBadgeTitleSloganPositions failed:", e && e.message);
        }
    },

    _addHashPokerTitle() {
        let bgLayer = cc.find("LayerView/PanelWeb/LayerBG", this.node)
            || cc.find("LayerView/LayerBG", this.node)
            || this.node;
        let titleNodeName = "_hash_poker_title_";
        let existing = bgLayer.getChildByName(titleNodeName);
        if (!existing) {
            let allNodes = this.node.getComponentsInChildren(cc.Label);
            for (let ti = 0; ti < allNodes.length; ti++) {
                let str = allNodes[ti].string || "";
                if (str.indexOf("HASH POKER") !== -1) {
                    existing = allNodes[ti].node;
                    break;
                }
            }
        }

        if (existing) {
            let tl = existing.getComponent(cc.Label);
            if (tl) {
                tl.string = "HASH POKER";
                tl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                tl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            }
            existing.color = cc.color(232, 199, 106, 255);
            existing.setAnchorPoint(0.5, 0.5);
            if (existing.parent !== bgLayer) {
                existing.removeFromParent(false);
                bgLayer.addChild(existing, 80);
            }
            this._addGlowToNode(existing, cc.color(232, 199, 106, 180), 16, 0.025);
            return;
        }

        let sloganNode = this._findSloganNode(true);
        let titleNode = new cc.Node(titleNodeName);
        let titleLabel = titleNode.addComponent(cc.Label);
        titleLabel.string = "HASH POKER";
        titleLabel.fontSize = 56;
        titleLabel.lineHeight = 66;
        titleLabel.fontFamily = "Arial, Helvetica, sans-serif";
        titleLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        titleLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;

        let color = cc.color(232, 199, 106, 255);
        titleLabel.node.color = color;
        titleLabel.node.setAnchorPoint(0.5, 0.5);

        let titleWorldPos = null;
        if (sloganNode) {
            let sloganWorldPos = sloganNode.parent.convertToWorldSpaceAR(sloganNode.position);
            let sloganTopY = sloganWorldPos.y + (sloganNode.height || 50) * 0.5;
            if (this._logoWorldPos) {
                let logoBottomY = this._logoWorldPos.y - (this._logoHeight || 420) * 0.5;
                let midY = (logoBottomY + sloganTopY) * 0.5;
                titleWorldPos = cc.v2(sloganWorldPos.x, midY);
            } else {
                titleWorldPos = cc.v2(sloganWorldPos.x, sloganTopY + 80);
            }
            let localPos = bgLayer.convertToNodeSpaceAR(titleWorldPos);
            titleNode.setPosition(localPos);
        } else {
            titleNode.setPosition(0, 0);
        }
        bgLayer.addChild(titleNode, 80);

        this._addGlowToNode(titleNode, cc.color(232, 199, 106, 180), 16, 0.025);
    },

    _beautifySlogan() {
        let sloganNode = this._findSloganNode(true);
        if (!sloganNode) {
            return;
        }
        let label = sloganNode.getComponent(cc.Label);
        if (!label) {
            label = sloganNode.addComponent(cc.Label);
            label.string = "- 安全 · 公平 · 透明 -";
        }

        label.node.color = cc.color(220, 235, 255, 235);
        label.fontSize = Math.max(label.fontSize || 0, 36);
        label.lineHeight = Math.max(label.lineHeight || 0, 44);
        this._addGlowToNode(sloganNode, cc.color(120, 180, 255, 150), 14, 0.02);
    },

    _addGlowToNode(targetNode, glowColor, blurPx, stepSec) {
        if (!targetNode) return;

        let baseColor = targetNode.color;
        let t = 0;
        targetNode.on(cc.Node.EventType.UPDATE, (dt) => {
            t += dt;
            let pulse = 0.55 + 0.45 * Math.sin(t * (Math.PI * 2) * (stepSec ? 1 / stepSec : 1));
        }, targetNode);

        targetNode.color = cc.color(
            Math.min(255, baseColor.r + Math.floor(glowColor.r * 0.1)),
            Math.min(255, baseColor.g + Math.floor(glowColor.g * 0.1)),
            Math.min(255, baseColor.b + Math.floor(glowColor.b * 0.1)),
            baseColor.a
        );
    },

    _ensureBackgroundStyle() {
        try {
            let scene = cc.director.getScene();
            let canvas = scene ? scene.getChildByName('Canvas') : null;
            if (!canvas) canvas = this.node.getChildByName('Canvas') || this.node;

            let bgName = '_tech_fullscreen_bg_';
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

            let oldBg = cc.find("LayerView/PanelWeb/LayerBG/bg", this.node)
                || cc.find("LayerView/LayerBG/bg", this.node);
            if (oldBg) {
                let spr = oldBg.getComponent(cc.Sprite);
                if (spr) { spr.spriteFrame = null; spr.enabled = false; }
                oldBg.opacity = 0;
            }

            this._drawTechFullscreenBackground(techBg, W, H);
        } catch (e) {
            cc.warn("_ensureBackgroundStyle fallback:", e && e.message);
        }

        this._drawGoldHPBadge();
    },

    _drawTechFullscreenBackground(bgNode, W, H) {
        if (!bgNode || !cc.isValid(bgNode)) return;
        try {
            let g = bgNode.addComponent(cc.Graphics);
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

            cc.log("_drawTechFullscreenBackground: 科技风登录页背景绘制完成", W, "x", H);
        } catch (e) {
            cc.warn("_drawTechFullscreenBackground failed:", e && e.message);
        }
    },

    _drawTechBackgroundOnBg(sprite) {
        if (!sprite || !cc.isValid(sprite.node)) return;
        let W = cc.winSize.width, H = cc.winSize.height;
        this._drawTechFullscreenBackground(sprite.node, W, H);
    },

    _injectTechBackgroundCSS() {
        // 移除 CSS 注入方案，避免模拟器外壳变白。改用 Cocos 场景绘制。
        if (typeof document === 'undefined' || !document.getElementById) return;
        try {
            let old1 = document.getElementById('_hashpoker_tech_bg_');
            if (old1) old1.parentNode.removeChild(old1);
            let old2 = document.getElementById('_hashpoker_tech_bg_v2_');
            if (old2) old2.parentNode.removeChild(old2);
            let old3 = document.getElementById('_tech_bg_style_');
            if (old3) old3.parentNode.removeChild(old3);
        } catch (e) {}
    },

    _drawGoldHPBadge() {
        let spineNode = cc.find("LayerView/PanelWeb/LayerBG/spine", this.node)
            || cc.find("LayerView/LayerBG/spine", this.node);
        if (!spineNode) return;

        try {
        let badgeAnchorY = null;
        let badgeParent = null;
        try {
            badgeAnchorY = spineNode.y;
            badgeParent = spineNode.parent;
        } catch (e) {}

        try {
            try { spineNode.scaleX = 0; } catch (e) {}
            try { spineNode.scaleY = 0; } catch (e) {}
            try { spineNode.opacity = 0; } catch (e) {}
            try { spineNode.setContentSize(0, 0); } catch (e) {}
            for (let cci = 0; cci < spineNode.childrenCount; cci++) {
                let ch = spineNode.children[cci];
                try { ch.scaleX = 0; } catch (e) {}
                try { ch.scaleY = 0; } catch (e) {}
                try { ch.opacity = 0; } catch (e) {}
                try { ch.setContentSize(0, 0); } catch (e) {}
                try { ch.color = cc.color(255, 255, 255, 0); } catch (e) {}
                let chw = ch.getComponent && ch.getComponent(cc.Widget);
                if (chw) chw.enabled = false;
                let chSpr = ch.getComponent && ch.getComponent(cc.Sprite);
                if (chSpr) {
                    try { if (chSpr.spriteFrame) chSpr.spriteFrame = null; } catch (e) {}
                    chSpr.enabled = false;
                    try { if (typeof chSpr.destroy === 'function') chSpr.destroy(); } catch (e) {}
                }
                if (typeof sp !== 'undefined' && sp.Skeleton) {
                    let chSk = ch.getComponent && ch.getComponent(sp.Skeleton);
                    if (chSk) {
                        chSk.enabled = false;
                        try { ch.removeComponent(chSk); } catch (e) {}
                        try { if (typeof chSk.destroy === 'function') chSk.destroy(); } catch (e) {}
                    }
                }
            }
        } catch (e) {}

        try {
            if (spineNode._components && Array.isArray(spineNode._components)) {
                let kept = [];
                for (let ci = 0; ci < spineNode._components.length; ci++) {
                    let comp = spineNode._components[ci];
                    if (!comp) { kept.push(comp); continue; }
                    let isBadSp = comp instanceof cc.Sprite;
                    let isBadSk = (typeof sp !== 'undefined' && sp.Skeleton) && comp instanceof sp.Skeleton;
                    if (!isBadSp && !isBadSk) { kept.push(comp); continue; }
                    try {
                        if (comp.spriteFrame) comp.spriteFrame = null;
                        if (comp.enabled !== undefined) comp.enabled = false;
                        if (typeof comp.destroy === 'function') comp.destroy();
                    } catch (e) {}
                }
                spineNode._components = kept;
            }
        } catch (e) {}

        try {
            let delTries = 0;
            while (delTries < 18 && spineNode.getComponent(cc.Sprite)) {
                try {
                    let toDel = spineNode.getComponent(cc.Sprite);
                    try { if (toDel.spriteFrame) toDel.spriteFrame = null; } catch (e) {}
                    try { toDel.enabled = false; } catch (e) {}
                    spineNode.removeComponent(toDel);
                    try { if (typeof toDel.destroy === 'function') toDel.destroy(); } catch (e) {}
                } catch (e) { break; }
                delTries++;
            }
            if (typeof sp !== 'undefined' && sp.Skeleton) {
                let skTries = 0;
                while (skTries < 16 && spineNode.getComponent(sp.Skeleton)) {
                    try {
                        let sk = spineNode.getComponent(sp.Skeleton);
                        try { sk.enabled = false; } catch (e) {}
                        spineNode.removeComponent(sk);
                        try { if (typeof sk.destroy === 'function') sk.destroy(); } catch (e) {}
                    } catch (e) {
                        let sk2 = spineNode.getComponent(sp.Skeleton);
                        if (sk2) try { sk2.enabled = false; } catch (e2) {}
                        break;
                    }
                    skTries++;
                }
            }
            spineNode._sprite = null;
            try { spineNode.color = cc.color(255, 255, 255, 0); } catch (e) {}
        } catch (e) {}

        try {
            let parents = [];
            let p = spineNode.parent;
            while (p) {
                parents.unshift(p);
                if (p.name === 'Canvas') break;
                p = p.parent;
            }
            for (let pi = 0; pi < parents.length; pi++) {
                let an = parents[pi];
                let aSpr = an.getComponent && an.getComponent(cc.Sprite);
                if (aSpr) {
                    let nm = an.name;
                    let isBad = nm === 'bg' || nm === 'fssfd' || nm === 'gfj' || nm === 'gfj1' || nm === 'logo' || nm === 'outerBg' || nm === 'outerbg' || nm === 'new sprite' || nm === 'New Sprite' || nm === 'login_frame';
                    let col = an.color || cc.color(255,255,255,255);
                    let whiteish = (col.r >= 230 && col.g >= 230 && col.b >= 230);
                    let big = (an.width >= 200 && an.height >= 200) || (an._contentSize && an._contentSize.width >= 200 && an._contentSize.height >= 200);
                    if (isBad || whiteish || big) {
                        try { if (aSpr.spriteFrame) aSpr.spriteFrame = null; } catch (e) {}
                        aSpr.enabled = false;
                        try { an.opacity = 0; } catch (e) {}
                        try { an.color = cc.color(255,255,255,0); } catch (e) {}
                        try { if (typeof aSpr.destroy === 'function') aSpr.destroy(); } catch (e) {}
                    }
                }
            }
        } catch (e) {}

        let bgLayer = cc.find("LayerView/PanelWeb/LayerBG", this.node)
            || cc.find("LayerView/LayerBG", this.node)
            || this.node;
        let walk = function (n, dep, maxD, out) {
            if (!n || dep > maxD) return;
            out.push(n);
            if (n.children && n.childrenCount > 0) {
                for (let i = 0; i < n.childrenCount; i++) walk(n.children[i], dep + 1, maxD, out);
            }
        };
        let allL = [];
        walk(bgLayer, 0, 10, allL);
        let layerH = (bgLayer && bgLayer.height) || 1920;
        let badgeTopY = layerH * 0.10;
        let badgeBotY = layerH * 0.46;
        for (let di = 0; di < allL.length; di++) {
            let n = allL[di];
            if (n === spineNode) continue;
            if (n === bgLayer || n.name === "LayerBG" || n.name === "Canvas" || n.name === "_tech_fullscreen_bg_" || n.name === "_hash_poker_title_" || n.name === "btn_toggle" || n.name === "toggleBtn") continue;
            let sp = n.getComponent && n.getComponent(cc.Sprite);
            if (!sp) continue;
            let w = n.width, h = n.height;
            if (w < 120 && h < 120) continue;
            if (n.y < badgeTopY || n.y > badgeBotY) continue;
            if (n.parent) {
                let pp = n.parent.name;
                if (pp === "_logo_hp_text_" || pp === "_logo_suits_" || pp === "_hash_poker_title_" || pp === "btn_toggle") continue;
            }
            let sf = sp.spriteFrame ? sp.spriteFrame.name : null;
            let nm = (n.name || "").toLowerCase();
            let badName = (nm === "logo" || nm === "gfj" || nm === "gfj1" || nm === "fssfd" || nm === "login_frame" || nm === "login_itembg" || nm === "login_itembg1" || nm === "login_itembg2" || nm === "login_itembg3" || nm === "bg" || nm === "outerbg" || nm === "lightish" || nm === "new sprite" || nm === "sprite");
            let badSf = (sf === "gfj" || (sf && sf.indexOf("gfj1") !== -1) || sf === "fssfd" || (sf && sf.indexOf("fssfd") !== -1) || sf === "logo" || sf === "login_frame" || sf === "login_itemBg3" || sf === "login_itemBg1" || sf === "login_itemBg2" || sf === "New Sprite");
            let col = n.color || cc.color(255,255,255,255);
            let whiteish = (col.r >= 230 && col.g >= 230 && col.b >= 230);
            let lightish = (col.r >= 210 && col.g >= 210 && col.b >= 210);
            let big = (w >= 200 && h >= 200);
            if (badName || badSf || whiteish || lightish || big) {
                try { if (sp.spriteFrame) sp.spriteFrame = null; } catch (e) {}
                try { sp.enabled = false; } catch (e) {}
                try { n.opacity = 0; } catch (e) {}
                try { n.color = cc.color(255,255,255,0); } catch (e) {}
                try { if (typeof sp.destroy === 'function') sp.destroy(); } catch (e) {}
            }
        }
        if (bgLayer) {
            let outerBg = bgLayer.getChildByName("bg");
            if (outerBg) {
                    let osp = outerBg.getComponent && outerBg.getComponent(cc.Sprite);
                    if (osp) {
                        if (osp.spriteFrame) osp.spriteFrame = null;
                        osp.enabled = false;
                    }
                    outerBg.color = cc.color(255, 255, 255, 0);
                    outerBg.opacity = 0;
                    for (let oi = outerBg.childrenCount - 1; oi >= 0; oi--) {
                        try {
                            let och = outerBg.children[oi];
                            let ocsp = och.getComponent && och.getComponent(cc.Sprite);
                            if (ocsp) {
                                if (ocsp.spriteFrame) ocsp.spriteFrame = null;
                                ocsp.enabled = false;
                            }
                            och.opacity = 0;
                            och.destroy();
                        } catch (e) {}
                    }
                }
            for (let ci = spineNode.childrenCount - 1; ci >= 0; ci--) {
                let ch = spineNode.children[ci];
                if (ch.name !== "_logo_hp_text_" && ch.name !== "_hp_text_" && ch.name !== "_logo_suits_" && ch.name !== "_suits_") {
                    let csp = ch.getComponent && ch.getComponent(cc.Sprite);
                    if (csp) {
                        if (csp.spriteFrame) csp.spriteFrame = null;
                        csp.enabled = false;
                        ch.opacity = 0;
                    }
                    let csk = (typeof sp !== "undefined" && sp.Skeleton) ? ch.getComponent(sp.Skeleton) : null;
                    if (csk) csk.enabled = false;
                    let cgfx = ch.getComponent(cc.Graphics);
                    if (cgfx) { cgfx.clear(); ch.removeComponent(cgfx); }
                }
            }

        }
            let oldGfx = spineNode.getComponent(cc.Graphics);
            if (oldGfx) { oldGfx.clear(); spineNode.removeComponent(oldGfx); }

            let badgeParentForNode = badgeParent || bgLayer || spineNode.parent;
            let badgeTargetY = badgeAnchorY == null ? Math.floor(((bgLayer && bgLayer.height) || 1920) * 0.275) : badgeAnchorY;

            let hpBadgeSeparate = cc.find("_hp_badge_sep_", badgeParentForNode);
            if (!hpBadgeSeparate) {
                hpBadgeSeparate = new cc.Node("_hp_badge_sep_");
            }
            try {
                if (hpBadgeSeparate.parent !== badgeParentForNode) {
                    try { hpBadgeSeparate.removeFromParent(false); } catch (e) {}
                    try { badgeParentForNode.addChild(hpBadgeSeparate, 70); } catch (e) {}
                }
            } catch (e) {}

            hpBadgeSeparate.setAnchorPoint(0.5, 0.5);
            hpBadgeSeparate.x = 0;
            hpBadgeSeparate.y = badgeTargetY;
            hpBadgeSeparate.width = 460;
            hpBadgeSeparate.height = 460;
            hpBadgeSeparate.scaleX = 1; hpBadgeSeparate.scaleY = 1;
            hpBadgeSeparate.opacity = 255;
            hpBadgeSeparate.color = cc.color(255, 255, 255, 255);

            let oldBG = hpBadgeSeparate.getComponent(cc.Graphics);
            if (oldBG) { oldBG.clear(); hpBadgeSeparate.removeComponent(oldBG); }
            let oldSp = hpBadgeSeparate.getComponent(cc.Sprite);
            while (oldSp) {
                try { if (oldSp.spriteFrame) oldSp.spriteFrame = null; oldSp.enabled = false; hpBadgeSeparate.removeComponent(oldSp); } catch (e) { break; }
                oldSp = hpBadgeSeparate.getComponent(cc.Sprite);
            }

            let R = 218;
            let g = null;

            let hp = spineNode.getChildByName("_logo_hp_text_");
            if (hp) hp.destroy();
            hp = new cc.Node("_logo_hp_text_");
            hp.width = 280;
            hp.height = 230;
            let lbl = hp.addComponent(cc.Label);
            lbl.string = "HP";
            lbl.fontSize = 196;
            lbl.lineHeight = 196;
            lbl.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
            lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            lbl.enableBold = true;
            lbl.enableWrapText = false;
            hp.color = cc.color(245, 215, 125, 255);
            hp.setAnchorPoint(0.5, 0.5);
            hp.setPosition(0, 18);
            let hpOl = hp.addComponent(cc.LabelOutline);
            hpOl.color = cc.color(140, 95, 25, 200);
            hpOl.width = 5.2;
            hpBadgeSeparate.addChild(hp, 10);

            let suits = hpBadgeSeparate.getChildByName("_logo_suits_");
            if (suits) suits.destroy();
            suits = new cc.Node("_logo_suits_");
            suits.width = 350;
            suits.height = 70;
            suits.setAnchorPoint(0.5, 0.5);
            suits.setPosition(0, -126);

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

            hpBadgeSeparate.addChild(suits, 10);

            this._logoNode = hpBadgeSeparate;
            this._logoHeight = hpBadgeSeparate.height || 460;
            this._logoWorldPos = hpBadgeSeparate.parent
                ? hpBadgeSeparate.parent.convertToWorldSpaceAR(hpBadgeSeparate.position)
                : cc.v2(0, hpBadgeSeparate.y);
            cc.log("LoginScene._drawGoldHPBadge: 金色圆形 HP 徽章已绘制");
            if (typeof this._fixBadgeTitleSloganPositions === "function") {
                this.scheduleOnce(() => { this._fixBadgeTitleSloganPositions(); }, 0.2);
            }
        } catch (e) {
            cc.warn("LoginScene._drawGoldHPBadge: 绘制失败", e && e.message);
        }
    },

    _loadLoginBackground(callback) {
        let wrappers = [app.ClubViews, app.common, app.ClubLoginAssets, app.ClubAssets, app.LoginAssets].filter(Boolean);
        let paths = [
            "main-login/Texture/skin_a/login/ui/login",
            "main-login/Texture/skin_a/login/ui/login.jpg",
            "Texture/skin_a/login/ui/login",
            "Texture/skin_a/login/ui/login.jpg",
            "texture/skin_a/login/ui/login",
            "texture/skin_a/login/ui/login.jpg",
            "login/ui/login",
            "login/ui/login.jpg",
            "Texture/login",
            "Texture/login.jpg"
        ];
        let total = wrappers.length * paths.length;
        let tried = 0;
        let done = false;

        let tryNext = () => {
            if (done) return;
            if (tried >= total) {
                callback(null);
                return;
            }
            let wIdx = Math.floor(tried / paths.length);
            let pIdx = tried % paths.length;
            let w = wrappers[wIdx];
            let p = paths[pIdx];
            tried++;
            try {
                if (w && w.bundle && typeof w.bundle.load === 'function') {
                    w.bundle.load(p, cc.Texture2D, (err, tex) => {
                        if (!err && tex) {
                            done = true;
                            callback(tex);
                        } else {
                            tryNext();
                        }
                    });
                } else {
                    tryNext();
                }
            } catch (e) {
                tryNext();
            }
        };
        tryNext();
    },

    // update (dt) {},

    register() {
        target.on(event.HALL_LOGIN_SUCCESS, this._onLoginSuccess, this);
        my.net.on(my.NetworkEvent.OPEN, this._onWebsocketOpen, this);
        MsgManager.on(MSG.ACCOUNT.SUB_GP_BindQuerryRsp, this._onBindQuerry, this);
    },

    unRegister() {
        MsgManager.un(this._onLoginSuccess);
        MsgManager.un(this._onWebsocketOpen);
        MsgManager.un(this._onBindQuerry);
    },

    _init() {
        UserInfo.setInfo({
            nUserID: 0,
        })
        // ListSubGame.setSubGameID(-1);
        app.game.clearData();
        app.game.setGameID(-1);
        //主动断开，不重连
        app.net.disConnect(true);
        app.net.release();

        // //记住密码toggle组件
        // this.toggleRemember = this.panel_login.getChildByName("bottomNodes").getChildByName("toggle_remPassword").getComponent(cc.Toggle);
        // //自动登录toggle组件
        // this.toggleAutoLogin = this.panel_login.getChildByName("bottomNodes").getChildByName("toggle_autoLogin").getComponent(cc.Toggle);
        // //用户协议确定toggle组件
        // this.toggleProtocol = this.panel_reg.getChildByName("bottomNodes").getChildByName("toggle_protocol").getComponent(cc.Toggle);

        this._onLoginInitPanel();
        this._initLabel();
        this.initLoginType();
        let data = this.getCountry();
        this.setContryCode(data);
        this.initLocalSetting();
    },

    _initLabel() {
        this.label_create.lang = "LOGIN.CREATE_ACCOUNT";
        this.label_forgetPsw.lang = "LOGIN.FORGET_PASSWORD";
        // this.protocol.lang = "LOGIN.LOGIN_PROTOCOL";
        this.label_login.lang = "LOGIN.LOGIN";
        this.label_reg.lang = "CLUB_LOGIN.REGISTER";
        this.label_loginAccount.lang = "LOGIN.LOGIN_ACCOUNT";
        this.editLoginAccount.placeholder = i18n.t("CLUB_LOGIN.ACCOUNT_REG");
        this.editLoginAccountPsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editLoginPhone.placeholder = i18n.t("CLUB_LOGIN.INPUT_PHONE");
        this.editLoginPhonePsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editLoginMailbox.placeholder = i18n.t("CLUB_LOGIN.INPUT_MAILBOX");
        this.editLoginMailboxPsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editInvite.placeholder = i18n.t("LOGIN.INVITECODE_REG");

        // if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
        //     this.protocol.node.active = false;
        // }
    },

    //登录类型 1：手机 2：邮箱 3：账号
    initLoginType() {
        let lType = LocalStorage.getItem("CLUB_LOGIN_TYPE", "");
        if (lType != "") {
            this._loginType = Number(lType);
        }

        this.updateLoginType(this._loginType);
    },

    _onLoginInitPanel() {
        let showServerList = false;

        if (!app) {
            cc.error("LoginScene._onLoginInitPanel: app 对象未初始化");
            return;
        }
        const layerView = this.node.getChildByName("LayerView");
        const panelWeb = layerView ? layerView.getChildByName("PanelWeb") : null;
        const panelNode = panelWeb ? panelWeb.getChildByName("panel") : null;
        if (!panelNode) {
            cc.warn("LoginScene._onLoginInitPanel: 未找到 panel 节点，跳过面板初始化");
            this._ensureTgPanelHidden();
            return;
        }
        const pLogin = panelNode.getChildByName("panel_login");
        const pReg = panelNode.getChildByName("panel_reg");
        const pTg = panelNode.getChildByName("telegram_login");

        if (this.isTgPlatformsCheck()) {
            panelNode.active = false;
            if (pLogin) pLogin.active = false;
            if (pReg) pReg.active = false;
            if (pTg) pTg.active = false;
            this.scheduleOnce(() => this._ensureTgPanelHidden(), 0.2);
            return
        }

        showServerList = true;
        if (showServerList) {
            this.initServerList();
            if (this.toggle_selectServer && this.toggle_selectServer.node && this.toggle_selectServer.node.parent) {
                panelNode.active = true
                panelNode.getChildByName("btn_toggle").active = true
                this.toggle_selectServer.node.parent.active = true;
            }
        }

    },
    _addRollback() {
        //函数体不实现，则实际会触发 AppComponent 中的 _onRollback 
    },
    _removeRoolback() {

    },
    _onSubgameStart(data) {
        return false; //返回false，由NotifyHandler作默认处理
    },

    _onLoginSuccess(data) {
        // this.autoLoginBlock.active = false;

        //登录失败
        if (!data) {
            return;
        };
    },

    _checkPhoneDataValid(strName, strPWD) {
        if (!strName) {
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_PHONE"));
            return false;
        }

        if (strPWD.length < 6) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR3"));
            return false;
        }

        if (!strPWD) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW"));
            return false;
        }

        if (Utils.hasBlankCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW2"));
            return false;
        }


        if (Utils.judgePasswordCharacters(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW4"));
            return false;
        }

        if (Utils.hasEmojiCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW5"));
            return false;
        }

        LocalStorage.setItem("CLUB_LOGIN_TYPE", "1");
        LocalStorage.setItem("CLUB_PHONE_LOGINNAME", strName);
        LocalStorage.setItem("CLUB_PHONE_LOGINPSW", strPWD);

        return true;
    },

    _checkMailboxDataValid(strName, strPWD) {
        if (!strName) {
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_MAILBOX"));
            return false;
        }

        var retEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!retEmail.test(strName)) {
            UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_FORMAT_ERROR"));
            return false;
        }

        if (strPWD.length < 6) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR3"));
            return false;
        }

        if (!strPWD) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW"));
            return false;
        }

        if (Utils.hasBlankCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW2"));
            return false;
        }


        if (Utils.judgePasswordCharacters(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW4"));
            return false;
        }

        if (Utils.hasEmojiCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW5"));
            return false;
        }

        LocalStorage.setItem("CLUB_LOGIN_TYPE", "2");
        LocalStorage.setItem("CLUB_MAILBOX_LOGINNAME", strName);
        LocalStorage.setItem("CLUB_MAILBOX_LOGINPSW", strPWD);

        return true;
    },

    _checkAccountDataValid(strName, strPWD) {
        if (strName.length < 6 || strPWD.length < 6) {
            UIFrame.showTips(i18n.t("LOGIN_TIPS.1"));
            return false;
        }

        if (!strName || !strPWD) {
            UIFrame.showTips(i18n.t("LOGIN_TIPS.2"));
            return false;
        }

        if (Utils.hasBlankCharacter(strName) || Utils.hasBlankCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("LOGIN_TIPS.4"));
            return false;
        }

        if (Utils.judgeAccountCharacters(strName)) {
            UIFrame.showTips(i18n.t("LOGIN_TIPS.3"));
            return false;
        }

        if (Utils.judgePasswordCharacters(strPWD)) {
            UIFrame.showTips(i18n.t("LOGIN_TIPS.7"));
            return false;
        }

        if (Utils.hasEmojiCharacter(strName) || Utils.hasEmojiCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("LOGIN_TIPS.5"));
            return false;
        }

        UserInfo.setInfo({
            strName: strName,
            strNickName: strName,
        })

        LocalStorage.setLoginName(strName);
        LocalStorage.setLoginPWD(strPWD);
        LocalStorage.setItem("CLUB_LOGIN_TYPE", "3");

        return true;
    },

    onClickLogin() {
        let strName = this.editLoginAccount.string;
        let strPWD = this.editLoginAccountPsw.string;
        let LoginType = ELoginType.ACCOUNT;
        if (this._loginType == 1) {
            strName = this.editLoginPhone.string;
            strPWD = this.editLoginPhonePsw.string;
            LoginType = ELoginType.PHONE;
            if (!this._checkPhoneDataValid(strName, strPWD)) return;
            strName = this._countryData.code + "-" + this.editLoginPhone.string;
        } else if (this._loginType == 2) {
            strName = this.editLoginMailbox.string;
            strPWD = this.editLoginMailboxPsw.string;
            LoginType = ELoginType.MAILBOX;
            if (!this._checkMailboxDataValid(strName, strPWD)) return;

        } else {
            strName = this.editLoginAccount.string;
            strPWD = this.editLoginAccountPsw.string;
            if (!this._checkAccountDataValid(strName, strPWD)) return;
        }
        app.game.setGameID(-1);
        LocalStorage.setItem("CLUB_EDIT_SERVER", this.editServer.string);
        let sDeviceModel = Utils.getDeviceByUserAgent();
        let sGps = null;
        if (cc.sys.isNative) {
            if (qygameengine.PlatformCommon.getDeviceModel) {
                sDeviceModel = qygameengine.PlatformCommon.getDeviceModel();
                QYLogs.log("sDeviceModel = ", sDeviceModel);
            }

            sGps = LocalStorage.getItem("CLUB_LONGITUDE_AND_LATITUDE", "");
        }

        let data = {
            strName: strName,
            strPWD: strPWD,
            Type: LoginType,
        };

        if (sDeviceModel) {
            data.sDeviceModel = sDeviceModel;
        }

        if (sGps && sGps != "") {
            data.sGps = sGps;
        }

        LocalStorage.setAutoLoginState(true);
        MsgManager.fire(MSG.NOTIFY.LOGIN_START, data);
    },

    OnClickTelegramLogin() {
        // this.getTelegramData()
    },

    //选择游客登录
    onClickGuestLogin() {
        let ELoginType = UserInfo.ELoginType;
        UserInfo.setInfo({
            loginType: ELoginType.GUEST,
        });
        app.config.SHOW_LOGOUT_BTN = false;
        MsgManager.fire(MSG.NOTIFY.LOGIN_GUEST);
    },

    onClickBtnShowReg() {
        let node = cc.instantiate(this.LoginRegister);
        this.node.addChild(node);
        let com = node.getComponent("LoginRegister");
        if (com) {
            com.init(this);
        }
    },

    onClickBtnForgetPsw() {
    },

    onClickBtnResetPsw() {
        let params = {};
        if (this._loginType == 1) {
            params.type = this._loginType;
            params.loginType = this._loginType;
            this.openResetPswCheck(params);
        } else if (this._loginType == 2) {
            params.type = this._loginType;
            params.loginType = this._loginType;
            this.openResetPswCheck(params);
        } else {
            let account = this.editLoginAccount.string;
            if (account == "") {
                UIFrame.showTips(i18n.t("CLUB_LOGIN.ACCOUNT_REG"));
                return;
            }

            this.requestBindQuerry();
        }

    },

    //打开重置密码输入验证码界面
    openResetPswCheck(data) {
        data.CallBack = function (loginType) {
            this.cleanLoginPsw(loginType)
        }.bind(this);
        let node = cc.instantiate(this.LoginResetPswCheck);
        this.node.addChild(node);
        let com = node.getComponent("LoginResetPswCheck");
        if (com) {
            com.init(this, data);
        }
    },

    onClickBtnShowLogin() {
        this.panel_login.active = true;
        this.panel_reg.active = false;
        this.panel_inviteCode.active = false;
    },

    //服务器选择
    onClickServerMenu(config) {
        LocalStorage.setDEVServer(config);
        let str = config.NAME + config.HEAD + "://" + config.HOST + ":" + config.PORT;
        this.serverName.string = str;
        this.editServer.string = str
        this.toggle_selectServer.uncheck();
        this.dropUp.active = true;
    },

    //点击客服
    onClickService() {
        HallClubLogic.openCustomerService("", "");
    },

    //点击显示服务器列表
    onClickShowServerList(event) {
        if (event.isChecked) {
            this.dropUp.active = false;
        } else {
            this.dropUp.active = true;
        }
    },

    //初始化服务器选择列表
    initServerList() {
        // 尝试初始化服务器列表，如果失败则延迟重试
        this._tryInitServerList(0);
    },

    // 尝试初始化服务器列表，带重试机制
    _tryInitServerList(retryCount) {
        const maxRetries = 3;
        const retryDelay = 1000; // 1秒

        // 首先确保 server net 服务已经注册，未注册则主动初始化
        this._ensureServerNetService();

        // 使用诊断功能来详细分析问题
        let diagnosis = this._diagnoseServerIssue();

        if (!diagnosis.netService) {
            cc.warn("LoginScene._tryInitServerList: 服务器服务不可用 -", diagnosis.reason);
            this._scheduleRetry(retryCount, maxRetries, retryDelay);
            return;
        }

        // 如果所有检查都通过，获取服务管理器
        let serverManager = app.server.get("net");
        if (!serverManager.getServerList || typeof serverManager.getServerList !== 'function') {
            cc.error("LoginScene._tryInitServerList: getServerList 方法不存在");
            this._scheduleRetry(retryCount, maxRetries, retryDelay);
            return;
        }

        // 成功获取到服务器管理器，开始初始化列表
        this._doInitServerList(serverManager);
    },

    // 确保 'net' 服务器服务已注册，未注册则主动注册配置
    _ensureServerNetService() {
        if (!app || !app.server) return;
        if (app.server.get("net")) return;
        try {
            let ServerNet = require("config_server_net");
            if (ServerNet) {
                let netService = new ServerNet();
                app.server.set("net", netService);
                cc.warn("LoginScene._ensureServerNetService: 已主动注册 'net' 服务器服务");
            }
        } catch (e) {
            cc.error("LoginScene._ensureServerNetService: 注册 net 服务失败", e);
        }
    },

    // 安排重试
    _scheduleRetry(retryCount, maxRetries, retryDelay) {
        if (!retryCount) retryCount = 0;

        if (retryCount >= maxRetries) {
            cc.error("LoginScene._scheduleRetry: 超过最大重试次数，使用默认配置");
            this._useDefaultServerConfig();
            return;
        }

        cc.warn(`LoginScene._scheduleRetry: 将在 ${retryDelay}ms 后进行第 ${retryCount + 1}/${maxRetries} 次重试`);

        this.scheduleOnce(() => {
            this._tryInitServerList(retryCount + 1);
        }, retryDelay / 1000);
    },

    // 安排重试
    _scheduleRetry(retryCount, maxRetries, retryDelay) {
        if (retryCount < maxRetries) {
            cc.warn(`LoginScene._scheduleRetry: 第 ${retryCount + 1} 次重试，${retryDelay}ms 后执行`);
            this.scheduleOnce(() => {
                this._tryInitServerList(retryCount + 1);
            }, retryDelay / 1000);
        } else {
            cc.error("LoginScene._scheduleRetry: 达到最大重试次数，使用默认服务器配置");
            this._useDefaultServerConfig();
        }
    },

    // 使用默认服务器配置
    _useDefaultServerConfig() {
        cc.warn("LoginScene._useDefaultServerConfig: 使用默认服务器配置");
        // 不初始化服务器列表，使用默认配置
        if (this.serverName) {
            this.serverName.string = "默认服务器 (服务器列表不可用)";
            this.editServer.string = this.serverName.string
        }
    },

    // 执行实际的服务器列表初始化
    _doInitServerList(serverManager) {
        //item模板预制件，key为字符串名称，node为预制件
        let templates = [
            { key: "item1", node: this.item },
        ];

        //调用构造函数，传入构造参数
        this.scview = new DynamicListView({
            scrollview: this.scrollview,
            mask: this.mask,
            content: this.itmeContent,
            item_templates: templates,
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: true,
            //滚动方向，1为垂直，2为水平
            direction: 1,
        });

        let dataArr;
        try {
            dataArr = serverManager.getServerList();
        } catch (error) {
            cc.error("LoginScene._doInitServerList: getServerList() 调用失败", error);
            dataArr = [];
        }

        if (!dataArr) {
            cc.warn("LoginScene._doInitServerList: getServerList() 返回空数据");
            dataArr = [];
        }

        let allData = [];
        //对数据进行包装
        for (let key in dataArr) {
            let Data = {
                key: "item1",
                data: dataArr[key]
            }
            allData.push(Data);
        }

        //设置数据，key为item样式，data为数据
        this.scview.set_data(allData);

        console.log("LoginScene._doInitServerList: 服务器列表初始化完成，共", allData.length, "个服务器");
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        let item = node.getComponent("ServerItem");
        item.init(data, this, index);

        return [node.width, node.height];
    },

    //初始化本地设置
    initLocalSetting() {
        this.editLoginPhone.string = LocalStorage.getItem("CLUB_PHONE_LOGINNAME", "");
        this.editLoginPhonePsw.string = LocalStorage.getItem("CLUB_PHONE_LOGINPSW", "");

        this.editLoginMailbox.string = LocalStorage.getItem("CLUB_MAILBOX_LOGINNAME", "");
        this.editLoginMailboxPsw.string = LocalStorage.getItem("CLUB_MAILBOX_LOGINPSW", "");

        this.editLoginAccount.string = LocalStorage.getLoginName();
        this.editLoginAccountPsw.string = LocalStorage.getLoginPWD();

        QYLogs.log("CLUB_PHONE_LOGINNAME = ", LocalStorage.getItem("CLUB_PHONE_LOGINNAME", ""));
        QYLogs.log("CLUB_MAILBOX_LOGINNAME = ", LocalStorage.getItem("CLUB_MAILBOX_LOGINNAME", ""));
        QYLogs.log("CLUB_ACCOUNT_LOGINNAME = ", LocalStorage.getLoginName());
        QYLogs.log("CLUB_LOGIN_TYPE = ", LocalStorage.getItem("CLUB_LOGIN_TYPE", ""));

        //是否自动登录
        if (this.isTgPlatformsCheck()) {
            // if (this._loginType == 1 && this.editLoginPhone.string == ""){
            //     if (this.editLoginAccount.string && this.editLoginAccountPsw.string){
            //         this._loginType = 3;
            //         this.updateLoginType(this._loginType);
            //         this.scheduleOnce(this.onClickLogin, 0);
            //     }else{
            //         LocalStorage.setAutoLoginState(false);
            //     }
            // }else{
            //     this.scheduleOnce(this.onClickLogin, 0);
            // }
            this._loginType = 7;//tg登录
            this.updateLoginType(this._loginType);
            this.checkTelegramMiniApp()
            return
        }
        // this.checkTelegramMiniApp()

        let serverConfig = LocalStorage.getDEVServer();
        if (!serverConfig) {
            // 尝试安全地获取服务器配置
            serverConfig = this._safeGetServerConfig();
        }

        // 安全检查：确保 serverConfig 包含必要的属性
        if (!serverConfig.NAME) serverConfig.NAME = "未知服务器";
        if (!serverConfig.HEAD) serverConfig.HEAD = "ws";
        if (!serverConfig.HOST) serverConfig.HOST = "localhost";
        if (!serverConfig.PORT) serverConfig.PORT = "8080";

        let str = serverConfig.NAME + " " + serverConfig.HEAD + "://" + serverConfig.HOST + ":" + serverConfig.PORT;
        if (this.serverName) {
            this.serverName.string = str;
            this.editServer.string = str
        }

        this._setSelectServer()
        // app.server.get("net").SERVER = serverConfig;
    },



    _setSelectServer() {
        let coEditServer = LocalStorage.getItem("CLUB_EDIT_SERVER", "");
        if (typeof coEditServer === "string" && (coEditServer.indexOf("kkpoker.life") !== -1)) {
            coEditServer = coEditServer.replace(/test-ws\.kkpoker\.life/g, "game-api.hashpoker.vip");
            coEditServer = coEditServer.replace(/([a-zA-Z0-9-]*)\.kkpoker\.life/g, "$1.hashpoker.vip");
            LocalStorage.setItem("CLUB_EDIT_SERVER", coEditServer);
        }
        this.editServer.string = coEditServer
        this.serverName.string = this.editServer.string
        this.editSelectServerEnd()
    },


    editSelectServerEnd() {
        this.serverName.string = this.editServer.string
        LocalStorage.setItem("CLUB_EDIT_SERVER", this.editServer.string);
        function parseServerString(str) {
            // "自定义 wss://domain.com"
            const parts = str.trim().split(/\s+(?=[a-zA-Z]+:\/\/)/);
            const name = parts.length > 1 ? parts[0] : "自定义配置";
            const urlStr = parts.length > 1 ? parts[1] : parts[0];
            try {
                const url = new URL(urlStr);
                // 只允许 ws 或 wss
                if (url.protocol !== "ws:" && url.protocol !== "wss:") {
                    return null;
                }
                // 默认端口
                let port = url.port
                    ? parseInt(url.port)
                    : url.protocol === "wss:"
                        ? 443
                        : 80;
                return {
                    NAME: name,
                    HEAD: url.protocol.replace(":", ""), // ws / wss
                    HOST: url.hostname,                  // 域名或IP
                    PORT: port,
                };
            } catch (err) {
                return null;
            }
        }



        let config = parseServerString(this.editServer.string)
        if (config) {
            LocalStorage.setDEVServer(config);
        } else {
            console.warn("LoginScene.editSelectServerEnd: 服务器字符串解析失败，不保存:", this.editServer.string);
        }
    },




    // 安全地获取服务器配置
    _safeGetServerConfig() {
        try {
            // 首先确保 net 服务已注册
            this._ensureServerNetService();
            // 检查 app.server 和相关方法是否存在
            if (app && app.server && app.server.get && typeof app.server.get === 'function') {
                let serverManager = app.server.get("net");
                if (serverManager && serverManager.getDefaultItem && typeof serverManager.getDefaultItem === 'function') {
                    let config = serverManager.getDefaultItem(app.config ? app.config.ISDEVELOP : false);
                    if (config) {
                        console.log("LoginScene._safeGetServerConfig: 成功获取默认服务器配置");
                        return config;
                    }
                }
            }
        } catch (error) {
            cc.error("LoginScene._safeGetServerConfig: 获取服务器配置时发生错误", error);
        }

        // 如果所有尝试都失败，返回默认配置
        cc.warn("LoginScene._safeGetServerConfig: 使用默认服务器配置");
        return {
            NAME: "默认服务器",
            HEAD: "ws",
            HOST: "localhost",
            PORT: "8080"
        };
    },

    // 诊断 app.server.get('net') 不可用的原因
    _diagnoseServerIssue() {
        let diagnosis = {
            app: false,
            server: false,
            serverGet: false,
            netService: false,
            reason: "unknown"
        };

        // 检查 app 对象
        if (!app) {
            diagnosis.reason = "app 对象不存在，可能是模块加载问题";
            return diagnosis;
        }
        diagnosis.app = true;

        // 检查 app.server
        if (!app.server) {
            diagnosis.reason = "app.server 不存在，服务容器未初始化";
            return diagnosis;
        }
        diagnosis.server = true;

        // 检查 app.server.get 方法
        if (!app.server.get || typeof app.server.get !== 'function') {
            diagnosis.reason = "app.server.get 方法不存在或不是函数";
            return diagnosis;
        }
        diagnosis.serverGet = true;

        // 检查 net 服务
        try {
            let netService = app.server.get("net");
            if (!netService) {
                diagnosis.reason = "'net' 服务未注册或返回 null";
                return diagnosis;
            }
            diagnosis.netService = true;
            diagnosis.reason = "所有检查通过，服务可用";
        } catch (error) {
            diagnosis.reason = `调用 app.server.get('net') 时出错: ${error.message}`;
        }

        return diagnosis;
    },

    onClickShowPassword() {
        let open_eye = this.showPsw[this._loginType - 1].getChildByName("open_eye");
        let close_eye = this.showPsw[this._loginType - 1].getChildByName("close_eye");
        let inputFlag = cc.EditBox.InputFlag.SENSITIVE;
        if (this._isShowPassword) {
            open_eye.active = true;
            close_eye.active = false;
            inputFlag = cc.EditBox.InputFlag.SENSITIVE;
        } else {
            open_eye.active = false;
            close_eye.active = true;
            inputFlag = cc.EditBox.InputFlag.PASSWORD;
        }

        if (this._loginType == 1) {
            this.editLoginPhonePsw.inputFlag = inputFlag;
        } else if (this._loginType == 2) {
            this.editLoginMailboxPsw.inputFlag = inputFlag;
        } else {
            this.editLoginAccountPsw.inputFlag = inputFlag;
        }

        this._isShowPassword = !this._isShowPassword;
    },

    onClickShowLoginAccount() {
        this.panel_login.active = true;
        this.panel_reg.active = false;
        this.panel_inviteCode.active = false;
    },

    onClickLoginType(event, customEventData) {
        let idx = Number(customEventData);
        this.updateLoginType(idx);
        this._loginType = idx;
    },

    updateLoginType(idx) {
        let children = this.loginType.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let nor = child.getChildByName("nor");
            let sel = child.getChildByName("sel");
            if (i + 1 == idx) {
                nor.active = false;
                sel.active = true;
            } else {
                nor.active = true;
                sel.active = false;
            }
        }

        for (let i = 0; i < this.loginTypeList.length; i++) {
            if (i + 1 == idx) {
                this.loginTypeList[i].active = true;
            } else {
                this.loginTypeList[i].active = false;
            }

        }
    },

    _onShowPrompt(data) {
        console.log("SceneBase._onShowPrompt data:", data);

        let path = "popup/dialog/UIDialog";
        let parent = app.node;
        let wrapper = app.ClubAssets;
        let bundleName = wrapper ? wrapper.bundleName : my.wrapper.COMMON;
        wrapper.ui.loadPopup(path, function (component) {
            parent.addChild(component.node, 1024);
            component.setShowType(data.showType);
            component.setUIBtnTitle();
            component.show(data.text, function (isOK) {
                if (data.callback) {
                    data.callback(isOK);
                }
            });
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
            , {
                path_resources: "main-common/resources/"
            });
    },

    _updataCanvas() {
        let designSize = cc.view.getDesignResolutionSize();
        let winSize = cc.view.getFrameSize();
        let scaleX = winSize.width / designSize.width;
        let scaleY = winSize.height / designSize.height;
        let canvas = this.node.getComponent(cc.Canvas);

        if (canvas) {
            canvas.fitWidth = scaleX <= scaleY ? true : false;
            canvas.fitHeight = scaleX >= scaleY ? true : false;
            // canvas.alignWithScreen();
        }
    },

    onClickSelectAreaPhone() {
        let node = cc.instantiate(this.LoginAreaPhone);
        this.node.addChild(node);
        let com = node.getComponent("LoginAreaPhone");
        if (com) {
            com.init(this);
        }
    },

    setContryCode(data) {
        this.countryCode.overflow = 0;
        this.countryCode.string = data.name + "+" + data.code;
        this.countryCode._forceUpdateRenderData(true);

        if (this.countryCode.node.width > 250) {
            this.countryCode.overflow = 2;
            this.countryCode.node.width = 250;
            this.countryCode._forceUpdateRenderData(true);
        }
        this._countryData = data;
        LocalStorage.setItem("CLUB_COUNTRY_CODE", data.code);
    },

    getCountry() {
        try {
            let countryData = i18n.t("CLUB_AREA_PHONE");

            // 首先检查返回的数据是否是有效的JSON格式
            if (!countryData || typeof countryData !== 'string') {
                throw new Error("i18n返回的数据无效: " + countryData);
            }

            // 检查是否返回的是原始键名（表示翻译失败）
            if (countryData === "CLUB_AREA_PHONE") {
                throw new Error("i18n翻译失败，返回原始键名: " + countryData);
            }

            // 简单检查是否看起来像JSON
            if (!countryData.trim().startsWith('[') && !countryData.trim().startsWith('{')) {
                throw new Error("返回的数据不是JSON格式: " + countryData);
            }

            let data = JSON.parse(countryData);

            // 验证解析后的数据是否为数组
            if (!Array.isArray(data)) {
                throw new Error("解析的数据不是数组格式");
            }

            let code = LocalStorage.getItem("CLUB_COUNTRY_CODE", "");
            if (code == "") {
                let language = LocalStorage.getSysLanguage();
                let lang = cc.sys.languageCode;
                lang = lang.toLocaleLowerCase();

                if (language == "zh") {
                    return data[0] || { name: "中国", code: "86" };
                } else if (language == "zh_tw") {
                    if (lang.indexOf("zh-hk") != -1 || lang.indexOf("zh_hk") != -1) {
                        return data[1] || { name: "香港", code: "852" };
                    }
                    return data[2] || { name: "台湾", code: "886" };
                } else if (language == "vi") {
                    return data[3] || { name: "越南", code: "84" };
                } else if (language == "kh") {
                    return data[4] || { name: "柬埔寨", code: "855" };
                }

                return data[0] || { name: "中国", code: "86" };

            } else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i].code == Number(code)) {
                        return data[i];
                    }
                }
                return data[0] || { name: "中国", code: "86" };
            }
        } catch (error) {
            // 提供更详细的诊断信息
            let currentLang = "未知";
            let hasI18n = false;
            let rawData = "获取失败";

            try {
                currentLang = LocalStorage.getSysLanguage() || "默认";
                hasI18n = typeof i18n !== 'undefined' && typeof i18n.t === 'function';
                rawData = i18n.t("CLUB_AREA_PHONE");
            } catch (diagError) {
                cc.error("LoginScene.getCountry: 诊断时发生错误", diagError);
            }

            cc.warn("LoginScene.getCountry: 详细诊断信息:");
            cc.warn("- 当前语言:", currentLang);
            cc.warn("- i18n可用:", hasI18n);
            cc.warn("- 原始返回数据:", rawData);
            cc.warn("- 错误详情:", error.message);
            cc.warn("- 使用fallback数据");

            cc.error("LoginScene.getCountry: JSON解析失败", error, "原始数据:", rawData);

            // 返回默认的国家数据作为fallback
            let fallbackData = [
                { name: "中国", code: "86" },
                { name: "香港", code: "852" },
                { name: "台湾", code: "886" },
                { name: "越南", code: "84" },
                { name: "柬埔寨", code: "855" }
            ];

            // 应用同样的逻辑选择默认国家
            let code = LocalStorage.getItem("CLUB_COUNTRY_CODE", "");
            if (code == "") {
                let language = LocalStorage.getSysLanguage();
                let lang = cc.sys.languageCode;
                lang = lang.toLocaleLowerCase();

                if (language == "zh") {
                    return fallbackData[0];
                } else if (language == "zh_tw") {
                    if (lang.indexOf("zh-hk") != -1 || lang.indexOf("zh_hk") != -1) {
                        return fallbackData[1];
                    }
                    return fallbackData[2];
                } else if (language == "vi") {
                    return fallbackData[3];
                } else if (language == "kh") {
                    return fallbackData[4];
                }
                return fallbackData[0];
            } else {
                for (let i = 0; i < fallbackData.length; i++) {
                    if (fallbackData[i].code == Number(code)) {
                        return fallbackData[i];
                    }
                }
                return fallbackData[0];
            }
        }
    },

    _onBindQuerry(data) {
        if (data.nRlt == 0) {
            //账号没有绑定邮箱或手机
            UIFrame.showTips(i18n.t("CLUB_LOGIN.BINDING_TIP"));
        } else {
            let params = {};
            if (data.nRlt == 2) {
                params.type = 2;
            } else {
                params.type = 1;
            }

            params.loginType = this._loginType;
            params.account = this.editLoginAccount.string;

            this.openResetPswCheck(params);
        }
    },

    requestBindQuerry() {
        let self = this;
        let sendFunc = function () {
            let sendData = {
                sAcc: self.editLoginAccount.string,
            }
            app.net.send(CMD.MDM_GP_LOGON.value, CMD.MDM_GP_LOGON.SUB_REP_LOGON_BindQuerryRsq_CMD, sendData);
        };

        if (!app.net.isConnect()) {
            this.isRequestBind = true;
            this.connectServer(sendFunc);
            return;
        }

        sendFunc();
    },

    connectServer(callBack) {
        let controller = app.getComponent("LoginController");
        if (controller) {
            if (!app.net.isConnect()) {
                this.connectCallBack = callBack;
                controller._connect();
            }
        }
    },

    _onWebsocketOpen() {
        if (this.connectCallBack) {
            this.connectCallBack();
            this.connectCallBack = null;
            return;
        }
    },

    cleanLoginPsw(loginType) {
        if (loginType == 1) {
            LocalStorage.setItem("CLUB_PHONE_LOGINPSW", "");
            this.editLoginPhonePsw.string = "";
        }

        if (loginType == 1) {
            LocalStorage.setItem("CLUB_MAILBOX_LOGINPSW", "");
            this.editLoginMailboxPsw.string = "";
        }


        if (loginType == 3) {
            LocalStorage.setLoginPWD();
            this.editLoginAccountPsw.string = "";
        }

    },



    getTelegramData() {
        if (!window.Telegram) {
            return;
        }
        console.log();

        console.log('getTelegramData')
        if (Telegram && Telegram.WebApp) {
            console.log('Telegram.WebApp Function')
            if (Telegram.WebApp.ready) {
                console.log('Telegram.WebApp ready Function')
                Telegram.WebApp.ready();
            }

            if (Telegram.WebApp.expand) {
                console.log('Telegram.WebApp expand Function')
                Telegram.WebApp.expand();
            }

            //锁定屏幕方向
            Telegram.WebApp.lockOrientation();
            //关闭小程序确认
            if(Telegram.WebApp.enableClosingConfirmation){
                Telegram.WebApp.enableClosingConfirmation();
            }

        }
        let account = 'telegram'
        let initData = ''
        if (Telegram && Telegram.WebApp && Telegram.WebApp.initData) {
            console.log('Telegram.WebApp.initData', JSON.stringify(Telegram.WebApp.initData));

            initData = JSON.stringify(Telegram.WebApp.initData)
        }


        if (window.Telegram) {
            console.log('getTelegramData window.Telegram')
            if (window.Telegram && window.Telegram.WebApp) {
                console.log('getTelegramData window.Telegram.WebApp')

                if (window.Telegram.WebApp.initDataUnsafe) {
                    console.log('getTelegramData window.Telegram initDataUnsafe')
                    if (cc.js.isString(window.Telegram.WebApp.initDataUnsafe)) {
                        initData = window.Telegram.WebApp.initDataUnsafe
                    } else {
                        initData = JSON.stringify(window.Telegram.WebApp.initDataUnsafe)
                    }
                    console.log('window.Telegram.WebApp.initDataUnsafe===', initData);
                }

                if (window.Telegram.WebApp.initData) {
                    console.log('getTelegramData window.Telegram initData')
                    if (cc.js.isString(window.Telegram.WebApp.initData)) {
                        initData = window.Telegram.WebApp.initData
                    } else {
                        initData = JSON.stringify(window.Telegram.WebApp.initData)
                    }
                    console.log('window.Telegram.WebApp.initData===', initData);
                }
            }
        }

        if (Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
            console.log('Telegram.WebApp.initDataUnsafe', JSON.stringify(Telegram.WebApp.initDataUnsafe));
            console.log('Telegram.WebApp.initDataUnsafe.user', JSON.stringify(Telegram.WebApp.initDataUnsafe.user));
        }

        let sDeviceModel = Utils.getDeviceByUserAgent();
        let sGps = null;
        if (cc.sys.isNative) {
            if (qygameengine.PlatformCommon.getDeviceModel) {
                sDeviceModel = qygameengine.PlatformCommon.getDeviceModel();
                QYLogs.log("sDeviceModel = ", sDeviceModel);
            }

            sGps = LocalStorage.getItem("CLUB_LONGITUDE_AND_LATITUDE", "");
        }
        console.log('getTelegramData initData==', initData)
        let strName = account + ':' + initData
        let LoginType = ELoginType.ACCOUNT;

        let data = {
            strName: strName,
            strPWD: '123456',
            Type: LoginType,
        };

        if (sDeviceModel) {
            data.sDeviceModel = sDeviceModel;
        }

        if (sGps && sGps != "") {
            data.sGps = sGps;
        }

        if (app.config.ISTelegramMiniApp) {
            data = {
                strName: "waiwang001",
                strPWD: 'waiwang001',
                Type: LoginType,
            };
        }

        console.log("setAutoLoginState")
        LocalStorage.setAutoLoginState(true);
        console.log("MSG.NOTIFY.LOGIN_START")
        MsgManager.fire(MSG.NOTIFY.LOGIN_START, data);

    },


    OnClickSwitchLogin() {

        this.telegram_login.active = !this.telegram_login.active;
        this.panel_login.active = !this.panel_login.active;
    }

});