// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const i18n = require('i18n');
let UIFrame = require("UIFrame");
let CMD = require("protocol_texas");
let TexasData = require("TexasData");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        magic: cc.Node,

        nGold: cc.Label,

        magicFaceAtlas: {//魔法表情
            default: null,
            type: cc.SpriteAtlas,
        },

       
        _canClick: true,//1s重复点击判断
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },


    // update (dt) {},

    createMagicFace(control,magicData,targetID){
        cc.log("createMagicFace index,targetID:",index,targetID);
        
        this.control = control;

        let node = this.magic?this.magic:this.node;
        // if (index > 6 && TexasUtils._getClub() ){
        //     node.getComponent(cc.Sprite).spriteFrame = this.magicSpriteFrame[index - 1 - 6];
        // }else{
        //     TexasUtils._getSpriteFrame(this.magicFaceAtlas,node,index);
        // }
        let index = magicData.nChatId;
        node.getComponent(cc.Sprite).spriteFrame = control.magicSpriteFrame[index - 1];
        if (this.nGold) {
            // this.nGold.string = TexasUtils._saveTwoPoint(TexasData._getMagicGold(index));
            this.nGold.string = magicData.nCost;
        }
        let data = {
            magicFace: index,
            targetID: targetID,
        }

        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; 
        clickEventHandler.component = "texasMagicFaceItem";
        clickEventHandler.handler = "onClickBtnFace";
        clickEventHandler.customEventData = data;
        
        let button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    },




    //点击表情
    onClickBtnFace(event, customEventData) {

        if (!this._canClick) {
            UIFrame.showTips("操作过于频繁，请稍后再试");
            return;
        }
        this._canClick = false;
        this.scheduleOnce(() => {
            this._canClick = true;
        }, 1);

        cc.log("onClickBtnFace customEventData:",customEventData);

        if (this.control) {
            let control = this.control;
            let faceControl = control._getMagicFaceController();

            cc.log("_checkIsSameUser faceControl._isSameUser:",faceControl._isSameUser);
            if (faceControl._isSameUser) {//对同一玩家的技能冷却时间未解锁
                UIFrame.showTips(i18n.t("COMMON.MAGIC_EXPRESSION_COOL_TIME_AND"));

                return;
            }

            faceControl._stopUpdate();//停止定时器
            faceControl._setActionSchedule(2);//定时技能冷却时间
        }

        if (customEventData) {
            let targetID = customEventData.targetID;
            let targetSitId = this.control._getSitId(targetID);

            if (targetSitId) {
                let data = {
                    nChatId: customEventData.magicFace,//表情id
                    nTarget: targetSitId,//聊天对象
                    nType: 0,
                }
        
                let nStr = "魔法表情请求";
                // cc.warn("-----------------------------------------------------------------------------------------德州魔法表情请求:",data);
                if (TexasUtils._getClub()) {
                    TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouChatReq_CMD, data);
                    // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouChatReq_CMD, data);
                }else {
                    TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouChatReq_CMD, data);
                    // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouChatReq_CMD, data);
                }
            }else {
                if (TexasUtils._getClub()) {
                    UIFrame.showTips(i18n.t("COMMON.MAGIC_EXPRESSION_NO_USER"));

                    return;
                }
            }
        }

        this.control.node.active = false;
    },


});
