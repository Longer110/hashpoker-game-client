// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let TexasData = require("TexasData");
let UserInfo = require("UserInfo");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        takeinValue : cc.Label,
        // profitValue : cc.Label,
        handValue : cc.Label,
        winValue : cc.Label,
        baoxianNode : cc.Node,
        gameName : cc.Label,
        blindLabel : cc.Label,
        playerHead : cc.Node,

        userName: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(texasScene){
        this.texasScene = texasScene;
    },

    setData(gameData)
    {
        // this.profitValue.string = gameData.nHandProfit
        this.takeinValue.string = gameData.nTakeIn
        this.winValue.string = gameData.tProfit
        this.handValue.string = gameData.nCount
        this.blindLabel.string = gameData.blindStr + ""

        let tableInfo = TexasData._getTableInfo();
        this.gameName.string =  gameData.tableId || "";
        
        let defaultHead = this.playerHead.getChildByName('mask').getChildByName("defaultHead").getComponent(cc.Sprite);

        let info = UserInfo.getInfo();
        
        this.userName.string = info.strName !="" ? info.strName : info.strNickName;
        Utils.changeUserHead(defaultHead, info.strHeadUrl);
    },

    onClickBack()
    {
        if (this.texasScene && this.texasScene._onClickBtnBack)
        {
            this.texasScene._onClickBtnBack();
        }
    },

    onClickHistory()
    {
        this.node.destroy();
        if (this.texasScene && this.texasScene._onClickBtnGameReview)
        {
            this.texasScene._onClickBtnGameReview();
        }
    },

    // update (dt) {},
});
