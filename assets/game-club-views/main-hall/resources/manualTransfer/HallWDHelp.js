// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let LocalStorage = require("LocalStorage");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        helpSp: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._config = HallClubLogic.getReConfig(LocalStorage.getSysLanguage());
        if (this._config){
            this._loadImg(this._config.url)
        }
    },

    // update (dt) {},

    onClickClose(){
        this.node.destroy();
    },

    _loadImg(url){
        if(!url){
            return;
        }
        cc.assetManager.loadRemote(url, function (error, texture) { 
            if(error) {
                QYLogs.error("HallMyInfo", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(this.helpSp)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    this.helpSp.spriteFrame = spriteFrame;
                }
                
            }
        }.bind(this))
    },
});
