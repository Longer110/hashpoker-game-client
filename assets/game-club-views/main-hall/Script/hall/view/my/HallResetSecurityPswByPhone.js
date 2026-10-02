

cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        nodeSend: cc.Node,
        nodeEdit: cc.Node,
        label_phone1: cc.Label,
        label_phone2: cc.Label,

        lineFrame : {
            default: [],
            type: cc.SpriteFrame
        },

        editNode :{
            default: [],
            type: cc.Node
        }
    },

    start () {
        
    },

    onClickSendCode() {

    },

    onClickRestSendCode() {

    },

    onClickSure() {

    },

    onClickEditArea() {

    },

    onClickClose() {
        this.node.destroy();
    },

    onEditTextChanged(text, editbox, customEventData) {
        let str = text;
        let len = str.length;
    },

    onEditDidEnd() {
        let str = this.editBox.string;
        let len = str.length;
    },

});
