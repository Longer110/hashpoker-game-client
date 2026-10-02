// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo");

cc.Class({
    extends: cc.Component,

    properties: {

        passEditBox: cc.EditBox,
        lookNode: cc.Node,
        errorNode: cc.Node,


        _inputText: '',
        _lookShow: false,
        _target: null,
        _data: null,
        _repEdit: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this._repEdit = new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&~_-])[A-Za-z0-9$@$!%*#?&~_-]{8,20}$')
        this._repEdit = new RegExp('[0-9]{6}')
    },

    // update (dt) {},
    setData(target, data) {
        if(target) this._target = target
    },
    
    OnClickClose(){
        this.node.destroy();
    },

    OnEditEndEvent(event, customData) {
        if(event.string) {
            if(this._repEdit.test(event.string)) {
                this._inputText = event.string
                this.errorNode.active = false
            }else {
                this._inputText = ''
                this.errorNode.active = true
            }
        }
    },


    OnClickCertain() {
        if(!this._inputText) {
            UIFrame.showTips('请输入正确的交易密码！')
            return
        }
        if(this._target && this._target.onInputPayPassword) {
            this._target.onInputPayPassword(this._inputText)
            this.OnClickClose()
        }
    },

    
    //设置输入显示模式
    OnClickPassShow(event, customData) {
        this._lookShow = !this._lookShow
        if(this._lookShow) {
            this.passEditBox.inputFlag = cc.EditBox.InputFlag.DEFAULT
            this.lookNode.getChildByName('hide').active = false
            this.lookNode.getChildByName('show').active = true
        }else {
            this.passEditBox.inputFlag = cc.EditBox.InputFlag.PASSWORD
            this.lookNode.getChildByName('hide').active = true
            this.lookNode.getChildByName('show').active = false
        }
    },

});
