// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部牌局
let i18n = require("i18n");
let TAG = "club_game";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
      
        contentItem: {
            default: null,
            type: cc.Node
        },
        item: {
            default: null,
            type: cc.Node
        },
        scrollview: cc.ScrollView,
        prefab: cc.Prefab,
        noRecord: cc.Node,

        _recordList: []
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.scrollviewContent = this.scrollview.content;
        this.regiester();
        this.getClubGameRecord(0);
    },

    // update (dt) {},

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSTableRecordResp_ui, this._tableRecord, this);
        this.scrollview.node.on("scroll-ended", this._onScrollEnd, this);
    },

    onDestroy() {
        MsgManager.un(this._tableRecord);
        this.scrollview.node.off("scroll-ended", this._onScrollEnd, this);
    },

    onClickClose(){
        this.node.destroy();
    },

    getClubGameRecord(nIdOfStart){
        let clubId = HallClubCacheData.getCurLoginClub();
        let data = {
            nClubId: clubId,
            nIdOfStart: nIdOfStart,
            nCnt: 15,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSTableRecordReq_CMD, data);
        
    },

    initDataList(data){
        let totalHeight = 0;
        let lastTime = 0;
        let lastDateTime = 0;
        
        if (this._recordList.length > 0){
            totalHeight = this.scrollviewContent.height;
            lastTime = this._recordList[this._recordList.length - 1][0].timeArray;
            lastDateTime = lastTime;
        }

        for (let i = 0; i < data.length; i++) {
            let list = data[i];
            let iContent = cc.instantiate(this.contentItem);
            iContent.active = true;
            iContent.height = list.length * this.item.height;

            for (let k = 0; k < list.length; k++) {
                let time = list[k].timeArray;
                let tmpItem = this.createItem(list[k], time != lastTime);
                tmpItem.active = true;
                iContent.addChild(tmpItem);
                lastTime = time;
            }

            
            totalHeight = totalHeight + iContent.height;
            this.scrollviewContent.addChild(iContent);

            this._recordList.push(data[i]);
            lastDateTime = data[i][0].timeArray;
        }

        this.scrollviewContent.height = totalHeight + data.length * 20;
    },

    createItem(data, isShowDate){
        let tmpItem = cc.instantiate(this.item);
        let time = data.timeArray.split("-");
        let tableInfo = JSON.parse(data.sTableInfo);

        let club_record_bg = tmpItem.getChildByName("club_record_bg");
        if (isShowDate){
            club_record_bg.active = true;
        }else{
            club_record_bg.active = false;
        }

        let label_day = club_record_bg.getChildByName("label_day").getComponent(cc.Label);
        let label_month = club_record_bg.getChildByName("label_month").getComponent(cc.Label);
        let label_name = tmpItem.getChildByName("label_name").getComponent(cc.Label);
        let label_time = tmpItem.getChildByName("label_time").getComponent(cc.Label);
        let label_score = tmpItem.getChildByName("label_score").getComponent(cc.Label);

        label_day.string = time[2];
        label_month.string = time[1];
        label_name.string = Base64.decode(tableInfo.sTableName);
        let keepTime = tableInfo.nKeepTime/60;
        if (keepTime >= 60){
            label_time.string = Utils.replaceAll(i18n.t("CLUB_HALL.DAYS"), "XXX", keepTime/60); 
        }else{
            label_time.string = Utils.replaceAll(i18n.t("CLUB_HALL.MIN"), "XXX", keepTime); 
        }
        
        label_score.string = Utils.convertNumberToStr(tableInfo.nSmallBlind) + "/" + Utils.convertNumberToStr(tableInfo.nBigBlind);

        tmpItem.off(cc.Node.EventType.TOUCH_END);

        tmpItem.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(tableInfo);
         }.bind(this))

        return tmpItem;

    },

    onClickItem(data){
        let node = cc.instantiate(this.prefab);
        this.node.addChild(node);
        let com = node.getComponent("HallClubGamePlayer");
        if (com){
            com.init(data.sTableId);
        }
    },

    _tableRecord(data){
        if (data.arrRecords.length == 0 ){
            this._isEnd = true;
        }

        let record = [];
        let tmpRecord = [];
        let lastTime = "";
        for (let i = 0; i < data.arrRecords.length; i++) {
            let tmp = data.arrRecords[i];
            let timeArray = tmp.sTime.split(" ");
            tmp.timeArray = timeArray[0];
            if (lastTime == "" || lastTime == timeArray[0]){
                tmpRecord.push(tmp);
            }else{
                record.push(tmpRecord);
                lastTime = "";
                tmpRecord = [];
                tmpRecord.push(tmp);
            }

            if (i == (data.arrRecords.length-1)){
                record.push(tmpRecord);
            }

            lastTime = timeArray[0];
            this._nId = tmp.nId;
        }

        record.sort(function(a, b){
            return b.nId - a.nId;
        })

        this.initDataList(record);

        if (this._recordList.length == 0){
            this.noRecord.active = true;
        }else{
            this.noRecord.active = false;
        }
        
    },

    _onScrollEnd(){
        if (this._isEnd){
            return;
        }

        this.getClubGameRecord(this._nId)
    },
});
