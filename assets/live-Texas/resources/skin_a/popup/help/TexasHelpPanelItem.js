// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let i18n = require("i18n");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {

        helpText: cc.RichText, 

        _panel: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setControl(control) {
        this._panel = control;
    },

    // update (dt) {},

    createHelpItem:function(data){
        if (data.indexOf("[CUSTOM]")!=-1) {//自定义类型
            if (this._panel) {
                let callBackNode = this._panel.createNodeCallback(this.node, data);
                this.node.getComponent(cc.Label).enabled = false;
                // this.node.width = callBackNode.width;
                this.node.height = callBackNode.height;
            }
        }else {
            if (TexasUtils._getSkin(["b","c","d"]) && data.indexOf("<size=26>")!=-1) {
                data = data.replace(/<size=26>/, "<size=30>");
            }

            this.helpText.enabled = true;
            this.helpText.lang = data;
            if(this.helpText.string==""){
                this.helpText.enabled = false;
                this.node.height = 10;
            }
        }
        
    },


});
