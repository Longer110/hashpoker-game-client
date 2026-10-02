// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        atlasPokerLarge: cc.SpriteAtlas,
        atlasPokerSmall: cc.SpriteAtlas,
        atlasPokerSmall2: cc.SpriteAtlas,
        atlasUserHead: cc.SpriteAtlas,
        atlasPokerDeZhou: cc.SpriteAtlas,
        atlasPokerDeZhou_default: cc.SpriteAtlas,
        atlasPokerClub_1: cc.SpriteAtlas,
        atlasPokerClub_2: cc.SpriteAtlas,
        atlasPokerFlower_1: cc.SpriteAtlas,
        atlasPokerFlower_2: cc.SpriteAtlas,
        atlasPokerPoints_1: cc.SpriteAtlas,
        atlasPokerPoints_2: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.zIndex = -256;
    },

    start () {
    },

    // update (dt) {},

    //根据序号获取人物头像
    getUserHead(url, target){
        if(typeof url == 'string'){
            let index = url.lastIndexOf("/");
            if(index>=0){
                url = url.substring(index+1);
            }
        }
        let index = Number(url) || 1;
       
        let path = index+'';
        let spriteFrame = this.atlasUserHead.getSpriteFrame(path);
        if(!spriteFrame){
            QYLogs.error("UIAtlas", "获取头像图片失败", url, path);
        }

        if(cc.isValid(target)){
            target.spriteFrame = spriteFrame;
            target.node.active = true;
        }

        return spriteFrame;
    },

    //根据扑克牌序号(1~52)获取对应图片(大) （index为0表示获取牌背）
    getPoker(index, subgame_name){
        let prefix = "large_";
        let path = "";
        if(index==0){
            path = prefix+"back";
            if(subgame_name){
                path = path + "_" + subgame_name;
            }
        }
        else{
            let image = this._getCardImage(index);
            path = prefix + image;
        }
        let spriteFrame = this.atlasPokerLarge.getSpriteFrame(path);
        if(!spriteFrame){
            QYLogs.error("UIAtlas", "获取图片失败", index, path);
        }
        return spriteFrame;
    },

    //根据扑克牌序号(1~52)获取对应图片(小) （index为0表示获取牌背）
    getPokerSmall(index, subgame_name){
        let prefix = "small_";
        let path = "";
        if(index==0){
            path = prefix+"back";
            if(subgame_name){
                path = path + "_" + subgame_name;
            }
        }
        else{
            let image = this._getCardImage(index);
            path = prefix + image;
        }
        let spriteFrame = this.atlasPokerSmall.getSpriteFrame(path);
        if(!spriteFrame){
            QYLogs.error("UIAtlas", "获取图片失败", index, path);
        }
        return spriteFrame;
    },

    //获得德州扑克牌
    getPokerDeZhou(index, subgame_name){
        let club = app.config.IS_CLUB_ONLY?true:false;

        let pokerSkin = LocalStorage.getItem("CLUB_POKER_SKIN");
        if (!pokerSkin){
            pokerSkin = 1;
        }

        let prefix = "dezhou_";
        if (club) {
            prefix = "pokers_";
        }

        let path = "";
        if(index==0){
            path = prefix+"back";
            if(subgame_name){
                path = path + "_" + subgame_name;
            }
        }
        else{
            let image = this._getCardImage(index);
            path = prefix + image;
        }

        let atlas = app.config.SKIN == "default" || app.config.SKIN == "b" || app.config.SKIN == "c"?this.atlasPokerDeZhou_default:this.atlasPokerDeZhou;

        if (pokerSkin==1) {
            atlas = this.atlasPokerClub_1;
        }else {
            atlas = this.atlasPokerClub_2;
        }
            
        let spriteFrame = atlas.getSpriteFrame(path);
        if(!spriteFrame){
            QYLogs.error("UIAtlas", "获取图片失败", index, path);
        }
        return spriteFrame;
    },

    //根据扑克牌序号(1~52)获取对应图片(小) （index为0表示获取牌背）
    getPokerSmall2(index, subgame_name) {
        let prefix = "small2_";
        let path = "";
        if (index == 0) {
            path = prefix + "back";
			if(subgame_name){
                path = path + "_" + subgame_name;
            }
        }
        else {
            let image = this._getCardImage(index);
            path = prefix + image;
        }
        let spriteFrame = this.atlasPokerSmall2.getSpriteFrame(path);
        if (!spriteFrame) {
            QYLogs.error("UIAtlas", "获取图片失败", index, path);
        }
        return spriteFrame;
    },

    //根据点数和花色获取对应图片（大）
    // getPokerByDetail(point, flower){
    //     let index = (point-1)*4+flower;
    //     if(index<0){
    //         index = 0;
    //     }
    //     return this.getPoker(index);
    // },
    //根据点数和花色获取对应图片（小）
    getPokerSmallByDetail(point, flower){
        let index = (point-1)*4+flower;
        if(index<0){
            index = 0;
        }
        return this.getPokerSmall(index);
    },
    //根据点数和花色获取对应图片（德州）
    getPokerDeZhouByDetail(point, flower){
        let index = (point-1)*4+flower;
        if(index<0){
            index = 0;
        }
        return this.getPokerDeZhou(index);
    },
    //根据花色和点数返回对应花色和点数的图片
    getPokerByDetail(point, flower){
        let pokerSkin = LocalStorage.getItem("CLUB_POKER_SKIN");
        if (!pokerSkin){
            pokerSkin = 1;
        }

        let atlasFlowers = this.atlasPokerFlower_1;
        let atlasPoints = this.atlasPokerPoints_1;
        let pointType = (flower == 2 || flower == 4) ? 1 : 2;
        if (pokerSkin==2){
            atlasFlowers = this.atlasPokerFlower_2;
            atlasPoints = this.atlasPokerPoints_2;
            if(flower == 1){
                atlasPoints = this.atlasPokerPoints_2;
                pointType = 1
            }else if(flower == 2){
                atlasPoints = this.atlasPokerPoints_2;
                pointType = 2
            }else if(flower == 3){
                atlasPoints = this.atlasPokerPoints_1;
                pointType = 2
            } else if(flower == 4){
                atlasPoints = this.atlasPokerPoints_1;
                pointType = 1
            }
        }
        let pointPath = `point_${pointType}_${point}`;

        let flowerPath = `flower_${flower}`;
        //let pointPath = `point_${pokerSkin}_${point}`;
        let flowerSpriteFrame = atlasFlowers.getSpriteFrame(flowerPath);
        let pointSpriteFrame = atlasPoints.getSpriteFrame(pointPath);
        if(!flowerSpriteFrame){
            QYLogs.error("UIAtlas", "获取花色图片失败", flower, flowerPath);
        }
        if(!pointSpriteFrame){
            QYLogs.error("UIAtlas", "获取点数图片失败", point, pointPath);
        }
        return {flower:flowerSpriteFrame, point:pointSpriteFrame};
    },

    //根据点数和花色获取对应图片（小）
    getPokerSmall2ByDetail(point, flower) {
        let index = (point - 1) * 4 + flower;
        if (index < 0) {
            index = 0;
        }
        return this.getPokerSmall2(index);
    },

    //根据扑克牌序号(1~52)获取对应资源图片名
    _getCardImage(index) {
        let color = index%4;//花色
        if(color==0) color = 4;
        let num = (index-color)/4 + 1;//点数
        let card = num + "_" + color;
        return card;
    }
});
