// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: 对话框控件
// ]]

let UIBase = require("UIBase");
let Utils = require("Utils");

//对话框类型
let EShowType = cc.Enum({
    OKCANCEL: 0,    // 确认/取消
    OK: 1,          // 确认
    CANCEL: 2,      // 取消
    TIPS: 3,        // 提示
});

cc.Class({
    extends: UIBase,

    statics: {
        EShowType: EShowType,
    },

    properties: {
        //界面显示动作
        showType: {
            default: EShowType.OKCANCEL,
            type: cc.Enum(EShowType),
        },
        labelText: cc.Label,
        labelTitle: cc.Label,

        btnOK: cc.Button,
        btnCancel: cc.Button,
        btnExit: cc.Button,
        btnOKTips: cc.Button,
        left: cc.Node,
        right: cc.Node,
        center: cc.Node,
        label_confirm: cc.Node,
        _isOK: false,
        _callback: null,
        _onRollbackHandler: null,

    },
    onStart () {
        this._initDialog()
    },
    _initDialog(){
        cc.log("_initDialog");
        //文本颜色
        // let color16 = "#AFC8FA";
        // if (this.itemName=="mahjong") {
        //     color16 = "#092721";//麻将
        // }else if (this.itemName=="niuniu") {
        //     color16 = "#452511";//牛牛
        // }else if (this.itemName=="blackjack") {
        //     color16 = "#433e73";//21点
        // }else if (this.itemName=="baijiale") {
        //     color16 = "#343f8b";//百家乐
        // }else if (this.itemName=="zhajinhua") {
        //     color16 = "#6d4d36";//炸金花
        // }else if (this.itemName=="sangong" || this.itemName=="paijiu" || this.itemName=="erbagang") {
        //     color16 = "#4f2419";//三公、牌九、二八杠
        // }else if (this.itemName=="gaobo") {
        //     color16 = "#FFFFFF";//高搏
        // }else if (this.itemName=="PokDeng") {
        //     color16 = "#FFFFFF";//博灯
        // }
        this.labelText.node.active = true;
        this.btnOK.node.active = true;
        this.btnCancel.node.active = true;
        this.btnOK.node.position = this.right.position;
        this.btnCancel.node.position = this.left.position;
        // if(this.btnExit){
        //     this.btnExit.node.active = false
        // }
        if(this.btnOKTips){
            this.btnOKTips.node.active = false
        }

        if (this.label_confirm) {
            let color16 = app.isCCLive()?"#EB0707":"#000000";
            var color = cc.Color.BLACK;
            let curColor = color.fromHEX(color16);
            this.label_confirm.color = new cc.Color(curColor.r,curColor.g,curColor.b);
        }

        let bg = null
        let tipsBg = null
        let tips_title = null
        if(this.content){
            bg = this.content.getChildByName("bg")
            tipsBg = this.content.getChildByName("tipsBg")
            tips_title = this.content.getChildByName("tips_title")
            if(bg){
                bg.active = true
            }
            if(tipsBg){
                tipsBg.active = false
            }
            if(tips_title){
                tips_title.active = true
            }
        }

        switch (this.showType) {
            case EShowType.OKCANCEL:
                // this.btnOK.node.position = this.center.position;
                // this.btnCancel.node.active = false;
                break;
            case EShowType.OK:
                this.btnOK.node.position = this.center.position;
                this.btnCancel.node.active = false;
                if(bg){
                    bg.active = true
                }
                break;
            case EShowType.CANCEL:
                this.btnCancel.node.position = this.center.position;
                this.btnOK.node.active = false;
                if(bg){
                    bg.active = true
                }
            case EShowType.TIPS:
                if(tipsBg){
                    tipsBg.active = true
                    if(bg){
                        bg.active = false
                    }
                }
                if(tips_title){
                    tips_title.active = true
                }
                if(this.btnOKTips){
                    this.btnOKTips.node.active = true
                    this.btnCancel.node.active = false;
                    this.btnOK.node.active = false;
                }else{
                    this.btnOK.node.position = this.center.position;
                    this.btnCancel.node.active = false;
                }
            default:
                break;
        }
    },
    _resetBaseData(){
        this._super();
        this.showType = EShowType.OKCANCEL;
        this._callback = null;
        this._onRollbackHandler = null;
        this._isOK = false;
        this.labelText.string = "";
    },
    updateSpriteFrame(node,atlas,str) {
        let spriteFrame = atlas.getSpriteFrame(str);
        if(spriteFrame){
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            node.active = true;
        }
    },
    setBtnText(type, okText, cancelText) {
        this.showType = type
        if(okText) {
            this.btnOK.node.getChildByName('label_confirm').getComponent("LabelLocalized").string = okText
        }
        if(cancelText) {
            this.btnCancel.node.getChildByName('label_cancel').getComponent("LabelLocalized").string = cancelText
        }
        this._initDialog()
    },
    setShowType(value){
        this.showType = value;
        this._initDialog()
    },
    //设置文本的水平对齐模式
    setTextHorizontalAlign(value){        
        this.labelText.horizontalAlign = value;
    },
    /**
     * @param callback(isOK)
     * @return {Boolean} [doNotClose=false]
     */
    show(text, callback, titleText){
        QYLogs.log("UIDialog", "show: text, titleText=", text, titleText);
        this.labelText.node.active = true;
        this.labelText.string = text;
        if (titleText && titleText != "")
        {
            this.labelTitle.string = titleText;
        }

        this._callback = callback;
    },

    showTitle(titleText)
    {   

        if (titleText && titleText != "")
        {
            this.labelTitle.string = titleText;
        }

    },

    onClickBtn(event){
        this._isOK = event.target.name == "btnOK" ? true : false;
        this.close();
    },

    onClose(){
        if(null!=this._callback){
            if (this.showType==EShowType.OK || this.showType==EShowType.CANCEL) {
                this._isOK = true;
            }
            this._callback(this._isOK);
        }
        app.ui.removePopup(this.name);
    },

    setRollbackHandler(handler){
        this._onRollbackHandler = handler;
    },
    onRollback(event, data){
        if(this._onRollbackHandler){
            this._isOK = (data == "1") ? true : false;
            this._onRollbackHandler(this._isOK);
        }
        else{
            this._isOK = false;
            this.close();
        }
    },
});
