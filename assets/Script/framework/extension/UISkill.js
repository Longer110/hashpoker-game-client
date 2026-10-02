// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: 技能控件（可设置技能CD）
// ]]

cc.Class({
    extends: cc.Component,

    properties: {
        graySprite: cc.Sprite,
        block: cc.BlockInputEvents,
        duration: 2,
        activeCD: false,
        reverseCD: false,
        _timeDelta: 0,
        _toggleStart: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.activeCD && null!=this.graySprite && this.graySprite.type != cc.Sprite.Type.FILLED){
            this.graySprite.type = cc.Sprite.Type.FILLED;
            this.graySprite.fillType = cc.Sprite.FillType.RADIAL;
            this.graySprite.fillCenter = new cc.Vec2(0.5, 0.5);
        }
    },

    start () {
        this._toggleCD(false);
    },

    update (dt) {
        if(!this.activeCD || !this._toggleStart) return;

        this._timeDelta += dt;
        if(this._timeDelta>this.duration){
            this._timeDelta = this.duration;
            this._toggleStart = false;
        }
        let range = this._timeDelta/this.duration - 1;
        if(this.reverseCD){
            range *= -1;
        }
        if(null!=this.graySprite){
            this.graySprite.fillRange = range;
        }
        
        if(!this._toggleStart){
            this._toggleCD(false);
        }
    },

    onEnable(){
        // cc.Button、cc.Toggle
        this.node.on('click', this._onClickSkill, this);
    },
    onDisable(){
        this.node.off('click', this._onClickSkill, this);
    },

    _onClickSkill(component){
        // cc.log("click: ", component);

        if(!this.activeCD || this._toggleStart) return;

        this._toggleCD(true);
    },

    _toggleCD(active){
        this._toggleStart = active;
        this._timeDelta = 0;
        
        if(this.block){
            this.block.enabled = active;
        }
        if(this.graySprite){
            if(active){
                this.graySprite.fillRange = this.reverseCD ? -1 : 1;
            }
            else{
                this.graySprite.fillRange = 0;
            }
        }
    },
});
