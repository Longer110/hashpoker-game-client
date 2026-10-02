// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");

let UIFrame = require("UIFrame");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {


    },


    onDisable(){
       
    },

    onDestroy() {
      
    },



    
    onClickHelpItem(event){
        
        let jumpUrl = [
            "https://opalescent-hemisphere-68a.notion.site/KK-Poker-292e69a65cc1818eac57c331434165c9",
            "https://opalescent-hemisphere-68a.notion.site/KK-Poker-292e69a65cc181dbb003f847b1629331",
            "",
            "https://opalescent-hemisphere-68a.notion.site/KK-Poker-292e69a65cc181a3bd76f2542d35615d",
            "",
            "https://opalescent-hemisphere-68a.notion.site/KK-Poker-292e69a65cc1810aac88e4c966e8ced5",
            "",
        ]
        let index = Number(event.target.name.slice(-1)) - 1
        cc.sys.openURL(jumpUrl[index])
    },


    onClickClose(){
        this.node.destroy()
    }
});