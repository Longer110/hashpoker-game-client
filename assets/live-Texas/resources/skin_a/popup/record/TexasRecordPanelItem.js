// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let CMD = require("protocol_texas");
let Hall_CMD = require("protocol_hall");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        infoContent: cc.Node,

        nRecord: cc.Node,//战绩
        nRecordNum: cc.Label,//牌局编号
        nTime: cc.Label,//时间
        nBet: cc.Label,//下注
        nProfit: cc.Label,//派彩
        nDownBtn: cc.Node,//下拉按钮

        btnArry: {//按钮
            default: [],
            type: cc.SpriteFrame
        },

        itemInfoPrefab:{//详情预制
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    _createRecordItem:function(control,data){
        cc.log("_createRecordItem data:",data);

        if (data) {
            this.nRecord.active = true;

            if(TexasUtils._getSkin(["default"])){
                this.nDownBtn.getChildByName("sp").getComponent(cc.Sprite).spriteFrame = this.btnArry[0];
            }else{
                this.nDownBtn.getComponent(cc.Sprite).spriteFrame = this.btnArry[0];
            }
            
            this.infoContent.destroyAllChildren();

            let sSeriesNumber = data.sSeriesNumber;//牌局编号
            let sTime = data.sTime;//时间
            let nBet = data.nBet;//下注
            let nWin = data.nWin;//派彩
            let Id = data.Id;//记录id. (最大的就是最近的记录)

            this.infoContent.active = false;

            this.nRecordNum.string = sSeriesNumber; //牌局编号
            this.nTime.string = sTime;//时间

            if (control) {
                control._setConverNumber(this.nBet,nBet);//下注
                control._setConverNumber(this.nProfit,nWin,true);//派彩
            }

            //注册按钮
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "TexasRecordPanelItem";
            clickEventHandler.handler = "onClickBtnItem";
            clickEventHandler.customEventData = data.sSeriesNumber;
            let button = this.nDownBtn.getComponent(cc.Button);
            button.clickEvents = [];
            button.clickEvents.push(clickEventHandler);
        }
    },

    //构建牌局详情
    _creatrRecordInfo(control,data) {
        cc.log("_creatrRecordInfo data:",data);

        this.infoContent.destroyAllChildren();

        if (data.arrItem && data.arrItem.length>0) {
            let sSeriesNumber = data.sSeriesNumber;//牌局编号
            let arrCommunityCards = data.arrCommunityCards;//公共牌

            let newData = [];
            if (arrCommunityCards.length>0) {
                newData = [{arrHoleCards:arrCommunityCards, nBet:null, nWin:null}];
            }

            let arrItem = data.arrItem;//牌局各玩家记录

            for (let i=0; i<arrItem.length; i++) {
                newData.push(arrItem[i]);
            }

            for (let j=0; j<newData.length; j++) {
                let prefab = cc.instantiate(this.itemInfoPrefab);
                let itemInfoPrefab = prefab.getComponent("TexasInfoItem");
                itemInfoPrefab.createInfoItem(control,newData[j]);
                this.infoContent.addChild(prefab);
                prefab.active = true;
            }
            

        }

    },

    //item点击回调
    onClickBtnItem(event, customEventData) {
        cc.log("onClickBtnItem:",customEventData,this.infoContent.active);

        if (!this.infoContent.active) {
            let data = {
                sSeriesNumber: customEventData,//牌局编号
            };
            cc.warn("-------------------------------------------------------------------------------------德州牌局详情请求:",data);
            //app.net.send(CMD.Texas.value, CMD.Texas.DeZhouRecordDetailReq_CMD, data);
            app.net.send(Hall_CMD.Main_CMD.value, Hall_CMD.Main_CMD.LobbyDeZhouRecordDetailReq_CMD, data);
        }

        this.infoContent.active = this.infoContent.active?false:true;
        if(TexasUtils._getSkin(["default"])){
            this.nDownBtn.getChildByName("sp").getComponent(cc.Sprite).spriteFrame = !this.infoContent.active?this.btnArry[0]:this.btnArry[1];
        }else{
            this.nDownBtn.getComponent(cc.Sprite).spriteFrame = !this.infoContent.active?this.btnArry[0]:this.btnArry[1];
        }
    },

});
