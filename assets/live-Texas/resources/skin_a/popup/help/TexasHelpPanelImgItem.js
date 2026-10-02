// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {          

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init:function(data){
        let self = this;
        
        let url = app.game.getGame().path(data);

        let wrapper = app.game.getGame();
        wrapper.bundle.load(url, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                 //console.error(error);
                return;
            }
            if(spriteFrame){
                let sprite = self.node.getComponent(cc.Sprite)
                if(sprite){
                    sprite.spriteFrame = spriteFrame
                }
            }
        })
    },


});
