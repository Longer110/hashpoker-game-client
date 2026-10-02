// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasConfig = require("TexasConfig");
let TexasSpine = TexasConfig.TEXASSPINE;

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gunFireSpine = this.node.getComponent(sp.Skeleton);
    },

    start () {
        this.actionName = "";
        this._callBack = new Array();

        this.setNodeListener()
    },

    //设置节点监听
    setNodeListener(){
        this.gunFireSpine.setCompleteListener(function(trackEntry) {
            var actionName = trackEntry['animation']['name'];
            var callBack = this._callBack?this._callBack[actionName]:null;
            if (callBack){
               callBack();
               this.actionName = "";
               this._callBack[actionName] = null;
            }
        }.bind(this));
    },

    //播放动画
    //@param aniName:动画名字
    //@param isLoop:是否循环播放
    playAni(aniName,isLoop,callBack){
        let self = this;

        if (aniName==TexasSpine.TEXAS_SPINE_LIAOTOUFA) {
            if (callBack) {
                callBack();
            }

            if (self.actionName!=TexasSpine.TEXAS_SPINE_DAIJI && self.actionName!="") {
                return;
            }
        }

        if (cc.isValid(self) && cc.isValid(self.gunFireSpine)) {
            self.actionName = aniName;
            self.gunFireSpine.clearTrack(0);
            self.gunFireSpine.setAnimation(0,aniName,isLoop);
            if(callBack){
                if (aniName!=TexasSpine.TEXAS_SPINE_LIAOTOUFA) {
                    self._callBack[aniName] = callBack
                }else {
                    self._callBack[aniName] = function () {
                        self.playAni(TexasSpine.TEXAS_SPINE_DAIJI,true);
                    }
                }
            }else {
                self._callBack[aniName] = function () {
                    self.playAni(TexasSpine.TEXAS_SPINE_DAIJI,true);
                }
            }
        }

    },

});
