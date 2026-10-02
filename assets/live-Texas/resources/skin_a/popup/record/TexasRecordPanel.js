let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
let i18n = require("i18n");
let Utils = require("Utils");
let TexasUtils = require("TexasUtils");
let ConfigGame = require("ConfigGame");
let TexasBase = require("TexasBase");
let MSG_HALL = require("Msg_hall");
let Hall_CMD = require("protocol_hall");

cc.Class({
    extends: TexasBase,

    properties: {
        ncontent: cc.Node,

        scrollView: cc.ScrollView,
        scontent: cc.Node,
        nullRecord: cc.Node,
        itemObject: cc.Node,

        nRecordNum: cc.Label,//牌局编号
        nTime: cc.Label,//时间
        nBet: cc.Label,//下注
        nProfit: cc.Label,//派彩

        _reqCount: 10,//单次请求数目
        _indexPage: 0,
        _listLevelData: null,
        _isReq: true,//是否可请求
    },

    onLoad () {
        this._setText();

        MsgManager.on(MSG_HALL.LobbyDeZhouRecordRsp_CMD, this._onRepRecord, this);//最近牌局记录查询 回复
        MsgManager.on(MSG_HALL.LobbyDeZhouRecordDetailRsp_CMD, this._onRepRecordInfo, this);//牌局记录详情查询 回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouRecordRsp_CMD, this._onRepRecord, this);//最近牌局记录查询 返回
        MsgManager.on(MSG.ClubTexas.ClubDeZhouRecordDetailRsp_CMD, this._onRepRecordInfo, this);//牌局记录详情查询 返回
        MsgManager.on(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, this._isShowWindow, this);
    },

    onDestroy(){
        MsgManager.un(this._onRepRecord);
        MsgManager.un(this._onRepRecordInfo);
        MsgManager.un(this._isShowWindow);
    },

    onStart() {

    },

    onEnable(){
        if(cc.isValid(this.scrollView)){
            App.setAppSlideable(false);
            this.scrollView.node.on('scroll-to-bottom', this.updateScrollView, this);
        }
    },
    onDisable(){
        if(cc.isValid(this.scrollView)){
            App.setAppSlideable(true);
            this.scrollView.node.off('scroll-to-bottom', this.updateScrollView, this);   
        }
    },

    _setText() {
        if (TexasUtils._getSkin(["default","b","c","d"])) {
            this.nRecordNum.string = TexasUtils._getText(52)//牌局编号
            this.nTime.string = TexasUtils._getText(53)//时间
            this.nBet.string = TexasUtils._getText(54)//下注
            this.nProfit.string = TexasUtils._getText(55)//派彩
        }
    },

    //初始化列表
    _initRecordList(gameControl) {
        this.initChat();

        this.gameControl = gameControl;
        this._listLevelData = [];
        
        this._reqCount = 10;
        this._indexPage = 0;
        this._isReq = true;
        this.scontent.destroyAllChildren();
        this._getLevelDataNextPage();

        this.nullRecord.getComponent(cc.Label).lang = "COMMON.ZAN_WU_ZHAN_JI_XIN_XI";
        this.nullRecord.active = false;

        this.scrollView.scrollToTop(0.1);
    },

    //更新scrollView
    updateScrollView() {
        if (this._isReq) {
            this._getLevelDataNextPage();
        }
    },

    _getLevelDataNextPage(){
        let data = {
            nQueryCnt: this._reqCount,//查询记录的返回条数(最多50)
            nMinId: this._indexPage,//(分页查询时,需要填上一次结果的最后一条记录id,即是最小的id)
        };
        cc.warn("-------------------------------------------------------------------------------------德州战绩查询请求:",data);
        //app.net.send(CMD.Texas.value, CMD.Texas.DeZhouRecordReq_CMD, data);
        app.net.send(Hall_CMD.Main_CMD.value, Hall_CMD.Main_CMD.LobbyDeZhouRecordReq_CMD, data);
        
        if (this._indexPage!=0) {
            this._blockIndex = UIFrame.showBlock(i18n.t("HALL.REQUESTDATA"), true, function (params) {
                UIFrame.showTips(i18n.t("HALL.REQUESTTIMEOUT"));
            }, 5);
        }
    },

    //战绩查询返回
    _onRepRecord(data) {
        cc.warn("-------------------------------------------------------------------------------------德州战绩查询返回:",data);

        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
        }

        this._indexPage = data.nMinId;//最后一条记录id,用于查询下一页,如果需要

        this.nullRecord.active = false;
        if(data.arrItem && data.arrItem.length>0){
            let len = data.arrItem.length;

            if (len<this._reqCount) {
                this._isReq = false;
            }

            this._listLevelData = data.arrItem;//已排序记录
        }else {
            this._isReq = false;
        }

        let len = this._listLevelData?this._listLevelData.length:0;
        if (len<=0) {
            this.nullRecord.active = true;
        }else {
            this.nullRecord.active = false;
            if (this._listLevelData) {
                this.updataRecordList(this._listLevelData);
            }
        }
    },

    updataRecordList(data) {
        for (let i=0; i<data.length; i++) {
            let prefab = cc.instantiate(this.itemObject);
            prefab.name = "recordNum" + data[i].sSeriesNumber;
            let itemPrefab = prefab.getComponent("TexasRecordPanelItem");
            itemPrefab._createRecordItem(this,data[i]);
            this.scontent.addChild(prefab);
            prefab.active = true;
        }

        this.scontent.getComponent(cc.Layout).updateLayout()
    },

    //牌局详情查询
    _onRepRecordInfo (data) {
        cc.warn("-------------------------------------------------------------------------------------德州牌局详情查询返回:",data);
        
        let sSeriesNumber = data.sSeriesNumber;//牌局编号

        let recordItem = this.scontent.getChildByName("recordNum" + sSeriesNumber);
        if (recordItem) {
            let TexasRecordPanelItem = recordItem.getComponent("TexasRecordPanelItem");
            TexasRecordPanelItem._creatrRecordInfo(this,data);
        }
    },

    //设置接口
    _setConverNumber(text,Num,isColor) {
        let nProfit = Num;
        if (Num) {
            // if(ConfigGame.ISLIVE){
            //     nProfit = Utils.convertNumberToStr2(Number(Num)) || "0";
            // }else{
            //     nProfit = Utils.convertNumberToStr(Number(Num)) || "0";
            // }

            nProfit = TexasUtils._saveTwoPoint(Number(Num));
        }

        let sign = isColor?"+":"";
        text.string = Number(Num)>0?sign + nProfit:nProfit;//派彩

        if (isColor) {
            let color16 = "#2ec046";
            if(Number(Num)>=0) {
                color16 = "#cc3c3c";
            }
    
            var color = cc.Color.BLACK;
            let curColor = color.fromHEX(color16);
            text.node.color = new cc.Color(curColor.r,curColor.g,curColor.b);
        }
    },

    //是否显示弹窗
    _isShowWindow(data) {
        let nRlt = data.nRlt;
        if (nRlt==0) {
            this.node.active = false;
        }
    },

    onClickBtn() {
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);

        //关闭界面
        this.node.active = false;

        MsgManager.fire(MSG.NOTIFY.NOTIFY_SHOW_ROOM_CONFIG);
    },

});
