/*
    玩家控制
*/

let TexasUtils = require("TexasUtils");
let UserInfo = require("UserInfo");
let TexasData = require("TexasData");
let Utils = require("Utils");
let TexasMagicFaceController = require("TexasMagicFaceController");
let TexasPlayerController = require("TexasPlayerController");

cc.Class({
    extends: TexasPlayerController,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

    _initPlayerControl(control) {
        this._super(control);
        this.playJs = "omahaPlayerC";
    },

});
