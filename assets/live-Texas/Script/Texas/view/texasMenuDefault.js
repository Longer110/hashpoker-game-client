let TexasUtils = require("TexasUtils");
let ConfigGame = require("ConfigGame");
let LocalStorage = require("LocalStorage");
let TexasData = require("TexasData");

const colorWhite = new cc.Color(232,223,209,255);//白色
const colorGray = new cc.Color(101,119,139,255); //灰色

cc.Class({
    extends: cc.Component,

    properties: {
        panel: cc.Node,
        panelPosition: cc.Node,
        block: cc.Node,
        
        _offsetX: 0,
    },

    onLoad() {
        this.hide();
    },

    onDestroy() {

    },


    //初始化菜单
    _initMenu(control) {
        this.control = control;
        console.log("初始化菜单");
        
        this._setCarry(false);
    },

    //设置带出按钮
    _setCarry(visible) {
        this.panel.getChildByName("list1").getChildByName("btnCarry").active = visible;
       
    },


    //设置站起坐下的按钮显示，isStandDown:是否在桌子上坐下
    _setMenuBtnActive(isStandDown){
        //  if (this.control._controller._isPlayBack) {
        //     return;
        // }
        let listNode = this.panel.getChildByName("list1")
        listNode.getChildByName("stopNode").active = false;
        listNode.getChildByName("closeTableNode").active = false;
        listNode.getChildByName("changTable").active = false;
        
        listNode.getChildByName("btnCarry").active = isStandDown && TexasData._getIsCarry();
        // listNode.getChildByName("standNode").getChildByName('text').color = isStandDown ? colorWhite : colorGray;
        listNode.getChildByName("sitdownNode").getChildByName('text').color = !isStandDown ? colorWhite : colorGray;
        listNode.getChildByName("btnBuy").getChildByName('text').color = isStandDown ? colorWhite : colorGray;
        listNode.getChildByName("occupiedNode").getChildByName('text').color = isStandDown ? colorWhite : colorGray;
        listNode.getChildByName("btnBuy").getChildByName('btnMask').active = !isStandDown;
        listNode.getChildByName("occupiedNode").getChildByName('btnMask').active = !isStandDown;
        listNode.getChildByName("btnCarry").getChildByName('text').color = isStandDown ? colorWhite : colorGray;

        // listNode.getChildByName("hallNode").getChildByName('btnMask').active = isStandDown;
        // listNode.getChildByName("hallNode").getChildByName('text').color =  !isStandDown ? colorWhite : colorGray;



        //12.17 需求更改，只展示：邀请，设置，游戏规则，留桌离桌，退出房间，站起旁观
        listNode.getChildByName("sitdownNode").active = false
        listNode.getChildByName("standUpNextRound").active = false
        listNode.getChildByName("cancleStandUpNextRound").active = false
        listNode.getChildByName("btnBuy").active = false
        listNode.getChildByName("btnCarry").active = false
        listNode.getChildByName("stopNode").active = false
        
        

    },



    onClickBtn(event,data){
        this.control.onClickBtn(event,data)
    },

    setNextRoundBtnShow(isNextUpBo,isCloseNextUpBo, isNextUpMask){ //isNextUpBo:下局站起，isCloseNextUpBo：取消下局站起

        let listNode = this.panel.getChildByName("list1")
        listNode.getChildByName("standUpNextRound").active = false
        listNode.getChildByName("cancleStandUpNextRound").active = false
        
        // let listNode = this.panel.getChildByName("list1")
        // let stopNode = listNode.getChildByName("standUpNextRound")
        // let closeTableNode = listNode.getChildByName("cancleStandUpNextRound")
        // if(isNextUpBo) {
        //     stopNode.active = true;
        //     closeTableNode.active = false;
        //     //下局站起按钮点击状态
        //     if(isNextUpMask){
        //         stopNode.getChildByName('text').color = colorGray;
        //         stopNode.getChildByName('btnMask').active = true;
        //     }else{
        //         stopNode.getChildByName('text').color = colorWhite;
        //         stopNode.getChildByName('btnMask').active = false;
        //     }
            
        // }else if(isCloseNextUpBo){
        //     closeTableNode.active = true;
        //     stopNode.active = false;
        // }
        // // listNode.getChildByName("standUpNextRound").active = isNextUpBo;
        // // listNode.getChildByName("cancleStandUpNextRound").active = isCloseNextUpBo;
    },

    //设置返回大厅和离桌留座按钮
    setHallMenuControl() {
        let hallNode = this.panel.getChildByName("list1").getChildByName("hallNode");
        let occupiedNode = this.panel.getChildByName("list1").getChildByName("occupiedNode");
        let isSelfParticipating = TexasData._getSelfParticipating();
        hallNode.active = true;
        occupiedNode.active = true;
        let isSelfDown = TexasData._getUserState()
        if(isSelfParticipating){
            // hallNode.getChildByName('text').color = colorGray;
            // hallNode.getChildByName('btnMask').active = true;
            occupiedNode.getChildByName('text').color = colorGray;
            occupiedNode.getChildByName('btnMask').active = true;
        }else {
            // hallNode.getChildByName('text').color = colorWhite;
            // hallNode.getChildByName('btnMask').active = false;
            if(isSelfDown){
                occupiedNode.getChildByName('text').color = colorWhite;
                occupiedNode.getChildByName('btnMask').active = false;
            }
        }
    },

    //更新礼物特效开关
    updateRoomGift() {
        let effectValue = app.storage.getItem("Texas_gift_effect","off");
        
        let giftClose = this.giftText.getChildByName("giftClose");//关礼物
        let giftOpen = this.giftText.getChildByName("giftOpen");//开礼物

        if(effectValue=="on"){
            giftOpen.active = true;
            giftClose.active = false;
        }else{
            giftOpen.active = false;
            giftClose.active = true;
        }
    },

    //更新房间语音开关
    updateRoomVoice(){
        let voiceValue = app.storage.getItem("Texas_room_voice","off");

        let voiceClose = this.voiceText.getChildByName("voiceClose");//关语音
        let voiceOpen = this.voiceText.getChildByName("voiceOpen");//开语音

        if(voiceValue=="on"){
            voiceOpen.active = true;
            voiceClose.active = false;
        }else{
            voiceOpen.active = false;
            voiceClose.active = true;
        }
    },


    _setCardTypeNode(visible) {
        if (this.cardTypeNode) {
            this.cardTypeNode.spriteFrame = visible?this.cardTypeNodeSpriteFrame[1]:this.cardTypeNodeSpriteFrame[0];
        }
    },

     //贡献榜
     onClickBtnContribute() {
        cc.log("点击贡献榜");

        this._closeMenu();

        TexasUtils.toggleGongXianBang();
    },

    //屏蔽消息
    onClickBtnBlockMessages() {
        cc.log("点击屏蔽消息");

        this._closeMenu();

        TexasUtils.shieldRewardMessage();
    },

    //管理列表
    onClickBtnManageList() {
        cc.log("点击管理列表");

        this._closeMenu();

        TexasUtils.manageList();
    },

    //管理规则
    onClickBtnManagementRule() {
        cc.log("点击管理规则");

        this._closeMenu();

        TexasUtils.manageRule();
    },

    //管理功能
    onClickBtnManageJob() {
        cc.log("点击管理功能");

        this._closeMenu();

        TexasUtils.manageFunction();
    },

    //邀请好友
    onClickBtnInviteFriends() {
        cc.log("点击邀请好友");

        this._closeMenu();

        TexasUtils.inviteFriends();
    },

    //申请列表
    onClickBtnApplicationList() {
        cc.log("点击申请列表");

        this._closeMenu();

        this._setRedPoint(false);
        TexasUtils.applyList();
    },

    //分享
    onClickBtnShare() {
        cc.log("点击分享");

        this._closeMenu();

        TexasUtils.share();
    },


    onClickBtnStandUpNextRound(){
        this.control._onClickBtnStandUpNextRound()
        this._closeMenu();
    },

    onClickBtnCancelStandUpNextRound(){
        this.control._onClickBtnCancelStandUpNextRound()
        this._closeMenu();
    },

    //关闭菜单
    _closeMenu() {
        if (this.control) {
            this.control._closeMenu();
        }
    },

    //房间声音
    onClickBtnVoice(){
        let isOpen = false;

        let voiceClose = this.voiceText.getChildByName("voiceClose");//关语音
        let voiceOpen = this.voiceText.getChildByName("voiceOpen");//开语音
        if (voiceOpen.active && !voiceClose.active) {
            voiceOpen.active = false;
            voiceClose.active = true;
        }else {
            isOpen = true;
            voiceOpen.active = true;
            voiceClose.active = false;
        }

        let value = isOpen?"on":"off";
        TexasUtils.toggleRoomVoice(isOpen,value);
    },

    //礼物效果
    onClickGiftEffect(){
        let isOpen = false;

        let giftClose = this.giftText.getChildByName("giftClose");//关礼物
        let giftOpen = this.giftText.getChildByName("giftOpen");//开礼物
        if (giftOpen.active && !giftClose.active) {
            giftOpen.active = false;
            giftClose.active = true;
        }else {
            isOpen = true;
            giftOpen.active = true;
            giftClose.active = false;
        }

        let value = isOpen?"on":"off";
        TexasUtils.toggleGiftEffect(isOpen,value);
    },

    //红点
    _setRedPoint(isShow) {
        cc.log("_setRedPoint isShow:",isShow);

        if (!TexasUtils._getSkin(["default","d"])) return;

        let redPoints = this.applicationListText.getChildByName("redPoints");
        redPoints.active = isShow;
    },

    show() {
        if (this.block.active) return;
        this.block.active = true;
        if (TexasUtils._getSkin(["b"])) {
            this.panel.active = true;
        }else if (TexasUtils._getSkin(["c"])) {
            this.panel.active = true;
            let list = this.panel.getChildByName("list1");

            // let nHeight = list.height;
            let nWidth = list.width
            list.x = -nWidth;
            // list.y = nHeight;

            let seq = cc.sequence(
                cc.moveTo(0.15, 0, list.y),
                cc.callFunc(function (params) {
                    
                }, this)
            )
            list.stopAllActions();
            list.runAction(seq);
        }else {
            let pos = cc.v2(this.panelPosition.x, this.panel.y);
            let seq = cc.sequence(
                cc.moveTo(0.5, pos).easing(cc.easeBackOut()),
                cc.callFunc(function (params) {
                    
                }, this)
            )
            this.panel.active = true;
            this.panel.stopAllActions();
            this.panel.runAction(seq);
        }
    },

    hide() {
        this.panel.active = false;
        this.block.active = false;
        this.panel.setPosition(this.panelPosition.x + this.panelPosition.width, this.panel.y);
    },

    close() {
        if (!this.block.active) return;
        this.block.active = false;

        if (TexasUtils._getSkin(["b"])) {
            this.panel.active = false;
        }else if (TexasUtils._getSkin(["c"])) {
            let list = this.panel.getChildByName("list1");

            let nHeight = list.height;
            let nWidth = list.width
            list.x = 0;
            // list.y = 0;
            
            let seq = cc.sequence(
                cc.moveTo(0.15, -nWidth, list.y),
                cc.callFunc(function (params) {
                    this.panel.active = false;
                }, this)
            )
            list.stopAllActions();
            list.runAction(seq);
        }else {
            let pos = cc.v2(this.panelPosition.x + this.panelPosition.width, this.panel.y);
            let seq = cc.sequence(
                cc.moveTo(0.5, pos).easing(cc.easeBackIn()),
                cc.callFunc(function (params) {
                    this.panel.active = false;
                }, this)
            )
            this.panel.stopAllActions();
            this.panel.runAction(seq);
        }
    },

});