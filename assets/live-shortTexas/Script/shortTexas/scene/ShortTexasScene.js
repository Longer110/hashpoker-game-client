// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasScene = require("TexasScene");

let CMD = require("protocol_shortTexas");


let TexasUtils = require("TexasUtils");

cc.Class({
    extends: TexasScene,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
    },

    onDestroy(){
        this._super();
    },

    start () {
        this._super();
    }, 

    onEnable(){
        this._super();
    },

    onDisable(){
        this._super();
    },

    _setNode() {
        this._super();
        // this.panelContent = this.node.getChildByName("LayerView").getChildByName("content");
        // this.playerContent = this.panelContent.getChildByName("player");

        // let panel_top = this.panelContent.getChildByName("panel_top");
        // this.panel_bottom = this.panelContent.getChildByName("panel_bottom");
        // this.meunBtn = panel_top.getChildByName("menuBtn");
        
        // let list1 = this.panelContent.getChildByName("menu").getChildByName("content").getChildByName("menu_bg").getChildByName("list1");
        // this.sitDownBtn = list1.getChildByName("sitdownNode");
        // this.standUpBtn = list1.getChildByName("standNode");
        // this.TexasPaoMa = this.panelContent.getChildByName("paoma").getComponent("texasPaoMa")
        // this.TexasGameBottomTip = this.panelContent.getChildByName("TexasGameBottomTip").getComponent("TexasGameBottomTip")
        // this.TexasBuyTip = this.TexasGameBottomTip.contemtList[0].getComponent("texasBuyTip")
        // this.TexasTableCard = this.panelContent.getChildByName("tableCards").getComponent("TexasTableCard")
        // this.TexasOperatePanel = this.panelContent.getChildByName("operate").getComponent("TexasOperatePanel")
        // this.TexasPlayerController = this.panelContent.getChildByName("player").getComponent("TexasPlayerController")
        // this.TexasOperatePanel.TexasPlayerController = this.TexasPlayerController
        // this.TexasRewardPool = this.panelContent.getChildByName("rewardPool").getComponent("TexasRewardPool")
        // this.TexasMagicFaceController = this.panelContent.getChildByName("magicFaceController").getComponent("TexasMagicFaceController")
        // this.TexasRecord = this.panelContent.getChildByName("LayerRecord").getComponent("TexasRecordPanel")
        // this.TexasSetting = this.panelContent.getChildByName("LayerSetting").getComponent("TexasSettingPanel")
        // this.texasMenuDefault = this.panelContent.getChildByName("menu").getComponent("texasMenuDefault")
        // this.TexasCardType = this.panelContent.getChildByName("LayerCardType").getComponent("TexasCardType")
        // this.TexasProcess = this.panelContent.getChildByName("LayerTableProcess").getComponent("TexasProcess")
        // this.TexasGameReview = this.panelContent.getChildByName("LayerGameReview").getComponent("TexasGameReview")
        // this.TexasTableStop = this.panelContent.getChildByName("tableStop").getComponent("TexasTableStop")
        // this.TexasTableInfo = this.panelContent.getChildByName("LayerTableInfo").getComponent("TexasTableInfo")
        // this.TexasRecordVideo = this.node.getChildByName("LayerWidget").getChildByName("TexasRecordVideo").getComponent("TexasRecordVideo")
        // this.TexasRoomConfigPanel = this.panelContent.getChildByName("LayerRoomConfig").getComponent("TexasRoomConfigPanel")
        
        // let tableInfoNode = this.TexasTableCard.node.getChildByName("tableInfo")
        // this.tableInfo = tableInfoNode.getChildByName("label_mangzhu").getComponent(cc.Label);
        // this.clubTableInfo = tableInfoNode.getChildByName("layout").getChildByName("label").getComponent(cc.Label);
        // this.carryMax = tableInfoNode.getChildByName("label_carry").getComponent(cc.Label);
        // this.nGold = panel_top.getChildByName("infoBg").getChildByName("icon_gold").getChildByName("label").getComponent(cc.Label);
        // this.chipContent = this.panelContent.getChildByName("chip");
        // this.insureAni = this.panelContent.getChildByName("insureAni");
        // this.insureAni.active = false
        // this.chatNode = this.panelContent.getChildByName("chatNode");
        // this.timeAnim = this.panelContent.getChildByName("timeAnim");
        // this.btnVoice = this.panel_bottom.getChildByName("btnVoice");
        // this.label_pool = this.panelContent.getChildByName("tableInfo").getChildByName("poolSumBg").getChildByName("label_pool");
        // this.tipBlock = this.panelContent.getChildByName("block");
        // this.backNode = panel_top.getChildByName("backNode").getChildByName("backNode");
        // this.menuBtn = panel_top.getChildByName("mask").getChildByName("layout").getChildByName("menuBtn");
        // this.closeTableBtn = list1.getChildByName("closeTableNode");
        // this.occupyBtn = list1.getChildByName("occupiedNode");
        // this.stopBtn = list1.getChildByName("stopNode");
        // this.delayedBtn = this.panel_bottom.getChildByName("btnDelayed");
        // this.backSeatBtn = this.panelContent.getChildByName("backSeatBtn");
        // this.buyBtn = panel_top.getChildByName("btnBuy");
        // this.btnCarry = panel_top.getChildByName("btnCarry");
        // this.nChip = this.panelContent.getChildByName("chipPos");
        // this.nGenZhu = this.panelContent.getChildByName("genzhu");
        // this.nGolds = this.panelContent.getChildByName("gold");
        // this.middleCard = this.panelContent.getChildByName("middleCard");
        // this.bankIcon = this.panelContent.getChildByName("bankIcon");
        // this.menuPut = panel_top.getChildByName("btnPut");
        // this.youWin = this.panelContent.getChildByName("youwin");
        // this.panel_MTT = this.panelContent.getChildByName("mtt");
        // this.TexasMatchTip = this.node.getChildByName("LayerWidget").getChildByName("TexasMatchTip")
        // this.TexasMttCenterTip = this.panel_MTT.getChildByName("mttTip")
        // this.MttWaitStart = this.panel_MTT.getChildByName("mttWaitStart")
        // this.mttBuyChipBtn = this.panel_MTT.getChildByName("btn_mttBuyChip")
        // this.panelMttBuyChip = this.panelContent.getChildByName("LayerMttBuyChip")
        // this.panelMttRank = this.panelContent.getChildByName("LayerTableMatchRank")
        // this.standUpNextRoundTip = this.panelContent.getChildByName("LayerStandUpNextRoundTip");
        // this.infoBg = panel_top.getChildByName("infoBg")
        // this.insureBg = panel_top.getChildByName("insureBg")



        // itemChipPrefab: assets\live-Texas\Script\Texas\view\texasChip.prefab
       

        // itemCardPrefab: assets\live-Texas\Script\Texas\view\texasCard.prefab

        // itemTimePrefab: assets\live-Texas\Script\Texas\view\texasTimeAnim_c.prefab

        // itemTablePrefab: assets\live-Texas\Script\Texas\view\texasTableItem.prefab

        // inviteFriends: assets\live-Texas\resources\skin_c\popup\friends/TexasInviteFriends.prefab
        // HallRechargeNew: \assets\game-club-views\main-hall\Script\hall\view\game/HallRechargeNew.prefab

    },
    // update (dt) {},



    
    //请求撤码信息 , 短牌撤出和长牌不一致
    _onClickBtnCarry() {
        this._closeMenu();
        let nStr = "短牌撤码范围查看请求";
        TexasUtils._gameReqNotify(nStr, CMD.ShortTexas.value, CMD.ShortTexas.ClubDeZhouSCTakeOutInfoReq_CMD, {});
    },


    // 请求设置自动撤码
    _onClickSetAutoCarry(isAuto) {
        cc.log(" 短牌设置自动撤码");
        let nStr = "短牌设置自动撤码";
        let autoInt = isAuto ? 1 : 0 
        let data = {
            nIsAuto: autoInt, //double
            nAuto : 0
        }
        TexasUtils._gameReqNotify(nStr, CMD.ShortTexas.value, CMD.ShortTexas.ClubDeZhouSCTakeOutSetReq_CMD, data);
    },



    // 请求手动撤码
    _onClickBtnCarrySure(value) {
        cc.log("短牌 请求手动撤码 : " + value);
        this._closeMenu();
        if(Number(value) <= 0){
            return
        }
        let nStr = "短牌请求手动撤码";
        let data = {
            nValue: Number(value),
        }

        TexasUtils._gameReqNotify(nStr, CMD.ShortTexas.value, CMD.ShortTexas.ClubDeZhouSCTakeChipsOutReq_CMD, data);
    },
});
