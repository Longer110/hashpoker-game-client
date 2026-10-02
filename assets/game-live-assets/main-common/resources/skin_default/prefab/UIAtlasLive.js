// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        atlasPokerLarge: cc.SpriteAtlas,
        atlasPokerSmall: cc.SpriteAtlas,
        atlasPokerSmall2: cc.SpriteAtlas,
        atlasUserHead: cc.SpriteAtlas,
        atlasPokerDeZhou: cc.SpriteAtlas,
        atlasPokerDeZhou_default: cc.SpriteAtlas,
        msdfMetarial: cc.Material, //自定义字体材质
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
        let array = this.atlasUserHead.getSpriteFrames();
        if(index>array.length){
            index = index % array.length;
        }
        if(index==0){
            index = 2;
        }
      
        
        let path = index+'';
         //console.log("根据序号获取人物头像 url : " + url);
         //console.log("根据序号获取人物头像 path : " + path);
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
    getPokerDeZhou(index, subgame_name, spAtlas){
        let prefix = "dezhou_";
        if (app.config.SKIN == "default"){
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
        if (spAtlas){
            atlas = spAtlas;
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
    getPokerByDetail(point, flower){
        let index = (point-1)*4+flower;
        if(index<0){
            index = 0;
        }
        return this.getPoker(index);
    },
    //根据点数和花色获取对应图片（小）
    getPokerSmallByDetail(point, flower){
        let index = (point-1)*4+flower;
        if(index<0){
            index = 0;
        }
        return this.getPokerSmall(index);
    },
    //根据点数和花色获取对应图片（德州）
    getPokerDeZhouByDetail(point, flower, atlas){
        let index = (point-1)*4+flower;
        if(index<0){
            index = 0;
        }
        return this.getPokerDeZhou(index, "", atlas);
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
    },

    getMsdfMetarial(){
        return this.msdfMetarial;
    }
});
