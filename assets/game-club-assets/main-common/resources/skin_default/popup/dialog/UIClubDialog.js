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

let UIDialog = require("UIDialog");
let Utils = require("Utils");
let i18n = require('i18n');


cc.Class({
    extends: UIDialog,
    
    properties: {
        label_sure: cc.Label,
        label_cancel: cc.Label,
        label_title: cc.Label,
        richText: cc.RichText,

        _uiData: null,
    },
    _initDialog(){
        this._super();
    },

    setUIBtnTitle(data){
        if (data){
            if (data.sureTitle){
                this.label_sure.string = data.sureTitle;
            }else{
                this.label_sure.lang = "COMMON.RECOMMEND_PAENL.5";
            }

            if (data.cancelTitle){
                this.label_cancel.string = data.cancelTitle;
            }else{
                this.label_cancel.lang = "COMMON.CANCEL";
            }
        }else{
            this.label_sure.lang = "COMMON.RECOMMEND_PAENL.5";
            this.label_cancel.lang = "COMMON.CANCEL";
            this.label_title.lang = "COMMON.TIPS";
        }
    },

    showTitle(titleText)
    {   
        this._super(titleText);
    },

    show(text, callback, titleText, isUseRichText){
        QYLogs.log("UIClubDialog", "show: text, titleText=", text, titleText);

        this._super(text, callback, titleText);
        if (isUseRichText){
            this.richText.node.active = true;
            this.labelText.node.active = false;
            this.richText.string = text;
            this.labelText.string = "";
        }else{
            this.richText.node.active = false;
            this.labelText.node.active = true;
            this.richText.string = "";
            this.labelText.string = text;
        }
    }
    
});
