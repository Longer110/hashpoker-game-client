// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let UIBase = require("UIBase");

cc.Class({
    extends: UIBase,

    properties: {
        GMNode: cc.Node,//GM命令框
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onStart () {
        //获取焦点
        let inputEditBox = this.GMNode.getComponent(cc.EditBox);

        //inputEditBox.string = "";

        inputEditBox.focus();
    },

    // update (dt) {},

    setCallBack(callback) {
        this.callBacks = callback;
    },
    
    //检测验证
    _checkVerification() {
         //console.log("_checkVerification");

        let inputEditBox = this.GMNode.getComponent(cc.EditBox).string;

        if (!inputEditBox) {
            UIFrame.showTips("输入命令不能为空！");
            return false;
        }

        return true;
    },

    //点击GM确定
    onClickBtnGMQD() {
         //console.log("onClickBtnGMQD");

        let inputEditBox = this.GMNode.getComponent(cc.EditBox);
        inputEditBox.focus();

        if (!this._checkVerification()) return;

        UIFrame.showTips(String(inputEditBox.string));

        let passWord = String(inputEditBox.string);

        if (this.callBacks) {
            this.callBacks(passWord);
        }

        //inputEditBox.string = "";
        
        this.close();
    }, 

    onClickBtnBlock() {
        let inputEditBox = this.GMNode.getComponent(cc.EditBox);
        inputEditBox.focus();
    },


});
