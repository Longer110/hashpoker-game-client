// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasData = require("TexasData");
let UIBase = require("UIBase");

//聊天框类型
let ChatType = cc.Enum({
    UP: 1,        // 聊天在上
    DOWN: 2,      // 聊天在下
});

cc.Class({
    extends: UIBase,

    statics: {
        ChatType: ChatType,
    },

    properties: {
         //聊天框显示
         showType: {
            default: ChatType.UP,
            type: cc.Enum(ChatType),
        },

        changeNode: cc.Node,

        upPosition: cc.Node,//聊天在上位置
        downPosition: cc.Node,//聊天在下位置
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.init();
    },
    onDestroy(){
        
    },

    start () {
        
    },

    // update (dt) {},

    initChat(){
        // if (app.config.SKIN == "default") {
        //     this.showType = TexasData._getChatType();

        //     let setPosition = this.upPosition;
        //     if (this.showType==2) {
        //         setPosition = this.downPosition;
        //     }

        //     this.changeNode.position = setPosition.position;
        // }
    },
});
