// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//大厅牌局界面
let i18n = require("i18n");
let TAG = "club_hall_game"
let DynamicListView = require("DynamicListView");
let DynamicPageView = require("DynamicPageView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let UserInfo = require("UserInfo");
let Base64 = require("base64");
let CMD = require("protocol_club");
let MSG = require("Msg_club");
let MsgManager = require("MsgManager");
let AppBridge = require("AppBridge");
let LocalStorage = require("LocalStorage");
let CMD_LOGIN = require("protocol_login");
let Msg_login = require("Msg_login");
let NotifyCenter = require("NotifyCenter");
let clubGameConfig = require("clubGameConfig");
let HallClubLogic = require("HallClubLogic");
let UIFrame = require("UIFrame");
let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let UIListView = require("UIListView");
let UIDialog = require("UIDialog");

export const Sort_Type = {
    kongZuo: 0,
    manZuo: 1,
    minMangzhu: 2,
    maxMangzhu: 3
}

cc.Class({
    extends: cc.Component,

    properties: {
        label_moduleName: cc.Label, //当前选中的模块的名字
        label_money: cc.Label, //货币（金币或者俱乐部币）
        label_creatTable: cc.Label, //创建牌桌
        moreMenu: cc.Node,
        up: cc.Node,
        down: cc.Node,
        prefab_createGame: cc.Prefab,
        prefab_recharge: cc.Prefab,
        prefab_cash: cc.Prefab,
        prefab_history: cc.Prefab,
        prefab_member: cc.Prefab,
        btn_bg: cc.Node,
        info_node: cc.Node,
        hall_node: cc.Node,
        btn_screen: cc.Node,
        screenNode: cc.Node,
        label_gold: cc.Label,
        pageView: cc.PageView,
        panel: cc.Node,

        nick_name: cc.Label,
        money_count: cc.Label,
        head_icon: cc.Sprite,
        label_id: cc.Label,

        tabel_count: cc.Label,
        label_memberNum: cc.Label,

        hall_sort_node: cc.Node,  //排序界面
        hall_sort_current_label: cc.Label,  //当前显示排序
        listView: {
            default: null,
            type: UIListView,
        },

        tableScrollview: {
            default: null,
            type: cc.ScrollView,
            tooltip: '牌桌列表',
        },
        tableMask: {
            default: null,
            type: cc.Node
        },
        tableItmeContent: {
            default: null,
            type: cc.Node
        },
        tableItem: {
            default: null,
            type: cc.Prefab
        },

        menuScrollview: {
            default: null,
            type: cc.ScrollView,
            tooltip: '切换模块菜单列表',
        },
        menuMask: {
            default: null,
            type: cc.Node
        },
        menuItmeContent: {
            default: null,
            type: cc.Node
        },
        menuItem: {
            default: null,
            type: cc.Prefab
        },
        iconList: {
            default: [],
            type: cc.SpriteFrame
        },
        goldTypRes: {
            default: [],
            type: cc.SpriteFrame
        },
        gameScrollview: {
            default: null,
            type: cc.ScrollView,
            tooltip: '游戏列表',
        },

        gameMenuList: {
            default: [],
            type: cc.Node
        },

        adRes: {
            default: [],
            type: cc.SpriteFrame
        },

        clickEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },

        btnList: {
            default: [],
            type: cc.Node,
        },

        moveList: {
            default: [],
            type: cc.Node,
        },

        bindEmail: cc.Prefab,
        payPassword: cc.Prefab,

        _isShowMoreMenu: false,
        _tableList: [],
        _lastTableInfo: null,
        _curGameId: 0, //0: 全部游戏；其他游戏id
        _pageTime: 0,
        _curPage: 0,
        _maxPageLen: 0,
        _hasMoveSpace: 0,
        _moveDirection: 1, //1: top 2:bottom

        _currentSortType: Sort_Type.minMangzhu,  //默认当前排序类型
        _sortLabelControlTab: [],
        curToggle: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.btn_createGameNode = this.node.getChildByName("scContent").getChildByName("top").getChildByName("btn_createGame");
        if (!this._isRegister) {
            this.register();
        }

        if (!this.menuScview) {
            this.initTableList();
        }

        if (!this.tableScview) {
            this.listView.init(this);
            this.tableScview = true
        }

        // 初始化排序状态
        this._isSortEnabled = true;
        target.on(event.RESIZE, this._onResized, this);
        target.on(event.SHOW, this.onShow, this);
        this._onResized();

        app.util.addClickSoundToNode(this.node);
    },

    onShow() {
        this.scheduleOnce(() => {
            const toggle = this.curToggle
            this.curToggle = 0
            this.OnClickMenuToggle(null, toggle);
        }, 1);
    },

    start() {

        this._onResized();
        this.initAdPageView();
        this.registerTouchMove();

        if (this.hall_sort_node) {
            this.hall_sort_node.active = false
        }
        HallClubCacheData._gameTemplateConfig = LocalStorage.getItem("CLUB_CREATE_TEXAS_TABLE_TEMPLATE") || []

        this.initSortLabelTab()
        this.getMyInfo()
    },

    onEnable() {
        this._pageTime = 0;
        this._onResized();
        this.scrollEndFunc(null, true);
        // this.getClubConfig()
        this.scheduleOnce(() => {
            this.getClubConfig()
        }, 1)
    },

    update(dt) {
        this._pageTime += dt;

        if (this._pageTime >= 10) {
            this._pageTime = 0;
            if (this._curPage < this._maxPageLen) {
                this._curPage = this._curPage + 1;
            }

            this._isTouch = false;
            this.pageView.scrollToPage(this._curPage)

        }
    },

    register() {
        MsgManager.on(MSG.NOTIFY.ClubSChangeUserInfoResp_ui, this._onUserInfoChangeNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSSceneChangeNotify_ui, this._onSceneChangeNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetTableListResp_ui, this._onGetTableList, this);
        MsgManager.on(MSG.NOTIFY.ClubSOpenTableNotify_ui, this._onOpenTableNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSCloseTableNotify_ui, this._onCloseTabel, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, this._onUserInfoChangeNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSTableInfoNotify_ui, this._onTableInfoNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubGetClubSumUserCountRsp_ui, this._onGetClubSumUserCountNotify, this);
        MsgManager.on(Msg_login.ACCOUNT.SUB_GP_CURRENTGAMEQUERRY, this._onCheckEnterClubGame, this);
        MsgManager.on(MSG.NOTIFY.CLUB_ENTER_GAME, this.onClickItem, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoResp_ui, this._onUserInfo, this);
        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this._onCorrCapital, this);//网关金币更新
        MsgManager.on(MSG.NOTIFY.ClubSGetClubConfigResp_ui, this._onRspClubConfig, this);
        this._isRegister = true;
    },

    unRegister() {
        MsgManager.un(this._onSceneChangeNotify);
        MsgManager.un(this._onSceneChangeNotify);
        MsgManager.un(this._onGetTableList);
        MsgManager.un(this._onOpenTableNotify);
        MsgManager.un(this._onCloseTabel);
        MsgManager.un(this._onUserInfoChangeNotify);
        MsgManager.un(this._onTableInfoNotify);
        MsgManager.un(this._onCheckEnterClubGame);
        MsgManager.un(this.onClickItem);
        MsgManager.un(this._onGetClubSumUserCountNotify);
        MsgManager.un(this._onUserInfo);
        MsgManager.un(this._onCorrCapital);
        MsgManager.un(this._onRspClubConfig);
        target.targetOff(this);
    },


    _onCorrCapital(data) {
        if (!data) {
            return;
        }
        if (data.nGold != undefined) {
            UserInfo.setInfo({
                nGold: data.nGold,
            })
            this.updateMoneyCount(data.nGold);
        }
    },

    onDestroy() {
        this.unRegister();
    },

    _onResized() {
        this._hasMoveSpace = 0;
        if (this.tableScrollview) {
            let widget = this.tableScrollview.node.getComponent(cc.Widget);
            let mWidget = this.tableMask.getComponent(cc.Widget);
            // widget.top = 502;
            // widget.top = 250;
            // widget.bottom = 102;
            // widget.bottom = 110;
            mWidget.top = 0;
            mWidget.bottom = 0;
            // widget.updateAlignment();
            mWidget.updateAlignment();
            this.tableScrollview.scrollToTop();
            this.listView.setDirty();
        }

        if (this.pageView) {
            let page = this.node.getChildByName("top").getChildByName("page_1");

            this._pageViewcontentX = this.pageView.content.x;
            if (this.node.width / page.width) {
                this.pageView.node.scale = this.node.width / page.width;
            }
        }
    },

    //获取俱乐部配置
    getClubConfig() {
        let params = {
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetClubConfigReq_CMD, params);
    },

    registerTouchMove() {
        // let tableView = this.listView.scroll;
        // tableView.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
        //     if (this.clickEvents == null) {
        //         return;
        //     }
        //     cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        // });

        // this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
        //     if (this.clickEvents == null) {
        //         return;
        //     }
        //     cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        // });
    },


    updateMoneyCount(num) {
        let hideUNode = this.money_count.node.parent.getChildByName("hideUBtn")
        let localMoneyHide = LocalStorage.getItem("CLUB_MONEY_HIDE", "show"); // 0:隐藏，1：显示
        if (localMoneyHide == "show") {
            this.money_count.string = Math.round(num * 100) / 100 + "";
            hideUNode.getChildByName("icon1").active = true
            hideUNode.getChildByName("icon2").active = false
        } else {
            this.money_count.string = "******"
            hideUNode.getChildByName("icon1").active = false
            hideUNode.getChildByName("icon2").active = true
        }

    },

    onClickHideUBtn(event) {
        let localMoneyHide = LocalStorage.getItem("CLUB_MONEY_HIDE", "show"); // 0:隐藏，1：显示

        localMoneyHide = localMoneyHide == "show" ? "hide" : "show";
        LocalStorage.setItem("CLUB_MONEY_HIDE", localMoneyHide)


        let userInfo = UserInfo.getInfo();
        this.updateMoneyCount(userInfo.nGold);

    },
    onClickPanel(event) {
        let top = this.node.getChildByName("top");
        let height = top.height;
        if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let move = event.touch.getDelta();
            let moveSpace = move.y;
            if (this._hasMoveSpace > 0 && moveSpace > 0 && this._hasMoveSpace >= height) {
                // return;
            }

            if (this._hasMoveSpace <= 0 && moveSpace <= 0) {
                // return;
            }

            let tableView = this.listView.scroll;

            if (moveSpace > 0) {
                this._moveDirection = 1;
                tableView.scrollToTop();
            } else {
                this._moveDirection = 2;
                if (this._tableList.length != 0 && tableView.getScrollOffset().y > 0) {
                    // return;
                }
            }

            if (this._hasMoveSpace + moveSpace > height) {
                moveSpace = height - this._hasMoveSpace;
            }

            if (this._hasMoveSpace + moveSpace < 0) {
                moveSpace = -this._hasMoveSpace;
            }

            for (let i = 0; i < this.moveList.length; i++) {
                // let node = this.moveList[i];
                // node.y = node.y + moveSpace;
            }

            this._hasMoveSpace += moveSpace;


            if (this.tableScrollview) {
                // let widget = this.tableScrollview.node.getComponent(cc.Widget);
                // widget.updateAlignment();
                // let contentSize = this.tableScrollview.node.getContentSize();
                // this.tableScrollview.node.height = this.tableScrollview.node.height + moveSpace;
                // this.tableScrollview.node.getChildByName("view").height = this.tableScrollview.node.height;
                // widget.top = widget.top - moveSpace/2;
                // widget.bottom = widget.bottom - moveSpace/2;
                // widget.updateAlignment();
                // contentSize = this.tableScrollview.node.getContentSize();
                // this.listView.setDirty();
            }
        }

    },


    onClickBg() {
        if (this._isShowMoreMenu) {
            this.onClickShowMoreMenu();
        }

        this.btn_bg.active = false;
    },

    init() {
        this._sScreen = null;

        if (this._isSelectEmpty) {
            this._sScreen = { isVacancy: this._isSelectEmpty }
        }
        //this.setCreateTableName();
        this.initGameMenu();
        this.updateTableData();
        let clubList = HallClubCacheData.getClubList();
        this.initUI();
        // this.updateMenu(clubList);
        //this.showBtnCreatTable();
        // this.getClubTableList(1);
        this.getClubSumUserCount();
        const toggle = this.curToggle ? this.curToggle : 1;
        this.curToggle = 0;
        this.OnClickMenuToggle(null, toggle);
    },

    initUI() {
        ;
        // let widgetInfo = this.info_node.getComponent(cc.Widget);
        // if (HallClubLogic.isShowClub()){
        //     //显示俱乐部
        //     this.info_node.active = true;
        //     this.hall_node.active = false;
        // }else{
        //     this.info_node.active = false;
        //     this.hall_node.active = true;
        // }

        let userInfo = UserInfo.getInfo();
        // cc.log('userInfo',JSON.stringify(userInfo))
        // Utils.changeUserHead(this.head_icon, userInfo.strHeadUrl);
        // this.nick_name.string = Utils.getShortText(userInfo.strNickName, 14);
        this.updateMoneyCount(userInfo.nGold);
        // this.label_id.string = `ID:${userInfo.nUserID}`;
        this.btn_createGameNode.active = HallClubLogic.isClubCreator() || HallClubLogic.isCanMangeGame();
    },

    _createHXPokerBannerTexture() {
        try {
            if (!window || typeof document === 'undefined') return null;
            var W = 1080, H = 180;
            var canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            var ctx = canvas.getContext('2d');
            if (!ctx) return null;

            var bgGrad = ctx.createLinearGradient(0, 0, W, 0);
            bgGrad.addColorStop(0.0, '#061024');
            bgGrad.addColorStop(0.3, '#0a1e4a');
            bgGrad.addColorStop(0.5, '#123062');
            bgGrad.addColorStop(0.7, '#0a1e4a');
            bgGrad.addColorStop(1.0, '#061024');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            var vertGrad = ctx.createLinearGradient(0, 0, 0, H);
            vertGrad.addColorStop(0, 'rgba(255,244,194,0.06)');
            vertGrad.addColorStop(0.5, 'rgba(20,50,100,0.05)');
            vertGrad.addColorStop(1, 'rgba(0,0,0,0.45)');
            ctx.fillStyle = vertGrad;
            ctx.fillRect(0, 0, W, H);

            ctx.strokeStyle = 'rgba(90,140,220,0.12)';
            ctx.lineWidth = 1;
            var i;
            for (i = 0; i <= W; i += 36) {
                ctx.beginPath();
                ctx.moveTo(i + 0.5, 0);
                ctx.lineTo(i + 0.5, H);
                ctx.stroke();
            }
            for (i = 0; i <= H; i += 30) {
                ctx.beginPath();
                ctx.moveTo(0, i + 0.5);
                ctx.lineTo(W, i + 0.5);
                ctx.stroke();
            }

            ctx.save();
            ctx.globalAlpha = 0.18;
            ctx.strokeStyle = '#d4a84a';
            ctx.lineWidth = 2;
            for (i = -H; i < W + H; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + H, H);
                ctx.stroke();
            }
            ctx.restore();

            ctx.save();
            var starColors = ['#fff4c2', '#ffffff', '#8ab8ff', '#d4a84a'];
            for (i = 0; i < 60; i++) {
                var sx = (i * 137.5) % W;
                var sy = ((i * 73) + (i % 3) * 11) % H;
                var sr = (i % 5 === 0) ? 2 : 1;
                ctx.fillStyle = starColors[i % starColors.length];
                ctx.globalAlpha = 0.3 + ((i % 7) * 0.08);
                ctx.beginPath();
                ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            function drawChip(cx, cy, r, color) {
                ctx.save();
                ctx.translate(cx, cy);
                var grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.2, 0, 0, r);
                grad.addColorStop(0, '#fff4c2');
                grad.addColorStop(0.5, color);
                grad.addColorStop(1, '#5a3a08');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = Math.max(2, r * 0.08);
                ctx.strokeStyle = 'rgba(255,244,194,0.7)';
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
                ctx.lineWidth = Math.max(1.5, r * 0.06);
                ctx.strokeStyle = 'rgba(138,99,24,0.9)';
                ctx.stroke();
                for (var s = 0; s < 8; s++) {
                    var a = (s / 8) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55);
                    ctx.lineTo(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95);
                    ctx.lineWidth = Math.max(1.5, r * 0.05);
                    ctx.strokeStyle = '#8a6318';
                    ctx.stroke();
                }
                ctx.restore();
            }
            drawChip(90, 55, 34, '#d4a84a');
            drawChip(58, 120, 26, '#c08a28');
            drawChip(150, 135, 22, '#e6c36a');
            drawChip(W - 120, 50, 30, '#d4a84a');
            drawChip(W - 70, 115, 28, '#c08a28');
            drawChip(W - 180, 140, 20, '#e6c36a');

            function drawL(x, y, w, h, color) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.85;
                ctx.beginPath();
                ctx.moveTo(x, y + h * 0.4);
                ctx.lineTo(x, y);
                ctx.lineTo(x + w * 0.4, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + w, y + h - h * 0.4);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x + w - w * 0.4, y + h);
                ctx.stroke();
                ctx.restore();
            }
            drawL(18, 18, 90, H - 36, '#fff4c2');
            drawL(W - 108, 18, 90, H - 36, '#fff4c2');

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var title = '哈希德州';
            var sub = 'HASH POKER';
            var cx = W / 2, cy = H / 2;

            ctx.shadowColor = 'rgba(212,168,74,0.9)';
            ctx.shadowBlur = 28;
            ctx.font = 'bold 78px "PingFang SC","Microsoft YaHei","Hiragino Sans GB",sans-serif';
            var titleGrad = ctx.createLinearGradient(0, cy - 44, 0, cy + 10);
            titleGrad.addColorStop(0, '#fff8dc');
            titleGrad.addColorStop(0.35, '#ffe07a');
            titleGrad.addColorStop(0.7, '#d4a84a');
            titleGrad.addColorStop(1, '#8a6318');
            ctx.fillStyle = titleGrad;
            ctx.fillText(title, cx, cy - 8);
            ctx.shadowBlur = 0;

            ctx.strokeStyle = 'rgba(138,99,24,0.55)';
            ctx.lineWidth = 2;
            ctx.strokeText(title, cx, cy - 8);

            ctx.font = 'bold 40px "Arial Black","Arial","Helvetica",sans-serif';
            var subGrad = ctx.createLinearGradient(0, cy + 18, 0, cy + 58);
            subGrad.addColorStop(0, '#fff4c2');
            subGrad.addColorStop(0.5, '#f1c75e');
            subGrad.addColorStop(1, '#a07420');
            ctx.fillStyle = subGrad;
            ctx.shadowColor = 'rgba(212,168,74,0.6)';
            ctx.shadowBlur = 14;
            ctx.fillText(sub, cx, cy + 42);
            ctx.shadowBlur = 0;
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = 'rgba(255,244,194,0.25)';
            ctx.lineWidth = 1;
            ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
            ctx.restore();

            var tex = new cc.Texture2D();
            tex.initWithElement(canvas);
            tex.handleLoadedTexture();
            return tex;
        } catch (e) {
            cc.warn("_createHXPokerBannerTexture error:", e);
            return null;
        }
    },

    _createHXActivityBannerTexture() {
        try {
            if (!window || typeof document === 'undefined') return null;
            var W = 1080, H = 180;
            var canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            var ctx = canvas.getContext('2d');
            if (!ctx) return null;

            var bgGrad = ctx.createLinearGradient(0, 0, W, 0);
            bgGrad.addColorStop(0.0, '#0a2418');
            bgGrad.addColorStop(0.3, '#113a2a');
            bgGrad.addColorStop(0.5, '#0c2e4a');
            bgGrad.addColorStop(0.7, '#1a3a6a');
            bgGrad.addColorStop(1.0, '#06142e');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            var vertGrad = ctx.createLinearGradient(0, 0, 0, H);
            vertGrad.addColorStop(0, 'rgba(120,255,180,0.08)');
            vertGrad.addColorStop(0.5, 'rgba(80,140,220,0.04)');
            vertGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
            ctx.fillStyle = vertGrad;
            ctx.fillRect(0, 0, W, H);

            ctx.strokeStyle = 'rgba(120,220,160,0.12)';
            ctx.lineWidth = 1;
            var i;
            for (i = 0; i <= W; i += 30) {
                ctx.beginPath();
                ctx.moveTo(i + 0.5, 0);
                ctx.lineTo(i + 0.5, H);
                ctx.stroke();
            }
            for (i = 0; i <= H; i += 24) {
                ctx.beginPath();
                ctx.moveTo(0, i + 0.5);
                ctx.lineTo(W, i + 0.5);
                ctx.stroke();
            }

            ctx.save();
            ctx.globalAlpha = 0.22;
            ctx.strokeStyle = '#55cc88';
            ctx.lineWidth = 2;
            for (i = -H; i < W + H; i += 36) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + H, H);
                ctx.stroke();
            }
            ctx.restore();

            function drawGift(cx, cy, r) {
                ctx.save();
                ctx.translate(cx, cy);
                var grad = ctx.createLinearGradient(-r, -r, r, r);
                grad.addColorStop(0, '#ff6b6b');
                grad.addColorStop(0.5, '#e63946');
                grad.addColorStop(1, '#a4161a');
                ctx.fillStyle = grad;
                ctx.fillRect(-r, -r, r * 2, r * 2);
                var ribV = ctx.createLinearGradient(-r * 0.15, -r, r * 0.15, r);
                ribV.addColorStop(0, '#ffe066');
                ribV.addColorStop(0.5, '#ffd43b');
                ribV.addColorStop(1, '#f59f00');
                ctx.fillStyle = ribV;
                ctx.fillRect(-r * 0.15, -r, r * 0.3, r * 2);
                var ribH = ctx.createLinearGradient(-r, -r * 0.15, r, r * 0.15);
                ribH.addColorStop(0, '#ffe066');
                ribH.addColorStop(0.5, '#ffd43b');
                ribH.addColorStop(1, '#f59f00');
                ctx.fillStyle = ribH;
                ctx.fillRect(-r, -r * 0.15, r * 2, r * 0.3);
                ctx.beginPath();
                ctx.arc(0, -r * 0.15, r * 0.25, 0, Math.PI * 2);
                ctx.fillStyle = '#ffd43b';
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.strokeRect(-r + 0.5, -r + 0.5, r * 2 - 1, r * 2 - 1);
                ctx.restore();
            }
            drawGift(85, 90, 42);
            drawGift(180, 50, 26);
            drawGift(W - 95, 95, 38);
            drawGift(W - 205, 55, 22);

            ctx.save();
            var colors = ['#a8ffc8', '#ffffff', '#ffe066', '#55cc88'];
            for (i = 0; i < 80; i++) {
                var sx = (i * 127.8) % W;
                var sy = ((i * 53) + (i % 5) * 7) % H;
                var sr = (i % 6 === 0) ? 2 : 1;
                ctx.fillStyle = colors[i % colors.length];
                ctx.globalAlpha = 0.28 + ((i % 7) * 0.07);
                ctx.beginPath();
                ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            function drawL(x, y, w, h, color) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.85;
                ctx.beginPath();
                ctx.moveTo(x, y + h * 0.4);
                ctx.lineTo(x, y);
                ctx.lineTo(x + w * 0.4, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + w, y + h - h * 0.4);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x + w - w * 0.4, y + h);
                ctx.stroke();
                ctx.restore();
            }
            drawL(18, 18, 90, H - 36, '#55cc88');
            drawL(W - 108, 18, 90, H - 36, '#55cc88');

            ctx.save();
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            var cx1 = 270, cy1 = H / 2 - 12;
            var cx2 = 270, cy2 = H / 2 + 34;

            ctx.shadowColor = 'rgba(85,204,136,0.9)';
            ctx.shadowBlur = 24;
            ctx.font = 'bold 64px "PingFang SC","Microsoft YaHei","Hiragino Sans GB",sans-serif';
            var tg = ctx.createLinearGradient(cx1, cy1 - 40, cx1, cy1 + 20);
            tg.addColorStop(0, '#e8fff0');
            tg.addColorStop(0.4, '#8bffbb');
            tg.addColorStop(0.7, '#55cc88');
            tg.addColorStop(1, '#2f9e5c');
            ctx.fillStyle = tg;
            ctx.fillText('每日活动 · 豪礼不停', cx1, cy1);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(47,158,92,0.55)';
            ctx.lineWidth = 1.5;
            ctx.strokeText('每日活动 · 豪礼不停', cx1, cy1);

            ctx.font = 'bold 34px "PingFang SC","Microsoft YaHei",sans-serif';
            var sg = ctx.createLinearGradient(cx2, cy2 - 18, cx2, cy2 + 18);
            sg.addColorStop(0, '#fff4c2');
            sg.addColorStop(0.5, '#ffe07a');
            sg.addColorStop(1, '#d4a84a');
            ctx.fillStyle = sg;
            ctx.shadowColor = 'rgba(255,224,122,0.6)';
            ctx.shadowBlur = 12;
            ctx.fillText('签到 · 分享 · 推荐 · 多重奖励', cx2, cy2);

            ctx.restore();

            ctx.save();
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            var btnX = W - 70, btnY = H / 2, btnW = 170, btnH = 80;
            var r = 18;
            var bg = ctx.createLinearGradient(btnX - btnW / 2, btnY - btnH / 2, btnX + btnW / 2, btnY + btnH / 2);
            bg.addColorStop(0, '#7ce6a8');
            bg.addColorStop(0.5, '#55cc88');
            bg.addColorStop(1, '#2f9e5c');
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.moveTo(btnX - btnW / 2 + r, btnY - btnH / 2);
            ctx.lineTo(btnX + btnW / 2 - r, btnY - btnH / 2);
            ctx.quadraticCurveTo(btnX + btnW / 2, btnY - btnH / 2, btnX + btnW / 2, btnY - btnH / 2 + r);
            ctx.lineTo(btnX + btnW / 2, btnY + btnH / 2 - r);
            ctx.quadraticCurveTo(btnX + btnW / 2, btnY + btnH / 2, btnX + btnW / 2 - r, btnY + btnH / 2);
            ctx.lineTo(btnX - btnW / 2 + r, btnY + btnH / 2);
            ctx.quadraticCurveTo(btnX - btnW / 2, btnY + btnH / 2, btnX - btnW / 2, btnY + btnH / 2 - r);
            ctx.lineTo(btnX - btnW / 2, btnY - btnH / 2 + r);
            ctx.quadraticCurveTo(btnX - btnW / 2, btnY - btnH / 2, btnX - btnW / 2 + r, btnY - btnH / 2);
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.stroke();
            ctx.shadowColor = 'rgba(85,204,136,0.7)';
            ctx.shadowBlur = 18;
            ctx.font = 'bold 36px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.fillText('立即领取', btnX - 6, btnY + 2);
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = 'rgba(120,220,160,0.28)';
            ctx.lineWidth = 1;
            ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
            ctx.restore();

            var tex = new cc.Texture2D();
            tex.initWithElement(canvas);
            tex.handleLoadedTexture();
            return tex;
        } catch (e) {
            cc.warn("_createHXActivityBannerTexture error:", e);
            return null;
        }
    },

    _createHXQuickPlayBannerTexture() {
        try {
            if (!window || typeof document === 'undefined') return null;
            var W = 1080, H = 180;
            var canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            var ctx = canvas.getContext('2d');
            if (!ctx) return null;

            var bgGrad = ctx.createLinearGradient(0, 0, W, H);
            bgGrad.addColorStop(0.0, '#070c1e');
            bgGrad.addColorStop(0.25, '#0d1a3e');
            bgGrad.addColorStop(0.5, '#152a66');
            bgGrad.addColorStop(0.75, '#0e2050');
            bgGrad.addColorStop(1.0, '#050a1a');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            var sp = ctx.createRadialGradient(W * 0.78, H * 0.4, 10, W * 0.78, H * 0.4, 320);
            sp.addColorStop(0, 'rgba(120,200,255,0.28)');
            sp.addColorStop(0.5, 'rgba(100,160,255,0.12)');
            sp.addColorStop(1, 'rgba(40,80,160,0)');
            ctx.fillStyle = sp;
            ctx.fillRect(0, 0, W, H);
            var sp2 = ctx.createRadialGradient(W * 0.18, H * 0.6, 10, W * 0.18, H * 0.6, 280);
            sp2.addColorStop(0, 'rgba(180,140,255,0.24)');
            sp2.addColorStop(1, 'rgba(60,40,120,0)');
            ctx.fillStyle = sp2;
            ctx.fillRect(0, 0, W, H);

            ctx.strokeStyle = 'rgba(140,180,255,0.10)';
            ctx.lineWidth = 1;
            var i;
            for (i = 0; i <= W; i += 24) {
                ctx.beginPath();
                ctx.moveTo(i + 0.5, 0);
                ctx.lineTo(i + 0.5, H);
                ctx.stroke();
            }
            for (i = 0; i <= H; i += 20) {
                ctx.beginPath();
                ctx.moveTo(0, i + 0.5);
                ctx.lineTo(W, i + 0.5);
                ctx.stroke();
            }

            function drawCard(cx, cy, w, h, face, suit, color, rot) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rot || 0);
                var cardG = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
                cardG.addColorStop(0, '#ffffff');
                cardG.addColorStop(1, '#f0f4fa');
                ctx.fillStyle = cardG;
                var r = Math.min(w, h) * 0.12;
                ctx.beginPath();
                ctx.moveTo(-w / 2 + r, -h / 2);
                ctx.lineTo(w / 2 - r, -h / 2);
                ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
                ctx.lineTo(w / 2, h / 2 - r);
                ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
                ctx.lineTo(-w / 2 + r, h / 2);
                ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
                ctx.lineTo(-w / 2, -h / 2 + r);
                ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
                ctx.closePath();
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgba(80,120,180,0.35)';
                ctx.stroke();
                ctx.fillStyle = color;
                ctx.font = 'bold ' + Math.floor(h * 0.32) + 'px Arial Black';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(face, -w / 2 + 6, -h / 2 + 4);
                ctx.font = Math.floor(h * 0.22) + 'px serif';
                ctx.fillText(suit, -w / 2 + 8, -h / 2 + Math.floor(h * 0.30));
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.font = 'bold ' + Math.floor(h * 0.32) + 'px Arial Black';
                ctx.save();
                ctx.rotate(Math.PI);
                ctx.fillText(face, -w / 2 + 6, -h / 2 + 4);
                ctx.font = Math.floor(h * 0.22) + 'px serif';
                ctx.fillText(suit, -w / 2 + 8, -h / 2 + Math.floor(h * 0.30));
                ctx.restore();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = Math.floor(h * 0.42) + 'px serif';
                ctx.fillText(suit, 0, 2);
                ctx.restore();
            }
            drawCard(W - 110, 50, 66, 92, 'A', '\u2660', '#1a1a1a', -0.18);
            drawCard(W - 50, 80, 66, 92, 'K', '\u2665', '#d21f2f', 0.12);
            drawCard(W - 160, 120, 66, 92, 'Q', '\u2666', '#d21f2f', -0.06);
            drawCard(120, 50, 66, 92, 'J', '\u2663', '#1a1a1a', 0.14);
            drawCard(60, 110, 66, 92, '10', '\u2660', '#1a1a1a', -0.12);

            function drawL(x, y, w, h, color) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.moveTo(x, y + h * 0.4);
                ctx.lineTo(x, y);
                ctx.lineTo(x + w * 0.4, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + w, y + h - h * 0.4);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x + w - w * 0.4, y + h);
                ctx.stroke();
                ctx.restore();
            }
            drawL(18, 18, 90, H - 36, '#8ab4ff');
            drawL(W - 108, 18, 90, H - 36, '#8ab4ff');

            ctx.save();
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            var t1x = 220, t1y = H / 2 - 16;
            ctx.shadowColor = 'rgba(100,160,255,0.95)';
            ctx.shadowBlur = 26;
            ctx.font = 'bold 70px "PingFang SC","Microsoft YaHei",sans-serif';
            var tg = ctx.createLinearGradient(t1x, t1y - 42, t1x, t1y + 20);
            tg.addColorStop(0, '#ffffff');
            tg.addColorStop(0.35, '#c4daff');
            tg.addColorStop(0.7, '#6a9fff');
            tg.addColorStop(1, '#3b6cd4');
            ctx.fillStyle = tg;
            ctx.fillText('极速开局', t1x, t1y);
            ctx.shadowBlur = 0;
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(40,80,160,0.5)';
            ctx.strokeText('极速开局', t1x, t1y);

            var t2x = 220, t2y = H / 2 + 36;
            ctx.font = 'bold 32px "PingFang SC","Microsoft YaHei",sans-serif';
            var sg = ctx.createLinearGradient(t2x, t2y - 16, t2x, t2y + 16);
            sg.addColorStop(0, '#fff4c2');
            sg.addColorStop(0.5, '#e0d0ff');
            sg.addColorStop(1, '#b4a0ff');
            ctx.fillStyle = sg;
            ctx.shadowColor = 'rgba(180,160,255,0.55)';
            ctx.shadowBlur = 12;
            ctx.fillText('免匹配 · 秒开桌 · 千万玩家在线等你', t2x, t2y);
            ctx.restore();

            ctx.save();
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            var bx = W - 270, by = H / 2, bw = 160, bh = 80, br = 18;
            var bgBtn = ctx.createLinearGradient(bx - bw / 2, by - bh / 2, bx + bw / 2, by + bh / 2);
            bgBtn.addColorStop(0, '#5aa8ff');
            bgBtn.addColorStop(0.5, '#3778e6');
            bgBtn.addColorStop(1, '#1e4fb0');
            ctx.fillStyle = bgBtn;
            ctx.beginPath();
            ctx.moveTo(bx - bw / 2 + br, by - bh / 2);
            ctx.lineTo(bx + bw / 2 - br, by - bh / 2);
            ctx.quadraticCurveTo(bx + bw / 2, by - bh / 2, bx + bw / 2, by - bh / 2 + br);
            ctx.lineTo(bx + bw / 2, by + bh / 2 - br);
            ctx.quadraticCurveTo(bx + bw / 2, by + bh / 2, bx + bw / 2 - br, by + bh / 2);
            ctx.lineTo(bx - bw / 2 + br, by + bh / 2);
            ctx.quadraticCurveTo(bx - bw / 2, by + bh / 2, bx - bw / 2, by + bh / 2 - br);
            ctx.lineTo(bx - bw / 2, by - bh / 2 + br);
            ctx.quadraticCurveTo(bx - bw / 2, by - bh / 2, bx - bw / 2 + br, by - bh / 2);
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.stroke();
            ctx.shadowColor = 'rgba(80,140,255,0.7)';
            ctx.shadowBlur = 18;
            ctx.font = 'bold 36px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.fillText('快速加入', bx - 6, by + 2);
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = 'rgba(140,180,255,0.28)';
            ctx.lineWidth = 1;
            ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
            ctx.restore();

            var tex = new cc.Texture2D();
            tex.initWithElement(canvas);
            tex.handleLoadedTexture();
            return tex;
        } catch (e) {
            cc.warn("_createHXQuickPlayBannerTexture error:", e);
            return null;
        }
    },

    _getGeneratedBanners() {
        var list = [];
        try {
            var tex1 = this._createHXPokerBannerTexture();
            var tex2 = this._createHXActivityBannerTexture();
            var tex3 = this._createHXQuickPlayBannerTexture();
            if (tex1) list.push(new cc.SpriteFrame(tex1));
            if (tex2) list.push(new cc.SpriteFrame(tex2));
            if (tex3) list.push(new cc.SpriteFrame(tex3));
        } catch (e) {
            cc.warn("_getGeneratedBanners error:", e);
        }
        return list;
    },


    getMyInfo() {
        cc.log("--------------玩家个人信息请求----------------");
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    //获取用户信息，解决从牌局返回不更新金额
    _onUserInfo(data) {
        if (data.nRlt == 0) {
            UserInfo.setInfo({
                nGold: data.tUserInfo.nGold,
                nOpenProtection: data.tUserInfo.nOpenProtection,
                sMail: data.tUserInfo.sMail,
            })
            this.updateMoneyCount(data.tUserInfo.nGold);

            this.btn_createGameNode.active = HallClubLogic.isClubCreator() || HallClubLogic.isCanMangeGame();
        }
    },

    initAdPageView(data) {
        this.pageView.removeAllPages();
        var page = this.node.getChildByName("top").getChildByName("page_1");

        this._pageViewcontentX = this.pageView.content.x;

        var banners = this._getGeneratedBanners();
        if (!banners || banners.length === 0) {
            banners = [];
            var L = this.adRes ? this.adRes.length : 0;
            for (var bi = 4; bi < L; bi++) {
                if (this.adRes[bi]) banners.push(this.adRes[bi]);
            }
        }

        var pageLen = 0;
        var self = this;
        var addPage = function (res, index, id) {
            if (!res) {
                QYLogs.warn("没有找到图片", id);
                return;
            }
            var item = cc.instantiate(page);
            item.active = true;
            item.getComponent(cc.Sprite).spriteFrame = res;

            if (index != undefined) {
                self.pageView.insertPage(item, index);
            } else {
                self.pageView.addPage(item);
            }

            var call = item.getComponent(cc.Button).clickEvents[0];
            if (call) {
                call.customEventData = (id != undefined ? id : (pageLen + 1)).toString();
            }
            pageLen += 1;
        };

        for (var j = 0; j < banners.length; j++) {
            addPage(banners[j], null, j + 1);
        }

        if (this.pageView && this.pageView.indicator && this.pageView.indicator._indicators) {
            for (var k = 0; k < this.pageView.indicator._indicators.length; k++) {
                if (k >= pageLen) {
                    this.pageView.indicator._indicators[k].destroy();
                }
            }
        }

        this.pageView.node.off(cc.Node.EventType.TOUCH_START, this.startFunc);
        this.pageView.node.on(cc.Node.EventType.TOUCH_START, this.startFunc, this);
        this.pageView.node.off(cc.Node.EventType.TOUCH_END, this.scrollEndFunc);
        this.pageView.node.on(cc.Node.EventType.TOUCH_END, this.scrollEndFunc, this);
        this.pageView.node.off(cc.Node.EventType.TOUCH_CANCEL, this.scrollEndFunc);
        this.pageView.node.on(cc.Node.EventType.TOUCH_CANCEL, this.scrollEndFunc, this);

        this._maxPageLen = pageLen;
        this.pageView.node.off("scroll-ended", this.scrollEndFunc);
        this.pageView.node.on("scroll-ended", this.scrollEndFunc, this);
        if (pageLen > 0) {
            this.pageView.scrollToPage(0, 0);
        }
    },

    startFunc() {
        this._pageTime = 0;
    },

    scrollEndFunc(event, isInit) {
        if (this.pageView.getCurrentPageIndex() >= this._maxPageLen || isInit) {
            this.pageView.scrollToPage(0, 0);
        }

        this._curPage = this.pageView.getCurrentPageIndex();
        this._pageTime = 0;
    },

    onClickAdvertPage(event, customEventData) {
        UIFrame.showTips("敬请期待")
        return
        let index = Number(customEventData);
        if (index == 5) {
            let wrapper = app.ClubViews;
            let path = "main-hall/resources/prefab/";
            let name = "HallCustomerInfo";
            path = wrapper.path(name, null, path);
            wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
                if (!error && cc.isValid(this)) {
                    let node = cc.instantiate(prefab);
                    this.getAddNode().addChild(node, 0, name);
                    let com = node.getComponent(name);
                    if (com) {
                        com.init();
                    }
                } else {
                    cc.error("onClickAdvertPage loadui error = ", error)
                }

            }.bind(this))
        } else if (index == 6) {
            this.onClickItem({ nGameId: clubGameConfig.CLUB_GAME_CONFIG.Texas, sTableId: "", nLiveUserID: 0, nNowCnt: 0, nCapacity: 9 })
        } else if (index == 7) {
            //打开推荐活动
            MsgManager.fire(MSG.NOTIFY.CLUB_OPEN_ACTIVITY_UI, 4);
        } else if (index == 8) {
            //打开充值活动
            MsgManager.fire(MSG.NOTIFY.CLUB_OPEN_ACTIVITY_UI, 3);
        } else if (index == 9) {
            //打开分享活动
            MsgManager.fire(MSG.NOTIFY.CLUB_OPEN_ACTIVITY_UI, 2);
        } else if (index == 10) {
            //打开签到活动
            MsgManager.fire(MSG.NOTIFY.CLUB_OPEN_ACTIVITY_UI, 1);
        } else if (index == 11) {
            //打开绑定活动
            MsgManager.fire(MSG.NOTIFY.CLUB_OPEN_ACTIVITY_UI, 5);
        }
    },

    //初始化游戏按钮列表
    initGameMenu() {
        let openGameList = HallClubLogic.getOpenGameId();

        let labelTitle = this.gameMenuList[0].getChildByName("label_title").getComponent(cc.Label);
        labelTitle.lang = "CLUB_HALL.ALL_GAME";
        labelTitle._forceUpdateRenderData(true);
        this.gameMenuList[0].getComponent(cc.Layout).updateLayout();

        for (let i = 1; i < 5; i++) {
            this.gameMenuList[i].active = false;
        }

        if (!openGameList || openGameList.length == 0) {
            return;
        }

        if (openGameList.length == 1) {
            return;
        }

        for (let i = 0; i < openGameList.length; i++) {
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
                let labelTitle = this.gameMenuList[1].getChildByName("label_title").getComponent(cc.Label);
                labelTitle.lang = "HALL_CLUB_GAME_NAME." + openGameList[i];
                labelTitle._forceUpdateRenderData(true);
                this.gameMenuList[1].active = true;
            }
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
                let labelTitle = this.gameMenuList[2].getChildByName("label_title").getComponent(cc.Label);
                labelTitle.lang = "HALL_CLUB_GAME_NAME." + openGameList[i];
                labelTitle._forceUpdateRenderData(true);
                this.gameMenuList[2].active = true;
            }
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.Omaha) {
                let labelTitle = this.gameMenuList[3].getChildByName("label_title").getComponent(cc.Label);
                labelTitle.lang = "HALL_CLUB_GAME_NAME." + openGameList[i];
                labelTitle._forceUpdateRenderData(true);
                this.gameMenuList[3].active = true;
            }
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
                let labelTitle = this.gameMenuList[4].getChildByName("label_title").getComponent(cc.Label);
                labelTitle.lang = "HALL_CLUB_GAME_NAME." + openGameList[i];
                labelTitle._forceUpdateRenderData(true);
                this.gameMenuList[4].active = true;
            }

            this.gameMenuList[i].getComponent(cc.Layout).updateLayout();
        }



    },

    requestClubList() {
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetUserClubListReq_CMD, params);
    },


    /*
    *更新选中模块的名字
    *name：模块的名字（例如“大厅”、“俱乐部A"....)
    */
    updateModuleName(name) {
        this.label_moduleName.string = name;
        this.label_moduleName.node.stopAllActions();
        this.label_moduleName._forceUpdateRenderData(true);
        MsgManager.fire(MSG.NOTIFY.LABEL_RUN_ACTION, this.label_moduleName.node);

    },

    /*
    *更新选中模块的货币数值
    *nmoney：货币数值
    */
    updateMoney(money) {
        this.label_money.string = Utils.convertNumberToStr(money);
        this.label_gold.string = Utils.convertNumberToStr(money);

        let clubData = HallClubCacheData.getCurClubData();
        let sprite = this.label_money.node.parent.getComponent(cc.Sprite);
        if (clubData.nClubId) {
            sprite.spriteFrame = this.goldTypRes[1];
        } else {
            sprite.spriteFrame = this.goldTypRes[0];
        }
    },

    showBtnCreatTable() {
        let curClubId = HallClubCacheData.getCurLoginClub();
        // if (curClubId == 0){
        //     this.label_creatTable.node.parent.active = true;
        //     return;
        // }
        if (HallClubLogic.isClubCreator() || HallClubLogic.isCanMangeGame()) {
            this.label_creatTable.node.parent.active = true;
        } else {
            this.label_creatTable.node.parent.active = false;
        }
    },

    //开桌
    setCreateTableName() {
        this.label_creatTable.lang = "CLUB_HALL.CREATE_TABLE";
    },

    updateTableData() {

    },

    updateMenu(data) {
        let clubData = HallClubCacheData.getCurClubData();
        if (clubData) {
            if (clubData.nClubId > 0) {
                this.updateMoney(clubData.tMyself.nClubGold);
                this.updateModuleName(clubData.sClubName);
            } else {
                this.updateMoney(clubData.tMyself ? clubData.tMyself.nGold : 0);
                this.updateModuleName(i18n.t("CLUB_HALL.HALL"));
            }
        }

        if (!this.menuScview) {
            return;
        }

        if (!HallClubLogic.isShowClub()) {
            return;
        }

        if (!data || data.length == 0) {
            // this.info_node.active = false;
            return;
        }

        // this.info_node.active = true;
        // tmpData.splice(0, 0, {nClubId: 0, sClubName: i18n.t("CLUB_HALL.HALL")});
        let len = data.length;

        if (len > 5) {
            len = 5
        }

        let item = cc.instantiate(this.menuItem);
        let height = item.height;
        this.menuScview.reset_size(this.menuScrollview.node.width, height * len)

        this.updateMenuScrollView(data);
    },

    updateInfo(data) {
        let playerData = HallClubCacheData.getPlayerData();
        if (data.nClubId != 0) {
            this.updateMoney(playerData.nClubGold || 0);
            this.updateModuleName(data.sClubName);
        } else {
            this.updateMoney(playerData.nGold || 0);
            this.updateModuleName(i18n.t("CLUB_HALL.HALL"));
        }

        let clubList = HallClubCacheData.getClubList();
        this.updateMenu(clubList);

        //this.showBtnCreatTable();
    },

    //初始化滚动列表
    initTableList() {
        QYLogs.log(TAG, "----------------initList---------------");

        let widget = this.tableScrollview.node.getComponent(cc.Widget);
        let mWidget = this.tableMask.getComponent(cc.Widget);
        widget.updateAlignment();
        mWidget.updateAlignment();

        // //调用构造函数，传入构造参数
        // this.tableScview = new DynamicListView({
        //     scrollview: this.tableScrollview,
        //     mask: this.tableMask,
        //     content: this.tableItmeContent,
        //     item_templates:  [
        //         { key: "item1", node: this.tableItem },
        //     ],
        //     cb_host: this,
        //     //设置item的回调方法
        //     item_setter: this.item_setter1,
        //     gap_y: 0,
        //     gap_x: 0,
        //     auto_scrolling: false,
        //     //滚动方向，1为垂直，2为水平
        //     direction: 1,
        //     scroll_to_end_cb: this.scroll_to_end_cb1,
        //     not_auto_render: true,
        // });

        //调用构造函数，传入构造参数
        this.menuScview = new DynamicListView({
            scrollview: this.menuScrollview,
            mask: this.menuMask,
            content: this.menuItmeContent,
            item_templates: [
                { key: "item2", node: this.menuItem },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter2,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter1(node, key, data, index) {
        if (node.tableData && node.tableData.sTableId == data.sTableId
            && node.tableData.nUseTime == data.nUseTime && node.tableData.nNowCnt == data.nNowCnt) {
            return [node.width, node.height];
        }

        let item = node.getComponent("HallGameItem");
        if (node.tableData && node.tableData.sTableId == data.sTableId) {
            if (node.tableData.nNowCnt != data.nNowCnt) {
                item.initItem(data, true);
            } else {
                item.initItem(data);
            }
        } else {
            item.initItem(data);
        }




        let button = node.getComponent(cc.Button);
        button.node.off(cc.Node.EventType.TOUCH_END);
        button.node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data);
        }.bind(this))

        node.tableData = Utils.clone(data);

        return [node.width, node.height];
    },

    scroll_to_end_cb1(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;

        if (this._curGameId != 0) {
            //全部的游戏分页获取，其他游戏分批发送
            return;
        }

        if (this._tableList && this._tableList[this._tableList.length - 1]
            && this._tableList[this._tableList.length - 1].nTableIndex) {
            this.getClubTableList(this._tableList[this._tableList.length - 1].nTableIndex);
        }
    },

    updateTableScrollView(listData) {
        //设置列表item数据
        let dataArr = listData;
        this._tableList = listData;

        // 如果启用了排序，对数据进行排序
        if (this._isSortEnabled && this._tableList.length > 0) {
            this.onClickBtnMinBuy();
        } else {
            this.listView.resetData(dataArr);
        }
    },

    // 获取排序后的牌桌列表
    _getSortedTableList(tableList) {
        if (!tableList || tableList.length === 0) {
            return tableList;
        }

        return [...tableList].sort((a, b) => {
            // 获取当前人数和容量
            let aCurrentCnt = a.nNowCnt || 0;
            let aCapacity = a.nCapacity || 9;
            let bCurrentCnt = b.nNowCnt || 0;
            let bCapacity = b.nCapacity || 9;

            // 计算占用率
            let aOccupancyRate = aCurrentCnt / aCapacity;
            let bOccupancyRate = bCurrentCnt / bCapacity;

            // 满员的牌桌排在最后
            if (aCurrentCnt >= aCapacity && bCurrentCnt < bCapacity) {
                return 1;
            }
            if (bCurrentCnt >= bCapacity && aCurrentCnt < aCapacity) {
                return -1;
            }
            if (aCurrentCnt >= aCapacity && bCurrentCnt >= bCapacity) {
                // 都是满员，按桌号排序
                return (a.nTableIndex || 0) - (b.nTableIndex || 0);
            }

            // 都不满员，按占用率降序排列（占用率高的在前）
            if (Math.abs(bOccupancyRate - aOccupancyRate) > 0.01) {
                return bOccupancyRate - aOccupancyRate;
            }

            // 占用率相近时，按桌号排序
            return (a.nTableIndex || 0) - (b.nTableIndex || 0);
        });
    },

    // 对牌桌列表进行排序并更新显示
    _sortAndUpdateTableList() {
        if (!this._tableList || this._tableList.length === 0) {
            return;
        }

        let sortedList;
        if (this._isSortEnabled) {
            // 启用排序：按座位占用率排序，优先显示接近满员但未满的牌桌
            this._sortTableListByType(this._currentSortType);
        } else {
            // 禁用排序：按原始桌号排序
            sortedList = [...this._tableList].sort((a, b) => {
                return (a.nTableIndex || 0) - (b.nTableIndex || 0);
            });
            // 更新显示
            this.listView.resetData(sortedList);
        }

    },

    //向列表末端插入新的数据
    appendData(data, isOpen) {
        if (isOpen) {
            this._tableList.unshift(data[0]);
        } else {
            for (let i = 0; i < data.length; i++) {
                this._tableList.push(data[i]);
            }
        }

        //设置列表item数据
        let dataArr = data;

        // 如果启用了排序，需要重新排序整个列表
        if (this._isSortEnabled) {
            this._sortAndUpdateTableList();
        } else {
            this.listView.onLoadMoreFinish(dataArr, isOpen);
        }
    },

    updateMenuScrollView(listData) {
        QYLogs.log(TAG, "----------------updateMenuScrollView---------------", listData);
        //设置列表item数据
        let dataArr = listData;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item2",
                data: dataArr[i]
            }
            allData.push(Data);
        }
        //设置数据，key为item样式，data为数据

        this.menuScview.set_data(allData);
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter2(node, key, data, index) {
        let label_name = node.getChildByName("mask").getChildByName("label_name").getComponent(cc.Label);
        if (label_name) {
            label_name.string = data.sClubName;
            let icon = node.getChildByName("icon").getComponent(cc.Sprite);
            if (icon) {
                let tag = 0;
                if (data.nClubId != 0) {
                    tag = 1;
                }
                icon.spriteFrame = this.iconList[tag]
            }
        }

        node.off(cc.Node.EventType.TOUCH_END);
        if (!node.getComponent("UISound")) {
            node.addComponent("UISound");
        }
        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickMenuItem(data);
        }.bind(this))

        label_name.node.stopAllActions();
        label_name._forceUpdateRenderData(true);
        MsgManager.fire(MSG.NOTIFY.LABEL_RUN_ACTION, label_name.node);

        return [node.width, node.height];
    },

    //显示俱乐部列表
    onClickShowMoreMenu(event) {
        if (this._isShowMoreMenu) {
            this.moreMenu.active = false;
            this.up.active = false;
            this.down.active = true;
            this.btn_bg.active = false;
        } else {
            this.moreMenu.active = true;
            this.up.active = true;
            this.down.active = false;
            this.btn_bg.active = true;
        }

        this._isShowMoreMenu = !this._isShowMoreMenu;
    },

    //点击俱乐部列表切换俱乐部
    onClickMenuItem(data) {
        this.onClickShowMoreMenu();
        let loginId = HallClubCacheData.getCurLoginClub();
        if (loginId == data.nClubId) {
            return;
        }

        HallClubCacheData.setCurLoginClub(data.nClubId);

        let params =
        {
            nUserId: UserInfo.getInfo().nUserID,
            nNewClubId: data.nClubId,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSwitchReq_CMD, params);

    },

    //点击创建牌桌按钮
    onClickCreateGame() {
        let prefab = this.prefab_createGame;
        if (prefab) {
            let node = cc.instantiate(prefab);
            let createGameComponent = node.getComponent("HallCreateGame");
            if (createGameComponent) {
                createGameComponent.onInit({ isCreateTemplate: false });
            }
            this.getAddNode().addChild(node, 1024);
        }
    },

    //点击筛选按钮
    onClickScreen() {
        this.screenNode.active = true;
        let component = this.screenNode.getComponent("HallGameScreen");
        if (component) {
            let param = {
                nGameId: this._curGameId,
                callBack: function (result) {
                    let sScreen = result;
                    sScreen.isVacancy = this._isSelectEmpty;
                    this.getScreenTableList(sScreen);
                }.bind(this),
            }
            component.init(param)
        }
    },

    //点击关闭筛选按钮
    onClickCloseScreen() {
        this.screenNode.active = false;
    },

    //点击客服
    onClickService() {
        let userInfo = UserInfo.getInfo();
        HallClubLogic.openCustomerService(userInfo.strNickName, userInfo.nUserID);
    },

    //点击游戏获取游戏牌桌列表
    onClickGame(event, customEventData) {
        let num = Number(customEventData);
        this._sScreen = null;

        if (this._isSelectEmpty) {
            this._sScreen = {};
            this._sScreen.isVacancy = this._isSelectEmpty;
        }

        let sWidth = this.gameScrollview.node.width;
        let cWidth = this.gameScrollview.content.width;

        switch (num) {
            case 1:
                //全部游戏牌桌列表
                this._curGameId = 0;
                this.getClubTableList(0);
                // this.btn_screen.active = false;
                if (cWidth > sWidth) {
                    this.gameScrollview.scrollToLeft();
                }

                break;
            case 2:
                //德州游戏牌桌列表
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Texas;
                this.getClubTableList(0);
                // this.btn_screen.active = true;
                break;
            case 3:
                //短牌游戏牌桌列表
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;
                this.getClubTableList(0);
                // this.btn_screen.active = true;
                break;
            case 4:
                //奥马哈游戏牌桌列表
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Omaha;
                this.getClubTableList(0);
                // this.btn_screen.active = true;
                break;
            case 5:
                //抢庄牛牛牌桌列表
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang;
                this.getClubTableList(0);
                // this.btn_screen.active = false;
                if (cWidth > sWidth) {
                    this.gameScrollview.scrollToRight();
                }
                break;

        }

        this.setGameBtnStatus(num);
    },

    //点击空位按钮
    onClickEmpty(event) {
        let nor = event.target.getChildByName("nor");
        let sel = event.target.getChildByName("sel");

        if (nor.active) {
            this._isSelectEmpty = true;
            nor.active = false;
            sel.active = true;
        } else {
            this._isSelectEmpty = false;
            nor.active = true;
            sel.active = false;
        }

        if (this._sScreen) {
            this._sScreen.isVacancy = this._isSelectEmpty;
        } else {
            this._sScreen = { isVacancy: this._isSelectEmpty };
        }

        this.getScreenTableList(this._sScreen);
    },

    //点击空位
    onClickKongWeiToggle(event) {
        // this.test()
        //console.log('onClickKongWeiToggle ',event.isChecked)
        if (event.isChecked) {
            this._isSelectEmpty = true;
        } else {
            this._isSelectEmpty = false;
        }

        if (this._sScreen) {
            this._sScreen.isVacancy = this._isSelectEmpty;
        } else {
            this._sScreen = { isVacancy: this._isSelectEmpty };
        }

        this.getScreenTableList(this._sScreen);
    },
    //把需要控制的label放数组中控制
    initSortLabelTab() {
        if (this.hall_sort_node) {
            var bgNode = this.hall_sort_node.getChildByName("bgSprite")
            const length = Object.keys(Sort_Type).length;
            for (var i = 0; i < length; i++) {
                var btnBode = bgNode.getChildByName("sortBtn" + i)
                var label = btnBode.getChildByName("Background").getChildByName("Label").getComponent(cc.Label)
                if (label) {
                    this._sortLabelControlTab.push(label)
                }
            }
        }
    },
    //关闭排序界面
    onClickCloseSortLayout() {
        if (this.hall_sort_node) {
            this.hall_sort_node.active = false
        }
        this._isSortEnabled = true;
    },

    //点击排序
    onClickSortToggle(event) {
        //console.log('onClickSortToggle ',this._sortLabelControlTab)

        if (this.hall_sort_node) {
            this.hall_sort_node.active = true
        }
        // Store sort state
        this._isSortEnabled = true;

        if (this._sortLabelControlTab) {
            for (var i = 0; i < this._sortLabelControlTab.length; i++) {
                var label = this._sortLabelControlTab[i]
                label.node.color = new cc.Color(100, 115, 130)
            }
            var current_label = this._sortLabelControlTab[this._currentSortType]
            if (current_label) {
                current_label.node.color = new cc.Color(3, 255, 133)
            }
        }
    },
    //空座排序
    onClickBtnKongZuo() {
        //console.log('空座排序  点击 ')
        this._sortTableListByType(Sort_Type.kongZuo);
        this.onClickCloseSortLayout()
        if (this.hall_sort_current_label) {
            this.hall_sort_current_label.string = "空座"
        }
    },
    //满座排序
    onClickBtnManZuo() {
        //console.log('满座排序  点击 ')
        this._sortTableListByType(Sort_Type.manZuo);
        this.onClickCloseSortLayout()
        if (this.hall_sort_current_label) {
            this.hall_sort_current_label.string = "满座"
        }
    },
    //最小(盲注+前注)
    onClickBtnMinBuy() {
        //console.log('最小(盲注+前注)排序  点击 ')
        this._sortTableListByType(Sort_Type.minMangzhu);
        this.onClickCloseSortLayout()
        if (this.hall_sort_current_label) {
            this.hall_sort_current_label.string = "初级"
        }
    },
    //最大(盲注+前注)
    onClickBtnMaxBuy() {
        //console.log('最大(盲注+前注)排序  点击 ')
        this._sortTableListByType(Sort_Type.maxMangzhu);
        this.onClickCloseSortLayout()
        if (this.hall_sort_current_label) {
            this.hall_sort_current_label.string = "高级"
        }
    },
    // 对牌桌列表进行排序并更新显示
    _sortTableListByType(sortType) {
        if (!this._tableList || this._tableList.length === 0) {
            return;
        }
        this._currentSortType = sortType
        let sortedList;
        if (this._isSortEnabled) {

            if (sortType == Sort_Type.kongZuo) {
                sortedList = [...this._tableList].sort((a, b) => {
                    //空座筛选，空桌数，其次开桌，其次倒计时
                    if ((a.nCapacity - a.nNowCnt) == (b.nCapacity - b.nNowCnt)) {
                        if ((a.nNowCnt >= a.nStartAtLeast && b.nNowCnt >= b.nStartAtLeast)
                            || (a.nNowCnt < a.nStartAtLeast && b.nNowCnt < b.nStartAtLeast)
                        ) {
                            return (b.nKeepTime - b.nUseTime) - (a.nKeepTime - a.nUseTime)
                        } else {
                            return (b.nNowCnt >= b.nStartAtLeast) - (a.nNowCnt >= a.nStartAtLeast)
                        }

                    } else {
                        return (b.nCapacity - b.nNowCnt) - (a.nCapacity - a.nNowCnt);
                    }


                });
            } else if (sortType == Sort_Type.manZuo) {
                sortedList = [...this._tableList].sort((a, b) => {
                    // return (b.nNowCnt || 0) - (a.nNowCnt || 0);
                    //满座筛选，优先开桌，其次空位数，其次已座人数
                    if ((a.nNowCnt >= a.nStartAtLeast && b.nNowCnt >= b.nStartAtLeast)
                        || (a.nNowCnt < a.nStartAtLeast && b.nNowCnt < b.nStartAtLeast)
                    ) {
                        if ((a.nCapacity - a.nNowCnt) == (b.nCapacity - b.nNowCnt)) {
                            return b.nNowCnt - a.nNowCnt
                        } else {
                            return (a.nCapacity - a.nNowCnt) - (b.nCapacity - b.nNowCnt)
                        }
                    } else {
                        return (b.nNowCnt >= b.nStartAtLeast) - (a.nNowCnt >= a.nStartAtLeast)
                    }

                });
            } else if (sortType == Sort_Type.minMangzhu) {

                // 小盲+前注，最小排序 — 按用户要求的优先级：
                // 第一优先级：有人未满 > 已满 > 无人空座
                // 第二优先级：剩余空座（越少越靠前，即更接近满员优先）
                // 第三优先级：房间座位数（nCapacity，越小越靠前）
                sortedList = [...this._tableList].sort((a, b) => {
                    const aNow = a.nNowCnt || 0;
                    const bNow = b.nNowCnt || 0;
                    const aCap = a.nCapacity || 0;
                    const bCap = b.nCapacity || 0;

                    // group rank: 0 = 有人且未满, 1 = 已满, 2 = 无人空座
                    function groupRank(now, cap) {
                        if (now > 0 && now < cap) return 0;
                        if (now >= cap) return 1;
                        return 2;
                    }

                    const ra = groupRank(aNow, aCap);
                    const rb = groupRank(bNow, bCap);
                    if (ra !== rb) {
                        return ra - rb; // 按组优先级排序
                    }

                    // 第二优先级：剩余空座数（越少越靠前）
                    const aRemain = aCap - aNow;
                    const bRemain = bCap - bNow;
                    if (aRemain !== bRemain) {
                        return aRemain - bRemain;
                    }

                    // 第三优先级：房间座位数（nCapacity，越小越靠前）
                    if (aCap !== bCap) {
                        return aCap - bCap;
                    }

                    const aBlind = (a.nSmallBlind || 0) + (a.nPreAnte || 0);
                    const bBlind = (b.nSmallBlind || 0) + (b.nPreAnte || 0);

                    // 同盲注+前注时，保留原有的开桌/倒计时逻辑
                    if (aBlind === bBlind) {
                        if ((a.nNowCnt >= a.nStartAtLeast && b.nNowCnt >= b.nStartAtLeast)
                            || (a.nNowCnt < a.nStartAtLeast && b.nNowCnt < b.nStartAtLeast)
                        ) {
                            return (b.nKeepTime - b.nUseTime) - (a.nKeepTime - a.nUseTime);
                        } else {
                            return (b.nNowCnt >= b.nStartAtLeast) - (a.nNowCnt >= a.nStartAtLeast);
                        }
                    } else {
                        // 小盲+前注从小到大
                        return aBlind - bBlind;
                    }

                });
            } else if (sortType == Sort_Type.maxMangzhu) {
                // 小盲+前注，最大排序 — 按用户要求的优先级：
                // 第一优先级：有人未满 > 已满 > 无人空座
                // 第二优先级：剩余空座（越少越靠前，即更接近满员优先）
                // 第三优先级：房间座位数（nCapacity，越小越靠前）
                sortedList = [...this._tableList].sort((a, b) => {
                    const aNow = a.nNowCnt || 0;
                    const bNow = b.nNowCnt || 0;
                    const aCap = a.nCapacity || 0;
                    const bCap = b.nCapacity || 0;

                    // group rank: 0 = 有人且未满, 1 = 已满, 2 = 无人空座
                    function groupRank(now, cap) {
                        if (now > 0 && now < cap) return 0;
                        if (now >= cap) return 1;
                        return 2;
                    }

                    const ra = groupRank(aNow, aCap);
                    const rb = groupRank(bNow, bCap);
                    if (ra !== rb) {
                        return ra - rb; // 按组优先级排序
                    }

                    // 第二优先级：剩余空座数（越少越靠前）
                    const aRemain = aCap - aNow;
                    const bRemain = bCap - bNow;
                    if (aRemain !== bRemain) {
                        return aRemain - bRemain;
                    }

                    // 第三优先级：房间座位数（nCapacity，越小越靠前）
                    if (aCap !== bCap) {
                        return aCap - bCap;
                    }

                    const aBlind = (a.nSmallBlind || 0) + (a.nPreAnte || 0);
                    const bBlind = (b.nSmallBlind || 0) + (b.nPreAnte || 0);

                    // 同盲注+前注时，保留原有的开桌/倒计时逻辑
                    if (aBlind === bBlind) {
                        if ((a.nNowCnt >= a.nStartAtLeast && b.nNowCnt >= b.nStartAtLeast)
                            || (a.nNowCnt < a.nStartAtLeast && b.nNowCnt < b.nStartAtLeast)
                        ) {
                            return (b.nKeepTime - b.nUseTime) - (a.nKeepTime - a.nUseTime);
                        } else {
                            return (b.nNowCnt >= b.nStartAtLeast) - (a.nNowCnt >= a.nStartAtLeast);
                        }
                    } else {
                        // 小盲+前注从大到小
                        return bBlind - aBlind;
                    }
                });
            }
        } else {
            // 禁用排序：按原始桌号排序
            sortedList = [...this._tableList].sort((a, b) => {
                return (a.nTableIndex || 0) - (b.nTableIndex || 0);
            });
        }
        // 更新显示
        this.listView.resetData(sortedList);
    },

    //点击体验
    onClickTiYanToggle(event) {

    },


    OnClickMenuToggle(event, customEventData) {

        // if (customEventData == '1') {
        //     this.onClickGame(null, 1)
        // } else if (customEventData == '2') {
        //     this.onClickGame(null, 2)
        // } else if (customEventData == '3') {
        //     this.onClickGame(null, 3)
        // }
        if (this.curToggle == Number(customEventData)) return
        this.curToggle = Number(customEventData)
        this.onClickGame(null, this.curToggle)
    },

    OnClickHeadEdit() {

    },



    //设置游戏按钮状态；
    setGameBtnStatus(index) {
        for (let i = 0; i < this.gameMenuList.length; i++) {
            let sprite = this.gameMenuList[i].getComponent(cc.Sprite);
            let label_title = this.gameMenuList[i].getChildByName("label_title");
            if (index == (i + 1)) {
                sprite.enabled = true;
                label_title.color = new cc.Color(246, 203, 137, 255);
            } else {
                sprite.enabled = false;
                label_title.color = new cc.Color(149, 147, 159, 255);
            }
        }
    },

    getAddNode() {
        return this.node.parent.parent.getChildByName("popup");
    },

    onClickItem(data) {
        let callBack = function (password) {
            cc.log("输入密码回调 ", password);

            let config = {
                nGameId: data.nGameId,
                sTableId: data.sTableId,
                nPass: password,
                // sGamePath: "live-Texas",
                isFull: !HallClubLogic.isPlayerFullCanEnterGame() && data.nLiveUserID == 0 && data.nNowCnt == data.nCapacity,
            }

            this._enterGameData = config;
            this.checkEnterGame(data.nGameId);

            // let params = {
            //     nChatType: 1,
            //     sTableId: data.sTableId,
            //     nUserId: UserInfo.getInfo().nUserID,
            // }

            // app.net.send(CMD_CHAT.CHAT.value, CMD_CHAT.CHAT.ChatLogonReq_CMD, params);

            // let ChatMessageMgr = require("ChatMessageMgr");
            // if(ChatMessageMgr){
            //     if(!ChatMessageMgr.isLogin() && ChatMessageMgr.isInit()){
            //         ChatMessageMgr.loginChatServer(data.sTableId,1)
            //     }
            // }
        }

        let userInfo = UserInfo.getInfo();
        if (data.nIsPerson == 1 && data.nLiveUserID != userInfo.nUserID) {
            //     // this.node.parent.parent.parent.getComponent("HallScene").showInputRoomPassword(this.getAddNode(),{callBack: callBack.bind(this)});
            UIFrame.showInputRoomPassword(this.getAddNode(), { callBack: callBack.bind(this), sTableId: data.sTableId });
        } else {
            callBack.call(this, "");
        }


        return;

    },

    OnClickRecharge() {
        let prefab = this.prefab_recharge;
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickCopyId() {
        // let userId = UserInfo.getInfo().nUserID;
        Utils.copyToClipBoard('88888');

        // this.createTestWebView()

    },
    createTestWebView() {
        let testWebView = new cc.Node("testWebView");
        let scene = cc.director.getScene();
        testWebView.parent = scene;

        // 添加 WebView 组件
        let wjs = testWebView.addComponent(cc.WebView);

        // 添加 Widget 用于全屏适配
        let widget = testWebView.addComponent(cc.Widget);

        // 设置 Widget 全屏适配
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;

        // 设置 WebView 尺寸为全屏（可省略，Widget 会自动控制）
        testWebView.width = cc.winSize.width;
        testWebView.height = cc.winSize.height;

        // 设置 WebView 加载 URL
        wjs.url = 'https://rawgit.com/joaokucera/unity-blackjack/master/build/webgl/index.html';


    },

    OnClickTiXian() {
        let prefab = this.prefab_cash;
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickHistory() {
        let prefab = this.prefab_history;
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    //点击成员
    OnClickMember(event) {
        let index = event.target.name == "btn_member" ? 0 : 1
        // 转账功能判断
        let transferOpen = HallClubCacheData.getClubConfig();
        if (index == 1 && transferOpen && transferOpen.open === 0) {
            UIFrame.showTips('暂未开启红包功能');
            return
        }

        // if(index == 1 && !this.checkEmailAndPayPassword()) {
        //     return
        // }


        let prefab = this.prefab_member;
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            let component = node.getComponent("HallClubMember")
            if (component) {
                component.openViewByIndex(index)
            }
        }
    },


    checkEmailAndPayPassword() {
        let info = UserInfo.getInfo()
        if (!info.sMail) {
            UIFrame.showTips('请先绑定邮箱')
            this.scheduleOnce(() => {
                this.loadBindEmail()
            }, 1)
            return false

        } else if (info.nOpenProtection != 1) {
            UIFrame.showTips('请先设置交易密码')
            this.scheduleOnce(() => {
                this.loadPayPassword()
            }, 1)
            return false
        }

        return true
    },


    loadBindEmail() {
        if (this.bindEmail) {
            let node = this.node.parent.parent.getChildByName("popup");
            let obj = cc.instantiate(this.bindEmail)
            node.addChild(obj)
            let component = obj.getComponent("HallMyBinding");
            if (component) {
                component.init(this, 2)
            }
        }
    },

    loadPayPassword() {
        if (this.payPassword) {
            let node = this.node.parent.parent.getChildByName("popup");
            let obj = cc.instantiate(this.payPassword)
            node.addChild(obj)
            let component = obj.getComponent("HallMyPayPassworld");
            if (component) {
                component.setData(function () {
                    this.checkEmailAndPayPassword()
                }.bind(this))
            }
        }
    },

    changeMailbox(mail) {
        if (mail) {
            UserInfo.setInfo({ sMail: mail })
            this.checkEmailAndPayPassword()
        }
    },

    _onSceneChangeNotify(data) {
        this.updateInfo(data);
    },


    getClubTableList(index, sScreen) {
        let clubId = HallClubCacheData.getCurLoginClub();
        if (clubId == null) {
            return;
        }

        if (this._sScreen) {
            sScreen = this._sScreen;
        }

        if (index == 0) {
            this._isEnd = false;
            this._tableList = [];
        }

        let params = {
            nClubId: clubId,
            nGameId: this._curGameId,
            nCnt: 15,
            nTableIndex: index,
        }

        if (sScreen) {
            params.sScreen = JSON.stringify(sScreen);
        }

        //console.log("请求牌局列表：",params)
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTableListReq_CMD, params);

    },

    //总用户数请求
    getClubSumUserCount() {
        cc.log("总用户数请求");
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSumUserCountReq_CMD, {});
    },

    _onGetTableList(data) {
        //console.log("返回牌局列表：",data)
        let list = [];
        let gameId = 0;
        for (let i = 0; i < data.arrTableInfo.length; i++) {
            let tmp = JSON.parse(data.arrTableInfo[i]);
            tmp.sTableName = Base64.decode(tmp.sTableName);
            list.push(tmp);
            gameId = tmp.nGameId;
        }

        if (this._curGameId != 0 && this._curGameId != gameId) {
            this.updateTableScrollView([]);
            return;
        }

        // list.sort(function(a, b){
        //     return b.nTableIndex - a.nTableIndex;
        // })

        if (data.arrTableInfo.length == 0 && this._curGameId == 0) {
            this._isEnd = true;
        }

        if (this._tableList.length == 0) {
            this.updateTableScrollView(list);
        } else {
            for (let i = 0; i < this._tableList.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    if (this._tableList[i].sTableId == list[j].sTableId) {
                        return;
                    }
                }
            }
            this.appendData(list);
        }

        this.tabel_count.string = `牌桌数:${this._tableList.length}`
    },

    _onOpenTableNotify(data) {
        let tmp = JSON.parse(data.sTableInfo);
        tmp.sTableName = Base64.decode(tmp.sTableName);
        if (this._curGameId == 0 || this._curGameId == tmp.nGameId) {
            if (this._tableList.length == 0) {
                this.updateTableScrollView([tmp]);
            } else {
                this.appendData([tmp], true);
            }
        }

        if (tmp.nLiveUserID == UserInfo.getInfo().nUserID) {
            this.onClickItem(tmp);
        }
    },

    _onCloseTabel(data) {
        this.listView.removeDataByCondition((param) => {
            if (param.sTableId == data.sTableId) {
                return true;
            }
        })

        for (let i = 0; i < this._tableList.length; i++) {
            if (this._tableList[i].sTableId == data.sTableId) {
                this._tableList.splice(i, 1);
                break;
            }

        }

    },

    _onUserInfoChangeNotify(data) {
        //this.showBtnCreatTable();
        if (data.sName) {
            // let nickName = Base64.decode(data.sName)
            // this.nick_name.string = Utils.getShortText(nickName, 14);
        }

        if (data.sFaceId) {
            // Utils.changeUserHead(this.head_icon, data.sFaceId);
        }
    },

    _onTableInfoNotify(data) {
        let isChange = false;
        let nNowCnt = 0;
        let nTableStatus = null;
        for (let i = 0; i < this._tableList.length; i++) {
            if (this._tableList[i].sTableId == data.sTableId) {
                let array = JSON.parse(data.sTableInfo);
                nNowCnt = this._tableList[i].nNowCnt;
                if (array.hasOwnProperty("nNowCnt")) {
                    this._tableList[i].nNowCnt = array.nNowCnt;
                    isChange = true;
                    nNowCnt = array.nNowCnt;
                }
                nTableStatus = this._tableList[i].nTableStatus;
                if (array.hasOwnProperty("nTableStatus")) {
                    this._tableList[i].nTableStatus = array.nTableStatus;
                    nTableStatus = array.nTableStatus;
                }
            }

        }

        let target = this.listView.queryCell((cell) => {
            if (cell.getData().sTableId == data.sTableId) {
                return true;
            }
        })

        if (target) {
            target.getData().nNowCnt = nNowCnt;
            target.getData().nTableStatus = nTableStatus;
            target.onRefresh();
        }

    },

    _onGetClubSumUserCountNotify(data) {
        cc.log("俱乐部总用户数返回：", data);
        this.label_memberNum.string = Utils.replaceAll(i18n.t("CLUB_HALL.CLUBSUMUSERCOUNT"), "XXX", data.nCount || 0);
    },

    //检查是否可进入子游戏
    checkEnterGame(nGameId) {
        app.hall.ctrl.checkInOtherGame(nGameId);
    },

    _onCheckEnterClubGame(data) {
        if (!this._enterGameData) {
            return;
        }
        if (data.nGameId == -1) {
            if (this._enterGameData.isFull) {
                //人数满了，不给进入
                UIFrame.showTips(i18n.t("CLUB_HALL_TIP.PLAYER_FULL"));
                return;
            }

            this.enterGame(this._enterGameData);
            this._enterGameData = null;
        } else if (data.nGameId == this._enterGameData.nGameId && data.sTableId == this._enterGameData.sTableId) {
            this.enterGame(this._enterGameData);
            this._enterGameData = null;
        } else {
            // let params = {
            //     text: i18n.t("COMMON.FAN_HUI_PAI_JU"),
            //     isOKAndCancel: true,
            //     callBack: function(isOK){
            //         if (isOK){
            //             this.enterGame(data);
            //             this._enterGameData = null;
            //         }   

            //     }.bind(this),
            // }
            // MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
            this.enterGame(data);
            this._enterGameData = null;
        }
    },

    enterGame(data) {
        let appkey = app.url.get("appkey");
        if (!appkey) {
            appkey = AppBridge.CLIENT_KEY;
        }
        let token = UserInfo.getInfo().token;
        let loginType = UserInfo.getLoginType();
        let viewer = 0;
        if (UserInfo.isViewer()) {
            viewer = 1;
            token = "";
        }
        let anchor = 0;
        if (app.getIsAnchor()) {
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
                nPass: data.nPass || "", //房间密码
                lang: lang,
                skin: skin,
                viewer: viewer,
                anchor: anchor,

                loginType: loginType, //网页版才有，指定登录方式，避免账号登录无效
            }
        }
        MsgManager.fire("message", { data: JSON.stringify(params) });
    },

    getScreenTableList(sScreen) {
        this._sScreen = sScreen;
        this.getClubTableList(0, sScreen)
    },

    onLoadMoreStart() {
        if (this._isEnd || this._curGameId != 0) {
            this.listView.onLoadMoreFinish();
            return;
        }

        if (this._tableList && this._tableList[this._tableList.length - 1]
            && this._tableList[this._tableList.length - 1].nTableIndex) {
            this.getClubTableList(this._tableList[this._tableList.length - 1].nTableIndex);
        }
    },

    _onRspClubConfig(data) {
        if (data && data.sClubConfig && data.sClubConfig != "") {
            let config = JSON.parse(data.sClubConfig);
            HallClubCacheData.setClubConfig(config.transferOpen);
            HallClubCacheData.setClubCoinConfig(config.costConfigs);
            HallClubCacheData.setClubTGServerConfig(config.linkConfigs);


        }
    },

    test() {
        this.updateTableScrollView([{}, {}, {}])
    },

});
