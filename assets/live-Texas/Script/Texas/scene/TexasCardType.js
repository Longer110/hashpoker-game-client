let TexasPanelAction = require("TexasPanelAction");
let TexasUtils = require("TexasUtils");
const i18n = require('i18n'); 

cc.Class({
    extends: TexasPanelAction,

    properties: {
        hjths: cc.Label,//皇家同花顺
        ths: cc.Label,//同花顺
        sit: cc.Label,//四条
        hl: cc.Label,//葫芦
        th: cc.Label,//同花
        sz: cc.Label,//顺子
        sant: cc.Label,//三条
        ld: cc.Label,//两对
        yd: cc.Label,//一对
        gp: cc.Label,//高牌
        
        pokerAtlas: {//牌资源
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    onLoad() {
        this.hide();
        this._offsetX = this.panelPosition.x;
    
        this._setCards();

        this.gp.lang = "cardType.1";//高牌
        this.yd.lang = "cardType.2";//一对
        this.ld.lang = "cardType.3";//两对
        this.sant.lang = "cardType.4";//三条
        this.sz.lang = "cardType.5";//顺子
        this.th.lang = "cardType.6";//同花
        this.hl.lang = "cardType.7";//葫芦
        this.sit.lang = "cardType.8";//四条
        this.ths.lang = "cardType.9";//同花顺
        this.hjths.lang = "cardType.10";//皇家同花顺
    },

    onDestroy() {

    },

    //设置牌
    _setCards() {
        let card = [
            [65,77,76,75,74],//皇家同花顺
            [49,50,51,52,53],//同花顺
            [65,33,49,17,18],//四条
            [66,50,18,19,35],//葫芦
            [45,44,43,38,37],//同花
            [42,57,24,71,70],//顺子
            [77,45,29,58,67],//三条
            [28,76,58,42,24],//两对
            [75,59,42,41,72],//一对
            [17,74,57,38,69],//高牌
        ]

        let layout = this.panel.getChildByName("layout");
        for (let i=1; i<=10; i++) {
            let type = layout.getChildByName("type" + i);
            let layoutCard = type.getChildByName("layoutCard");

            for (let j=0; j<card.length; j++) {
                let cardValue = card[j];

                if (i-1==j) {
                    for (let l=1; l<=5; l++) {
                        if (layoutCard.getChildByName("card" + l)) {
                            let cardItem = layoutCard.getChildByName("card" + l);
                            this._setCardSpriteFrame(cardItem,cardValue[l-1]);
                        }
                    }

                    break;
                }
            }
        }
    },

    //设置图片精灵
    _setCardSpriteFrame(node,card) {
        let playBackData = TexasUtils._getClubReback();
        if (playBackData || app.config.IS_PLAYBACK) return;

        let x16 = 0x10;
        let x10 = x16.toString(10);//16进制转10进制

        let point = card%x10;//点数
        let flower = parseInt(card/x10);//花色

        let index = (point-1)*4+flower;
        if(index<0){
            index = 0;
        }

        let prefix = "pokers_";

        let path = "";
        if(index==0){
            path = prefix+"back";
        }
        else{
            let image = App.UIAtlasClub._getCardImage(index);
            path = prefix + image;
        }

        let frame = this.pokerAtlas.getSpriteFrame(path);
        if(null!=frame){
            node.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },

});