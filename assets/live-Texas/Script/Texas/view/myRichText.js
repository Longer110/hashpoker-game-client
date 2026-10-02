// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.RichText,

    properties: {
       
    },

    _createFontLabel (string) {
        let node = this._super(string);
        node.getComponent(cc.Label).srcBlendFactor = cc.macro.BlendFactor.ONE

        return node
    },

});