let i18n = require("i18n");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let DynamicListView = require("DynamicListView");
let TAG = "club_main";
let UserInfo = require("UserInfo");
let HallClubLogic = require("HallClubLogic");
let AppWebApi = require("AppWebApi");
var HallClubJoin = require("HallClubJoin");

cc.Class({
    extends: cc.Component,

    properties: {
        clubName: cc.Label,
        clubID: cc.Label,
        label_totalProperty: cc.Label,
        label_profit: cc.Label,
        label_todayProfit: cc.Label,
        label_clubMoney: cc.Label,
        label_stockCount: cc.Label,
        label_untreatedCount: cc.Label,
        modules: cc.Node,

        content: cc.Node,
        noClub: cc.Node,
        scrollview: cc.ScrollView,
        mask: cc.Node,
        scContent: cc.Node,

        property: cc.Node,
        clubMoney: cc.Node,
        btn_bg: cc.Node,

        itemList: {
            default: [],
            type: cc.Node,
        },
        itemListPos: {
            default: [],
            type: cc.Node,
        },

        moreMenu: cc.Node,
        up: cc.Node,
        down: cc.Node,

        prefabSecurityPsw: cc.Prefab,

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

        _prefabs: [],
    },

    onLoad () {
        app.util.addClickSoundToNode(this.node);
        this._hideCreateClubBtn();
    },

    start () {
        this._hasStarted = true;
        if (!this._initCalledInStart) {
            this._initCalledInStart = true;
            this.init();
        }
        this.register();
    },

    register(){
        MsgManager.on(MSG.NOTIFY.ClubSSceneChangeNotify_ui, this._onSceneChangeNotify, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, this._onUserInfoChangeNotify, this);
        MsgManager.on(MSG.NOTIFY.SET_SECURITY_PSW, this._onSetSecurityPsw, this);
        MsgManager.on(MSG.NOTIFY.ClubSLogOnResp_ui, this._onClubLoginStateChanged, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetUserClubListResp_ui, this._onClubListStateChanged, this);
    },

    unRegister(){
        MsgManager.un(this._onSceneChangeNotify);
        MsgManager.un(this._onUserInfoChangeNotify);
        MsgManager.un(this._onSetSecurityPsw);
        MsgManager.un(this._onClubLoginStateChanged);
        MsgManager.un(this._onClubListStateChanged);
    },

    onEnable() {
        this._clubPageVisible = true;
        this._initEntryLock = 0;
    },

    onDisable() {
        this._clubPageVisible = false;
        try { this._destroyRecommendContainer(); } catch (e) {}
        if (this._inviteCodeDialogNode && cc.isValid(this._inviteCodeDialogNode)) {
            this._inviteCodeDialogNode.destroy();
        }
        this._inviteCodeDialogNode = null;
    },

    onDestroy() {
        if (this._inviteCodeDialogNode && cc.isValid(this._inviteCodeDialogNode)) {
            this._inviteCodeDialogNode.destroy();
        }
        this._inviteCodeDialogNode = null;
        this._joinClubSubmitting = false;
        try { this._destroyRecommendContainer(); } catch (e) {}
        this.unRegister();
    },

    onClickBg(){
        if (this._isShowMoreMenu){
            this.onClickShowMoreMenu();
        }

        this.btn_bg.active = false;
    },

    init(){
        QYLogs.log(TAG, "[init] 开始，触发 initClubUI...");
        this._initEntryLock = (this._initEntryLock || 0) + 1;
        let checkProp = () => {
            let list = ["content","noClub","modules","clubMoney","property","itemList","itemListPos","clubID","btn_bg"];
            let notReady = [];
            for (let i = 0; i < list.length; i++) {
                let key = list[i];
                if (key === "clubID") {
                    if (!this.clubID || !this.clubID.node) notReady.push(key);
                } else {
                    if (!this[key]) notReady.push(key);
                }
            }
            return notReady;
        };
        let initOnce = (src) => {
            QYLogs.log(TAG, "[init] --- initOnce src=" + src + " ---");
            try {
                if (!this.menuScview && this.menuScrollview && this.menuScrollview.node && this.menuMask && this.menuItmeContent && this.menuItem){
                    try { this.initList(); } catch (e) {}
                }
            } catch (e) {}
            try {
                this.clubList = HallClubCacheData.getClubList();
            } catch (e) {}
            try { this._fetchMyClubInfoAndInitUI(src); } catch (e) {
                QYLogs.error(TAG, "[init] _fetchMyClubInfoAndInitUI 异常: " + e.message);
                try { this.initClubUI(); } catch (e2) {}
            }
            try {
                if (this.menuScview) this.updateMenu(this.clubList);
            } catch (e) {}
        };
        let notReady = checkProp();
        if (notReady.length === 0) {
            initOnce("instant");
        }
        let retries = [0, 0.1, 0.25, 0.5];
        for (let i = 0; i < retries.length; i++) {
            let t = retries[i];
            this.scheduleOnce(() => {
                if (!cc.isValid(this.node) || this._clubPageVisible === false || !this.node.activeInHierarchy) return;
                let nr = checkProp();
                if (nr.length === 0 || i === retries.length - 1) {
                    this._cleanAllPlaceholdersDeep(this.node);
                    initOnce("retry_t" + (t*1000).toFixed(0));
                }
            }, t);
        }
        this.scheduleOnce(() => {
            if (!cc.isValid(this.node) || this._clubPageVisible === false || !this.node.activeInHierarchy) return;
            let wsCount = HallClubLogic.getClubCount();
            let inClubByHttp = (this._myClubInfoParsed && (this._myClubInfoParsed.state === "club" || this._myClubInfoParsed.inClub === true));
            if (this.node.activeInHierarchy && !this._myClubInfoLoading && wsCount == 0 && !inClubByHttp && (!this._recommendListData || this._recommendListData.length == 0)) {
                try { this._ensureRecommendListContainer(); } catch (e) {}
                try { this._requestRecommendClubList(); } catch (e) {}
            }
        }, 0.85);
    },

    _isInPrivateClub() {
        try {
            if (HallClubLogic.getClubCount() > 0) return true;
            if (this._myClubInfoParsed && (this._myClubInfoParsed.state === "club" || this._myClubInfoParsed.inClub === true)) return true;
            var loginClubId = HallClubCacheData.getCurLoginClub();
            if (loginClubId && Number(loginClubId) >= 1000000) return true;
            var clubData = HallClubCacheData.getCurClubData();
            if (clubData && Number(clubData.nClubId) >= 1000000) return true;
        } catch (e) {}
        return false;
    },

    _onClubLoginStateChanged(data) {
        if (!data || data.nRlt != 0 || !data.tScence || Number(data.tScence.nClubId) < 1000000) return;
        this._myClubInfoParsed = {
            state: "club",
            inClub: true,
            club: data.tScence
        };
        try { this._destroyRecommendContainer(); } catch (e) {}
        if (this._clubPageVisible !== false && this.node.activeInHierarchy) {
            try { this.initClubUI(); } catch (e) {}
        }
    },

    _onClubListStateChanged(data) {
        this.clubList = data && data.arrClub ? data.arrClub : HallClubCacheData.getClubList();
        if (!this._isInPrivateClub()) return;
        try { this._destroyRecommendContainer(); } catch (e) {}
        if (this._clubPageVisible !== false && this.node.activeInHierarchy) {
            try { this.updateMenu(this.clubList); } catch (e) {}
            try { this.initClubUI(); } catch (e) {}
        }
    },

    _fetchMyClubInfoAndInitUI(src){
        let wsCount = HallClubLogic.getClubCount();
        if (wsCount > 0) {
            QYLogs.log(TAG, "[_fetchMyClubInfoAndInitUI] WS clubCount=" + wsCount + " > 0, 直接走 initClubUI");
            try { this._destroyRecommendContainer(); } catch (e) {}
            this.initClubUI();
            return;
        }
        if (this._myClubInfoParsed) {
            this.initClubUI();
            return;
        }
        if (this._myClubInfoLoading) return;
        this._myClubInfoLoading = true;
        QYLogs.log(TAG, "[_fetchMyClubInfoAndInitUI] WS clubCount=0, 先通过 getMyClubInfo 判断是否在私人俱乐部...");
        let fallbackInit = () => {
            this._myClubInfoLoading = false;
            try { this.initClubUI(); } catch (e) {}
        };
        try {
            AppWebApi.getMyClubInfo((err, resp) => {
                this._myClubInfoLoading = false;
                if (!cc.isValid(this.node)) return;
                if (err) {
                    QYLogs.warn(TAG, "[_fetchMyClubInfoAndInitUI] getMyClubInfo err, 降级 initClubUI: " + (err.errorMessage || err.status));
                    fallbackInit();
                    return;
                }
                if (!resp) {
                    QYLogs.warn(TAG, "[_fetchMyClubInfoAndInitUI] getMyClubInfo 返回空, 降级 initClubUI");
                    fallbackInit();
                    return;
                }
                if (resp.code !== 0) {
                    QYLogs.warn(TAG, "[_fetchMyClubInfoAndInitUI] getMyClubInfo code=" + (resp.code||"null") + " msg=" + (resp.msg||"") + " 降级 initClubUI");
                    fallbackInit();
                    return;
                }
                let parsed = HallClubCacheData.mapMyClubInfoRsp(resp);
                this._myClubInfoParsed = parsed;
                QYLogs.log(TAG, "[_fetchMyClubInfoAndInitUI] getMyClubInfo 解析结果 state=" + (parsed.state||"") + " inClub=" + (parsed.inClub||false) + " hallId=" + (parsed.hallId||0) + " clubId=" + (parsed.club && parsed.club.nClubId ? parsed.club.nClubId : "null"));
                if (parsed.state === "club" && parsed.inClub === true && parsed.club && parsed.club.nClubId > 0) {
                    QYLogs.log(TAG, "[_fetchMyClubInfoAndInitUI] HTTP 确认已入会 clubId=" + parsed.club.nClubId + "，直接渲染俱乐部信息");
                    try { this._destroyRecommendContainer(); } catch (e) {}
                    if (this._clubPageVisible !== false && this.node.activeInHierarchy) this.initClubUI();
                    return;
                }
                if (parsed.state === "hall") {
                    QYLogs.log(TAG, "[_fetchMyClubInfoAndInitUI] state=hall 仅在大厅，进入推荐列表分支");
                } else if (parsed.state === "none") {
                    QYLogs.log(TAG, "[_fetchMyClubInfoAndInitUI] state=none 无俱乐部记录，进入推荐列表分支");
                }
                this.initClubUI();
            });
        } catch (e) {
            QYLogs.error(TAG, "[_fetchMyClubInfoAndInitUI] 调用异常: " + e.message);
            fallbackInit();
        }
    },

    initClubUI(){
        QYLogs.log(TAG, "[initClubUI] 开始 count=" + HallClubLogic.getClubCount());
        let winSize = null;
        try { winSize = cc.director.getWinSize(); } catch (e) {}
        if (!winSize) winSize = { width: 750, height: 1334 };
        let topBg = null;
        try {
            if (this.node && this.node.getChildByName) {
                let root = this.node.getChildByName("root");
                topBg = root ? root.getChildByName("topBg") : null;
                if (!topBg) {
                    let fromNode = this.node.getChildByName("topBg");
                    if (fromNode) topBg = fromNode;
                }
            }
        } catch (e) {}
        let count = HallClubLogic.getClubCount();
        var inPrivateClub = this._isInPrivateClub();
        if (count == 0 && !inPrivateClub){
            try { this._destroyMyClubPanel(); } catch (e) {}
            if (this._myClubInfoLoading) {
                try { this._destroyRecommendContainer(); } catch (e) {}
                return;
            }
            try { if (this.content && this.content.active) this.content.active = false; } catch (e) {}
            try { if (this.scContent && this.scContent.active) this.scContent.active = false; } catch (e) {}
            try { if (this.noClub && this.noClub.active) this.noClub.active = false; } catch (e) {}
            try { if (topBg) topBg.active = false; } catch (e) {}
            try { if (this.modules && this.modules.active) this.modules.active = false; } catch (e) {}
            try { if (this.clubID && this.clubID.node && this.clubID.node.active) this.clubID.node.active = false; } catch (e) {}
            try { if (this.property && this.property.active) this.property.active = false; } catch (e) {}
            try { if (this.clubMoney && this.clubMoney.active) this.clubMoney.active = false; } catch (e) {}
            try { if (this.btn_bg && this.btn_bg.active) this.btn_bg.active = false; } catch (e) {}
            try { this._cleanAllPlaceholdersDeep(this.node); } catch (e) {}
            QYLogs.log(TAG, "[initClubUI] count=0，**V5：关闭所有原生容器节点**，强制直接挂 Canvas 绝对坐标（规避预制体未知结构导致白屏）");
            try { this._ensureRecommendListContainer(); } catch (e) {}
            try {
                if (!this._recommendListData || this._recommendListData.length === 0) {
                    this._requestRecommendClubList();
                } else {
                    QYLogs.log(TAG, "[initClubUI] 已有缓存推荐列表数据 " + this._recommendListData.length + " 条，直接复用渲染");
                    this._renderRecommendList(this._recommendListData);
                }
            } catch (e) {}
        }else{
            try { this._destroyRecommendContainer(); } catch (e) {}
            if (this.content) { try { this.content.active = false; } catch (e) {} }
            if (this.scContent) { try { this.scContent.active = false; } catch (e) {} }
            if (this.noClub) { try { this.noClub.active = false; } catch (e) {} }
            if (topBg) { try { topBg.active = false; } catch (e) {} }
            if (this.modules) { try { this.modules.active = true; } catch (e) {} }
            if (this.clubID && this.clubID.node) { try { this.clubID.node.active = true; } catch (e) {} }
            if (this.property) { try { this.property.active = true; } catch (e) {} }
            if (this.clubMoney) { try { this.clubMoney.active = true; } catch (e) {} }
            this.clubData = HallClubCacheData.getCurClubData();
            if ((!this.clubData || !this.clubData.nClubId) && this._myClubInfoParsed && this._myClubInfoParsed.club) {
                this.clubData = this._myClubInfoParsed.club;
            }
            try { this.setClubInfo(this.clubData); } catch (e) {}
            try { this._renderMyClubInfoPanel(this.clubData); } catch (e) {}
            try { this.updateUntreatedCount(); } catch (e) {}
            try { this.hideMenu(); } catch (e) {}
        }
    },

    hideMenu(){
        let panel_item =  this.content.getChildByName("panel_item");
        let itemBg = panel_item.getChildByName("bg");

        if (!this._itemPosList){
            this._itemPosList = [];
            for (let i = 0; i < this.itemListPos.length; i++) {
                let widget = this.itemListPos[i].getComponent(cc.Widget);
                widget.updateAlignment();
                let pos = {x: 0, y: 0};
                pos.x = this.itemListPos[i].x;
                pos.y = this.itemListPos[i].y;
                this._itemPosList.push(pos)
            }
        }

        let height = this.itemListPos[0].height;
        let showItemArray = [];
        for (let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].active = true;
            this.itemList[i].x = this._itemPosList[i].x;
            this.itemList[i].y = this._itemPosList[i].y;
            showItemArray.push(this.itemList[i]);
        }
        itemBg.height = height * Math.ceil(this.itemList.length/3);

        let bg1 = this.clubMoney.getChildByName("bg1");
        let bg2 = this.clubMoney.getChildByName("bg2");
        bg1.active = true;
        bg2.active = false;
        this.property.active = true;

        if (HallClubLogic.isClubCreator()){
            return;
        }

        let hideItemArray = [];
        hideItemArray.push(this.itemList[3]);
        hideItemArray.push(this.itemList[6]);
        hideItemArray.push(this.itemList[7]);

        if (HallClubLogic.isClubManager()){
            if (!HallClubLogic.isCanManageMember() && !HallClubLogic.isCanManageMoney()){
                hideItemArray.push(this.itemList[5]);
            }

            if (!HallClubLogic.isCanManageMember()){
                hideItemArray.push(this.itemList[8]);
            }
        }else{
            this.property.active = false;
    
            hideItemArray.push(this.itemList[5]);
            hideItemArray.push(this.itemList[4]);
            hideItemArray.push(this.itemList[8]);
           
            bg1.active = false;
            bg2.active = true;
        }

        for (let j = 0; j < hideItemArray.length; j++) {
            hideItemArray[j].active = false;
        }

        for (let i = showItemArray.length - 1; i >= 0; i--) {
            for (let j = 0; j < hideItemArray.length; j++) {
                if (showItemArray[i] == hideItemArray[j]){
                    showItemArray.splice(i, 1);
                    break;
                }
            }
        }

        for (let i = 0; i < showItemArray.length; i++) {
            showItemArray[i].x = this._itemPosList[i].x;
            showItemArray[i].y = this._itemPosList[i].y;
        }

        let cHeight = height * Math.ceil(showItemArray.length/3);
        itemBg.height = cHeight;
    },

    setClubInfo(data){
        if (!data) return;

        var clubNameText = data._clubNamePlain || data.ClubName || data.clubName || "";
        if (!clubNameText && data.sClubName) {
            if (HallClubCacheData._looksLikeBase64Encoded(data.sClubName)) {
                clubNameText = HallClubCacheData.safeDecodeBase64(data.sClubName) || data.sClubName;
            } else {
                clubNameText = data.sClubName;
            }
        }
        if (this.clubName && clubNameText) this.clubName.string = clubNameText;
        if (this.clubID) this.clubID.string = i18n.t("CLUB_HALL.ID") + (data.nClubId || data.ClubId || "");

        if (data.tMyself) {
            this.label_totalProperty.string = Utils.convertNumberToStr(data.nClubGold);
            this.label_profit.string = data.nIncome;
            this.label_todayProfit.string = data.nTodayIncome;
            this.label_clubMoney.string = Utils.convertNumberToStr(data.tMyself.nClubGold);
        }

        if (this.clubName && this.clubName.node) {
            this.clubName.node.stopAllActions();
            this.clubName._forceUpdateRenderData(true);
            MsgManager.fire(MSG.NOTIFY.LABEL_RUN_ACTION, this.clubName.node);
        }
    },

    updateStockCount(count){
        this.label_stockCount.string = count;
    },

    updateUntreatedCount(){
        let count = HallClubLogic.getUnTreatedApplyCount();
        this.label_untreatedCount.string = count;
        if (count > 99){
            this.label_untreatedCount.string = "99+";
        }
        if(count == 0){
            this.label_untreatedCount.node.parent.active = false;
        }else{
            this.label_untreatedCount.node.parent.active = true;
        }
    },

    onClickCreateClub(){
        let prefabName = "HallCreateClub";

        let callBack = function(){
            let node = cc.instantiate(this._prefabs[prefabName]);
            this.getAddNode().addChild(node);
        }.bind(this);
        
        let wrapper = app.ClubViews;
        let path = prefabName;
        path = wrapper.path(path,null,"main-hall/resources/prefab/");
        
        this.loadUI(path, prefabName, callBack);
    },

    onClickSearchClub(){
        let prefabName = "HallClubSearch";

        let callBack = function(){
            let node = cc.instantiate(this._prefabs[prefabName]);
            this.getAddNode().addChild(node);
        }.bind(this);
        
        let wrapper = app.ClubViews;
        let path = prefabName;
        path = wrapper.path(path,null,"main-hall/resources/prefab/");
        
        this.loadUI(path, prefabName, callBack);
    },

    onClickAddClubMoney(){
        let params = {
            sName: this.clubData.tMyself.sName,
            nVip: this.clubData.nVip,
            sConName: this.clubData.tMasterInfo.sName,
            nClubGold: this.clubData.tMyself.nClubGold,
            sFaceId: this.clubData.tMyself.sFaceId,
            nUserId: this.clubData.tMyself.nUserId,
            sConFaceId: this.clubData.tMasterInfo.sFaceId,

        }
        this.loadPrefab("HallClubChangeMoney", params, true);
    },

    onClickGiveBackClubMoney(){
        let params = {
            sName: this.clubData.tMyself.sName,
            nVip: this.clubData.nVip,
            sConName: this.clubData.tMasterInfo.sName,
            nClubGold: this.clubData.tMyself.nClubGold,
            sFaceId: this.clubData.tMyself.sFaceId,
            nUserId: this.clubData.tMyself.nUserId,
            sConFaceId: this.clubData.tMasterInfo.sFaceId,

        }
        this.loadPrefab("HallClubChangeMoney", params, false);
    },

    onClickMoneyRecord(){
        this.loadPrefab("HallClubMoneyRecord");
    },

    onClickItem(event, data){
        let num = Number(data);
        if (num == 0){
            this.loadPrefab("HallClubPersonalApply");
        }else if (num == 1){
            this.loadPrefab("HallClubMember");
        }else if (num == 2){
            this.loadPrefab("HallClubBlacklist");
        }else if (num == 3){
            this.loadPrefab("HallClubRecord");
        }else if (num == 4){
            this.loadPrefab("HallClubManage");
        }else if (num == 5){
            this.loadPrefab("HallClubStock");
        }else if (num == 6){
            this.loadPrefab("HallClubUntreatedApply");
        }else if (num == 7){
            this.loadPrefab("HallClubRights");
        }else if (num == 8){
            this.loadPrefab("HallClubProfitRecord");
        }else if (num == 9){
            this.loadPrefab("HallClubInvite");
        }
    },


    loadPrefab(prefabName, data, isAdd){
        let callBack = function(){
            let node = cc.instantiate(this._prefabs[prefabName]);
            this.getAddNode().addChild(node);
            let component = node.getComponent(prefabName);
            if (component && component.init){
                component.init(data, isAdd)
            }
        }.bind(this);
        
        let wrapper = app.ClubViews;
        let path = prefabName;
        path = wrapper.path(path,null,"main-hall/resources/prefab/");
        
        this.loadUI(path, prefabName, callBack);
    },

    loadUI(path, name, callBack){
        if (this._prefabs[name]){
            if(callBack){
                callBack();
            }

            return;
        }

        app.ClubViews.bundle.load(path,cc.Prefab,function (error, prefab){
            if(!error && cc.isValid(this)){
                this._prefabs[name] = prefab;
                if(callBack){
                    callBack();
                }
            }else{
            }
            
        }.bind(this))
    },

    getAddNode(){
        return this.node.parent.parent.getChildByName("popup");
    },

    closeUI(){
        this.getAddNode().destroy();
    },


    _onSceneChangeNotify(data){
        this.updateUntreatedCount();
        this.clubData = HallClubCacheData.getCurClubData();
        this.setClubInfo(this.clubData);
        this.clubList = HallClubCacheData.getClubList();
        this.updateMenu(this.clubList)
    },

    _onUserInfoChangeNotify(data){
        this.clubData = HallClubCacheData.getCurClubData();
        this.setClubInfo(this.clubData);

        if (data.hasOwnProperty("nIdentify") || data.hasOwnProperty("sPower")){
            if (data.nIdentify == 20){
                UIFrame.showTips(i18n.t("CLUB_HALL_TIP.KICK_ADMIN"));
            }else if (data.nIdentify == 10){
                UIFrame.showTips(i18n.t("CLUB_HALL_TIP.BECOME_ADMIN"));
            }

            this.init();
        }
    },

    updateMenu(data){
        if (!data){
            data = [];
        }

        let tmpData = Utils.clone(data);
        let len = tmpData.length;
        for (let i = 0; i < tmpData.length; i++) {
            if (tmpData[i].nClubId == 0){
                tmpData.splice(i,1);
                break;
            }
            
        }
        
        if (len > 5){
            len = 5
        }

        if (!this.menuScview || !this.menuScrollview || !this.menuScrollview.node || !this.menuItem) {
            let currentClubData = HallClubCacheData.getCurClubData();
            if (currentClubData && currentClubData.sClubName) {
                this.updateModuleName(currentClubData.sClubName);
            }
            return;
        }

        let item = cc.instantiate(this.menuItem)
        let height = item.height;
        this.menuScview.reset_size(this.menuScrollview.node.width, height * len)

        this.updateMenuScrollView(tmpData);
        let clubData = HallClubCacheData.getCurClubData();
        if (clubData){
            this.updateModuleName(clubData.sClubName);
        }
    },

    updateMenuScrollView(listData) {
        let dataArr = listData;
        let allData = [];
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(Data);
        }
     
        this.menuScview.set_data(allData);
    },

    initList() {
        if (!this.menuScrollview || !this.menuScrollview.node || !this.menuMask || !this.menuItmeContent || !this.menuItem) {
            QYLogs.warn(TAG, "[initList] 菜单节点未绑定，跳过 DynamicListView 初始化");
            return false;
        }
        this.menuScview = new DynamicListView({
            scrollview: this.menuScrollview,
            mask: this.menuMask,
            content: this.menuItmeContent,
            item_templates:  [
                { key: "item1", node: this.menuItem },
            ],
            cb_host: this,
            item_setter: this.item_setter,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            direction: 1,
        });
        return true;
    },

    item_setter(node, key, data, index) {
        let label_name = node.getChildByName("mask").getChildByName("label_name").getComponent(cc.Label);
        if (label_name){
            label_name.string = data.sClubName;
            let icon = node.getChildByName("icon").getComponent(cc.Sprite);
            if (icon){
                let tag = 0;
                if (data.nClubId != 0){
                    tag = 1;
                }
                icon.spriteFrame = this.iconList[tag]
            }
        }

        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickMenuItem(data);
         }.bind(this))

        label_name.node.stopAllActions();
        label_name._forceUpdateRenderData(true);
        MsgManager.fire(MSG.NOTIFY.LABEL_RUN_ACTION, label_name.node);

        return [node.width, node.height];
    },

    onClickMenuItem(data){
        this.onClickShowMoreMenu();
        this._curClubId = data.nClubId;
        let loginId= HallClubCacheData.getCurLoginClub();
        if(loginId == this._curClubId){
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

    onClickShowMoreMenu(event){
        if (this._isShowMoreMenu){
            this.moreMenu.active = false;
            this.up.active = false;
            this.down.active = true;
            this.btn_bg.active = false;
        }else{
            this.moreMenu.active = true;
            this.up.active = true;
            this.down.active = false;
            this.btn_bg.active = true;
        }

        this._isShowMoreMenu = !this._isShowMoreMenu;
    },

    updateModuleName(name){
        if (!this.clubName || !this.clubName.node || !cc.isValid(this.clubName.node)) return;
        this.clubName.string = name || "";
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
            }
        }
    },

    addSecurityPswPanel() {
        let node = cc.instantiate(this.prefabSecurityPsw);
        this.getAddNode().addChild(node, 1024);
        return node;
    },

    _cleanAllPlaceholdersDeep(rootNode) {
        if (!rootNode) return;
        let hitCount = 0;
        let stack = [rootNode];
        let visited = new Set();
        let whiteListLower = {
            "content": true, "noclub": true, "modules": true, "clubid": true, "clubname": true, "topbg": true,
            "root": true, "btn_bg": true, "btn_showmoremenu": true, "btn_clubid": true, "moremenu": true,
            "btn_search": true, "search": true, "btn_club_list": true, "btns": true, "title": true,
            "_rest_club_list_": true, "_rest_list_title_": true, "_rest_list_scroll_": true,
            "_rest_list_mask_": true, "_rest_list_content_": true, "_rest_loading_": true,
            "_rest_list_plain_": true, "_rest_club_list_fallback_": true, "_rest_empty_": true
        };
        let isWhiteListed = function(node) {
            if (!node || !node.name) return false;
            let n = String(node.name).toLowerCase().replace(/_/g, "");
            if (whiteListLower[n]) return true;
            if (n.indexOf("_rest_card_") === 0 || n.indexOf("btn_join") === 0) return true;
            if (n.indexOf("club_") === 0 && (n.indexOf("name") === n.length - 4 || n.indexOf("id") === n.length - 2 || n.indexOf("master") === n.length - 6 || n.indexOf("cnt") === n.length - 3)) return true;
            return false;
        };
        let containsPlaceHolderText = function(s) {
            if (!s) return false;
            s = String(s).replace(/\s+/g, "");
            if (!s || s.length === 0) return false;
            if (s.indexOf("敬请期待") >= 0) return true;
            if (s.indexOf("敬请关注") >= 0) return true;
            if (/^敬请.{0,10}$/.test(s)) return true;
            if (s.indexOf("comingsoon") >= 0 || s.indexOf("COMINGSOON") >= 0) return true;
            if (s.indexOf("functiondeveloping") >= 0) return true;
            if (s.indexOf("尚未加入俱乐部") >= 0) return true;
            if (s.indexOf("还未加入俱乐部") >= 0) return true;
            if (s.indexOf("还没有加入俱乐部") >= 0) return true;
            if (s.indexOf("未加入俱乐部") >= 0 && s.length <= 12) return true;
            if (s.indexOf("nothasjoin") >= 0) return true;
            if (s.indexOf("NOT_HAS_JOIN") >= 0) return true;
            return false;
        };
        while (stack.length > 0) {
            let cur = stack.pop();
            if (!cur || visited.has(cur)) continue;
            try { visited.add(cur); } catch (e) {}
            if (isWhiteListed(cur)) {
                try {
                    if (cur.children && cur.children.length > 0) {
                        for (let i = cur.children.length - 1; i >= 0; i--) stack.push(cur.children[i]);
                    }
                } catch (e) {}
                continue;
            }
            let hit = false;
            try {
                let name = (cur.name || "");
                let lname = name.toLowerCase();
                let labelComp = null;
                try { labelComp = cur.getComponent(cc.Label); } catch (e) {}
                let sprComp = null;
                try { sprComp = cur.getComponent(cc.Sprite); } catch (e) {}
                let childCount = cur.children ? cur.children.length : 0;
                if (containsPlaceHolderText(name)) hit = true;
                if (!hit && lname === "sp") hit = true;
                if (!hit && (lname === "newlabel" || lname === "new_label")) hit = true;
                if (!hit && (lname.indexOf("placeholder") >= 0 || lname.indexOf("empty_icon") >= 0 || lname.indexOf("unenter") >= 0)) {
                    if (labelComp || sprComp || (!cur.children || cur.children.length <= 1)) hit = true;
                }
                if (!hit && lname === "icon" && childCount <= 1) hit = true;
                if (!hit && labelComp) {
                    let s = labelComp.string || "";
                    if (containsPlaceHolderText(s)) hit = true;
                }
            } catch (e) {}
            if (hit) {
                cur.active = false;
                hitCount++;
                continue;
            }
            try {
                if (cur.children && cur.children.length > 0) {
                    for (let i = cur.children.length - 1; i >= 0; i--) {
                        stack.push(cur.children[i]);
                    }
                }
            } catch (e) {}
        }
    },

    _destroyMyClubPanel() {
        var panel = this._myClubPanel;
        if (!panel && this.node) panel = this.node.getChildByName("_my_club_panel_");
        if (panel && cc.isValid(panel)) {
            panel.active = false;
            panel.destroy();
        }
        this._myClubPanel = null;
    },

    _renderMyClubInfoPanel(data) {
        if (!data || !this.node || !this.node.activeInHierarchy) return;
        this._destroyMyClubPanel();

        var winSize = cc.director.getWinSize();
        var parentW = this.node.width || winSize.width || 750;
        var parentH = this.node.height || winSize.height || 1334;
        var panelW = Math.min((winSize.width || parentW) - 48, 820);
        var panelH = 520;
        var panel = new cc.Node("_my_club_panel_");
        panel.setAnchorPoint(0.5, 0.5);
        panel.setContentSize(panelW, panelH);
        panel.setPosition(0, parentH / 2 - 240 - panelH / 2);
        this.node.addChild(panel, 100);
        this._myClubPanel = panel;

        var bg = panel.addComponent(cc.Graphics);
        bg.fillColor = cc.color(24, 30, 48, 255);
        this._drawRoundedRect(bg, -panelW / 2, -panelH / 2, panelW, panelH, 24);
        bg.fill();
        bg.strokeColor = cc.color(40, 50, 76, 255);
        bg.lineWidth = 2;
        this._drawRoundedRect(bg, -panelW / 2 + 1, -panelH / 2 + 1, panelW - 2, panelH - 2, 24);
        bg.stroke();

        var createLabel = function(parent, name, text, size, color, x, y, width, align) {
            var node = new cc.Node(name);
            var anchorX = 0;
            if (align === cc.Label.HorizontalAlign.RIGHT) anchorX = 1;
            if (align === cc.Label.HorizontalAlign.CENTER) anchorX = 0.5;
            node.setAnchorPoint(anchorX, 0.5);
            node.setPosition(x, y);
            node.setContentSize(width, size + 16);
            var label = node.addComponent(cc.Label);
            label.string = text || "";
            label.fontSize = size;
            label.lineHeight = size + 8;
            label.horizontalAlign = align || cc.Label.HorizontalAlign.LEFT;
            label.verticalAlign = cc.Label.VerticalAlign.CENTER;
            node.color = color;
            parent.addChild(node);
            return label;
        };

        var left = -panelW / 2 + 38;
        var right = panelW / 2 - 38;
        var avatar = new cc.Node("_my_club_avatar_");
        avatar.setAnchorPoint(0.5, 0.5);
        avatar.setContentSize(100, 100);
        avatar.setPosition(left + 50, 175);
        panel.addChild(avatar);
        var avatarBg = avatar.addComponent(cc.Graphics);
        avatarBg.fillColor = cc.color(43, 104, 81, 255);
        this._drawRoundedRect(avatarBg, -50, -50, 100, 100, 22);
        avatarBg.fill();
        var avatarLabel = createLabel(avatar, "_my_club_avatar_text_", "◆", 38, cc.color(255, 255, 255, 255), 0, -2, 38, cc.Label.HorizontalAlign.CENTER);
        var avatarUrl = data.sFaceId || data.Avatar || data.avatar || data.Logo || data.logo || data.ClubLogo || data.clubLogo || data.LogoUrl || data.logoUrl || "";
        if (avatarUrl) {
            var imageNode = new cc.Node("_my_club_avatar_image_");
            imageNode.setContentSize(90, 90);
            var sprite = imageNode.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            avatar.addChild(imageNode, 2);
            Utils.changeUserHead(sprite, String(avatarUrl), app.ClubAssets, function(err) {
                if (err || !cc.isValid(imageNode)) return;
                imageNode.setContentSize(90, 90);
                if (avatarLabel && avatarLabel.node) avatarLabel.node.active = false;
            });
        }

        var name = data._clubNamePlain || data.ClubName || data.clubName || data.sClubName || ("俱乐部" + (data.nClubId || ""));
        createLabel(panel, "_my_club_name_", name, 46, cc.color(255, 255, 255, 255), left + 128, 205, panelW - 340, cc.Label.HorizontalAlign.LEFT);
        createLabel(panel, "_my_club_id_", "俱乐部 ID · " + (data.nClubId || data.ClubId || ""), 31, cc.color(154, 164, 190, 255), left + 128, 140, panelW - 340, cc.Label.HorizontalAlign.LEFT);

        var statusW = 150;
        var statusNode = new cc.Node("_my_club_status_");
        statusNode.setAnchorPoint(0.5, 0.5);
        statusNode.setContentSize(statusW, 66);
        statusNode.setPosition(right - statusW / 2, 175);
        panel.addChild(statusNode);
        var statusBg = statusNode.addComponent(cc.Graphics);
        statusBg.fillColor = cc.color(46, 199, 127, 255);
        this._drawRoundedRect(statusBg, -statusW / 2, -33, statusW, 66, 25);
        statusBg.fill();
        createLabel(statusNode, "_my_club_status_text_", "已加入", 32, cc.color(255, 255, 255, 255), 0, -2, statusW, cc.Label.HorizontalAlign.CENTER);

        var line = new cc.Node("_my_club_line_");
        line.setAnchorPoint(0.5, 0.5);
        line.setContentSize(panelW - 76, 1);
        line.setPosition(0, 65);
        panel.addChild(line);
        var lineG = line.addComponent(cc.Graphics);
        lineG.strokeColor = cc.color(49, 58, 82, 255);
        lineG.lineWidth = 1;
        lineG.moveTo(-(panelW - 76) / 2, 0);
        lineG.lineTo((panelW - 76) / 2, 0);
        lineG.stroke();

        var memberCount = data.nUserCnt !== undefined ? data.nUserCnt : 0;
        var identity = this._myClubInfoParsed && this._myClubInfoParsed.myIdentity ? this._myClubInfoParsed.myIdentity : "俱乐部成员";
        createLabel(panel, "_my_club_member_title_", "成员人数", 33, cc.color(154, 164, 190, 255), left, 5, 220, cc.Label.HorizontalAlign.LEFT);
        createLabel(panel, "_my_club_member_value_", String(memberCount) + " 人", 39, cc.color(255, 255, 255, 255), left, -46, 220, cc.Label.HorizontalAlign.LEFT);
        createLabel(panel, "_my_club_identity_title_", "我的身份", 33, cc.color(154, 164, 190, 255), right - 250, 5, 250, cc.Label.HorizontalAlign.RIGHT);
        createLabel(panel, "_my_club_identity_value_", identity, 39, cc.color(85, 204, 136, 255), right, -46, 250, cc.Label.HorizontalAlign.RIGHT);
        createLabel(panel, "_my_club_invite_title_", "邀请码", 33, cc.color(154, 164, 190, 255), left, -120, 280, cc.Label.HorizontalAlign.LEFT);
        createLabel(panel, "_my_club_invite_value_", data.InviteCode || "--", 39, cc.color(255, 255, 255, 255), left, -171, 280, cc.Label.HorizontalAlign.LEFT);

        var inviteCode = data.InviteCode || "";
        var copyW = 150;
        var copyNode = new cc.Node("_my_club_copy_invite_");
        copyNode.setAnchorPoint(0.5, 0.5);
        copyNode.setContentSize(copyW, 66);
        copyNode.setPosition(right - copyW / 2, -153);
        panel.addChild(copyNode);
        var copyBg = copyNode.addComponent(cc.Graphics);
        copyBg.fillColor = cc.color(34, 48, 66, 255);
        this._drawRoundedRect(copyBg, -copyW / 2, -33, copyW, 66, 22);
        copyBg.fill();
        copyBg.strokeColor = cc.color(85, 204, 136, 255);
        copyBg.lineWidth = 2;
        this._drawRoundedRect(copyBg, -copyW / 2 + 1, -32, copyW - 2, 64, 21);
        copyBg.stroke();
        createLabel(copyNode, "_my_club_copy_text_", "复制", 31, cc.color(85, 204, 136, 255), 0, -2, copyW, cc.Label.HorizontalAlign.CENTER);
        var copyButton = copyNode.addComponent(cc.Button);
        copyButton.transition = cc.Button.Transition.SCALE;
        copyButton.zoomScale = 0.96;
        copyButton.duration = 0.08;
        copyNode.on(cc.Node.EventType.TOUCH_END, function() {
            if (!inviteCode) {
                UIFrame.showTips("暂无邀请码");
                return;
            }
            Utils.copyToClipBoard(inviteCode);
        });
    },

    _drawRoundedRect(g, x, y, w, h, r) {
        if (!g) return;
        try {
            if (typeof g.roundRect === "function") {
                g.roundRect(x, y, w, h, r);
                return;
            }
        } catch (e) {}
        r = Math.min(r, w / 2, h / 2);
        try {
            g.moveTo(x + r, y);
            g.lineTo(x + w - r, y);
            g.arcTo(x + w, y, x + w, y + r, r);
            g.lineTo(x + w, y + h - r);
            g.arcTo(x + w, y + h, x + w - r, y + h, r);
            g.lineTo(x + r, y + h);
            g.arcTo(x, y + h, x, y + h - r, r);
            g.lineTo(x, y + r);
            g.arcTo(x, y, x + r, y, r);
            g.close();
        } catch (e) {
            try { g.rect(x, y, w, h); } catch (e2) {}
        }
    },

    _hideCreateClubBtn() {
        try {
            let noClubNode = this.noClub;
            if (noClubNode) {
                let btnNames = ["btn_createClub", "createClubBtn", "btn_create", "create_btn"];
                for (let i = 0; i < btnNames.length; i++) {
                    let btn = noClubNode.getChildByName(btnNames[i]);
                    if (btn) {
                        btn.active = false;
                    }
                }
                let deepFind = function(parent) {
                    if (!parent || !parent.children) return;
                    for (let i = 0; i < parent.children.length; i++) {
                        let c = parent.children[i];
                        if (c.name && (c.name.indexOf("createClub") >= 0 || c.name.indexOf("CreateClub") >= 0 || c.name.indexOf("create_club") >= 0)) {
                            if (c.getComponent(cc.Button) || c.getComponent(cc.Sprite)) {
                                c.active = false;
                            }
                        }
                        deepFind(c);
                    }
                };
                deepFind(noClubNode);
            }
        } catch (e) {}
    },

    _ensureRecommendListContainer() {
        var _self = this;
        if (_self._clubPageVisible === false || !_self.node.activeInHierarchy || _self._isInPrivateClub()) {
            try { _self._destroyRecommendContainer(); } catch (e) {}
            return;
        }
        QYLogs.log(TAG, "[_ensureRecommendListContainer] V15 顶部紧凑版：整体上移+NATIVE_HEADER=260");
        try {
            _self._recommendContainer = null;
            _self._recommendTitleWrap = null;
            _self._recommendScroll = null;
            _self._recommendScrollContent = null;
            _self._recommendLoadingNode = null;
            _self._recommendAttachParent = null;
            try { _self._destroyRecommendContainer(); } catch (e) {}
            var winSize = null;
            try { winSize = cc.director.getWinSize(); } catch (e) {}
            if (!winSize) winSize = { width: 750, height: 1334 };
            var scene = null;
            try { scene = cc.director.getScene(); } catch (e) {}
            var attachParent = null;
            try { attachParent = scene ? scene.getChildByName("Canvas") : null; } catch (e) {}
            if (!attachParent) { try { attachParent = cc.find("Canvas"); } catch (e) {} }
            if (!attachParent) {
                QYLogs.warn(TAG, "[_ensureRecommendListContainer] Canvas 找不到，兜底挂 this.node");
                attachParent = _self.node;
            }
            var KILL = ["_rest_","_debug_","_tmp_badge_","_tmp_","club_avatar","club_name","club_id","club_badge","card_body","btn_join","mem_title","mem_value","arrow_right","sep_line","empty_bg","empty_title","empty_sub","empty_sub2","_title_discovery","_title_cnt","_rest_card_","_rest_list_","_rest_title_","_rest_loading_","_rest_empty_","_rest_club_list_"];
            var _inKillList = function(nm) {
                if (!nm) return false;
                var s = String(nm);
                for (var ki = 0; ki < KILL.length; ki++) { if (s.indexOf(KILL[ki]) !== -1) return true; }
                return false;
            };
            var _cleanRestChildren = function(p) {
                if (!p || !p.children) return;
                for (var i = p.childrenCount - 1; i >= 0; i--) {
                    try {
                        var c = p.children[i];
                        if (!c) continue;
                        var nm = c.name ? String(c.name) : "";
                        var needKill = _inKillList(nm);
                        if (needKill) {
                            try { c.stopAllActions(); } catch (e) {}
                            try {
                                if (c.children) {
                                    for (var j = c.childrenCount - 1; j >= 0; j--) {
                                        try {
                                            var cc2 = c.children[j];
                                            if (cc2) { cc2.stopAllActions(); cc2.removeAllChildren(true); try { cc2.destroy(); } catch(ex){} }
                                        } catch (e) {}
                                    }
                                }
                                c.removeAllChildren(true);
                            } catch (e) {}
                            try { c.destroy(); } catch (e) {}
                        } else if (c.children && c.childrenCount > 0) {
                            _cleanRestChildren(c);
                        }
                    } catch (e) {}
                }
            };
            _cleanRestChildren(attachParent);
            _cleanRestChildren(_self.node);
            var HALF_H = winSize.height / 2;
            var NATIVE_HEADER_H = 260;
            var TITLE_WRAP_H = 80;
            var GAP_TITLE_LIST = 26;
            var BOTTOM_TABBAR_H = 160;
            var titleName = "_rest_title_wrap_";
            var listName = "_rest_list_outer_";
            var cw = Math.min(winSize.width - 80, 1000);
            if (cw < 360) cw = winSize.width - 24;
            var titleWrapTopCanvas = HALF_H - NATIVE_HEADER_H;
            var titleCenterCanvas = titleWrapTopCanvas - TITLE_WRAP_H / 2;
            var listTopCanvas = titleWrapTopCanvas - TITLE_WRAP_H - GAP_TITLE_LIST;
            var listBottomCanvas = -HALF_H + BOTTOM_TABBAR_H;
            var listH = listTopCanvas - listBottomCanvas;
            var listCenterCanvas = (listTopCanvas + listBottomCanvas) / 2;
            if (listH < 520) listH = 520;
            cc.warn("[V13-POS] WIN=" + winSize.width + "x" + winSize.height + " HALF_H=" + HALF_H.toFixed(0));
            cc.warn("[V13-POS] titleWrapTop=" + titleWrapTopCanvas.toFixed(0) + " titleCenter=" + titleCenterCanvas.toFixed(0) + " listTop=" + listTopCanvas.toFixed(0) + " listBot=" + listBottomCanvas.toFixed(0) + " listH=" + listH.toFixed(0) + " cw=" + cw.toFixed(0));
            var titleWrap = new cc.Node(titleName);
            titleWrap.setAnchorPoint(0.5, 0.5);
            titleWrap.setContentSize(cw, TITLE_WRAP_H);
            titleWrap.setPosition(0, titleCenterCanvas);
            titleWrap.active = true;
            titleWrap.opacity = 255;
            attachParent.addChild(titleWrap, 10001);
            var titleLeft = -cw / 2 + 10;
            var titleRight = cw / 2 - 10;
            var listCntVal = (_self._recommendListData && _self._recommendListData.length) ? _self._recommendListData.length : 0;
            try {
                var disTitle = new cc.Node("_title_discovery");
                disTitle.setAnchorPoint(0, 0.5);
                disTitle.setPosition(titleLeft, 0);
                var dl = disTitle.addComponent(cc.Label);
                dl.string = "发现俱乐部";
                dl.fontSize = 40;
                dl.lineHeight = 48;
                try { dl.node.color = cc.color(205, 210, 230, 255); } catch (e) {}
                try { if (dl && dl.font) { try { dl.font._bold = true; } catch(e){} } else { try { dl.enableBold = true; } catch(e){} } } catch(e){}
                titleWrap.addChild(disTitle, 1);
                var cntTitle = new cc.Node("_title_cnt");
                cntTitle.setAnchorPoint(1, 0.5);
                cntTitle.setPosition(titleRight, 0);
                var cl = cntTitle.addComponent(cc.Label);
                cl.string = "共 " + listCntVal + " 个";
                cl.fontSize = 30;
                cl.lineHeight = 38;
                cl.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
                try { cl.node.color = cc.color(145, 152, 180, 255); } catch (e) {}
                titleWrap.addChild(cntTitle, 1);
                _self._recommendCountLabel = cl;
            } catch (e) {}
            _self._recommendTitleWrap = titleWrap;
            _self._recommendAttachParent = attachParent;
            _self._recommendContainerName = "_rest_club_list_";
            _self._recommendUseNativeScroll = false;
            _self._recommendNativeScroll = null;
            var scrollViewHost = null;
            var contentHost = null;
            try {
                var scrollNode = new cc.Node(listName);
                scrollNode.setAnchorPoint(0.5, 0.5);
                scrollNode.setContentSize(cw, listH);
                scrollNode.setPosition(0, listCenterCanvas);
                scrollNode.active = true;
                scrollNode.opacity = 255;
                attachParent.addChild(scrollNode, 10000);
                var scroll = scrollNode.addComponent(cc.ScrollView);
                scroll.vertical = true;
                scroll.horizontal = false;
                scroll.inertia = true;
                scroll.brake = 0.9;
                scroll.elastic = true;
                scrollNode._restContentHostRef = null;
                var contentNode = new cc.Node("_rest_list_content_");
                contentNode.setAnchorPoint(0.5, 1);
                contentNode.setContentSize(cw, 0);
                contentNode.active = true;
                contentNode.opacity = 255;
                scrollNode.addChild(contentNode, 1);
                var containerSize = scrollNode.getContentSize();
                var cpY = containerSize.height / 2;
                contentNode.setPosition(0, cpY);
                try { scroll.content = contentNode; } catch (e) {}
                scrollViewHost = scroll;
                contentHost = contentNode;
                scrollNode._restContentHostRef = contentHost;
                QYLogs.log(TAG, "[_ensureRecommendListContainer] V13 ScrollView listH=" + listH.toFixed(0));
            } catch (e) {
                QYLogs.warn(TAG, "[_ensureRecommendListContainer] V13 ScrollView失败: " + e.message);
                try {
                    var plainNode = new cc.Node(listName);
                    plainNode.setAnchorPoint(0.5, 0.5);
                    plainNode.setContentSize(cw, listH);
                    plainNode.setPosition(0, listCenterCanvas);
                    plainNode.active = true;
                    plainNode.opacity = 255;
                    attachParent.addChild(plainNode, 10000);
                    var contentNodePlain = new cc.Node("_rest_list_content_");
                    contentNodePlain.setAnchorPoint(0.5, 1);
                    contentNodePlain.setContentSize(cw, 0);
                    plainNode.addChild(contentNodePlain, 1);
                    var pSize = plainNode.getContentSize();
                    contentNodePlain.setPosition(0, pSize.height / 2);
                    scrollViewHost = null;
                    contentHost = contentNodePlain;
                } catch (e2) {}
            }
            _self._recommendContainer = null;
            _self._recommendScroll = scrollViewHost;
            _self._recommendScrollContent = contentHost;
            _self._recommendCw = cw;
            _self._recommendTitleH = TITLE_WRAP_H;
            try {
                var loadingNode = new cc.Node("_rest_loading_");
                loadingNode.setAnchorPoint(0.5, 0.5);
                loadingNode.setPosition(0, listCenterCanvas);
                attachParent.addChild(loadingNode, 10002);
                var ll = loadingNode.addComponent(cc.Label);
                ll.string = "俱乐部列表加载中...";
                ll.fontSize = 30;
                ll.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                try { ll.node.color = cc.color(232, 199, 106, 230); } catch (e) {}
                _self._recommendLoadingNode = loadingNode;
            } catch (e) {}
        } catch (e) {
            QYLogs.error(TAG, "[_ensureRecommendListContainer] V13 异常: " + (e && e.message ? e.message : e) + (e && e.stack ? "\n" + e.stack : ""));
        }
    },

    _destroyRecommendContainer() {
        try {
            var attachParent = this._recommendAttachParent;
            if (!attachParent) {
                try {
                    var scene = cc.director.getScene();
                    attachParent = scene ? scene.getChildByName("Canvas") : cc.find("Canvas");
                } catch (e) {}
            }
            var _this = this;
            var _cleanAllByPrefix = function(p) {
                if (!p || !p.children) return;
                for (var i = p.childrenCount - 1; i >= 0; i--) {
                    try {
                        var c = p.children[i];
                        if (!c || !c.name) continue;
                        var nm = String(c.name);
                        if (nm.indexOf("_rest_") === 0 || nm.indexOf("_debug_") === 0 || nm.indexOf("_tmp_badge_") === 0) {
                            c.active = false;
                            try { c.stopAllActions(); } catch (e) {}
                            try {
                                if (c.children) {
                                    for (var j = c.childrenCount - 1; j >= 0; j--) {
                                        try {
                                            var cc2 = c.children[j];
                                            if (cc2) { cc2.stopAllActions(); cc2.removeAllChildren(true); }
                                        } catch (e) {}
                                    }
                                }
                                c.removeAllChildren(true);
                            } catch (e) {}
                            try { c.destroy(); } catch (e) {}
                        } else if (c.children && c.childrenCount > 0) {
                            _cleanAllByPrefix(c);
                        }
                    } catch (e) {}
                }
            };
            _cleanAllByPrefix(attachParent);
            _cleanAllByPrefix(this.node);
            this._recommendContainer = null;
            this._recommendTitleWrap = null;
            this._recommendScroll = null;
            this._recommendScrollContent = null;
            this._recommendLoadingNode = null;
            this._recommendListData = null;
        } catch (e) {}
    },

    _requestRecommendClubList() {
        var _self = this;
        if (_self._clubPageVisible === false || !_self.node.activeInHierarchy || _self._isInPrivateClub()) {
            try { _self._destroyRecommendContainer(); } catch (e) {}
            return;
        }
        QYLogs.error(TAG, "[_requestRecommendClubList] ====== 开始请求推荐俱乐部列表 (HTTP)");
        try {
            if (_self._recommendLoadingNode) _self._recommendLoadingNode.active = true;
        } catch (e) {}
        var onDone = function(err, resp) {
            if (!cc.isValid(_self.node) || _self._clubPageVisible === false || !_self.node.activeInHierarchy || _self._isInPrivateClub()) {
                try { _self._destroyRecommendContainer(); } catch (e) {}
                return;
            }
            try { if (_self._recommendLoadingNode) _self._recommendLoadingNode.active = false; } catch (e) {}
            if (err) {
                _self._renderRecommendList([]);
                return;
            }
            var items = [];
            try {
                if (resp && resp.code === 0) {
                    var raw = resp.data || resp;
                    if (Array.isArray(raw)) items = raw;
                    else if (raw && Array.isArray(raw.list)) items = raw.list;
                    else if (raw && Array.isArray(raw.arrItem)) items = raw.arrItem;
                    else if (raw && Array.isArray(raw.items)) items = raw.items;
                    else if (raw && Array.isArray(raw.data)) items = raw.data;
                } else if (resp && Array.isArray(resp)) {
                    items = resp;
                }
            } catch (e) {}
            var wsItems = [];
            for (var i = 0; i < items.length; i++) {
                var it = HallClubCacheData.mapRestClubItemToWs(items[i]);
                if (it) wsItems.push(it);
            }
            HallClubCacheData.setRecommendClubList(wsItems);
            _self._renderRecommendList(wsItems);
        };
        try {
            AppWebApi.getClubList({ page: 1, pageSize: 20 }, function(err, resp) {
                onDone(err, resp);
            });
        } catch (e) {
            onDone({status:-1, errorMessage:"Exception: " + e.message}, null);
        }
    },

    _renderRecommendList(list) {
        var _self = this;
        if (!_self.node.activeInHierarchy || _self._isInPrivateClub()) {
            try { _self._destroyRecommendContainer(); } catch (e) {}
            return;
        }
        QYLogs.log(TAG, "[_renderRecommendList] V13 发现俱乐部版 进入 list.length=" + (list ? list.length : "null"));
        try {
            var contentNode = _self._recommendScrollContent;
            if (!contentNode) {
                QYLogs.warn(TAG, "[_renderRecommendList] contentNode 不存在，重新 _ensureRecommendListContainer");
                _self._ensureRecommendListContainer();
                contentNode = _self._recommendScrollContent;
                if (!contentNode) {
                    QYLogs.error(TAG, "[_renderRecommendList] _ensureRecommendListContainer 后仍无 contentNode，放弃");
                    return;
                }
            }
            QYLogs.log(TAG, "[_renderRecommendList] contentNode anchor=(" + contentNode.anchorX + "," + contentNode.anchorY + ") active=" + contentNode.active);
            try { contentNode.removeAllChildren(true); } catch (e) {}
            contentNode.active = true;
            contentNode.opacity = 255;
            var cw = _self._recommendCw || contentNode.width || 700;
            if (cw < 360) cw = 700;
            var contAnchorX = (contentNode.anchorX != null) ? contentNode.anchorX : 0;
            var leftX = -cw * contAnchorX;
            var sidePad = 20;
            if (cw < 600) sidePad = 16;
            var itemW = cw - sidePad * 2;
            var itemH = 300;
            var gap = 24;
            var paddingTop = 28;
            if (itemW < 360) itemW = cw - sidePad * 2;
            cc.warn("[V13-POS] _renderRecommendList: cw=" + cw + " itemH=" + itemH + " gap=" + gap + " sidePad=" + sidePad + " paddingTop=" + paddingTop);
            if (!list || list.length === 0) {
                var emptyNode = new cc.Node("_rest_empty_");
                emptyNode.setAnchorPoint(0.5, 0.5);
                var emptyW = itemW;
                var emptyH = 320;
                emptyNode.setContentSize(emptyW, emptyH);
                var ex = leftX + cw / 2;
                var ey = -paddingTop - emptyH / 2;
                emptyNode.setPosition(ex, ey);
                contentNode.addChild(emptyNode, 1);
                try {
                    var ctxNode = new cc.Node("empty_bg");
                    ctxNode.setAnchorPoint(0, 0);
                    ctxNode.setContentSize(emptyW, emptyH);
                    var g = ctxNode.addComponent(cc.Graphics);
                    g.fillColor = cc.color(14, 20, 48, 230);
                    _self._drawRoundedRect(g, 0, 0, emptyW, emptyH, 22);
                    g.fill();
                    g.lineWidth = 3;
                    g.strokeColor = cc.color(232, 199, 106, 180);
                    _self._drawRoundedRect(g, 0, 0, emptyW, emptyH, 22);
                    g.stroke();
                    g.lineWidth = 1.2;
                    g.strokeColor = cc.color(232, 199, 106, 80);
                    _self._drawRoundedRect(g, 8, 8, emptyW - 16, emptyH - 16, 18);
                    g.stroke();
                    try {
                        g.lineWidth = 2;
                        g.strokeColor = cc.color(232, 199, 106, 150);
                        g.moveTo(12, 24); g.lineTo(48, 24);
                        g.moveTo(12, 24); g.lineTo(12, 60);
                        g.moveTo(emptyW - 12, emptyH - 24); g.lineTo(emptyW - 48, emptyH - 24);
                        g.moveTo(emptyW - 12, emptyH - 24); g.lineTo(emptyW - 12, emptyH - 60);
                        g.stroke();
                    } catch (e2) {}
                    emptyNode.addChild(ctxNode, 0);
                } catch (e) {}
                var titleLabelNode = new cc.Node("empty_title");
                titleLabelNode.setAnchorPoint(0.5, 0.5);
                titleLabelNode.setPosition(0, 80);
                var titleLabel = titleLabelNode.addComponent(cc.Label);
                titleLabel.string = "暂无推荐俱乐部";
                titleLabel.fontSize = 38;
                titleLabel.lineHeight = 46;
                titleLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                try { titleLabel.node.color = cc.color(250, 224, 140, 255); } catch (e) {}
                emptyNode.addChild(titleLabelNode, 2);
                var subLabelNode = new cc.Node("empty_sub");
                subLabelNode.setAnchorPoint(0.5, 0.5);
                subLabelNode.setPosition(0, 0);
                var subLabel = subLabelNode.addComponent(cc.Label);
                subLabel.string = "可通过搜索栏检索俱乐部 ID / 名称";
                subLabel.fontSize = 24;
                subLabel.lineHeight = 32;
                subLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                try { subLabel.node.color = cc.color(210, 215, 240, 230); } catch (e) {}
                emptyNode.addChild(subLabelNode, 2);
                var sub2LabelNode = new cc.Node("empty_sub2");
                sub2LabelNode.setAnchorPoint(0.5, 0.5);
                sub2LabelNode.setPosition(0, -70);
                var sub2Label = sub2LabelNode.addComponent(cc.Label);
                sub2Label.string = "或向俱乐部成员索要 8 位邀请码直接加入";
                sub2Label.fontSize = 22;
                sub2Label.lineHeight = 30;
                sub2Label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                try { sub2Label.node.color = cc.color(185, 195, 230, 220); } catch (e) {}
                emptyNode.addChild(sub2LabelNode, 2);
                contentNode.setContentSize(cw, paddingTop + emptyH + 60);
                if (_self._recommendScroll) { try { _self._recommendScroll.scrollToTop(0.08); } catch (e) {} }
                QYLogs.log(TAG, "[_renderRecommendList] 空态渲染 V13 OK");
                return;
            }
            _self._recommendListData = list.slice();
            if (_self._recommendCountLabel) {
                try {
                    _self._recommendCountLabel.string = "共 " + list.length + " 个";
                } catch (e) {}
            }
            QYLogs.log(TAG, "[_renderRecommendList] V13 构建 " + list.length + " 张 " + itemH + "px 卡片");
            for (var i = 0; i < list.length; i++) {
                (function(idx2) {
                    var data = list[idx2];
                    var y = -(paddingTop + itemH + idx2 * (itemH + gap));
                    var card = _self._buildClubCardItem(data, idx2, itemW, itemH);
                    card.setAnchorPoint(0, 0);
                    var cardX = leftX + sidePad;
                    card.setPosition(cardX, y);
                    card.active = true;
                    card.opacity = 255;
                    try { card.setLocalZOrder(10002); } catch(e) {}
                    contentNode.addChild(card, 1);
                    if (idx2 === 0) {
                        cc.warn("[V13-POS] 卡1(anchor 0,0) 本地坐标 cardX=" + cardX.toFixed(0) + " cardBottomY=" + y.toFixed(0) + "  itemH=" + itemH + " gap=" + gap);
                    }
                })(i);
            }
            var totalH = paddingTop + list.length * (itemH + gap) + 60;
            if (_self._recommendScroll && _self._recommendScroll.node) {
                try {
                    var sh = _self._recommendScroll.node.height || 600;
                    if (totalH < sh) totalH = sh + 4;
                } catch (e) {}
            }
            contentNode.setContentSize(cw, totalH);
            try {
                if (contentNode.anchorX === 0.5 && contentNode.anchorY === 1) {
                    var contSz = contentNode.getContentSize();
                    var pSz = null;
                    try { pSz = contentNode.parent ? contentNode.parent.getContentSize() : null; } catch(e) {}
                    if (pSz) { contentNode.setPosition(0, pSz.height / 2); }
                }
            } catch(e2) {}
            cc.warn("[V13-POS] contentNode totalH=" + totalH + " scroll.node.height=" + (_self._recommendScroll && _self._recommendScroll.node ? _self._recommendScroll.node.height : "null"));
            if (_self._recommendScroll) {
                try {
                    _self._recommendScroll.content = contentNode;
                    _self._recommendScroll.stopAutoScroll();
                    _self._recommendScroll.scrollToTop(0.05);
                } catch (e) {}
            }
            QYLogs.log(TAG, "[_renderRecommendList] V13 完成 " + list.length + " 张卡片, contentSize=" + cw + "x" + totalH);
        } catch (e) {
            QYLogs.error(TAG, "[_renderRecommendList] V13 渲染异常: " + (e && e.message ? e.message : e) + (e && e.stack ? "\n" + e.stack : ""));
        }
    },

    _buildClubCardItem(data, idx, w, h) {
        var _self = this;
        if (!h || h < 260) h = 300;
        var node = new cc.Node("_rest_card_" + (idx + 1));
        node.setContentSize(w, h);
        var status = data.nStatus || 0;
        var canApply = (data.CanApply === undefined || data.CanApply === null) ? 0 : (Number(data.CanApply) || 0);
        var nUser = data.nUserCnt != null ? data.nUserCnt : 0;
        var nMax = data.nMaxUserCnt != null ? data.nMaxUserCnt : 999;
        var isFull = (typeof data._isFull === "boolean") ? data._isFull : (nMax && nUser >= nMax);
        try {
            var cardNode = new cc.Node("card_body");
            cardNode.setAnchorPoint(0, 0);
            cardNode.setContentSize(w, h);
            var g = cardNode.addComponent(cc.Graphics);
            g.fillColor = cc.color(26, 32, 52, 245);
            _self._drawRoundedRect(g, 0, 0, w, h, 22);
            g.fill();
            g.lineWidth = 1.4;
            g.strokeColor = cc.color(64, 72, 100, 160);
            _self._drawRoundedRect(g, 0, 0, w, h, 22);
            g.stroke();
            node.addChild(cardNode, 0);
        } catch (e) {}
        var avatarSize = 90;
        var avatarLeft = 28;
        var avatarTopFromCard = 50;
        var avatarTopY = h - avatarTopFromCard;
        var avatarCenterY = avatarTopY - avatarSize / 2;
        var avatarNode = new cc.Node("club_avatar");
        avatarNode.setAnchorPoint(0.5, 0.5);
        avatarNode.setContentSize(avatarSize, avatarSize);
        avatarNode.setPosition(avatarLeft + avatarSize / 2, avatarCenterY);
        try {
            var avBg = new cc.Node("av_bg");
            avBg.setAnchorPoint(0, 0);
            avBg.setContentSize(avatarSize, avatarSize);
            avBg.setPosition(-avatarSize / 2, -avatarSize / 2);
            var ag = avBg.addComponent(cc.Graphics);
            var avFill = cc.color(52, 60, 88, 255);
            try {
                var palette = [
                    cc.color(44, 80, 64, 255),
                    cc.color(74, 56, 96, 255),
                    cc.color(44, 68, 100, 255),
                    cc.color(86, 58, 40, 255),
                    cc.color(94, 54, 64, 255)
                ];
                if (idx >= 0 && palette[idx % palette.length]) {
                    avFill = palette[idx % palette.length];
                }
            } catch (e1) {}
            _self._drawRoundedRect(ag, 0, 0, avatarSize, avatarSize, 20);
            ag.fillColor = avFill;
            ag.fill();
            ag.lineWidth = 1.4;
            ag.strokeColor = cc.color(255, 255, 255, 20);
            _self._drawRoundedRect(ag, 0, 0, avatarSize, avatarSize, 20);
            ag.stroke();
            avatarNode.addChild(avBg, 0);
            try {
                var cNode = new cc.Node("av_c");
                cNode.setAnchorPoint(0.5, 0.5);
                cNode.setPosition(0, 2);
                var cLb = cNode.addComponent(cc.Label);
                var glyphs = ["✦", "☾", "❖", "◎", "♠"];
                cLb.string = glyphs[idx % glyphs.length] || "C";
                cLb.fontSize = 44;
                try { cLb.node.color = cc.color(248, 240, 255, 235); } catch (e) {}
                avatarNode.addChild(cNode, 1);
                try {
                    var avatarUrl = data.sFaceId || data.Avatar || data.avatar || data.Logo || data.logo || data.ClubLogo || data.clubLogo || data.LogoUrl || data.logoUrl || "";
                    if (avatarUrl) {
                        var imageNode = new cc.Node("av_image");
                        imageNode.setContentSize(avatarSize - 6, avatarSize - 6);
                        var sprite = imageNode.addComponent(cc.Sprite);
                        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                        avatarNode.addChild(imageNode, 2);
                        (function(avLabelNode, imgNode) {
                            Utils.changeUserHead(sprite, String(avatarUrl), app.ClubAssets, function(err) {
                                if (err || !cc.isValid(imgNode)) return;
                                imgNode.setContentSize(avatarSize - 6, avatarSize - 6);
                                if (avLabelNode && avLabelNode.node) avLabelNode.node.active = false;
                            });
                        })(cLb, imageNode);
                    }
                } catch (eAv) {}
            } catch (e2) {}
        } catch (e) {}
        node.addChild(avatarNode, 1);
        var btnW = 144, btnH = 68, btnRight = 28;
        var btnCenterY = avatarCenterY;
        var btnNode = new cc.Node("btn_join");
        btnNode.setAnchorPoint(0.5, 0.5);
        btnNode.setContentSize(btnW, btnH);
        btnNode.setPosition(w - btnRight - btnW / 2, btnCenterY);
        var btnBg = new cc.Node("btn_bg");
        btnBg.setAnchorPoint(0.5, 0.5);
        btnBg.setContentSize(btnW, btnH);
        var btnG = btnBg.addComponent(cc.Graphics);
        var fillColor = cc.color(73, 211, 142, 255);
        var strokeColor = cc.color(118, 238, 174, 210);
        var textColor = cc.color(247, 255, 251, 255);
        var btnTitle = "加入";
        var btnEnabled = true;
        var btnClickEnter = false;
        if (status === 1) {
            fillColor = cc.color(70, 84, 118, 235);
            strokeColor = cc.color(112, 126, 160, 230);
            textColor = cc.color(230, 236, 250, 250);
            btnTitle = "已申请";
            btnEnabled = false;
        } else if (status === 2) {
            fillColor = cc.color(78, 188, 116, 255);
            strokeColor = cc.color(36, 134, 74, 255);
            textColor = cc.color(247, 255, 251, 255);
            btnTitle = "进入";
            btnEnabled = true;
            btnClickEnter = true;
        } else if (status === 4 || isFull) {
            fillColor = cc.color(118, 74, 80, 235);
            strokeColor = cc.color(160, 108, 114, 230);
            textColor = cc.color(248, 236, 238, 250);
            btnTitle = "已满";
            btnEnabled = false;
        } else if (status === 3 || canApply === 1) {
            fillColor = cc.color(94, 108, 140, 235);
            strokeColor = cc.color(144, 140, 176, 230);
            textColor = cc.color(252, 252, 255, 255);
            btnTitle = "需邀请码";
            btnEnabled = true;
        }
        var btnShadow = new cc.Node("btn_shadow");
        btnShadow.setAnchorPoint(0.5, 0.5);
        btnShadow.setPosition(0, -5);
        var shadowG = btnShadow.addComponent(cc.Graphics);
        shadowG.fillColor = cc.color(0, 0, 0, 55);
        _self._drawRoundedRect(shadowG, -btnW / 2, -btnH / 2, btnW, btnH, 24);
        shadowG.fill();
        btnNode.addChild(btnShadow, 0);
        btnG.fillColor = fillColor;
        _self._drawRoundedRect(btnG, -btnW / 2, -btnH / 2, btnW, btnH, 24);
        btnG.fill();
        btnG.lineWidth = 1.4;
        btnG.strokeColor = strokeColor;
        _self._drawRoundedRect(btnG, -btnW / 2, -btnH / 2, btnW, btnH, 24);
        btnG.stroke();
        btnG.lineWidth = 1;
        btnG.strokeColor = cc.color(255, 255, 255, 90);
        btnG.moveTo(-btnW / 2 + 22, btnH / 2 - 10);
        btnG.lineTo(btnW / 2 - 22, btnH / 2 - 10);
        btnG.stroke();
        btnNode.addChild(btnBg, 1);
        var btnLabelNode = new cc.Node("btn_title");
        btnLabelNode.setAnchorPoint(0.5, 0.5);
        btnLabelNode.setPosition(0, -3);
        var btnLabel = btnLabelNode.addComponent(cc.Label);
        btnLabel.string = btnTitle;
        btnLabel.fontSize = 34;
        btnLabel.lineHeight = 40;
        btnLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        try { btnLabel.node.color = textColor; } catch (e) {}
        try {
            if (btnLabel && btnLabel.font) { try { btnLabel.font._bold = true; } catch (e) {} }
            else { try { btnLabel.enableBold = true; } catch (e) {} }
        } catch (eB) {}
        btnNode.addChild(btnLabelNode, 2);
        if (btnEnabled) {
            var btn = btnNode.addComponent(cc.Button);
            btn.transition = cc.Button.Transition.SCALE;
            btn.zoomScale = 0.94;
            btn.target = btnNode;
            (function(bd, ix, ce) {
                if (ce) {
                    btn.node.on(cc.Node.EventType.TOUCH_END, function(ev) {
                        ev.stopPropagation();
                        _self._onClickEnterClub(bd, ix);
                    }, _self);
                } else {
                    btn.node.on(cc.Node.EventType.TOUCH_END, function(ev) {
                        ev.stopPropagation();
                        _self._onClickJoinClub(bd, ix);
                    }, _self);
                }
            })(data, idx, btnClickEnter);
        }
        node.addChild(btnNode, 3);
        var infoLeft = avatarLeft + avatarSize + 24;
        var nameTopY = avatarTopY;
        var nameH = 48;
        var nameNode = new cc.Node("club_name");
        nameNode.setAnchorPoint(0, 1);
        nameNode.setPosition(infoLeft, nameTopY);
        var nameLabel = nameNode.addComponent(cc.Label);
        nameLabel.overflow = cc.Label.Overflow.CLAMP;
        var decodedName = "";
        if (data._clubNamePlain && typeof data._clubNamePlain === "string" && data._clubNamePlain.length > 0) {
            decodedName = data._clubNamePlain;
        } else {
            decodedName = HallClubCacheData._looksLikeBase64Encoded(data.sClubName) ? HallClubCacheData.safeDecodeBase64(data.sClubName) : (data.sClubName || "");
            if (!decodedName) decodedName = "俱乐部" + (data.nClubId || idx + 1);
        }
        nameLabel.string = decodedName;
        nameLabel.fontSize = 42;
        nameLabel.lineHeight = nameH;
        try { nameLabel.node.color = cc.color(250, 250, 255, 255); } catch (e) {}
        try {
            if (nameLabel && nameLabel.font) { try { nameLabel.font._bold = true; } catch (e) {} }
            else { try { nameLabel.enableBold = true; } catch (e) {} }
        } catch (eB) {}
        var btnEndX = w - btnRight - btnW - 16;
        var infoRight = Math.max(infoLeft + 180, btnEndX);
        var nameMaxW = infoRight - infoLeft;
        if (nameMaxW < 180) nameMaxW = 180;
        nameNode.setContentSize(nameMaxW, nameH);
        node.addChild(nameNode, 3);
        var idTopY = nameTopY - nameH - 6;
        var idH = 38;
        var idLeft = infoLeft;
        var idNode = new cc.Node("club_id");
        idNode.setAnchorPoint(0, 1);
        idNode.setPosition(idLeft, idTopY);
        var idLb = idNode.addComponent(cc.Label);
        idLb.string = "俱乐部 ID · " + (data.nClubId || 0);
        idLb.fontSize = 32;
        idLb.lineHeight = 38;
        try { idLb.node.color = cc.color(168, 174, 198, 255); } catch (e) {}
        idNode.setContentSize(Math.max(infoRight - infoLeft, 220), idH);
        node.addChild(idNode, 3);
        try {
            var sepY = 112;
            var sepL = 28;
            var sepR = w - 28;
            var sep = new cc.Node("sep_line");
            sep.setAnchorPoint(0, 0);
            sep.setContentSize(sepR - sepL, 2);
            sep.setPosition(sepL, sepY);
            var sG = sep.addComponent(cc.Graphics);
            sG.fillColor = cc.color(58, 66, 92, 130);
            sG.rect(0, 0, sepR - sepL, 1);
            sG.fill();
            node.addChild(sep, 1);
        } catch (e) {}
        try {
            var memberY = 58;
            var memTitleLeft = 28;
            var memTitleNode = new cc.Node("mem_title");
            memTitleNode.setAnchorPoint(0, 0.5);
            memTitleNode.setPosition(memTitleLeft, memberY);
            var mtLb = memTitleNode.addComponent(cc.Label);
            mtLb.string = "成员人数";
            mtLb.fontSize = 32;
            mtLb.lineHeight = 40;
            try { mtLb.node.color = cc.color(158, 164, 190, 255); } catch (e) {}
            node.addChild(memTitleNode, 2);
            var memValRight = w - 58;
            var memValNode = new cc.Node("mem_value");
            memValNode.setAnchorPoint(1, 0.5);
            memValNode.setPosition(memValRight, memberY);
            var mvLb = memValNode.addComponent(cc.Label);
            mvLb.string = nUser + " 人";
            mvLb.fontSize = 36;
            mvLb.lineHeight = 44;
            mvLb.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
            try { mvLb.node.color = cc.color(230, 234, 250, 255); } catch (e) {}
            try {
                if (mvLb && mvLb.font) { try { mvLb.font._bold = true; } catch (e) {} }
                else { try { mvLb.enableBold = true; } catch (e) {} }
            } catch (eB) {}
            node.addChild(memValNode, 2);
            try {
                var arrow = new cc.Node("arrow_right");
                arrow.setAnchorPoint(0.5, 0.5);
                arrow.setPosition(memValRight + 26, memberY);
                arrow.setContentSize(30, 30);
                var aG = arrow.addComponent(cc.Graphics);
                aG.lineWidth = 2.4;
                aG.strokeColor = cc.color(158, 164, 190, 255);
                aG.moveTo(-6, -8);
                aG.lineTo(5, 0);
                aG.lineTo(-6, 8);
                aG.stroke();
                node.addChild(arrow, 1);
            } catch (eA) {}
        } catch (e) {}
        try {
            var st = Math.max(idx * 0.07, 0);
            var targetNode = node;
            node.runAction(cc.sequence(
                cc.delayTime(st),
                cc.callFunc(function() { targetNode.opacity = 0; targetNode.y = targetNode.y - 16; }),
                cc.spawn(cc.fadeIn(0.35), cc.moveBy(0.35, 0, 16)),
                cc.callFunc(function() { targetNode.opacity = 255; })
            ));
        } catch (e) {}
        return node;
    },

    _onClickEnterClub(data, idx) {
        var clubId = data.nClubId || data.ClubId || 0;
        if (!clubId || clubId < 1000000) {
            UIFrame.showTips("俱乐部ID无效(" + clubId + ")");
            return;
        }
        try {
            var hallCtrl = this.node.parent && this.node.parent.parent ? this.node.parent.parent.getComponent("HallClubController") : null;
            if (hallCtrl && hallCtrl.loginClub) {
                UIFrame.showTips("正在进入俱乐部 ID:" + clubId);
                hallCtrl.loginClub(clubId);
            } else {
                UIFrame.showTips("已加入该俱乐部 ID:" + clubId);
            }
        } catch (e) {
            UIFrame.showTips("进入失败: " + e.message);
        }
    },

    _onClickJoinClub(data, idx) {
        var canApply = (data.CanApply === undefined || data.CanApply === null) ? 0 : (Number(data.CanApply) || 0);
        var nStatus = data.nStatus || 0;
        if (nStatus === 2) {
            this._onClickEnterClub(data, idx);
            return;
        }
        var nUser = data.nUserCnt != null ? data.nUserCnt : 0;
        var nMax = data.nMaxUserCnt != null ? data.nMaxUserCnt : 999;
        var isFull = (typeof data._isFull === "boolean") ? data._isFull : (nMax && nUser >= nMax);
        if (isFull || nStatus === 4) {
            UIFrame.showTips("该俱乐部成员已满，请选择其他俱乐部");
            return;
        }
        if (nStatus === 1) {
            UIFrame.showTips("已提交申请，等待俱乐部房主审核");
            return;
        }
        var forceInviteOnly = false;
        if (canApply === 1 || nStatus === 3) {
            forceInviteOnly = true;
        }
        this._showInviteCodeDialog(data, idx, forceInviteOnly);
    },

    _showInviteCodeDialog(clubData, idx, forceInviteOnly) {
        var _self = this;
        var decodedName = "";
        if (clubData._clubNamePlain && typeof clubData._clubNamePlain === "string" && clubData._clubNamePlain.length > 0) {
            decodedName = clubData._clubNamePlain;
        } else {
            decodedName = HallClubCacheData._looksLikeBase64Encoded(clubData.sClubName) ? HallClubCacheData.safeDecodeBase64(clubData.sClubName) : (clubData.sClubName || "");
            if (!decodedName) decodedName = "俱乐部" + (clubData.nClubId || "");
        }

        if (_self._inviteCodeDialogNode && cc.isValid(_self._inviteCodeDialogNode)) {
            var oldEdit = cc.find("root/clubInput/clubEditBox", _self._inviteCodeDialogNode);
            var oldEditBox = oldEdit ? oldEdit.getComponent(cc.EditBox) : null;
            if (oldEditBox) oldEditBox.focus();
            return;
        }

        var openDialog = function(prefab) {
            if (!prefab || !cc.isValid(_self.node)) return;
            var parent = (typeof app !== "undefined" && app.node) ? app.node : cc.director.getScene();
            if (!parent) {
                UIFrame.showTips("加入界面打开失败");
                return;
            }
            var node = cc.instantiate(prefab);
            parent.addChild(node, cc.macro.MAX_ZINDEX - 1);
            _self._inviteCodeDialogNode = node;
            var component = node.getComponent("HallClubJoin");
            if (!component) component = node.addComponent(HallClubJoin);
            component.init({
                clubName: decodedName,
                forceInviteOnly: forceInviteOnly,
                callBack: function(code, done) {
                    _self._doJoinByInviteCode(code, clubData, idx, done);
                },
                closeCallBack: function() {
                    _self._inviteCodeDialogNode = null;
                }
            });
        };

        if (_self._inviteCodePrefab) {
            openDialog(_self._inviteCodePrefab);
            return;
        }
        if (_self._isLoadingInviteCodeDialog) return;

        var wrapper = (typeof app !== "undefined") ? app.ClubViews : null;
        if (!wrapper || !wrapper.bundle) {
            UIFrame.showTips("俱乐部资源尚未加载完成，请稍后再试");
            return;
        }
        _self._isLoadingInviteCodeDialog = true;
        wrapper.bundle.load("main-hall/Script/hall/view/club/HallClubJoin", cc.Prefab, function(error, prefab) {
            _self._isLoadingInviteCodeDialog = false;
            if (error || !prefab) {
                QYLogs.error(TAG, "[_showInviteCodeDialog] 加载失败: " + (error ? error.message : "prefab null"));
                UIFrame.showTips("加入界面加载失败，请稍后再试");
                return;
            }
            _self._inviteCodePrefab = prefab;
            openDialog(prefab);
        });
    },

    _doJoinByInviteCode(inviteCode, clubData, idx, done) {
        var _self = this;
        if (_self._joinClubSubmitting) {
            if (done) done(false);
            return;
        }
        _self._joinClubSubmitting = true;
        QYLogs.log(TAG, "[_doJoinByInviteCode] inviteCode=" + inviteCode);
        UIFrame.showTips("正在加入俱乐部，请稍候...");
        try {
            AppWebApi.joinClubByInviteCode(inviteCode, function(err, resp) {
                _self._joinClubSubmitting = false;
                if (err) {
                    var msg = (err && err.errorMessage) ? err.errorMessage : "加入失败，请检查网络";
                    if (err && err.raw && typeof err.raw === "string" && err.raw.length > 0) {
                        try {
                            var p = JSON.parse(err.raw);
                            if (p && p.msg) msg = p.msg;
                        } catch (e) {}
                    }
                    UIFrame.showTips(msg);
                    if (done) done(false);
                    return;
                }
                if (!resp) {
                    UIFrame.showTips("服务器无响应");
                    if (done) done(false);
                    return;
                }
                if (Number(resp.code) !== 0) {
                    UIFrame.showTips(resp.msg || ("加入失败 code=" + resp.code));
                    if (done) done(false);
                    return;
                }
                var parsed = HallClubCacheData.mapJoinClubRsp(resp) || {};
                var joined = parsed.joined === true;
                var finalClubId = parsed.clubId || (parsed.club && parsed.club.nClubId) || 0;
                if (!finalClubId || finalClubId < 1000000) {
                    UIFrame.showTips("加入成功，但俱乐部数据异常，请重新进入页面");
                    if (done) done(false);
                    return;
                }
                QYLogs.log(TAG, "[_doJoinByInviteCode] 成功 parsed.joined=" + parsed.joined + " clubId=" + finalClubId + " memberCount=" + (parsed.memberCount||0) + " myIdentify=" + (parsed.myIdentify||0));
                _self._myClubInfoParsed = {
                    state: "club",
                    inClub: true,
                    club: parsed.club || { nClubId: finalClubId }
                };
                try { _self._destroyRecommendContainer(); } catch (e) {}
                UIFrame.showTips(joined ? "加入俱乐部成功！" : "你已在该俱乐部，正在进入");
                if (_self._recommendListData && idx != null && _self._recommendListData[idx]) {
                    _self._recommendListData[idx].nStatus = 2;
                    _self._recommendListData[idx].joined = true;
                    if (parsed.memberCount) _self._recommendListData[idx].nUserCnt = parsed.memberCount;
                }
                if (done) done(true);
                _self.scheduleOnce(function() {
                    try {
                        _self._destroyRecommendContainer();
                          _self._myClubInfoParsed = null;
                          _self._fetchMyClubInfoAndInitUI("join_success");
                    } catch (e) {
                          QYLogs.error(TAG, "[_doJoinByInviteCode] 刷新俱乐部信息失败: " + e.message);
                    }
                }, 0.2);
            });
        } catch (e) {
            _self._joinClubSubmitting = false;
            UIFrame.showTips("加入失败：" + e.message);
            if (done) done(false);
        }
    },

});
