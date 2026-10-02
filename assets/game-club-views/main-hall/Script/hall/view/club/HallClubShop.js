let i18n = require("i18n");
let HallClubShopItem = require('HallClubShopItem');
let MsgManager = require("MsgManager");
let CMD = require("protocol_club");
let MSG = require("Msg_club");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        label_balance: cc.Label,
        shop_item: cc.Node,
        content: cc.Node,

        itemIcons: {
            default: [],
            type: cc.SpriteFrame
        },

        itemBgs: {
            default: [],
            type: cc.SpriteFrame
        },

        shopItem: null,
    },

    start() {
        this.shopItem = this.shop_item;
        this.content.destroyAllChildren();
        this.regiester();
        this.getClubShopInfo();
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSStoreCfgRep_ui, this.onGetStoreCfg, this);
    },

    onDestroy() {
        MsgManager.un(this.onGetStoreCfg);
    },

    init(gold) {
        if (gold != undefined && gold > -1) {
            this.label_balance.string = Utils.convertNumberToStr(gold);
        }
    },

    getClubShopInfo() {
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetStoreCfgReq_CMD, {});
    },

    onClickClose() {
        this.node.destroy();
    },

    onGetStoreCfg(data) {
        let arrGoodCfg = data.arrGoodCfg;
        if (arrGoodCfg.length > 0) {
            arrGoodCfg.sort(function(a, b){
                return a.nDisplaySort - b.nDisplaySort;
            })
            this.updateItemList(arrGoodCfg);
        } else {
            //TODO 获取列表失败
        }
    },

    updateItemList(params) {
        let element = null;
        for (let i = 0, len = params.length; i < len; i++) {
            let itemNode = cc.instantiate(this.shopItem);
            itemNode.parent = this.content;
            let itemScript = itemNode.getComponent('HallClubShopItem');
            element = params[i];
            let nGoodId = element['nGoodId'];
            let bgIndex = i % 6; //超过了5条，公用底图
            itemScript.setNGoodId(nGoodId);
            itemScript.setItemInfo(this.itemBgs[bgIndex], this.itemIcons[bgIndex], element['sGoodName'], this.parseGoodsDetail(element['arrGiftBag']), element['nPayCount']);
        }
    },

    parseGoodsDetail(item) {
        if (item.length > 0) {
            let title = i18n.t("CLUB_HALL.PAG_GOODS_TITLE");
            let detail = '' + title;
            for (let i = 0, len = item.length; i < len; i++) {
                let itemId = item[i].nItemId; // 1、普通金币礼包 2、********
                let nCount = item[i].nCount;
                let secStr = '';
                if (itemId == 1) {
                    secStr = i18n.t("CLUB_GAME_GOLD_TYPE." + 1);
                    secStr += Utils.convertNumberToStr(nCount);
                }
                detail += secStr;
            }
            return detail;
        }
        return null;
    }

});