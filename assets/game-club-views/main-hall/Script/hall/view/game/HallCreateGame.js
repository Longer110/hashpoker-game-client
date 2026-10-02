
//创建房间界面
let i18n = require("i18n");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let Base64 = require("base64");
let accuracy = 10000;
let tb = require("TB_shield_words");
let Utils = require("Utils");
let UserInfo = require("UserInfo");
let LocalStorage = require("LocalStorage");
let clubGameConfig = require("clubGameConfig");


cc.Class({
    extends: cc.Component,

    properties: {
        itemContent: cc.Node,
        editBox: cc.EditBox,
        scrollview: cc.ScrollView,
        setGame: cc.Node,
        btn_texas: cc.Node,
        btn_omaha: cc.Node,
        btn_shortCard: cc.Node,
        tipNode: cc.Node,
        selectTipNode: cc.Node,
        prefab_template: cc.Prefab,
        selectItemList: [],
        btnSpriteFrames: [cc.SpriteFrame],

        sliderList: {
            default: [],
            type: cc.Slider,
            tooltip: '进度条',
        },

        _curConfig: [],
        _curBetSel: 0, //当前选中的大小盲下标
        _curGameId: clubGameConfig.CLUB_GAME_CONFIG.Texas,
        _gameConfig: null,
        selectPlayerNumIndex: 0,
        selectGameTimeIndex: 0,
        payPublicCardIndex: 0,
        payHandCardIndex: 0,
        payCutCardIndex: 0,
        autoStartPlayerNumIndex: 0,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.preAnteConfig = [2, 3, 4, 5]

        console.log("HallCreateGame start");
        // let gameID= LocalStorage.getItem("CLUB_CREATE_TABEL_GAME_ID");
        // if (gameID){
        //     this._curGameId = gameID;
        // }

        let index = 1;
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
            index = 1;
        } else if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
            index = 3;
        }

        this.playerNumList = [2, 3, 4, 5, 6, 7, 8, 9];
        this.autoStartNumList = [];

        this.initSlider();
        this.initLabel();
        this.register();
        this._shield = JSON.parse(tb.shield);
        this.onClickGame(null, index);
        this.initNoSpace();
    },

    initNoSpace() {

        this.editBox.node.on('editing-did-ended', () => {
            const original = this.editBox.string;
            const cleaned = original.replace(/[\s\u3000]/g, ''); // 去掉空格和全角空格

            if (cleaned !== original) {
                this.editBox.string = cleaned; // 重新赋值
            }
        });


        // let editBox = this.editBox;

        // if (!editBox || !editBox._impl || !editBox._impl._elem) {
        //     cc.warn("EditBox DOM 元素未初始化");
        //     return;
        // }

        // let domInput = editBox._impl._elem;

        // domInput.addEventListener("keydown", (e) => {
        //     if (e.key === " " || e.keyCode === 32) {
        //         e.preventDefault();
        //     }
        // });

        // domInput.addEventListener("input", (e) => {
        //     const cleaned = domInput.value.replace(/[\s\u3000]/g, "");
        //     if (cleaned !== domInput.value) {
        //         domInput.value = cleaned;

        //         // 同步到 Cocos 的 EditBox.string
        //         editBox.string = cleaned;
        //     }
        // });
    },

    onInit(data) {
        console.log("HallCreateGame onInit", data);
        this.isCreateTemplate = data.isCreateTemplate || false;
        this.templateConfig = data.configData || null;
        this.isFromTemplate = data.isFromTemplate || false;
        let btn_myTemplate = this.node.getChildByName("bg").getChildByName("header").getChildByName("btn_myTemplate")
        if (this.isCreateTemplate) {
            let title = this.node.getChildByName("bg").getChildByName("header").getChildByName("title").getComponent(cc.Label);
            title.string = "创建模板";//i18n.t("club.createTemplate");
            let btnCreate = this.node.getChildByName("content").getChildByName("bottom").getChildByName("btn_create");
            let btnLabel = btnCreate.getChildByName("label_create").getComponent(cc.Label);
            btnLabel.string = "保存模板";//i18n.t("club.saveTemplate");
            let btn_myTemplate = this.node.getChildByName("bg").getChildByName("header").getChildByName("btn_myTemplate")
            btn_myTemplate.active = !data.isCreateTemplate;
            this.tempIndex = data.tempIndex;
            // btnCreate.getComponent(cc.Sprite).spriteFrame = this.btnSpriteFrames[1];
            // if(this.templateConfig){
            //     btnLabel.string = "保存模板";//i18n.t("club.saveTemplate");
            // }
        }
        btn_myTemplate.active = !this.isFromTemplate;

        if (this.templateConfig) {
            let index = 1;
            if (this.templateConfig.gameId == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
                index = 1;
            } else if (this.templateConfig.gameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
                index = 3;
            }
            // this.onClickGame(null, index);
            this._curGameId = this.templateConfig.gameId;
        }

    },

    // update (dt) {},

    onDestroy() {
        this.unRegister();
    },

    initSlider() {
        for (let i = 0; i < this.sliderList.length; i++) {
            let slider = this.sliderList[i];
            if (slider) {
                slider.handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd.bind(this, slider, i + 1), this);
                slider.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel.bind(this, slider, i + 1), this);
                slider.handle.node.on(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin.bind(this, slider, i + 1), this);
                if (i != 5 && i != 6) {
                    slider.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd.bind(this, slider, i + 1), this);
                    slider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel.bind(this, slider, i + 1), this);
                    slider.node.on(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin.bind(this, slider, i + 1), this);
                }

                let widget = slider.node.getComponent(cc.Widget);
                if (widget) {
                    widget.updateAlignment();
                }

                let progressBar = slider.node.getComponent(cc.ProgressBar);
                if (progressBar) {
                    progressBar.node.width = slider.node.width;
                    progressBar.totalLength = slider.node.width;
                    progressBar.progress = 0;
                }
            }

        }
    },

    onDisable() {
        for (let i = 0; i < this.sliderList.length; i++) {
            let slider = this.sliderList[i];
            if (slider) {
                slider.handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
                slider.handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel, this);
                slider.handle.node.off(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin, this);
                slider.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
                slider.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel, this);
                slider.node.off(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin, this);
            }

        }

        // 清理选择提示项的点击事件
        if (this.selectItemList) {
            for (let i = 0; i < this.selectItemList.length; i++) {
                if (this.selectItemList[i] && cc.isValid(this.selectItemList[i])) {
                    this.selectItemList[i].off(cc.Node.EventType.TOUCH_END, this.onSelectTipItemClick, this);
                }
            }
        }
    },

    register() {
        MsgManager.on(MSG.NOTIFY.ClubSGetGameParamsResp_ui, this._onGetGameParams, this);
        MsgManager.on(MSG.NOTIFY.ClubSOpenTableResp_ui, this._onOpenTable, this);
    },

    unRegister() {
        MsgManager.un(this._onGetGameParams);
        MsgManager.un(this._onOpenTable);
    },

    getGameParams(gameId) {
        let data = HallClubCacheData.getCreateGameConfig(gameId);
        if (data) {
            this._onGetGameParams(data);
        } else {
            let params = {
                nGameId: gameId,
            }
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetGameParamsReq_CMD, params);
        }

    },

    _onGetGameParams(data) {
        if (this._gameConfig && this._gameConfig[data.nGameId]) {
            this.initUI();
            return;
        }

        if (!this._gameConfig) {
            this._gameConfig = {};
        }
        this._gameConfig[data.nGameId] = JSON.parse(data.sGameConfig);
        if (data.nGameId == this._curGameId) {
            this.initUI();
        }
    },
    //初始化游戏配置数据，并根据游戏配置初始化各个节点所需表
    initRoomConfigData() {
        // this._gameConfig[this._curGameId]
        this.gameRoomConfig = {
        }
        //做数据解析转换

        this.bottomSelectDataConfig = {
            buMa: {
                list: [
                    { title: 2 },
                    { title: 3 },
                    { title: 4 },
                    { title: 5 },
                    { title: 6 },
                    { title: 7 },
                    { title: 8 },
                    { title: 9 },
                    { title: 10 },
                ],
                defaultIndex: 3
            },

            cheMa: {
                list: [
                    { title: 2 },
                    { title: 3 },
                    { title: 4 },
                    { title: 5 },
                    { title: 6 },
                    { title: 7 },
                    { title: 8 },
                    { title: 9 },
                    { title: 10 },
                ],
                defaultIndex: 2
            },


            cutLoss: {
                list: [
                    { title: 2 },
                    { title: 3 },
                    { title: 4 },
                    { title: 5 },
                    { title: 6 },
                    { title: 7 },
                    { title: 8 },
                    { title: 9 },
                    { title: 10 },
                ],
                defaultIndex: 5
            },
            poolRate: {
                list: [
                    { title: "入池率" },

                ],
                defaultIndex: 5,
                //单位符号: "%"
                flagStr: "%"
            },
            poolHandNumLimit: {
                list: [
                    { title: "X手之内不限制" },
                    { title: 50 },
                    { title: 100 },
                    { title: 200 },
                    { title: 300 },
                    { title: 500 },
                ],
                defaultIndex: 5
            },
            bottomPool: {
                list: [
                    { title: "触发抽水底池" },
                    { title: 10 },
                    { title: 20 },
                    { title: 30 },
                    { title: 40 },
                    { title: 50 },
                ],
                defaultIndex: 2
            },
            commissionLimitUp: {
                list: [
                    { title: "每手抽水封顶" },
                ],
                defaultIndex: 2
            },
            handNum: {
                list: [
                    { title: "手数限制" },
                    { title: 50 },
                    { title: 100 },
                    { title: 200 },
                    { title: 300 },
                    { title: 500 },
                    { title: 1000 },
                ],
                defaultIndex: 3
            },

        }
        let arrPoolEntryRateOption = this._gameConfig[this._curGameId].arrPoolEntryRateOption;//入池率选项
        if (arrPoolEntryRateOption) {
            for (let i = 0; i < arrPoolEntryRateOption.length; i++) {
                let rate = arrPoolEntryRateOption[i];
                this.bottomSelectDataConfig.poolRate.list.push({ title: rate });
            }
        }
        let arrDWLimitOption = this._gameConfig[this._curGameId].arrDWLimitOption;//抽水封顶
        for (let i = 0; i < arrDWLimitOption.length; i++) {
            let rate = arrDWLimitOption[i];
            this.bottomSelectDataConfig.commissionLimitUp.list.push({ title: rate });
        }

        this.commissionRateList = [2, 3, 4, 5, 6, 7, 8, 9, 10];//抽水率

    },

    setCommissionRateList() {
        let type = this._curConfig.tDrawWaterMode.nModeType
        if(type == 1){
            this.commissionRateList = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];//把抽抽水率
        }else if(type == 3) {
            this.commissionRateList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];//局抽抽水率
        }
    },

    initData() {
        if (this.templateConfig) {
            this._curConfig = this.templateConfig;
            return;
        }
        let config = LocalStorage.getItem("CLUB_CREATE_TEXAS_TABLE");
        if (this._curGameId != clubGameConfig.CLUB_GAME_CONFIG.Texas) {
            config = LocalStorage.getItem("CLUB_CREATE_TEXAS_TABLE" + this._curGameId);
        }
        if (config) {
            this._curConfig = config;
            return;
        }
        if (this._curConfig && this._curConfig.sTableName) {
            return
        }
        this._curConfig = {
            nKeepTime: 60 * 60,
            nGoldType: 1,
            sTableName: Base64.encode(UserInfo.getInfo().strNickName + "的房间"),
            nIsShow: 1,
            //房间密码
            sPassWord: "",
            nSmallBlind: 0,
            nBigBlind: 0,
            nTakeIn: 0,
            nCapacity: 9,
            nPreAnte: 0,
            tAutostart: { isOpen: false, nPlayerCnt: 2 },
            nMinTabkeInBB: 1,
            nMaxTabkeInBB: 4,
            nPoolEntryRate: 30,
            nPoolEntryRateHands: 0,
            isOnlyPlayByIOS: false,
            isForceBlind: false,
            isGPSLimit: false,
            isIPLimit: false,
            isAOF: false,
            isDelayLook: false,
            nInsureMode: 1,
            isTabkeOut: false,
            isBuMa: false,
            isCutLoss: false,
            isDPreAnte: false,
            isPayPublicCard: false,
            isPayHandCard: false,
            isPayCutCard: false,
            isPreBet: false,
            tDrawWaterMode: {
                nModeType: 0,
                nComputeMode: 1,
                nTaxRate: 3,
                nTopLimitBB: 3,
                nBottomPool: 5,
                isFreeBeforeFlop: true,
                isHalf: true,
                tFreeConfig: { isOpen: true, nLimitBB: 5 },
                nCutoffValue: 0,
                nLessValue: 0,
                nGreaterValue: 0,
            },
            nPoolHands: 100,
            nTableCost: [
                { nId: 1, nCost: 0, open: 0, mult: 0 },//付费看公牌1 付费看手牌2 付费切牌3
                { nId: 2, nCost: 0, open: 0, mult: 0 },
                { nId: 3, nCost: 0, open: 0, mult: 0 },
            ],
            nTabkeOutOdd: 0,
            nLoseMaxAmount: 0,
            nMutedUnSite: 1,//是否静音
            isVideoFee: false,//实时语音收费
            BuMaNum: 0, //补码上限
        }
    },

    initUI() {
        if (!this._gameConfig[this._curGameId]) {
            return;
        }

        this.initRoomConfigData();
        this.initData();
        this.initGameNode();
        this.initRoomNameNode();
        this.initIsPrivateRoomNode();
        this.initRoomPasswordNode();
        // this.initTableIdNode();
        this.initGoldTypeNode();
        this.initBottomBetTypeNode();
        this.initBringinBetNode();
        this.initIsBumanNode();
        this.initIsCheMaNode();
        this.initIsCutLossNode();
        this.initIsPreBetNode();
        this.initPlayerNumNode();
        this.initGameTimeNode();
        this.initIsGrapHeadNode();
        this.initIsInsuranceNode();
        this.initIsPoolRateLimitNode();
        this.initBuMangShangZhuoNode();
        this.initIsCommissionNode();
        this.initIsPayPublicCardNode();
        this.initIsPayHandCardNode();
        this.initIsPayCutCardNode();
        this.initIsDelayViewCardNode();
        this.initIsAutoStartPlayerNumNode();
        this.initIsDrawSignNode();
        this.initIsViewerSilenceNode();
        this.initIsRealTimeAudioNode();
        // this.initIsGPSLimitNode();
        this.initIsHandNumLimitNode();
    },
    //新修改初始化各个节点-----
    initGameNode() {
        let toggleContainer = this.setGame.getChildByName("ToggleContainer");
        let Toggle1 = toggleContainer.getChildByName("toggle1").getComponent(cc.Toggle);
        let Toggle3 = toggleContainer.getChildByName("toggle3").getComponent(cc.Toggle);
        Toggle1.isChecked = this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas;
        Toggle3.isChecked = this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;
        // this.onClickGame(null, 2);
    },

    initRoomNameNode() {
        this.editRoomNameBox = this.itemContent.getChildByName("setRoomName").getChildByName("inputName").getChildByName("editBox").getComponent(cc.EditBox);
        cc.log("房间名字：" + this._curConfig.sTableName);

        this.editRoomNameBox.string = this._curConfig.sTableName && this._curConfig.sTableName.length > 0 && Base64.decode(this._curConfig.sTableName)
        this.editRoomNameBox.placeholder = ""
    },

    initIsPrivateRoomNode() {
        let toggle = this.itemContent.getChildByName("setIsPrivateRoom").getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.nIsPerson == 1;
        this.onClickSelectCallBack(toggle, "isPrivate");

    },

    initRoomPasswordNode() {
        let roomPasswordNode = this.itemContent.getChildByName("setRoomPassword");
        roomPasswordNode.active = this._curConfig.nIsPerson == 1;
        this.passwordEditBox = roomPasswordNode.getChildByName("input").getChildByName("editBox").getComponent(cc.EditBox);
        let passNum = this._curConfig.sPassWord || "";
        if (passNum.length == 0) {
            this.passwordEditBox.placeholder = "请输入六位密码";
        }
        this.passwordEditBox.string = passNum;

    },

    initTableIdNode() {
        let tableIdNode = this.itemContent.getChildByName("setShowTableId");
        let toggle = tableIdNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.nIsShow == 1;
        this.onClickSelectCallBack(toggle, "isShowTableId");
    },

    onClickSelectCallBack(event, data) {
        let node = event.node;
        let background = node.getChildByName("Background");
        let checkmark = node.getChildByName("checkmark");
        background.active = !event.isChecked;
        checkmark.active = event.isChecked;
        if (data == "isPrivate") {
            this._curConfig.nIsPerson = event.isChecked ? 1 : 0;
            this.initRoomPasswordNode();
        } else if (data == "isShowTableId") {
            this._curConfig.nIsShow = event.isChecked ? 1 : 0;
        } else if (data == "isBuMa") {
            this._curConfig.isBuMa = event.isChecked;
            this.initBuMaNode();
        } else if (data == "isCheMa") {
            this._curConfig.isTabkeOut = event.isChecked;
            this.initCheMaNode();
        } else if (data == "isCutLoss") {
            this._curConfig.isCutLoss = event.isChecked;
            this.initCutLossNode();
        } else if (data == "isPreBet") {
            this._curConfig.isPreBet = event.isChecked;
            this.initPreBetNode();
        } else if (data == "isGrapHead") {
            this._curConfig.isForceBlind = event.isChecked;

        } else if (data == "isPoolRateLimit") {
            this._curConfig.isPoolRateLimit = event.isChecked;
            this.initPoolRateNode();
        } else if (data == "isBuMangShangZhuo") {
            this._curConfig.isBuMangShangZhuo = event.isChecked;
        } else if (data == "isCommission") {
            this._curConfig.isCommission = event.isChecked;
            this.setInitTypeCommission();
            // this.initCommissionNode();
        } else if (data == "isChouYongBaChou") {
            this._curConfig.isChouYongBaChou = event.isChecked;
        } else if (data == "isPayPublicCard") {
            this._curConfig.nTableCost[0].open = event.isChecked ? 1 : 0;
            this.initPayPublicCardNode();
        } else if (data == "isPayHandCard") {
            this._curConfig.nTableCost[1].open = event.isChecked ? 1 : 0;
            this.initPayHandCardNode();
        } else if (data == "isPayCutCard") {
            this._curConfig.nTableCost[2].open = event.isChecked ? 1 : 0;
            this.initPayCutCardNode();
        } else if (data == "isDelayViewCard") {
            this._curConfig.isDelayLook = event.isChecked;
        } else if (data == "isAutoStartPlayerNum") {
            this._curConfig.tAutostart.isOpen = event.isChecked;
            this.initAutoStartPlayerNumNode();
        } else if (data == "isDrawSign") {
            this._curConfig.isDrawSign = event.isChecked;
        } else if (data == "isViewerSilence") {
            this._curConfig.nMutedUnSite = event.isChecked ? 1 : 0;
        } else if (data == "isRealTimeAudio") {
            this._curConfig.isVideoFee = event.isChecked;
        } else if (data == "isGPSIPLimit") {
            this._curConfig.isGPSLimit = event.isChecked;
        } else if (data == "isInsurance") {
            this._curConfig.nInsureMode = event.isChecked ? 1 : 0;
        } else if (data == "isHandNumLimit") {
            this._curConfig.isHandNumLimit = event.isChecked;
            this.initHandNumLimitNode();
        }
    },


    initGoldTypeNode() {
        let goldTypeNode = this.itemContent.getChildByName("setGoldType");
        let btn_goldType = goldTypeNode.getChildByName("btn_goldType");
        let goldFlag = btn_goldType.getChildByName("Background").getChildByName("goldFlag");

        // goldFlag.getComponent(cc.Sprite).spriteFrame 

    },

    initBottomBetTypeNode() {
        this._curConfig.bottomBetType = this._curConfig.bottomBetType || 0;
        let BottomBetTypeNode = this.itemContent.getChildByName("setBottomBetType");
        BottomBetTypeNode.active = this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;
        if (!BottomBetTypeNode.active) {
            this.initBlindBetNode();
            return
        }
        let toggleContainer = BottomBetTypeNode.getChildByName("ToggleContainer");
        let toggleList = toggleContainer.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < toggleList.length; i++) {
            let toggle = toggleList[i];
            toggle.isChecked = this._curConfig.bottomBetType === i;
            if (this._curConfig.bottomBetType === i) {
                this.onClickBottomBetTypeCallBack(toggle, i);
            }
            toggle.node.active = true;
        }


    },

    onClickBottomBetTypeCallBack(event, data) {
        let num = Number(data)
        this._curConfig.bottomBetType = num;// if (num === 1){  
        this.initBlindBetNode();
        this.initIsPreBetNode();
        this.initIsGrapHeadNode();
    },


    //     //-------------------设置大小盲和带入------------------
    setBetSlider(slider, selIndex) {
        let length = this._gameConfig[this._curGameId].arrConfigOption.length;

        let callBack = function (pro) {
            this.setBetProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    setBetProgress(pro) {
        let setBet = this.itemContent.getChildByName("setBlindBet");
        let bet = setBet.getChildByName("bet").getComponent(cc.Label);
        // let bringIn = setBet.getChildByName("bringIn").getComponent(cc.Label);
        let progress = setBet.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;

        let length = this._gameConfig[this._curGameId].arrConfigOption.length;
        let total = (length - 1) * 2
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.ceil(curMark / perMark);


        if (index >= total) {
            this._curConfig.nSmallBlind = this._gameConfig[this._curGameId].arrConfigOption[length - 1][0];
            this._curConfig.nBigBlind = this._gameConfig[this._curGameId].arrConfigOption[length - 1][1];
            this._curConfig.nTakeIn = this._gameConfig[this._curGameId].arrConfigOption[length - 1][2];

            if (this._curConfig.bottomBetType == 0 && this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
                bet.string = this._curConfig.nSmallBlind;
                this.initPreAnteNode(true);
            } else {
                bet.string = this._curConfig.nSmallBlind + "/" + this._curConfig.nBigBlind;
            }
            // bringIn.string = this._curConfig.nTakeIn;
            this._curBetSel = length - 1;
            // this.refreshFrontBet();
            this.refreshBringInNode();
            this.initIsPreBetNode();
            // this.initPayPublicCardNode();
            // this.initPayHandCardNode();
            // this.initPayCutCardNode();
            return;
        }

        if (index % 2 != 0) {
            index = index - 1;
        }

        this._curConfig.nSmallBlind = this._gameConfig[this._curGameId].arrConfigOption[index / 2][0];
        this._curConfig.nBigBlind = this._gameConfig[this._curGameId].arrConfigOption[index / 2][1];
        this._curConfig.nTakeIn = this._gameConfig[this._curGameId].arrConfigOption[index / 2][2];
        this._curBetSel = index / 2;


        if (this._curConfig.bottomBetType == 0 && this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
            bet.string = this._curConfig.nSmallBlind;
            this.initPreAnteNode(true);
        } else {
            bet.string = this._curConfig.nSmallBlind + "/" + this._curConfig.nBigBlind;
        }
        // bringIn.string = this._curConfig.nTakeIn;
        // this.refreshFrontBet();
        this.refreshBringInNode();
        this.initIsPreBetNode();
        // this.initPayPublicCardNode();
        // this.initPayHandCardNode();
        // this.initPayCutCardNode();
    },
    // //-------------------设置大小盲和带入end------------------

    // 为序号11（前注 n 倍）提供 slider -> progress 的封装
    setAnteOddSlider(slider, selIndex) {
        let length = this.preAnteConfig.length || 1;

        let callBack = function (pro) {
            this.setAnteOddProgress(pro);
        }.bind(this);

        // selIndex 为传入的档位索引（从1开始），可为空
        this.calculateProgress(slider, selIndex, length, callBack);
    },

    //初始化前注的庄家倍数
    initPreAnteNode(state) {
        let preAnteNode = this.itemContent.getChildByName("setPreAnte");
        if (!state) {
            preAnteNode.active = false;
            return;
        }
        preAnteNode.active = true;
        let preAnteSlider = preAnteNode.getChildByName("slider").getComponent(cc.Slider);
        let numLayout = preAnteNode.getChildByName("numPanel").getComponent(cc.Layout);
        let title = preAnteNode.getChildByName("title").getComponent(cc.Label);
        title.string = "庄家";

        numLayout.spacingX = (preAnteSlider.node.width - (this.preAnteConfig.length * 55)) / (this.preAnteConfig.length - 1);
        //设置子节点隐藏
        for (let i = 0; i < numLayout.node.children.length; i++) {
            let child = numLayout.node.children[i];
            if (i < this.preAnteConfig.length) {
                child.active = true;
                let label = child.getComponent(cc.Label);
                label.string = this.preAnteConfig[i] + "倍";
            } else {
                child.active = false;
            }
        }

        this.setAnteOddSlider(preAnteSlider);

    },

    initBlindBetNode() {

        let blindBetNode = this.itemContent.getChildByName("setBlindBet");
        let title = blindBetNode.getChildByName("title");
        let titleCp = title.getComponent(cc.Label);
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
            if (this._curConfig.bottomBetType == 0) {
                titleCp.string = "前注"//i18n.t("CLUB_HALL.BLIND_BET");
                this._curConfig.nSmallBlind = this._curConfig.nPreAnte;
                // this._curConfig.nBigBlind = 2* this._curConfig.nPreAnte;
                this.initPreAnteNode(true);
            } else if (this._curConfig.bottomBetType == 1) {
                titleCp.string = "盲注"//i18n.t("CLUB_HALL.FIXED_BLIND_BET");
                this.initPreAnteNode(false);
            }
        } else {
            titleCp.string = "盲注"//i18n.t("CLUB_HALL.BOTTOM_BET");
            this.initPreAnteNode(false);
        }

        let length = this._gameConfig[this._curGameId].arrConfigOption.length;
        let selectIndex = 1;
        for (let i = 0; i < length; i++) {
            if (this._gameConfig[this._curGameId].arrConfigOption[i][0] == this._curConfig.nSmallBlind
                && this._gameConfig[this._curGameId].arrConfigOption[i][1] == this._curConfig.nBigBlind) {
                selectIndex = i + 1;
            }

        }
        let label_min = blindBetNode.getChildByName("label_min").getComponent(cc.Label);
        let label_max = blindBetNode.getChildByName("label_max").getComponent(cc.Label);
        label_min.string = this._gameConfig[this._curGameId].arrConfigOption[0][0];
        label_max.string = this._gameConfig[this._curGameId].arrConfigOption[length - 1][0];
        this.setBetSlider(this.sliderList[0], selectIndex);
    },

    //-------------------设置带入筹码倍数------------------
    initBringinBetNode() {
        //刷新带入筹码倍数选项
        let length = this._gameConfig[this._curGameId].arrTakeinOption.length;
        let setBringinBetTimes = this.itemContent.getChildByName("setBringinBet");
        let title = setBringinBetTimes.getChildByName("title").getComponent(cc.Label);
        let slider = setBringinBetTimes.getChildByName("slider");
        let space = slider.width / (length - 1);
        let numPanel = setBringinBetTimes.getChildByName("numPanel");
        this.autoStartNumList = [];
        let selectIndex1 = 1;
        let selectIndex2 = length;

        // if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas){
        //     title.lang = "CREATE_ROOM_STR.BRINGIN_BET_TIMES2";
        // }else{
        //     title.lang = "CREATE_ROOM_STR.BRINGIN_BET_TIMES";
        // }

        for (let i = 0; i < numPanel.children.length; i++) {
            let child = numPanel.children[i];
            let label = child.getComponent(cc.Label);
            child.active = false;
            if (i < length) {
                child.active = true;
                label.string = this._gameConfig[this._curGameId].arrTakeinOption[i];
                if (i == 0) {
                    child.x = space * i + 5;
                } else {
                    child.x = space * i;
                }

                if (this._gameConfig[this._curGameId].arrTakeinOption[i] == this._curConfig.nMinTabkeInBB) {
                    selectIndex1 = i + 1;
                }

                if (this._gameConfig[this._curGameId].arrTakeinOption[i] == this._curConfig.nMaxTabkeInBB) {
                    selectIndex2 = i + 1;
                }
            }
        }

        this.setBringinSlider(this.sliderList[5], selectIndex1, 5);
        this.setBringinSlider(this.sliderList[6], selectIndex2, 6);

        this.sliderList[5].node.pauseSystemEvents();
        this.sliderList[6].node.pauseSystemEvents();
    },

    setBringinSlider(slider, selIndex, sliderIndex) {
        let length = this._gameConfig[this._curGameId].arrTakeinOption.length;
        let callBack = function (pro) {
            this.setBringinProgress(slider, sliderIndex);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    setBringinProgress(slider, sliderIndex) {
        let setBringinBetTimes = this.itemContent.getChildByName("setBringinBet");
        let progress = setBringinBetTimes.getChildByName("progress");
        let slider1 = this.sliderList[5];
        let slider2 = this.sliderList[6];
        let pro1 = slider1.progress;
        let pro2 = slider2.progress;
        let length = this._gameConfig[this._curGameId].arrTakeinOption.length;
        let spacePer = 3 / length;//最少间隔3个单位
        if (sliderIndex == 5) {
            if ((pro1 + spacePer) > pro2) {
                if (pro2 - spacePer < 0) {
                    slider.progress = 0;
                } else {
                    slider.progress = pro2 - spacePer;
                }

            }
        } else if (sliderIndex == 6) {

            if ((pro2 - spacePer) < pro1) {
                if (pro1 + spacePer > 1) {
                    slider.progress = 1;
                } else {
                    slider.progress = pro1 + spacePer;
                }

            }
        }

        pro1 = slider1.progress;
        pro2 = slider2.progress;
        let pro = Math.abs(pro1 - pro2)
        let width = slider1.node.width;
        progress.width = width * pro;

        let posx1 = slider1.handle.node.x;
        let posx2 = slider2.handle.node.x;
        let posx = Math.min(posx1, posx2)

        progress.x = posx + width * pro / 2;



        let total = (length - 1) * 2
        let curMark1 = Math.floor(pro1 * accuracy) / accuracy;
        let perMark1 = Math.floor(1 / total * accuracy) / accuracy;
        let index1 = Math.ceil(curMark1 / perMark1);
        let curMark2 = Math.floor(pro2 * accuracy) / accuracy;
        let perMark2 = Math.floor(1 / total * accuracy) / accuracy;
        let index2 = Math.ceil(curMark2 / perMark2);
        let TabkeInBB1 = 0;
        let TabkeInBB2 = 0;

        let setColor = function (index1, index2) {
            let numPanel = setBringinBetTimes.getChildByName("numPanel");
            this.setLabelColor(numPanel, index1, index2);
            // this.refreshAutoStartNum();
        }.bind(this);

        if (index1 >= total) {
            index1 = total;
            TabkeInBB1 = this._gameConfig[this._curGameId].arrTakeinOption[length - 1];
        } else {
            if (index1 % 2 != 0) {
                index1 = index1 - 1;
            }

            TabkeInBB1 = this._gameConfig[this._curGameId].arrTakeinOption[index1 / 2];
        }

        if (index2 >= total) {
            TabkeInBB2 = this._gameConfig[this._curGameId].arrTakeinOption[length - 1];
            index2 = total;
        } else {
            if (index2 % 2 != 0) {
                index2 = index2 - 1;
            }
            TabkeInBB2 = this._gameConfig[this._curGameId].arrTakeinOption[index2 / 2];
        }
        if (TabkeInBB1 > TabkeInBB2) {
            this._curConfig.nMinTabkeInBB = TabkeInBB2;
            this._curConfig.nMaxTabkeInBB = TabkeInBB1;
        } else {
            this._curConfig.nMinTabkeInBB = TabkeInBB1;
            this._curConfig.nMaxTabkeInBB = TabkeInBB2;
        }

        setColor(index1 / 2, index2 / 2);
        this.refreshBringInNode();
    },

    refreshBringInNode() {
        let setBringinBetTimes = this.itemContent.getChildByName("setBringinBet");
        let bet = setBringinBetTimes.getChildByName("bet").getComponent(cc.Label);
        let betStr = Math.floor(this._curConfig.nMinTabkeInBB * this._curConfig.nBigBlind * 100) / 100 + "-" + Math.floor(this._curConfig.nMaxTabkeInBB * this._curConfig.nBigBlind * 100) / 100
        let bbStr = "BB";
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
            if (this._curConfig.bottomBetType == 0) {
                let num1 = Math.floor(this._curConfig.nMinTabkeInBB * this._curConfig.nSmallBlind * this._curConfig.preAnteOdd * 100) / 100;
                let num2 = Math.floor(this._curConfig.nMaxTabkeInBB * this._curConfig.nSmallBlind * this._curConfig.preAnteOdd * 100) / 100;
                betStr = num1 + "-" + num2;
            }
        }
        bet.string = betStr;
        let slider1 = setBringinBetTimes.getChildByName("slider");
        let slider2 = setBringinBetTimes.getChildByName("slider2");
        let handleTxt1 = slider1.getChildByName("Handle").getChildByName("handleTxt").getComponent(cc.Label);
        let handleTxt2 = slider2.getChildByName("Handle").getChildByName("handleTxt").getComponent(cc.Label);
        handleTxt1.string = this._curConfig.nMinTabkeInBB + bbStr;
        handleTxt2.string = this._curConfig.nMaxTabkeInBB + bbStr;
        this.initBuMaNode();
        this.initCutLossNode();
        this.initCheMaNode();
    },

    setAnteOddProgress(pro) {
        let setPreAnte = this.itemContent.getChildByName("setPreAnte");
        let progress = setPreAnte.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;
        let numPanel = setPreAnte.getChildByName("numPanel");

        let anteConfig = this.preAnteConfig;
        let length = anteConfig.length;
        let total = (length - 1)
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.round(curMark / perMark);
        if (index >= total + 1) {
            index = length - 1;
        } else if (index % 2 != 0) {
            // index = index - 1;
        }
        this._curConfig.preAnteOdd = anteConfig[index];

        this.setLabelColor(numPanel, index);

        let bet = setPreAnte.getChildByName("bet").getComponent(cc.Label);
        bet.string = Math.floor(this._curConfig.nSmallBlind * this._curConfig.preAnteOdd * 100) / 100;
        this.refreshBringInNode();
    },

    //-------------------设置带入筹码倍数end------------------

    initIsBumanNode() {
        this._curConfig.isBuMa = this._curConfig.isBuMa || false;
        let isBuMaNode = this.itemContent.getChildByName("setIsBuMa");
        let toggle = isBuMaNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isBuMa;
        this.onClickSelectCallBack(toggle, "isBuMa");
    },

    initBuMaNode() {
        let bumaData = this.bottomSelectDataConfig.buMa.list;
        // let buMaNode = this.itemContent.getChildByName("setBuMa");
        // let btn_goldType = buMaNode.getChildByName("btn_goldType");
        // let buMaLabel = btn_goldType.getChildByName("Label").getComponent(cc.Label);
        // let buMaRichText = buMaNode.getChildByName("buMaRichText").getComponent(cc.RichText);
        // buMaLabel.string = (this._curConfig.BuMaNum || 4) + "倍";
        // let multNum = (this._curConfig.nMaxTabkeInBB*100*this._curConfig.nBigBlind*100)/1e4
        // let gNum = ((multNum*100*(this._curConfig.BuMaNum || 4))*100)/1e4
        // buMaRichText.string = "<color=#65778B>" + multNum + "BB=</c><color=#E8DFD1>" + gNum + "</color>";
        // buMaNode.active = this._curConfig.isBuMa;
        let bumaNode = this.itemContent.getChildByName("setBuMa");
        bumaNode.active = this._curConfig.isBuMa;
        if (!this._curConfig.isBuMa) return

        let slider = bumaNode.getChildByName("slider").getComponent(cc.Slider);
        // let numLayout = bumaNode.getChildByName("numPanel").getComponent(cc.Layout);

        // numLayout.spacingX = (slider.node.width - (bumaData.length * 24))/(bumaData.length - 1);
        // //设置子节点隐藏
        // for (let i = 0; i < numLayout.node.children.length; i++) {
        //     let child = numLayout.node.children[i];
        //     if(i < bumaData.length){
        //         child.active = true;
        //         let label = child.getComponent(cc.Label);
        //         label.string = bumaData[i].title;
        //     }else{
        //         child.active = false;
        //     }
        // }

        this.setBuMaSlider(slider);
    },

    setBuMaSlider(slider, selIndex) {
        let length = this.bottomSelectDataConfig.buMa.list.length;

        let callBack = function (pro) {
            this.setBuMaProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    //设置补码滑动条
    setBuMaProgress(pro) {
        let setBuMa = this.itemContent.getChildByName("setBuMa");
        let progress = setBuMa.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;
        let numPanel = setBuMa.getChildByName("numPanel");

        let anteConfig = this.bottomSelectDataConfig.buMa.list;
        let length = anteConfig.length;
        let total = (length - 1)
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.round(curMark / perMark);
        if (index >= total + 1) {
            index = length - 1;
        }
        let buma = anteConfig[index].title || 4;
        this.setLabelColor(numPanel, index);
        let limitNum = this._curConfig.nBigBlind;
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0) {
            limitNum = this._curConfig.nSmallBlind * this._curConfig.preAnteOdd;
        }
        let bet = setBuMa.getChildByName("bet").getComponent(cc.Label);
        let headText = progress.node.getChildByName('Handle').getChildByName('handleTxt').getComponent(cc.Label);
        this._curConfig.BuMaNum = Math.floor((this._curConfig.nMaxTabkeInBB * limitNum * buma) * 100) / 100;
        bet.string = this._curConfig.BuMaNum
        headText.string = Math.floor((this._curConfig.nMaxTabkeInBB * buma) * 100) / 100 + 'BB';
    },

    initIsCheMaNode() {
        this._curConfig.isTabkeOut = this._curConfig.isTabkeOut || false;
        let isCheMaNode = this.itemContent.getChildByName("setIsCheMa");
        let toggle = isCheMaNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isTabkeOut;
        this.onClickSelectCallBack(toggle, "isCheMa");
        isCheMaNode.active = this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas

    },

    initCheMaNode() {
        // let cheMaData = this.bottomSelectDataConfig.cheMa;
        // this._curConfig.nTabkeOutOdd = this._curConfig.nTabkeOutOdd || 2;
        // let cheMaNode = this.itemContent.getChildByName("setCheMa");
        // let title =     cheMaNode.getChildByName("title");
        // let cheMaLimit = title.getChildByName("Label").getComponent(cc.Label);
        // let btn_goldType = cheMaNode.getChildByName("btn_goldType");
        // let cheMaLabel = btn_goldType.getChildByName("Label").getComponent(cc.Label);
        // cheMaLabel.string = (this._curConfig.nTabkeOutOdd || 2) + "倍";
        // cheMaNode.active =  this._curConfig.isTabkeOut && (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas);
        // let limitNum = this._curConfig.nBigBlind ;
        // if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas){
        //     if (this._curConfig.bottomBetType == 0){
        //         limitNum = this._curConfig.nSmallBlind;
        //     }
        // }
        // cheMaLimit.string = ((this._curConfig.nMinTabkeInBB*100*limitNum*100*(this._curConfig.nTabkeOutOdd || 2))*100)/1e6;
        let cheMaData = this.bottomSelectDataConfig.cheMa.list;
        let cheMaNode = this.itemContent.getChildByName("setCheMa");
        cheMaNode.active = this._curConfig.isTabkeOut;
        if (!this._curConfig.isTabkeOut) return

        let slider = cheMaNode.getChildByName("slider").getComponent(cc.Slider);
        let numLayout = cheMaNode.getChildByName("numPanel").getComponent(cc.Layout);

        numLayout.spacingX = (slider.node.width - (cheMaData.length * 24)) / (cheMaData.length - 1);
        //设置子节点隐藏
        for (let i = 0; i < numLayout.node.children.length; i++) {
            let child = numLayout.node.children[i];
            if (i < cheMaData.length) {
                child.active = true;
                let label = child.getComponent(cc.Label);
                label.string = cheMaData[i].title;
            } else {
                child.active = false;
            }
        }

        this.setCheMaSlider(slider);
    },

    setCheMaSlider(slider, selIndex) {
        let length = this.bottomSelectDataConfig.cheMa.list.length;

        let callBack = function (pro) {
            this.setCheMaProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    //设置撤码倍数滑动条
    setCheMaProgress(pro) {
        let setCheMa = this.itemContent.getChildByName("setCheMa");
        let progress = setCheMa.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;
        let numPanel = setCheMa.getChildByName("numPanel");

        let anteConfig = this.bottomSelectDataConfig.cheMa.list;
        let length = anteConfig.length;
        let total = (length - 1)
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.round(curMark / perMark);
        if (index >= total + 1) {
            index = length - 1;
        }
        this._curConfig.nTabkeOutOdd = anteConfig[index].title;

        this.setLabelColor(numPanel, index);
        let limitNum = this._curConfig.nBigBlind;
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0) {
            limitNum = this._curConfig.nSmallBlind * this._curConfig.preAnteOdd;
        }
        let headText = progress.node.getChildByName('Handle').getChildByName('handleTxt').getComponent(cc.Label);
        let bet = setCheMa.getChildByName("bet").getComponent(cc.Label);
        bet.string = Math.floor((this._curConfig.nMinTabkeInBB * limitNum * (this._curConfig.nTabkeOutOdd || 2)) * 100) / 100;
        headText.string = Math.floor((this._curConfig.nMinTabkeInBB * (this._curConfig.nTabkeOutOdd || 2)) * 100) / 100 + 'BB';
    },

    initIsCutLossNode() {
        this._curConfig.isCutLoss = this._curConfig.isCutLoss || false;
        let IsCutLossNode = this.itemContent.getChildByName("setIsCutLoss");
        let toggle = IsCutLossNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isCutLoss;
        this.onClickSelectCallBack(toggle, "isCutLoss");

    },

    initCutLossNode() {


        // let cutLossData = this.bottomSelectDataConfig.cutLoss.list;
        let cutLossNode = this.itemContent.getChildByName("setCutLoss");
        cutLossNode.active = this._curConfig.isCutLoss;
        if (!this._curConfig.isCutLoss) return

        let slider = cutLossNode.getChildByName("slider").getComponent(cc.Slider);
        this.setCutLossSlider(slider);


    },

    setCutLossSlider(slider, selIndex) {
        let length = this.bottomSelectDataConfig.cutLoss.list.length;

        let callBack = function (pro) {
            this.setCutLossProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    //设置止损上限滑动条
    setCutLossProgress(pro) {
        let setCutLoss = this.itemContent.getChildByName("setCutLoss");
        let progress = setCutLoss.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;
        let numPanel = setCutLoss.getChildByName("numPanel");

        let anteConfig = this.bottomSelectDataConfig.cutLoss.list;
        let length = anteConfig.length;
        let total = (length - 1)
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.round(curMark / perMark);
        if (index >= total + 1) {
            index = length - 1;
        }
        this._curConfig.CutLossNum = anteConfig[index].title;

        this.setLabelColor(numPanel, index);
        let limitNum = this._curConfig.nBigBlind;
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0) {
            limitNum = this._curConfig.nSmallBlind * this._curConfig.preAnteOdd;
        }
        let bet = setCutLoss.getChildByName("bet").getComponent(cc.Label);
        let headText = progress.node.getChildByName('Handle').getChildByName('handleTxt').getComponent(cc.Label);
        bet.string = Math.floor(this._curConfig.nMaxTabkeInBB * limitNum * (this._curConfig.CutLossNum) * 100) / 100;
        headText.string = Math.floor(this._curConfig.nMaxTabkeInBB * (this._curConfig.CutLossNum) * 100) / 100 + 'BB';
        this._curConfig.nLoseMaxAmount = Number(bet.string);
    },


    //-------------------设置前注------------------
    initIsPreBetNode() {
        this._curConfig.isPreBet = this._curConfig.isPreBet || false;
        let IsPreBetNode = this.itemContent.getChildByName("setIsPreBet");
        let toggle = IsPreBetNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isPreBet;
        this.onClickSelectCallBack(toggle, "isPreBet");
        IsPreBetNode.active = !(this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0);
        this.initPreBetNode();
    },


    initPreBetNode() {
        //刷新前注选项
        // let array = this._gameConfig[this._curGameId].arrConfigOption[this._curBetSel][3];
        let setPreBet = this.itemContent.getChildByName("setPreBet");
        let slider = setPreBet.getChildByName("slider").getComponent(cc.Slider);
        // let space = slider.width/(array.length - 1);
        // let numPanel = setPreBet.getChildByName("numPanel");
        //this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0 || 
        // this._curConfig.nPreAnte = this._curConfig.nPreAnte != 0 ? this._curConfig.nPreAnte : array[0];
        // for (let i = 0; i < numPanel.children.length; i++) {
        //     let child = numPanel.children[i];
        //     let label = child.getComponent(cc.Label);
        //     child.active = false;
        //     if (i < array.length){
        //         child.active = true;
        //         label.string = array[i] ;//+ "BB"
        //         if (i == 0){
        //             child.x = space * i + 5;
        //         }else{
        //             child.x = space * i;
        //         }

        //         if (this._curConfig.nPreAnte == array[i]){
        //             selectIndex = i + 1;
        //         }
        //     }
        // }

        setPreBet.active = this._curConfig.isPreBet && !(this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0);
        // numPanel.getComponent(cc.Layout).updateLayout();
        this.setFrontBetSlider(slider);
    },

    setFrontBetSlider(slider, selIndex) {
        let length = this._gameConfig[this._curGameId].arrConfigOption[this._curBetSel][3].length;

        let callBack = function (pro) {
            this.setFrontBetProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    setFrontBetProgress(pro) {
        let setFrontBet = this.itemContent.getChildByName("setPreBet");
        let progress = setFrontBet.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;

        let preAnteData = this._gameConfig[this._curGameId].arrConfigOption[this._curBetSel][3];
        let length = preAnteData.length;
        let total = length - 1
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.round(curMark / perMark);
        if (index >= total + 1) {
            index = length - 1;
        }

        // let setColor = function(index){
        //     let  numPanel = setFrontBet.getChildByName("numPanel");
        //     this.setLabelColor(numPanel, index);
        // }.bind(this);
        this._curConfig.nPreAnte = preAnteData[index];


        let limitNum = this._curConfig.nBigBlind;
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0) {
            limitNum = this._curConfig.nSmallBlind * this._curConfig.preAnteOdd;
        }

        let headText = progress.node.getChildByName('Handle').getChildByName('handleTxt').getComponent(cc.Label);
        headText.string = Math.floor((this._curConfig.nPreAnte / limitNum * 10000) + 0.000001) / 10000 + 'BB';
        let bet = setFrontBet.getChildByName("bet").getComponent(cc.Label);
        bet.string = this._curConfig.nPreAnte;
        // setColor(index/2);
    },
    //-------------------设置前注end------------------

    initPlayerNumNode() {
        // this.playerNumList
        this.selectPlayerNumIndex = this.playerNumList.indexOf(this._curConfig.nCapacity) || 0;
        let playerNumNode = this.itemContent.getChildByName("setPlayerNum");
        let numBg = playerNumNode.getChildByName("numBg");
        let numLabel = numBg.getChildByName("Label").getComponent(cc.Label);
        numLabel.string = this.playerNumList[this.selectPlayerNumIndex];
        this._curConfig.nCapacity = this.playerNumList[this.selectPlayerNumIndex];

    },
    onClickChangePlayerNum(event, data) {
        let index = Number(data);
        let length = this.playerNumList.length;
        let playerNumNode = this.itemContent.getChildByName("setPlayerNum");
        let numBg = playerNumNode.getChildByName("numBg");
        let numLabel = numBg.getChildByName("Label").getComponent(cc.Label);
        this.selectPlayerNumIndex = this.selectPlayerNumIndex + index;
        if (this.selectPlayerNumIndex < 0) {
            this.selectPlayerNumIndex = 0;
        } else if (this.selectPlayerNumIndex >= length) {
            this.selectPlayerNumIndex = length - 1;
        }
        numLabel.string = this.playerNumList[this.selectPlayerNumIndex];
        this._curConfig.nCapacity = this.playerNumList[this.selectPlayerNumIndex];
    },

    initGameTimeNode() {
        this.selectGameTimeIndex = this._gameConfig[this._curGameId].arrKeepTimeOption.indexOf(this._curConfig.nKeepTime / (60 * 60)) || 0;
        if (this.selectGameTimeIndex < 0) {
            this.selectGameTimeIndex = 0;
        }
        let gameTimeNode = this.itemContent.getChildByName("setGameTime");
        let numBg = gameTimeNode.getChildByName("numBg");
        let numLabel = numBg.getChildByName("Label").getComponent(cc.Label);
        numLabel.string = this._gameConfig[this._curGameId].arrKeepTimeOption[this.selectGameTimeIndex] + "H";
        this._curConfig.nKeepTime = this._gameConfig[this._curGameId].arrKeepTimeOption[this.selectGameTimeIndex] * 60 * 60;
    },

    onClickChangeGameTimeNum(event, data) {
        let index = Number(data);
        let length = this._gameConfig[this._curGameId].arrKeepTimeOption.length;
        let gameTimeNode = this.itemContent.getChildByName("setGameTime");
        let numBg = gameTimeNode.getChildByName("numBg");
        let numLabel = numBg.getChildByName("Label").getComponent(cc.Label);
        this.selectGameTimeIndex = this.selectGameTimeIndex + index;
        if (this.selectGameTimeIndex < 0) {
            this.selectGameTimeIndex = 0;
        } else if (this.selectGameTimeIndex >= length) {
            this.selectGameTimeIndex = length - 1;
        }
        numLabel.string = this._gameConfig[this._curGameId].arrKeepTimeOption[this.selectGameTimeIndex] + "H";
        this._curConfig.nKeepTime = this._gameConfig[this._curGameId].arrKeepTimeOption[this.selectGameTimeIndex] * 60 * 60;
    },

    initIsGrapHeadNode() {
        let isGrapHeadNode = this.itemContent.getChildByName("setIsGrapHead");
        let toggle = isGrapHeadNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isForceBlind;
        this.onClickSelectCallBack(toggle, "isGrapHead");
        isGrapHeadNode.active = (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 1) || (this._curGameId != clubGameConfig.CLUB_GAME_CONFIG.ShortTexas)

    },

    //保险
    initIsInsuranceNode() {
        let isInsuranceNode = this.itemContent.getChildByName("setIsInsurance");
        let toggle = isInsuranceNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.nInsureMode == 1;
        this.onClickSelectCallBack(toggle, "isInsurance");
    },

    initIsPoolRateLimitNode() {
        let isPoolRateLimitNode = this.itemContent.getChildByName("setIsPoolRateLimit");
        let toggle = isPoolRateLimitNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isPoolRateLimit;
        this.onClickSelectCallBack(toggle, "isPoolRateLimit");
    },
    initPoolRateNode() {
        this._curConfig.nPoolEntryRate = this._curConfig.nPoolEntryRate || 30;
        this._curConfig.nPoolEntryRateHands = this._curConfig.nPoolEntryRateHands || 100;
        let setPoolRateNode = this.itemContent.getChildByName("setPoolRate");
        setPoolRateNode.active = this._curConfig.isPoolRateLimit;
        let titleLabel = setPoolRateNode.getChildByName("title").getComponent(cc.Label);
        // titleLabel.string = i18n.t("CLUB_HALL.POOL_RATE");
        let title = setPoolRateNode.getChildByName("title1").getComponent(cc.Label);
        // title.string = i18n.t("CLUB_HALL.POOL_RATE");
        let btn_PoolRate = setPoolRateNode.getChildByName("btn_PoolRate");
        let numLabel = btn_PoolRate.getChildByName("Label").getComponent(cc.Label);
        numLabel.string = this._curConfig.nPoolEntryRate + "%";
        let btn_HandNum = setPoolRateNode.getChildByName("btn_HandNum");
        let handNum = btn_HandNum.getChildByName("Label").getComponent(cc.Label);
        handNum.string = this._curConfig.nPoolEntryRateHands;

    },
    initIsHandNumLimitNode() {
        let isHandNumLimitNode = this.itemContent.getChildByName("setIsHandNumLimit");
        let toggle = isHandNumLimitNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isHandNumLimit;
        this.onClickSelectCallBack(toggle, "isHandNumLimit");
    },
    initHandNumLimitNode() {
        this._curConfig.nPoolHands = this._curConfig.nPoolHands || 100;
        let handNumLimitNode = this.itemContent.getChildByName("setHandNumLimit");
        handNumLimitNode.active = this._curConfig.isHandNumLimit;
        let numLabel = handNumLimitNode.getChildByName("btn_HandNum").getChildByName("Label").getComponent(cc.Label);
        numLabel.string = this._curConfig.nPoolHands;
    },

    initBuMangShangZhuoNode() {
        let isBuMangShangZhuoNode = this.itemContent.getChildByName("setIsBuMangShangZhuo");
        let toggle = isBuMangShangZhuoNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isBuMangShangZhuo;
        this.onClickSelectCallBack(toggle, "isBuMangShangZhuo");

    },

    initIsCommissionNode() {
        let isCommissionNode = this.itemContent.getChildByName("setIsCommission");
        let toggle = isCommissionNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isCommission;
        this.onClickSelectCallBack(toggle, "isCommission");
        //抽水
        // this._curConfig.tDrawWaterMode.nModeType = this._curConfig.isCommission ? this._curConfig.bottomCommissionType : 0;

    },

    initCommissionTypeNode() {
        let setCommissionType = this.itemContent.getChildByName("setCommissionType");
        setCommissionType.active = this._curConfig.isCommission;
        let toggleContainer = setCommissionType.getChildByName("ToggleContainer");
        let toggle1 = toggleContainer.getChildByName("toggle1");
        let toggle2 = toggleContainer.getChildByName("toggle2");
        toggle1.getComponent(cc.Toggle).isChecked = this._curConfig.tDrawWaterMode.nModeType == 3;
        toggle2.getComponent(cc.Toggle).isChecked = this._curConfig.tDrawWaterMode.nModeType == 1;
    },

    setInitTypeCommission() {
        let setCommissionType = this.itemContent.getChildByName("setCommissionType");
        setCommissionType.active = this._curConfig.isCommission;
        let toggleContainer = setCommissionType.getChildByName("ToggleContainer");
        let toggle1 = toggleContainer.getChildByName("toggle1");
        let toggle2 = toggleContainer.getChildByName("toggle2");
        if(toggle1.getComponent(cc.Toggle).isChecked) this._curConfig.tDrawWaterMode.nModeType = 3;
        else if(toggle2.getComponent(cc.Toggle).isChecked) this._curConfig.tDrawWaterMode.nModeType = 1;
        this.initCommissionNode();
    },

    onClickCommissionTypeCallBack(event, data) {
        let num = Number(data)
        this._curConfig.tDrawWaterMode.nModeType = num;
        this.initCommissionNode();
    },

    /////
    initCommissionNode() {
        let setCommissionNode = this.itemContent.getChildByName("setCommission");
        setCommissionNode.active = this._curConfig.isCommission;
        this.setCommissionRateList();
        //刷新抽水封顶选项
        let array = this.commissionRateList;
        let slider = setCommissionNode.getChildByName("slider");
        let space = slider.width / (array.length - 1);
        let numPanel = setCommissionNode.getChildByName("numPanel");
        let selectIndex = 1;

        for (let i = 0; i < numPanel.children.length; i++) {
            let child = numPanel.children[i];
            let label = child.getComponent(cc.Label);
            child.active = false;
            if (i < array.length) {
                child.active = true;
                label.string = array[i] + "%";

                if (i == 0) {
                    child.x = space * i + 10;
                } else {
                    child.x = space * i;
                }

                if (this._curConfig.tDrawWaterMode.nTaxRate == array[i]) {
                    selectIndex = i + 1;
                }
            }
        }

        this.setPotRateSlider(this.sliderList[8], selectIndex);


        this.initCommissionTypeNode();
        this.initCommissionBaChouNode();
    },

    setPotRateSlider(slider, selIndex) {
        let length = this.commissionRateList.length;

        let callBack = function (pro) {
            this.setPotRateProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    setPotRateProgress(pro) {
        let setCommissionNode = this.itemContent.getChildByName("setCommission");
        let progress = setCommissionNode.getChildByName("slider").getComponent(cc.ProgressBar);
        progress.progress = pro;

        let length = this.commissionRateList.length;
        let total = (length - 1) * 2
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        let index = Math.ceil(curMark / perMark);

        let setColor = function (index) {
            let numPanel = setCommissionNode.getChildByName("numPanel");
            this.setLabelColor(numPanel, index, index, true);
        }.bind(this);

        this._curConfig.tDrawWaterMode.nTaxRate = this.commissionRateList[length - 1];
        if (index >= total) {
            this._curConfig.tDrawWaterMode.nTaxRate = this.commissionRateList[length - 1];
            setColor(length - 1);
            return;
        }

        if (index % 2 != 0) {
            index = index - 1;
        }

        this._curConfig.tDrawWaterMode.nTaxRate = this.commissionRateList[index / 2];
        setColor(index / 2);
    },



    initCommissionBaChouNode() {
        let commissionBaChouNode = this.itemContent.getChildByName("setCommissionBaChou");
        commissionBaChouNode.active = this._curConfig.isCommission && this._curConfig.tDrawWaterMode.nModeType == 1;
        this._curConfig.tDrawWaterMode.nBottomPool = this._curConfig.tDrawWaterMode.nBottomPool || this.bottomSelectDataConfig.bottomPool.list[1].title || 10;
        this._curConfig.tDrawWaterMode.nTopLimitBB = this._curConfig.tDrawWaterMode.nTopLimitBB || this._gameConfig[this._curGameId].arrDWLimitOption[0] || 1;

        let bbStr = "BB";
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
            if (this._curConfig.bottomBetType == 0) {
                // bbStr = "前注";
            }
        }

        let btn_bottomPool = commissionBaChouNode.getChildByName("btn_bottomPool");
        let label = btn_bottomPool.getChildByName("Label").getComponent(cc.Label);
        label.string = this._curConfig.tDrawWaterMode.nBottomPool + bbStr;
        let btn_LimitUp = commissionBaChouNode.getChildByName("btn_LimitUp");
        let labelUp = btn_LimitUp.getChildByName("Label").getComponent(cc.Label);
        labelUp.string = this._curConfig.tDrawWaterMode.nTopLimitBB == -1 ? '无限制' : this._curConfig.tDrawWaterMode.nTopLimitBB + bbStr;
    },

    //公共牌付费
    initIsPayPublicCardNode() {
        let isPayPublicCardNode = this.itemContent.getChildByName("setIsPayPublicCard");
        let toggle = isPayPublicCardNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.nTableCost[0].open == 1;
        this.onClickSelectCallBack(toggle, "isPayPublicCard");
    },
    initPayPublicCardNode() {
        for (let i = 0; i < this._gameConfig[this._curGameId].arrConfigOption.length; i++) {
            let publicPayNum = this._gameConfig[this._curGameId].arrConfigOption[i][5];
            if (this._curConfig.nTableCost[0].mult == publicPayNum) {
                this.payPublicCardIndex = i;
            }
        }
        this.payPublicCardIndex = this.payPublicCardIndex || 0;
        let payPublicCardNode = this.itemContent.getChildByName("setPayPublicCard");
        payPublicCardNode.active = this._curConfig.nTableCost[0].open == 1;
        let toggleContainer = payPublicCardNode.getChildByName("ToggleContainer")
        let toggleList = toggleContainer.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < toggleList.length; i++) {
            let toggle = toggleList[i];
            toggle.isChecked = this.payPublicCardIndex == i;
            toggle.node.active = false;
            let bName = toggle.node.getChildByName("Background").getChildByName("name")
            let cName = toggle.node.getChildByName("checkmark").getChildByName("name")
            if (this._gameConfig[this._curGameId].arrConfigOption[i]) {
                toggle.node.active = true;
                let publicPayNum = this._gameConfig[this._curGameId].arrConfigOption[i][5];
                bName.getComponent(cc.Label).string = publicPayNum + "BB";
                cName.getComponent(cc.Label).string = publicPayNum + "BB";
            }
            cc.log("----payPublicCardIndex---", typeof (this.payPublicCardIndex), this.payPublicCardIndex)
            cc.log("----i---", typeof (i), i)
            if (this.payPublicCardIndex === i) {
                this.onClickPublicCardPayTypeCallBack(toggle, i);
            }

        }
        this._curConfig.nTableCost[0].mult = this._curConfig.nTableCost[0].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payPublicCardIndex][5] : 0;

        toggleContainer.getComponent(cc.Layout).updateLayout();

    },
    onClickPublicCardPayTypeCallBack(event, data) {
        let num = Number(data)
        this.payPublicCardIndex = num;
        this._curConfig.nTableCost[0].mult = this._curConfig.nTableCost[0].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payPublicCardIndex][5] : 0;
    },

    //付费看手牌

    initIsPayHandCardNode() {
        let isPayHandCardNode = this.itemContent.getChildByName("setIsPayHandCard");
        let toggle = isPayHandCardNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.nTableCost[1].open == 1;
        this.onClickSelectCallBack(toggle, "isPayHandCard");
    },

    initPayHandCardNode() {
        let payHandCardNode = this.itemContent.getChildByName("setPayHandCard");
        payHandCardNode.active = this._curConfig.nTableCost[1].open == 1;
        let toggleContainer = payHandCardNode.getChildByName("ToggleContainer")
        let toggleList = toggleContainer.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < this._gameConfig[this._curGameId].arrConfigOption.length; i++) {
            let handPayNum = this._gameConfig[this._curGameId].arrConfigOption[i][4];
            if (this._curConfig.nTableCost[1].mult == handPayNum) {
                this.payHandCardIndex = i;
            }
        }
        this.payHandCardIndex = this.payHandCardIndex || 0;
        for (let i = 0; i < toggleList.length; i++) {
            let toggle = toggleList[i];
            toggle.isChecked = this.payHandCardIndex == i;
            let bName = toggle.node.getChildByName("Background").getChildByName("name")
            let cName = toggle.node.getChildByName("checkmark").getChildByName("name")
            toggle.node.active = false;
            if (this._gameConfig[this._curGameId].arrConfigOption[i]) {
                toggle.node.active = true;
                let handPayNum = this._gameConfig[this._curGameId].arrConfigOption[i][4];
                bName.getComponent(cc.Label).string = handPayNum + "BB";
                cName.getComponent(cc.Label).string = handPayNum + "BB";
            }

            if (this.payHandCardIndex === i) {
                this.onClickPayHandCardCallBack(toggle, i);
            }
        }
        this._curConfig.nTableCost[1].mult = this._curConfig.nTableCost[1].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payHandCardIndex][4] : 0;

        toggleContainer.getComponent(cc.Layout).updateLayout();
    },
    onClickPayHandCardCallBack(event, data) {
        let num = Number(data)
        this.payHandCardIndex = num;
        this._curConfig.nTableCost[1].mult = this._curConfig.nTableCost[1].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payHandCardIndex][4] : 0;
    },

    //付费切牌
    initIsPayCutCardNode() {
        let isPayCutCardNode = this.itemContent.getChildByName("setIsPayCutCard");
        let toggle = isPayCutCardNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.nTableCost[2].open == 1;
        this.onClickSelectCallBack(toggle, "isPayCutCard");
    },


    initPayCutCardNode() {
        for (let i = 0; i < this._gameConfig[this._curGameId].arrConfigOption.length; i++) {
            let cutPayNum = this._gameConfig[this._curGameId].arrConfigOption[i][6];
            if (this._curConfig.nTableCost[2].mult == cutPayNum) {
                this.payCutCardIndex = i;
            }
        }
        this.payCutCardIndex = this.payCutCardIndex || 0;
        let payCutCardNode = this.itemContent.getChildByName("setPayCutCard");
        payCutCardNode.active = this._curConfig.nTableCost[2].open == 1;
        let toggleContainer = payCutCardNode.getChildByName("ToggleContainer")
        let toggleList = toggleContainer.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < toggleList.length; i++) {
            let toggle = toggleList[i];
            toggle.isChecked = this.payCutCardIndex == i;
            let bName = toggle.node.getChildByName("Background").getChildByName("name")
            let cName = toggle.node.getChildByName("checkmark").getChildByName("name")
            toggle.node.active = false;
            if (this._gameConfig[this._curGameId].arrConfigOption[i]) {
                toggle.node.active = true;
                let cutPayNum = this._gameConfig[this._curGameId].arrConfigOption[i][6];
                bName.getComponent(cc.Label).string = cutPayNum + "BB";
                cName.getComponent(cc.Label).string = cutPayNum + "BB";
            }

            if (this.payCutCardIndex === i) {
                this.onClickPayCutCardCallBack(toggle, i);
            }
        }

        this._curConfig.nTableCost[2].mult = this._curConfig.nTableCost[2].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payCutCardIndex][6] : 0;

        toggleContainer.getComponent(cc.Layout).updateLayout();
    },
    onClickPayCutCardCallBack(event, data) {
        let num = Number(data)
        this.payCutCardIndex = num;
        this._curConfig.nTableCost[2].mult = this._curConfig.nTableCost[2].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payCutCardIndex][6] : 0;
    },

    //延迟看牌
    initIsDelayViewCardNode() {
        let isDelayViewCardNode = this.itemContent.getChildByName("setIsDelayViewCard");
        let toggle = isDelayViewCardNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isDelayLook;
        this.onClickSelectCallBack(toggle, "isDelayViewCard");
    },

    //自动开局人数
    initIsAutoStartPlayerNumNode() {
        let isAutoStartPlayerNumNode = this.itemContent.getChildByName("setIsAutoStartPlayerNum");
        let toggle = isAutoStartPlayerNumNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.tAutostart.isOpen;
        this.onClickSelectCallBack(toggle, "isAutoStartPlayerNum");
    },
    initAutoStartPlayerNumNode() {
        this.autoStartPlayerNumIndex = this._gameConfig[this._curGameId].arrCapacityOption[this.autoStartPlayerNumIndex] ? this._gameConfig[this._curGameId].arrCapacityOption.indexOf(this._curConfig.tAutostart.nPlayerCnt) : 0;
        let autoStartPlayerNumNode = this.itemContent.getChildByName("setAutoStartPlayerNum");
        autoStartPlayerNumNode.active = this._curConfig.tAutostart.isOpen;
        let toggleContainer = autoStartPlayerNumNode.getChildByName("ToggleContainer")
        let toggleList = toggleContainer.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < toggleList.length; i++) {
            let toggle = toggleList[i];

            let bName = toggle.node.getChildByName("Background").getChildByName("name")
            let cName = toggle.node.getChildByName("checkmark").getChildByName("name")

            if (this.autoStartPlayerNumIndex == i) {
                this.onClickAutoStartPlayerNumCallBack(toggle, i);
            }
            if (this._gameConfig[this._curGameId].arrCapacityOption[i]) {
                bName.getComponent(cc.Label).string = this._gameConfig[this._curGameId].arrCapacityOption[i];
                cName.getComponent(cc.Label).string = this._gameConfig[this._curGameId].arrCapacityOption[i];
                toggle.node.active = true;
            } else {
                toggle.node.active = false;
            }
            toggle.isChecked = this.autoStartPlayerNumIndex == i;
        }

        this._curConfig.tAutostart.nPlayerCnt = this._gameConfig[this._curGameId].arrCapacityOption[this.autoStartPlayerNumIndex];


    },
    onClickAutoStartPlayerNumCallBack(event, data) {
        let num = Number(data)
        this.autoStartPlayerNumIndex = num;
        this._curConfig.tAutostart.nPlayerCnt = this._gameConfig[this._curGameId].arrCapacityOption[this.autoStartPlayerNumIndex];
    },

    //抽签入座
    initIsDrawSignNode() {
        let isDrawSignNode = this.itemContent.getChildByName("setIsDrawSign");
        let toggle = isDrawSignNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isDrawSign;
        this.onClickSelectCallBack(toggle, "isDrawSign");
    },

    //观众禁言
    initIsViewerSilenceNode() {
        let isViewerSilenceNode = this.itemContent.getChildByName("setIsViewerSilence");
        let toggle = isViewerSilenceNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = false;//this._curConfig.nMutedUnSite == 1 ;
        this.onClickSelectCallBack(toggle, "isViewerSilence");
    },

    //实时音频
    initIsRealTimeAudioNode() {
        let isRealTimeAudioNode = this.itemContent.getChildByName("setIsRealTimeAudio");
        let toggle = isRealTimeAudioNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isVideoFee;
        this.onClickSelectCallBack(toggle, "isRealTimeAudio");
        // let tip =isRealTimeAudioNode.getChildByName("tip").getComponent(cc.Label);
        // tip.string = (this._gameConfig[this._curGameId].nVideoFee || 0.002) + "USDT/人/分钟";
    },

    //Gps/IP限制
    initIsGPSLimitNode() {
        let isGPSLimitNode = this.itemContent.getChildByName("setIsGPSLimit");
        let toggle = isGPSLimitNode.getChildByName("toggle").getComponent(cc.Toggle);
        toggle.isChecked = this._curConfig.isGPSLimit;
        this.onClickSelectCallBack(toggle, "isGPSLimit");
        this._curConfig.isGPSLimit = this._curConfig.isGPSLimit;
    },
    //新修改该结束·-------


    initLabel() {
        this.editBox.placeholder = i18n.t("CLUB_HALL.INPUT_ROOM_NAME");
    },


    onSliderTouchBegin(event, customEventData) {
        this.scrollview.vertical = false;
    },

    onSliderTouchEnd(event, customEventData) {
        this.scrollview.vertical = true;
        let index = Number(customEventData);
        let slider = this.sliderList[index - 1];
        switch (index) {
            case 1:
                //设置大小盲
                this.setBetSlider(slider);
                break;
            case 2:
                //设置前注
                this.setFrontBetSlider(slider);
                break;
            case 3:
                //设置人数
                this.setPlayerNumSlider(slider);
                break;
            case 4:
                //设置自动开始人数
                this.setSartNumSlider(slider);
                break;
            case 5:
                //设置时长
                this.setTimeSlider(slider);
                break;
            case 6:
                //设置带入筹码倍数
                this.setBringinSlider(slider, null, 5);
                break;
            case 7:
                //设置带入筹码倍数
                this.setBringinSlider(slider, null, 6);
                break;
            case 8:
                //设置最低入池率
                this.setPoolEnterRateSlider(slider);
                break;
            case 9:
                //设置抽水封顶
                this.setPotRateSlider(slider);
                break;
            case 10:
                //短牌前注
                // this.setFrontBetSCSlider(slider);
                break;
            case 11:
                //短牌庄家n倍
                this.setAnteOddSlider(slider);
                break;
            case 12:
                //补码
                this.setBuMaSlider(slider);
                break;
            case 13:
                //止损上限
                this.setCutLossSlider(slider);
                break;
            case 14:
                //撤码
                this.setCheMaSlider(slider);
                break;
        }

    },

    onSliderTuchCancel(event, customEventData) {
        this.scrollview.vertical = true;
        this.onSliderTouchEnd(event, customEventData);
    },

    onClickSlider(slider, customEventData) {
        let index = Number(customEventData);
        switch (index) {
            case 1:
                //设置大小盲
                this.setBetProgress(slider.progress);
                break;
            case 2:
                //设置前注
                this.setFrontBetProgress(slider.progress);
                break;
            case 3:
                //设置人数
                this.setPlayerNumProgress(slider.progress);
                break;
            case 4:
                //设置自动开始人数
                this.setStartNumProgress(slider.progress);
                break;
            case 5:
                //设置时长
                this.setTimeProgress(slider.progress);
                break;
            case 6:
                //设置带入筹码倍数
                this.setBringinProgress(slider, 5);
                break;
            case 7:
                //设置带入筹码倍数
                this.setBringinProgress(slider, 6);
                break;
            case 8:
                //设置最低入池率
                this.setPoolEnterRateProgress(slider.progress);
                break;
            case 9:
                //设置抽水封顶
                this.setPotRateProgress(slider.progress);
            case 10:
                //短牌前注
                // this.setFrontBetSCProgress(slider.progress);
                break;
            case 11:
                //短牌庄家n倍前注
                this.setAnteOddProgress(slider.progress);
                break;
            case 12:
                //补码
                this.setBuMaProgress(slider.progress);
                break;
            case 13:
                //止损上限
                this.setCutLossProgress(slider.progress);
                break;
            case 14:
                //撤码
                this.setCheMaProgress(slider.progress);
                break;
        }
    },

    //-------------------设置按pot比例end------------------



    setLabelColor(node, index1, index2, isPotRate) {
        let color1 = new cc.Color(232, 223, 209, 255);
        let color2 = new cc.Color(101, 119, 139, 255);
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if (index1 == i || index2 == i) {
                child.color = color1;
                if (isPotRate) {
                    child.getComponent(cc.Label).fontSize = 42;
                } else {
                    child.getComponent(cc.Label).fontSize = 42;
                }

            } else {
                child.color = color2;
                if (isPotRate) {
                    child.getComponent(cc.Label).fontSize = 42;
                } else {
                    child.getComponent(cc.Label).fontSize = 42;
                }
            }

        }
    },

    onClose() {
        this.node.destroy();
    },

    onClickToggle(event, data) {
        let node = event.node;
        let sp_select = node.getChildByName("sp_select");
        let checkmark = node.getChildByName("checkmark");
        let background = node.getChildByName("Background");
        if (event.isChecked) {
            sp_select.x = 23;
            checkmark.active = true;
            background.active = false;
        } else {
            sp_select.x = -23;
            checkmark.active = false;
            background.active = true;
        }
    },

    //统一设置创建房间可选数据
    setToggleCreateData() {
        this._curConfig.tAutostart.nPlayerCnt = this._curConfig.tAutostart.isOpen ? this._curConfig.tAutostart.nPlayerCnt : 0;
        this._curConfig.nTableCost[2].nCost = this._curConfig.nTableCost[2].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payCutCardIndex][6] * this._curConfig.nBigBlind : 0;
        this._curConfig.nTableCost[1].nCost = this._curConfig.nTableCost[1].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payHandCardIndex][4] * this._curConfig.nBigBlind : 0;
        this._curConfig.nTableCost[0].nCost = this._curConfig.nTableCost[0].open == 1 ? this._gameConfig[this._curGameId].arrConfigOption[this.payPublicCardIndex][5] * this._curConfig.nBigBlind : 0;
        this._curConfig.nPoolHands = this._curConfig.isHandNumLimit ? this._curConfig.nPoolHands : 0;
        this._curConfig.nPoolEntryRate = this._curConfig.isPoolRateLimit ? this._curConfig.nPoolEntryRate : 0;
        this._curConfig.nPoolEntryRateHands = this._curConfig.isPoolRateLimit ? this._curConfig.nPoolEntryRateHands : 0;
        let setPreBet = this.itemContent.getChildByName("setPreBet");
        this._curConfig.nPreAnte = setPreBet.active ? this._curConfig.nPreAnte : 0;
        let cheMaNode = this.itemContent.getChildByName("setCheMa");
        this._curConfig.nTabkeOutOdd = cheMaNode.active ? this._curConfig.nTabkeOutOdd : 0;
        this._curConfig.nLoseMaxAmount = this._curConfig.isCutLoss ? this._curConfig.nLoseMaxAmount : 0;
        this._curConfig.tDrawWaterMode.nModeType = this._curConfig.isCommission ? this._curConfig.tDrawWaterMode.nModeType : 0;
        this._curConfig.tDrawWaterMode.nTaxRate = this._curConfig.isCommission ? this._curConfig.tDrawWaterMode.nTaxRate : 0;
        let commissionBaChouNode = this.itemContent.getChildByName("setCommissionBaChou");

        this._curConfig.tDrawWaterMode.nBottomPool = commissionBaChouNode.active ? this._curConfig.tDrawWaterMode.nBottomPool : 0;
        this._curConfig.tDrawWaterMode.nTopLimitBB = commissionBaChouNode.active ? this._curConfig.tDrawWaterMode.nTopLimitBB : 0;
    },

    onCreateGame() {
        let strName = this.editRoomNameBox.string;
        if (strName == "") {
            // UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_ROOM_NAME"));
            // return;
            let name = UserInfo.getInfo().strNickName;
            let str = Utils.replaceAll(i18n.t("CLUB_HALL.CREATE_ROOM_NAME"), "XXX", name);
            strName = str;
        }

        // 如果去掉所有空白（包括普通空格、全角空格等）后为空，则视为全是空格
        if (strName.replace(/[\s\u3000]/g, '') === "") {
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_EMPTY"));
            return;
        }

        if (strName.length < 2 || strName.length > 10) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.ROOM_NAME_LEN"));
            return;
        }

        if (this.checkShield(strName)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.ROOM_NAME_ERROR"));
            return;
        }

        let password = this.passwordEditBox.string;
        if (this._curConfig.nIsPerson == 1) {
            if (password.length != 6) {
                UIFrame.showTips("请输入六位密码");
                return;
            }
        } else {
            password = "";
        }

        this.setToggleCreateData();
        this._curConfig.nGoldType = 1;
        let clubId = HallClubCacheData.getCurLoginClub();

        // this.autoStartPlayerNumIndex = num;this._gameConfig[this._curGameId].arrCapacityOption[i]
        let nSmallBlind = this._curConfig.nSmallBlind;
        let nBigBlind = this._curConfig.nBigBlind;
        let nPreAnte = this._curConfig.nPreAnte;
        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas && this._curConfig.bottomBetType == 0) {
            nSmallBlind = 0
            nBigBlind = 0
            nPreAnte = this._curConfig.nSmallBlind
        }

        this._curConfig.sTableName = Base64.encode(strName);

        let config = {
            nKeepTime: this._curConfig.nKeepTime,
            nGoldType: this._curConfig.nGoldType,
            sTableName: this._curConfig.sTableName,
            nIsShow: this._curConfig.nIsShow,
            nCapacity: this._curConfig.nCapacity,
            nSmallBlind: nSmallBlind,
            nBigBlind: nBigBlind,
            nTakeIn: this._curConfig.nTakeIn,
            nPreAnte: nPreAnte,
            tAutostart: this._curConfig.tAutostart,
            nMinTabkeInBB: this._curConfig.nMinTabkeInBB,
            nMaxTabkeInBB: this._curConfig.nMaxTabkeInBB,
            nPoolEntryRate: this._curConfig.nPoolEntryRate,
            nPoolEntryRateHands: this._curConfig.nPoolEntryRateHands,
            isOnlyPlayByIOS: this._curConfig.isOnlyPlayByIOS,
            isForceBlind: this._curConfig.isForceBlind,
            isGPSLimit: false,//this._curConfig.isGPSLimit,
            isIPLimit: false,//this._curConfig.isIPLimit,
            isAOF: this._curConfig.isAOF,
            isDelayLook: this._curConfig.isDelayLook,
            nInsureMode: 1,//this._curConfig.nInsureMode
            isTabkeOut: this._curConfig.isTabkeOut,
            isDPreAnte: this._curConfig.isDPreAnte,
            tDrawWaterMode: {
                nModeType: this._curConfig.tDrawWaterMode.nModeType,
                nComputeMode: 1,
                nTaxRate: this._curConfig.tDrawWaterMode.nTaxRate,
                isFreeBeforeFlop: this._curConfig.tDrawWaterMode.isFreeBeforeFlop,
                isHalf: this._curConfig.tDrawWaterMode.isHalf,
                tFreeConfig: {
                    isOpen: this._curConfig.tDrawWaterMode.tFreeConfig.isOpen,
                    nLimitBB: this._curConfig.tDrawWaterMode.tFreeConfig.nLimitBB,
                },
                nCutoffValue: this._curConfig.tDrawWaterMode.nCutoffValue,
                nLessValue: this._curConfig.tDrawWaterMode.nLessValue,
                nGreaterValue: this._curConfig.tDrawWaterMode.nGreaterValue,
            },
            nIsPerson: this._curConfig.nIsPerson,
            sPassWord: Base64.encode(password),
            nPoolHands: this._curConfig.nPoolHands,
            nTableCost: this._curConfig.nTableCost,
            nTabkeOutOdd: this._curConfig.nTabkeOutOdd,
            nLoseMaxAmount: this._curConfig.nLoseMaxAmount,
            nMutedUnSite: this._curConfig.nMutedUnSite,

            //额外参数
            isBuMa: this._curConfig.isBuMa,
            isCutLoss: this._curConfig.isCutLoss,
            isPreBet: this._curConfig.isPreBet,
            isPoolRateLimit: this._curConfig.isPoolRateLimit,
            isHandNumLimit: this._curConfig.isHandNumLimit,
            isCommission: this._curConfig.isCommission,
            isPayPublicCard: this._curConfig.isPayPublicCard,
            isPayCutCard: this._curConfig.isPayCutCard,
            isPayHandCard: this._curConfig.isPayHandCard,
            isVideoFee: this._curConfig.isVideoFee,
            CutLossNum: this._curConfig.CutLossNum,
            nGameId: this._curGameId,
            bottomBetType: this._curConfig.bottomBetType,
            nVideoFee: this._gameConfig[this._curGameId].nVideoFee || 0.002, //视频费
            preAnteOdd: this._curConfig.preAnteOdd,
            nTakeInLimit: this._curConfig.isBuMa ? (this._curConfig.BuMaNum ? Number(this._curConfig.BuMaNum) : 0) : 0
        }
        if(this._curConfig.tDrawWaterMode.nModeType == 1) {
            config.tDrawWaterMode.nTopLimitBB = this._curConfig.tDrawWaterMode.nTopLimitBB;
            config.tDrawWaterMode.nBottomPool = this._curConfig.tDrawWaterMode.nBottomPool;
        }
        //这里是创建以及修改模板逻辑
        if (this.isCreateTemplate) {
            config.gameId = this._curGameId;
            // config.nBigBlind = this._curConfig.nBigBlind;
            // config.nSmallBlind = this._curConfig.nSmallBlind;
            HallClubCacheData._gameTemplateConfig = LocalStorage.getItem("CLUB_CREATE_TEXAS_TABLE_TEMPLATE") || []
            if (this.tempIndex != null) {
                HallClubCacheData._gameTemplateConfig[this.tempIndex] = cc.instantiate(config);
            } else {
                HallClubCacheData._gameTemplateConfig.push(cc.instantiate(config));
            }
            LocalStorage.setItem("CLUB_CREATE_TEXAS_TABLE_TEMPLATE", HallClubCacheData._gameTemplateConfig)
            UIFrame.showTips("模板保存成功");
            MsgManager.fire(MSG.NOTIFY.UPDATE_ROOM_TEMPLATE);
            // this.onClickMyTemplate();
            this.onClose();

            return;
        }


        let params = {
            nClubId: clubId,
            nGameId: this._curGameId,
            sConfig: JSON.stringify(config),
        }

        cc.warn("[密码房] 创建桌 nIsPerson:", this._curConfig.nIsPerson, "|明文密码:", password, "|Base64后sPassWord:", config.sPassWord, "|sConfig预览:", JSON.stringify({nIsPerson: config.nIsPerson, sPassWord: config.sPassWord}));
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSOpenTableReq_CMD, params);
    },

    _onOpenTable(data) {
        if (data.nRlt == 0) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.CREATE_SUCCESS"));
            if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
                LocalStorage.setItem("CLUB_CREATE_TEXAS_TABLE", this._curConfig);
            } else {
                LocalStorage.setItem("CLUB_CREATE_TEXAS_TABLE" + this._curGameId, this._curConfig);
            }

            LocalStorage.setItem("CLUB_CREATE_TABEL_GAME_ID", this._curGameId);
            this.onClose();

        } else {
            UIFrame.showTips(i18n.t("CREATE_ROOM_ERROR." + data.nRlt));
        }
    },

    checkShield(str) {
        for (const key in this._shield) {
            if (str == this._shield[key].word) {
                return true;
            }
        }

        return false;
    },

    //计算滑动到那一格
    calculateProgress(slider, selIndex, len, callBack) {

        //判断是否存在
        let pro = slider.progress != null ? slider.progress : 1;
        let length = len;
        let total = (length - 1) * 2
        let perMark = Math.floor(1 / total * accuracy) / accuracy;
        if (selIndex) {
            slider.progress = Math.floor((selIndex - 1) * 2 * perMark * accuracy) / accuracy;
            pro = slider.progress;
        }
        let curMark = Math.floor(pro * accuracy) / accuracy;
        let index = Math.ceil(curMark / perMark);

        if (index >= total) {
            slider.progress = 1;
            callBack(1);
            return;
        }

        if (index % 2 != 0) {
            index = index - 1;
        }

        slider.progress = index * perMark;
        callBack(index * perMark);
    },

    onEditboxBegin(event, customEventData) {
        let index = Number(customEventData);
        let editbox = event;
        // if (index == 0){
        //     //房间名字
        //     editbox.getComponent(cc.EditBox).placeholderLabel.active = false;

        // }else if (index == 1){
        //     //房间密码


        // }
        if (editbox.string.length == 0) {
            editbox.placeholder = "";
        }

    },

    onEditboxChange(text, event, customEventData) {
        let index = Number(customEventData);
        let editbox = event;
        //房间名字
        if (editbox.string.length == 0) {
            editbox.placeholder = "";
        }
    },

    onEditboxBegin1(event, customEventData) {
        let index = Number(customEventData);
        let editbox = event;
        // if (index == 0){
        //     //房间名字
        //     editbox.getComponent(cc.EditBox).placeholderLabel.active = false;

        // }else if (index == 1){
        //     //房间密码


        // }
        if (editbox.string.length == 0) {
            editbox.placeholder = "";
        }

    },

    onEditboxChange1(text, event, customEventData) {
        let index = Number(customEventData);
        let editbox = event;
        //房间名字
        if (editbox.string.length == 0) {
            editbox.placeholder = "";
        }
    },

    onEditboxReturn(event, customEventData) {
        let index = Number(customEventData);
        let editbox = event;
        if (index == 0) {
            //房间名字
            this._curConfig.sTableName = editbox.string;
            if (editbox.string.length == 0) {
                editbox.placeholder = "请输入房间名字";
            }

        } else if (index == 1) {
            //房间密码
            this._curConfig.sPassWord = editbox.string;
            if (editbox.string.length == 0) {
                editbox.placeholder = "请输入六位密码";
            }
        }
    },

    onClickGame(event, data) {
        let index = Number(data);
        switch (index) {
            case 1:
                //德州
                this.setBtnSelected("btn_texas", clubGameConfig.CLUB_GAME_CONFIG.Texas);
                break;
            case 2:
                //奥马哈
                this.setBtnSelected("btn_omaha", clubGameConfig.CLUB_GAME_CONFIG.Omaha);
                break;
            case 3:
                //短牌
                this.setBtnSelected("btn_shortCard", clubGameConfig.CLUB_GAME_CONFIG.ShortTexas);
                break;
            case 4:
                //抢庄牛牛
                this.setBtnSelected("btn_niuniu_qiangzhuang", clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang);
                break;
        }
    },

    setBtnSelected(btn_name, gameid) {
        // let array = this.setGame.children;
        // array.forEach(e => {
        //     if(e.name==btn_name){
        //         this.setBtnStatus(e, true);
        //     }
        //     else{
        //         this.setBtnStatus(e, false);
        //     }
        // });

        this._curGameId = gameid;
        this.getGameParams(this._curGameId);
    },

    setBtnStatus(btn, isSelect) {
        let nor = btn.getChildByName("nor");
        let sel = btn.getChildByName("sel");

        nor.active = !isSelect;
        sel.active = isSelect;
    },

    onClickTip(Event, data) {
        let tipDataList = [
            {
                index: 1,
                title: "补码上限",
                content: "为防止筹码压制，可设置补码上限，开启后桌上筹码不得因买入而超过该上限。"
            },
            {
                index: 2,
                title: "止损上限",
                content: "当玩家在牌桌上输钱超过设定值时，将无法继续游戏。"
            },
            {
                index: 3,
                title: "强抓",
                content: "开启强制抓头时，默认强制1位玩家抓，牌桌至少有3位玩家时才会触发该功能。"
            },
            {
                isLeft: true,
                index: 4,
                title: "保险",
                content: "1.牌局中支持多家 All-in 触发保险，每个 Pot 牌型领先者可购买保险短牌超过4个人的 Pot 不会触发保险。\n2.超过14张0uts的情况不触发保险。\n3.造成玩家平分底池的补牌不会计入0uts。 \n4.玩家购买转牌保险时需要锁定钱包资金当玩家钱包余额不足时，会影响转牌保险触发。"
            },
            {
                isLeft: true,
                index: 5,
                title: "抽水",
                content: "1.提供2种抽水方式\n局抽：每局牌结束后从水上玩家盈利部分抽\n把抽：每手牌结束后针对收池抽\n2.Preflop 结束不抽水。\n3.如果一手牌中出现多个Pot，每个Pot独立计算抽水，比如起抽点及抽拥上限。"
            },
            {
                index: 6,
                title: "撤码",
                content: "支持将撤码阈值设为最小买入的N倍，超过该值的筹码支持从牌桌上撤码，但这部分筹码只能暂存直到结算为止。当玩家再次买入时，将优先使用这部分筹码。"
            },
            {
                index: 7,
                title: "触发抽水底池",
                content: "每手牌结束时，底池达到该值才触发抽水。"
            },
            {
                index: 8,
                title: "每手抽水封顶",
                content: "每手牌结束时，底池抽水的金额不能超过该值。"
            },
            {
                index: 9,
                title: "付费切牌",
                content: "支持玩家付费主动切牌，每手牌结束时优先付费申请切牌的玩家将获得下一手牌的主动切牌权。"
            },
            {
                index: 10,
                title: "延迟看牌",
                content: "为了一定程度防止伙牌，设置翻前轮到自己行动时才能看牌。"
            },
            {
                index: 11,
                title: "实时语音",
                // content: "开启实时语音后,每分钟以"+(this._gameConfig &&this._gameConfig[this._curGameId] && this._gameConfig[this._curGameId].nVideoFee || 0.002)+"USDT的价格收费。平台将以分钟为单位从您的资产账户中扣款,余额不足时将停止实时语音服务。"
                content: "启用实时语音功能后，玩家可在游戏中与同一房间的其他玩家进行实时语音沟通。",
            },
            {
                index: 12,
                title: "私人房",
                content: "开启私人房后，需要设置房间密码，任何进入房间的用户都需要输入正确的密码。"
            },
            {
                index: 13,
                title: "手数限制",
                content: "本房间需达到指定的有效手数方可入座；未达标的玩家无法坐下。"

            }
        ];

        let index = Number(data) - 1;
        console.log("data", data);
        console.log("index", index);
        let titleStr = tipDataList[index].title || "System";
        let contentTxtStr = tipDataList[index].content || "Error Code";

        let content = this.tipNode.getChildByName("contentLayer");
        let title = content.getChildByName("titleNode").getChildByName("title");
        title.getComponent(cc.Label).string = titleStr;
        // let scrContent = content.getChildByName("scrollViewNode").getChildByName("view").getChildByName("content");
        // let contentTxt = scrContent.getChildByName("text");
        let scrContent = content.getChildByName("content");
        let contentTxt = scrContent.getChildByName("text");
        let flagModeType = tipDataList[index].isLeft ? 0 : 1; // 1:居中 0:左对齐
        contentTxt.getComponent(cc.Label).horizontalAlign = flagModeType;
        contentTxt.getComponent(cc.Label).string = contentTxtStr;
        this.tipNode.active = true;
    },

    onClickCloseTip(Event) {
        this.tipNode.active = false;
    },


    onClickBottomSelectTip(Event, data) {
        let dataConfig = this.bottomSelectDataConfig[data]
        if (!dataConfig) {
            return
        }
        let defaultIndex = null

        let callBack = null;
        switch (data) {
            case "buMa":
                //补码
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.BuMaNum);
                callBack = (value) => {
                    this._curConfig.BuMaNum = value;
                    this.initBuMaNode();
                }
                break;
            case "cheMa":
                //撤码
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.nTabkeOutOdd);
                callBack = (value) => {
                    this._curConfig.nTabkeOutOdd = value;
                    this.initCheMaNode();
                }
                break;
            case "cutLoss":
                //止损
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.CutLossNum);
                callBack = (value) => {
                    this._curConfig.CutLossNum = value;
                    this.initCutLossNode();
                }
                break;
            case "poolRate":
                //入池
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.nPoolEntryRate);
                callBack = (value) => {
                    this._curConfig.nPoolEntryRate = value;
                    this.initPoolRateNode();
                }
                break;
            case "poolHandNumLimit":
                //X手
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.nPoolEntryRateHands);
                callBack = (value) => {
                    this._curConfig.nPoolEntryRateHands = value;
                    this.initPoolRateNode();
                }
                break;
            case "bottomPool":
                //抽水底池
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.tDrawWaterMode.nBottomPool);
                callBack = (value) => {
                    this._curConfig.tDrawWaterMode.nBottomPool = value;
                    this.initCommissionBaChouNode();
                }
                break;
            case "commissionLimitUp":
                //每手抽水封顶
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.tDrawWaterMode.nTopLimitBB);
                callBack = (value) => {
                    this._curConfig.tDrawWaterMode.nTopLimitBB = value;
                    this.initCommissionBaChouNode();
                }
                break;
            case "handNum":
                //每手抽水封顶
                defaultIndex = dataConfig.list.findIndex(e => e.title == this._curConfig.nPoolHands);
                callBack = (value) => {
                    this._curConfig.nPoolHands = value;
                    this.initHandNumLimitNode();
                }
                break;
        }
        this.initSelectTipUI(dataConfig, defaultIndex || dataConfig.defaultIndex, callBack);
    },


    initSelectTipUI(dataConfig, defaultIndex, callBack) {
        // flagStr
        let flagStr = dataConfig.flagStr || "";
        let data = dataConfig.list;
        let item = this.selectTipNode.getChildByName("item");
        let panel = this.selectTipNode.getChildByName("panel");
        panel.removeAllChildren();
        this.selectItemList = []; // 清空之前的列表
        for (let i = 0; i < data.length; i++) {
            let newItem = cc.instantiate(item);
            newItem.active = true;
            let title = newItem.getChildByName("title").getComponent(cc.Label);
            title.string = data[i].title + flagStr;
            if (i == 0) {
                title.string = data[i].title;
                newItem.getChildByName("title").color = new cc.Color(255, 255, 255);
            } else {
                // 添加点击事件
                title.string = data[i].title == -1 ? '无限制' : data[i].title + flagStr;
                newItem.on(cc.Node.EventType.TOUCH_END, this.onSelectTipItemClick.bind(this, { index: i, callBack: callBack, data: data[i].title }), this);
            }
            if (i == defaultIndex) {
                newItem.getChildByName("title").color = new cc.Color(0, 255, 0);
            }



            panel.addChild(newItem);
            this.selectItemList.push(newItem);
        }

        this.selectTipNode.active = true;
    },

    refreshSelectTipItems(selectIndex) {
        for (let i = 0; i < this.selectItemList.length; i++) {
            let title = this.selectItemList[i].getChildByName("title").getComponent(cc.Label);
            if (i == 0) {
                // 标题行保持白色
                title.color = new cc.Color(255, 255, 255);
            } else if (i == selectIndex) {
                // 选中项为绿色
                title.color = new cc.Color(0, 255, 0);
            } else {
                // 其他项为默认颜色（假设为白色或灰色）
                title.color = new cc.Color(255, 255, 255);
            }
        }
    },

    onClickBottomSelectCloseTip() {
        this.selectTipNode.active = false;
    },

    // 处理选择项点击事件
    onSelectTipItemClick(data) {
        let index = data.index;
        let callBack = data.callBack;
        let value = data.data;
        if (callBack) {
            callBack(value);
        }
        // 更新选中状态
        this.refreshSelectTipItems(index);

        // 可以在这里添加选中后的逻辑
        console.log("选中项索引:", index);
        // 如果点击的是标题行（index 0），不做处理
        if (index === 0) {
            return;
        }

        // 更新选中状态
        this.refreshSelectTipItems(index);

        // 可以在这里添加选中后的逻辑
        console.log("选中项索引:", index);

        // 延迟关闭面板，让用户看到选中效果
        this.scheduleOnce(() => {
            this.onClickBottomSelectCloseTip();
        }, 0.1);
    },
    //点击创建牌桌按钮
    onClickMyTemplate() {
        // 
        let prefab = this.prefab_template;
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            this.templateNode = node;
        }
    },

    getAddNode() {
        return this.node.parent.parent.getChildByName("popup");
    },


});
