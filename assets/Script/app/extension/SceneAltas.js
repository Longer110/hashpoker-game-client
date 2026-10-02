let MSG_FRAMEWORKS = require("Msg");
let MsgManager = require("MsgManager");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // MsgManager.on(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, this._showDialog, this);
    },

    onDestroy(){
        // MsgManager.un(this._showDialog);
    },

    start () {

    },

    // update (dt) {},

    //显示弹窗
    _showDialog(data) {
        cc.log("_showDialog data:",data);

        let path = "popup/dialog/UIDialog";
        let parent = app.node;
        let gameWrapper = app.game.getGame()
        let wrapper = app.common;
        if(gameWrapper){
            wrapper = gameWrapper
        }
        let bundleName = wrapper?wrapper.bundleName:my.wrapper.COMMON;
        wrapper.ui.loadPopup(path, function (component) {
            parent.addChild(component.node, 1024);
            component.setShowType(data.showType);
            component.show(data.text, function (isOK) {
                if(data.callback){
                    data.callback(isOK);
                }
            });
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)            
        , {
            loader: bundleName
        });
    },
})