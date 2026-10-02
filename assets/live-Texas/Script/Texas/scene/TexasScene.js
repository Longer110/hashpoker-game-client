/*
    德州场景逻辑
*/

let SceneBase = require("SceneBase");
let CMD = require("protocol_texas");
let Utils = require("Utils");
const i18n = require('i18n');
let UserInfo = require("UserInfo");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let TexasConfig = require("TexasConfig");
let TexasUtils = require("TexasUtils");
let UIDialog = require("UIDialog");
let TexasData = require("TexasData");
let AppBridge = require("AppBridge");
var ConfigGame = require("ConfigGame");
let LocalStorage = require("LocalStorage");
let GameInstance = require("init_game");
let UIFrame = require("UIFrame");
let Base64 = require("base64");

let texasSpine = require("texasSpine");
let TexasPaoMa = require("texasPaoMa");
let TexasBuyTip = require("texasBuyTip");
let TexasTableCard = require("TexasTableCard");
let TexasOperatePanel = require("TexasOperatePanel");
let TexasRewardPool = require("TexasRewardPool");
let TexasSettingPanel = require("TexasSettingPanel");
let TexasHelpPanel = require("TexasHelpPanel");
let TexasPlayerController = require("TexasPlayerController");
let TexasMagicFaceController = require("TexasMagicFaceController");
let TexasDialog = require("texasDialog");
let TexasRecordPanel = require("TexasRecordPanel");
let texasMenuDefault = require("texasMenuDefault");
let TexasCardType = require("TexasCardType");
let TexasProcess = require("TexasProcess");
let TexasGameReview = require("TexasGameReview");
let TexasTableStop = require("TexasTableStop");
// let TexasInsurePanel = require("TexasInsurePanel");
let TexasTableInfo = require("TexasTableInfo");
let TexasRecordVideo = require("TexasRecordVideo");
let TexasRoomConfigPanel = require("TexasRoomConfigPanel");

let TexasServerLineView = require("TexasServerLineView");
let TexasGameBottomTip = require("TexasGameBottomTip");
let ChatMessageMgr = require("ChatMessageMgr");
let cutPokerView = require("cutPokerView");


let TexasMusicPath = TexasConfig.TEXASMUSICPATH;
let TexasSpine = TexasConfig.TEXASSPINE;

cc.Class({
    extends: SceneBase,

    properties: {
        panelContent: cc.Node,
        playerContent: cc.Node,
        meunBtn: cc.Node,//菜单按钮
        sitDownBtn: cc.Node,//坐下按钮
        standUpBtn: cc.Node,//站起按钮

        TexasPaoMa: TexasPaoMa,//跑马灯
        TexasBuyTip: TexasBuyTip,//补充筹码
        TexasGameBottomTip: TexasGameBottomTip,//补充筹码/撤码/保险合集节点
        TexasTableCard: TexasTableCard,//牌桌公共牌
        TexasOperatePanel: TexasOperatePanel,//操作按钮
        TexasRewardPool: TexasRewardPool,//奖池
        TexasPlayerController: TexasPlayerController,//玩家容器
        TexasMagicFaceController: TexasMagicFaceController,//魔法表情控制
        TexasDialog: TexasDialog,//提示
        TexasRecord: TexasRecordPanel,//战绩
        TexasSetting: TexasSettingPanel,//设置
        TexasHelp: TexasHelpPanel,//帮助
        texasMenuDefault: texasMenuDefault,//菜单
        TexasCardType: TexasCardType,//牌型说明
        TexasProcess: TexasProcess,//牌局总览
        TexasGameReview: TexasGameReview,//牌局回顾
        TexasTableStop: TexasTableStop,//牌桌开始暂停游戏
        // TexasInsurePanel: TexasInsurePanel,//低水保险
        TexasTableInfo: TexasTableInfo,//牌桌信息
        TexasRecordVideo: TexasRecordVideo,//战绩回放
        TexasRoomConfigPanel: TexasRoomConfigPanel,//房间配置

        tableInfo: cc.Label,
        clubTableInfo: cc.Label,
        // inSureLogo:cc.Node,//保险标识
        carryMax: cc.Label,//带入筹码上限
        nGold: cc.Label,//余额

        chipContent: cc.Node,


        insureAni: cc.Node,//开启保险进场动画

        chatNode: cc.Node,

        timeAnim: cc.Node,//倒计时

        btnVoice: cc.Node,

        test_zanting: cc.Node,//暂停测试
        test_jixu: cc.Node,//继续测试
        test_roomConfig: cc.Node,//房间配置测试

        testVoice: cc.Node,//测试语音
        testMicState: cc.Node,//测试麦状态

        label_pool: cc.Node,//底池
        tipBlock: cc.Node,//提示
        backNode: cc.Node,//返回按钮
        menuBtn: cc.Node,//菜单按钮
        closeTableBtn: cc.Node,//关桌按钮
        occupyBtn: cc.Node,//留座离桌按钮
        stopBtn: cc.Node,//暂停按钮
        delayedBtn: cc.Node,//延时按钮
        backSeatBtn: cc.Node,//回到座位

        buyBtn: cc.Node,//购买按钮
        btnCarry: cc.Node,//撤码按钮

        nChip: cc.Node,//筹码
        nGenZhu: cc.Node,//跟注
        nGolds: cc.Node,//金币

        middleCard: cc.Node,//发牌位置
        bankIcon: cc.Node,//庄家标识位置

        panel_bottom: cc.Node,//菜单按钮

        menuLayout: cc.Node,
        menuPut: cc.Node,

        youWin: cc.Node,
        buyDelay: cc.Node,//购买延时

        itemChipPrefab: {//筹码预制
            default: null,
            type: cc.Prefab,
        },

        itemCardPrefab: {//卡牌预制
            default: null,
            type: cc.Prefab
        },

        itemTimePrefab: {//时间倒计时预制
            default: null,
            type: cc.Prefab
        },

        itemTablePrefab: {//牌桌预制
            default: null,
            type: cc.Prefab
        },

        inviteFriends: cc.Prefab,//邀请好友
        HallRechargeNew: cc.Prefab,//充币界面

        matchBtn: cc.Node,

        _chipArry: [],//筹码数组
        _exiting: false,

        panel_MTT: cc.Node,
        TexasMatchTip: cc.Node,
        TexasMttCenterTip: cc.Node,
        MttWaitStart: cc.Node,
        mttBuyChipBtn: cc.Node,
        panelMttBuyChip: cc.Node,
        panelMttRank: cc.Node,
        //下局站起提示
        standUpNextRoundTip: cc.Node,

        infoBg: cc.Node,
        insureBg: cc.Node,

        cutPokerView: cutPokerView, //切牌界面



        _canClick: true,
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this._updataCanvas();
        this.setWidthInGame();
        this._backgroundColor = "";
        this._super();
        this._controller = this.node.getComponent("TexasController");

        this._setNode();
        app.util.addClickSoundToNode(this.node);
        //音效
        let volume = LocalStorage.getEffectVolume();
        let firstEffect = cc.sys.localStorage.getItem("TexasEfffect");
        if (!firstEffect) {
            volume = 0.5;
            cc.sys.localStorage.setItem("TexasEfffect", "true");
        }
        LocalStorage.setEffectVolume(volume);



        let bg = LocalStorage.getItem("CLUB_GAME_BG");
        if (!bg) {
            bg = 4;
        }
        this._controller._onRepGameBg({ bg: bg });

        if (TexasUtils._getClub()) {
            //保险
            let path = "popup/Insure/TexasInsurePanel";
            app.texas.ui.loadPopup(path, function (component) {

            }.bind(this));
        }


        //回放多语言
        if (TexasUtils._getClubReback()) {
            let file = app.config.LANG + "_" + "Texas";
            let data = require(file);
            my.i18n.init(app.config.LANG, data);
        }

        //牌桌列表
        TexasData._lastTableId = 0;
        TexasData._TableData = [];
        this._setMenuLayout();

        TexasData._setIsOnload(true);

        this.panel_MTT.active = false

        if (this.TexasGameBottomTip) { //初始话页签为负数
            this.TexasGameBottomTip._targetIndex = -1
        }


    },
    onDestroy() {
        this._super();
        if (TexasData) {
            TexasData.isFreeGame();
        }

        ChatMessageMgr.leaveRoom()
    },

    start() {
        this._preloadAudios();
        this.loadChat();
        this.loadBulletChat();

        //加载洗牌存证界面
        this.loadCunZhengPanel();
        this.loadCutPokerPanel();


        //加载牌局结算界面
        this.loadGameOverPanel();

        //设置桌子参数文字颜色
        this._setTableInfoColor();
    },


    onEnable() {
        // if(this.btnVoice){
        //     this.btnVoice.on(cc.Node.EventType.TOUCH_START,this.ontTouchStart,this);
        //     this.btnVoice.on(cc.Node.EventType.TOUCH_END,this.ontToucheEnd,this);
        //     this.btnVoice.on(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancel,this);
        // }
    },
    onDisable() {
        // if(this.btnVoice){
        //     this.btnVoice.off(cc.Node.EventType.TOUCH_START,this.ontTouchStart,this);
        //     this.btnVoice.off(cc.Node.EventType.TOUCH_END,this.ontToucheEnd,this);
        //     this.btnVoice.off(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancel,this);
        // }
    },

    setWidthInGame() {
        cc.log("setWidthInGame");

        let viewSize = cc.view.getVisibleSize();//返回视图窗口可见区域尺寸
        let viewInfo = app.game.getViewInfo();
        let winSize = cc.view.getVisibleSizeInPixel();//返回视图窗口可见区域像素尺寸
        let top = viewInfo && viewInfo.top || 0;
        let bottom = viewInfo && viewInfo.bottom || 0;
        let height = viewInfo && viewInfo.height || winSize.height;
        this.heightIngame = viewSize.height - this.panelContent.height - top;

        if (TexasUtils._getSkin(["default", "d"])) {
            QYLogs.warn("winSize = ", winSize)
            let scaley = winSize.height / height;
            let scaley2 = cc.view.getScaleY();
            let contentHeight = (height - top - bottom) * scaley / scaley2;
            this.heightIngame = this.panelContent.height * scaley2;
            QYLogs.warn("heightIngame = ", this.heightIngame)

            if (this.heightIngame > contentHeight) {
                // this.panelContent.scale = contentHeight/this.heightIngame;
                this.label_pool.scale = contentHeight / this.heightIngame;
                this.TexasTableCard.node.scale = contentHeight / this.heightIngame;
                this.TexasRewardPool.node.scale = contentHeight / this.heightIngame;
            }

            let widget = this.panelContent.getComponent(cc.Widget);

            let chatType = TexasData._getChatType();

            if (app.url.get("live")) {
                widget.isAlignBottom = chatType == 2 ? false : true;
                widget.isAlignTop = chatType == 2 ? true : false;

                if (chatType == 2) {
                    widget.top = top;
                } else {
                    widget.bottom = bottom;
                }
            } else {
                bottom = bottom * scaley / scaley2;
                top = top * scaley / scaley2;

                widget.isAlignBottom = true;
                widget.isAlignTop = true;

                widget.top = top;
                cc.log("top,bottom:", top, bottom);
                widget.bottom = bottom;
            }

            widget.updateAlignment();
        }
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
        }
    },

    // update (dt) {},

    //预加载音频
    _preloadAudios() {
        cc.log("_preloadAudios");

        let array = [];

        let audioArry = ["man_", "woman_"];
        for (let i = 0; i < audioArry.length; i++) {
            let sex = audioArry[i];

            let qipai = sex + "qipai";
            let add = sex + "add";
            let allin = sex + "allin";
            let call = sex + "call";
            let huangjia = sex + "huangjia";
            let hulu = sex + "hulu";
            let jingang = sex + "jingang";
            let tonghua = sex + "tonghua";

            array.push("texas/game/" + qipai);
            array.push("texas/game/" + add);
            array.push("texas/game/" + allin);

            if (app.config.LANG == "vi") {
                array.push("texas/game/" + qipai + "_yn");
                array.push("texas/game/" + add + "_yn");
                array.push("texas/game/" + call + "_yn");
            } else if (app.config.LANG == "en" || app.config.LANG == "th") {
                array.push("texas/game/" + qipai + "_yy");
                array.push("texas/game/" + add + "_yy");
                array.push("texas/game/" + call + "_yy");
            }
            array.push("texas/game/" + call);
            array.push("texas/game/" + huangjia);
            array.push("texas/game/" + hulu);
            array.push("texas/game/" + jingang);
            array.push("texas/game/" + tonghua);
        }

        array.push("texas/game/click");
        array.push("texas/game/close");
        array.push("texas/game/daojishi");
        array.push("texas/game/fapai");
        array.push("texas/game/huodejinbi");
        array.push("texas/game/xiazhu");
        array.push("texas/game/cutPoker");


        array.push("texas/game/daojishi8");
        array.push("texas/game/fanpai");
        array.push("texas/game/feichouma");
        array.push("texas/game/guopai");
        array.push("texas/game/lundao");
        array.push("texas/game/qipai");
        array.push("texas/game/xiazhuClub");
        array.push("texas/game/magicAudio/bomb");
        array.push("texas/game/magicAudio/catchChicken");
        array.push("texas/game/magicAudio/cheers");
        array.push("texas/game/magicAudio/dianzan");
        array.push("texas/game/magicAudio/flower");
        array.push("texas/game/magicAudio/jiatelin");
        array.push("texas/game/magicAudio/kiss");
        array.push("texas/game/magicAudio/nice");
        array.push("texas/game/magicAudio/shayu1");
        array.push("texas/game/magicAudio/shayu2");
        array.push("texas/game/magicAudio/smoke");
        array.push("texas/game/magicAudio/stool");
        array.push("texas/game/magicAudio/tomato");

        let timeStart = Date.now();
        QYLogs.log("德州", "加载音频开始");
        app.texas.audio.preload(array, (params) => {
            QYLogs.log("德州", "加载音频完成: time=" + (Date.now() - timeStart) + "ms");
        });
    },

    _setNode() {
        this.panelContent = this.node.getChildByName("LayerView").getChildByName("content");
        this.playerContent = this.panelContent.getChildByName("player");
        let panel_top = this.panelContent.getChildByName("panel_top");
        this.panel_bottom = this.panelContent.getChildByName("panel_bottom");
        this.meunBtn = panel_top.getChildByName("menuBtn");

        let list1 = this.panelContent.getChildByName("menu").getChildByName("content").getChildByName("menu_bg").getChildByName("list1");
        this.sitDownBtn = list1.getChildByName("sitdownNode");
        this.standUpBtn = list1.getChildByName("standNode");
        this.TexasPaoMa = this.panelContent.getChildByName("paoma").getComponent("texasPaoMa")
        this.TexasPaoMa.node.active = false
        this.TexasGameBottomTip = this.panelContent.getChildByName("TexasGameBottomTip").getComponent("TexasGameBottomTip")
        this.TexasBuyTip = this.TexasGameBottomTip.contemtList[0].getComponent("texasBuyTip")
        this.TexasTableCard = this.panelContent.getChildByName("tableCards").getComponent("TexasTableCard")
        this.TexasOperatePanel = this.panelContent.getChildByName("operate").getComponent("TexasOperatePanel")
        this.TexasPlayerController = this.panelContent.getChildByName("player").getComponent("TexasPlayerController")
        this.TexasOperatePanel.TexasPlayerController = this.TexasPlayerController
        this.TexasOperatePanel.TexasController = this._controller
        this.TexasRewardPool = this.panelContent.getChildByName("rewardPool").getComponent("TexasRewardPool")
        this.TexasMagicFaceController = this.panelContent.getChildByName("magicFaceController").getComponent("TexasMagicFaceController")
        this.TexasRecord = this.panelContent.getChildByName("LayerRecord").getComponent("TexasRecordPanel")
        this.TexasSetting = this.panelContent.getChildByName("LayerSetting").getComponent("TexasSettingPanel")
        this.texasMenuDefault = this.panelContent.getChildByName("menu").getComponent("texasMenuDefault")
        this.TexasCardType = this.panelContent.getChildByName("LayerCardType").getComponent("TexasCardType")
        this.TexasProcess = this.panelContent.getChildByName("LayerTableProcess").getComponent("TexasProcess")
        this.TexasGameReview = this.panelContent.getChildByName("LayerGameReview").getComponent("TexasGameReview")
        this.TexasTableStop = this.panelContent.getChildByName("tableStop").getComponent("TexasTableStop")
        this.TexasTableInfo = this.panelContent.getChildByName("LayerTableInfo").getComponent("TexasTableInfo")
        this.TexasRecordVideo = this.node.getChildByName("LayerWidget").getChildByName("TexasRecordVideo").getComponent("TexasRecordVideo")
        this.TexasRoomConfigPanel = this.panelContent.getChildByName("LayerRoomConfig").getComponent("TexasRoomConfigPanel")

        let tableInfoNode = this.TexasTableCard.node.getChildByName("tableInfo")
        this.tableInfo = tableInfoNode.getChildByName("label_mangzhu").getComponent(cc.Label);
        this.clubTableInfo = tableInfoNode.getChildByName("layout").getChildByName("label").getComponent(cc.Label);
        this.carryMax = tableInfoNode.getChildByName("label_carry").getComponent(cc.Label);
        this.nGold = panel_top.getChildByName("infoBg").getChildByName("icon_gold").getChildByName("label").getComponent(cc.Label);
        this.chipContent = this.panelContent.getChildByName("chip");
        this.insureAni = this.panelContent.getChildByName("insureAni");
        this.insureAni.active = false
        this.chatNode = this.panelContent.getChildByName("chatNode");
        this.timeAnim = this.panelContent.getChildByName("timeAnim");
        this.btnVoice = this.panel_bottom.getChildByName("btnVoice");
        this.label_pool = this.panelContent.getChildByName("tableInfo").getChildByName("poolSumBg").getChildByName("label_pool");
        this.tipBlock = this.panelContent.getChildByName("block");
        this.backNode = panel_top.getChildByName("backNode").getChildByName("backNode");
        this.menuBtn = panel_top.getChildByName("mask").getChildByName("layout").getChildByName("menuBtn");
        this.closeTableBtn = list1.getChildByName("closeTableNode");
        this.occupyBtn = list1.getChildByName("occupiedNode");
        this.stopBtn = list1.getChildByName("stopNode");
        this.delayedBtn = this.panel_bottom.getChildByName("btnDelayed");
        this.backSeatBtn = this.panelContent.getChildByName("backSeatBtn");
        this.buyBtn = panel_top.getChildByName("btnBuy");
        this.btnCarry = panel_top.getChildByName("btnCarry");
        this.nChip = this.panelContent.getChildByName("chipPos");
        this.nGenZhu = this.panelContent.getChildByName("genzhu");
        this.nGolds = this.panelContent.getChildByName("gold");
        this.middleCard = this.panelContent.getChildByName("middleCard");
        this.bankIcon = this.panelContent.getChildByName("bankIcon");
        this.menuPut = panel_top.getChildByName("btnPut");
        this.youWin = this.panelContent.getChildByName("youwin");
        this.panel_MTT = this.panelContent.getChildByName("mtt");
        this.TexasMatchTip = this.node.getChildByName("LayerWidget").getChildByName("TexasMatchTip")
        this.TexasMttCenterTip = this.panel_MTT.getChildByName("mttTip")
        this.MttWaitStart = this.panel_MTT.getChildByName("mttWaitStart")
        this.mttBuyChipBtn = this.panel_MTT.getChildByName("btn_mttBuyChip")
        this.panelMttBuyChip = this.panelContent.getChildByName("LayerMttBuyChip")
        this.panelMttRank = this.panelContent.getChildByName("LayerTableMatchRank")
        this.standUpNextRoundTip = this.panelContent.getChildByName("LayerStandUpNextRoundTip");
        this.infoBg = panel_top.getChildByName("infoBg")
        this.insureBg = panel_top.getChildByName("insureBg")
    },

    _init() {
        let self = this;

        TexasUtils._setDzFrameRate(30);
        self._scheduleTime(self._updateDealCard);//关闭发牌定时器
        self._scheduleTime(self._updateChipToUser);//关闭奖池定时器

        self.chipPool = new cc.NodePool();//初始化对象池
        self._clearPool();

        self._setTimeAnim();
        if (TexasData._getIsOnload()) {
            self._initBtnPut(true);
            TexasData._setIsOnload(false);
        }

        TexasData.init();//初始化游戏数据

        if (TexasUtils._getClub()) {
            TexasData._setGame(self._setTexasGame());
        }

        self.TexasPlayerController._initPlayerControl(this);//初始化玩家类
        self.TexasPlayerController._clearPlayer();//删除牌桌玩家

        if (self.TexasMagicFaceController) {
            self.TexasMagicFaceController._initMagicFace(true);//初始化魔法表情面板
        }

        self._setSelfAllGold();//牌桌在线人数及余额
        self._setIsStandUp();//站起坐下
        self._closeMenu();//关闭菜单

        self._setBuyTip(false);//隐藏买入弹窗

        self.TexasPaoMa.close();//跑马灯

        self.TexasRewardPool._initSidePond(this);//初始化底池
        self.TexasTableCard._initTableCard();//初始化公共牌
        self.TexasOperatePanel._showOperateBtn();//初始化操作层

        if (self.texasMenuDefault) {
            self.texasMenuDefault._initMenu(this);
            self.texasMenuDefault._setRedPoint(false);
            self.texasMenuDefault.close();
        }

        if (self.TexasCardType) {
            self.TexasCardType.close();
        }

        if (self.TexasProcess) {
            self.TexasProcess.close();
        }

        if (self.TexasGameReview) {
            self.TexasGameReview.close("init");
        }

        if (self.TexasTableInfo) {
            self.TexasTableInfo.close();
        }

        if (self.TexasTableStop) {
            self.TexasTableStop._setTable();
        }

        // if (self.TexasInsurePanel) {
        //     self.TexasInsurePanel.node.active = false;
        // }
        self._hideInsurePanel();

        self._hideSettingPanel();

        self._hideCarryPanel(1);

        self._hideHelpPanel(1);

        self._hideDialogPanel(1);

        self._setBackSeat();



        this.btnVoice.getChildByName("close").active = true;
        this.btnVoice.getChildByName("open").active = false;
        this.btnVoice.getChildByName("lightMash").active = false;
        if (self.delayedBtn) {
            self.delayedBtn.active = false;
        }


        // 初始化新的下局站起按钮组
        this.texasMenuDefault.setNextRoundBtnShow(true, false, true);
        if (self.standUpNextRoundTip) {
            self.standUpNextRoundTip.active = false;
        }
        // 更新按钮状态
        self._updateStandUpNextRoundButtons();

        if (self.youWin) {
            self.youWin.opacity = 0;
        }
        if (TexasUtils._getSkin(["default", "d"]) && self.backNode && self.menuBtn) {
            self.backNode.active = ConfigGame.ISDEVELOP;
            self.menuBtn.active = ConfigGame.ISDEVELOP;
        }

        if (self.closeTableBtn) {
            self.closeTableBtn.active = false;
        }

        if (self.stopBtn) {
            self.stopBtn.active = false;
        }

        let playBackData = TexasUtils._getClubReback();
        if (playBackData || app.config.IS_PLAYBACK) {
            if (TexasUtils._getSkin(["c"]) && self.backNode) {
                // self.backNode.parent.active = true;
            }
            if (app.config.IS_PLAYBACK) {
                //网页分享的回放不需要显示返回按钮
                self.backNode.parent.active = false;
            }
            // 回放模式下隐藏余额信息
            if (self.infoBg) {
                self.infoBg.active = false;
            }
        } else {
            if (self.panel_bottom) {
                self.panel_bottom.active = true;
            }

            if (TexasUtils._getSkin(["c"]) && self.meunBtn) {
                self.meunBtn.active = true;
            }
        }

        if (TexasUtils._getSkin(["default", "d"]) && self.testVoice && self.testMicState) {
            self._setTestVoiceBtn();
            self.testVoice.active = ConfigGame.ISDEVELOP;
            self.testMicState.active = ConfigGame.ISDEVELOP;
        }

        if (self.test_roomConfig) {
            self.test_roomConfig.active = false;//房间配置测试
        }

        self.TexasRewardPool.node.active = true;
        this._setIsStandUp()
        if (self.TexasRecord) {
            self.TexasRecord.node.active = false;
        }
        if (self.TexasSetting) {
            self.TexasSetting.node.active = false;
        }

        // 非回放模式下隐藏 TexasRecordVideo
        if (!playBackData && !app.config.IS_PLAYBACK) {
            if (self.TexasRecordVideo && self.TexasRecordVideo.node) {
                self.TexasRecordVideo.node.active = false;
            }
        }

        if (TexasUtils._getSkin(["default", "b", "d"]) && self.TexasHelp) {
            self.TexasHelp.node.active = false;
        }

        if (self.TexasRoomConfigPanel) {
            self.TexasRoomConfigPanel.node.active = false;
        }

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            self.label_pool.active = false;
        }

        self._setClubTableInfo();

        self.tableInfo.node.active = false;
        self.bankIcon.active = false;
        self.tipBlock.active = false;
        this.panelContent.getChildByName("panel_top").active = true
    },


    //游戏重置
    _gameReset() {
        let info = UserInfo.getInfo();

        TexasUtils._setDzFrameRate(30);
        this._scheduleTime(this._updateDealCard);
        this._scheduleTime(this._updateChipToUser);

        this._clearPool();

        TexasData.gameReset();//重置游戏数据

        this._checkOverTime();//检测超时

        this._hideInsurePanel();//保险

        this.TexasPlayerController._ResetPlayer();//重置玩家

        this._closeMenu();

        this.TexasPaoMa.close();

        this.TexasRewardPool._initSidePond(this);
        this.TexasTableCard._initTableCard();
        this.TexasOperatePanel._showOperateJiaZhu(false);
        this.TexasOperatePanel._showOperateStateBtn(false);
        this.TexasOperatePanel._showOperateUnStateBtn(false);

        this._setIsStandUp()
        if (this.test_roomConfig && ConfigGame.ISDEVELOP && info.nUserID == TexasData._getLiveUserId()) {
            this.test_roomConfig.active = true;//房间配置测试
        }

        if (this.TexasRoomConfigPanel) {
            this.TexasRoomConfigPanel.node.active = false;
        }

        if (this.youWin) {
            this.youWin.opacity = 0;
        }

        this.TexasRewardPool.node.active = true;
        this.tipBlock.active = false;

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.label_pool.active = false;
        }

        // 更新新的下局站起按钮组状态
        if (this._updateStandUpNextRoundButtons) {
            this._updateStandUpNextRoundButtons();
        }


        this.TexasRewardPool._updateSumPool();

        //清除本轮下注筹码
        this.TexasRewardPool._clearTurnBetData();

        //刷新总底池文本
        this.TexasRewardPool._updateTotalPoolText();
        this._showWaitingForGameStartTip();
    },

    //断线重连成功后跳转子游戏
    _onGameReconnection(data) {
        let isXiaBo = TexasData._getIsXiaBo();
        if (this._controller && !isXiaBo) {
            this._controller.onReloadView();
        }


        // if (TexasUtils._getClub()) {
        //     let sTableId = app.game.getGame().getSubGameTableID();
        //     let ChatMessageMgr = require("ChatMessageMgr");
        //     ChatMessageMgr.loginChatServer(sTableId,1)
        // }


    },

    //     ontTouchStart(event) {
    //         if (!TexasUtils._getClub()) return;

    //         ChatMessageMgr.startRecorder(1)
    //         this._setClickVoiceLight(true)
    //     },

    //    ontToucheEnd(event) {
    //         if (!TexasUtils._getClub()) return;
    //         ChatMessageMgr.recordingComplete()
    //         this._setClickVoiceLight(false)
    //     },

    //     ontTouchCancel(event) {
    //         if (!TexasUtils._getClub()) return;

    //         let startPos = event.getStartLocation()
    //         let currentPos = event.getLocation()

    //         if(currentPos.y > (startPos.y + 100)){
    //             ChatMessageMgr.recordingCanceling()
    //         }else{
    //             ChatMessageMgr.recordingComplete()  
    //         }
    //         this._setClickVoiceLight(false)
    //     },



    //设置底注
    _setTableInfo(smallBlind, bigBlind) {
        smallBlind = TexasUtils._saveTwoPoint(smallBlind);//小盲注
        bigBlind = TexasUtils._saveTwoPoint(bigBlind);//大盲注

        let tInfo = TexasUtils._getSkin(["c"]) ? TexasUtils._getText(2) : "";
        this.tableInfo.string = tInfo + smallBlind + "/" + bigBlind;
        this.tableInfo.node.active = !TexasUtils._getSkin(["c"]) ? true : false;

        if (this.carryMax) {
            this.carryMax.string = !TexasUtils._getSkin(["c"]) ? TexasUtils._getText(78) + 999 : "";
        }
    },

    //设置俱乐部牌桌信息
    _setClubTableInfo(data) {
        if (!this.clubTableInfo) return;

        this.clubTableInfo.string = "";

        if (data) {
            // let roomName = "<" + Base64.decode(data.sTableName) + ">";//房间名
            // if(TexasData.getIsFreeGame()){
            //     roomName = TexasUtils._getText(191);
            // }
            let recordNum = TexasData._getCurTableId();//牌桌ID

            let text = data.nSmallBlind != 0 && data.nBigBlind != 0 ? TexasUtils._getText(2) : TexasUtils._getText(164)
            let mangZhu = Utils.showClubTableInfo(text, data.nSmallBlind, data.nBigBlind, data.nZhuaTou, data.nPreAnte, data.preAnteOdd, app.game.getGame().getSubGameID())

            // let str = recordNum + "\n" + mangZhu;
            let str = mangZhu; //牌桌ID 版本1.0要求不显示牌桌ID


            // if (data.isForceBlind) {//是否强制盲注 true:是 false:否
            //     mangZhu = mangZhu + " straddle";
            // }

            // let nTable = TexasData._getTable();//获得当前牌桌

            // let str = roomName +  "\n" + recordNum + "\n" + clubName + "\n" + gameName + "\n" + mangZhu;
            // if (nTable!=11) {
            //     str = roomName +  "\n" + recordNum + "\n" + gameName + "\n" + mangZhu;
            // }

            // if (!recordNum || recordNum=="") {
            //     str = roomName +  "\n" + clubName + "\n" + gameName + "\n" + mangZhu;
            //     if (nTable!=11) {
            //         str = roomName +  "\n" + gameName + "\n" + mangZhu;
            //     }
            // }

            // if (Number(data.nInsureMode)!=0) {
            //     str = str  + "\n" + TexasUtils._getText(125);
            // }

            // if (data.isOnlyPlayByIOS) {
            //     str = str  + "\n"  + "IOS";
            // }

            // if (data.isGPSLimit) {
            //     if (data.isOnlyPlayByIOS) {
            //         str = str + " GPS";
            //     }else {
            //         str = str  + "\n"  + "GPS";
            //     }
            // }

            // if (data.isIPLimit) {
            //     if (data.isOnlyPlayByIOS || data.isGPSLimit) {
            //         str = str + " IP";
            //     }else {
            //         str = str  + "\n"  + "IP";
            //     }
            // }

            // if (Number(data.nPoolEntryRate)!=0) {//入池率限制,取值范围0~100; 0: 表示不限制
            //     let nPoolEntryRate = Number(data.nPoolEntryRate);
            //     let putPool = TexasUtils._getText(115,nPoolEntryRate);//入池率限制
            //     str = str + "\n" +putPool;
            // }

            // if (data.isDelayLook) {
            //     let lookPoker = TexasUtils._getText(116);//延迟过牌
            //     str = str + "\n" +lookPoker;
            // }
            let sound = this.node.getChildByName("bg1").getComponent("UISound");
            if (sound) {
                sound.enabled = false
            }
            if (Number(data.nInsureMode) != 0) {
                //let nInsureMode = Number(data.nInsureMode);
                //let insure = nInsureMode==1?TexasUtils._getText(124):TexasUtils._getText(117);//低水保险/传统保险
                // str = str + "\n" + insure; //版本3.0要求不显示保险
                this.node.getChildByName("bg1").getChildByName("inSureLogo").active = true;
                this.node.getChildByName("bg2").getChildByName("inSureLogo").active = true;

                this.insureRoomAnimation()
            } else {
                this.node.getChildByName("bg1").getChildByName("inSureLogo").active = false;
                this.node.getChildByName("bg2").getChildByName("inSureLogo").active = false;

            }

            // if (data.hasOwnProperty("isAOF")) {//是否仅能全下或弃牌;true:是, 其它:否
            //     let isAOF = data.isAOF;

            //     TexasData._setIsAOF(isAOF);

            //     if (isAOF) {
            //         str = str + "\n" + "AOF";
            //     }
            // }

            if (data.hasOwnProperty("isTabkeOut")) {//是否带出筹码;true:是, 其它:否
                let isTabkeOut = data.isTabkeOut;
                TexasData._setIsCarry(isTabkeOut);
            }

            this.clubTableInfo.string = str;
        }
    },

    insureRoomAnimation() {
        if (this.insureAni.active) return
        cc.Tween.stopAllByTarget(this.insureAni);
        this.insureAni.active = true
        this.insureAni.opacity = 0;
        cc.tween(this.insureAni).delay(1).call(() => {
            this.insureAni.scale = 0
            this.insureAni.opacity = 255
        })
            .to(0.25, { scale: 1.1 }, { easing: 'backOut' })
            .to(0.1, { scale: 1.0 }, { easing: 'sineOut' }).delay(2).call(() => {
                cc.Tween.stopAllByTarget(this.insureAni);
                cc.tween(this.insureAni)
                    .to(0.15, { scale: 0.8 }, { easing: 'sineIn' })
                    .to(0.1, { scale: 0 }, { easing: 'quadIn' })
                    .call(() => {
                        // this.insureAni.active = false;
                    })
                    .start();
            })
            .start();

    },

    /*************************************其他处理***************************************************/

    //庄家标识
    _flyBankIcon(sitid, isLink) {
        cc.log("庄家标识 sitid,isLink:", sitid, isLink);

        let seat = this.TexasPlayerController._getSeat("nSitId", sitid);

        if (seat) {
            if (!this.bankIcon.active) {
                this.bankIcon.x = 0;
                this.bankIcon.y = 165.526;
            }

            let bankUserId = this.TexasPlayerController._getUserId("nSitId", sitid);
            TexasData._setBankUserID(bankUserId);

            let texasPlayer = this.TexasPlayerController._getTexasPlayer(seat);
            if (texasPlayer) {
                let bankIcon = texasPlayer.bankIcon;
                this.bankIcon.active = true;
                let pos = TexasUtils._getNodePos(bankIcon, this.bankIcon);

                this.bankIcon.stopAllActions();

                if (isLink) {//重连直接显示
                    this.bankIcon.x = pos.x;
                    this.bankIcon.y = pos.y;
                } else {
                    var actionMove = cc.moveTo(0.5, pos.x, pos.y);
                    this.bankIcon.runAction(actionMove);
                }
            }
        }
    },

    _deleTable(tableId) {
        if (!this.menuLayout || !this.itemTablePrefab) return;

        let layoutTable = this.menuLayout.getChildByName("layoutTable");
        let tableChild = layoutTable.children;
        if (tableChild.length > 0) {
            for (let i = 0; i < tableChild.length; i++) {
                let table = tableChild[i];
                let texasTableItem = table.getComponent("texasTableItem");

                let tableIds = texasTableItem._getTableId();

                if (tableId == tableIds) {
                    table.destroy();
                }
            }
        }

    },

    //设置牌桌菜单
    _setMenuLayout(tables) {
        if (!this.menuLayout || !this.itemTablePrefab) return;

        let listLen = 4;

        let curTable = TexasData._getCurTableId();//获得当前牌桌

        let layoutTable = this.menuLayout.getChildByName("layoutTable");
        if (!tables) {
            layoutTable.destroyAllChildren();
        } else {
            let tableId = tables.sTableId;

            let tableChild = layoutTable.children;
            if (tableChild.length > 0) {
                let list = [];
                let tableList = false;
                let len = tableChild.length;
                for (let i = 0; i < len; i++) {
                    let table = tableChild[i];
                    let texasTableItem = table.getComponent("texasTableItem");

                    let tableData = texasTableItem._getTable();
                    let tableIds = texasTableItem._getTableId();

                    list.push(tableData);

                    if (tableId == tableIds) {
                        tableList = true;
                    }
                }

                if (tableList) {
                    if (list[0] && curTable != list[0].sTableId) {
                        let nList = [];

                        let tableData = {
                            sTableId: curTable,
                            sTableName: TexasData._getCurTableName(),
                        }
                        nList.push(tableData);

                        for (let i = 0; i < list.length; i++) {
                            if (list[i].sTableId != curTable) {
                                nList.push(list[i]);
                            }
                        }

                        list = Utils.clone(nList);
                        layoutTable.destroyAllChildren();
                        for (let j = 0; j < list.length; j++) {
                            this._setTable(list[j]);
                        }
                    }
                } else {//牌桌列表无此牌桌数据
                    if (tableId == curTable) {//当前牌桌
                        let tableListLen = list.unshift(tables);

                        if (tableListLen > listLen) {
                            let nList = [];
                            for (let i = 0; i < listLen; i++) {
                                for (let j = 0; j < tableListLen; j++) {
                                    if (i == j) {
                                        nList.push(list[j]);
                                    }
                                }
                            }

                            list = Utils.clone(nList);
                        }

                        TexasData._setLastTableID(0);
                    } else {
                        if (list.length >= listLen) {
                            let replaceTable = TexasData._getLastTableID() + 1;
                            if (replaceTable > listLen - 1) {
                                replaceTable = 1;
                            }

                            list[replaceTable] = tables;
                            TexasData._setLastTableID(replaceTable);
                        } else {
                            list.push(tables);
                            TexasData._setLastTableID(list.length - 1);
                        }
                    }

                    layoutTable.destroyAllChildren();
                    for (let j = 0; j < list.length; j++) {
                        this._setTable(list[j]);
                    }
                }
            } else {
                if (tableId == curTable) {
                    this._setTable(tables);

                    TexasData._setLastTableID(0);
                } else {
                    let tableData = {
                        sTableId: curTable,
                        sTableName: TexasData._getCurTableName(),
                    }
                    this._setTable(tableData);
                    this._setTable(tables);

                    TexasData._setLastTableID(1);
                }
            }

        }
    },

    //设置牌桌
    _setTable(table) {
        cc.log("table:", table);
        return
        let layoutTable = this.menuLayout.getChildByName("layoutTable");

        let tableItem = cc.instantiate(this.itemTablePrefab);
        tableItem.parent = layoutTable;
        let texasTableItem = tableItem.getComponent("texasTableItem");
        texasTableItem._createTableItem(this, table);
        tableItem.active = true;
    },

    //设置公共牌
    _setCommonCards(arry) {
        if (!arry) return;

        let info = UserInfo.getInfo();


        let seat = this.TexasPlayerController._getSeat("nUserId", info.nUserID);
        let texasPlayer = this.TexasPlayerController._getTexasPlayer(seat);

        if (seat) {
            this.TexasTableCard._InitCommonCards([]);//置灰牌桌公共牌

            if (texasPlayer) {
                texasPlayer._setCardGrey(1);
                texasPlayer._setCardGrey(2);

                texasPlayer._setCardLight();

                if (texasPlayer._isPlaying) {
                    this.TexasTableCard._getLightPoker(arry, texasPlayer.data.nCardType);//牌桌公共牌

                    texasPlayer._lightHandCard(arry);
                }
            }
        }
    },

    //设置回到座位
    _setBackSeat(nSitId, time) {
        if (!this.backSeatBtn) return;

        let info = UserInfo.getInfo();

        let label = this.backSeatBtn.getChildByName("label").getComponent(cc.Label);
        label.string = TexasUtils._getText(168);

        let userId = this.TexasPlayerController._getUserId("nSitId", nSitId);

        if (!nSitId && !time) {
            this.backSeatBtn.active = false;
            this.occupyBtn.active = false;
        }

        if (info.nUserID == userId) {
            this.backSeatBtn.active = Number(time) > 0 ? true : false;
            this.occupyBtn.active = !this.backSeatBtn.active;
        }

        let seat = this.TexasPlayerController._getSeat("nSitId", nSitId);
        if (seat && Number(time) >= 0) {
            cc.log("_setBackSeat nSitId,time:", nSitId, time);
            let texasPlayer = this.TexasPlayerController._getTexasPlayer(seat);
            if (texasPlayer) {
                texasPlayer._setOccupied(time);
            }
        }
    },

    //设置跑马灯
    _setPaoMa(visible, gold, isLink, isShow) {
        cc.log("设置跑马灯 visible,gold,isLink,isShow:", visible, gold, isLink, isShow);

        let info = UserInfo.getInfo();

        if (gold > 0) {
            let str = "已帮您自动购买" + gold + "筹码";
            UIFrame.showTips(str)
            // this.TexasPaoMa._initPaoMa(str);
        }

        if (!isShow) {
            let selfGold = this.TexasPlayerController._getGold("nUserId", info.nUserID);//获得自己金币
            if (!selfGold) {
                selfGold = 0;
            }
            let endGold = Number(selfGold) + Number(gold);
            if (isLink) {
                endGold = Number(gold);
            }

            let selfSeat = this.TexasPlayerController._getSeat("nUserId", info.nUserID);
            if (selfSeat) {
                let data = {
                    nBalance: endGold,
                }
                let texasPlayer = this.TexasPlayerController._getTexasPlayer(selfSeat);
                if (texasPlayer) {
                    texasPlayer.changePlayerInfo(data);
                }
            }
        }

        if (visible) {
            this.TexasPaoMa.show();
        } else {
            this.TexasPaoMa.hide();
        }
    },

    //设置德州游戏
    _setTexasGame() {
        let nGameId = null;

        let playBackData = TexasUtils._getClub() && app.club.getPlayBackData() ? app.club.getPlayBackData() : null;
        if (playBackData && playBackData.hasOwnProperty("nGameId")) {
            nGameId = playBackData.nGameId;
        } else {
            nGameId = app.game.getGame().getSubGameID();
        }
        cc.log("nGameId:", nGameId);

        let nGame = 1;
        if (nGameId === 126) {
            nGame = 2;
        } else if (nGameId === 175) {
            nGame = 3;
        }

        return nGame;
    },

    //设置暂停游戏
    _setStopGame(isStop) {
        cc.log("_setStopGame:", isStop);

        if (this.test_zanting && this.test_jixu) {
            this.test_zanting.active = false;
            this.test_jixu.active = false;

            if (ConfigGame.ISDEVELOP) {
                if (isStop) {
                    this.test_jixu.active = true;
                } else {
                    this.test_zanting.active = true;
                }
                let isMatchTable = TexasUtils._isMatchTable();
                if (isMatchTable) {
                    this.test_jixu.active = false;
                    this.test_zanting.active = false;
                }
            }

            TexasData._setIsGameStop(isStop);
        }
    },

    //设置买入筹码
    _setBuyTip(visible, data, hallGold, selfGold) {
        if (!this.TexasBuyTip) return;

        if (visible) {
            // TexasData._setWindowData(4);
            this.TexasBuyTip._initTip(this, data, hallGold, selfGold);
            this._setBottomTip(0)
        }

        // this.TexasBuyTip.node.active = visible;//买入弹窗
    },

    //买入/撤码/保险
    _setBottomTip(index) {
        if (!this.TexasGameBottomTip.node.active) {//打开界面，金币变动不切换页签
            this.TexasGameBottomTip.toggleTitle(this, index)
        }
        this.TexasGameBottomTip.node.active = true
    },

    //设置时间倒计时动作
    _setTimeAnim(time) {
        cc.log("德州 设置时间倒计时动作:", time);

        if (TexasUtils._getClub()) return;

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            let self = this;

            time = Number(time);

            self.unschedule(this._scheduleTimes);
            let timeAnim = this.timeAnim.getChildByName("timeAnim");
            if (timeAnim) {
                timeAnim.destroy();
            }

            let gameStart = TexasData._getGameStart();
            if (!gameStart && time && time >= 3) {
                self.timeItem = cc.instantiate(this.itemTimePrefab);
                self.timeItem.parent = this.timeAnim;
                self.timeItem.name = "timeAnim";

                TexasData._setFinishScheduleTime(time);//存储倒计时结束时间

                if (time == 3) {
                    self._setTimeState(self.timeItem, true, 3);

                    self.unschedule(self._scheduleTimes);
                    self.schedule(self._scheduleTimes, 1);

                    return;
                } else {
                    self._setTimeState(self.timeItem, false, 3);
                }

                let playTime = time - 3;
                this.scheduleOnce(function () {
                    let finishScheduleTime = TexasData._getFinishScheduleTime();

                    let timestamps = Date.parse(new Date()) / 1000;//当前时间戳（秒）
                    if (timestamps >= finishScheduleTime) {
                        self._setTimeAnim();

                        return;
                    }

                    if (self.timeItem) {
                        self._setTimeState(self.timeItem, true, finishScheduleTime - timestamps);
                        self.unschedule(self._scheduleTimes);
                        self.schedule(self._scheduleTimes, 1);
                    }

                }, playTime)
            }
        }
    },

    _setZanTing() {
        cc.log("德州 _setZanTing");
        if (TexasUtils._getClub()) return;

        let timeItem = cc.instantiate(this.itemTimePrefab);
        timeItem.parent = this.timeAnim;
        timeItem.name = "timeAnim";
        this._setTimeState(timeItem, false, 3);
    },

    //设置时间状态
    _setTimeState(node, isShowTime, time) {
        let wait = node.getChildByName("wait");//等待开局
        let alarmClock = node.getChildByName("alarmClock");//闹钟

        let clock = alarmClock.getChildByName("clock");
        let label = clock.getChildByName("label");
        if (label) {
            this.timeLabel = label.getComponent(cc.Label);
            this.timeLabel.string = time;
        }

        wait.active = !isShowTime;
        alarmClock.active = isShowTime;

        node.active = true;

        if (isShowTime) {
            let animation = alarmClock.getComponent(cc.Animation);
            animation.on('finished', function (type, state) {
                animation.stop();
            }.bind(this));
            animation.play("timeAnim");
        }
    },

    //倒计时
    _scheduleTimes() {
        let finishScheduleTime = TexasData._getFinishScheduleTime();

        let timestamp = Date.parse(new Date()) / 1000;//当前时间戳
        let nTime = finishScheduleTime - timestamp;
        cc.log("timestamp,finishScheduleTime,nTime:", timestamp, finishScheduleTime, nTime);
        if (nTime <= 0) {
            this.unschedule(this._scheduleTimes);
            this._setTimeAnim();

            return;
        }

        if (this.timeLabel) {
            this.timeLabel.string = nTime;
        }
    },
    /*************************************数据处理***************************************************/

    //返回场景信息
    _returnSceneInfo(data, isVideo) {
        cc.log("德州返回场景信息:", data, isVideo);

        let info = UserInfo.getInfo();
        this.TexasPlayerController._clearPlayer()//先清空所有玩家
        this.TexasPlayerController._setPlayerOpacity(255);

        if (data) {
            let nSmallBlind = data.nSmallBlind;//小盲注数额
            let nBigBlind = data.nBigBlind;//大盲注数额
            let nCapacity = data.nCapacity;//桌子座位数(6或9)
            let nOperateTime = data.nOperateTime;//操作最大时间,单位:秒 (通常为10)
            let nPotSum = data.nPotSum;//底池总额(已押筹码总额)
            let arrPot = data.arrPot;//已收归的各底池数额(池数量:>=0)
            let arrCommunityCards = data.arrCommunityCards;//公共牌(最多5个牌)
            let arrUsers = data.arrUsers || [];//座位上的玩家
            let nStage = data.nStage;//当前游戏状态 0:未开始(等待游戏开始) 1:游戏中 2:结算阶段
            TexasData._setKeepTime(data.nKeepTime)
            TexasData._setGameState(Number(nStage));

            this.TexasPlayerController._setPlayerPos(nCapacity, arrUsers);



            let nTableType = null;

            if (data.hasOwnProperty("nZhuaTou")) {
                TexasData._setZhuaTou(data.nZhuaTou)
            }
            if (data.hasOwnProperty("nTableType")) {//桌子类型 10:大厅桌子 11:俱乐部桌子 其它:未定义
                nTableType = data.nTableType;
                TexasData._setTable(nTableType);
                if (TexasUtils._getSkin(["default", "d"])) {
                    TexasData.setMatchType(data.nTableType)
                }


            }

            if (nTableType == 12) {
                //mtt比赛牌桌类型
                let isMttUser = false;
                if (data.hasOwnProperty("isMttUser")) {
                    TexasData.setIsMttUser(data.isMttUser);
                    isMttUser = data.isMttUser;
                }

                if (data.hasOwnProperty("nAssignTime") && data.nAssignTime > 0) {
                    this.showMttWaitStart(data)
                } else {
                    if (isMttUser) {
                        this.showMttBuyChipBtn(true)
                    }
                    this.showMttTabelInfo(data.tMInfo);

                }

                if (data.hasOwnProperty("nEventId")) {
                    TexasData.setMttMatchId(data.nEventId);
                }


                TexasData.setMttMatchEnd(false);

            }

            if (data.hasOwnProperty("isAuthor")) {
                TexasData.setIsMatchTableManager(data.isAuthor)
            }

            if (data.hasOwnProperty("nMStatus")) {
                TexasData.setTableMStatus(data.nMStatus)
            }

            if (data.hasOwnProperty("tTableConfig")) {//桌子配置信息
                let tTableConfig = data.tTableConfig;

                if (tTableConfig.hasOwnProperty("nPlayerAtLeast")) {//自动开始人数 (实际人数>=2且<该值时,显示"开始游戏")
                    //已经开桌的牌桌默认2人开始牌局
                    let nPlayerAtLeast = TexasData._getIsTableStart() ? 2 : tTableConfig.nPlayerAtLeast;
                    TexasData._setAutoStartNum(nPlayerAtLeast);
                }
                if (tTableConfig.hasOwnProperty("preAnteOdd")) {//短牌前注模式庄家倍数
                    TexasData._setPreAnteOdd(tTableConfig.preAnteOdd)
                }
                TexasData._setTableInfo(tTableConfig);
                this._setClubTableInfo(tTableConfig);
            }

            if (data.hasOwnProperty("nCurrency")) {//本桌子使用的币种 1:金币 >1:俱乐部币
                let nCurrency = data.nCurrency;
                TexasData._setCurrency(nCurrency);
            }

            if (data.hasOwnProperty("arrChat")) {//表情价格列表
                let arrChat = data.arrChat;
                TexasData._setMagicGold(arrChat);
            }

            if (data.hasOwnProperty("nClubId")) {//俱乐部id
                let nClubId = data.nClubId;
                TexasData._setClubId(nClubId);

                if (TexasUtils._getClub()) {
                    app.club.loginClub(nClubId);
                }
            }

            if (data.hasOwnProperty("nGold")) {//当前可用金币数
                this._setSelfAllGold(data.nGold);
            }

            if (data.hasOwnProperty("sTableName")) {//桌子名称
                let sTableName = data.sTableName;
                TexasData._setCurTableName(sTableName);
            }

            if (this.test_roomConfig && ConfigGame.ISDEVELOP) {
                this.test_roomConfig.active = nStage == 0 && info.nUserID == data.nLiveUserId ? true : false;//房间配置测试
            }

            if (!isVideo && nStage == 2) {
                nPotSum = 0;
                arrPot = [];
                arrCommunityCards = [];
            }

            if (data.nLiveUserId) {//主播Id
                TexasData._setLiveUserId(data.nLiveUserId);
            }

            if (!isVideo && TexasUtils._getSkin(["default", "b", "c", "d"])) {
                let isLive = info.nUserID == data.nLiveUserId ? true : false;

                let isAdmin = false;
                if (this.closeTableBtn && data.hasOwnProperty("isCanCloseTable")) {
                    isAdmin = data.isCanCloseTable;
                    this.closeTableBtn.active = isAdmin;
                    TexasData._setIsAdmin(isAdmin);
                }

                let isTableStart = null;
                if (data.hasOwnProperty("isTableStart")) {//牌桌是否开始 true:是, false:否(房主需点击"开始牌局"才能开始)
                    isTableStart = data.isTableStart;
                    TexasData._setIsTableStart(isTableStart);

                    if (nTableType == 11 && !isTableStart && isAdmin && this.TexasTableStop) {
                        this.TexasTableStop._setTable(1);
                    }
                }

                if (isTableStart) {
                    if (this.stopBtn && nTableType == 11) {
                        this.stopBtn.active = isAdmin;
                    }
                } else {
                    if (this.stopBtn && nTableType == 11) {
                        this.stopBtn.active = false;
                    }
                }

                // let isAutoNext = false;
                // if (data.hasOwnProperty("isAutoNext")) {//下局是否自动开始 true:是, false:房主点击 "开始游戏"才能开始(前端判断>=2人时才给房主显示该按钮)
                //     isAutoNext = data.isAutoNext;
                //     TexasData._setIsNextRoundStart(isAutoNext);
                // }

                if (isTableStart) {
                    let isStopGame = false;
                    if (data.hasOwnProperty("nPauseRemain")) {//>0:正在暂停倒计时(秒); 其他:无意义
                        let nPauseRemain = Number(data.nPauseRemain);

                        if (nPauseRemain > 0 && isAdmin) {
                            isStopGame = true;
                            TexasData._setIsGameStop(true);
                            if (nTableType == 11 && this.TexasTableStop) {
                                this.TexasTableStop._setTable(3, nPauseRemain);
                            }
                        }
                    }

                    // if (data.hasOwnProperty("isAutoNext")) {//下局是否自动开始 true:是, false:房主点击 "开始游戏"才能开始(前端判断>=2人时才给房主显示该按钮)
                    //     TexasData._setIsNextRoundStart(isAutoNext);

                    if (nStage == 0) {//游戏未开始且未点开始游戏弹出开始游戏按钮
                        if (nTableType == 11 && isAdmin && arrUsers.length >= 2 && arrUsers.length < TexasData._getAutoStartNum() && !isStopGame && this.TexasTableStop) {
                            this.TexasTableStop._setTable(2);
                        }
                    }
                    // }
                }

                if (data.nMSeconds) {// >0:开局倒计时剩余时间(毫秒) -1:无限等待状态(因为主播设置了暂停) 其它:无意义
                    let nMSeconds = Number(data.nMSeconds);

                    if (nMSeconds == -1) {//主播设置暂停
                        if (TexasUtils._getClub()) {
                            if (!isAdmin) {
                                TexasData._setIsGameStop(true);

                                let text = TexasUtils._getText(113);
                                UIFrame.showTips(text);
                            }
                        } else {
                            if (!isLive) {//非主播显示暂停游戏提示
                                TexasData._setIsGameStop(true);

                                let text = TexasUtils._getText(65);
                                UIFrame.showTips(text);

                                this._setZanTing();
                            }
                        }
                    } else if (nMSeconds > 0) {//播放开局倒计时动画
                        TexasData._setIsGameStop(false);

                        nMSeconds = nMSeconds / 1000;
                        this._setTimeAnim(nMSeconds);
                    }
                }

                if (isLive && TexasUtils._getSkin(["default", "d"]) && this.test_zanting && this.test_jixu) {
                    this._setStopGame(data.isPause);

                    if (data.isPause) {
                        this._setZanTing();
                    }
                }
            }

            // if (data.nGold) {//当前可用金币数
            //     this._setSelfAllGold(data.nGold);
            // }

            TexasData._setIsShowRoomConfig(false);
            if (!data.isConfigNotSet) {//本桌子是否需要配置后才能开始 true:是 其它:否
                TexasData._setTableBlind(nSmallBlind, nBigBlind);//存储大小盲注值
                TexasData._setMaxTableSeat(nCapacity);//设置牌桌最大座位数
                this._setTableInfo(nSmallBlind, nBigBlind);//牌桌信息
            }

            if (TexasUtils._getSkin(["default", "a", "d"]) && data.tDeZhouConfigOption) {//桌子可选配置(主播时有)//测试
                TexasData._setSelectConfig(data.tDeZhouConfigOption);

                let tDeZhouConfigOption = data.tDeZhouConfigOption;

                let isRemember = TexasData._getCheckRemember();//获得保存的记住配置
                if (isRemember) {//已勾选记住房间配置，不需弹窗
                    if (data.isConfigNotSet) {//本桌子需要配置，发送配置给服务
                        let arrConfig = tDeZhouConfigOption.arrConfig;//可选的盲注配置
                        let nConfigIdDefault = tDeZhouConfigOption.nConfigIdDefault ? tDeZhouConfigOption.nConfigIdDefault : arrConfig[0].nConfigId;//默认配置
                        let nCapacityDefault = tDeZhouConfigOption.nCapacityDefault ? tDeZhouConfigOption.nCapacityDefault : 6;//默认人数//测试
                        let nIntervalLevDefault = tDeZhouConfigOption.nIntervalLevDefault ? tDeZhouConfigOption.nIntervalLevDefault : 2;//默认牌局间隔 1:短暂 2:适中 3:漫长

                        let configData = {
                            nConfigId: nConfigIdDefault,
                            nCapacity: nCapacityDefault,
                            nIntervalLev: nIntervalLevDefault,
                        }

                        let nStr = "重连需要配置房间请求";
                        // cc.warn("-----------------------------------------------------------------------------------------德州重连需要配置房间请求",configData);
                        if (TexasUtils._getClub()) {
                            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCofingReq_CMD, configData);
                            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCofingReq_CMD, configData);
                        } else {
                            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouCofingReq_CMD, configData);
                            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouCofingReq_CMD, configData);
                        }
                    }
                } else {//未勾选记住房间配置需弹窗
                    if (data.isConfigNotSet) {//桌子需要配置，显示弹窗
                        TexasData._setIsShowRoomConfig(true);

                        if (this.TexasRecord) {
                            this.TexasRecord.node.active = false;//战绩
                        }
                        if (this.TexasSetting) {
                            this.TexasSetting.node.active = false;//设置
                        }
                        if (this.TexasHelp) {
                            this.TexasHelp.node.active = false;//帮助
                        }

                        if (this.TexasBuyTip) {
                            this.TexasBuyTip.node.active = false;//购买筹码
                        }

                        let tDeZhouConfigOption = data.tDeZhouConfigOption;
                        if (this.TexasRoomConfigPanel) {
                            this.TexasRoomConfigPanel._initConfigPanel(tDeZhouConfigOption);
                            this.TexasRoomConfigPanel.node.active = true;
                        }
                    }
                }
            }

            TexasData._setMaxOperateTime(nOperateTime);//设置操作最大时间

            //显示坐下按钮
            if (!isVideo) {
                this._setIsStandUp();
            }

            //游戏开始状态
            if (nStage != 0) {
                TexasData._setGameStart(true);
            }

            if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                this.label_pool.active = nStage == 0 ? false : true;
            }

            //奖池
            if (arrPot && arrPot.length > 0) {
                for (let i = 0; i < arrPot.length; i++) {
                    let pool = arrPot[i];

                    this.TexasRewardPool._addPond(pool, false, true);
                }

                this.TexasRewardPool._updatePoolText(arrPot.length);
                if (TexasUtils._getClub()) {
                    this.TexasRewardPool._updateSumPool();
                }

            } else if (Number(nPotSum) > 0) {
                this.TexasRewardPool._addPond(Number(nPotSum), false, true);
                this.TexasRewardPool._updatePoolText(1);
                if (TexasUtils._getClub()) {
                    this.TexasRewardPool._updateSumPool();
                }
            }

            TexasData._setRewardPoolSum(nPotSum);//设置奖池总额
            if (Number(nPotSum) > 0) {
                this.TexasRewardPool._updateTotalPoolText();
            }

            //公共牌
            TexasData._setCommonData(arrCommunityCards);
            if (!TexasUtils._getClub()) {
                if (nStage != 0 && nStage != 2) {
                    for (let i = 1; i <= 5; i++) {
                        this.TexasTableCard.openSinglePoker(i, 0, true);
                    }
                }
            }
            if (arrCommunityCards && arrCommunityCards.length > 0) {
                for (let i = 0; i < arrCommunityCards.length; i++) {
                    let card = arrCommunityCards[i];

                    this.TexasTableCard.openSinglePoker(i + 1, card, true);
                }
            }

            let userCount = arrUsers.length;//牌桌人数
            if (userCount <= 1 && nStage == 0) {//开局人数
                this.bankIcon.x = 0;
                this.bankIcon.y = 165.526;
                this.bankIcon.active = false;
            }

            let tableUserArry = TexasData._setUserSidToSeat(arrUsers);//转换玩家客户端座位

            //设置玩家自己在牌桌
            TexasData._setSelfIsInTable(false);

            for (let j = 0; j < tableUserArry.length; j++) {
                let tableUserArryItem = tableUserArry[j];

                if (info.nUserID == tableUserArryItem.nUserId) {
                    TexasData._setSelfIsInTable(true);
                    let tableInfo = TexasData._getTableInfo();//牌桌信息
                    if (tableInfo.isVideoFee) {
                        ChatMessageMgr._reqVideoToken(true);
                    }
                    break;
                }
            }

            //玩家

            let list = [];
            let isSelfInTable = false;
            for (let i = 0; i < tableUserArry.length; i++) {
                let tableUserArryItem = tableUserArry[i];
                let seat = tableUserArryItem.seat;
                let nStatus = Number(tableUserArryItem.nStatus);//0:等待操作权中 1:思考中 2:跟注 3:让牌 4:加注 5:AllIn 6:弃牌 7:旁观 

                if (!isVideo && nStage == 2) {
                    tableUserArryItem.arrHoleCards = [];
                    tableUserArryItem.nCardType = 0;
                    tableUserArryItem.isBanker = false;
                    tableUserArryItem.nStatus = 7;
                }

                list.push(tableUserArryItem.sShopAcc);
                this.TexasPlayerController._addPlayer(seat, tableUserArryItem, null, true);

                if (nStatus == 1) {
                    let operatingSeat = seat;
                    if (tableUserArryItem.nUserId == info.nUserID) {
                        operatingSeat = 10;
                    }

                    this.TexasPlayerController._setLight(operatingSeat);
                    TexasData._setOperatingUserID(tableUserArryItem.nUserId);
                }

                let isPlaying = tableUserArryItem.nStatus == 6 || tableUserArryItem.nStatus == 7 ? "idle" : "playing";
                TexasUtils.tableUserSitdown(tableUserArryItem.sShopAcc);

                if (info.nUserID == tableUserArryItem.nUserId) {
                    isSelfInTable = true;

                    let isCarry = TexasData._getIsCarry();
                    if (isCarry) {
                        this.texasMenuDefault._setCarry(true);
                    }


                    TexasData._setSelfCard(tableUserArryItem.arrHoleCards, tableUserArryItem.nCardType);

                    TexasUtils.updateUserStatus(isPlaying);

                    if (!isVideo) {
                        this._setIsStandUp();//显示站起按钮
                    }

                    if (userCount <= 1 && nStage == 0) {
                        this._setTimeAnim();

                        if (!isVideo) {
                            let isXiaBo = TexasData._getIsXiaBo();//获得直播间是否下播

                            this._showWaitingForGameStartTip();
                            this.tipBlock.active = isXiaBo ? false : true;

                            if (TexasUtils._getClub()) {
                                if (!TexasData._getIsTableStart() || TexasData._getIsGameStop()) {
                                    this.tipBlock.active = false;
                                }
                            }

                        }
                    }

                    let isAppShow = TexasData._getIsAppShow();
                    if (!isVideo && isAppShow) {
                        if (nStage == 0) {//游戏未开始设置跑马灯
                            this._setPaoMa(true, tableUserArryItem.nBalance, true);
                        } else if (nStatus == 7) {//游戏开始自己处于旁观状态设置跑马灯
                            this._setPaoMa(true, tableUserArryItem.nBalance, true);
                        }

                        TexasData._setIsAppShow(false);
                    }

                    // if (nStage!=0 && nStatus>=0 && nStatus<=6) {//游戏开始且参与游戏状态，显示购买筹码按钮
                    //     this.buyBtn.active = true;
                    // }else{
                    //     this.buyBtn.active = false;
                    // }

                }

                if (tableUserArryItem.hasOwnProperty("nRetain")) {//>0:留座离桌剩余时间(秒) ,其它:无效
                    let nRetain = tableUserArryItem.nRetain;
                    this._setBackSeat(tableUserArryItem.nSitId, nRetain);
                }
            }


            this._setIsStandUp()
            this.TexasPlayerController._setWinRate(Utils.clone(tableUserArry));

            if (list.length > 0) {
                TexasUtils.getMicStatus(list);
            }

            if (!TexasUtils._getSkin(["c"])) {
                app.native.getAppConfig();//子游戏初始化后调用此消息获取app配置
            }

            if (!isSelfInTable) {
                TexasUtils.updateUserStatus("idle");
            }

            if (!isVideo && userCount < nCapacity && !isSelfInTable && !TexasUtils._getSkin(["default", "b", "c", "d"])) {//牌桌人数小于最大座位数且玩家不在牌桌显示坐下按钮
                this.TexasOperatePanel._initOperatePanel([2], 3);//坐下按钮
            }

            this._setDelayCost(data);//设置延时按钮

            if (data.tOperation) {
                let tOperation = data.tOperation;//当前自己可操作信息(自己为思考状态时有)

                this.TexasOperatePanel._initOperatePanel(tOperation, 1);
            }

            if (nStage != 2 && data.tPreOpOption) {
                let tPreOpOption = data.tPreOpOption;//自己当前可预操作选项

                this.TexasOperatePanel._initOperatePanel(tPreOpOption, 2);
            }

            if (TexasUtils._getSkin(["default", "b", "d"])) {
                this.TexasPlayerController._updateDefaultSeat();
            }

            if (data.hasOwnProperty("arrUsersWin")) {
                let arrUsersWin = data.arrUsersWin;//所有玩家牌型与输赢情况(弃牌玩家除外)


                for (let i = 0; i < arrUsersWin.length; i++) {
                    let user = arrUsersWin[i];

                    let nPos = user.nPos;//座位号
                    let arrHoleCards = user.arrHoleCards;//底牌(该玩家可能在公共牌阶段已亮过牌,前端看重复亮牌会不会有问题)
                    let arrCombinedCards = user.arrCombinedCards;//能组成最大牌型的5个牌
                    let nCardType = user.nCardType;//牌型
                    let arrGoldGet = user.arrGoldGet;//从各个池处中获得的金币
                    let isWin = user.isWin;//是否为赢, true时需要播放WIN特效(高亮牌型等等).
                    let nProfit = user.nProfit;//盈利
                    let isShowCardWhenEnd = user.isShowCardWhenEnd;//是否设置了结束后亮牌(只有弃牌玩家可以设置),true:是 其它:否

                    let seat = this.TexasPlayerController._getSeat("nSitId", nPos);
                    let texasPlayer = this.TexasPlayerController._getTexasPlayer(seat);

                    if (texasPlayer) {
                        texasPlayer._updateAction(-1);
                        texasPlayer._initEffect();

                        let wins = Number(nProfit) > 0 ? true : false;
                        texasPlayer._showCard(arrHoleCards, nCardType, wins, null, false, true);

                        texasPlayer._setCardGrey(1);
                        texasPlayer._setCardGrey(2);
                        this.TexasTableCard._showSettlePoker([]);//置灰牌桌公共牌
                        if (isWin && Number(nProfit) > 0) {
                            this.TexasTableCard._getLightPoker(arrCombinedCards, nCardType, true);//牌桌公共牌
                            texasPlayer._lightHandCard(arrCombinedCards, arrHoleCards);
                        }
                        console.log(`_showScore 22222222222: ` + nProfit);

                        texasPlayer._showScore(nProfit);
                    }
                }

            }

            this._setCommonCards(data.arrCombinedCards);

            if (data.hasOwnProperty("tInsurPanelData")) {//保险面板数据
                let tInsurPanelData = data.tInsurPanelData;
                TexasData._setInsureData(tInsurPanelData);
                this._setInsurePanel();
            }

            if (this._blockIndex) {
                UIFrame.hideBlock(this._blockIndex);
            }

            if (data.hasOwnProperty("arrWinRate")) {//牌桌胜率
                if (data.arrWinRate.length > 0) {
                    this.setWinRate(data.arrWinRate);
                }
            }

            this.setMatchBtn();
            let tableInfo = TexasData._getTableInfo();//牌桌信息
            this.btnVoice.active = tableInfo && tableInfo.isVideoFee;
        }
    },

    //刷新玩家位置
    _updateUserPosition(oldData, newData) {
        //cc.log("德州 oldData,newData:",oldData,newData);

        let info = UserInfo.getInfo();

        let userData = newData;

        let addUserData = {};

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            let seatArry = !TexasUtils._getSkin(["c"]) ? [1, 2, 3, 5, 8, 9] : TexasUtils._getClubPlayerPos(TexasData._getMaxTableSeat());
            for (let i = 0; i < seatArry.length; i++) {
                let targetPlayer = this.panelContent.getChildByName("player_" + seatArry[i]);
                let defaultHead = targetPlayer.getChildByName("defaultHead");
                if (defaultHead) {
                    defaultHead.active = true;
                }
            }
        }

        // let isSelfInTable = false;
        for (let i = 0; i < userData.length; i++) {
            let newUser = userData[i];
            let newUserId = newUser.nUserId;
            let newSeat = newUser.seat;

            // if (info.nUserID==newUserId) {
            //     isSelfInTable = true;
            // }

            let isAddUser = true;//新增加玩家
            for (let j = 0; j < oldData.length; j++) {
                let oldUser = oldData[j];
                let oldUserId = oldUser.nUserId;
                let oldSeat = oldUser.seat;

                if (newUserId == oldUserId) {

                    isAddUser = false;

                    let playerItem = this.playerContent.getChildByName("player_" + oldSeat);
                    let targetPlayer = this.panelContent.getChildByName("player_" + newSeat);
                    if (playerItem && targetPlayer && newSeat) {
                        let playJs = TexasUtils._getSkin(["d", "b"]) ? "texasPlayerDefault" : "texasPlayer";
                        if (TexasUtils._getSkin(["c"])) {
                            playJs = "texasPlayerC";
                        } else if (TexasUtils._getSkin(["default"])) {
                            playJs = "texasPlayerC";
                        }

                        playerItem.stopAllActions();

                        let pos = TexasUtils._getNodePos(targetPlayer, playerItem);
                        playerItem.x = pos.x;
                        playerItem.y = pos.y;
                        //console.log("player 位置：x=  " + playerItem.x + ", y = " + playerItem.y) ;

                        let texasPlayer = playerItem.getComponent(playJs);
                        texasPlayer._ResetPlayer(newSeat);

                    }

                    break;
                }
            }

            if (isAddUser) {
                addUserData.newSeat = newSeat;
                addUserData.newUser = newUser;
            }

        }

        this.TexasPlayerController._changeUserSeat();

        if (addUserData.newSeat && addUserData.newUser) {
            let newSeat = addUserData.newSeat;
            let newUser = addUserData.newUser;

            let nStatus = newUser.nStatus;//当前玩家状态, 0:等待操作权中 1:思考中 2:跟注 3:让牌 4:加注 5:AllIn 6:弃牌 7:旁观 
            let arrHoleCards = newUser.arrHoleCards;//底牌

            if (Number(nStatus) == 6 || Number(nStatus) == 7) {
                newUser.arrHoleCards = [];
            }

            this.TexasPlayerController._addPlayer(newSeat, newUser);
        }

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            for (let i = 0; i < newData.length; i++) {
                let newUser = userData[i];
                let newSeat = newUser.seat;

                this.TexasPlayerController._getSitIdArry(newSeat, false);
            }
        }

        //刷新位置同时刷新光
        let operatingUserId = TexasData._getOperatingUserID();
        let operatingSeat = this.TexasPlayerController._getSeat("nUserId", operatingUserId);
        if (operatingUserId == UserInfo.getInfo().nUserID && operatingSeat == 1) {
            operatingSeat = 10;
        }

        let laterSeat = this.TexasPlayerController._operateSeat;
        if (laterSeat != operatingSeat) {
            this.TexasPlayerController._setLight(operatingSeat);
        }

        //刷新庄家icon
        let gameStart = TexasData._getGameStart();
        let bankUserId = TexasData._getBankUserID();
        let isPlaying = this.TexasPlayerController._getIsPlaying(bankUserId);
        if (isPlaying) {
            let bankSitid = this.TexasPlayerController._getSitId("nUserId", bankUserId);
            this._flyBankIcon(bankSitid, true);
        } else {
            if (!gameStart) {
                this.bankIcon.active = false;
            } else {
                let bankSitid = this.TexasPlayerController._getSitId("nUserId", bankUserId);
                this._flyBankIcon(bankSitid, true);
            }
        }
    },


    _flyAllCards(arry) {
        let self = this;

        let gameState = TexasData._getGameState();
        if (gameState != 1) return;

        TexasUtils._setDzFrameRate(60);

        let info = UserInfo.getInfo();
        let cardCount = TexasData._getGame() == 2 ? 4 : 2;

        // self.middleCard.y = 0;

        for (let j = 1; j <= cardCount; j++) {

            arry.forEach((nUserPos, i) => {

                let userId = self.TexasPlayerController._getUserId("nSitId", nUserPos);
                let seat = self.TexasPlayerController._getSeat("nSitId", nUserPos);
                let texasPlayer = self.TexasPlayerController._getTexasPlayer(seat);

                if (!texasPlayer) return;

                // 创建牌
                let cardItem = cc.instantiate(self.itemCardPrefab);
                cardItem.parent = self.middleCard;
                TexasUtils._getCardType(cardItem);

                let startPos = TexasUtils._getNodePos(self.middleCard, cardItem);
                let cardNode = texasPlayer.getCardNode(j);
                let endPos = TexasUtils._getNodePos(cardNode, cardItem);

                cardItem.setPosition(startPos);
                cardItem.scale = 0.4;
                cardItem.opacity = 255;
                cardItem.active = true;

                // if (userId == info.nUserID) {
                //     cardItem.x = endPos.x;
                //     cardItem.y = startPos.y - 100;
                //     cardItem.opacity = 0;
                // }


                let delayTime = 0.15 * (j - 1); // 第 2 张整体延迟

                cc.tween(cardItem)
                    .delay(delayTime)
                    .to(0.15, {
                        x: endPos.x,
                        y: endPos.y,
                    }, { easing: 'quartOut' })
                    .call(() => {
                        cardItem.destroy();
                        let selfCard = TexasData._getSelfCard();
                        if (!selfCard || !selfCard.card) return;

                        if (j == 1) {
                            let cardNum = seat == 1 && userId == info.nUserID && selfCard.card[0] ? selfCard.card[0] : 0;
                            cardCount == 4
                                ? texasPlayer._setCardSprite(cardNum, -1, -1, -1)
                                : texasPlayer._setCardSprite(cardNum, -1);
                        }

                        if (j == 2) {
                            let cardNum = seat == 1 && userId == info.nUserID && selfCard.card[1] ? selfCard.card[1] : 0;
                            cardCount == 4
                                ? texasPlayer._setCardSprite(-1, cardNum, -1, -1)
                                : texasPlayer._setCardSprite(-1, cardNum, true);
                            texasPlayer._otherPlayerCardsAni()
                        }

                        if (cardCount == 4) {
                            if (j == 3) {
                                let cardNum = seat == 1 && userId == info.nUserID && selfCard.card[2] ? selfCard.card[2] : 0;
                                texasPlayer._setCardSprite(-1, -1, cardNum, -1);
                            }
                            if (j == 4) {
                                let cardNum = seat == 1 && userId == info.nUserID && selfCard.card[3] ? selfCard.card[3] : 0;
                                texasPlayer._setCardSprite(-1, -1, -1, cardNum);
                                if (seat == 1 && userId == info.nUserID) {
                                    texasPlayer.updateCardType(selfCard.type);
                                }
                            }
                        }

                        // ===== 最后一张牌，最后一个玩家 =====
                        if (j == cardCount && i == arry.length - 1) {

                            TexasUtils._setDzFrameRate(60);
                            let bigBlind = TexasData._getBigBlind();//大盲注
                            let poolCount = 0;

                            let arrUsersBet = TexasData._getBlindData();//获得大小盲注玩家数据
                            if (!arrUsersBet || arrUsersBet.length <= 0) {
                                return;
                            }
                            for (let i = 0; i < arrUsersBet.length; i++) {
                                let userBet = arrUsersBet[i];
                                let nPos = userBet.nPos;//座位
                                let nBet = userBet.nBet;//下注

                                poolCount += nBet;

                                let type = Number(bigBlind) == Number(nBet) ? 2 : 3;
                                if (Number(nBet) / 2 == Number(bigBlind)) {//强盲
                                    type = 0;
                                }

                                let userSeat = self.TexasPlayerController._getSeat("nSitId", nPos);
                                let texasPlayers = self.TexasPlayerController._getTexasPlayer(userSeat);

                                if (!texasPlayers) {
                                    return;
                                }

                                if (texasPlayers.data.nBalance == nBet) {
                                    type = 7;
                                }
                                texasPlayers._updateDownBet(nBet, false, false);

                                if (type != 0) {
                                    let nGame = TexasData._getGame();
                                    if (nGame == 3) {
                                        if (type != 2 && type != 3) {
                                            texasPlayers._updateAction(type);
                                        }
                                    } else {
                                        texasPlayers._updateAction(type);
                                    }
                                }

                            }
                        }
                    })
                    .start();
            });
        }
    },


    //发牌
    _flyCards(index, cardIndex, arry) {
        let self = this;

        let gameState = TexasData._getGameState();
        if (gameState != 1) return;

        TexasUtils._setDzFrameRate(60);

        let info = UserInfo.getInfo();

        self.arryIndex = index;//数组索引
        self.fapaiIndex = cardIndex;//第几张牌
        self.fapaiRank = arry;//座位数据

        if (index <= arry.length - 1) {
            if (!TexasUtils._getSkin(["c"])) {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "fapai");//发牌音效
            }

            let userId = this.TexasPlayerController._getUserId("nSitId", arry[index]);
            let seat = this.TexasPlayerController._getSeat("nSitId", arry[index]);

            let texasPlayer = self.TexasPlayerController._getTexasPlayer(seat);

            if (!texasPlayer) {
                self._scheduleTime(self._updateDealCard, true, 0.1);

                return;
            }

            let cardItem = cc.instantiate(self.itemCardPrefab);
            cardItem.parent = self.middleCard;
            TexasUtils._getCardType(cardItem);
            let posStart = TexasUtils._getNodePos(self.middleCard, cardItem);
            cardItem.x = posStart.x;
            cardItem.y = posStart.y;
            cardItem.active = true;

            let head = TexasUtils._getSkin(["default", "b", "c", "d"]) ? texasPlayer.headBox : texasPlayer.node;

            let posEnd = TexasUtils._getNodePos(head, cardItem);

            cardItem.stopAllActions();
            var actionGoldMove = cc.moveTo(0.1, posEnd.x, posEnd.y);
            cardItem.runAction(cc.sequence(actionGoldMove, cc.callFunc(function (args) {
                if (cardItem) {
                    cardItem.destroy();
                }

                let selfCard = TexasData._getSelfCard();

                if (selfCard == {} || !selfCard.card) return;

                if (Number(cardIndex) == 1) {
                    let cardNum = seat == 1 && userId == info.nUserID && selfCard.card[0] ? selfCard.card[0] : 0;
                    texasPlayer._setCardSprite(cardNum, -1);
                }

                if (Number(cardIndex) == 2) {
                    let cardNum = seat == 1 && userId == info.nUserID && selfCard.card[1] ? selfCard.card[1] : 0;
                    texasPlayer._setCardSprite(-1, cardNum);

                    if (seat == 1 && userId == info.nUserID) {
                        console.log(`设置牌型1111111111111111 `);
                        //牌型
                        texasPlayer.updateCardType(selfCard.type);
                    }
                }

                self._scheduleTime(self._updateDealCard, true, 0.1);
            })));
        } else {
            if (cardIndex < 2 && cardIndex >= 1) {
                cardIndex += 1;

                self._flyCards(0, cardIndex, arry);
            } else {
                self._scheduleTime(self._updateDealCard);

                TexasUtils._setDzFrameRate(30);

                if (index == arry.length) {
                    let bigBlind = TexasData._getBigBlind();//大盲注

                    let isPoolNull = self.TexasRewardPool._checkIsPoolNull();

                    let poolCount = 0;

                    let arrUsersBet = TexasData._getBlindData();//获得大小盲注玩家数据
                    if (arrUsersBet && arrUsersBet.length > 0) {
                        for (let i = 0; i < arrUsersBet.length; i++) {
                            let userBet = arrUsersBet[i];
                            let nPos = userBet.nPos;//座位
                            let nBet = userBet.nBet;//下注

                            poolCount += nBet;

                            let type = Number(bigBlind) == Number(nBet) ? 2 : 3;
                            if (Number(nBet) / 2 == Number(bigBlind)) {//强盲
                                type = 0;
                            }

                            let userSeat = this.TexasPlayerController._getSeat("nSitId", nPos);
                            let texasPlayers = self.TexasPlayerController._getTexasPlayer(userSeat);

                            if (texasPlayers) {
                                if (texasPlayers.data.nBalance == nBet) {
                                    type = 7;
                                }
                                texasPlayers._updateDownBet(nBet, false, false);

                                if (type != 0) {
                                    let nGame = TexasData._getGame();
                                    if (nGame == 3) {
                                        if (type != 2 && type != 3) {
                                            texasPlayers._updateAction(type);
                                        }
                                    } else {
                                        texasPlayers._updateAction(type);
                                    }
                                }
                            }

                        }

                    }

                    // if (isPoolNull && poolCount!=0) {
                    //     self.TexasRewardPool._addPond(poolCount,false,true);
                    //     poolCount = 0;
                    // }

                    if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                        self.TexasTableCard.commonCardsSchedule(1);
                    }

                }

                return;
            }

        }
    },

    //奖池
    _setRewardPool(arry) {

        let self = this;

        let downBetSeat = [];//下注玩家客户端座位

        let userData = self.TexasPlayerController._getPlayerInfo();
        for (let i = 0; i < userData.length; i++) {
            let user = userData[i];
            let seat = user.seat;

            let texasPlayer = self.TexasPlayerController._getTexasPlayer(seat);
            if (texasPlayer && Number(texasPlayer._downBetCount) > 0) {
                downBetSeat.push(seat);
            }
        }

        if (downBetSeat && downBetSeat.length > 0) {
            for (let i = 0; i < downBetSeat.length; i++) {
                let nSeat = downBetSeat[i];

                let texasPlayer = self.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    let targetPool = TexasUtils._getSkin(["default", "b", "c", "d"]) ? self.TexasRewardPool.poolPos : self.TexasRewardPool.node;
                    let startNode = texasPlayer.chipZone;
                    if (TexasUtils._getClub()) {
                        let icon = texasPlayer.chipZone.getChildByName("iconChip");
                        if (icon) {
                            startNode = icon;
                        }
                    }
                    texasPlayer.chipZone.active = false;
                    self.playChipEffect(startNode, targetPool, texasPlayer._downBetCount, function () {
                        if (!cc.isValid(texasPlayer.chipZone) || !texasPlayer) {
                            return;
                        }
                        texasPlayer._downBetCount = 0;
                        texasPlayer.chipZone.active = false;
                        self.TexasRewardPool._playerChouMaAni()

                        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                            texasPlayer.chipList.destroyAllChildren();
                        }

                        if (i == downBetSeat.length - 1) {
                            self.TexasRewardPool._updatePond(arry);
                            self._setInsurePanel();
                        }

                    });
                }

            }

        } else {
            self.TexasRewardPool._updatePond(arry);
            self._setInsurePanel();
        }

    },

    //设置延时按钮
    _setDelayCost(data) {
        if (!this.delayedBtn) return;

        if (data.hasOwnProperty("tOperation")) {
            let tOperation = data.tOperation;

            if (tOperation.hasOwnProperty("nDelayCost")) {
                let nDelayCost = tOperation.nDelayCost;

                if (nDelayCost != null && nDelayCost != undefined && nDelayCost >= 0) {
                    this._setDelayGold(nDelayCost);
                } else {
                    this.delayedBtn.active = false;
                }
            }
        } else {
            this.delayedBtn.active = false;
        }
    },

    //设置延时金币
    _setDelayGold(gold) {
        gold = Number(gold);
        this.delayedBtn.active = true;
        if (gold == 0) {
            this.delayedBtn.getChildByName("free").active = true;
            this.delayedBtn.getChildByName("gold").active = false;
        } else {
            this.delayedBtn.getChildByName("free").active = false;
            this.delayedBtn.getChildByName("gold").active = true;
            this.delayedBtn.getChildByName("gold").getChildByName("text").getComponent(cc.Label).string = TexasUtils._saveTwoPoint(gold);
        }
    },

    _hideSettingPanel() {
        if (this.panelContent.getChildByName("TexasSettingPanel")) {
            let TexasSettingPanel = this.panelContent.getChildByName("TexasSettingPanel");
            TexasSettingPanel.active = false;
        }
    },

    _showSettingPanel() {
        let self = this;

        let data = {
            callBack: function (obj) {
                if (obj.bg) {
                    self._setTableInfoColor();
                    MsgManager.fire(MSG.NOTIFY.NOTIFY_GAME_BG, obj);
                }

                if (obj.poker) {
                    MsgManager.fire(MSG.NOTIFY.NOTIFY_POKERS);
                }
            }
        }

        MsgManager.fire(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, { nRlt: 0 });

        if (self.panelContent.getChildByName("TexasSettingPanel")) {
            let TexasSettingPanel = self.panelContent.getChildByName("TexasSettingPanel");
            let HallMyGameSetting = TexasSettingPanel.getComponent("HallMyGameSetting");
            HallMyGameSetting.init(data);
            TexasSettingPanel.active = true;
        } else {
            let path = "prefab/HallMyGameSetting";
            app.ClubViews.ui.loadPopup(path, function (component) {
                this.panelContent.addChild(component.node, 1024);
                component.init(data);
                component.node.name = "TexasSettingPanel";
                component.node.position = cc.Vec2.ZERO;
            }.bind(this)
                , {
                    path_resources: "main-hall/resources/"
                });
        }
    },

    _hideInsurePanel() {
        if (this.panelContent.getChildByName("TexasInsurePanel")) {
            let TexasInsurePanel = this.panelContent.getChildByName("TexasInsurePanel");
            TexasInsurePanel.active = false;
        }
    },

    _showInsurePanel(insureData) {
        let self = this;

        MsgManager.fire(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, { nRlt: 0 });

        if (self.panelContent.getChildByName("TexasInsurePanel")) {
            let TexasInsurePanels = self.panelContent.getChildByName("TexasInsurePanel");
            let TexasInsurePanel = TexasInsurePanels.getComponent("TexasInsurePanel");
            TexasInsurePanel._setInsure(insureData);
            TexasInsurePanels.active = true;
        } else {
            let path = "popup/Insure/TexasInsurePanel";
            app.texas.ui.loadPopup(path, function (component) {
                self.panelContent.addChild(component.node, 1024);
                component.node.name = "TexasInsurePanel";
                component._setInsure(insureData);
                component.node.position = cc.Vec2.ZERO;
                component.node.active = insureData ? true : false;
            }.bind(this));
        }
    },

    //更新保险回复
    _updateInsureRlt(data) {
        let insure = this.panelContent.getChildByName("TexasInsurePanel")
        if (insure) {
            let panel = insure.getComponent("TexasInsurePanel")
            panel._onRepDelayed(data)
        }
    },


    // 关闭保险面板
    _onCloseInsurePanel() {
        let panel = this.panelContent.getChildByName("TexasInsurePanel");
        if (panel) {
            let texasInsurePanel = panel.getComponent("TexasInsurePanel");
            if (texasInsurePanel) {
                texasInsurePanel.onClose();
            }
        }
    },

    _hideCarryPanel(init) {
        this.TexasGameBottomTip.node.active = false
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);
    },


    //请求查看撤码回复
    _showCarryPanel(data) {
        let tipStr = ""
        if (data.nRlt == 0) { //0成功 1不在座位上 2牌桌撤码未开启 3可撤码金币不足
            this.TexasGameBottomTip.contemtList[1].getComponent("TexasCarryTip")._initTip(this, data);
            this._setBottomTip(1)
            return
        } else if (data.nRlt == 1) {
            tipStr = "请先坐下"
        } else if (data.nRlt == 2) {
            tipStr = "牌桌撤码未开启"
        } else if (data.nRlt == 3) {
            tipStr = "可撤码余额不足"
        }


        UIFrame.showTips(tipStr)

    },

    _hideHelpPanel(init) {
        if (this.panelContent.getChildByName("TexasHelpPanel")) {
            let TexasHelpPanel = this.panelContent.getChildByName("TexasHelpPanel");
            if (init) {
                if (cc.isValid(TexasHelpPanel)) {
                    TexasHelpPanel.destroy();
                }
            } else {
                TexasHelpPanel.active = false;
            }
        }
    },

    _showHelpPanel() {
        let self = this;

        if (self.panelContent.getChildByName("TexasHelpPanel")) {
            let TexasHelpPanel = self.panelContent.getChildByName("TexasHelpPanel");
            TexasHelpPanel.active = true;
        } else {
            let path = "popup/help/TexasHelpPanel";
            app.texas.ui.loadPopup(path, function (component) {
                self.panelContent.addChild(component.node, 1024);
                component.node.name = "TexasHelpPanel";
                component._setHelpPanel();
                component.node.position = cc.Vec2.ZERO;
                component.node.active = true;
            }.bind(this));
        }
    },

    _hideDialogPanel(init) {
        if (!TexasUtils._getClub() && !TexasUtils._getSkin(["c"])) {
            this.TexasDialog.node.active = false;
        } else {
            if (this.panelContent.getChildByName("TexasDialogPanel")) {
                let TexasDialogPanel = this.panelContent.getChildByName("TexasDialogPanel");
                if (init) {
                    if (cc.isValid(TexasDialogPanel)) {
                        TexasDialogPanel.destroy();
                    }
                } else {
                    TexasDialogPanel.active = false;
                }
            }
        }
    },

    _showDialogPanel(text, type, callback, cancelCallBack) {
        let self = this;

        if (!TexasUtils._getClub() && !TexasUtils._getSkin(["c"])) {
            if (text) {
                this.TexasDialog._initDialog(type, text);
                this.TexasDialog.show(text, function (isOK) {
                    if (isOK && callback) {
                        callback();
                    }
                }.bind(this));
            }

            this.TexasDialog.node.active = true;
        } else {
            if (self.panelContent.getChildByName("TexasDialogPanel")) {
                let TexasDialogPanel = self.panelContent.getChildByName("TexasDialogPanel");
                let texasDialog = TexasDialogPanel.getComponent("texasDialog");
                if (text && type >= 0) {
                    texasDialog._initDialog(type, text);
                    texasDialog.show(text, function (isOK) {
                        if (isOK && callback) {
                            callback();
                        } else if (!isOK && cancelCallBack) {
                            cancelCallBack();
                        }
                    }.bind(this));
                } else {
                    cc.log("dialog null");
                }
                TexasDialogPanel.active = true;
            } else {
                let path = "popup/dialog/texasDialog";
                app.texas.ui.loadPopup(path, function (component) {
                    self.panelContent.addChild(component.node, 1024);
                    component.node.name = "TexasDialogPanel";
                    if (text && type >= 0) {
                        component._initDialog(type, text);
                        component.show(text, function (isOK) {
                            if (isOK && callback) {
                                callback();
                            } else if (!isOK && cancelCallBack) {
                                cancelCallBack();
                            }
                        }.bind(this));
                    } else {
                        cc.log("dialog null");
                    }
                    component.node.position = cc.Vec2.ZERO;
                    component.node.active = true;
                }.bind(this));
            }
        }
    },

    //设置保险
    _setInsurePanel() {
        let self = this;

        let info = UserInfo.getInfo();

        if (TexasData._getInsureData()) {
            let insureList = TexasData._getInsureData();
            TexasData._setInsureData(null);
            if (insureList && insureList.length > 0) {
                for (let i = 0; i < insureList.length; i++) {
                    const insureData = insureList[i];
                    if (insureData.hasOwnProperty("nInsurUserId")) {//可以买保险的玩家id
                        let nInsurUserId = insureData.nInsurUserId;

                        let seat = this.TexasPlayerController._getSeat("nUserId", nInsurUserId);
                        let texasPlayer = this.TexasPlayerController._getTexasPlayer(seat);
                        if (seat && texasPlayer) {//购买保险中
                            // texasPlayer.names.string = TexasUtils._getText(153);
                            // TexasUtils._setColor(texasPlayer.names.node,"#ffad0f");
                            texasPlayer._updateAction(-6, false, Number(insureData.nSeconds));
                            texasPlayer.setCountdownClockPosition('insure', { nRemain: Number(insureData.nSeconds), nSeconds: Number(insureData.nSeconds) }, seat)
                            // UIFrame.showTips( Base64.decode(texasPlayer.data.sName) +" 正在购买保险")
                            if (texasPlayer.data.nUserId == UserInfo.getInfo().nUserID) {
                                texasPlayer.names.node.active = false;
                            } else {
                                UIFrame.showTips(Base64.decode(texasPlayer.data.sName) + " 正在购买保险")
                            }
                        }

                        if (info.nUserID == nInsurUserId) {
                            this._showInsurePanel(insureData);
                        }
                    }
                    if (i == insureList.length - 1) {
                        this._showBuyInsureAni(false);
                    }
                }
            }

        }
    },



    _showBuyInsureAni(isEnded) {
        let aniNode = this.panelContent.getChildByName("baoxianAni")
        aniNode.scale = 1.2
        aniNode.active = !isEnded
        if (isEnded) {
            aniNode.scale = 1
            return
        }
        cc.tween(aniNode).to(0.5, { scale: 1 }, { easing: 'backOut' }).call(() => {
            // if(aniNode){
            //     aniNode.scale = 1
            //     aniNode.active = false
            // }
        }).start()

    },


    //设置保险后玩家名
    _setUserNameInsure(insure) {
        let userData = this.TexasPlayerController._getPlayerInfo();
        if (userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let nSeat = user.seat;

                let texasPlayer = this.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    texasPlayer.names.string = texasPlayer._name;
                    TexasUtils._setColor(texasPlayer.names.node);
                    // if (texasPlayer.data.nUserId==UserInfo.getInfo().nUserID) {
                    //     texasPlayer.names.node.active = false;
                    // }
                    if (insure) {
                        texasPlayer._updateAction(-2);
                    }
                }
            }
        }
    },

    //弃牌
    _disCards(seat) {
        let self = this;

        let info = UserInfo.getInfo();

        let userID = this.TexasPlayerController._getUserId("seat", seat);
        let texasPlayer = self.TexasPlayerController._getTexasPlayer(seat);

        if (texasPlayer) {
            texasPlayer._isPlaying = false;
            let startNode = texasPlayer.chipList;
            if (TexasUtils._getClub()) {
                let icon = texasPlayer.chipList.getChildByName("iconChip");
                if (icon) {
                    startNode = icon;
                }
            }


            if (info.nUserID == userID) {
                //飞筹码到奖池
                if (texasPlayer._downBetCount > 0) {//已下注
                    let counts = texasPlayer._downBetCount;
                    texasPlayer._downBetCount = 0;
                    let targetPool = TexasUtils._getSkin(["default", "b", "c", "d"]) ? self.TexasRewardPool.poolPos : self.TexasRewardPool.node;
                    texasPlayer.chipZone.active = false;
                    self.playChipEffect(startNode, targetPool, counts, function () {
                        texasPlayer.chipZone.active = false;

                        self.TexasRewardPool._playerChouMaAni()
                        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                            texasPlayer.chipList.destroyAllChildren();
                        }
                    }, true);
                } else {
                    texasPlayer._downBetCount = 0;
                    texasPlayer.chipZone.active = false;
                }
            } else {
                let targetPool = TexasUtils._getSkin(["default", "b", "c", "d"]) ? self.TexasRewardPool.poolPos : self.TexasRewardPool.node;

                let playCard = TexasUtils._getSkin(["default", "b", "c", "d"]) ? texasPlayer._cards : texasPlayer.cards;
                let posStart = TexasUtils._getNodePos(targetPool, playCard);

                //弃牌，扔牌动画
                let card_1 = playCard.getChildByName("card_1");
                let card_2 = playCard.getChildByName("card_2");
                card_1.active = false
                card_2.active = false
                let card1_back = playCard.getChildByName("card1_back")
                let card2_back = playCard.getChildByName("card2_back")

                cc.tween(card1_back).to(0.3, { x: posStart.x - playCard.width / 2, y: posStart.y, opacity: 0 }, { easing: 'quadIn' }).start()
                cc.tween(card2_back).delay(0.15).to(0.3, { x: posStart.x - playCard.width / 2, y: posStart.y, opacity: 0 }, { easing: 'quadIn' })
                    .call(() => {
                        if (playCard) {
                            playCard.active = false;
                            texasPlayer._setCardSize(1);
                        }

                        if (texasPlayer._downBetCount > 0) {
                            //飞筹码到奖池
                            let counts = texasPlayer._downBetCount;
                            texasPlayer._downBetCount = 0;
                            texasPlayer.chipZone.active = false;
                            self.playChipEffect(startNode, targetPool, counts, function () {
                                texasPlayer.chipZone.active = false;

                                if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                                    texasPlayer.chipList.destroyAllChildren();
                                }
                            }, true);
                        } else {
                            texasPlayer._downBetCount = 0;
                            texasPlayer.chipZone.active = false;
                        }

                    }).start()

            }
        }

    },



    //余额
    _setSelfAllGold(gold) {
        if (gold === null || gold === undefined) {
            // this.nGold.string = 0 + "";
            return;
        }

        if (Number(gold) != -1) {
            TexasData._setBalance(gold)
            this.nGold.string = TexasUtils._saveTwoPoint(Number(gold));
            // //如果金币不足并且开启了实时语音，则提示语音充值，并关闭实时语音
            // let status = ChatMessageMgr.getSelfAudioStatus();
            // let tableInfo = TexasData._getTableInfo();
            // let isVideoFee = tableInfo && tableInfo.isVideoFee ;
            // let nVideoFeed = tableInfo ? tableInfo.nVideoFeed : 0.002;
            // if (status && isVideoFee && Number(gold)< nVideoFeed ) {
            //     this._showRealTimeVoiceTip(true);
            // }
            // 
        }
    },

    //设置金币变化
    _setSelfGoldChange(goldChange) {
        if (goldChange === null || goldChange === undefined) {
            return;
        }

        let nGoldChange = Number(goldChange);
        if (nGoldChange != 0) {
            let selfGold = TexasData._getBalance();
            let nGolds = Math.round(Math.floor((Number(selfGold) + nGoldChange) * 10000) / 100) / 100;
            this._setSelfAllGold(nGolds);
        }
    },

    //设置播放荷官默认动作时间
    _setSpineSchedule(time) {
        // let self = this;

        // self.spineTime = time;

        // if (time>1) {
        //     self._scheduleTime(self._updateSpineAction,true,1);
        // }else {
        //     self._scheduleTime(self._updateSpineAction);

        //     self.heguanSpine.playAni(TexasSpine.TEXAS_SPINE_LIAOTOUFA,false,function() {
        //         let times = Utils.randomInt(15, 5);//随机刷新时间5~15s
        //         self._setSpineSchedule(times);
        //     });
        // }
    },

    //结算飞筹码
    poolToUserSchedule(index, arry) {
        let gameState = TexasData._getGameState();//游戏阶段
        if (gameState != 2) return;

        let self = this;

        self.poolIndex = index;//数组索引
        self.poolArry = arry;//奖池数据

        if (index <= arry.length - 1) {
            let pool = arry[index];
            let nPos = pool.nPos;//座位号
            let arrHoleCards = pool.arrHoleCards;//底牌
            let arrCombinedCards = pool.arrCombinedCards;//能组成最大牌型的5个牌
            let nCardType = pool.nCardType;//牌型
            let arrGoldGet = pool.arrGoldGet;//从各个池处中获得的金币
            let isWin = pool.isWin;//是否为赢, true时需要播放WIN特效(高亮牌型等等)
            let nProfit = pool.nProfit;//盈利
            let isShowCardWhenEnd = pool.isShowCardWhenEnd;//是否设置了结束后亮牌(只有弃牌玩家可以设置),true:是 其它:否
            let nCurGold = pool.nCurGold;//玩家当前筹码值

            let poolSeat = self.TexasPlayerController._getSeat("nSitId", nPos);
            let texasPlayer = self.TexasPlayerController._getTexasPlayer(poolSeat);

            if (isWin && Number(nProfit) > 0) {
                // self.TexasPlayerController._setAllCardGrey(nPos);//置灰玩家牌
                self.TexasTableCard._showSettlePoker([]);//置灰牌桌公共牌

                self.TexasTableCard._getLightPoker(arrCombinedCards, nCardType, true);//牌桌公共牌
                if (texasPlayer) {
                    if (isShowCardWhenEnd) {
                        texasPlayer._lightHandCard(arrCombinedCards, arrHoleCards);
                    } else {
                        texasPlayer._setCardGrey();
                    }
                }
            }

            for (let i = 0; i < arrGoldGet.length; i++) {
                let poolInfo = arrGoldGet[i];
                let nGold = poolInfo.nGold;//获得的金币
                let nPotIdFrom = poolInfo.nPotIdFrom;//金币来源(池ID)

                let poolItem = self.TexasRewardPool._getPool(nPotIdFrom);

                if (texasPlayer) {
                    //从奖池飞筹码到玩家
                    let target = TexasUtils._getSkin(["default", "b", "c", "d"]) ? texasPlayer.headBox : texasPlayer.node;
                    let startPos = self.TexasRewardPool.poolSumBg
                    self.playChipEffect(startPos, target, Number(nGold), function () {
                        // let userGold = self.TexasPlayerController._getGold("nSitId",nPos);

                        //修改玩家金币
                        // let nGolds = Number(userGold) + TexasUtils._saveTwoPoint(nGold);
                        // let nData = {
                        //     nBalance: nGolds,
                        // }

                        let nData = {
                            nBalance: nCurGold,
                        }
                        texasPlayer.changePlayerInfo(nData);

                        if (Number(nProfit) > 0) {
                            if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                                texasPlayer._playChipAnim(true);//播放筹码粒子特效
                            }
                        }

                        let isFinalPool = TexasData._checkIsFinalPool(arry, nPos, nPotIdFrom);

                        //隐藏奖池
                        if (poolItem) {
                            cc.warn("poolItem");
                            poolItem.active = false;
                        }
                    });
                }

                if (texasPlayer) {
                    console.log(`_showScore 1111111: ` + nProfit);
                    texasPlayer._showScore(nProfit);
                }

            }

            self._scheduleTime(self._updateChipToUser, true, 0.1);
        } else {
            self._scheduleTime(self._updateChipToUser);

            let failUserData = TexasData._getFailUserData();//失败玩家数据
            if (failUserData && failUserData.length > 0) {
                for (let i = 0; i < failUserData.length; i++) {
                    let userData = failUserData[i];
                    let nPos = userData.nPos;//座位号
                    let nProfit = userData.nProfit;//盈利

                    let poolSeat = self.TexasPlayerController._getSeat("nSitId", nPos);
                    let texasPlayer = self.TexasPlayerController._getTexasPlayer(poolSeat);
                    if (texasPlayer && nProfit != 0) {
                        console.log(`_showScore 22222222222: ` + nProfit);
                        texasPlayer._showScore(nProfit);
                    }
                }

            }

            if (this.poolSumBg) {
                this.poolSumBg.active = false;
            }


            return;
        }
    },

    // 飞筹码特效（修改新）
    playChipEffect(fromNode, toPlayer, bet, callback, isNoPlayAudio) {
        if (!fromNode || !toPlayer) return;

        // 播放音效
        if (TexasUtils._getSkin(["c"])) {
            TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "feichouma");
        } else if (!isNoPlayAudio) {
            TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "xiazhu");
        }


        const posStart = TexasUtils._getNodePos(fromNode, this.chipContent);
        const posEnd = TexasUtils._getNodePos(toPlayer, this.chipContent);


        if (!this.chipPool) {
            cc.error("对象池不存在");
            return;
        }

        // 从对象池获取筹码
        const chip = this.chipPool.size() > 0 ? this.chipPool.get() : cc.instantiate(this.itemChipPrefab);

        chip.parent = this.chipContent;
        chip.setPosition(posStart);
        this._chipArry.push(chip);
        cc.tween(chip)
            .delay(0.1)
            .to(0.15, { position: posEnd })
            .call(() => {
                this._onChipKilled(chip);

                if (callback) {
                    callback();
                }
            }).start();

    },


    //将不用的对象回收到对象池中
    _onChipKilled(enemy) {
        this.chipPool.put(enemy);
    },

    //清除对象池
    _clearPool() {
        if (this.chipPool) {
            this.chipPool.clear();
        }

        if (!this.chipContent) {
            this.chipContent = this.panelContent.getChildByName("chip");
        }
        this.chipContent.destroyAllChildren();

        for (let i = 0; i < this._chipArry.length; i++) {
            let chipItem = this._chipArry[i];

            if (cc.isValid(chipItem)) {
                chipItem.destroy();
            }

        }
    },



    showCutPokerView(isShow) {
        if (this.cutPokerView) {
            isShow ? this.cutPokerView.showCutPokerPanel(this) : this.cutPokerView.hideCutPokerView();
        }
    },

    //播放荷官动作
    _spinePlayAnim(action, isLoop) {
        // this.heguanSpine.playAni(action,isLoop);
    },

    //设置菜单站起(1:坐下 2:站起)
    _setIsStandUp(isStandUp) {

        let info = UserInfo.getInfo();
        let isSelfStand = this.TexasPlayerController._getSitId("nUserId", info.nUserID);//在游戏中的逻辑
        let selfIsInTable = TexasData._getSelfIsInTable();
        if (!selfIsInTable) {
            isSelfStand = false
        }

        //  let isSelfStand = this.TexasPlayerController._getIsSelfStand(info.nUserID);
        if (isSelfStand) {//判断自己是不是在牌桌，显示买入筹码按钮

            // 回放模式下不显示买入按钮
            let playBackData = TexasUtils._getClubReback();
            if (!playBackData && !app.config.IS_PLAYBACK) {
                this.buyBtn.active = true;
            } else {
                this.buyBtn.active = false;
            }
            //this.buyBtn.active = true;
            this.btnCarry.active = TexasData._getIsCarry();
            this.sitDownBtn.color = new cc.Color(101, 119, 139, 255)
            this.sitDownBtn.getChildByName('btnMask').active = true
            this.standUpBtn.getChildByName('text').color = new cc.Color(232, 223, 209, 255)
            this.standUpBtn.getChildByName('btnMask').active = false
            TexasData._saveUserState("stand");

        } else {
            TexasData._saveUserState("sitDown");
            this.buyBtn.active = false;
            this.btnCarry.active = false;
            this.sitDownBtn.color = new cc.Color(232, 223, 209, 255)
            this.sitDownBtn.getChildByName('btnMask').active = false
            this.standUpBtn.getChildByName('text').color = new cc.Color(101, 119, 139, 255)
            this.standUpBtn.getChildByName('btnMask').active = true

            ChatMessageMgr.setSelfAudioStatus(false);
            this.btnVoice.getChildByName("close").active = true;
            this.btnVoice.getChildByName("open").active = false;

        }

        if (this.texasMenuDefault) {
            this.texasMenuDefault._setCardTypeNode(isSelfStand);
            this.texasMenuDefault._setMenuBtnActive(isSelfStand);
        }
    },

    //检测超时
    _checkOverTime() {
        let info = UserInfo.getInfo();

        let isOverTime = TexasData._getIsOverTime();//超时
        if (isOverTime) {
            TexasData._setIsOverTime(false);

            let nSitId = this.TexasPlayerController._getSitId("nUserId", info.nUserID);

            let nData = {
                nSitId: nSitId,
            }

            this._controller._onRepUserStandUp(nData);

            let text = TexasUtils._getText(14);
            this._showDialog(text, UIDialog.EShowType.OK);
        }
    },
    /*************************************定时器***************************************************/

    //定时器
    _scheduleTime(callback, isStart, time) {
        if (cc.director.getScheduler().isScheduled(callback, this)) {
            cc.director.getScheduler().unschedule(callback, this);
        }

        if (isStart) {
            cc.director.getScheduler().schedule(callback, this, time, false);
        }
    },

    //更新发牌
    _updateDealCard() {
        this.arryIndex += 1;//座位

        this._flyCards(this.arryIndex, this.fapaiIndex, this.fapaiRank);
    },

    //更新飞筹码到玩家
    _updateChipToUser() {
        this.poolIndex += 1;//座位

        this.poolToUserSchedule(this.poolIndex, this.poolArry);
    },

    //更新荷官动作
    _updateSpineAction() {
        this.spineTime -= 1;

        this._setSpineSchedule(this.spineTime);
    },

    _onShowPrompt(data) {
        if (!TexasUtils._getClub()) {
            this._super(data);
            return;
        }
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

    /*************************************app消息接收***************************************************/

    //子游戏场景退出（由直播app主动触发）
    _onSubgameExitStart(data) {
        cc.warn("德州直播app主动触发", "----------------子游戏场景退出---------------", data);

        let nStr = "返回大厅请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州返回大厅请求");
        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});
        }
        app.net.send(CMD.LiveSlave.value, CMD.LiveSlave.LiveSlaveBackToLobbyReq_CMD, {});

        app.game.exitToHall();
    },

    //直播间下播，子游戏退出服务器（由直播app主动触发）
    _onLiveRoomClose(data) {
        cc.warn("德州直播app主动触发", "----------------直播间下播，子游戏退出服务器（由直播app主动触发）---------------", data);

        TexasData._setIsXiaBo(true);
    },

    /*************************************按钮***************************************************/

    //按钮
    onClickBtn(event, data) {
        let target = event.target;
        switch (target.name) {
            case "bg1"://背景
            case "bg2"://背景
                this._closeMenu();
                break;
            case "common_bg"://背景
                this._closeMenu();
                break;
            case "block"://背景
                this._closeMenu();
                break;
            case "btn_exit"://提示弹窗关闭
                this._closeDialog();
                break;
            case "menuBtn"://菜单
                if (TexasUtils._getClub()) {
                    this._setClickLight(this.meunBtn);
                }
                this.texasMenuDefault.setHallMenuControl();
                if (this.texasMenuDefault) {
                    this.texasMenuDefault.show();
                }
                break;
            case "btn_recordExit"://战绩弹窗关闭
                this._closeRecord();
                break;
            case "clickSpine"://荷官
                this._onClickSpine();
                break;
            case "backNode"://返回
                this._onClickBtnBack();
                break;
            case "backRecordNode"://返回
                this._onClickBtnRecordBack();
                break;
            case "btnFriends": //邀请好友
                this._onClickBtnFriends();
                break;
            case "sitdownNode"://坐下
                this._onClickBtnSitDown();
                break;
            case "standNode"://站起
                this._onClickBtnStand();
                break;
            case "cardTypeNode"://牌型提示
                this._onClickBtnCardType();
                break;
            case "tableNode": //牌局信息
                this._onTableInfo();
                break;
            case "btnDelayed"://延时时间
                this._onClickBtnDelayed();
                break;
            // case "btnLookCards"://让牌
            //     this._onClickBtnLookCard();
            // break;
            case "btnProcess"://牌局总览
                this._onClickBtnTableProcess();
                break;
            case "btnReview"://牌局回顾
                this._onClickBtnGameReview();
                break;
            case "btnVoice"://语音
                this._onClickBtnVoice();
                break;
            case "btnChat"://聊天
                this._onClickBtnChat();
                break;
            case "closeTableNode"://关闭牌桌
                this._onClickBtnCloseTable();
                break;
            case "hallNode"://返回大厅
                this._onClickBtnBack();
                break;
            case "stopNode"://暂停游戏
                this._onClickBtnStopGame();
                break;
            case "occupiedNode"://留座离桌
                this._onClickBtnOccupied();
                break;
            case "backSeatBtn"://回到座位
                this._onClickBtnBackSeat();
                break;
            case "continueNode"://继续游戏
                this._onClickBtnContinueGame();
                break;
            case "roomConfigNode"://房间配置
                this._onClickBtnRoomConfig();
                break;
            case "settingNode"://设置
                this._onClickBtnSetting();
                break;
            case "helpNode"://帮助
                this._onClickBtnHelp();
                break;
            case "recordNode"://战绩
                this._onClickBtnRecord();
                break;
            case "btnBuy"://买入按钮
            case "buyBtn"://买入按钮
                this._onClickBtnBuy();
                break;
            case "btnCarry"://带出按钮
                this._onClickBtnCarry();
                break;
            case "btnChangeTable"://换桌按钮
                this._onClickBtnChangeTable();
                break;
            case "btnPut"://调出收起菜单按钮
                this._onClickBtnToggleMenu();
                break;
            case "addBtn"://加牌桌
                this._onClickBtnAddTable();
                break;
            case "btn_startGame"://比赛桌开始游戏
                this._onClickBtnStartGame(target);
                break;
            case "btn_pauseGame"://比赛桌暂停游戏
                this._onClickBtnStopGame();
                break;
            case "btn_restoreGame"://比赛桌恢复游戏
                this._onClickBtnContinueGame();
                break;
            case "btn_mttBuyChip"://mtt比赛桌购买筹码
                this._onMttBuyChip();
                break;
            case "btn_closeMttTip"://关闭mtt比赛桌提示
                this.showMttTopTip({ isShow: false });
                break;
            case "btn_enterMtt"://进入mtt比赛桌
                this._onEnterMtt();
                break;
            case "changTable"://mtt比赛旁观玩家换桌
                this._onLookOnChangeTable();
                break;
            // case "btn_standUpNextRound"://新下局站起按钮
            //     this._onClickBtnStandUpNextRound();
            // break;
            // case "btn_cancleStandUpNextRound"://取消下局站起按钮
            //     this._onClickBtnCancelStandUpNextRound();
            // break;
            case "infoBg":
            case "insureBg": //保险盾
            case "addUSDT"://打开充币界面
                this._onClickHallRechargeView();
                break;

            default:
                break;
        }
    },



    _onClickHallRechargeView() {
        this.createGameRechargeView(this.panelContent);

        // let rechargeNode = cc.instantiate(this.HallRechargeNew);
        // rechargeNode.parent = this.panelContent;
        // let rechargeNodeJS = rechargeNode.getComponent("texasTableItem");
        // if(rechargeNodeJS){
        //     // rechargeNodeJS.
        // }
    },

    //关闭菜单
    _closeMenu() {
        this.TexasPaoMa.close();

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            if (this.texasMenuDefault) {
                this.texasMenuDefault.close();
            }
        } else {
            var toggle = this.meunBtn.getComponent(cc.Toggle);
            if (null != toggle) {
                if (toggle.isChecked) {
                    toggle.isChecked = false;
                }
            }
        }

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.TexasPlayerController._resetKick();
        }
    },

    //关闭提示弹窗
    _closeDialog() {
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);
        this._hideDialogPanel();
        // this.TexasDialog.node.active = false;
    },

    //关闭战绩弹窗
    _closeRecord() {
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);
        if (this.TexasRecord) {
            this.TexasRecord.node.active = false;
        }
    },

    //荷官
    _onClickSpine() {
        this._spinePlayAnim(TexasSpine.TEXAS_SPINE_FEIWEN, false);
    },

    //提示
    _showDialog(text, type, callback, cancelCallBack) {
        TexasData._setWindowData(3);

        if (this.TexasRecord) {
            this.TexasRecord.node.active = false;
        }

        if (TexasUtils._getSkin(["default", "b", "d"]) && this.TexasSetting) {
            this.TexasSetting.node.active = false;
        } else {
            this._hideSettingPanel();
        }

        if (this.TexasHelp) {
            this.TexasHelp.node.active = false;
        } else {
            this._hideHelpPanel();
        }

        if (this.TexasBuyTip) {
            this.TexasBuyTip.node.active = false;
        }

        this._showDialogPanel(text, type, callback, cancelCallBack);

        // this.TexasDialog._initDialog(type,text);
        // this.TexasDialog.show(text, function (isOK) {
        //     if (isOK && callback) {
        //         callback();
        //     }
        // }.bind(this));
        // this.TexasDialog.node.active = true;
    },

    //牌局回放返回
    _onClickBtnRecordBack() {
        // let HallClubCacheData = TexasUtils._getClub() ? require("HallClubCacheData") : null;

        // if (HallClubCacheData) {
        //     HallClubCacheData.savePlayBackData({});
        //     if (cc.isValid(this.node)) {
        //         this.node.destroy();
        //     }
        // }

        
        let HallClubCacheData = TexasUtils._getClub() ? require("HallClubCacheData") : null;

        app.ui.loadPopup("popup/dialog/UIDialog", function (component) {
            this.node.addChild(component.node, 1024);

            component.show(
                "确定要退出牌局回放吗？",
                function (isOK) {
                    if (isOK) {
                        // 确认退出
                        if (HallClubCacheData) {
                            HallClubCacheData.savePlayBackData({});
                            if (cc.isValid(this.node)) {
                                this.node.destroy();
                            }
                        }
                    } else {
                        // 取消退出
                        cc.log("取消退出");
                    }
                }.bind(this)
            );
        }.bind(this));
    },

    //返回
    _onClickBtnBack() {
        cc.log("点击返回");

        let self = this;
        if (self._exiting) {
            return;
        }

        // self._exiting = true;

        self._closeMenu();

        if (TexasUtils._getClub()) {
            this._setClickLight(this.backNode);
        }

        let playBackData = TexasUtils._getClubReback();
        if (playBackData) {
            self._onClickBtnRecordBack();
            self._exiting = false;
            return;
        }

        let info = UserInfo.getInfo();

        let gameStart = TexasData._getGameStart();
        let isSelfPlaying = self.TexasPlayerController._getIsPlaying(info.nUserID);
        if (isSelfPlaying && gameStart) {//自己在玩，判断游戏是否结束

            let text = TexasUtils._getText(15);
            let type = UIDialog.EShowType.OKCANCEL
            if (TexasData.isMTTMatch()) {
                text = TexasUtils._getText(213);
                type = 3
            }
            self._showDialog(text, type, function () {
                // App.postMessage(AppBridge.EVENT.GAME_HIDE, {
                // });

                // cc.warn("-----------------------------------------------------------------------------------------德州返回大厅请求");
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});

                // app.game.exitToHall();
                self._onClickBtnForceStand();
                self._reqBackHall();
                TexasData._setStandUpNextHand(false);
                self.scheduleOnce(function() {
                    TexasUtils.toggleExitGame();
                }, 0.2);
            }, function () {
                self._exiting = false;
            });
            
        } else {//自己不在玩,直接返回
            // App.postMessage(AppBridge.EVENT.GAME_HIDE, {
            // });

            // cc.warn("-----------------------------------------------------------------------------------------德州返回大厅请求");
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});

            // app.game.exitToHall();
            self._onClickBtnForceStand();
            self._reqBackHall();
            TexasData._setStandUpNextHand(false);
            self.scheduleOnce(function() {
                TexasUtils.toggleExitGame();
            }, 0.2);
        }
    },

    //请求返回大厅
    _reqBackHall() {
        cc.log("_reqBackHall");
        TexasData._setSelfIsInTable(false);
        if (TexasUtils._getSkin(["b", "c"])) {
            let nStr = "返回大厅请求";
            // cc.warn("-----------------------------------------------------------------------------------------德州返回大厅请求");
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});
            }
            app.net.send(CMD.LiveSlave.value, CMD.LiveSlave.LiveSlaveBackToLobbyReq_CMD, {});
        }
    },

    //邀请好友
    _onClickBtnFriends() {
        this._closeMenu();

        if (this.inviteFriends) {
            let obj = cc.instantiate(this.inviteFriends)
            this.node.addChild(obj)
        }
    },

    //坐下
    _onClickBtnSitDown() {
        cc.log("点击坐下:", App.checkAccount());

        this._closeMenu();

        if (!App.checkAccount()) {
            cc.log("-----------------------------------------------------------------------------------------德州 游客账号不可坐下");

            return;
        }

        // 重置下局站起状态 - 重新入座时状态为否
        TexasData._setStandUpNextHand(false);

        let data = {
            nPos: 0,
        }

        let nStr = "坐下请求";
        if (TexasUtils._getClub()) {
            TexasUtils._getLongAndLatitude(function (longitude, latitude) {
                if (longitude && latitude) {
                    let tGps = {
                        nLongitude: longitude,
                        nLatitude: latitude,
                    }

                    data.tGps = tGps;
                }

                if (TexasUtils._getCanSitDown()) {
                    // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",data);
                    TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, data);
                    // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, data);
                }
            });
        } else {
            // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",data);
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, data);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, data);
        }
    },

    //站起
    _onClickBtnStand() {
        cc.log("点击站起");
        let info = UserInfo.getInfo();
        this._closeMenu();
        let isSelfPlaying = this.TexasPlayerController._getIsPlaying(info.nUserID);
        let gameStart = TexasData._getGameStart();
        if (isSelfPlaying && gameStart) { //游戏中是下局站起的功能
            this._onClickBtnStandUpNextRound();
        } else {
            let nStr = "站起请求";
            // cc.warn("-----------------------------------------------------------------------------------------德州站起请求");
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouStanpUpReq_CMD, {});
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouStanpUpReq_CMD, {});
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouStanpUpReq_CMD, {});
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouStanpUpReq_CMD, {});
            }
        }
    },

    //强制站起
    _onClickBtnForceStand() {
        let nStr = "站起请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州站起请求");
        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouStanpUpReq_CMD, {});
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouStanpUpReq_CMD, {});
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouStanpUpReq_CMD, {});
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouStanpUpReq_CMD, {});
        }
    },

    //牌型提示
    _onClickBtnCardType() {
        this._closeMenu();

        if (this.TexasCardType) {
            this.TexasCardType.show();
        }
    },

    //牌局信息
    _onTableInfo() {
        let path = "popup/tableInfo/TexasTableConfigInfo"
        app.texas.ui.loadPopup(path, function (component) {
            this.panelContent.addChild(component.node, 1024);
        }.bind(this));
        this._closeMenu();
    },

    //延时时间
    _onClickBtnDelayed() {
        if (this._isClickAddTime) return
        this.scheduleOnce(() => {
            this._isClickAddTime = false
        }, 0.2)
        this._isClickAddTime = true

        let params = {
            isInsure: false,
        };
        let nStr = "延时请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.DelayReq_CMD, params);
        // cc.warn("-----------------------------------------------------------------------------------------德州延时请求");
        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.DelayReq_CMD, {});
    },

    //牌局总览
    _onClickBtnTableProcess() {
        this._closeMenu();

        this._setClickLight(this.panel_bottom.getChildByName("btnProcess"));

        let nStr = "牌桌总览请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOverViewReq_CMD, {});
        // cc.warn("-----------------------------------------------------------------------------------------德州牌桌总览请求");
        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOverViewReq_CMD, {});
    },

    //牌局回顾
    _onClickBtnGameReview() {
        let self = this;

        self._closeMenu();

        this._setClickLight(this.panel_bottom.getChildByName("btnReview"));

        let tableId = TexasData._getCurTableId();
        if (TexasData.getIsFreeGame()) {
            tableId = TexasData.getFreeGameTableId();
        }
        let sendData = {}
        sendData.sTableId = tableId;
        if (TexasUtils._getClub()) {
            app.club.getTalblePaiJuIdList(sendData, function (data) {
                if (self.TexasGameReview && self.TexasGameReview._setData) {
                    self.TexasGameReview._setData(data);
                }

            });//获取牌桌牌局id列表
        }
    },


    updateSelfVoice(volume) {
        let light = this.btnVoice.getChildByName("lightMash");
        if (volume < 0.03) {
            light.active = false
            return
        }
        // console.log("自己的语音声音： ", volume.toFixed(4));
        // 音量区间 对应节点位置 -47到0
        const minVolume = 0.03;
        const maxVolume = 0.1;
        const minY = -47;
        const maxY = 0;
        const v = Math.min(Math.max(volume, minVolume), maxVolume);
        // 映射区间
        const ratio = (v - minVolume) / (maxVolume - minVolume);
        const posY = minY + ratio * (maxY - minY);


        light.active = true;
        light.y = posY;
    },


    //语音
    _onClickBtnVoice() {
        this._closeMenu();
        let info = UserInfo.getInfo();
        let selfSitId = this.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (!selfSitId) {
            ChatMessageMgr.setSelfAudioStatus(false);
            this.btnVoice.getChildByName("close").active = true;
            this.btnVoice.getChildByName("open").active = false;
            this.btnVoice.getChildByName("lightMash").active = false;
            UIFrame.showTips("请先坐下才能使用语音功能");
            return;
        }


        let isSurePermission = ChatMessageMgr.getAudioPermission()
        console.log(`获取权限 ： `, isSurePermission);
        if (!isSurePermission) {
            console.log(`请求获取权限 弹出授权`);

            if (!this._canClick) {
                UIFrame.showTips("操作过于频繁，请稍后再试");
                return;
            }
            this._canClick = false;
            this.scheduleOnce(() => {
                this._canClick = true;
            }, 1);

            ChatMessageMgr._checkAudioPermission()
                .then(() => {
                    ChatMessageMgr.setAudioPermission(true);
                    // 下一帧
                    setTimeout(() => {
                        ChatMessageMgr.reconnect();
                    }, 100);
                })
                .catch(err => {
                    console.log("用户拒绝麦克风权限", err);
                    ChatMessageMgr.setAudioPermission(false);
                });

        } else {
            console.log(`已经授权，获取麦克风状态`);
            let status = ChatMessageMgr.getSelfAudioStatus()
            // console.log(`已经授权，获取麦克风状态`,status );
            this.btnVoice.getChildByName("close").active = status;
            this.btnVoice.getChildByName("open").active = !status;
            // this.btnVoice.getChildByName("lightMash").active = !status;
            ChatMessageMgr.setSelfAudioStatus(!status);

            // let showTipStr = localStorage.getItem("TEXAS_VOICE_ISSHOW_TIP") || "0";
            // let oldTime = parseInt(showTipStr);
            // //如果tipNum为0，说明没有显示过提示，需要显示提示，如果大于0，需要判断是否是第二天，如果是第二天，则显示提示，如果不是第二天，则不显示提示
            // let isSame = this.isSameDay(Date.now(), oldTime) ;

            // //这里需要加上是否开启语音收费模式
            // if (!status && (showTipStr === "0" || !isSame)) {
            //     this._showRealTimeVoiceTip();
            // }else{
            //     this.voiceSwitch(status);
            // }



        }



    },

    isSameDay(date1, date2) {
        // 创建新的日期对象以避免修改原对象
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();
    },

    //开启或关闭语音
    voiceSwitch(status) {
        console.log(`已经授权，获取麦克风状态`, status);
        this.btnVoice.getChildByName("close").active = status;
        // this.btnVoice.getChildByName("lightMash").active = !status;
        this.btnVoice.getChildByName("open").active = !status;
        ChatMessageMgr.setSelfAudioStatus(!status);
    },


    //聊天
    _onClickBtnChat() {
        let info = UserInfo.getInfo();
        let selfSitId = this.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (!selfSitId) {
            ChatMessageMgr.setSelfAudioStatus(false);
            UIFrame.showTips("请先坐下才能使用聊天功能");
            return;
        }
        let player = this.TexasPlayerController._getUserNode(UserInfo.getInfo().nUserID)
        if (!player) {
            return
        }
        this._closeMenu();

        // UIFrame.showTips("聊天待接入");
        if (this.ChatPanelView) {
            this.ChatPanelView.show();
        }
        this._setClickLight(this.panel_bottom.getChildByName("btnChat"));
    },

    //关闭牌桌
    _onClickBtnCloseTable() {
        let self = this;

        self._closeMenu();

        let gameStart = TexasData._getGameStart();

        if (gameStart) {
            let text = TexasUtils._getText(97);
            self._showDialog(text, UIDialog.EShowType.OKCANCEL, function () {
                if (self._controller.saveData) {
                    let clubId = TexasData._getClubId();
                    let sTableId = self._controller.saveData.sTableId;
                    app.club.closeClubTable(clubId, sTableId);
                }
            });
        } else {
            if (self._controller.saveData) {
                let clubId = TexasData._getClubId();
                let sTableId = self._controller.saveData.sTableId;
                app.club.closeClubTable(clubId, sTableId);
            }
        }
    },

    //暂停游戏
    _onClickBtnStopGame() {
        let data = {
            isPause: true,
        }

        let nStr = "牌桌暂停游戏请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州暂停游戏请求:",data);
        if (TexasUtils._getClub()) {
            this._closeMenu();

            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPauseReq_CMD, data);
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPauseReq_CMD, data);
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouPauseReq_CMD, data);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouPauseReq_CMD, data);
        }
    },

    //留座离桌
    _onClickBtnOccupied() {
        this._closeMenu();

        let nStr = "留座离桌请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouRetainReq_CMD, { nOp: 0 });
    },

    //回到座位
    _onClickBtnBackSeat() {
        let nStr = "回到座位请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouRetainReq_CMD, { nOp: 1 });
    },

    //继续游戏
    _onClickBtnContinueGame() {
        let data = {
            isPause: false,
        }

        let nStr = "继续游戏请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州继续游戏请求:",data);
        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPauseReq_CMD, data);
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPauseReq_CMD, data);
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouPauseReq_CMD, data);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouPauseReq_CMD, data);
        }
    },

    //开始游戏
    _onClickBtnStartGame(target) {
        var dis = target.getChildByName("dis");
        if (dis.active) {
            return;
        }
        this._onClickBtnContinueGame();
    },

    //房间配置
    _onClickBtnRoomConfig() {
        TexasData._setIsShowRoomConfig(true);

        if (this.TexasRecord) {
            this.TexasRecord.node.active = false;//战绩
        }
        if (this.TexasSetting) {
            this.TexasSetting.node.active = false;//设置
        }
        if (this.TexasHelp) {
            this.TexasHelp.node.active = false;//帮助
        }

        if (this.TexasBuyTip) {
            this.TexasBuyTip.node.active = false;//购买筹码
        }

        let configData = TexasData._getSelectConfig();
        if (this.TexasRoomConfigPanel) {
            this.TexasRoomConfigPanel._initConfigPanel(configData);
            this.TexasRoomConfigPanel.node.active = true;
        }
    },

    //设置
    _onClickBtnSetting() {
        cc.log("点击设置");

        let self = this;

        self._closeMenu();

        // TexasData._setWindowData(2);

        if (TexasUtils._getClub()) {
            this._showSettingPanel();
        } else {
            if (this.TexasSetting) {
                this.TexasSetting.initUI();
                this.TexasSetting.node.active = true;
            }
        }


        // if (this.TexasSetting) {
        //     this.TexasSetting.initUI();
        //     this.TexasSetting.node.active = true;
        // }

        // let settingParent = self.node;

        // let path = "popup/setting/TexasSettingPanel";
        // app.texas.ui.loadPopup(path, function (component) {
        //     settingParent.addChild(component.node, 1024);
        //     component.initUI();
        //     component.node.position = cc.Vec2.ZERO;
        // }.bind(this));
    },

    //帮助
    _onClickBtnHelp() {
        cc.log("点击帮助");

        let self = this;

        self._closeMenu();

        TexasData._setWindowData(1);

        if (TexasUtils._getSkin(["c"])) {
            this._showHelpPanel();
        } else {
            let text = i18n.t("texasHelpData");
            let json = JSON.parse(text);

            if (this.TexasHelp) {
                this.TexasHelp.setData(json);
                this.TexasHelp.node.active = true;
            }
        }
    },

    //战绩
    _onClickBtnRecord() {
        cc.log("点击战绩");

        this._closeMenu();

        TexasData._setWindowData(5);

        if (this.TexasRecord) {
            this.TexasRecord._initRecordList(this);
            this.TexasRecord.node.active = true;
        }
    },

    //买入按钮
    _onClickBtnBuy() {
        cc.log("点击买入按钮");

        if (TexasUtils._getSkin(["c"])) {
            this._closeMenu();
        }

        let nStr = "筹码买入范围查看请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州筹码买入范围查看请求");
        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTakeInRangeReq_CMD, {});
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTakeInRangeReq_CMD, {});
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouTakeInRangeReq_CMD, {});
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouTakeInRangeReq_CMD, {});
        }
    },


    //换桌按钮
    _onClickBtnChangeTable(tableId) {
        cc.log("点击换桌按钮");

        // return;

        let self = this;

        let info = UserInfo.getInfo();

        let gameStart = TexasData._getGameStart();
        let isSelfPlaying = self.TexasPlayerController._getIsPlaying(info.nUserID);

        if (!isSelfPlaying) {//自己不在玩,直接换桌
            self._reqChangeTable(tableId);
        } else {//自己在玩
            if (gameStart) {//游戏开始，提示换桌
                let text = TexasUtils._getText(77);
                self._showDialog(text, UIDialog.EShowType.OKCANCEL, function () {
                    self._reqChangeTable(tableId);
                });
            } else {//游戏未开始，直接换桌
                self._reqChangeTable(tableId);
            }
        }
    },

    //调出收起菜单按钮
    _onClickBtnToggleMenu(data) {
        // if (this.menuLayout && this.itemTablePrefab) {
        //     let layoutTable = this.menuLayout.getChildByName("layoutTable");
        //     layoutTable.destroyAllChildren();

        //     for (let i=0; i<data.length; i++) {
        //         let tableItem = cc.instantiate(this.itemTablePrefab);
        //         tableItem.parent = layoutTable;
        //         let texasTableItem = tableItem.getComponent("texasTableItem");
        //         texasTableItem._createTableItem(this);
        //         tableItem.active = true;
        //     }
        // }

        this.scheduleOnce(function () {
            this._initBtnPut();
        }, 0.1);
    },

    //加牌桌
    _onClickBtnAddTable() {
        if (this.TexasTableInfo) {
            this.TexasTableInfo._createList(this);
            this.TexasTableInfo.show();
        }
    },

    //调出收起菜单按钮
    _initBtnPut(isPutOut) {
        if (this.menuPut && this.menuLayout) {
            cc.log("_initBtnPut");
            let nWidth = this.menuLayout.width;

            let putOut = this.menuPut.getChildByName("putOut");
            let putIn = this.menuPut.getChildByName("putIn");

            if (isPutOut) {
                putOut.active = isPutOut;
                putIn.active = !isPutOut;

                this.menuLayout.x = -nWidth;
                this.menuLayout.active = false;
            } else {
                putOut.active = !putOut.active;
                putIn.active = !putIn.active;

                if (putOut.active && !putIn.active) {
                    let seq = cc.sequence(
                        cc.moveTo(0.1, -nWidth, this.menuLayout.y),
                        cc.callFunc(function (params) {

                        }, this)
                    )
                    this.menuLayout.active = true;
                    this.menuLayout.stopAllActions();
                    this.menuLayout.runAction(seq);
                }

                if (!putOut.active && putIn.active) {
                    let seq = cc.sequence(
                        cc.moveTo(0.1, 0, this.menuLayout.y),
                        cc.callFunc(function (params) {

                        }, this)
                    )
                    this.menuLayout.active = true;
                    this.menuLayout.stopAllActions();
                    this.menuLayout.runAction(seq);
                }


            }
        }
    },

    //请求换桌
    _reqChangeTable(tableId) {
        let self = this;

        let info = UserInfo.getInfo();

        if (self._controller) {
            let controller = self._controller;

            let data = {
                nUserId: info.nUserID,//ID
                sTableId: "",//桌子ID
                isKeepStand: true,//进房间默认不坐下
                nRoomId: controller.saveData.nRoomId,
                nIsChangeTable: 1,//是否为切换牌桌 1:是 其它:否 (1时，nRoomId字段也要填上)
            }

            if (tableId) {
                data.sTableId = tableId;
                data.nRoomId = "";
            }

            cc.log("_onClickBtnChangeTable data:", data);

            this._blockIndex = UIFrame.showBlock(i18n.t("HALL.REQUESTDATA"), true, function (params) {
                UIFrame.showTips(i18n.t("HALL.REQUESTTIMEOUT"));
            }, 5);
            controller._reqEnterGame(data);
        } else {
            cc.error("this._controller 不存在");
        }
    },

    //GM
    _onClickBtnGM() {
        cc.log("点击GM");

        let path = "popup/gmcommand/gmCommandPanel";
        app.LiveAssets.ui.loadPopup(path, function (component) {
            this.node.addChild(component.node, 1024);
            component.setCallBack(function (str) {
                let data = {
                    sStr: str
                }

                let nStr = "Gm命令请求";
                cc.warn("-----------------------------------------------------------------------------------------德州Gm命令请求:", data);
                if (TexasUtils._getClub()) {
                    TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouGmReq_CMD, data);
                    // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouGmReq_CMD, data);
                } else {
                    TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouGmReq_CMD, data);
                    // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouGmReq_CMD, data);
                }
            });
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
            , {
                path_resources: "main-common/resources/"
            });
    },

    //测试按钮
    onClickTest(event, data) {
        data = Number(data);

        let nData = {
            nPos: data,
        }

        let nStr = "坐下请求";
        if (TexasUtils._getClub()) {
            TexasUtils._getLongAndLatitude(function (longitude, latitude) {
                if (longitude && latitude) {
                    let tGps = {
                        nLongitude: longitude,
                        nLatitude: latitude,
                    }

                    nData.tGps = tGps;
                }

                if (TexasUtils._getCanSitDown()) {
                    TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, nData);
                    // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",nData);
                    // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, nData);
                }
            });
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, nData);
            // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",nData);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, nData);
        }
    },

    //设置测试语音按钮
    _setTestVoiceBtn(sitId, isOpen) {
        let voice = this.testVoice.children;
        if (voice && voice.length > 0) {
            for (let i = 0; i < voice.length; i++) {
                let voiceChild = voice[i];

                let close = voiceChild.getChildByName("close");
                let label = voiceChild.getChildByName("label");
                if (label) {
                    let nLabel = label.getComponent(cc.Label);

                    nLabel.string = "开" + (i + 1);
                    close.active = false;

                    if (sitId) {
                        let str = isOpen ? "开" : "关";
                        nLabel.string = str + (i + 1);
                        close.active = isOpen ? false : true;
                    }
                }
            }
        }
    },

    //设置点击光效
    _setClickLight(node) {
        let light = node.getChildByName("light");
        if (light) {
            light.active = true;
            this.scheduleOnce(function () {
                light.active = false;
            }, 0.1);
        }
    },

    //设置语音按钮效果
    _setClickVoiceLight(isLight) {
        let child = this.btnVoice.getChildByName('light')
        if (child) {
            child.active = isLight
        }
    },

    //发送关闭语音按钮
    onClickBtnTestVoice(event, data) {
        data = Number(data);

        let userShopAcc = this.TexasPlayerController._getShopAcc("nSitId", data);

        if (!userShopAcc) {
            UIFrame.showTips("玩家不存在");

            return;
        }

        let volume = 1;
        let btn = this.testVoice.getChildByName(data + "");
        if (btn) {
            let close = btn.getChildByName("close");
            let label = btn.getChildByName("label").getComponent(cc.Label);
            if (!close.active) {//要关闭
                close.active = true;
                label.string = "关" + data;
            } else {//要开启
                volume = 0;
                close.active = false;
                label.string = "开" + data;
            }
        }

        let nData = [
            {
                userid: userShopAcc,
                volume: volume, //mic音量大小，取值[0~100]。0表示没声音，大于等于1表示有声音
            }
        ]

        this._controller._onRepMicVolume(nData);
    },

    //测试麦状态
    onClickBtnTestMicState(event, data) {
        let self = this;

        let micState = Number(data);

        let path = "popup/gmcommand/gmCommandPanel";
        app.LiveAssets.ui.loadPopup(path, function (component) {
            self.node.addChild(component.node, 1024);
            component.setCallBack(function (str) {
                let nSitId = Number(str);

                if (nSitId == 1 || nSitId == 2 || nSitId == 3 || nSitId == 4 || nSitId == 5 || nSitId == 6) {
                    let userShopAcc = self.TexasPlayerController._getShopAcc("nSitId", nSitId);
                    if (!userShopAcc) {
                        UIFrame.showTips("玩家不存在");

                        return;
                    }

                    let nData = [
                        {
                            userid: userShopAcc,
                            status: micState, //0正常连麦状态 ，1麦克风不可用，2本地闭麦，3静音
                        }
                    ]

                    self._controller._onRepMicUserList(nData);
                } else {
                    UIFrame.showTips("请输入1-6的整数座位");
                }
            });
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
            , {
                path_resources: "main-common/resources/"
            });
    },



    //加载聊天模块
    loadChat() {
        if (!TexasUtils._getClub() || TexasUtils._getClubReback()) {
            return
        }

        let self = this;
        let prefabName = "chat_panel";
        let path = app.chat.path("prefab/" + prefabName);
        app.chat.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (!error && cc.isValid(this)) {
                let prefNode = cc.instantiate(prefab);
                self.node.addChild(prefNode, 1024, "chat_panel");
                self.ChatPanelView = prefNode.getComponent("ChatPanelView");
                prefNode.active = false;
            } else {
                cc.warn("----loadingPrefab------error", error);
            }
        }.bind(this))

    },


    //加载弹幕模块
    loadBulletChat() {
        if (!TexasUtils._getClub() || TexasUtils._getClubReback()) {
            return
        }

        let self = this;
        let prefabName = "bullet_chat_panel";
        let path = app.chat.path("prefab/" + prefabName);
        app.chat.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (!error && cc.isValid(this)) {
                let prefNode = cc.instantiate(prefab);
                self.chatNode.addChild(prefNode, 1024, "bullet_chat_panel");
                prefNode.active = true;
                prefNode.x = 0
            } else {
                cc.warn("----loadingPrefab------error", error);
            }
        }.bind(this))

    },


    loadCutPokerPanel() {
        let path = "popup/cutPokerView";
        app.texas.ui.loadPopup(path, function (component) {
            this.TexasTableInfo.node.addChild(component.node, 25);
            this.cutPokerView = component
            component.node.zIndex = 30;
            component.node.name = "cutPokerView";
            component.node.position = cc.Vec2.ZERO;
            component.node.active = false;
        }.bind(this))
    },

    loadCunZhengPanel() {
        // 回放模式下不加载存证面板
        let playBackData = TexasUtils._getClubReback();
        if (playBackData || app.config.IS_PLAYBACK) {
            cc.warn("回放模式下，跳过加载存证面板");
            return;
        }

        let path = "popup/hashcard/CunZhengPanel";
        app.texas.ui.loadPopup(path, function (component) {
            this.TexasTableInfo.node.addChild(component.node, 25);
            this.CunZhengPanel = component
            component.node.zIndex = 18;
            component.node.name = "CunZhengPanel";
            component.node.position = cc.Vec2.ZERO;
        }.bind(this))
    },

    loadGameOverPanel() {
        let path = "popup/gameover/TexasGameOverPanel";
        app.texas.ui.loadPopup(path, function (component) {
            this.node.addChild(component.node);
            this.TexasGameOverPanel = component;
            component.node.active = false;
            component.node.zIndex = 99;
            component.node.name = "TexasGameOverPanel";
            component.node.position = cc.Vec2.ZERO;
            component.init(this);
        }.bind(this))
    },

    showGameOverPanel(data) {
        if (this.TexasGameOverPanel) {
            this.TexasGameOverPanel.node.active = true;
            let info = TexasData._getTableInfo();
            let mangzhuStr = Utils.showClubTableInfo(
                '',
                TexasData._getSmallBlind(),
                TexasData._getBigBlind(),
                info.nZhuaTou,
                info.nPreAnte,
                TexasData._getPreAnteOdd(),
                app.game.getGame().getSubGameID()
            );
            cc.log("mangzhuStr", mangzhuStr)
            var gameData = {
                "tProfit": data.tProfit || 0,
                "nTakeIn": data.nTakeIn || 0,
                "nHandProfit": data.nHandProfit || 0,
                "nCount": data.nCount || 0,
                "blindStr": mangzhuStr,
                "tableId": TexasData._getCurTableId(),
            }
            this.TexasGameOverPanel.setData(gameData);
        }
    },

    //设置胜率
    setWinRate(data, isOperate) {
        if (!TexasUtils._getClub()) {
            return;
        }
        //胜率
        if (data) {
            let arrWinRate = data;
            arrWinRate.sort(function (a, b) {//从大到小排列
                return b.nWinRate - a.nWinRate;
            });

            if (isOperate && arrWinRate.length == 1) {
                return;
            }

            for (let i = 0; i < arrWinRate.length; i++) {
                let winRate = arrWinRate[i];
                let nPos = winRate.nPos;//座位号
                let nWinRate = winRate.nWinRate;//胜率 (值100即为100%, <=0:无意义)

                let nSeat = this.TexasPlayerController._getSeat("nSitId", nPos);
                let texasPlayer = this.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    if (Number(nWinRate) >= 0) {
                        // texasPlayer._updateAction(-8,false,nWinRate);
                        let index = 0;
                        if (i == 0 || Number(nWinRate) == 100) {
                            index = 1;
                        }
                        texasPlayer._setWinRateBg(index);
                    }
                }
            }
        }
    },

    _onRollback() {
        //回退时，返回到房间界面
        this._onClickBtnBack();
    },


    setMatchBtn() {
        if (!this.matchBtn) {
            return;
        }

        if (!TexasUtils._getSkin(["default", "d"])) {
            return;
        }

        let isMatchTable = TexasUtils._isMatchTable();
        if (!isMatchTable) {
            this.matchBtn.active = false;
            return;
        }

        let isTableManager = TexasData.getIsMatchTableManager();
        if (!isTableManager) {
            this.matchBtn.active = false;
            return;
        }

        this.matchBtn.active = true;
        let matchStatus = TexasData.getTableMStatus();
        let btn_startGame = this.matchBtn.getChildByName("btn_startGame");
        let btn_pauseGame = this.matchBtn.getChildByName("btn_pauseGame");
        let btn_restoreGame = this.matchBtn.getChildByName("btn_restoreGame");
        btn_startGame.active = false;
        btn_pauseGame.active = false;
        btn_restoreGame.active = false;

        if (matchStatus == 0) {
            let userData = this.TexasPlayerController._getPlayerInfo();
            let nor = btn_startGame.getChildByName("nor");
            let dis = btn_startGame.getChildByName("dis");
            btn_startGame.active = true;
            nor.active = false;
            dis.active = false;

            if (userData && userData.length >= 2) {
                nor.active = true;
            } else {
                dis.active = true;
            }

        } else if (matchStatus == 1) {
            btn_restoreGame.active = true;
        } else {
            btn_pauseGame.active = true;
        }
    },

    //----------------俱乐部mtt比赛-------------------------------------
    //mtt比赛桌排名信息
    showMttTabelInfo(data) {
        this.panel_MTT.active = false
        return

        if (this.panel_MTT) {

            if (this.mttTimeSchedule) {
                this.unschedule(this.mttTimeSchedule);
                this.mttTimeSchedule = null;
            }

            let mttTopInfo = this.panel_MTT.getChildByName("mttTopInfo");
            if (!this.MttWaitStart.active) {
                mttTopInfo.active = true;
            }


            let lab_rank = mttTopInfo.getChildByName("info").getChildByName("lab_rank");
            let lab_bet = mttTopInfo.getChildByName("info").getChildByName("lab_bet");
            let lab_time = mttTopInfo.getChildByName("info").getChildByName("lab_time").getComponent(cc.Label);
            if (data.nRank) {
                lab_rank.getComponent(cc.Label).string = data.nRank + "/" + data.nCnt;
            }

            if (data.nChipAv) {
                lab_bet.getComponent(cc.Label).string = data.nChipAv;
            }

            if (data.nBlindUpR && data.nBlindUpR > 0) {
                lab_bet.active = false;
                lab_time.node.active = true;
                let time = data.nBlindUpR;

                let getTime = function (nowTime) {
                    let second = nowTime % 60;
                    if (second < 10) {
                        second = "0" + second;
                    }

                    let min = Math.floor(time / 60);
                    if (min < 10) {
                        min = "0" + min;
                    }

                    return min + ":" + second
                }

                lab_time.string = getTime(time);
                this.mttTimeSchedule = function () {
                    if (time <= 0) {
                        lab_time.string = "";
                        lab_time.node.active = false;
                        lab_bet.active = true;
                        if (this.mttTimeSchedule) {
                            this.unschedule(this.mttTimeSchedule);
                            this.mttTimeSchedule = null;
                        }
                        return;
                    }

                    time = time - 1;
                    lab_time.string = getTime(time);
                }

                this.schedule(this.mttTimeSchedule, 1)
            } else {
                lab_time.node.active = false;
                lab_bet.active = true;
                lab_time.string = "";
            }
        }
    },

    //顶部tip
    showMttTopTip(data) {
        if (!this.TexasMatchTip) {
            return;
        }

        if (!data.isShow) {
            this.TexasMatchTip.active = false;
            return;
        }

        this.TexasMatchTip.active = true;
        let tip1 = this.TexasMatchTip.getChildByName("tip1");
        let tip2 = this.TexasMatchTip.getChildByName("tip2");
        tip1.active = false;
        tip2.active = false;

        if (data.tag == 1) {
            tip1.active = true;
            let label_name = tip1.getChildByName("label_name").getComponent(cc.Label);
            label_name.string = data.content || "";
        } else {
            tip2.active = true;
            let label_content = tip2.getChildByName("label_content").getComponent(cc.Label);
            label_content.string = data.content || "";
        }

        let time = 5;
        if (data.nRemainT) {
            time = data.nRemainT;
        }

        this.nEventId = data.nEventId;
        this.scheduleOnce(function () {
            this.TexasMatchTip.active = false;
        }.bind(this), time)
    },

    //中间tip
    showMttCenterTip(data) {
        if (!this.TexasMttCenterTip) {
            return;
        }

        let tip = cc.instantiate(this.TexasMttCenterTip);
        tip.active = true;
        this.node.addChild(tip);
        let com = tip.getComponent("UIFlyText");
        if (com) {
            com.setText(data.text || "");
        }
    },

    //设置等待阶段背景
    setMttWaitBg(spriteFrame) {
        if (!this.MttWaitStart) {
            return;
        }

        this.MttWaitStart.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    //比赛开始等待阶段
    showMttWaitStart(data) {
        if (!this.MttWaitStart) {
            return;
        }

        if (this.mttStartTimeSchedule) {
            this.unschedule(this.mttStartTimeSchedule);
            this.mttStartTimeSchedule = null;
        }



        let panel = this.MttWaitStart.getChildByName("panel")
        let lab_time = panel.getChildByName("lab_time").getComponent(cc.Label);
        let head = panel.getChildByName("mask").getChildByName("head").getComponent(cc.Sprite);
        let lab_name = panel.getChildByName("lab_name").getComponent(cc.Label);
        let info = UserInfo.getInfo();
        Utils.changeUserHead(head, info.strHeadUrl);
        lab_name.string = info.strNickName;

        if (data.nAssignTime && data.nAssignTime > 0) {
            let mttTopInfo = this.panel_MTT.getChildByName("mttTopInfo");
            mttTopInfo.active = false;
            this.MttWaitStart.active = true;
            let getTime = function (nowTime) {
                let second = nowTime % 60;
                if (second < 10) {
                    second = "0" + second;
                }

                let min = Math.floor(nowTime / 60);
                if (min < 10) {
                    min = "0" + min;
                }

                return min + ":" + second
            }

            let time = data.nAssignTime;
            lab_time.string = getTime(time);
            this.mttStartTimeSchedule = function () {
                if (time <= 0) {
                    lab_time.string = "";

                    if (mttTopInfo) {
                        mttTopInfo.active = true;
                    }
                    if (this.mttStartTimeSchedule) {
                        this.MttWaitStart.active = false;
                        this.unschedule(this.mttStartTimeSchedule);
                        this.mttStartTimeSchedule = null;
                    }
                    return;
                }

                time = time - 1;
                lab_time.string = getTime(time);
            }
            this.schedule(this.mttStartTimeSchedule, 1)
        } else {
            this.MttWaitStart.active = false;
            lab_time.string = "";
        }
    },

    //显示重构按钮
    showMttBuyChipBtn(bShow) {
        if (!this.mttBuyChipBtn) {
            return;
        }

        this.mttBuyChipBtn.active = bShow;

    },

    //显示保险金盾或用户余额，1显示保盾，2显示余额
    showInsureBgOrInfoBg(state) {
        // 回放模式下不显示余额信息
        let playBackData = TexasUtils._getClubReback();
        if (playBackData || app.config.IS_PLAYBACK) {
            this.insureBg.active = false;
            this.infoBg.active = false;
            return;
        }
        this.insureBg.active = state === 1
        this.infoBg.active = state === 0
    },

    //显示mtt比赛重构界面
    showMttBuyChipPanel(isShow, data) {
        if (!this.panelMttBuyChip) {
            return;
        }

        this.panelMttBuyChip.active = isShow;

        if (!isShow) {
            return;
        }

        let com = this.panelMttBuyChip.getComponent("TexasMttBuyChip");
        if (com) {
            com.show(data);
        }
    },

    _onMttBuyChip() {
        let nStr = "俱乐部mtt比赛请求"
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouRAWinReq_CMD, {});
    },

    //进入比赛桌
    _onEnterMtt() {
        let gameStart = TexasData._getGameStart();
        let info = UserInfo.getInfo();
        let isSelfPlaying = this.TexasPlayerController._getIsPlaying(info.nUserID);
        let self = this;

        if (!isSelfPlaying) {//自己不在玩,直接返回
            if (clubMtt && self.nEventId) {
                TexasData.isFreeGame(false);
                TexasUtils._gameReqNotify("进入mtt比赛", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
                clubMtt.contest(self.nEventId);
                this.showMttTopTip({ isShow: false })
            }
        } else {//自己在玩，判断游戏是否结束
            if (gameStart) {
                let text = TexasUtils._getText(15);
                let type = UIDialog.EShowType.OKCANCEL
                self._showDialog(text, type, function () {
                    if (clubMtt && self.nEventId) {
                        TexasData.isFreeGame(false);
                        this.showMttTopTip({ isShow: false })
                        TexasUtils._gameReqNotify("进入mtt比赛", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
                        clubMtt.contest(self.nEventId);
                    }
                }, function () {
                    self._exiting = false;
                });
            } else {
                if (clubMtt && self.nEventId) {
                    TexasData.isFreeGame(false);
                    this.showMttTopTip({ isShow: false });
                    TexasUtils._gameReqNotify("进入mtt比赛", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
                    clubMtt.contest(self.nEventId);
                }
            }
        }
    },

    //旁观玩家换桌
    _onLookOnChangeTable() {
        this._closeMenu();
        let nStr = "俱乐部mtt比赛旁观玩家换桌请求"
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouChangeWReq_CMD, {});
    },

    //显示排名信息
    showMttRank(isShow, data) {
        if (!this.panelMttRank) {
            return;
        }

        this.panelMttRank.active = isShow;
        let callBack = function () {
            this._onClickBtnBack()
        }.bind(this)
        if (isShow) {
            this.panelMttRank.getComponent("TexasMTTMatchRank").init(data, callBack);
        }

    },

    btnMttRule() {
        if (clubMtt) {
            clubMtt.openMttList();
            let nEventId = TexasData.getMttMatchId()
            clubMtt.showMttRule(nEventId);
        }
    },

    //执行下局站起
    _executeStandUpNextHand() {
        let isStandUpNextHand = TexasData._getStandUpNextHand();
        if (isStandUpNextHand) {
            cc.log("执行下局站起");

            // 重置状态
            TexasData._setStandUpNextHand(false);

            // 执行站起操作
            let nStr = "下局站起请求";
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouStanpUpReq_CMD, {});
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouStanpUpReq_CMD, {});
            }
        }
    },

    //点击新下局站起按钮
    _onClickBtnStandUpNextRound() {
        cc.log("点击新下局站起按钮");
        this._showStandUpNextRoundTip();
    },

    //点击取消下局站起按钮
    _onClickBtnCancelStandUpNextRound() {
        cc.log("点击取消下局站起按钮");

        // 取消下局站起功能
        TexasData._setStandUpNextHand(false);

        // 更新按钮显示状态
        this._updateStandUpNextRoundButtons();

        // 显示提示信息
        let UIFrame = require("UIFrame");
        UIFrame.showTips("已取消下局站起");
    },

    //显示下局站起确认提示框
    _showStandUpNextRoundTip() {
        if (this.standUpNextRoundTip) {
            this.standUpNextRoundTip.active = true;

            // 获取提示框组件
            let tipComponent = this.standUpNextRoundTip.getComponent("texasStandUpNextRoundTip");
            if (tipComponent) {
                // 设置回调函数
                tipComponent.onConfirm = this._onConfirmStandUpNextRound.bind(this);
                tipComponent.onCancel = this._onCancelStandUpNextRound.bind(this);
            }
        }
    },

    //确认下局站起
    _onConfirmStandUpNextRound() {
        cc.log("确认下局站起");

        // 隐藏提示窗口
        if (this.standUpNextRoundTip) {
            this.standUpNextRoundTip.active = false;
        }

        // 激活下局站起功能
        TexasData._setStandUpNextHand(true);

        // 更新按钮显示状态
        this._updateStandUpNextRoundButtons();

        // 显示提示信息
        let UIFrame = require("UIFrame");
        UIFrame.showTips("已设置下局站起");
    },

    //取消下局站起提示
    _onCancelStandUpNextRound() {
        cc.log("取消下局站起提示");

        // 仅隐藏提示窗口，按钮状态保持不变
        if (this.standUpNextRoundTip) {
            this.standUpNextRoundTip.active = false;
        }
    },

    //更新新下局站起按钮组的显示状态
    _updateStandUpNextRoundButtons() {
        let info = UserInfo.getInfo();
        let selfSitId = this.TexasPlayerController._getSitId("nUserId", info.nUserID);
        let isStandUpNextHand = TexasData._getStandUpNextHand();
        let isGameStarted = TexasData._getIsTableStart();
        let isSelfParticipating = TexasData._getSelfParticipating();
        cc.log('test 下局站起', selfSitId, isGameStarted, isSelfParticipating, isStandUpNextHand)
        // 只有在座、游戏开始且玩家参与牌局时才显示相关按钮
        if (selfSitId && isGameStarted && isSelfParticipating) {
            if (isStandUpNextHand) {
                // 已激活下局站起：隐藏下局站起按钮，显示取消按钮
                this.texasMenuDefault.setNextRoundBtnShow(false, true, true);
            } else {
                // 未激活下局站起：显示下局站起按钮，隐藏取消按钮
                this.texasMenuDefault.setNextRoundBtnShow(true, false, false);
            }
        } else {
            // 未入座、游戏未开始或未参与牌局：隐藏所有按钮
            this.texasMenuDefault.setNextRoundBtnShow(true, false, true);
        }
    },


    //请求撤码信息 , 短牌撤出和长牌不一致
    _onClickBtnCarry() {
        this._closeMenu();
        let nStr = "长牌撤码范围查看请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTakeOutInfoReq_CMD, {});
    },


    // 请求设置自动撤码
    _onClickSetAutoCarry(isAutoBo) {
        let nStr = "长牌设置自动撤码";
        let isAuto = isAutoBo ? 1 : 0
        let data = {
            isAuto: isAuto,
        }

        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTakeOutSetReq_CMD, data);
    },



    // 请求手动撤码
    _onClickBtnCarrySure(value) {
        this._closeMenu();
        if (Number(value) <= 0) {
            return
        }
        let nStr = "长牌请求手动撤码";
        let data = {
            nValue: Number(value),
        }
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTakeChipsOutReq_CMD, data);
    },

    //实时语音提示框
    _showRealTimeVoiceTip(isRecharge) {
        // 通过bundle动态加载texasAudioTip预制体
        if (isRecharge) {
            this.voiceSwitch(false)
        }

        let texasAudioTipNode = this.panelContent.getChildByName("texasAudioTip")
        if (texasAudioTipNode) {
            texasAudioTipNode.active = true
            return
        }
        //预制体路径
        let path = "Script/Texas/view/texasAudioTip";
        //bundle是live-Texas
        let wrapper = cc.assetManager.getBundle("live-Texas");
        //加载预制体
        wrapper.load(path, cc.Prefab, (err, prefab) => {
            if (err) {
                cc.error("加载预制体失败:", err);
                return;
            }
            //实例化预制体
            let tipNode = cc.instantiate(prefab);
            tipNode.name = "texasAudioTip"
            //添加到当前场景
            this.panelContent.addChild(tipNode, 1024);
            let tipComponent = tipNode.getComponent("texasAudioTip");
            tipComponent.initData({
                onConfirm: () => {
                    // tipNode.destroy(); // 销毁提示框
                    if (isRecharge) {
                        this.createGameRechargeView();
                    } else {
                        let status = ChatMessageMgr.getSelfAudioStatus()
                        this.voiceSwitch(status);
                    }
                },
                onCancel: () => {
                    // tipNode.destroy(); // 销毁提示框
                },
                isRecharge: isRecharge,//是否是充值
                nVideoFee: TexasData._getTableInfo().nVideoFee,//语音费用
            })
        });


    },

    //展示等待游戏开始提示
    _showWaitingForGameStartTip() {
        // cc.log('test 展示等待游戏开始提示', TexasData._getIsTableStart())
        if (TexasData._getIsTableStart()) {
            this.tipBlock.active = false
            return
        }
        let players = this.TexasPlayerController._getAllPlayerComponent();
        let playerCount = players.length || 0;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            // 在这里可以对每个玩家进行处理
            if (player && player.occupy.active) {
                playerCount -= 1;
            }
        }
        let text = TexasUtils._getText(5);
        let startNoum = TexasData._getAutoStartNum();
        if (playerCount < startNoum) {
            this.tipBlock.active = true;
        }
        if (playerCount <= 0) {
            this.tipBlock.active = false;
            return;
        }
        this.tipBlock.getChildByName("label").getComponent(cc.Label).string = `${text} ${playerCount}/${startNoum}`;
    },

    //外部调用的站起计时器
    startStandUpTimer() {
        if (this.uptimeSchedule) this.unschedule(this.uptimeSchedule)
        this.uptimeSchedule = this.scheduleOnce(function () {
            //买入金额大于0
            let buy = TexasData._getUserGold()
            if (buy > 0) {
                return;
            }
            this._onClickBtnStand();
        }, 15);
    },

    //显示输钱限制弹窗
    onShowLoseLimitTip(data) {
        let path = "popup/texasLoseLimit/texasLoseLimitTips";
        app.texas.ui.loadPopup(path, function (component) {
            this.node.addChild(component.node, 1024);
            component.init(data);
        }.bind(this))
    },

    _setTableInfoColor() {
        let gameBg = LocalStorage.getItem("CLUB_GAME_BG");
        cc.log('test 设置俱乐部桌子信息颜色', gameBg)
        if (this.clubTableInfo) {
            if (!gameBg || gameBg == 4) {
                this.clubTableInfo.node.color = cc.Color.BLACK.fromHEX("#80D7BE");  // 绿色
            } else {
                this.clubTableInfo.node.color = cc.Color.BLACK.fromHEX("#8CB8E4"); // 蓝色
            }
        }
    }

});