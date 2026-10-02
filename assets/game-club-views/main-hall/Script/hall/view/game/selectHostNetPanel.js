
let Base64 = require("base64");
let i18n = require("i18n");
let Utils = require("Utils");
let clubGameConfig = require("clubGameConfig");
const UIListCell = require("UIListCell");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");

cc.Class({
    extends: cc.Component,

    properties: {
        
        cloneItem: {
            default: null,
            type: cc.Node
        },

        cloneClickHandler: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    
    },

    // update (dt) {},
    

    OnClickClose(){
        this.node.destroy();
    },


    updateView: function(hostData, callBack,) {
        var data = hostData.data || [];
        this.selectIndex = hostData.selectIndex;
        this.cloneItem.active = false;
        var parent = this.cloneItem.parent;

        let titleNode = this.node.getChildByName("bg").getChildByName("header").getChildByName("title");
        if (titleNode) titleNode.getComponent(cc.Label).string = hostData.title || "";
        this.selectType = hostData.selectType || 1;//1充值2提现

        for (var i = 0; i < data.length; i++) {
            var clone = parent.getChildByName("item" + i);
            if (!clone) {
                clone = cc.instantiate(this.cloneItem);
                clone.parent = parent;
                clone.name = "item" + i;
            }
            clone.active = true;

            var itemData1 = data[i];
            clone._itemData = itemData1;

            this.setItemInfo(clone, callBack, this.selectIndex == i);
        }
    },


    setItemInfo: function(node, callBack, isSelected) {
        var itemData = node._itemData;
        var textColor = isSelected ? cc.color(255, 255, 255) : cc.color(115, 122, 113);
        var nameNode = node.getChildByName("name");
        if (nameNode) nameNode.getComponent(cc.Label).string = itemData.name || "";
        if (nameNode) nameNode.color = textColor;
        var countNode = node.getChildByName("confirmationsCount");
        if (countNode) {
            if (this.selectType == 1) {
                countNode.getComponent(cc.Label).string = (itemData.nInputCompileTime || 0) + "次区块确认";
            }else if (this.selectType == 2) {
                countNode.getComponent(cc.Label).string = "手续费:" + (itemData.nInputCompileTime || 0);
            }
                
        }
            
        if (countNode) countNode.color = textColor;
        var minCoinNode = node.getChildByName("minCoin");
        let typeStr = this.selectType == 1 ? "最小充币额:" : "最小提币额:";
        if (minCoinNode) minCoinNode.getComponent(cc.Label).string = typeStr + (itemData.minCoin || 0) + " USDT";
        if (minCoinNode) minCoinNode.color = textColor;
        var maintainTipNode = node.getChildByName("maintainTip");
        if (maintainTipNode) maintainTipNode.active = !itemData.open;


        node.off('click');
        node.on('click', function() {
            if (callBack && node._itemData) {
                callBack(node._itemData.count);
                this.OnClickClose()

            }
        }, this);
    }



});
